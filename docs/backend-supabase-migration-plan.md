# Backend → Supabase Migration Plan

Date: 2026-11-11
Status: **Phases 0–2 executed; the app-compatibility port is done and verified on staging.** The database
and data now exist on Supabase in schema `legacy` (156/156 tables, 17,038/17,038 rows, verified), and the
Laravel app boots and serves admin/vendor/API traffic against it. Execution details, connection role and
verification evidence are in `docs/supabase-db-migration.md`. Production is still on MySQL; nothing in
the live app has been pointed at Supabase yet, and media/cutover remain (§5, Phase 5).

---

## 1. Recommendation

**Move the data layer to Supabase, not the application layer.**

| Component | Recommendation |
|---|---|
| Database | MySQL/MariaDB → **Supabase Postgres** ✅ |
| File storage | Local disk (689 MB) → **Supabase Storage** ✅ |
| Realtime | Not live today (`BROADCAST_DRIVER=log`) → **Supabase Realtime** (greenfield, low risk) |
| App/API layer | **Keep Laravel 10 + PHP 8.2**, move it to a container host (Fly.io / Render / Railway) |
| Auth | **Keep Laravel session guards + Passport** in phase 1; Supabase Auth is a later, optional phase |
| Edge Functions | Only for webhooks and small endpoints; **not** a rewrite target |
| RLS | Enable deny-by-default; policies only if/when clients talk to Postgres directly |

**Decision (2026-11-11):** scope confirmed as **DB + Storage (+ hosting move), Laravel auth retained**. Supabase Auth, Realtime, and RLS are documented as later optional phases. Phase 4 is deferred.

### Pre-launch fast path (no live users)

The site is not live and has no users yet, so the usual cutover risk (data loss, maintenance window, rollback under load) does not apply. Recommended path:

1. Create a **Free** Supabase project in **West EU (London) `eu-west-2`** or **West EU (Ireland) `eu-west-1`** - no African region exists; London/Ireland are the closest.
2. Keep the existing data (3.8 MB): the 156 tables include settings/config rows (business settings, modules, zones, roles, translations) that a fresh `migrate` would not recreate. Load the dump rather than starting empty.
3. Co-locate the Laravel app host in the **same region** as the DB (Fly.io / Railway London), so DB round-trips stay intra-region while Ghana→app latency is one ~100 ms hop.
4. Stay on Free until the first real order/payment or any quota reaches 80%; then upgrade to Pro. No maintenance window is needed at any point before launch.

**Supabase does not host PHP.** "Leaving shared hosting" is two moves: data → Supabase, Laravel → a container host. The Next.js frontend stays on Vercel.


A full "everything on Supabase" rewrite (Edge Functions + Supabase Auth for all four roles + RLS) is **not recommended now**. This backend is 687 PHP files, **1,463 route definitions**, **156 tables**, 195+ migrations, 20+ payment-gateway SDKs, a Blade admin/vendor panel, and an escrow/RFQ money flow that has not had its security review. Rewriting that on Edge Functions would take months, change zero user-visible behavior, and put money flows at risk for no functional gain.

**Why move the DB anyway:** it removes the shared-hosting MySQL ceiling, gives managed backups/PITR, a real staging branch, connection pooling, and a storage layer that no longer depends on the PHP disk. That is the durable win.

---

## 2. Current state (verified)

| Fact | Value |
|---|---|
| Framework | Laravel 10, PHP 8.2.35 (live), `composer.json` requires PHP ^8.2 |
| App server | Apache on StackCP, `APP_URL=https://aduanefie.com` |
| Database | MariaDB **10.11.19** at `sdb-61.hosting.stackcp.net`, DB `aduanefiemarketplace-353032377464` |
| Schema | **156 tables**, 11 FKs, 30 `enum` definitions, 1 `polygon` column (`zones.coordinates`) |
| Schema snapshot | 3.8 MB phpMyAdmin dump dated 2026-10-30 |
| Migrations | Live records **223** migrations; workspace `soft/` has 195 files → drift |
| API auth | **Laravel Passport** (`api` guard, `oauth_access_tokens` present) |
| Panel auth | Session guards: `admin`, `vendor`, `vendor_employee`, `customer`, `delivery_men` |
| Storage | Local disk, **689 MB / 2,005 files** under `storage/app` |
| Cache / session / queue | `database` / `file` / `sync` |
| Realtime | `BROADCAST_DRIVER=log` - nothing is actually broadcasting |
| API surface | 1,463 route definitions; trade API exists in `soft/` but is not deployed live |
| Raw-SQL footprint | 57 `DB::raw`, 13 `whereRaw`, 23 `orderByRaw`, 4 `FIELD()`, 690 `LIKE` usages |
| MySQL-only calls | `SET sql_mode=...` in `Admin/DashboardController` and `Admin/CustomerController`; MySQL dump loaded by the installer |
| Money flow | `TradeFinanceController` escrow: wallet debit/credit + escrow fields. **No DB transaction or row lock** around the check-then-write (pre-existing risk, documented, out of scope here) |

