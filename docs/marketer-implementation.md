# Marketer commission ledger and partner portal

Commit: `2a043e7` (`Add marketer commission ledger and partner portal`), on top of
`c1a3bed`.

Written from the committed diff (`git show --stat`), not from the plan. The
admin-side approval screens are **not** in this commit — see "Not built yet".

## The rules this encodes

| Question | Decision |
|---|---|
| How is a marketer credited? | The store is owned by a marketer (`stores.marketer_id`). Every delivered order from that store credits that marketer. |
| Commission on what? | A share of `order_transactions.admin_commission`, never of gross order value. A payout can never exceed what the platform earned. |
| Which stores? | Only `store_business_model = 'commission'`. Subscription and unsubscribed stores earned the platform a fee instead of per-order commission, so there is nothing to share. |
| Customer signups? | No. Stores only, so there is one attribution rule. |
| When is it payable? | 14 days after delivery (`config('marketer.holding_days')`). |
| Who pays? | An admin, manually, by mobile money. The marketer can request; no code path in the portal moves money. |

Default share is 20% (`config('marketer.default_rate')`), overridable per
marketer via `admins.marketer_commission_rate`.

## Schema

`2026_11_11_000002_add_marketer_attribution`

- `stores.marketer_id` — nullable, indexed. Nullable because almost every store
  has no marketer and attribution is assigned after the store exists.
- `admins.marketer_commission_rate` — `decimal(6,3)`, nullable. Null means "use
  the configured default", so no backfill is needed.

`2026_11_11_000003_create_marketer_tables`

- `marketer_commissions` — one row per delivered order, **unique index on
  `order_id`**. That uniqueness is what makes accrual safe to re-run.
  Stores `base_amount` and `rate` next to `amount` so a payout can be audited
  without re-deriving it from settings that may since have changed. Statuses:
  `pending`, `eligible`, `in_payout`, `paid`, `void`.
- `marketer_payouts` — one row per request. Stores the mobile-money
  destination, `requested_at` / `approved_at` / `paid_at`, `reference`,
  `approved_by`, `rejection_reason`. Statuses: `requested`, `approved`,
  `paid`, `rejected`.

## The service

`app/Services/MarketerCommissionService.php` holds every money rule. No
controller computes an amount.

- `accrue()` — scans delivered orders that qualify and have no commission row
  yet, inserting via `DB::table(...)->insertOrIgnore(...)`. Returns how many
  rows were created.
- `refresh()` — voids commissions for canceled/refunded/failed orders and
  refunded transactions, parks commissions for refunds in flight, restores the
  holding date when a refund was refused, and releases matured commissions to
  `eligible`.
- `requestPayout()` — reserves the marketer's `eligible` commissions into a new
  `requested` payout, inside a transaction with `lockForUpdate()`. This
  reservation is what stops the same commission being requested twice.
- `approve()` / `reject()` / `markPaid()` — state-guarded. `markPaid()` refuses
  an empty reference. `approve()` and `markPaid()` both re-check that the
  underlying orders are still delivered and unrefunded, because an order can be
  refunded between the request and the transfer.
- `summaryFor()` — the balances the portal shows.

Three details worth keeping:

- **Every query strips `ZoneScope`.** That scope filters `Order`,
  `OrderTransaction` and `Store` by the *logged-in* admin's zone. Left in
  place, what a marketer is owed would change depending on which admin happened
  to run the accrual. This is asserted by a test that logs in a zone-bound
  admin and accrues anyway.
- **Commissions already paid are never voided.** A refund after payout is a
  collections matter, not a ledger rewrite — otherwise a paid payout would
  silently stop reconciling with the mobile-money statement.
- **A payout whose commissions all void is auto-rejected** rather than left
  waiting with a stale amount, and a partial void recalculates the payout
  total before it can be approved.

## The portal

`partners.aduanefie.com`, entry `/marketer-login`.

Surfaces: `/marketer` (balances, owned stores, recent commissions),
`/marketer/commissions` (filterable ledger), `/marketer/payouts`,
`/marketer/payouts/request` (POST to `/marketer/payouts`).

Authentication reuses the **admin guard** and `AdminMfaService` rather than
adding a second guard over `admins`. A separate guard on the same table would
be a weaker door into accounts that can request money, which is the same
silent downgrade the admin MFA work exists to prevent. Consequences:

- Password alone never yields a session. `AdminMfaService::begin()` destroys it
  and leaves a 300-second pending marker; the challenge/enrolment screens are
  the only way forward.
