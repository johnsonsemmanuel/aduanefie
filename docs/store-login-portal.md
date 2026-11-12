# Store login portal — canonical `/store-login`

Date: 2026-11-12
Branch: `fix/store-login-portal`
Status: **the portal is deployed to Railway production (`aduanefie-backend` / production) at
`0d24de9` and verified over HTTPS.** The two follow-up fixes (`de7d5c6` legacy submit ordering,
`22d6969` dead `trade-bloc` nav) are committed and verified locally but **not yet deployed**.
Retired-host 301s are live in the app but unreachable until DNS is repointed.

Supersedes the store-specific parts of `docs/portal-scoping-implementation.md` and
`docs/admin-access-verification.md`. Those documents still describe `/login/store` as the
store entry and `/` as the guest redirect target; both are now historical.

---

## 1. Why the old behaviour was broken

Production runs two different Laravel codebases:

| Host | Server | Code |
|---|---|---|
| `admin.aduanefie.com` | Railway | current codebase |
| `api.aduanefie.com` | Railway | current codebase |
| `store.` / `vendor.` / `logistics.` / `partners.aduanefie.com` | Apache `185.151.30.164` | old 6amMart install |
| `aduanefie.com` / `www` | Vercel | Next.js storefront |

`/store-login` did not exist in either codebase, so it 404'd. The store dashboard route *did*
exist (`/vendor-panel`), but `VendorMiddleware` sent guests to `route('home')`. On the admin
host that landed on `/` and then `/admin-login`; on the store host it landed on the old landing
page. A store owner was never shown a store login prompt.

## 2. What changed

Six commits carry the original feature. `8519202` and `5acc742` are concurrent cleanup commits that
captured files while they were in the working tree; their messages describe the cleanup, not
this feature. `17dd74b` and `7188841` are follow-up fixes, `65f610c` is this document, and
`0d24de9` repairs the invalid `composer.json` that `5acc742` left behind. Two later commits close
the follow-ups listed in §5: `de7d5c6` fixes the legacy submit ordering and `22d6969` removes the
dead `trade-bloc` nav that broke the subscription gate.

| File | Change | Commit |
|---|---|---|
| `soft/app/Http/Controllers/StoreAuthController.php` | **New.** Dedicated owner + employee login. Verifies the password **before** any account gate, then applies the existing module/subscription/approval/suspension rules. | `8519202` |
| `soft/routes/web.php` | `GET|POST /store-login` (`store.login`, `store.login.submit`) and `GET|POST /store-login/employee` (`store.employee.login`, `store.employee.login.submit`). POSTs use `throttle:store-login`. Legacy `/login/{tab}` routes remain. | `8519202` |
| `soft/app/Providers/RouteServiceProvider.php` | `store-login` limiter: 10/min, keyed on email + IP via `loginThrottleKey()`. | `8519202` |
| `soft/app/Http/Middleware/VendorMiddleware.php` | All four guest/suspended redirects now go to `route('store.login')` instead of `route('home')`. | `8519202` |
| `soft/config/portals.php` | `vendor.aduanefie.com` maps to the retired `store` portal. `store` portal now has `redirect_to: https://admin.aduanefie.com` and `redirect_path: /store-login`; `session_cookie` and `deny` removed. `logistics`, `partners`, `api` deny `store-login` and `store-login/*`. | `17dd74b` |
| `soft/app/Http/Middleware/PortalScope.php` | Retired hosts redirect every `GET`/`HEAD` 301 to the ops host, preserving path and query string, **before** `StartSession`. Non-GET methods 404. | `17dd74b` |
| `soft/resources/views/auth/login.blade.php` | Admin MFA slide and step dots wrapped in `@if($isAdmin)`. `single-step` CSS collapses the track for store logins. Small owner/employee cross-link. | `17dd74b` |
| `soft/.env.production.example` | `APP_URL` corrected to `https://admin.aduanefie.com` (the ops/API app), not the Vercel storefront. | `17dd74b` |
| `soft/routes/web.php` | Removed five route groups (`bulk-trade`, `market`, `sourcing`, `seller`, `api/integrations`) whose controllers `8519202` deleted but whose route definitions it left behind. Every one of those routes would 500 on dispatch, and `route:list` aborted loading the missing classes. No live view calls these names; the only callers are the removed-feature views. | `7188841` |
| `soft/composer.json` | Removed the trailing comma `5acc742` left after `"prefer-stable": true,`. The file is read by `Application::getNamespace()`, so invalid JSON made every artisan command die with "Unable to detect application namespace" and would have broken the Docker build. `composer.lock` was not regenerated; `composer install` warns "lock file is not up to date" but installs. | `0d24de9` |

## 3. Entry points, enumerated