---

## 3. Target architecture

```
Next.js storefront  ──┐
Blade admin/vendor  ──┼──►  Laravel 10 API + panel  ──►  Supabase Postgres (pooled)
                      │        (container host)     ──►  Supabase Storage (S3 API)
                      │                              ──►  Supabase Realtime (phase 5)
                      └──►  Supabase Auth (phase 4, optional)
```

- Laravel keeps routes, validation, business logic, payments, exports, and the panel UI.
- Postgres replaces MariaDB behind the same Eloquent models.
- Supabase Storage replaces `storage/app`; Laravel's S3 driver talks to it directly.
- The `api.aduanefie.com` / `admin.aduanefie.com` hostnames keep working; only the origin changes.
- Staging becomes a **Supabase branch database** plus a staging app instance, so schema changes are rehearsed before production.

---

## 4. Phase plan

Estimates assume one senior Laravel/DevOps engineer and a staging environment. They are planning estimates, not commitments.

### Phase 0 - Baseline and guardrails (2–3 days)

- [ ] Full logical backup of live DB and a file snapshot of `storage/app`; store off-host, encrypted.
- [ ] Capture the live schema (`SHOW CREATE TABLE` for all 156 tables) and `SHOW VARIABLES` (`sql_mode`, charset, collation, time zone).
- [ ] Verify the **PHP host can reach Supabase Postgres outbound on 5432/6543**. Shared hosting often blocks this. If blocked, hosting migration (Phase 3) must happen first.
- [ ] Confirm the live code version: the 223 recorded migrations vs 195 local files means the workspace copy is not the deployed build. Pull the deployed release before touching anything.
- [ ] Freeze non-essential schema changes; open a change log for everything that ships during migration.
- [ ] Establish the money-flow rule: trade/RFQ/escrow code is **read-only** for the duration; no migration refactor touches it until the security review closes.

**Exit:** backups restore cleanly into a local MariaDB 10.11; outbound Postgres connectivity confirmed or hosting plan chosen.

### Phase 1 - Supabase project and Postgres schema (1–2 weeks)

- [ ] Create `aduanefie-production` and `aduanefie-staging` Supabase projects in the EU region (Ghana latency).
- [ ] Generate Postgres DDL from the **live** schema, not from `soft/database/migrations`.
- [ ] Convert and review the incompatibilities in section 5.
- [ ] Decide how `migrations` is baselined: apply the generated schema, then insert the live 223 migration rows and mark the baseline as applied. Never run `migrate:fresh` against production.
- [ ] Install extensions: `pgcrypto` (UUIDs), `postgis` (zone polygons), `citext` (case-insensitive email), `pg_trgm` (search).
- [ ] Create least-privilege roles: `aduanefie_app` (DML), `aduanefie_readonly` (reporting), `postgres` (migrations only). Laravel never uses the `postgres` superuser.
- [ ] Enable RLS on every table with **no policies** (deny-all) so the anon key cannot read anything. Laravel uses a server-side role/service connection.

**Exit:** `php artisan migrate:status` reports a clean baseline; Eloquent smoke tests (read/write on a scratch branch) pass; `EXPLAIN` on the top 20 queries shows no sequential scans over large tables.

### Phase 2 - Data migration and dress rehearsal (1 week)

- [ ] Restore the dump into a local MariaDB 10.11 matching live `sql_mode`, charset, and time zone.
- [ ] Load into Supabase with `pgloader` (cast rules for enums, unsigned ints, zero dates, booleans) or a scripted ETL.
- [ ] Create FKs **after** the load, so orphan rows don't abort it. Reconcile any orphans.
- [ ] Reconcile row counts per table and checksum a sample of high-value tables (orders, order_details, users, stores, items, wallets).
- [ ] Fix sequences/identity values after load so new inserts don't collide.
- [ ] Rebuild case-insensitive unique indexes (`lower(email)`) to preserve MariaDB's `utf8mb4_unicode_ci` behavior.
- [ ] Rehearse the full cutover on staging: restore → load → point a staging app at it → run the verification checklist (section 10).

