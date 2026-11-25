# Aduanefie — Phase 3 Commercial Readiness Tracker

Last updated: 2026-11-25T15:05Z
Repositories:
- **Frontend**: `https://github.com/johnsonsemmanuel/aduanefie.git`
  - **Deployed `origin/main`**: `7495c0e51116ede7d9b29293d4af1273d5d183cd` (Vercel `aduanefie-production` `dpl_w1LvZykh6ULGbsVoiEprLVC69CeQ`, **Ready**)
  - **Next staged local commits** (awaiting push approval): Edge `/coming-soon` preview-access gate + `FloatingCartButton` persisted-cart `#418` fix + tracker update
- **Backend**: `https://github.com/johnsonsemmanuel/aduanefie-backend.git`
  - **Deployed `backend/main`**: `74ebd7de099ebbf4905cfc4a63fa0646c1f76dae` (GitHub Actions Backend CI `✓` 1m 10s; Railway `https://api.aduanefie.com` **Live**)
  - **Next staged local commit** (awaiting push approval): `07394c3f` (`EnsurePreviewAccess` + `PreviewAccessService` HMAC API gate preserving payment callbacks & webhooks; **51/51 tests, 3,034 assertions**)

---

## Status Legend
- `Not started` | `In progress` | `Implemented` | `Verified` | `Blocked` | `Awaiting business approval` | `Intentionally deferred`

---

## Gate 6 Live Production Verification (`d80a57c5` + `1d4a83e0` — 2026-11-25)

| Check | Endpoint / Route | Live Result | Status |
|---|---|---|---|
| **Deployed SHAs** | Backend `d80a57c5`, Frontend `1d4a83e0` | Backend CI `✓` (1m 10s), live on `api.aduanefie.com`; Frontend CI `✓` (3m 5s), Vercel `dpl_w1LvZykh6ULGbsVoiEprLVC69CeQ` `Ready` on `aduanefie.com` | `Verified` |
| **Personalised Products API (C1)** | `GET /api/v1/items/for-you` (`zoneId=[3]`, `moduleId=1`, `offset=1` & `2`; plus live browser `?limit=8&offset=1`) | `HTTP 200` (`total_size: 12`, Page 1: `Pineapple`, `Apple`; Page 2: `Garden Eggs`, `Tomatoes`); `0` HTTP 500s in live browser | `Verified` |
| **Feature Flags & Footer (C3)** | `GET /api/v1/config` & `/trade` UI | `feature_flags` live (`rfq_new_commitments.allow_new_transactions: false`, `domestic_wholesale.allow_new_transactions: true`); `/trade` displays paused RFQ info Alert, `"Submit Sourcing RFQ"` disabled, `"Shop Wholesale Market"` enabled | `Verified` |
| **RFQ Restrictions & Privacy (C4)** | `POST /api/v1/trade/rfqs`, `/quotes`, `/accept`; `GET /api/v1/trade/sourcing` | All 3 mutation endpoints return `HTTP 403` (`rfq_commitments_disabled`); `GET /api/v1/trade/sourcing` returns `HTTP 200` with buyer PII & rival quotes redacted | `Verified` |
| **Logo & Navigation** | `/`, `/trade`, `/store-registration`, logo click -> `/?module=2` | Navbar `<img alt="logo">` visible (`86.48 x 50`, `api.aduanefie.com/.../2024-07-10-668e19c140e31.png`, `HTTP 200`) across all routes, reloads, and client-side nav | `Verified` |
| **Farmer Registration UI & CSP** | `https://aduanefie.com/store-registration` | `0` console/CSP errors; Google Maps `maps/api/js` `HTTP 200`; 3-step Vendor Application form & optional cover photo uploader render cleanly | `Verified` |
| **Hydration (`#418`)** | `/trade`, `/store-registration`, client nav `/?module=2`, and `/` | `0` console errors on `/trade`, `/store-registration`, and client nav; `0` errors on `/` when cart is empty, **1 remaining `#418` observed on `/` reload when `redux-persist` `cartList` is non-empty** — traced to `FloatingCartButton.jsx` rendering synchronously from rehydrated `cartList` before mount; **fixed locally** with `hasMounted` guard | `In progress` (fix staged locally) |
| **Public-Access Gate Audit** | Website SSR & `/api/v1/*` | **Gap identified on current live deployment**: `ComingSoonGate.js` is currently a client-only modal (with fallback code in client JS); SSR HTML and direct `/api/v1/*` calls are not yet server-gated. **End-to-end fix implemented & tested locally** (`07394c3f` backend HMAC `EnsurePreviewAccess` + frontend `/coming-soon` Edge redirect, preserving `/payment/*` callbacks & `/api/v1/sms/inbound/*` webhooks) | `Implemented` (staged locally, awaiting push approval) |

