# Aduanefie End-to-End Security Audit

Date: 2026-11-21

## Scope and method

This is a static, code-level audit of the Aduanefie Laravel + Next.js marketplace. No runtime exploitation was performed and no application source was changed. Every finding below was produced by reading the actual current files, and the highest-severity items were independently re-verified against git history and source after the individual reports were written.

Systems in scope:

| System | Path | Role |
|---|---|---|
| Canonical backend | `/tmp/opencode/backend-group-buy` | Deployed `backend/main` Laravel app, 195 controllers, 145 models |
| Frontend | `Aduanefie/frontend` | Next.js 15 pages-router app |
| Root tree | repository root | Frontend mirror, `.env` files, 3.8 MB SQL dump, divergent `backend/` |

Companion detailed reports are in `/tmp/opencode/security-audit/`:

- `01-auth.md` (581 lines): authentication, MFA, password reset, guest identity
- `02-authorization.md` (832 lines): access control, IDOR, role enforcement
- `03-groupbuy-payment.md` (396 lines): group-buy lifecycle, payments, escrow, invites, trust badge
- `04-data-exposure.md` (433 lines): privacy, injection, XSS, SSRF, uploads, secrets
- `05-frontend.md` (667 lines): token storage, client sinks, config, third-party scripts
- `06-infrastructure.md` (282 lines): CORS, headers, secrets in git, containers, deployment

"Verified" means the source pattern exists in the current files. It does not mean a live exploit was run. Items needing deployed configuration or live requests are listed as hypotheses.

## Executive summary

The system has a large number of independently exploitable access-control gaps, two committed private keys, and an XSS-to-token-theft chain that makes client-side injection materially worse than a normal DOM bug. The most serious problems are not subtle. Entire controller groups sit outside authentication middleware, a vendor token middleware fails open, anonymous endpoints issue real Passport tokens, and a public group-detail endpoint serialises member delivery addresses and GPS coordinates.

There is also a process failure that is as important as any single bug. During this audit window, two concurrent commits silently removed the organizer trust and invite integration that had been reviewed, committed and pushed three separate times. A feature can be "shipped" and still vanish from the deployed branch. Any remediation plan must include a check that changes land and stay landed.

Consolidated severity counts (deduplicated across the six reports):

| Severity | Count | Representative issue |
|---|---|---|
| Critical | 11 | Committed Apple key, unauthenticated vendor billing API, DriveMond login bypass |
| High | 34 | Guest IDORs, stored XSS to token theft, SSRF, fake escrow, SQL dump in repo |
| Medium | 24 | No CSP, shared rate-limit buckets, OTP backdoor by config, reset tokens not revoked |
| Low | 14 | Broad CORS allowlist, HSTS not preloaded, deploy scripts with no verify step |

### What an attacker can do today, from the code

1. Mint a Passport token for any existing customer whose phone number they know, by calling `external-login` with a 6-character token string.
2. Get a Passport token for any account with an empty first name by calling the public `update-info` with its phone or email plus a name.
3. Change any store's subscription plan, activate a free trial, or spend its wallet balance through unauthenticated vendor routes by supplying a `store_id`.
4. Read any group's participant list, including delivery addresses and GPS coordinates, from the public `show()` endpoint.
5. Read or cancel other people's orders, cart rows and addresses through ownership-free endpoints keyed by raw IDs.
6. Store HTML in a vendor product description, then steal any customer's Passport token from `localStorage` when they open the product page.

## Critical findings

### C-01. Apple Sign In private key is committed and still present

Sources: `04-data-exposure.md` C-1, `06-infrastructure.md` C-2

- Path: `/tmp/opencode/backend-group-buy/app/Library/AuthKey_U7KA7F82UM.p8` lines 1 to 6, tracked, mode 664.
- Independently verified: `head -1` returns `-----BEGIN PRIVATE KEY-----`; `git ls-files` lists the file.
- Used at `app/CentralLogics/helpers.php:3229-3234` with a hardcoded key ID and team ID.
- Added in commit `201e27c0` and `4defbc80` depending on history view, reachable from `backend/main`, present at HEAD.
- An admin can also upload a `.p8` through `BusinessSettingsController.php:2779-2796` via `Helpers::upload()`, which defaults to the public disk under `storage/app/public` and the docker-entrypoint creates a public symlink.
- Impact: sign Apple client secrets, impersonate the configured Apple app, and potentially place a signing key in a fetchable public path.
- Remediation: revoke the key in the Apple Developer portal now, generate a replacement, store it only in a secret store outside the repo, load by absolute path, add `*.p8` and `*.key` to `.gitignore`, deny those extensions at nginx, and rewrite history.

