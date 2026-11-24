# Supabase data migration - executed and verified

Date: 2026-11-11
Status: **database + data loaded on Supabase and verified row-for-row. Laravel runs against it on staging;
not deployed. Media and cutover remain.**
Related: `docs/backend-supabase-migration-plan.md`, `docs/admin-access-verification.md`

---

## 1. What exists on Supabase now

| Item | Value |
|---|---|
| Project | `rqmcqmdfmnwhjjuyfmam` (eu-west-1 / Ireland) |
| Postgres | 17.11 |
| Schema with the Laravel data | **`legacy`** |
| Tables in `legacy` | **156 / 156** |
| Rows in `legacy` | **17,038 / 17,038** (matches the live MySQL snapshot exactly) |
| Indexes | 215 |
| Foreign keys | 11 (all `module_id → modules.id`) |
| Sequences | 147, all reset to `max(id)` |
| Extensions | `postgis` 3.3, `citext`, `pg_trgm` - all in the `extensions` schema |
| Database size | 35 MB (of the 500 MB Free-tier limit) |
| `public` schema | **untouched** - the pre-existing 72 test tables and 83 RLS policies are still there |

The live MySQL data was taken from `aduanefiemarketplace-353032377464.sql` (2026-10-30 snapshot), because
`sdb-61.hosting.stackcp.net` does not resolve from this workstation.

## 2. How the load was done

1. Loaded the SQL dump into a local MariaDB 10.11 container (156 tables, 23 admins, 139 zones, 444 items).
2. Rehearsed the full `pgloader` run into a local PostGIS container until it was exact.
3. Ran the same `pgloader` config against the Supabase session pooler
   (`aws-0-eu-west-1.pooler.supabase.com:5432`), creating schema `aduanefie`.
4. Fixed the two tables `pgloader` cannot convert, then renamed `aduanefie` → `legacy`.

`pgloader` cast rules used:

```
tinyint/smallint → smallint, mediumint → integer, int → integer, bigint → bigint
enum → text
datetime/timestamp → timestamptz, date → date   (zeros → null)
```

Three corrections were required (all scripted, not manual edits):

| Table | Problem | Fix |
|---|---|---|
| `zones` | MySQL `polygon` has no PostGIS equivalent on load | column replaced with `geometry(Polygon,4326)`, 139 rows loaded via `ST_GeomFromText(...,4326)` |
| `contacts` | 728 rows contained invalid UTF-8 (mixed cp1252) | decoded with cp1252 fallback, 728/728 rows loaded |
| foreign keys | the pooler run was cut off after the index step | all 11 `module_id` FKs added and validated afterwards |

A temporary `adf_import` role was used because `pgloader`'s DSN parser cannot express the project
password (`@` and `!`). Its objects were reassigned to `postgres` and the role was dropped.

## 3. How the app will connect

A dedicated role exists so the app never uses the `postgres` superuser-ish role:

```
host      aws-0-eu-west-1.pooler.supabase.com
port      5432                (session pooler; 6543 is the transaction pooler)
database  postgres
username  aduanefie_app.rqmcqmdfmnwhjjuyfmam
password  in soft/.env.supabase (chmod 600) - not written into this doc
```

Role settings:

```
ALTER ROLE aduanefie_app SET search_path = legacy, public, extensions;
GRANT USAGE ON SCHEMA legacy, extensions
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA legacy
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA legacy
+ matching default privileges for future objects
```

Verified as this role: read, insert, update, delete, `nextval()`, and PostGIS functions all work.

### Two pooler/schema traps found

1. **Supavisor ignores startup `options`.** `options=-csearch_path=legacy` has no effect through the
   pooler (confirmed: `show search_path` stayed `"$user", public, extensions`). The schema is therefore
   set **on the role**, and Laravel must also set it after connecting.
2. **Missing `USAGE` on `extensions` silently breaks `citext` and PostGIS.** Before the grant,
   `email = 'UPPER@CASE'` returned 0 rows and fell back to case-sensitive `text` comparison instead of
   erroring. PostGIS functions likewise failed to resolve. Any role that touches `legacy` needs
   `GRANT USAGE ON SCHEMA extensions`.

