# Six failing admin/vendor routes — fix and verification

Commit: `82edbae` (`Fix the six known failing admin and vendor routes`), on top of
`786879b`.

These six routes failed identically on MySQL and Postgres, so they were code/view
drift rather than symptoms of the Supabase port. They were fixed on MySQL first,
before the marketer module, as agreed.

Written from the committed diff, not from the plan.

## What was actually wrong

| Route | Cause | Change |
|---|---|---|
| `/admin/report/order` | `order_index` returned `admin-views.report.order-index`, a view that has never existed. The real page is `order-report`. | Redirects to `admin.report.order-report`. |
| `/admin/report/earning` | Route pointed at `earning_index`, a method that did not exist. There is no standalone earnings page; earnings live on the day-wise transaction report. | Added `earning_index`, which redirects to `admin.report.transaction-report`. |
| `/admin/report/stock-report` | Route pointed at `stock_report`, which did not exist. The working implementation is `low_stock_report`. | Added `stock_report` / `stock_search` as one-line delegates to `low_stock_report` / `low_stock_search`. |
| `/admin/category/add` | `getCategoryView` passed `$request['position']` (absent on the add URL) into `getViewByPosition(int $position)`. | `(int) ($request['position'] ?? 0)`; missing means top-level. |
| `/vendor-panel/subscription/subscriber-list` | Route named a `subscriberList` method that `Vendor\SubscriptionController` does not have. Vendors are subscribers; the admin panel owns the listing page. | Route removed. |
| `/vendor-panel/trade-requests/received` | Group queried `trade_*` tables that do not exist in the MySQL snapshot. `/trade` is catalogue-only until the RFQ/escrow review closes. | Vendor trade-request group removed. |

Two details worth keeping:

- **Both report prefixes are handled.** The legacy routes exist under `/admin/report/`
  and again under `/admin/transactions/report/`. The redirects check
  `$request->is('admin/transactions/*')` so a transaction-section bookmark stays in
  that section instead of jumping to the main report.
- **Delegation, not duplication, for stock.** `stock_report` calls
  `low_stock_report` rather than carrying a second copy of the query. Two copies
  would have drifted the moment either was edited, which is how the routes got out
  of sync in the first place.

## Files changed

- `soft/app/Http/Controllers/Admin/ReportController.php` — `order_index` now
  redirects; new `earning_index`, `stock_report`, `stock_search`.
- `soft/app/Http/Controllers/Admin/Item/CategoryController.php` — null-safe
  `position` in `getCategoryView`.
- `soft/routes/vendor.php` — removed `subscriber-list` and the vendor
  `trade-requests` group, each replaced by a comment explaining the absence.

No views, migrations or models were added. No table was touched.

## Verification

Harness: `/tmp/opencode/fix6_test.sh` against the local MySQL replica (`adf-maria`)
via `artisan serve`, signing in through the real MFA flow with a temporary
enrolled admin so the routes were reached as a genuinely authenticated session.

Result: **18 passed / 0 failed**:

- `/admin/report/order` → 200 at `/admin/report/order-report`, page renders.
- `/admin/report/earning` → 200 at `/admin/report/transaction-report`, page renders.
- `/admin/transactions/report/order` → 200 at
  `/admin/transactions/report/order-report` (stays in the transactions section).
- `/admin/transactions/report/earning` → 200 at
  `/admin/transactions/report/day-wise-report`.
- `/admin/report/stock-report` → 200 and renders a stock page.
- `/admin/category/add` → 200 and renders the category form.
- `/vendor-panel/subscription/subscriber-list` → 404 on the store host.
- `/vendor-panel/trade-requests/received` → 404 on the store host.
- `route:list` confirms no route names remain for the two removed vendor pages.

Renders were checked for `View [...] not found`, `Call to undefined method`,
`LaravelIgnition`/`Whoops` and PHP syntax errors, not just for a 200 status.

Fixture cleanup: the temporary admin was deleted (0 remaining). The two order rows
used by earlier rider tests were already restored to `delivery_man_id = NULL`,
`order_status = 'delivered'`. The run appends pagination keys to
`resources/lang/en/messages.php` at render time; that file was reverted so the
commit contains only the fix.

## Follow-up, deliberately not done here

The customer-side RFQ/escrow routes in `routes/web.php`
(`/trade-requests/*`, `/trade-contracts/*`) still reference the absent `trade_*`
tables. They were left untouched: removing them is a product decision about the
customer trade surface, and touching money paths before the RFQ/escrow security
review closes is exactly what the review is for. They are tracked in
`docs/current-flow-and-gaps.md`.

The underlying cause — routes added ahead of their controllers and views — is not
mechanically prevented. `php artisan route:list` resolves names but not controller
methods or views, so a static route/controller audit is the only way to catch this
class before a user does.
