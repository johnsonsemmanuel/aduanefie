# Aduanefie marketplace flow and production audit — 25 November 2026

## Assessment

Aduanefie has a working domestic marketplace foundation and a substantial operations backend. It does **not yet present a complete, launch-ready cross-African agricultural trading journey**. Domestic wholesale and cross-border trade must have distinct promises and transaction states. A regional information page and a domestic wholesale catalogue do not establish an operational export marketplace.

This audit combines production browser inspection, authorised preview API requests, read-only Railway inspection, source review, and automated tests. The user authorised a production rollout after reviewing the findings. The backend repair is deployed; the frontend repair passed its final build and is entering deployment. Existing workspace changes were preserved.

Frontend baseline: `46bddb3` (`origin/main`). Backend baseline: `bb903b45` (`backend/main`). The original workspace frontend was behind those revisions; repairs were made in isolated worktrees.

## Confirmed defects and repairs

| Priority | Evidence and customer impact | Repair in this batch | Status |
| --- | --- | --- | --- |
| P0 | Fresh `/` rendered an empty shopping shell without module context. `/home` without a module also had a guard that always allowed rendering. | Root serves welcome/market discovery consistently so Home and Shop are distinct. Explicit legacy retail/wholesale root query links still redirect to their catalogue; Shop retains saved context. The catalogue context guard restores a saved choice or returns to welcome. Root entry responses are private. | Implemented locally |
| P0 | Tapping mobile Shop on a fresh session threw `ReferenceError: getCurrentModuleId is not defined`, reproduced in the production console. | Import the helper, handle malformed saved module data, and provide an explicit wholesale destination when no shopping context exists. | Implemented locally |
| P0 | Authorised `GET /api/v1/group-buys` returned 500. Railway logs showed `SQLSTATE[42883]: operator does not exist: json <> unknown`. Production schema confirms `items.bulk_pricing_tiers` is `json`. | Replace duplicate JSON inequality logic in group listing and compatibility checks with a shared Item bulk-eligibility scope. PostgreSQL uses guarded JSON array length; normal MOQ and active relational tiers still qualify. | Implemented locally; replacement expression verified by a read-only production query |
| P1 | Welcome headings were blank: live landing API returns flat `header_*` properties, while the UI expected `hero_section`. | Accept flat and nested hero data, provide agricultural entry copy, and add explicit nearby, wholesale, trade and supplier entry links. | Implemented locally |
| P1 | Welcome Contact Us linked to `tel:undefined`. | Pass the configured phone to the FAQ component and use the support page when absent. Remove nested interactive button/link markup. | Implemented locally |
| P1 | Trade page advertised RFQs and Trade Assurance-backed shipments as “Available now” while its own RFQ form said commitments were paused. | Use feature-aware availability copy and distinguish domestic wholesale from cross-border services. | Implemented locally |
| P1 | Mobile bottom tabs were clickable containers, without native button semantics or current-page announcements. `/store-registration` could be classified as shopping by a broad `/store` prefix. | Native keyboard-operable buttons, labelled navigation landmark, visible focus and `aria-current`; bound store route matches to the actual route segment. | Implemented locally |
| P1 | Primary olive `#8B9F69` with white text gives approximately 2.89:1 contrast. Supporting text used small, compressed line heights. | Forest-green primary `#2E6545` gives approximately 6.85:1 with white, with dark ink, quiet surfaces, readable body line heights and shared focus/button styles. | Implemented locally; contrast regression tested |
| P1 | Welcome lacked the marketplace bottom bar. Its cookie panel occupied the same bottom edge, and Deny was forgotten on reload. | Share BottomNav between layouts, reserve footer/safe-area space, lift consent above navigation, respect both saved choices, and use native consent buttons. | Implemented locally; full visual acceptance still required |
| P1 | Portal login logo URL `https://aduanefie.com/static/aduanefie_logo.png` returned 404 and hid itself on error. | Use configured backend branding and retain a visible Aduanefie wordmark. | Implemented locally; portal render tests pass |
| P1 | Admin, supplier, marketer and rider layouts used separate foundation styles. | Add a shared backend design stylesheet/Blade include for brand tokens, focus, touch targets and mobile form sizing; add current-page semantics to marketer tabs. | Foundation implemented; not a complete dashboard redesign |
| P1 | Preview return-path checks accepted slash/backslash host escapes and could loop through `/coming-soon`. | Use one safe return-path helper in the Edge and browser gates, rejecting external destinations and gate loops. | Implemented locally; regression tested |