**Exit:** staging runs the complete app against Supabase Postgres with no functional regressions; rollback to MariaDB rehearsed once.

### Phase 3 - Hosting move (1 week, can run parallel with Phase 2)

Required because shared hosting generally can't hold durable queue workers and may block outbound 5432.

- [ ] Containerize the deployed Laravel build (PHP 8.2 FPM + Nginx), no code rewrite.
- [ ] Host: Fly.io, Render, or Railway (choose by region and cost). Keep `api.` and `admin.` DNS pointed at the new origin.
- [ ] Move `SESSION_DRIVER` to `redis` (or database) and `CACHE_DRIVER` to `redis`; file sessions don't survive multiple instances.
- [ ] Introduce a real queue only if needed; if so, run `queue:work` as a process with the **session pooler/direct** connection.
- [ ] Add the security headers the panel currently lacks: HSTS, `X-Frame-Options`/`frame-ancestors`, CSP, `Referrer-Policy`, `SameSite=Lax`.
- [ ] Configure `php artisan config:cache` / `route:cache` in the deploy pipeline.

**Exit:** staging app on the new host serves the four login pages, CSRF, and the API with the same responses as today.

### Phase 4 - Auth strategy (optional, 2–3 weeks)

Pick one:

| Option | What changes | Effort | When to choose |
|---|---|---|---|
| **A. Keep Laravel auth** (recommended) | Nothing. Session guards + Passport stay. | 0 | Default. Lowest risk. |
| **B. Hybrid** | Supabase Auth for customers; Laravel validates Supabase JWTs; admin/vendor keep sessions. | 2–3 weeks | You want social login, MFA, phone OTP for shoppers without building it. |
| **C. Full Supabase Auth** | All four roles migrate; Blade session panel must move to token/JWT. | 6+ weeks | Only if the panel is being rewritten anyway. |

If B is chosen later: migrate `users` with a password-rehash-on-next-login strategy (bcrypt is importable into Supabase Auth, but verify), keep the `users.id` mapping table, and dual-run both token types during cutover.

### Phase 5 - Storage migration (3–5 days)

- [ ] Create buckets matching current folders (`business`, `product`, `store`, `profile`, etc.) and access policies.
- [ ] Copy the 2,005 files (689 MB) with a checksummed sync; preserve paths exactly.
- [ ] Point Laravel's `s3` disk at the Supabase Storage S3 endpoint; `league/flysystem-aws-s3-v3` is already installed.
- [ ] Centralize URL building. `Helpers::get_full_url()` currently builds disk URLs in several places; make it the only source of the storage base URL.
- [ ] Dual-read during cutover: new uploads go to Supabase, old paths fall back to the local disk until the copy is confirmed.
- [ ] Keep the local copy read-only for 30 days after cutover.

**Exit:** every stored image/file path in the DB resolves through Supabase; upload, replace, delete, and export all work.

### Phase 6 - Realtime (1 week, greenfield)

Nothing is broadcasting today, so this is additive.

- [ ] Enable Supabase Realtime on the tables that need live updates (orders, order status, chat/notifications).
- [ ] Publish changes via Postgres triggers or Laravel broadcast; keep `BROADCAST_DRIVER=log` as the fallback until the client is verified.
- [ ] Add RLS policies for Realtime channels; authorize by user/store id, not by client-supplied ids.

### Phase 7 - Decommission MariaDB (after 30 days of stability)

- [ ] Keep StackCP MySQL read-only for 30 days as the rollback target.
- [ ] Remove MySQL-specific code: `SET sql_mode` statements, the MySQL installer dump, any `replace into`/`on duplicate key` remnants.
- [ ] Cancel the StackCP database only after two clean billing cycles and a verified restore from Supabase backups.

---

## 5. Schema and code incompatibilities (found, with fixes)