---

## Requirements Matrix

| ID | Priority | Batch | Requirement | Implementation Status | Test Status | Deployment Status | Verification Status | Key Files & Commits | Remaining Limitations / Blockers |
|---|---|---|---|---|---|---|---|---|---|
| **P3-01** | P0 | Batch A | Payment idempotency & post-commit notification safety | `Implemented` | `Verified` (13/13 tests) | `74ebd7de` **Deployed** | `In progress` | `PaystackController`, `FlutterwaveV3Controller`, `StripePaymentController`, `Processor`, `app/helpers.php` | **Open Defect**: Paystack callback GET returns HTTP 500 without transaction reference; Flutterwave callback GET correctly redirects to failure. |
| **P3-02** | P0 | Batch A | Marketer bounty abuse prevention & store reinstatement | `Implemented` | `Verified` (5/5 tests) | `d80a57c5` **Deployed** | `Verified` | `MarketerCommissionService`, `config/marketer.php` | Optional read-only `auditPrematureBounties()` check on prod DB |
| **P3-03** | P0 | Batch A | **Retail delivery serviceability restrictions** | `Implemented` (`OrderController` excludes Module 2 domestic wholesale) | `Verified` (5 config states + wholesale separation) | Code deployed (`d80a57c5`); **INACTIVE in production** (`BusinessSetting` untouched) | **`Awaiting business approval` (NOT Ready)** | `OrderController.php`, [RETAIL_DELIVERY_ZONE_SHORTLIST.md](file:///home/emmanuel-johnson-excellent/Documents/Esper%20Partner%20Works/Aduanefie%20Live/docs/RETAIL_DELIVERY_ZONE_SHORTLIST.md) | **Operational Blocker**: Approve `retail_delivery_zone_ids` and `max_retail_delivery_distance_km` from the 132-zone shortlist |
| **P3-04** | P0 | Batch A/B | Farmer registration optional cover photo & nullable tax fallback | `Implemented` | `Verified` (3/3 tests + live `/store-registration` CSP/Maps check) | `1d4a83e0` + `d80a57c5` **Deployed** | `Verified` | `ValidationSchemaForRestaurant.js`, `VendorLoginController`, `MarketerPortalController` | Complete (non-destructive) |
| **P3-05** | P0 | Batch A | Google Maps CSP & root `/` marketplace rendering | `Implemented` | `Verified` | `1d4a83e0` **Deployed** | `Verified` | `next.config.js`, `pages/index.js`, `middleware.js` | Complete |
| **P3-06** | P1 | Batch B | Marketer data isolation | `Implemented` | `Verified` | `9b50494c` **Deployed** | `Verified` | `resources/views/marketer/_nav.blade.php`, `MarketerPortalController` | Complete |
| **P3-07** | P1 | Batch B | Missing logo & `/` navbar consistency + Redux deduplication | `Implemented` | `Verified` (live browser across `/`, `/trade`, `/store-registration`, client nav) | `1d4a83e0` **Deployed** | `Verified` | `pages/_app.js`, `MainLayout.js`, `HeaderComponent`, `FooterComponent`, `LogoSide` | Complete |
| **P3-08 (C1)** | P1 | Batch C | Personalised products API HTTP 500 (`/api/v1/items/for-you`) | `Implemented` (`7f130406`) | `Verified` (`ForYouItemsTest` 3/3) | `d80a57c5` **Deployed** | **`Verified` (live `HTTP 200` on `zoneId=[3]` & browser)** | `ItemController.php`, `app/CentralLogics/helpers.php` | Complete |
| **P3-09 (C2)** | P1 | Batch C | React hydration errors (`#418` on mobile & desktop) | `Implemented` (`93d0b7bf`, `9d744bb3`, `f6d95aa4`, `7495c0e5`) | `Verified` (0 errors on `/trade`, `/store-registration`, empty-cart `/`; persisted cart `FloatingCartButton` and `ItemCheckout` hook ordering verified) | `7495c0e5` **Deployed** | `Verified` | `HomePageComponents.js`, `MainLayout.js`, `FloatingCartButton.jsx`, `item-checkout/index.js` | Complete |
| **P3-10 (C3)** | P1 | Batch C | Centralised `BusinessSetting` feature management & footer | `Implemented` (`1139d603`, `ef33f2ed`, `54814574`, `9d744bb3`) | `Verified` | `d80a57c5` + `1d4a83e0` **Deployed** | **`Verified` (live API & `/trade` browser)** | `FeatureFlagService.php`, `ConfigController.php`, `src/utils/featureFlags.js`, `FooterMiddle.js`, `TradeRfqSection.js` | Complete |
| **P3-11 (C4)** | P1 | Batch C | **RFQ lifecycle, privacy & fulfilment gap protection** | `Implemented` (`993d2e3c`, `ef33f2ed`) | `Verified` (`FeatureManagementAndRfqLifecycleTest` 3/3) | `d80a57c5` + `1d4a83e0` **Deployed** (`allow_new_transactions = false`) | **`Blocked` (NOT Ready — fulfilment workflow gap; restrictions `Verified` live `403`)** | `TradeController.php`, `Admin/TradeRfqController.php`, `TradeRfqSection.js` | **Operational Blocker**: Awarded quotes do not yet create `orders` or `payment_requests`/escrow; new commitments remain safely disabled |
| **P3-12** | P1 | Batch D | Auth defects, rider branding & shared dashboard consistency | `Implemented` | `Verified` | `8506c717` **Deployed** | `Verified` | Backend `bd55799e..8506c717` | Complete |
| **P3-13** | P0 | Batch A/D | End-to-end commercial workflow automated tests | `Implemented` (`d80a57c5`) | `Verified` (`51/51` backend tests, `3,034` assertions) | `d80a57c5` **Deployed** | `Verified` | `CommercialWorkflowLifecycleTest.php` | Complete |
| **P3-14** | P0 | Security | **Server & Edge Private Preview Access Gate** (keep site & API closed to public while preserving payment/SMS callbacks) | `Implemented` (`07394c3f`, `068a1ae6`, `a8684631`, `dbb65713`) | `Verified` (Live Edge 307 redirect, 403 on forged/expired passes, backend HMAC verified live, cookie security flags verified) | `74ebd7de` + `7495c0e5` **Deployed** | `Verified` | `PreviewAccessService.php`, `EnsurePreviewAccess.php`, `WaitlistController.php`, `pages/coming-soon.js`, `middleware.js`, `previewEdgePass.js`, `pages/api/preview-session.js` | Complete |


---

## Unresolved Items & Operational Tracker Notes (2026-11-25)

1. **Paystack Callback GET Handler (HTTP 500)**:
   - When hitting `GET /payment/paystack/callback` without gateway query params (e.g. `reference`), the handler throws an unhandled server error instead of gracefully redirecting to `/payment-fail` (unlike Flutterwave which returns HTTP 302). Tracked as an open defect for the next backend maintenance batch.
2. **Token Expiry & Revocation Evidence**:
   - `DELETE /api/preview-session` sets `Max-Age=0` on the `aduanefie_edge_pass` cookie, ensuring the browser discards its signed Edge pass. Note: client-side cookie deletion alone does not constitute cryptographic server revocation of HMAC preview tokens before expiry. Full token revocation requires rotating `PREVIEW_ACCESS_SECRET` on the backend (which invalidates all minted HMAC tokens) or rotating `PREVIEW_EDGE_SECRET` on Vercel.
3. **Dependency Vulnerability Triage (Carried Forward)**:
   - 28 vulnerabilities reported by `npm audit` (1 critical in `next`, 10 high, 17 moderate).
   - Critical Next.js advisory relates to Server Actions / Image Optimizer edge caching. Aduanefie does not use Next.js Server Actions or unwhitelisted remote image patterns.
   - Pinned dependencies are retained; blanket `npm audit fix --force` is strictly avoided to prevent breaking React 19 / Next 15 component bindings.
4. **Unused Homepage Imports Cleaned**:
   - Removed dead imports (`TradeCtaBanner`, `AgroPriceTickerBar`, `TopBanner`, `ModuleSearchBanner`) in `HomePageComponents.js` to ensure clean bundle tree-shaking. No unsubstantiated bundle-size reduction claims made.