- Forced enrolment applies to marketers exactly as it does to admins.
- `MarketerAuthenticated` re-checks role 5, `is_logged_in`, and the MFA marker
  on **every** request, and logs out on failure. A role change away from 5, or
  an MFA reset by an operator, ends an open session immediately — both are
  tested over HTTP.
- `/marketer-login` is throttled at 5/min keyed on email + IP, separately from
  the admin limiter. It is a door into admin accounts and must not be easier to
  brute-force than `/admin-login`.
- On `store.`, `logistics.` and `api.` hosts every marketer path 404s (never
  redirects), and `admin.` is allowed.

The MFA views were parameterised with an optional `$mfaRoutes` map and
`$panelLabel`, defaulting to the existing admin routes, so admin and marketer
share one set of screens instead of two that can drift.

## Order delivery timestamp

`Order::booted()` now stamps `orders.delivered` whenever `order_status`
transitions to `delivered` and the column is empty.

Before this, only `Vendor\POSController` set it. Orders delivered through the
rider API, the vendor panel or the admin panel left it null, which meant:

- the admin dashboard's "delivered today" figures were already undercounting;
- the 14-day holding clock had no reliable start.

Fixed in one model hook rather than in each of the five controllers that can
mark an order delivered, so a sixth path added later cannot silently skip it.

## Verification

Local MySQL replica (`adf-maria`), via `artisan serve`, all runs after the
final code:

- `/tmp/opencode/marketer_test.php` — **37 passed / 0 failed**. Accrual maths,
  14-day boundary, idempotency, zone-scope bypass, refund void / hold / restore,
  payout state guards, empty reference refusal, payment refusal after a refund,
  subscription / no-marketer / refunded-transaction exclusions, the model hook,
  and the per-marketer rate override. Leftovers after cleanup: 0.
- `/tmp/opencode/marketer_portal_test.sh` — **51 passed / 0 failed**. Host
  matrix 404s, role-2 refusal, wrong password, password-only session refused,
  wrong code then correct code, forced enrolment with 8 recovery codes shown
  once, payout request reserving only eligible commissions, role change and
  MFA reset ending an open session, logout, and 5-then-429 throttle. Leftover
  admins / stores / commissions after cleanup: 0.
- `/tmp/opencode/admin_mfa_test.sh` — **67 passed / 0 failed**, re-run
  specifically because this commit edits the shared `auth/mfa-*` views.

Fixture admins were deleted; admin counts are back to the documented baseline
(1×1, 3×2, 2×3, 1×4, 14×5, 2×6).

## Not built yet

- **Scheduling**: `marketer:accrue` is registered hourly in
  `app/Console/Kernel.php`, but it only runs if the deploy actually calls
  `schedule:run` from cron. Nothing scheduled a task on this app before this
  commit, so the cron entry is a deployment step, not an assumption. If it is
  missing, commissions simply never appear. The admin screens include a "run
  accrual now" button, so this is no longer a single point of failure for
  correcting a mistaken attribution, but commissions will not appear on their
  own without cron.
- **Payout rails per country** (MTN / Vodafone / AirtelTigo / M-Pesa) are
  free-text fields, not validated per country.
- **Refund after payout** is deliberately not reversed in the ledger.

## Follow-up: attribution became forward-only (`8ede9f5`)

The commit above shipped an unbounded liability and the harness caught it:
accrual credited *every* delivered order from an attributed store that had no
commission row, so attaching a marketer to an established store would pay a
share of that store's entire delivery history in one scan.

`8ede9f5` adds `stores.marketer_assigned_at` and accrual now only covers
orders delivered on or after it. `Store::assignMarketer()` is the single place
that stamps the date (same marketer keeps the original date, a new marketer
starts from now, removal clears both fields), and the migration backfills any
existing attribution to "now" rather than to the past.

This closed a known gap **before** the assignment screen existed, which is the
only point at which it could be closed cheaply.


## Admin screens (`27dab43`)

Commit: `27dab43` (`Add admin screens for marketer attribution and payouts`).

The ledger and the partners portal had no admin face: `approve()` and
`markPaid()` existed but were only reachable from code. This commit adds the
pages that move a payout through `requested → approved → paid` and the page
that attributes a store.

Surfaces under `/admin/marketer`:

| Page | Route | What it does |
|---|---|---|
| Marketers | `GET /admin/marketer` | Per-marketer on-hold / available / in-payout / paid balances, store count, and the rate form. |
| Commission ledger | `GET /admin/marketer/commissions` | Filter by marketer, status and free text (order number, store name, marketer email or name). Shows base amount, rate and payout link per row. |
| Payout queue | `GET /admin/marketer/payouts` | Filter by marketer and status. |
| Payout detail | `GET /admin/marketer/payouts/{id}` | Destination, timeline, rejection reason, and the commissions the amount is made of. Approve / reject / record-paid forms. |
| Store attribution | `GET /admin/marketer/stores` | Search and filter stores, assign or remove a marketer per row. |
| Run accrual | `POST /admin/marketer/accrue` | Runs the same `accrue()` + `refresh()` as the hourly command, then reports the counts. |