Laravel's `PostgresConnector` runs `SET search_path TO ...` as a statement after connecting (it does not
use startup options), so it works through the pooler. `soft/config/database.php` must therefore get
`'schema' => 'legacy,public,extensions'` - **not** `'public'` and not `'legacy'` alone, or unqualified
PostGIS function calls will fail.

## 4. Behaviour changes that affect the app

### 4.1 Email lookups - fixed

MySQL compared strings case-insensitively; Postgres does not. 11 users, 3 admins and 3 stores had
mixed-case emails, so `where('email', ...)` would have locked them (and any future user typing
`John@x.com` vs `john@x.com`) out of login, password reset, and social auth.

All 12 `email` columns were converted to `citext`. Verified end-to-end with real `pdo_pgsql`:

```
select count(*) from admins where email = 'SELINAMFUDZI@GMAIL.COM'   → 1
same query with a bound parameter (PDO::PARAM_STR)                    → 1
```

No duplicate addresses exist under `lower(email)` in any table that has a unique index, so the existing
unique constraints remain valid.

### 4.2 `LIKE` searches - fixed (option A: `citext` **plus** a grammar override)

MySQL `LIKE` was case-insensitive; Postgres `LIKE` is case-sensitive. Measured on real data with
`name LIKE '%A%'`:

| Table | Case-sensitive (raw PG) | MySQL behaviour | Rows lost |
|---|---|---|---|
| `items` | 65 | **315** | 250 (79%) |
| `stores` | 16 | **77** | 61 (79%) |
| `zones` | 118 | **131** | 13 |

Chosen fix: **A - convert every string column to `citext`** (no code changes). This matches the source
DB, which used a case-insensitive collation for every string column. Editing ~1,772 `LIKE` call sites was
rejected: high review cost and easy to miss one silently.

Result on `legacy`: all 12 `email` columns plus all 595 remaining string columns are `citext`
(606 total), and `extensions` is in `search_path` with `USAGE` (the `aduanefie_app` role carries
`search_path = legacy, public, extensions`).

**`citext` alone was not enough.** Laravel 10.48's `PostgresGrammar::whereBasic()` compiles every
`LIKE`/`ILIKE` as `"column"::text like ?` so that LIKE also works on non-text columns. That `::text`
cast throws `citext` away, so `where('name','like',...)` stayed case-sensitive even after the column
conversion - the exact silent-fewer-rows failure 4.2 was meant to remove. Verified directly:

```
DB::table('zones')->where('name','like','%A%')->toSql()
→ select * from "zones" where "name"::text like ?      // case-sensitive, 118 rows
```

Fix: `app/Database/PostgresGrammar.php` compiles the same clauses as
`"column"::text::citext like ?` - `text` keeps the any-column-type behaviour, `citext` restores the
case-insensitive match. It is installed by `app/Database/PostgresConnection.php` via
`Connection::resolverFor('pgsql', ...)` in `AppServiceProvider::register()`, so every pgsql connection
picks it up lazily. **MySQL is untouched**: it keeps `Illuminate\Database\Query\Grammars\MySqlGrammar`
and its SQL is byte-identical to production.

After the fix, through Eloquent on pgsql and MySQL respectively:

| Query | pgsql | MySQL |
|---|---|---|
| `zones.name LIKE '%A%'` / `'%a%'` | 131 / 131 | 131 / 131 |
| `items.name LIKE '%A%'` / `'%a%'` | 315 / 315 | 315 / 315 |
| `stores.name LIKE '%A%'` | 77 | 77 |
| `zones.name NOT LIKE '%a%'` | 8 | 8 |
| `orders.id LIKE '%1%'` (non-text column) | 46 | 46 |

Same on Supabase staging (131/131, 315/315, 77). API payload parity for `?name=a` is exact:
`/api/v1/stores/search?name=a` returns 15 stores on both drivers.

These columns are now text-affinity, so raw SQL that did numeric/spatial work on
`stores.latitude/longitude` needs explicit casts (done - see 4.3).

