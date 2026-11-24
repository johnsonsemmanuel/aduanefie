# Rider portal on `logistics.aduanefie.com` - implemented and verified

Date: 2026-11-11
Commit: `90689f9` (on top of baseline `99be9ef`)
Scope: web login + read-only portal for delivery riders.
Status: **implemented, linted, and exercised end to end against the local MySQL replica. Not deployed.**

The mobile rider app remains the primary surface. This portal exists so a rider can
check what is assigned to them and what they have earned from a browser, without a
phone install.

---

## 1. What changed

| File | Change |
|---|---|
| `soft/app/Http/Controllers/Concerns/VerifiesHuman.php` | **New.** Shared captcha + locale handling for the dedicated login controllers. Two-mode captcha: Google reCAPTCHA when `recaptcha.status = 1`, image captcha otherwise. |
| `soft/app/Http/Controllers/RiderAuthController.php` | **New.** `GET/POST /rider-login`, `POST /rider-logout`. Phone + password, then both account gates, then session. |
| `soft/app/Http/Middleware/RiderAuthenticated.php` | **New.** Re-checks `application_status` and `status` on every rider request. |
| `soft/app/Http/Controllers/RiderDashboardController.php` | **New.** Current orders, recent orders, earnings. Read-only. |
| `soft/resources/views/rider/login.blade.php` | **New.** Login form; image captcha by default, reCAPTCHA-v3 when enabled. |
| `soft/resources/views/rider/dashboard.blade.php` | **New.** Current + recently completed orders. |
| `soft/resources/views/rider/earnings.blade.php` | **New.** Wallet summary, delivery count, recent `provide_d_m_earnings` entries. |
| `soft/resources/views/rider/layout.blade.php` | **New.** Self-contained layout (inline CSS, no storefront/admin assets). |
| `soft/app/Http/Controllers/AdminAuthController.php` | Captcha/locale helpers removed; now uses `VerifiesHuman`. Behaviour unchanged. |
| `soft/routes/web.php` | Added the four rider routes; `throttle:rider-login` on the POST. |
| `soft/app/Providers/RouteServiceProvider.php` | Added `rider-login` limiter (5/min). `loginThrottleKey()` now takes a field name so the key can be phone-based. |
| `soft/config/portals.php` | `logistics.entry = /rider-login`; rider paths denied on `store`, `partners`, `api`. Logistics still denies `/admin*`, `/vendor-panel*`, `/login/admin*`, `/login/store*`. |

No database, model, migration or storage changes. Nothing MySQL-specific was added,
so the production MySQL driver is unaffected.

---

## 2. Design decisions

### 2.1 Phone, not email

Riders authenticate by phone. That is what the mobile API accepts
(`Api\V1\DeliveryManLoginController@login`) and the only credential they were issued,
so the web portal matches it rather than introducing a second identity field.

### 2.2 The gates run before the session exists

The controller verifies the password **and** both account gates before calling
`$guard->login()`:

1. phone + password must validate;
2. `application_status` must be `approved`;
3. `status` must be truthy (the suspend flag).

A rejected account therefore never holds a logged-in session, not even for one
request. `RiderAuthenticated` re-applies gates 2 and 3 on every subsequent request, so
suspending a rider or un-approving them takes effect immediately instead of at the
next session expiry.

### 2.3 Read-only, on purpose

There is **no** "update order status" action. The only existing implementation of that
transition is `Api\V1\DeliverymanController@update_order_status`, which:

- creates and updates `transactions` on delivery,
- requires OTP verification when `order_delivery_verification = 1`,
- moves `delivery_men` and `stores` counters and per-item order counts,
- writes order proof images.

Re-implementing that in a web controller would create a second money path with its own
bugs. The portal stops at visibility until that logic is extracted into one shared,
reviewed place.

### 2.4 Shared trait instead of a third copy

`AdminAuthController` and `RiderAuthController` both need the two-mode captcha and the
default-locale lookup. That code now lives in `VerifiesHuman`, so a future captcha
change cannot be applied to one login and forgotten on the other. The admin login was
re-verified after the refactor (section 3.5).

---

## 3. Verified behaviour

Run against `adf-maria` (local MySQL replica, `.env.localmysql`) with
`php artisan serve`, using `curl --resolve logistics.aduanefie.com:8099:127.0.0.1` so the
cookie host matches the URL host. The captcha phrase is read from the file session
store, so the real HTTP path is exercised rather than a controller shortcut.

Test fixtures were three `delivery_men` rows and two re-assigned orders, all removed or
restored afterwards (`delivery_men` back to its original 18 rows; orders `100001` and
`100002` back to `delivered` with `delivery_man_id NULL`).

### 3.1 Login and pages

| Step | Result |
|---|---|
| Approved rider, correct phone + password | 302 → `/rider` |
| `GET /rider` | 200; dashboard rendered |
| Dashboard contents | current order `#100001` and recent order `#100002` listed |
| `GET /rider/earnings` | 200; wallet summary + entries rendered (wallet absent is handled) |
| `POST /rider-logout` | 302 → `/rider-login` |
| `GET /rider` after logout | 302 → `/rider-login` |

### 3.2 Rejected logins

| Case | Result |
|---|---|
| Wrong password | 302 back; "Incorrect credential please try again"; `/rider` → 302 |
| `status = 0` (suspended) | 302 back; "Your account has been suspended"; `/rider` → 302 |
| `application_status = pending` | 302 back; "Your registration is not approved yet…"; `/rider` → 302 |