## Production checks

Responses below were observed during this audit, not inferred from older readiness notes. API catalogue probes used the supplied owner access code to obtain a temporary preview token; no orders, accounts, payouts or RFQs were created.

| Surface | Observed result | Interpretation |
| --- | --- | --- |
| `aduanefie.com/` without preview access | 307 to `/coming-soon` | Private preview remains closed |
| `www.aduanefie.com/`, `web.aduanefie.com/` | 308 to canonical apex | Canonical host redirects work |
| `api.aduanefie.com/api/v1/config` | 200 | Public configuration available by design |
| `/api/v1/module` with preview access | 200; IDs 1, 2, 4, 5, 6 | Nearby, wholesale, equipment, inputs and agro-services exist |
| `/api/v1/trade/blocs` | 200 | Regional information API available |
| `/api/v1/trade/corridors` | 200, empty list | No live corridors returned; an empty catalogue is not shipping availability |
| `/api/v1/trade/sourcing` | 200, empty requests | No live sourcing inventory returned |
| `/api/v1/trade/access/status` as guest | 401 `trade_auth_required` | Expected authentication response, not a failing endpoint |
| `/api/v1/group-buys` | 500 | Confirmed production defect; repair above |
| `/api/v1/trade/agro-prices` | 200 | Price reference data available |
| `/api/v1/items/for-you`, `/items/latest` with module 2/zone 3 headers | 200, empty item lists in this scope | Availability depends on context; do not label empty results as a server failure |
| `/api/v1/categories` | 200 | Category discovery available |
| Catalogue APIs without preview access | 403 `preview_access_required` | Expected gate protection |
| `admin.aduanefie.com/` | 302 to `/admin-login`; login 200 | Admin front door works |
| `store.aduanefie.com/` | 301 to `admin.aduanefie.com/store-login`; login 200 | Store host is an intentional legacy redirect |
| `partners.aduanefie.com/marketer` | 302 to marketer login | Protected marketer entry works |
| `logistics.aduanefie.com/rider` | 302 to rider login | Protected rider entry works |
| `/admin` on partners/logistics; `/admin-login` on API host | 404 | Role-host isolation works on checked routes |

The actual module endpoint is `/api/v1/module`, not `/modules`. The price endpoint used by the app is `/api/v1/trade/agro-prices`, not `/market-prices`. Guessed plural/short aliases returning 404 are not counted as broken frontend contracts.

Railway reports deployed backend SHA `bb903b451b140bcfa8a51dcce4f1fe946e699ac6`, matching the audited backend baseline. Vercel deployment `dpl_B5JmRHrXZpChFm7XcrtYQokxPox9` was `READY` for production.

Vercel serves the customer frontend. Railway serves API/admin, while partners/logistics and the legacy store redirect returned Apache server headers. This is a split-host deployment, **not proof by itself of code or database drift**. The partners login still describes an “admin account”, while the audited backend view says “registered email address”; this is observable portal-view drift. Exact release SHA, migration state and database identity on the Apache portals still need comparison with Railway. Railway reported production mode with debug off, but its configured application URL was `aduanefie.com`; generated backend links need checking against the intended operations origin.

## Remaining launch gaps

