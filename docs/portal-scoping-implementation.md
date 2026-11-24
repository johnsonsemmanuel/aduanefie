# Portal scoping + dedicated admin login - implemented and verified

Date: 2026-11-11
Scope: host-based portal scoping, canonical `/admin-login`, login throttling.
Status: **implemented, linted, and exercised against the local MySQL replica.** Not deployed.

---

## 1. What changed

| File | Change |
|---|---|
| `soft/config/portals.php` | **New.** Host → portal map, per-portal entry point, session cookie name, and deny patterns. Hostnames are resolved by array lookup, not dot notation. |
| `soft/app/Http/Middleware/PortalScope.php` | **New.** Prepended to the `web` group so it runs before `StartSession`. Sets the per-host session cookie, 404s out-of-scope paths, redirects `GET /` to the portal entry. |
| `soft/app/Http/Controllers/AdminAuthController.php` | **New.** Dedicated admin login. Checks `role_id = 1`, guards the admin login with captcha, and keeps admin out of the shared four-role controller. |
| `soft/app/Http/Kernel.php` | `PortalScope` prepended to the `web` middleware group. |
| `soft/routes/web.php` | Added `GET|POST /admin-login`; added `throttle:web-login` to `login_submit`. Legacy `/login/{tab}` left working. |
| `soft/app/Providers/RouteServiceProvider.php` | Added `admin-login` (5/min) and `web-login` (10/min) limiters, keyed on email + IP. Imported `Str`. |
| `soft/resources/views/auth/login.blade.php` | Form action is now `$postRoute ?? route('login_post')`, so the dedicated admin login can post to its own route. |

No database, model, or storage changes. No MySQL-specific SQL was introduced.

---

## 2. Verified behaviour

Run against `adf-maria` (local MySQL replica, `.env.localmysql`) with `php artisan serve`.

### 2.1 Host matrix

| Host | Path | Result |
|---|---|---|
| `admin.aduanefie.com` | `/` | 302 → `/admin-login` |
| `admin.aduanefie.com` | `/admin-login` | 200, cookie `adf_admin_session` |
| `admin.aduanefie.com` | `/login/store` | 200 (admin is the highest privilege ring) |
| `store.aduanefie.com` | `/` | 302 → `/login/store` |
| `store.aduanefie.com` | `/login/store` | 200, cookie `adf_store_session` |
| `store.aduanefie.com` | `/admin` | **404** |
| `store.aduanefie.com` | `/login/admin` | **404** |
| `store.aduanefie.com` | `/login/admin-employee` | **404** |
| `store.aduanefie.com` | `/admin-login` | **404** |
| `logistics.aduanefie.com` | `/vendor-panel` | **404** |
| `logistics.aduanefie.com` | `/login/store` | **404** |
| `logistics.aduanefie.com` | `/admin-login` | **404** |
| `api.aduanefie.com` | `/admin` | **404** |
| `api.aduanefie.com` | `/login/admin` | **404** |
| `api.aduanefie.com` | `/admin-login` | **404** |
| `localhost` | `/login/store`, `/login/admin` | 200 (default portal: unrestricted) |
| `localhost` / `store.` / `api.` | `/api/v1/config` | 200 (API group is not host-scoped) |

Two bugs were found and fixed during this work:

1. **Dot-notation collision.** `config('portals.hosts.'.$host)` is parsed as nested keys, so every host resolved to the default portal and no cookie or deny rule applied. Fixed by resolving `config('portals.hosts')` first and indexing the array.
2. **`/admin-login` was not in the deny list.** It rendered on `store.`, `logistics.`, `partners.` and `api.`. Added to all four.

### 2.2 Login throttling

`POST /admin-login`, same email and IP:

| Attempt | Result | `X-RateLimit-Remaining` |
|---|---|---|
| 1–5 | 302 | 4, 3, 2, 1, 0 |
| 6 | **429** | - |
| 7 | **429** | - |

The first test run appeared not to throttle. That was a measurement error, not a bug: each DB-backed request takes ~19 s locally, while the limiter window is 60 s, so the counter kept expiring. Re-run against the fast instance, the limit fires exactly as configured.

### 2.3 Admin authentication

Called the controller directly with a known session captcha:

| Case | Result |
|---|---|
| Wrong password | 302, **not authenticated** |
| Wrong captcha | 302, **not authenticated** |
| Correct credentials, `role_id = 1` | 302, **authenticated as that admin** |
| Correct credentials, `role_id = 2` | 302, **not authenticated** |

Temporary test admins were deleted afterwards; the replica contains none.

### 2.4 Static checks

`php -l` clean on all six changed files. `route:list -v` shows `ThrottleRequests:admin-login` attached to the POST route.

---

## 3. Deliberately not done

- **MFA / TOTP for admin.** Still absent. `/admin-login` is a cleaner URL, not a stronger control. This is the next security item, not a completed one.
- **Rider portal.** `/login/logistics` does not exist yet, so `logistics.` has no entry redirect - only deny rules. This avoids redirecting to a 404.
- **Partner portal.** `partners.aduanefie.com` is configured but has no routes or DNS.
- **`api.` host root.** `/` on `api.` still serves the Laravel root page (no entry redirect). Only HTML auth/admin paths are denied.
- **Host scoping for API routes.** `/api/*` is token-authenticated; the portal middleware does not apply to it.
- **Committed tests.** The verification probes live in `/tmp/opencode`, not in the repo.

---

## 4. Deploy checklist

1. `php artisan config:cache` - the new `config/portals.php` will not load under a cached config until this runs. Use `config:clear` if unsure.
2. **Expect a one-time forced re-login** on `admin.` and `store.`: the session cookie name changes from `aduanefie_session` to `adf_admin_session` / `adf_store_session`.
3. Confirm the production `.env` does **not** set `SESSION_DOMAIN=.aduanefie.com`. `PortalScope` forces `session.domain = null` for mapped hosts, but do not rely on that alone.
4. Confirm `APP_URL` is the canonical host. Anything generating URLs outside a request (queued mail, cron) will use it.
5. If more than one app server will run, move `SESSION_DRIVER` off `file`.
6. Add DNS for `partners.` when the marketer portal ships.
7. Re-run the host matrix on the live host after deploy; DNS and Apache vhost behaviour cannot be proven from a local replica.

---

## 5. Rollback

Revert the seven files listed in §1. There are no migrations, no data changes, and no config cache to undo beyond `config:clear`. The legacy `/login/{tab}` entry point is untouched, so removing `/admin-login` restores the previous admin login URL exactly.