### C-02. Passport OAuth private key in backend git history

Source: `06-infrastructure.md` C-1

- Commit `1ce45040` added `storage/oauth-private.key` and `storage/oauth-public.key`; `201e27c0` deleted them. Independently confirmed with `git log --all --oneline -- storage/oauth-private.key`.
- Deletion does not remove the key from history. If the deployed key is the same, anyone with repo access can sign arbitrary Passport tokens.
- Remediation: rotate with `php artisan passport:keys --force`, revoke all access tokens, purge history on `backend/main` and forks, and keep the remote private until rotation is verified.

### C-03. DriveMond external login issues a victim token without validating the client token

Source: `01-auth.md` V-01, independently verified

- `CustomerAuthController.php:1236-1331`, route `POST /api/v1/auth/external-login`.
- The method looks up the user by phone first. The DriveMond token check at line 1253 is inside `if (!$user)`, so an existing user skips it entirely. Lines 1302 to 1303 then call `Auth::loginUsingId($user->id)` and create a Passport token.
- Exploit: know a victim's phone, send `phone` plus any `token` of at least 6 characters, receive a valid token for the victim.
- Conditional on `Helpers::checkSelfExternalConfiguration()` being active, which needs runtime confirmation.
- Remediation: validate the external token on every request and derive identity from the verified provider response, never from a client-supplied phone.

### C-04. Public `update-info` issues a Passport token without proof of ownership

Source: `01-auth.md` V-02, independently verified

- `CustomerAuthController.php:1118-1220`, route `POST /api/v1/auth/update-info` with no auth middleware.
- Looks up the user by phone for `otp`/`manual` or by email for `social`; if `f_name` is empty, sets the name and calls `loginUsingId` plus `createToken`.
- Exploit: name an account with no first name, supply a name, and receive a token. No OTP, password or email proof.
- Remediation: require and verify an OTP or signed one-time link bound to the account before any token issuance, and never let unauthenticated input select the identity row.

### C-05. Vendor subscription API is unauthenticated

Source: `02-authorization.md` V-01, independently verified

- `routes/api/v1/api.php:74-82` registers `business_plan`, `subscription/payment/api`, `package-renew`, `cancel-subscription` and `check-product-limits` with no auth middleware.
- `SubscriptionController` reads `store_id` from the request, then mutates the plan, wallet and subscription by that raw ID.
- Exploit: change any store to commission, activate a free trial, or decrement a victim store's wallet.
- Remediation: put the whole group behind vendor authentication and derive `store_id` from the authenticated vendor, never from input.

### C-06. `VendorTokenIsValid` fails open

Source: `02-authorization.md` V-02, independently verified

- `app/Http/Middleware/VendorTokenIsValid.php` validates a token only when `vendorType` is exactly `owner` or `employee`.
- Any other header value skips both branches, leaves `$request['vendor']` unset, and falls through to `return $next($request)`.
- A non-empty bearer token plus an arbitrary `vendorType` is enough to pass. Service module controllers then use request-supplied `provider_id` with no ownership filter.
- Remediation: reject any unknown `vendorType` with 401, only set request identity from a verified token, and add a test that an invalid type cannot pass.

### C-07. Service module admin web panel and provider APIs are unauthenticated

Source: `02-authorization.md` V-03

- Service module registers admin web routes including dashboard, categories, providers, bookings and reports under only the `web` middleware group.
- Provider APIs map to the fail-open vendor token middleware and accept raw `provider_id`.
- Exploit: unauthenticated category CRUD and cross-provider data access.
- Remediation: apply the admin middleware to the web panel and the corrected vendor token middleware to provider APIs, with ownership checks in every controller.

### C-08. Unauthenticated write to platform external configuration

Source: `02-authorization.md` V-04

- `POST /configurations/store` is reachable without authentication and writes platform external configuration, the same configuration that governs external login and partner integrations.
- Chains directly with C-03: an attacker could set configuration and then log in as a victim.
- Remediation: admin-only middleware, server-side validation of each key, and an audit log for changes.

### C-09. Public group detail serialises member PII

Source: `03-groupbuy-payment.md` verified finding; independently re-verified during this audit

