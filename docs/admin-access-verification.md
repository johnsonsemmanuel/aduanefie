# Admin & Vendor Access Verification

Date: 2026-11-11
Method: live HTTP checks against `admin.aduanefie.com`, `store.aduanefie.com`, `vendor.aduanefie.com` plus source review of the admin panel code and the live SQL snapshot (`aduanefiemarketplace-353032377464.sql`).

## Access URLs (verified live)

| Surface | URL | Status |
|---|---|---|
| Admin login | `https://admin.aduanefie.com/login/admin` | 200 — "Admin Login", `role=admin` |
| Admin employee login | `https://admin.aduanefie.com/login/admin-employee` | 200 — "Admin employee Login", `role=admin_employee` |
| Vendor (store) login | `https://admin.aduanefie.com/login/store` | 200 — "Vendor Login", `role=vendor` |
| Vendor employee login | `https://admin.aduanefie.com/login/store-employee` | 200 — "Vendor employee Login", `role=vendor_employee` |
| Admin dashboard | `https://admin.aduanefie.com/admin` | 302 → `/` (guest gate) |
| Vendor dashboard | `https://admin.aduanefie.com/vendor-panel` | 302 → `/` (guest gate) |
| Vendor registration | `https://admin.aduanefie.com/vendor/apply` | 200 |

The vendor dashboard is **`/vendor-panel`**, not `/vendor-panel/dashboard`. In `routes/vendor.php` the dashboard is the group root (`Route::get('/', ...)->name('dashboard')`), so `/vendor-panel/dashboard` correctly 404s.

Aliases that also work:
- `https://store.aduanefie.com/login/store`, `/login/store-employee`, `/vendor-panel`
- `https://vendor.aduanefie.com/login/store`, `/login/store-employee`, `/vendor-panel`

All three hostnames serve the same Laravel app. Admin and vendor routes are **not** host-restricted at the web-server/domain level; access is enforced by the `admin` / `vendor` route middleware after login.

## Auth pipeline checks (safe, non-destructive)

| Check | admin | admin-employee | store | store-employee |
|---|---|---|---|---|
| POST `/login_submit` without CSRF token | 419 | 419 | 419 | 419 |
| POST with valid CSRF + wrong captcha | 302 back to same login, "ReCAPTCHA Failed" | same | same | same |
| Rate-limiter reached | no (captcha fails first) | no | no | no |

Also verified:
- `http://` → `https://` returns 301 on all three hostnames.
- Login cookies: session cookie is `Secure` + `HttpOnly`; `XSRF-TOKEN` is `Secure` (not HttpOnly, which is normal for Laravel).
- Response headers do **not** include HSTS, `X-Frame-Options`, `Content-Security-Policy`, or `Referrer-Policy` on the login page.
- The session cookie does not declare `SameSite` in the response.

## What 404s (expected)

`/login`, `/login/vendor`, `/login/admin_employee`, `/login/store_employee`, `/admin/login`, `/vendor-panel/dashboard`, `/dashboard`, `/restaurant`, `/store-panel`.

Use the hyphenated routes shown in the table above.

## Roles and accounts (from the live SQL snapshot)

- Super admin: `info@aduanefie.com` (admin id 1, `role_id=1`, name "Emmanuel Johnson-Excellent").
- 23 admin accounts exist across `role_id` 1–6.
- Vendor/store accounts exist in `vendors` / `stores`; `vendor_employees` includes `charlesanakwah01@gmail.com`.
- Admin login rejects `role_id != 1` for the `admin` tab; `admin_employee` is the tab for non-super roles. This is enforced in `LoginController::submit`.

## Gaps / findings

1. **Authenticated dashboards not yet verified.** Full login requires the account password plus solving the custom captcha. The login forms, CSRF, captcha rejection, and guest gates are verified; the post-login dashboards are only verified at the route/middleware level.
2. **Guest redirect goes to the marketing page.** `AdminMiddleware` and `VendorMiddleware` redirect unauthenticated users to `route('home')` (the landing page), not to the login form. Works as coded, but users hitting `/admin` or `/vendor-panel` directly get bounced to the storefront instead of a login prompt.
3. **No host-level panel separation.** `admin.`, `store.`, and `vendor.` hostnames all expose `/admin` and `/vendor-panel`. If the intent is that store/vendor hostnames must never serve the admin panel, that has to be enforced by host middleware or web-server rules; it currently is not.
4. **Missing security headers** on the panel (HSTS, X-Frame-Options/frame-ancestors, CSP, Referrer-Policy).
5. **Live DB not reachable from this workstation** (`sdb-61.hosting.stackcp.net` does not resolve here), so DB-level checks used the 2026-10-30 SQL snapshot, not a live query.
6. **Live schema and workspace code drift.** The live DB records 223 migrations; `soft/database/migrations` contains 195 files. The SQL snapshot, not the workspace migrations, is the authoritative live schema.

## Blocked

Authenticated verification of the admin dashboard, vendor dashboard, and role-restricted menus is still open.

The login captcha (`custome_recaptcha`, a Gregwar image embedded as base64 JPEG) cannot be solved from this workstation: there is no OCR engine installed and this model has no image input. So the login step itself must be done in a browser.

Chosen path (2026-11-11): throwaway test admin.

1. Create a temporary account:
   - Super-admin (`role_id=1`, works on `/login/admin`): insert via phpMyAdmin, or
   - Any other role (`role_id` 2–6, works on `/login/admin-employee`): create it in the panel at `/admin/employee` (Add new employee). Assign a custom role with limited permissions if you want role-restriction evidence.
2. Log in once in the browser to clear the captcha.
3. Hand over one of:
   - the `aduanefie_session` cookie value plus the hostname used (short-lived: 120 minutes), or
   - the page titles/status codes for `/admin`, `/admin/dashboard`, `/vendor-panel` after login.
4. Delete the throwaway account and rotate anything shared afterwards.

Once a session is available, the remaining checks are: admin dashboard loads, role-restricted menus differ by `role_id`, vendor dashboard loads for a vendor account, and vendor-employee lands on the vendor panel.