| Entry | Behaviour |
|---|---|
| `GET/POST /store-login` | Canonical store-owner login. |
| `GET/POST /store-login/employee` | Canonical store-employee login. |
| `GET /login/store` | Legacy page, still served by `LoginController@login`. Kept for `DataSetting.store_login_url` and old bookmarks. |
| `GET /login/store-employee` | Same, employee tab. |
| `POST /login_submit` with `role=vendor` / `vendor_employee` | Legacy shared submit. Verifies the password before the store gates (`de7d5c6`). |
| `store.aduanefie.com`, `vendor.aduanefie.com` | App-level 301 to `https://admin.aduanefie.com/store-login` (root) or the same path on the admin host (deep links). |

## 4. Verification actually run

Local server: `php artisan serve --host=127.0.0.1 --port=8099`. Requests carried a `Host`
header to exercise portal scoping.

| Check | Result |
|---|---|
| `GET /store-login` (default portal) | 200, 54,614 bytes |
| `GET /store-login` (`Host: admin.aduanefie.com`) | 200 |
| `GET /store-login/employee` | 200, form action `/store-login/employee`, `role=vendor_employee` |
| Store login markup | no `.step-indicator`, no `#mfaForm`, no `admin-mfa` reference |
| Admin login markup | `.step-indicator` and `#mfaForm` still present |
| `GET /` on `store.aduanefie.com` | 301 → `https://admin.aduanefie.com/store-login` |
| `GET /login/store?x=1` on `vendor.aduanefie.com` | 301 → `https://admin.aduanefie.com/login/store?x=1` |
| `POST /store-login` on `store.aduanefie.com` | 404 (writes refused on retired host) |
| `GET /vendor-panel` guest on admin host | 302 → `https://admin.aduanefie.com/store-login` |
| Owner login (temporary fixture) | 302 → `https://admin.aduanefie.com/vendor-panel` |
| Employee login (temporary fixture) | 302 → `.../vendor-panel`; `is_logged_in = 1` |
| Wrong password | 302 back to `/store-login`; `/vendor-panel` still 302 to login (not authenticated) |

Route registration was confirmed with a full `php artisan route:list`, which now exits 0 with
1382 routes (`0d24de9`; see gap 8). The targeted routes are:

```
GET    store-login           name=store.login                   middleware=web
POST   store-login           name=store.login.submit            middleware=web, throttle:store-login
GET    store-login/employee  name=store.employee.login          middleware=web
POST   store-login/employee  name=store.employee.login.submit   middleware=web, throttle:store-login
GET    login/{tab}           name=login                         middleware=web, guest:admin,vendor
GET    vendor-panel          name=vendor.dashboard              middleware=web, vendor
```

Local test artefacts (vendor `9001`, store `9002`, employee `9003`) were deleted, and the
`check_daily_subscription_validity_check` business setting was restored to `2026-11-09`.

### 4.1 Production verification (after `railway up` from `0d24de9`)

Deployed with `railway up --ci` from `soft/` to project `aduanefie-backend`, environment
`production`, service `aduanefie-backend`. Build reported `Deploy complete`. Checks were run over
HTTPS against `admin.aduanefie.com`, which resolves to Railway (`t8ki8ru4.up.railway.app`):

| Check | Before deploy | After deploy |
|---|---|---|
| `GET https://admin.aduanefie.com/store-login` | 404 | 200, 12,059 bytes |
| `GET https://admin.aduanefie.com/store-login/employee` | 404 | 200 |
| `GET https://admin.aduanefie.com/vendor-panel` (guest) | 302 → `https://admin.aduanefie.com/` | 302 → `https://admin.aduanefie.com/store-login` |
| `GET https://admin.aduanefie.com/admin-login` | 200 | 200 (MFA markup retained) |
| `GET https://admin.aduanefie.com/login/store` | 200 | 200 (legacy alias still served) |
| `GET https://admin.aduanefie.com/login/store-employee` | — | 200 |

Markup checks on the production store-login page: no `#mfaForm`, no `two_factor_verification`, no
`.step-indicator`; contains "Sign in to your store panel" and the employee cross-link; form action
is `https://admin.aduanefie.com/store-login`.

The Railway image entrypoint (`soft/docker-entrypoint.sh`) runs `php artisan config:cache` only.
It does **not** run `route:cache` and does **not** run migrations, so this deploy did not touch the
database schema. A stale route cache is therefore not a deploy risk here unless someone has cached
routes manually; if that happens, `route('store.login')` would throw and the fix is to clear
`bootstrap/cache/routes-*.php`.

### 4.2 Legacy submit ordering (local HTTP, temporary fixtures)

`POST /login_submit` was exercised with a CSRF token from `/store-login` and a `Referer` pointing
back at it, against three temporary fixtures: a pending store (status `0`), a store with
`store_business_model = none`, and an inactive store for an employee. Fixtures were deleted and
`check_daily_subscription_validity_check` restored to `2026-11-09` afterwards.