- `GroupBuyController::show()` eager-loads `participants` and `events` and returns `$group->toArray()` on the public `GET /api/v1/group-buys/{id}` route.
- `GroupBuyParticipant` has no `$hidden` property, so `delivery_address`, `gps_lat`, `gps_lng`, `user_id`, consent timestamps and leave notes are all exposed.
- `GroupBuyEvent` also has no `$hidden`, so event `meta` and `actor_id` are exposed.
- Remediation: add `$hidden` for those fields on both models and explicitly select safe columns in the eager loads. Public group detail needs only name, avatar, badge and joined count.

### C-10. Admin upload chain permits PHP execution in public storage

Source: `04-data-exposure.md` H-4

- `Helpers::upload()` does no MIME, extension or size validation and writes to the public disk.
- nginx passes `.php` requests in that tree to php-fpm, and the public symlink is created at boot.
- An admin or any endpoint reaching that helper can place an executable PHP file in a public path.
- Remediation: strict allowlist of extensions and MIME types, store uploads outside the web root, serve via a controlled route, deny PHP execution in the storage location, and scan uploads.

### C-11. Stored XSS in product descriptions steals the Bearer token

Sources: `04-data-exposure.md` H-1, `05-frontend.md` token findings

- `Vendor/ItemController.php` stores `translations` descriptions without sanitization.
- `src/components/product-details/details-and-reviews/Details.js:7-23` renders the description via `dangerouslySetInnerHTML`.
- The auth token is in `localStorage` (`src/components/auth/sign-in/index.js:209`) and `MainApi.js:24` attaches it to every API call.
- Exploit: a vendor stores script in a description, a customer opens the page, the script reads `localStorage.token` and exfiltrates it. The attacker then acts as that customer.
- Remediation: sanitize HTML server-side with a strict allowlist, or render plain text; move the token out of `localStorage` into an HttpOnly, Secure, SameSite cookie and add a Content-Security-Policy.

## High findings

The individual reports contain full evidence and code excerpts. Grouped here for triage.

### Access control and IDOR (`02-authorization.md` V-05 to V-19)

- Guest and authenticated order details read arbitrary order IDs with no owner scope.
- Offline payment records and reorder act on arbitrary order IDs.
- Cart update and delete reassign or remove other users' rows.
- Saved address update overwrites another user's address and changes ownership.
- Product reviews can be submitted against any order, and review reminders cancelled for any order.
- Customer, vendor, delivery-man and web vendor chat all trust arbitrary `conversation_id` and ignore store scope.
- Web vendor registration mutates arbitrary store billing state without authentication.
- Trade invoice and contract endpoints expose any order's buyer and store PII and post it to an external service.
- Vendor panel coupon, banner, advertisement and review-reply IDORs.
- Admin zone coordinate endpoints and web invoices sit outside their intended guards.
- `APIGuestMiddleware` accepts any `Authorization` header because `app('auth')->guard('api')` is always truthy, and merges a possibly null user.

### Authentication and sessions (`01-auth.md` V-03 to V-09, V-13)

- `guest_id` is a client-supplied sequential integer used directly as `user_id` for order listing, running orders and cancellation.
- Marketer portal is password-only unless `MARKETER_MFA_REQUIRED` is set, and payout routes are reachable.
- Customer, vendor and web reset submit endpoints bypass their own OTP verification lockouts.
- Password resets do not revoke existing Passport tokens.
- Bearer tokens are stored in `localStorage`; frontend route guards check token presence, not validity.
- Guest cart migration trusts a client-supplied `guest_id`.

### Group buy, payments and money (`03-groupbuy-payment.md`)

- "Escrow" is a string flag. `releaseEscrow()` moves no funds, is not gated on delivery, and has no reversal path for captured payments.
- Bulk pricing tiers are read live at checkout, so the price snapshot is not enforced. An admin catalogue edit between join and checkout changes what members pay.
- Food items with variations bypass the group price and quantity guard, allowing a member to pay a retail price for one unit while claiming a fixed share.
- Consent write path is dead, cancel/expire notifications are missing and locked-group cancel is a silent no-op.
- Group-buy mail bypasses notification opt-ins.
- Trust-badge order count ignores payment status.
- Invite rate limits are race-prone with no DB uniqueness.
- `groupCreated()` is never called; notification and upload failures are swallowed; a client-supplied delivery charge is shown as payable but not charged.

### Data exposure and injection (`04-data-exposure.md` H-2 to H-5)

