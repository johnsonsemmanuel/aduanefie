# Aduanefie — Phase 3 Commercial Readiness Tracker

Last updated: 2026-11-25
Repositories:
- **Frontend**: `https://github.com/johnsonsemmanuel/aduanefie.git` (`main`, Vercel project `aduanefie-production` -> `https://aduanefie.com`)
- **Backend**: `https://github.com/johnsonsemmanuel/aduanefie-backend.git` (`main`, Railway -> `https://api.aduanefie.com`)

---

## Status Legend
- `Not started` | `In progress` | `Implemented` | `Verified` | `Blocked` | `Awaiting business approval` | `Intentionally deferred`

---

## Requirements Matrix

| ID | Priority | Batch | Requirement | Status | Key Files | Implementation Commit | Test / Verification Evidence | Remaining Limitations / Approval |
|---|---|---|---|---|---|---|---|---|
| **P3-01** | P0 | Batch A | **Paystack, Flutterwave & Stripe payment integrity & idempotency** (reference, amount, currency verification, atomic lock, rollback on downstream failure) | `Verified` | `app/Http/Controllers/PaystackController.php`, `FlutterwaveV3Controller.php`, `StripePaymentController.php`, `app/Traits/Processor.php`, `resources/views/payment-views/paystack.blade.php` | Backend `9b50494c` | `BatchAFinancialProtectionTest` (3 Paystack/hook tests passed: duplicate callback idempotency, underpaid/wrong-currency rejection, rollback on failed hook) | Live Railway deploy verification pending after backend push |
| **P3-02** | P0 | Batch A | **Marketer bounty abuse prevention** (separate admin store approval from marketer self-verification; prevent suspended/unapproved store payouts) | `Verified` | `app/Services/MarketerCommissionService.php`, `config/marketer.php` | Backend `9b50494c` | `BatchAFinancialProtectionTest` (4 bounty/payout tests passed: self-verification blocked, configurable policy, payout locking, suspended store rejection) | Existing commercial rates preserved; no rate changes made |
| **P3-03** | P0 | Batch A | **Delivery serviceability enforcement** (distinguish farmer sourcing coverage from retail delivery zones & max radius via `BusinessSetting`) | `Implemented` | `app/Http/Controllers/Api/V1/OrderController.php`, `app/CentralLogics/order.php`, `app/helpers.php` | Backend `9b50494c` | `BatchAFinancialProtectionTest` (`delivery serviceability enforces max radius and allowed retail zones` passed) | `Awaiting business approval` to populate `retail_delivery_zone_ids` and `max_retail_delivery_distance_km` in production DB (127 zones audit) |
| **P3-04** | P0 | Batch A/B | **Farmer registration optional cover photo & marketer attribution** (`ValidationSchemaForRestaurant.js`, `VendorLoginController@register`, `Helpers::upload` default `def.png`) | `Verified` | `src/components/vendor-apply/ValidationSchemaForRestaurant.js`, `app/Http/Controllers/Api/V1/Auth/VendorLoginController.php`, `app/Http/Controllers/MarketerPortalController.php` | Frontend `3a08f367` / `7e083222`; Backend `9b50494c` | `BatchBFarmerAcquisitionAndIsolationTest` passed; verified `Helpers::upload(..., null)` returns `def.png` and `Store::cover_photo_full_url` resolves cleanly; `tax` made nullable with default fallback | End-to-end staging browser submission against live MySQL spatial zone check recommended |
| **P3-05** | P0 | Batch A | **Google Maps CSP & root marketplace rendering** (`maps.googleapis.com` in CSP, `/` serves Home directly without `/home` or `/welcome` redirect) | `Verified` | `next.config.js`, `pages/index.js`, `middleware.js` | Frontend `2e0bd709`, `493ed020` | Live verified on `https://aduanefie.com/`: `HTTP/2 200`, `x-matched-path: /` for new & returning visitors, CSP includes `https://maps.googleapis.com` | Complete |
| **P3-06** | P1 | Batch B | **Marketer data isolation** (scope nav badges and queries to marketer territory) | `Verified` | `resources/views/marketer/_nav.blade.php`, `app/Http/Controllers/MarketerPortalController.php` | Backend `9b50494c` | `BatchBFarmerAcquisitionAndIsolationTest` (`marketer nav badges and queries are strictly isolated by marketer territory` passed) | Complete |
| **P3-07** | P1 | Batch B | **Missing logo & root `/` navbar consistency across pages** (`/trade` and 22+ pages missing `configData` in header/logo; `/` module bar & bottom nav active state) | `Implemented` | `pages/_app.js`, `src/components/layout/MainLayout.js`, `src/components/header/index.js`, `src/components/footer/index.js`, `src/components/logo/LogoSide.js`, `src/components/logo/CustomLogo.js`, `src/components/header/new-navbar/NewNavBar.js`, `MobileNavBar.js`, `BottomNav.js`, `FloatingCartButton.jsx` | Frontend `main` (pending commit & deploy) | `npx tsc --noEmit` passed; `npm run build` verification in progress | Verify live on `/`, `/trade`, `/about-us` after Vercel deploy |
| **P3-08** | P1 | Batch C | **Personalised products API HTTP 500** | `Not started` | Backend `ItemController` / `for-you` endpoint | — | `MarketplaceTest` checks zone header validation | Needs reproduction against production logs / missing user-zone edge cases |
| **P3-09** | P1 | Batch C | **React hydration errors** | `Not started` | Frontend SSR/CSR date, theme, and localStorage-dependent components | — | — | Needs browser console audit across `/`, `/trade`, `/store-registration` |
| **P3-10** | P1 | Batch C | **Centralised feature management (`BusinessSetting`) & backend-authoritative footer** | `In progress` | Frontend feature flags (`2e0bd709`), `src/components/footer/` | Frontend `2e0bd709` | Individual frontend guards in place | Backend enforcement & authoritative footer config endpoint still needed |
| **P3-11** | P1 | Batch C | **Domestic wholesale preservation & RFQ commercial readiness** | `Implemented` | `pages/trade/index.js`, `TradeRfqSection`, backend `0a7436d8` (one-click RFQ quote acceptance with Trade Assurance award) | Backend `0a7436d8` | Trade hub & RFQ quote acceptance implemented | End-to-end commercial workflow tests for RFQ lifecycle still needed |
| **P3-12** | P1 | Batch D | **Authentication defects, rider branding & shared dashboard consistency** | `Verified` | Backend `bd55799e`, `31c122fe`, `c2c28932`, `8506c717` | Backend `8506c717` | `MarketplaceTest` (`shared login pages render recaptcha when enabled`, `portal login pages render`) passed; 35/35 Laravel tests passing | Complete |

---

## Repository Boundary Audit (2026-11-25)
- **Frontend repo** (`origin` -> `johnsonsemmanuel/aduanefie.git`): Clean Next.js repo; duplicate `backend/` tree removed in `43d89164` and `7e083222`.
- **Backend repo** (`backend` -> `johnsonsemmanuel/aduanefie-backend.git`): Dedicated Laravel repository; Batch A & B fixes previously committed only to `3a08f367` were cleanly ported to `aduanefie-backend` `main` without overwriting `bd55799e..8506c717`, verified with `php -l`, `php artisan test` (35 passed, 2,892 assertions), `php artisan route:cache`, and `php artisan view:cache`.
