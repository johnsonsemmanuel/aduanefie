# Admin MFA/TOTP - implementation and verification

Commit: `bb4beb2` (`Require TOTP two-factor for every admin session`), on top of
`61ef006`.

This document is written from the committed diff, not from the plan. File names,
line-level behaviour and the verification results below were read back after the
commit.

## What this enforces

Every account on the `admin` guard - super admin, the five staff roles, and the
14 Remote Marketer admins - must present a TOTP code (or a one-time recovery
code) before any admin route is reachable. There is no config switch to weaken
this and no role exemption.

The important property is **no authenticated-but-unverified admin session
exists**. A password step that succeeds does not create a usable login: the
guard session is destroyed, and the only thing kept is a short-lived "pending"
marker bound to the admin id. The real session is created by
`AdminMfaService::complete()` after the second factor passes.

## Entry points, and why the gate is where it is

Four paths could previously create an `admin` session. A gate on only one of
them would be the exact bug this work exists to prevent.

| Entry point | Old behaviour | Now |
|---|---|---|
| `POST /admin-login` | `AdminAuthController@login`, role_id 1 only | `begin()` → challenge or forced enrolment |
| `POST /login_submit`, tab `admin` | `LoginController@submit` → `login_attemp` | same interception in `login_attemp` |
| `POST /login_submit`, tab `admin-employee` | same guard, `admin_employee` role | same interception; both tabs land on the `admin` guard |
| `POST /external-login-from-drivemond` | `loginUsingId()`, no password | **refused**; redirects to `/admin-login` with an error |
| remember-me recaller cookie | auto-auth on the next request | session is discarded; no panel access |

Two route files register admin routes: `routes/admin.php` and
`routes/admin/routes.php` (229 routes in the second file). Rather than add the
`admin-mfa` alias to each group and hope a third file never appears,
`AdminMiddleware` - the single middleware both files already use - now delegates
to `AdminMfa` for authenticated admins. The explicit `admin-mfa` alias on the
main panel group remains as a second layer. A test in the harness proves a real
route from the second file is gated.

The recaller case is covered because `AdminMfaService::begin()` calls
`logout()`, which unqueues the `remember_admin_*` cookie. The harness starts
from a recaller-only cookie jar and confirms it lands on `/admin-login`.

## Files

Added:

- `soft/app/CentralLogics/Totp.php` - RFC 6238 TOTP and RFC 4648 base32,
  implemented locally. No composer dependency was added; the admin panel is the
  only consumer. SHA-1 / 6 digits / 30 seconds, ±1 step window.
- `soft/app/Services/AdminMfaService.php` - all MFA rules: `begin()`, `pending()`,
  `isVerifiedFor()`, `verifyCode()`, `confirmSetup()`, `complete()`, recovery-code
  generation and consumption.
- `soft/app/Http/Middleware/AdminMfa.php` - per-request backstop. Logs out and
  redirects to the password step when a session has not passed the factor.
- `soft/app/Http/Controllers/AdminMfaController.php` - challenge, forced setup,
  and the one-time recovery-code page.
- `soft/app/Console/Commands/ResetAdminMfa.php` - CLI-only lockout recovery.
- `soft/config/admin_mfa.php` - issuer, window, pending TTL 300 s, session TTL
  43200 s (12 h), 8 recovery codes.
- `soft/database/migrations/2026_11_11_000001_add_two_factor_to_admins_table.php`
- Four views: `resources/views/auth/mfa-layout.blade.php` plus
  `mfa-challenge`, `mfa-setup`, `mfa-recovery-codes`.

Modified:

- `AdminAuthController` - `/admin-login` starts the MFA flow instead of creating
  a session; `showLogin` only treats a verified session as logged in.
- `LoginController` - `login_attemp` intercepts both admin tabs and returns
  `admin_mfa` / `admin_mfa_setup`; DriveMond bridge refused; logout clears the
  MFA session keys. The now-unreachable `$data == 'admin'` branch was removed.
- `AdminMiddleware` - delegates to `AdminMfa` (described above).
- `RedirectIfAuthenticated` - a half-authenticated admin is logged out rather
  than redirected into the panel.
- `Admin` model - encrypted casts, hidden attributes, and
  `hasConfirmedTwoFactor()` which catches `DecryptException` so an `APP_KEY`
  rotation degrades to re-enrolment instead of a 500.
- `Kernel`, `RouteServiceProvider` (6/min challenge limiter keyed on pending
  admin id + IP), `routes/web.php`, `routes/admin.php`, `config/portals.php`
  (`admin-mfa` and `admin-mfa/*` are 404 on store, logistics, partners and api
  hosts), and one auto-registered translation key in `messages.php`.

## Schema

Four nullable columns on `admins`:

| Column | Type | Purpose |
|---|---|---|
| `two_factor_secret` | TEXT | encrypted by the model cast |
| `two_factor_recovery_codes` | TEXT | `encrypted:array` of SHA-256 hashes |
| `two_factor_confirmed_at` | TIMESTAMP | null means not enrolled |
| `two_factor_last_step` | UNSIGNED BIGINT | last accepted TOTP step, replay guard |

The secret is reversible and is in `$hidden`; the recovery codes are hashes and
are also hidden. Recovery codes are single use: a successful match removes that
hash from the array.

## Behaviour details worth knowing

- **Forced enrolment.** An unenrolled admin who passes the password is sent to
  `/admin-mfa/setup`, shown a base32 key (manual entry) and an `otpauth://` link,
  and must enter a current code. The code that confirms enrolment is consumed,
  so an immediate re-login inside the same 30-second step must wait for the next
  code. This is intentional replay protection, not a bug.
- **TTLs.** The pending marker expires after 300 s; a completed MFA session
  expires after 12 h. Both are checked server-side. Expired pending markers and
  expired/foreign-id verified markers are rejected and removed.
- **Rate limits.** `/admin-login` is 5/min keyed on email + IP. The challenge is
  6/min keyed on pending admin id + IP, so one account cannot be brute-forced
  and a shared office IP cannot lock everyone out.
- **Host scoping.** The MFA routes are served only on the admin host. On store,
  logistics, partners and api hosts they return 404, matching the existing
  denial rule (404, never a redirect).
- **Lockout recovery.** `php artisan admin:mfa-reset {email} [--force]` clears
  the four columns. The next login re-enters forced enrolment. There is no web
  path to clear a second factor.

## Verification (what was actually run)

Harness: `/tmp/opencode/admin_mfa_test.sh` against the local MySQL replica
(`adf-maria`) via `artisan serve`, plus `/tmp/opencode/mfa_unit.php` for the
rules the HTTP harness cannot wait for.

Result: **67 passed / 0 failed**, covering:

- forced enrolment, displayed secret, recovery-code issue, codes cannot be
  re-read;
- challenge, wrong code, replay of a consumed step;
- single-use recovery codes (first accepted, same one rejected, next accepted);
- legacy `/login_submit` for both `admin` and `admin_employee`;
- remember-me cannot bypass the factor (recaller-only request is bounced);
- challenge throttle 6 allowed → 7th 429;
- host matrix: `/admin-mfa` and `/admin-mfa/setup` are 404 on store, logistics,
  partners and api;
- DriveMond bridge no longer creates a session;
- mid-session `admin:mfa-reset` revokes an already-open session (fails closed);
- unit checks: id binding, missing marker, TTL expiry, un-enrolled admin
  rejected mid-session, pending-marker expiry and removal;
- a real route from `routes/admin/routes.php` is gated for a pending session and
  reachable after verification.

TOTP maths was independently checked against all 10 RFC 4226 HOTP vectors and
the three RFC 6238 TOTP vectors (6-digit truncation), plus base32 round-trip and
window behaviour.

Rider regression after the shared `LoginController` / `RedirectIfAuthenticated`
edits: rider login, dashboard, earnings, logout, wrong password, suspended,
pending, mid-session suspension, mid-session un-approval, 5→429 throttle, and
the host matrix all passed. Fixtures (three riders and two order assignments)
were removed afterwards and the orders restored to `delivery_man_id = NULL`.

## Deploy order

1. Run the migration **before** the new code serves traffic. Without the
   columns, `begin()` throws on save.
2. Regenerate cached config if the deployment uses `config:cache` (new
   `config/admin_mfa.php`).
3. Expect all 23 existing admins to enrol at their next login. There are no
   pre-enrolled accounts, so the first login after deploy is an enrolment, not a
   challenge.

For the Supabase `legacy` schema, the equivalent `ALTER TABLE legacy.admins` has
to be applied manually; the migration has only been executed against MySQL.

## Known gaps (deliberately deferred, not hidden)

- No in-panel re-enrolment and no way to re-issue recovery codes from the UI.
  The only recovery is the CLI command above.
- No "remember this browser for 30 days" trusted-device option. The 12-hour
  session TTL is the bound.
- DriveMond SSO is disabled for the panel. Re-enabling it requires a
  second-factor handshake inside the DriveMond flow; a password-less bridge
  cannot produce a second factor.
- The setup page shows a manual key and an `otpauth://` link, not a rendered QR
  image. There is no QR library in `composer.json`, and adding one was not
  justified for a manual-entry fallback that every authenticator supports.
- `hasConfirmedTwoFactor()` fails closed to re-enrolment if the encrypted secret
  cannot be decrypted (for example after an `APP_KEY` rotation). That is a
  deliberate availability trade-off: the admin must re-enrol rather than be
  locked out or waved through.