- Server-side SSRF through wildcard Next image remote patterns: `images.remotePatterns` allows any HTTP or HTTPS host, including private addresses, and middleware excludes `/_next/image`.
- The 3.8 MB production SQL dump is untracked but not gitignored. Independently verified with `git check-ignore`: no rule matches. One `git add .` commits probable password hashes and PII.
- Unescaped HTML in invoice and trade-contract print windows.
- Raw exception messages returned by API controllers, including an upstream URL containing an OAuth token.

### Frontend (`05-frontend.md`)

- Bearer token placed in a media proxy URL query string (`pages/api/reels/stream.js`, `ReelsModal.tsx`), so it lands in logs, history and referrers.
- Remember-me stores the plaintext password in `localStorage`.
- Backend-provided analytics values interpolated into executable inline scripts.
- Unescaped HTML written into a same-origin popup.

### Deployment and supply chain (`06-infrastructure.md` H-1 to H-4)

- Live `.env` with production credentials on disk in the repo root, correctly ignored but one copy away from exposure.
- Deployable backend layout diverges from root `main`; critical configs are untracked there.
- Admin and payment Blade views load `polyfill.io` (compromised CDN in 2024) and jQuery 3.4.1 without SRI.

## Medium and low findings

Summarised here; full detail in the companion reports.

- No Content-Security-Policy on backend or frontend.
- All per-IP throttles key on the proxy address because `TrustProxies` is disabled. XFF spoofing does not bypass limits, but all users collapse into one bucket.
- `APP_DEBUG` defaults to true in application config.
- Session cookies lack explicit Secure and SameSite; the HTTPS flag is client-controllable.
- Automatic forced migrations on every container start.
- Test and demo OTP `123456` branches remain in code and are critical if production runs with `APP_MODE=test` or `demo`.
- Several authentication endpoints rely only on the global API limiter.
- Sensitive provider responses logged by an SMS gateway.
- Historical `.env.railway` and `.env.example` contain real-looking APP_KEY values.
- Container build uses a mutable base image, `curl | php` for Composer without checksum verification, `--ignore-platform-reqs`, and runs as root.
- Laravel 10 is EOL and several dependencies are old or unpinned.
- CORS allowlist is broad (`*.aduanefie.com`, `*.vercel.app`, any localhost port, wildcard methods and headers) but low risk while `supports_credentials` is false and APIs use bearer tokens. Narrow it anyway.
- HSTS present but not preloaded; no TLS in the container.
- Vercel OIDC token present in frontend local environment file.
- Deploy scripts bypass CI and have no verification step.
- No symmetric audit logging for authentication outcomes.
- Ghana Card fields are not hidden on the `User` model. The masked reference and review note need `$hidden` in addition to the current serialization work.

## Cross-cutting process findings

### P-01. Pushed integrations are silently reverted by concurrent commits

This happened three times to the trust/invite work in this session alone. Commits `b5b3422e`, `0633ac60`, and then `50ad2954` and `63eaf29f` each left the new service and migration files in place while dropping controller methods and routes. After the third occurrence, `grep` confirmed that `organizer_trust`, `verification`, `invite` and the routes were all gone from the canonical branch again.

The practical risk is larger than the trust feature. Any security fix committed to one worktree can be erased by a later commit made from a stale base, with a clean build and a green test run giving no warning.

Required controls:

- Reconcile all worktrees against `backend/main` before every commit.
- Add a smoke test that asserts security-critical routes exist and return expected auth codes.
- Make one person or one automated job responsible for merging concurrent streams.
- Never commit from a worktree whose base is older than the remote head.

### P-02. Two divergent backend trees

Root `main` is ahead 84 commits with uncommitted modifications, while the deployable backend is `backend/main` in a separate layout. Several security configs exist in only one tree. A deployment from the wrong tree silently omits CORS, auth, session, cache and container configuration.

### P-03. Local verification artifacts adjacent to repositories

The production SQL dump and live `.env` sit in the repository root. The dump is not ignored. This is one accidental `git add .` away from a public leak.

## What is verified OK

These were explicitly checked and found sound in the current code:

- Admin and vendor MFA core logic. The historical broken-enrollment downgrade was not found.
- The DriveMond admin SSO bridge is disabled.
- No charge at group join; group buy DB constraints prevent double join and double checkout, with a locked re-check.
- Group lifecycle guards, one-line cart enforcement at checkout, and server-derived `order_amount`.
- Invite identity, validation and sanitisation, and fail-closed badge eligibility in the service layer.
- CORS is low risk under the current bearer-token auth model; `supports_credentials` is false and there is no cookie auth on `api/*`.
- No committed `vendor` or `node_modules`; Firebase configs are env-based; OAuth keys are generated at boot with mode 600.
- No `.env`, `.sql`, `.key` or `.p8` file under any web docroot; no directory listing; DB not published by Docker config.
- HSTS and basic security headers are present at the edge.
- Traditional cookie-based CSRF was not found; state changes use a Bearer token, not ambient cookies.