### 3.3 Fail-closed mid-session

| Step | Result |
|---|---|
| Logged in, `GET /rider` | 200 |
| Admin sets `status = 0`, next `GET /rider` | 302 → `/rider-login`, session cleared |
| Logged in again, `GET /rider` | 200 |
| Admin sets `application_status = pending`, next `GET /rider` | 302 → `/rider-login`, session cleared |

### 3.4 Throttle

`POST /rider-login`, same phone and IP:

| Attempt | Result |
|---|---|
| 1–5 | 302 (normal rejection) |
| 6 | **429** |

### 3.5 Admin login regression (after the `VerifiesHuman` refactor)

| Case | Result |
|---|---|
| `GET /admin-login` | 200; form and captcha present |
| Wrong password | 302 back, rejected |
| `role_id = 2`, correct password | 302 back, rejected |
| `role_id = 1`, correct password | 302 → `/admin` |

Temporary admins used for this were deleted afterwards.

### 3.6 Host matrix

| Host | Path | Result |
|---|---|---|
| `logistics.` | `/` | 302 → `/rider-login` |
| `logistics.` | `/rider`, `/rider/earnings` (guest) | 302 → `/rider-login` |
| `logistics.` | `/admin-login` | **404** |
| `logistics.` | `/vendor-panel` | **404** |
| `logistics.` | `/login/store` | **404** |
| `store.` | `/rider-login`, `/rider` | **404** |
| `partners.` | `/rider-login`, `/rider` | **404** |
| `api.` | `/rider-login`, `/rider` | **404** |
| `admin.` | `/rider-login` | 200 (admin is the highest privilege ring) |

---

## 4. Two framework interactions found during verification

Both produced 500s that only appeared over real HTTP, not in a CLI probe.

### 4.1 `remember_token` and `GenericUser`

`delivery_men` uses the **database** user provider, which returns a `GenericUser`.
`GenericUser::getRememberToken()` indexes `attributes` without a null check, and the
table has no `remember_token` column. `SessionGuard::logout()` calls
`$user->getRememberToken()`, so:

- the suspended/pending branches (which logged out after a failed gate) threw
  `Undefined array key "remember_token"`;
- the real sign-out action would have thrown the same way.

Fix: the controller never logs out as part of a failed login (gates run before
`login()`), and both sign-out paths use `SessionGuard::logoutCurrentDevice()`, which
clears the session and in-memory user without cycling a remember token.

The alternative - switching the `delivery_men` guard to the `eloquent` provider with the
`DeliveryMan` model - was not taken here because that guard is shared with the mobile
API. It is the cleaner long-term configuration and is worth doing as its own reviewed
change.

### 4.2 `Order::getCreatedAtAttribute()`

`Order` defines `getCreatedAtAttribute()`, which returns a formatted **string** and
overrides the `datetime` cast. `updated_at` is real Carbon. The dashboard called
`->format()` on `created_at` and threw `Call to a member function format() on string`.

Fix: rider views format timestamps with `Carbon::parse($value)->format(...)`, which
accepts both a string and a Carbon instance. `ProvideDMEarning::created_at` is Carbon
today, but the earnings view uses the same defensive call.

---

## 5. Known limitations and deliberate deferrals

- **No status updates, OTP delivery completion, proof upload, or cancellation.** See
  2.3. Riders continue to use the app for those.
- **No web password reset.** Riders reset from the app; the API reset endpoints remain
  the only path.
- **Earnings are read-only.** Withdrawals stay in the app; admin payouts are manual.
  The portal shows wallet balances and recent `provide_d_m_earnings` entries and
  states that payouts are processed by operations.
- **No rider self-registration on web.** Registration stays app-only
  (`POST /api/v1/auth/delivery-man/store`). The login page says so.
- **No MFA on rider login.** This matches the rider API. Admin MFA/TOTP is still
  absent and remains a separate security task.
- **Login timing.** A phone that does not exist returns before any hash comparison, so
  it is measurably faster than a wrong password. This is identical to the existing API
  behaviour and was left unchanged to keep the two paths in parity. It is a known
  characteristic, not an oversight.
- **Session driver is `file`.** Fine for one app server; it must move to
  `database`/Redis before more than one node serves the portal.
- **`translate()` hazard avoided.** The rider views use literal English rather than
  `translate()` with new keys, because `translate()` writes missing keys into
  `resources/lang/en/messages.php` at runtime. Only pre-existing keys are used for the
  error messages.
- **No live tracking / map.** Out of scope for a read-only first version.

---

## 6. Deploy checklist

1. Deploy the code, then **rebuild the config cache** (`php artisan config:cache`).
   Without it, `config/portals.php` does not load and `logistics.` stays unscoped.
2. Deploying also changes the logistics session cookie name to `adf_logistics_session`,
   so existing sessions on that host are invalidated once. Expect a single re-login.
3. Do **not** set `SESSION_DOMAIN=.aduanefie.com`; `PortalScope` forces
   `session.domain = null` for mapped hosts.
4. Confirm `logistics.aduanefie.com` has DNS, TLS and a vhost pointing at the same
   Laravel root as the other hosts.
5. Ensure `storage/logs` and `storage/framework/sessions` are writable by the web user.
6. Before adding a second app server, move sessions off `file`.
