# Store login portal — canonical `/store-login`

Date: 2026-11-12
Branch: `fix/store-login-portal`
Status: **implemented, linted, and exercised against the local SQLite replica. Not deployed.**

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

Two commits carry this work. `8519202` is a concurrent cleanup commit that captured the first
four files while they were in the working tree; its message does not describe them.

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

## 3. Entry points, enumerated

| Entry | Behaviour |
|---|---|
| `GET/POST /store-login` | Canonical store-owner login. |
| `GET/POST /store-login/employee` | Canonical store-employee login. |
| `GET /login/store` | Legacy page, still served by `LoginController@login`. Kept for `DataSetting.store_login_url` and old bookmarks. |
| `GET /login/store-employee` | Same, employee tab. |
| `POST /login_submit` with `role=vendor` / `vendor_employee` | Legacy shared submit. **Still uses the old pre-auth gate ordering.** See gap 5. |
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

Route registration was confirmed without `route:list`, because that command instantiates every
controller and the concurrent `8519202` commit left `routes/web.php` referencing controllers it
deleted. The registration check used `app('router')->getRoutes()` directly:

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

## 5. Known gaps and deliberate deferrals

1. **Not deployed.** The 301 only exists in this codebase. `store.` and `vendor.` still resolve
   to `185.151.30.164` (old Apache). Until DNS/edge is repointed, users still hit the old app.
2. **Caches must be rebuilt on Railway** after deploy: `php artisan config:cache` and
   `php artisan route:cache`. `route('store.login')` in `VendorMiddleware` will throw if a stale
   route cache is served.
3. **Split-brain risk is unresolved.** The old Apache install is still running and may share the
   database with Railway. That must be checked before any write-heavy rollout.
4. **Authenticated dashboard rendering was not fully exercised locally.** `GET /vendor-panel`
   with a valid session reached the controller but 500'd on a local-only schema gap
   (`orders.schedule_at` missing from the partial SQLite dump; `store_subscriptions` is also
   missing). The auth middleware itself passed. Production rendering needs a post-deploy check
   with a real store account.
5. **Legacy submit path still has the pre-auth gate ordering.** `/login/store` renders through
   `LoginController@submit`, which checks store state before verifying the password. The new
   canonical controller fixes this for `/store-login`, but the legacy alias remains leaky. Either
   retire the legacy alias or port the ordering fix before treating the store surface as fully
   closed.
6. **Captcha is effectively a null pass.** `passesHumanCheck()` compares an empty session
   `six_captcha` against an empty `custome_recaptcha`; the shared login view renders no captcha
   field. This matches the existing admin login. If reCAPTCHA is ever enabled in business
   settings, store login would lock out until the field is rendered.
7. **Store "Forget Password?" still links to the admin reset request.** `/reset-password` finds
   the master admin and emails the admin, not the store owner. The vendor reset endpoint
   (`POST /vendor-reset-password`) exists but the shared modal does not use it. Existing issue,
   left untouched to keep this diff reviewable.

## 6. Required deployment steps (outside this repo)

1. Point `store.aduanefie.com` and `vendor.aduanefie.com` at the Railway app, or put an edge-level
   301 in front of them to `https://admin.aduanefie.com/store-login`.
2. Stop the old Apache Laravel install on `185.151.30.164`.
3. Confirm whether both installs write to the same database; resolve before enabling writes.
4. Deploy this branch, then run `php artisan config:cache` and `php artisan route:cache`.
5. Verify with a real store account:
   - `https://admin.aduanefie.com/store-login` renders and logs in.
   - `https://admin.aduanefie.com/vendor-panel` loads the dashboard.
   - `https://store.aduanefie.com/` returns 301 to the canonical store login.