| Case | Wrong password | Correct password |
|---|---|---|
| Pending owner | 302, "Credentials does not match" | 302, "Admin did not approve your registration yet" |
| `none` business model owner | 302, "Credentials does not match" | 200, subscription-payment view |
| Inactive employee | 302, "Credentials does not match" | 302, "Store is inactive" |

Before `de7d5c6` the wrong-password column returned the account-state message/page in each row.
The correct-password column also caught the `trade-bloc` layout failure described in §5 gap 9,
which `22d6969` fixed (the same case now renders 200).

## 5. Known gaps and deliberate deferrals

1. **Retired hosts are not yet cut over at DNS.** `store.` and `vendor.` still resolve to
   `185.151.30.164` (old Apache), so the 301 implemented in `PortalScope` is unreachable in
   production. The admin host is fully deployed; only the DNS/edge repoint remains.
2. **Caches: resolved.** `route:list` exits 0, and the entrypoint rebuilds `config:cache` on every
   boot. `route:cache` is intentionally not used by the entrypoint; see §4.1 for what to do if a
   stale route cache is ever introduced.
3. **Split-brain risk is unresolved.** The old Apache install is still running and may share the
   database with Railway. That must be checked before any write-heavy rollout.
4. **Authenticated dashboard rendering was not fully exercised locally.** `GET /vendor-panel`
   with a valid session reached the controller but 500'd on a local-only schema gap
   (`orders.schedule_at` missing from the partial SQLite dump; `store_subscriptions` is also
   missing). The auth middleware itself passed. Production rendering needs a post-deploy check
   with a real store account.
5. **Legacy submit ordering: resolved.** `de7d5c6` verifies the vendor / vendor_employee password
   through the same guard provider before any account-state gate, and returns the generic
   credentials error on failure. Verified over HTTP: wrong passwords return only "Credentials does
   not match" for pending stores, no-subscription stores and inactive stores; correct passwords
   still reach the original gate responses. The admin tabs in the same method were reviewed but not
   reordered; they are separately gated by the MFA challenge.
6. **Captcha is effectively a null pass.** `passesHumanCheck()` compares an empty session
   `six_captcha` against an empty `custome_recaptcha`; the shared login view renders no captcha
   field. This matches the existing admin login. If reCAPTCHA is ever enabled in business
   settings, store login would lock out until the field is rendered.
7. **Store "Forget Password?" still links to the admin reset request.** `/reset-password` finds
   the master admin and emails the admin, not the store owner. The vendor reset endpoint
   (`POST /vendor-reset-password`) exists but the shared modal does not use it. Existing issue,
   left untouched to keep this diff reviewable.
8. **`route:list` / `route:cache`: resolved.** `php artisan route:list` exits 0 with 1382 routes
   at `0d24de9`. The two causes were the stale `routes/web.php` groups (`7188841`) and the invalid
   `composer.json` (`0d24de9`). If a future cleanup deletes a controller, it must delete the route
   definitions in the same commit or `route:list` and `route:cache` abort again.
9. **Orphaned removed-feature views remain.** `resources/views/market/`,
   `resources/views/seller-dashboard/`, and `resources/views/vendor-views/profile/edit.blade.php`
   still call route names that no longer exist (`market.*`, `seller.*`). The first two are
   unreachable. `profile/edit` is unreachable today because no route targets
   `ProfileController@edit`; if one is ever added it will 500 on `seller.profile.update`, which was
   already undefined before this change. The `trade-bloc.*` references in
   `layouts/landing/app.blade.php` were a live version of the same problem — they 500'd every view
   extending that layout, including the subscription gate — and are removed in `22d6969`.
10. **`translate()` mutates the language file at request time.** When a key is missing from
    `resources/lang/{locale}/messages.php`, `app/helpers.php::translate()` appends the readable
    fallback to that PHP file and writes it back. This explains the recurring uncommitted churn in
    `messages.php` and means a language file can change as a side effect of serving a page. The new
    store-login strings rely on this fallback; they render as readable text, not raw keys.

## 6. Required deployment steps (outside this repo)

1. Point `store.aduanefie.com` and `vendor.aduanefie.com` at the Railway app, or put an edge-level
   301 in front of them to `https://admin.aduanefie.com/store-login`.
2. Stop the old Apache Laravel install on `185.151.30.164`.
3. Confirm whether both installs write to the same database; resolve before enabling writes.
4. ~~Deploy this branch.~~ Done at `0d24de9`; entrypoint rebuilds `config:cache` on boot. See §4.1.
5. Verify with a real store account:
   - `https://admin.aduanefie.com/store-login` renders and logs in. (Renders: confirmed.)
   - `https://admin.aduanefie.com/vendor-panel` loads the dashboard. (Still to confirm with a real
     account; see gap 4.)
   - `https://store.aduanefie.com/` returns 301 to the canonical store login. (App-level 301 is
     deployed; blocked on step 1.)