### 4.3 MySQL-only SQL - fixed (driver-aware branches)

Production stays on MySQL until the port is proven, so nothing was rewritten into Postgres-only SQL.
Each site keeps the original MySQL expression byte-identical and adds a `pgsql` branch, selected by
`DB::connection()->getDriverName()`.

| Construct | Where | Fix |
|---|---|---|
| `SET sql_mode` | `Admin\DashboardController`, `Admin\CustomerController` | wrapped in `if (driver === 'mysql')` |
| `DATE_FORMAT(x,'%Y') as year` | `Admin\ReportController` (5 selects, 3 group by) | `EXTRACT(YEAR FROM x) AS "year"`, `groupByRaw(...)` |
| `sum(...) ... IF(payment_method=...)` | `Admin\ReportController` (3 sites) | `SUM(...)`, `CASE WHEN ... END` |
| `having('orders_count')` | `Admin\ReportController` (2 sites) | `whereHas('orders', <same closure>)` |
| `FIELD(name, ...)` | item/vendor ordering | `COALESCE(name = ?, false) DESC` |
| `IF(...) ... as open`, `ST_Distance_Sphere` | `Store::scopeWithOpen*`, `Api\V1\OrderController` | `Store::openSqlExpression()`, `distanceSqlExpression()` |
| `SUBSTRING_INDEX(...) AS UNSIGNED` (delivery time) | `Store` | `SPLIT_PART` + `~ '^[0-9]+$'` on pgsql |
| `IF((categories.position = "0"), ...)` | `Api\V1\StoreController`, `Api\V1\ItemController` | `CASE WHEN ... END` (also fixes `"0"` being an identifier in PG) |
| `SUM(IF(transaction_type=...))` | `Admin\CustomerWalletController` | `SUM(CASE WHEN ... END)` |
| `CAST(categories.id AS UNSIGNED)` | `CentralLogics\store.php` (3), `CentralLogics\category.php` (2) | dropped cast **and** qualified the group by (`categories.id`), because `GROUP BY id` is ambiguous in PG |
| backticked `` `coordinates` `` | `Admin\ZoneController`, `Repositories\ZoneRepository` | backticks removed |
| `JSON_UNQUOTE(JSON_EXTRACT(data,'$[0]'))` | `UpdateController` | `(data::text::json->>0)` on pgsql (`data` is `citext`, hence `::text` first) |
| `POINT_SRID` hard-coded `0` | `app/Library/Constants.php` | moved to `AppServiceProvider::register()`, `pgsql → 4326`, MySQL → `0`. It cannot stay in an autoloaded constants file: composer includes that before `.env` loads. |
| `LIKE` compiled as `::text` | `PostgresGrammar` | `app/Database/PostgresGrammar.php` compiles `::text::citext`, installed by `app/Database/PostgresConnection.php`; MySQL grammar untouched (see 4.2) |

Spatial support: `matanyadaev/laravel-eloquent-spatial` went **3.2.2 → 4.8.0**, which parses PostGIS hex
EWKB as well as MySQL's 4-byte-SRID WKB, instead of hand-patching vendor. `nunomaduro/collision` had to
join the update (lock was stale at v6.4.0 while root required `^7.0`) and was then moved back to
`require-dev`.

#### Verification evidence

- Spatial containment matches raw SQL on both drivers: zone 1 centroid → Eloquent `[1,4,93]` = raw SQL
  `[1,4,93]` on pgsql; `[1,5,93]` = raw SQL `[1,5,93]` on MySQL. (Point is **lat-first**:
  `new Point($lat, $lng, POINT_SRID)`.)
- `Store::withOpen()` / `withOpenWithDeliveryTime()` return `open=1`, a `distance`, and
  `min_delivery_time=45` for a "45-60 min" store on both drivers.
- New report SQL executed directly in MariaDB 10.11: `CASE WHEN` payment grouping and
  `EXTRACT(YEAR FROM schedule_at)` return the same rows/values as the originals.