**Gating is explicit, not `module_permission_check()`.** Every method calls
`authorizeSuperAdmin()`, which requires `role_id === 1` and aborts 403. The
payout queue is the only place a payout can be approved or recorded as paid,
so it is not grantable to an employee role. A non-role-1 admin gets 403 on
GET and POST alike; the sidebar entry is hidden by the same role check. The
`admin.` host is the only host that serves these routes; `store.` 404s them.

**The UI adds no money rules.** Amounts, holds, voiding and payout state
transitions stay in `MarketerCommissionService`. The controller validates
input, calls the service, and turns a refused transition (`RuntimeException`)
into a toast instead of a 500. Concretely:

- Approve marks the payout approved and records `approved_by` / `approved_at`.
  It does **not** change commission status or move money.
- Record paid requires a non-empty reference (form and controller), re-checks
  the underlying orders, then marks the payout paid and its commissions paid.
  A paid payout cannot be paid again or re-approved; both are refused by the
  service and the reason is shown.
- Reject requires a reason, sets `rejected`, and releases every `in_payout`
  commission back to `eligible` with `payout_id = null`. An approved-but-not-
  sent payout can also be rejected — the test covers that path explicitly.
- Rate update accepts 0–100 or blank. Blank stores `NULL`, which means "use
  `config('marketer.default_rate')`". Existing commission rows keep the rate
  they were accrued at, so a change is not retroactive.
- Store assignment goes through `Store::assignMarketer()`, so the forward-only
  date is stamped in one place. Re-saving the same marketer keeps the original
  date; choosing "none" clears both fields. Assigning a role-2 account is
  refused before anything is written.

### Two bugs the rendered pages caught

- **Wrong sidebar file.** The menu was first added to
  `layouts.admin.partials._sidebar`, but the layout renders
  `_sidebar_{module_type}`. On the default grocery module, the super admin saw
  no menu at all; the first harness run failed on exactly that check. The
  entries now live in `_sidebar_marketers.blade.php`, included by every module
  sidebar (`grocery`, `food`, `parcel`, `pharmacy`, `ecommerce`, `dispatch`),
  the employees sidebar and the base sidebar. The partial renders nothing for
  non-role-1 accounts.
- **Search escaping the marketer filter.** The store search used
  `->where('name', 'like', …)->orWhere('phone', 'like', …)` inside a `when()`
  without grouping. SQL precedence turned
  `marketer_id is null and (name like ? or phone like ?)` into
  `(marketer_id is null and name like ?) or phone like ?`, so filtering by
  "not attributed" still listed an attributed store if its name matched.
  Grouped, with a regression check that combines `marketer_id=none` and a
  search that matches both the attributed and unattributed fixture stores.

### Verification

All runs after the final code, on the local MySQL replica:

- `/tmp/opencode/admin_marketer_test.sh` — **98 passed / 0 failed**. Role-1
  403 matrix on every GET and POST, unauthenticated redirect, store-host 404,
  accrual from the button (and idempotent second run), marketer payout request,
  approve, empty reference refused with the payout still approved, paid with
  reference, double-pay and re-approve refused, reject without reason refused,
  reject releases the commission, released commission can be requested again,
  approve-then-reject releases again, rate set / blank / invalid, assign /
  re-assign / remove, forward-only date preservation, and the combined store
  filter. Fixture admins, stores, payouts and commissions are all 0 after
  cleanup.
- `/tmp/opencode/admin_mfa_test.sh` — **67 passed / 0 failed**, re-run because
  this commit edits every module sidebar the admin panel renders.
- `php artisan view:cache` — compiles every Blade template, including all
  module sidebars, so the new partial and its includes are syntactically valid
  in the files this session cannot click through.

### Still true after this commit

- Payout rails per country remain free-text; nothing validates that an MTN
  number is Ghanaian or an M-Pesa number is Kenyan.
- There is no separate audit-log table. The payout row itself records who
  approved it, when, the reference and the rejection reason, which is enough
  to reconcile a manual transfer but not an append-only trail of every edit.
- Admin actions are not rate-limited. They require an authenticated role-1
  session with MFA, and they are idempotent where it matters (accrual, paid),
  but a compromised super-admin session is not slowed down here.
- No CSV export or bulk payout. Each payout is approved and recorded one at a
  time.