| # | MariaDB behavior | Postgres impact | Fix |
|---|---|---|---|
| 1 | `utf8mb4_unicode_ci` unique indexes (case-insensitive) | PG is case-sensitive → duplicate emails/phones can be inserted | **Done:** all 606 string columns are `citext` |
| 2 | 690 `LIKE` queries rely on case-insensitive collation | PG `LIKE` is case-sensitive → empty search results | **Done:** `citext` + `App\Database\PostgresGrammar` (`::text::citext`). `ILIKE` was rejected - ~1,772 call sites, and Laravel 10.48 compiles LIKE as `::text`, which defeats `citext` on its own |
| 3 | `SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))` in 2 admin controllers | Statement errors on PG | **Done:** guarded by `driverName() === 'mysql'` |
| 4 | `polygon` column `zones.coordinates` + `ST_Area/AsText/Centroid` (11 uses) | No native polygon type | **Done:** PostGIS `geometry(Polygon,4326)`; spatial package upgraded 3.2.2 → 4.8.0 (native EWKB) |
| 5 | 30 `enum(...)` columns | PG has no inline enum in `CREATE TABLE` | Handled by the `pgloader` load (enum → `citext`, e.g. `orders.order_status`) |
| 6 | `DATE_FORMAT` (8 uses) | Not a PG function | **Done:** `EXTRACT(YEAR FROM …) AS "year"` on pgsql |
| 7 | `IFNULL` (2 uses) | Not a PG function | **Done:** `COALESCE()` |
| 8 | `JSON_EXTRACT` / `JSON_UNQUOTE` | Different syntax | **Done:** `(data::text::json->>0)` on pgsql |
| 9 | `FIELD()` (4 uses) | Not a PG function | **Done:** `COALESCE(name = ?, false) DESC` |
| 10 | `tinyint(1)` booleans compared as `= 1` in raw SQL | PG `boolean` rejects int comparison | Loaded as `smallint`, so comparisons work; no code change needed |
| 11 | Zero dates `0000-00-00` possible | PG rejects them | Converted to `NULL` during load |
| 12 | `AUTO_INCREMENT`, unsigned ints, `ON UPDATE CURRENT_TIMESTAMP` | Different semantics | Handled by `pgloader`; sequences reset to `max(id)` |
| 13 | Installer loads a MySQL dump (`installation/database.sql`) | Installer breaks on PG | Not touched - the installer stays dev/MySQL-only for now |
| 14 | 12 `upsert`/`insertOrIgnore` calls | Fine in Laravel, but raw `ON DUPLICATE KEY` would break | None found in code; keep it that way |
| 15 | 57 `DB::raw` / 13 `whereRaw` / 23 `orderByRaw` | Each is a manual review | **Done:** every MySQL-only construct now has a driver-aware branch; a repeat scan of `app/` + `Modules/` finds no unguarded `IF(`, `DATE_FORMAT`, `IFNULL`, `FIELD(`, `JSON_EXTRACT`, `AS UNSIGNED`, `SUBSTRING_INDEX`, `GROUP_CONCAT`, `FIND_IN_SET` or backticked raw SQL |

**Do not trust `soft/database/migrations` as the schema source.** Live records 223 migrations and the workspace has 195 files, so the deployed build differs from the local copy. Diff the live `SHOW CREATE TABLE` output against the migrations before generating DDL.

---

## 6. Connection and pooling notes

- Use Supabase's **transaction pooler (port 6543)** for the web app; it does not support prepared statements, so set `PDO::ATTR_EMULATE_PREPARES => true` (or use the session pooler on 5432).
- Use the **direct/session connection (5432)** for `queue:work`, migrations, and anything holding a session-level lock or advisory lock.
- Supabase's pooler has a connection cap by plan; size PHP-FPM workers × 1 connection and leave headroom for the pooler.
- Set `search_path` explicitly; don't rely on the `public` default if you create per-module schemas.
- Time zone: set the app and connection to UTC; the dump was taken at `+00:00`.

---

## 7. Cutover plan

| When | Step |
|---|---|
| T-14 days | Schema freeze; final rehearsal on staging; rollback rehearsed |
| T-7 days | Media sync #1; storage dual-read enabled; monitoring in place |
| T-1 day | Full backup; announce maintenance window; freeze writes |
| T-0 | Final delta sync (DB + media) → switch `DB_*` and `FILESYSTEM_*` env → `config:cache` → smoke tests |
| T+0 | If any smoke test fails: revert env to MariaDB/local disk, `config:cache`, reopen. Target rollback < 15 minutes. |
| T+1 to T+30 | Keep MariaDB read-only and media local copy; reconcile any missed writes; watch error rates and slow queries |

**Rollback rule:** the cutover is only "done" when the smoke checklist passes end-to-end. A partial pass rolls back.

---

## 8. Verification checklist (post-cutover)