## Remediation roadmap

### Immediate, within 24 hours

1. Revoke and rotate the Apple `.p8` key and the Passport private key; purge both from git history.
2. Disable or authenticate the four unauthenticated critical route groups: vendor subscription, service module admin, external config write, and any route with `withoutMiddleware('auth:api')`.
3. Fix `VendorTokenIsValid` to reject unknown `vendorType`.
4. Remove `participants` and `events` from public group `show()` or hide their fields.
5. Move the SQL dump out of the repo tree and add `*.sql` to `.gitignore`.
6. Confirm deployed `APP_MODE` is not `test` or `demo`; confirm DriveMond external config is disabled until C-03 is fixed.

### Short term, within one to two weeks

7. Rework external login and `update-info` to verify identity before issuing tokens.
8. Add ownership checks to every ID-based customer and vendor endpoint listed in the authorization report.
9. Sanitize product descriptions and remove `dangerouslySetInnerHTML` from user-controlled content.
10. Move the auth token out of `localStorage`; remove plaintext password storage and the token-in-URL media proxy.
11. Restrict image optimizer remote patterns and exclude private IP ranges; add a CSP.
12. Replace `polyfill.io`, update jQuery, and add SRI to all third-party scripts.
13. Validate uploads, deny PHP execution in storage, and store signing keys outside public disks.
14. Add `TrustProxies` configuration, explicit cookie flags, and correct rate-limit keys.

### Medium term

15. Implement real escrow or remove the escrow language and ensure reversal paths exist for any capture-capable gateway.
16. Enforce server-side price snapshots and variation-aware group checkout.
17. Add symmetric audit logging for auth success and failure, and revoke tokens on password reset.
18. Consolidate the two backend trees and make deployment reproducible from one source.
19. Add automated route/auth regression tests to prevent the silent-revert class of failure.
20. Schedule a follow-up audit with runtime testing once the highest fixes are deployed.

## Hypotheses needing runtime confirmation

- Whether `Helpers::checkSelfExternalConfiguration()` is active in production.
- Whether deployed `APP_MODE` is `test` or `demo`, which would activate the OTP backdoor.
- Whether `MARKETER_MFA_REQUIRED` is set in production.
- Whether Passport token expiry and revocation behave as configured.
- Whether the wildcard image optimizer can reach cloud metadata endpoints in the deployed network.
- Exact route reachability for module routes that could not be listed because `vendor/autoload.php` is absent locally.

## Limitations

- Static analysis only. No live target was scanned and no exploit was executed.
- The local backend has no `vendor/autoload.php`, no database and no `.env` DB settings, so `artisan route:list` and runtime request testing were unavailable.
- Findings marked critical are based on source patterns and git history. Runtime impact must be confirmed in staging before relying on any single item for a go or no-go decision.
- This report does not include a full dependency CVE scan, which requires network access and a running composer/npm audit.

## Remediation status (post-audit, recorded from `git log` / `git diff`)

This section was written after the fixes were committed and pushed. It records what is actually in the remote branches, not what was planned. Backend commits are on `backend/main`; frontend commits are on `origin/main`.

### Pushed fixes