| Priority | Gap | Acceptance required |
| --- | --- | --- |
| P0 | Awarded cross-border quotes do not yet form a complete order/payment/fulfilment lifecycle; new RFQ commitments remain disabled. | Quote → versioned commercial terms → order/reservation → supported payment → shipment milestones → receipt/dispute/refund; verify role permissions and retries before enabling commitments. |
| P0 | Retail serviceability limits are described as inactive in the existing readiness tracker. | Verify and approve supported delivery zones/distances and test rejection outside coverage. Do not infer delivery from a visible product. |
| P0 | No authenticated production acceptance checks were performed for admin, marketer, supplier or rider dashboards. | Use dedicated role test accounts in a test environment: onboarding, approval/rejection, scoped lists, document access, order actions, commission holds, payout review, revocation and audit history. Automated tests do not replace this. |
| P0 | Split hosting leaves release/database alignment unverified. | Establish one release manifest covering frontend, Railway and Apache portal versions, database target, migration version, queues, scheduled jobs and media origin. Compare before deploying the shared backend stylesheet. |
| P1 | Five modules are exposed while the current mobile Shop model explicitly normalises to retail/wholesale IDs 1/2. | Keep a clear common market selector for equipment, inputs and services; retain each module's search, back-navigation and checkout context. Do not make every module look like grocery ordering. |
| P1 | Trade approval backend exists but `trade_access_applications` is disabled and no complete buyer application/status frontend was found in this revision. | Provide application, review status, rejection/resubmission and approved-access entry before promoting gated trade discovery. |
| P1 | Country profile definitions are configuration, not evidence that a market is commercially operating. | Display serviceable origin/destination pairs and actual settlement currencies. Check currency/unit/pack/MOQ, grade, origin, harvest/availability, delivery terms and corridor-specific documents at offer level. |
| P1 | Welcome and shared SSR fetches lack a consistent bounded-timeout/outage recovery contract; some pages translate empty configuration into 404. | Return a service-unavailable state with retry/support, distinguish no stock from failed loading, and propagate maintenance redirects through all page wrappers. |
| P1 | Live home can spend a substantial interval showing only its shell while context loads. Build output reports about 1 MB first-load JS for welcome/trade and 1.19 MB for home, plus significant shared CSS. | Lazy-load unrelated module renderers, authentication providers and nonessential widgets; render useful skeleton/error states and measure mobile Core Web Vitals on a constrained connection. No field performance score was measured in this audit. |
| P1 | Most secondary cards/menus still use clickable containers, and numerous local color overrides remain. | Migrate those controls to shared Link/Button/Card primitives; test keyboard order, focus, accessible names, contrast and mobile overflow across representative pages. |
| P1 | Consent storage is repaired, but the analytics lifecycle was not audited end to end. | Make actual optional-script loading follow the selected preference, with a way to revise it. A banner alone does not implement preferences. |
| P2 | Orders sign-in handoff, failed-payment recovery, multi-seller totals and country switching need dedicated acceptance scenarios. | Preserve intended destination after login; explain stock/price changes; reprice delivery server-side; reset incompatible location/cart context without silently losing work. |
| P2 | Programme claims and errors need editorial consistency. | State actual availability for group buys, farming, tours, trade and apps. Avoid “verified”, insurance or guaranteed-delivery claims unless backed by the relevant operational record. |

## UI direction

Use the same semantic foundation across technologies: brand `#2E6545`, ink `#253D30`, muted text `#58665D`, surface `#F7F9F7`, divider `#DCE4DD`, white cards, 12px card corners and restrained status colors. Keep the distinction between a shopping basket, a service booking and a cross-border enquiry explicit. Give each page one title, one main action, clear loading/error/empty states and predictable back navigation.

Accessibility acceptance should use [WCAG 2.2](https://www.w3.org/TR/WCAG22/), including normal-text contrast, keyboard access, visible/unobscured focus and minimum target sizing. This batch fixes selected foundations; it is not a WCAG conformance claim.

## Verification and release status

- Final frontend production build passed after all source changes, including type validation. Production CSP was separately checked to exclude unsafe-eval.
- Frontend regression tests: 7 passed (entry routing, corrupt storage, contrast and safe preview return paths).
- Full backend test suite: 71 passed, 3,159 assertions after configuring disposable local test signing keys. Earlier missing-key failures were local test setup, not production auth failures.
- Portal render regression tests passed after the branding repair.
- Corrected PostgreSQL JSON expression executed successfully against production using a read-only query.
- The welcome page was visually inspected at 390px after repair. Follow-up checks exposed a development-only CSP/Fast Refresh conflict; the development allowance is isolated from production. Mobile zoom is no longer disabled by the viewport meta tag.
- Local disk exhaustion initially interrupted visual verification; only audit-generated build output was cleared. No other projects' files were removed.
- Backend `cc3d1f42` deployed successfully to Railway; the live group-buy listing now returns 200. No production data changes, payment actions or public-opening changes were performed.
- Legacy partners/logistics were confirmed to use the old MySQL installation, with no trade-buyer-profile table. Host-scoped redirects were installed to route their current portal traffic to the Railway operations host and reject stale writes. Backups: `backups/codex-portal-alignment-20261125T211800Z` on the legacy host. Legacy data was preserved, not merged.

Keep RFQ commitments paused and the private preview gate closed until the operational acceptance criteria above pass. The repaired code is a reviewable first release batch, not evidence that the whole platform is ready for public cross-border transactions.