- [ ] Four login pages render; CSRF and captcha still reject bad input.
- [ ] Admin login → admin dashboard; vendor login → `/vendor-panel`; employee logins land on their role's landing.
- [ ] Role restrictions still hold (super-admin-only vs `role_id` 2–6).
- [ ] Vendor registration (`/vendor/apply`) completes.
- [ ] Item/category/store CRUD; image upload and display through Supabase Storage.
- [ ] Search returns the same results as MariaDB (case-insensitivity check).
- [ ] Order create → status update → refund path (in a sandbox).
- [ ] Passport token issue + authenticated API call.
- [ ] Exports (Excel/PDF) still generate.
- [ ] Zone polygon reads work (PostGIS).
- [ ] Admin dashboard aggregate queries no longer rely on `sql_mode` leniency.
- [ ] Error logs show no `SQLSTATE` errors in the first hour.
- [ ] Point-in-time restore tested on the staging project.

**Money flows:** trade/RFQ/escrow endpoints stay out of the cutover test until their security review is closed. Before enabling them, wrap the escrow deposit/release/refund in a single transaction with `SELECT ... FOR UPDATE`; the current code reads the balance, writes a wallet transaction, then updates the balance with no lock.

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Shared host blocks outbound Postgres | Medium | Blocks hybrid approach | Phase 0 connectivity test; fall back to hosting move first |
| Case-insensitive behavior silently changes | High | Duplicate accounts, empty search | `citext`/`lower()` indexes + search tests |
| Stricter `GROUP BY` breaks admin reports | High | Admin dashboards error | Remove `sql_mode` hack; fix queries; per-report tests |
| Live code ≠ workspace code (223 vs 195 migrations) | Certain | Migration built on wrong schema | Pull deployed build; use live DDL as source of truth |
| Data loss during cutover | Low | Severe | Final delta sync + 30-day MariaDB rollback + PITR |
| Storage URLs break | Medium | Broken images site-wide | Path-preserving copy, dual-read, centralized URL helper |
| Passport tokens invalidated by move | Low | API users logged out | Keep same `oauth_*` tables/app keys; test token validation |
| Cost creep | Low | Budget | Start on Pro; measure DB/storage/egress before scaling |

---

## 10. Free tier vs Pro (verified against supabase.com/pricing, 2026-11-11)

**Verdict: use Free now for the staging pilot; do not run production on Free.**

| Limit | Free | Pro ($25/mo) | Fit for Aduanefie |
|---|---|---|---|
| Database | 500 MB | 8 GB | 3.8 MB dump today - fine for staging; production fits for a long time |
| File storage | **1 GB** | 100 GB | **689 MB already used** → only ~311 MB headroom. Free does not fit production media |
| Egress | **5 GB/mo** (+5 GB cached) | 250 GB (+250 GB cached) | A marketplace serving product images will exceed 5 GB quickly |
| Backups | **None** | Daily, 7-day retention | No backups on Free is disqualifying for orders/wallets |
| PITR | Not available | $100/mo add-on | Optional |
| Inactivity | **Paused after 1 week** | Never paused | A quiet production week could take the site offline |
| Projects | 2 active | Unlimited (paid compute each) | Enough for staging + prod |
| Max upload | 50 MB | 500 GB | Fine for images |

Notes:
- Supabase Pro includes $10/mo compute credit, which covers one Micro instance. A single production project is **$25/mo** before overages; spend caps are on by default.
- Free projects pause after 7 days without API activity. Staging will pause; that is acceptable (unpause when needed), but it is not acceptable for production.
- Media is the weak point of Free: 689 MB used of 1 GB. If media grows before cutover, either go Pro or keep media off Supabase. **Cloudflare R2** (10 GB free, no egress fees, S3-compatible) is a cheaper alternative for the `s3` disk than Supabase Storage; Laravel already ships the S3 driver.

**Recommended spend path:** $0 now (Free staging project) → $25/mo only at production cutover. Total run cost after cutover: ~$32–60/mo including the app host.


---

## 11. Explicit non-goals

- No rewrite of the admin/vendor Blade panel.
- No change to the storefront or its API contracts.
- No change to payment-gateway integrations beyond connection-level testing.
- No trade/RFQ/escrow refactor until the security review closes.
- No DNS/apex change as part of this plan (tracked separately).

---

## 12. Decisions needed before Phase 1

1. **Auth:** keep Laravel auth (A), or plan the Supabase Auth hybrid (B)?
2. **Hosting:** move Laravel to a container host now, or first test whether StackCP can reach Supabase?
3. **Region:** EU (closest to Ghana) vs another region - confirm latency target.
4. **Maintenance window:** how many hours of write-freeze are acceptable for the cutover?
5. **Money flows:** who signs off before trade/escrow endpoints are enabled on the new stack?