| Commit | Change |
|---|---|
| `74e0323a` (backend) | DriveMond integration and unauthenticated external config write removed. |
| `093e795f` (backend) | Apple Sign In and the committed `AuthKey_U7KA7F82UM.p8` removed from HEAD. |
| `1ceb2c34` (backend) | Vendor authorization bypasses closed: fail-closed `VendorTokenIsValid`, authenticated subscription routes, HMAC onboarding token for `business_plan`, dead routes removed. |
| `e12d3943` (backend) | Service module admin/provider routes protected and ownership scoped. |
| `b5ae129` (frontend) | Signed onboarding token sent with store business plan. |
| `74f5ff70` (backend) | Public group `show()` no longer serialises participants/events; `$hidden` added to participant and event models. |
| `26024975` (backend) | `update-info` requires a short-lived, HMAC-signed, single-use profile-completion proof issued only after OTP/password/OAuth verification; route throttled. |
| `5cf24ce` (frontend) | Completion proof threaded through the profile form, including the existing-user re-login path. |
| `8020e86f` (backend) | Uploads validated by content-based MIME with fixed safe extensions and size cap; admin file manager path/zip hardening; nginx denies scripts and keys under public storage. |
| `180a9aa` (frontend) | Remember-me stores only the identifier and migrates away legacy plaintext passwords; dead `Details.js` HTML sink removed; invoice/contract popup uses DOM APIs and `textContent`; 401 status propagated for array-shaped errors. |
| `8f68eef` (frontend) | Analytics ids validated against strict provider patterns, unknown types ignored, values serialised with `JSON.stringify`/`encodeURIComponent` before inline-script interpolation. |
| `8dde4a6` (frontend) | Reel stream token moved from the URL query string to a short-lived opaque server-side handle exchanged over a header. |
| `81e628d` (frontend) | `next/image` wildcard remote patterns replaced with an explicit https host allowlist; baseline CSP plus X-Frame-Options, nosniff, Referrer-Policy, HSTS and Permissions-Policy added. |
| `182faf4` (frontend) | Added a dependency-free allowlist rich-text sanitizer with an escaped plain-text SSR fallback and wired all six admin/backend HTML sinks through it (V6). |

Local-only hygiene (not pushed): the 3.7 MB SQL dump was moved out of the repo tree to `/tmp/opencode/aduanefiemarketplace-353032377464.sql` and `*.sql` was added to the root `.gitignore`. Canonical backend `.gitignore` already ignored `*.sql`. Root `main` is still far ahead of its remote and was deliberately not pushed.

### Verification actually performed

- Every changed PHP file passed `php -l` after each backend change set.
- `npx tsc --noEmit` passed after each frontend change set.
- `npm run build` passed on the frontend after all committed frontend fixes. For V6 it was rerun in a clean detached worktree at the same commit because a concurrent build in the main checkout removed `.next/build-manifest.json` mid-run; the clean build passed all 15 static pages.
- `git diff` was reviewed before each commit; remote heads were rechecked immediately before each push to avoid dropping concurrent work.
- A later QoL commit `419aa70` landed on frontend `origin/main` after V6. `git grep` at the new HEAD confirms the sanitizer file and all six hook/sink references are still present.
- No runtime or database exploitation was performed; all findings remain static-code-level.

### Known gaps, explicitly deferred

- **Key rotation and history purge: NOT DONE.** Both GitHub remotes are public. The Apple `.p8` key is still valid until revoked in the Apple Developer portal; Passport keys must be regenerated on the server (`php artisan passport:keys --force`) and all access tokens revoked. The secret paths remain in `backend/main` history (`app/Library/AuthKey_U7KA7F82UM.p8`, `backend/app/Library/AuthKey_U7KA7F82UM.p8`, `soft/app/Library/AuthKey_U7KA7F82UM.p8`, `storage/oauth-private.key`, `storage/oauth-public.key`, `.env.railway`). The canonical backend HEAD and frontend HEAD are clean, but the local root monorepo HEAD still tracks `backend/app/Library/AuthKey_U7KA7F82UM.p8` and is 84 commits ahead of its remote, so it must not be pushed wholesale. A history rewrite needs a coordinated force-push with all clones and forks. See `SECURITY_KEY_ROTATION_AND_HISTORY_PURGE_PLAN.md`.
- **Runtime confirmation pending** for `APP_MODE`, `MARKETER_MFA_REQUIRED`, Passport expiry/revocation, reachable image-optimizer SSRF targets, and the onboarding-token payment flow.
- **V3 (frontend):** group-buy `guest_id` is still generated client-side with `Math.random()` and trusted verbatim by the backend. Fixing it requires server-issued signed guest sessions and was not attempted in this pass.
- **V7 (frontend):** only the missing status propagation was fixed. React Query cache invalidation on login/logout/401 and keying queries by the current principal were not implemented.
- **V10 (frontend):** some backend-controlled links still call `window.open()` without `noopener,noreferrer`.
- **H1/H2/H3** (payment callback token lifetime, payment redirect URL validation, product video iframe allowlist) remain hypotheses requiring runtime tracing.
- Roadmap items 12 (jQuery/SRI audit; no `polyfill.io` reference was found), 14 (TrustProxies, cookie flags, rate-limit keys), and the medium-term escrow/automated-test work were not part of this pass.
- A full dependency CVE scan (`composer audit` / `npm audit`) was not run.