- 58-route admin/vendor suite: **52 pass / 6 fail on pgsql**, and **52 pass / 6 fail on MySQL with the
  identical failure set** (the 6 are pre-existing code/view drift, listed in 4.4).
- 17-route mobile API suite: **17/17 on both drivers**.
- On Supabase staging (`soft/.env.staging`): `/admin`, `/vendor-panel`, store list, item list, POS,
  the four reports, transactions, customer wallet report, and
  `/api/v1/stores/{latest,popular,details/1}`, `/api/v1/categories/items/list` all return 200.
- Supabase staging latency is real (280 ms per round trip, and several pages run 60–240 queries):
  `/admin` 114 s, `/admin/item/list` 180 s, `/api/v1/stores/search?name=a` 143 s. This is an N+1/latency
  problem, not a correctness one, and is the main reason to colocate the app with the DB in eu-west-1 and
  to cache/denormalise the worst pages before launch.

### 4.4 Known failures that were **not** caused by the port

These 6 routes failed identically on MySQL and Postgres, so they were pre-existing code/view drift, not
Postgres regressions. **Fixed on MySQL in `82edbae`** - see `docs/six-failing-routes-fix.md` for the
cause, the change and the 18-check HTTP verification. The table is kept as the original finding.

| Route | Failure (before the fix) |
|---|---|
| `/admin/report/order` | `View [admin-views.report.order-index] not found` |
| `/admin/report/earning` | view `earning_index` missing |
| `/admin/report/stock-report` | view `stock_report` missing |
| `/admin/category/add` | `CategoryService::getViewByPosition(): Argument #1 ($position) must be of type int, null given` |
| `/vendor-panel/subscription/subscriber-list` | view `subscriberList` missing |
| `/vendor-panel/trade-requests/received` | relation `trade_requests` does not exist (table absent from the MySQL snapshot too) |

## 5. Known data issues

- `zones.id = 134` (**Ahafo Region**) has a self-intersecting polygon. 138 / 139 zones are valid.
  PostGIS now raises a notice and may error on `ST_Contains`/`ST_Intersects` against this zone.
  Candidate fix: `ST_MakeValid(coordinates)` for that row, or leave it if Ahafo is not used for
  delivery-boundary checks.
- `contacts` contains 91 duplicate email addresses (case-insensitive). Harmless - no unique index there.
- `users.email` has **no unique index** on MySQL either, so duplicate signups were already possible.
  Not introduced by the migration; worth fixing separately.

## 6. Not migrated / not done

- **Media (689 MB, 2,005 files)** is still on the old host. Free-tier storage is 1 GB, so it will not fit
  with headroom. Cloudflare R2 (10 GB free, no egress) remains the recommended target for the `s3` disk.
  Blocked: the Supabase secret key / S3 credentials and the R2 bucket keys have not been provided.
- **No backups on Free.** The data is disposable until launch; upgrade to Pro before the first real
  order or wallet transaction.
- **Code is only verified, not deployed.** `soft/.env` is still `sqlite`; the live server still uses
  MySQL. Staging is selected per-run with `ENVFILE=.env.staging`.
- **The 6 failing routes in 4.4 are still broken** - identically on MySQL, so they are code/view drift in
  the current snapshot, not a migration defect. They need their own fix pass.
- **All changes are uncommitted working-tree edits.** The workspace root is not a git repository, so
  there is no diff to review or roll back with git.

## 7. Next steps (in order)

1. ~~Point a staging copy of the Laravel app at Supabase and run the admin/vendor/API suites.~~
   Done - see 4.3/4.4.
2. ~~Decide and apply the `LIKE`/`citext` option (4.2).~~ Done - `citext` + `PostgresGrammar` override.
3. ~~Replace MySQL-only SQL (4.3).~~ Done.
4. Move media to Cloudflare R2 (needs the R2 credentials), then re-test image upload/display on staging.
5. Deploy Laravel to a container host in eu-west-1 (same region as the DB) and switch DNS.
6. Upgrade Supabase to Pro at launch.
7. Separately, decide whether to fix the 6 pre-existing failing routes (4.4) before or after cutover.
