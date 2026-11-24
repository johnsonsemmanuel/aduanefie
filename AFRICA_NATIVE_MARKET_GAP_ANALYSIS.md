# Africa-native market gap analysis

**Status:** investigation only. No code was changed.  
**Date:** 2026-11-21  
**Scope:** canonical frontend `Aduanefie/frontend` at `origin/main` (`419aa70`) and canonical backend `/tmp/opencode/backend-group-buy` at `backend/main` (`02c98c01`). The stale workspace-root `backend/` was ignored.

## Executive verdict

Aduanefie is **Ghana-first in data, copy and defaults**, but it is **not country-aware** and **not multi-country operational**.

The code contains a surprisingly good foundation for cross-border trade: country/currency tables, order-level currency fields, server-side re-quoting, fail-closed FX conversion, gateway currency matrices, and customs-duty scaffolding. In practice, only Ghana domestic checkout is wired end to end. Outside Ghana, the system currently fails in several silent or confusing ways:

- A store can select Nigeria or Kenya and still be asked for a Ghana region and district.
- The checkout currency selector can display NGN or KES, but the order is still charged in the platform's single global currency.
- `currency_rates` contains only `GHS -> GHS = 1`, and no shipping rates are seeded, so cross-border quotes fail closed.
- Customs duty rules are seeded by country name but resolved by ISO code, so duty always resolves to zero.
- Language infrastructure exists, but the only selectable language is English, represented by a US flag. No Ghanaian or other African language is available.
- Trust language is explicitly Ghana Card based, which will not travel to other countries and must not silently weaken.

The good news: this is not a rewrite. The best fix is a single **Market Profile** config that drives country, currency, locale, ID, phone, payment rails, units, seasons, address shape and terminology across frontend and backend.

---

## 1. Current state by dimension

| Dimension | Current state | Verdict |
|---|---|---|
| Country model | Backend has `Country`, `Currency`, `currency_rates`, `shipping_rates`, `customs_duties`, and order-level destination fields. Frontend still hardcodes many Ghana lists. | Framework exists, product does not. |
| Currency display | `getAmountWithSign()` reads backend config, but 26 app-code sites hardcode `GH₵`. Fallback symbol is empty in some places and `$` in others. | Config-driven in theory, Ghana-coded in practice. |
| Currency conversion | Three disconnected systems: legacy `Currency.exchange_rate`, cross-border `CurrencyRate`, and trade API live rates. Only `GHS -> GHS = 1` is seeded for cross-border. | Not operational. |
| Payment charging | `PaymentController.php:102` charges in global `BusinessSetting currency`, not `$order->currency_code`. | Blocker. |
| Language | Frontend loads `en/es/bn/ar`; selector exposes only `en` with US flag. Backend has `am/an/ar/bn/en/sq`. | Effectively English-only. No African language strategy. |
| Terminology | Strong Ghana vocabulary in market prices, group buys, agro seasons, payouts, trust badge; many hardcoded English strings elsewhere. | Ghana-native, not Africa-native. |
| Identity/KYC | Organiser verification requires `ghana_card_last4`; payout rails defined only for GH/NG/KE. | Ghana-specific, fail-open risk if expanded carelessly. |
| Logistics | Zones are domestic polygons. Cross-border quote service exists but has no rates and broken duty lookup. | Not launchable outside Ghana. |
| Mobile QoL | Real strengths exist: 16px phone inputs, mobile market-price cards, explicit FX fallback messaging, bottom sheets. Inconsistent coverage. | Keep and generalize. |

---

## 2. Verified gaps

### 2.1 Country awareness

**Frontend hardcodes Ghana even when another country is selected.**

- `src/components/store-resgistration/RestaurantDetailsForm.jsx:377-378` offers Nigeria and Kenya in the country list.
- The same file imports `GhanaRegionDistrictFields` at line 15 and renders it at line 410 regardless of selected country.
- `src/components/common/GhanaRegionDistrictFields.jsx:65` labels the field `Region (Ghana)` and reads `src/data/ghanaLocations.json`.
- `pages/become-a-marketer/index.js:26-43` hardcodes all 16 Ghana regions.
- `pages/become-a-marketer/index.js:45` hardcodes `MTN MoMo`, `Telecel Cash`, `AirtelTigo Money`.
- `pages/become-a-marketer/index.js:68-70` defaults to `Ashanti` and `MTN MoMo`.
- `pages/become-a-marketer/index.js:220` uses Ghana phone placeholder `0241234567`.
- `src/api-manage/MainApi.js:51-52` defaults `zoneid` to `[1]`, the national Ghana zone.

**Backend also defaults to Ghana in important places.**

- `VendorLoginController.php:226` defaults `country` to `Ghana`.
- `Vendor/ItemController.php:1297` defaults `origin_country` to `Ghana`.
- `TradeController.php:205,465,539` default origin/address country to Ghana.
- `ShippingQuoteService.php:35-42` reads `config('country.code', 'GH')`; no `config/country.php` exists, so origin is effectively always Ghana unless a store has `country_code`.

**Gap:** there is no single resolved market context that frontend and backend both trust. Country is a form field in some places, a hardcoded default in others, and an ISO code in the backend quote engine.

### 2.2 Language and localization

**Frontend i18n exists but is effectively English-only.**

- `src/language/i18n.js:11-24` imports `en`, `es`, `bn`, `ar`.
- `src/language/i18n.js:30-31` sets `lng: "en"` and `fallbackLng: "en"`.
- `src/components/header/top-navbar/language/languageList.js:5-11` exposes only English, with a US flag.
- Spanish, Arabic and Bengali are commented out at lines 12-29.
- No Twi/Akan, Fante, Ewe, Ga, French, Swahili, Hausa, Yoruba, Igbo or Portuguese resource exists.
- `rtlLanguageList.js:6` lists Hausa as RTL, but Hausa is commonly written in Latin script and no `ha` resource exists. Configured but unusable.
- `pages/_document.js:30` hardcodes `<Html lang="en">`.
- No Next.js `i18n` routing block exists in `next.config.js`.

**Catalog quality is weak.**

- Rough static comparison found about 487 literal `t("...")` keys used in source but absent from `en.js`, so even English users can see raw keys such as `Country`, `Retry`, `{{count}} items`.
- `es.js` and `bn.js` contain Arabic mistranslations; both have hundreds of duplicate keys.
- `en.js:389` contains `guidance to your quaternaries`.
- `en.js:2278` contains a Bangladeshi taka symbol in an English COD message.
- `src/components/help-and-support/index.js:46` contains the same `quaternaries` typo.
- `src/components/checkout/parcel/DeliveryManInfo.js:48` shows `toast.error("uyrttgr")` to users.
- `src/components/parcel/TrackParcelFromHomePage.js:51` shows `Need a order id`.

**Backend locale support is also narrow.**

- `resources/lang/` contains only `am`, `an`, `ar`, `bn`, `en`, `sq`.
- `LocalizationMiddleware.php:19` reads `X-localization`, but many API controllers return hardcoded English, for example `GroupBuyController.php:36,71,96,117,182,206`.

**Low-bandwidth problem:** all four frontend dictionaries are statically imported into the client bundle. Switching language calls `queryClient.invalidateQueries()` and re-navigates the router, which refetches everything. That is expensive on 2G/3G for a change that only affects labels.

### 2.3 Currency and payments

**The checkout currency selector is cosmetic.**

- `src/components/checkout/item-checkout/index.js:150` defaults to `{ code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" }`.
- Lines 370-380 list GHS, NGN, KES, XOF, ZAR, USD, EUR, GBP.
- Line 707 only appends `currency_code` to the order payload.
- Displayed amounts still come from `helpers/CardHelpers.js:36-57` and global config, so selecting NGN does not re-price the basket.

**Three FX systems do not connect.**

1. Legacy display FX: `Currency.exchange_rate`, hardcoded by `ExchangeRateSeeder.php:17-44` and consumed by `Helpers::convert_currency()` at `helpers.php:1295-1306`. It returns the amount unchanged if a currency row is missing.
2. Cross-border FX: `CurrencyRate::convert()` at `CurrencyRate.php:29-48` fails closed and is used only by `ShippingQuoteService`.
3. Trade API FX: `TradeController.php:274-319` fetches live GHS-based rates and caches them, but never persists them to `currency_rates`.

**Seeded cross-border rates are effectively empty.**

- Migration `2026_11_12_000010_create_cross_border_reference_tables.php:178-184` seeds only `GHS -> GHS = 1`.
- No `CurrencyRate` admin CRUD exists.
- No FX refresh command is scheduled in `Console/Kernel.php:25-39`.

**Payment charging ignores the order currency.**

- `OrderController.php:654-657` carefully stores `$order->currency_code`.
- `PaymentController.php:102` then reads `BusinessSetting::where(['key'=>'currency'])->first()->value` and passes that to `PaymentInfo`.
- Gateway controllers mostly honour that value, but PayPal is pinned to USD at `PaypalPaymentController.php:95`, and Stripe's supported list excludes the African currencies in scope.
- Gateway compatibility is checked only in admin UI (`SystemController.php:141-147`), not at runtime.

**Gap:** an order can say NGN, display GH₵, and attempt to charge the single configured platform currency. This needs to fail closed before launch outside Ghana.

### 2.4 Customs, shipping and cross-border operations

**Cross-border quote service exists but cannot quote by default.**

- `ShippingQuoteService::options()` requires `ShippingRate::active()->lane($origin, $destination)` at lines 81-89.
- Migration `2026_11_12_000010...:113-116` explicitly says business shipping rates are not seeded.
- No `ShippingRateSeeder` exists.
- No admin CRUD for shipping rates exists in backend controllers or views.
- Result: every lane is `available = false` without manual DB inserts.

**Duty lookup is broken by code-vs-name mismatch.**

- `CustomsDutySeeder.php:19-109` stores `destination_country` as full names: `Nigeria`, `Ghana`, `Kenya`, `South Africa`, `Côte d'Ivoire`.
- `ShippingQuoteService.php:155,167` passes ISO codes such as `NG`, `KE`, `CI`, `ZA`.
- `CustomsDuty.php:37-55` uppercases and queries `where('destination_country', strtoupper($code))`.
- Therefore `NG` never matches `NIGERIA`. Duty, VAT and excise resolve to zero for every destination.
- Senegal has no customs rows at all.
- `TradeController.php:110-123` hardcodes duty and VAT to `0.0`.

**Gateway support is uneven.**

Based on `PaymentGatewayTrait.php`:

| Gateway | Supported African currencies in code |
|---|---|
| Paystack | NGN, KES, GHS, ZAR, XOF |
| Flutterwave V3 | NGN, GHS, KES, ZAR, USD, EUR, GBP (no XOF) |
| Hubtel | GHS only |
| Payfast | ZAR only |
| Stripe | None of NGN/GHS/KES/XOF/ZAR |
| PayPal | USD only in implementation |

### 2.5 Terminology and trust language

**Trust badge is Ghana Card specific.**

- `pages/group-buys/[id].js` and group-buy components hardcode `GH₵` formatting.
- `src/components/group-buy/OrganizerVerificationDialog.js:37` says `Enter the last 4 characters of your Ghana Card.`
- Lines 57, 97 and 104 repeat Ghana Card language.
- `src/components/group-buy/VerifiedBadge.js:23` tooltip says `Ghana Card reviewed and 2 or more completed external orders`.
- Backend requires `ghana_card_last4` at `GroupBuyController.php:547`.
- Admin review view is explicitly Ghana Card based.

This is a fail-closed design today, which is good. If expanded, it must stay fail closed: use a country-specific government ID label where configured, and show `verification unavailable in your country` where it is not. Never silently drop the ID check to keep the badge available.

**Other Ghana-first terminology.**

- `pages/market-prices/index.js:96` title: `Ghana Agro Market Prices`.
- `:125` `Ghana Agricultural Market Price Index`.
- `:135` `major Ghana market hubs`.
- `:280` `Ghana Seasonal Supply`.
- `:303` `Standard Ghana Units`; key missing from `en.js`.
- `src/components/footer/footer-middle/FooterMiddle.js:47` `Ghana Agro Index`.
- Backend `ConfigController.php:221` and `agro-prices/index.blade.php:3,13,16` use the same Ghana-only labels.
- `src/utils/agroGuidance.js:1` exports `GHANA_UNIT_GUIDE`; `:83` exports `getGhanaSeasonalGuide()`.
- Payout labels differ between frontend and backend: frontend says `Telecel Cash`, backend `config/payout.php:33-34` says `Vodafone Cash`.

### 2.6 Mobile and QoL

**Strengths to preserve.**

- `pages/market-prices/index.js:434-452` uses mobile cards instead of horizontal table scrolling.
- `:257-260` explicitly says live FX rates are unavailable instead of presenting stale rates as current.
- `src/components/custom-component/CustomPhoneInput.js:92-99` uses 16px font to avoid iOS zoom.
- Existing slide-up `CustomModal` and searchable selects reduce keyboard friction.
- No fake data is presented as current in market prices and trade.

**Gaps.**

- `src/components/store-resgistration/StoreStepper.jsx:48-49` shrinks step labels to 8px on small screens.
- Many `SimpleMobileHeader` titles are hardcoded, especially across rental.
- Newer group-buy, marketer, parcel and organizer-verification copy is mostly hardcoded. Only 1 of 8 group-buy files uses `useTranslation()`.
- Support page offers Visit/Email/Call only, while checkout and order details already offer WhatsApp.
- `SuccessCard.js:60-64` and `ChatWithAdmin.jsx:17` hardcode Ghana `233` WhatsApp normalization.
- Language switch refetches all queries and re-navigates, which is punitive on low bandwidth.

---

## 3. Country feasibility snapshot

Assuming no manual DB seeding or code changes:

| Country | Reference data | Customs | Gateway support | Payout rails | Verdict |
|---|---|---|---|---|---|
| Ghana (GH/GHS) | Yes | Seeded but resolver broken | Hubtel, Paystack, Flutterwave | Yes | Only genuinely working domestic market. |
| Nigeria (NG/NGN) | Yes | Seeded by name | Paystack, Flutterwave V3 | Yes | Blocked: no shipping rates, no FX, broken duty lookup, wrong charge currency. |
| Kenya (KE/KES) | Yes | Seeded by name | Paystack, Flutterwave V3 | Yes | Blocked for same reasons. |
| Côte d'Ivoire (CI/XOF) | Yes | Seeded by name | Paystack only | No | Blocked plus no payout rail and no Flutterwave. |
| Senegal (SN/XOF) | Yes | None | Paystack only | No | Blocked plus no customs data. |
| South Africa (ZA/ZAR) | Yes | Seeded by name | Paystack, Flutterwave, Payfast | No | Blocked plus no payout rail. |

---

## 4. Recommended target architecture: Market Profile

Create one authoritative profile per market and consume it on both sides.

```text
MarketProfile {
  country_code: "GH" | "NG" | "KE" | ...
  locale: "en-GH" | "tw-GH" | "en-NG" | "sw-KE" | "fr-SN" | ...
  currency_code: "GHS"
  currency_symbol: "GH₵"
  decimal_places: 2
  phone: { dial_code, regex, placeholder, example }
  address: { region_label, district_label, city_label, postal_code_required }
  identity: { label, validation, masked_only, verification_available }
  payments: { gateways, presentment_currency, payout_rails }
  units: { weight, volume, packaging, produce_units }
  seasons: { name, months, copy_key }
  support: { whatsapp, email, phone, hours }
  terminology: { glossary_keys }
  tax: { vat_label, duty_label, receipt_label }
}
```

**Rules:**

1. Country is resolved explicitly: account setting or onboarding choice first, geolocation/zone as a hint, never IP alone.
2. A country switch recalculates currency, phone format, address fields, payment rails, ID label, units and available modules.
3. If a country is not fully configured, show `coming soon in your country` or a manual fallback. Do not silently fall back to Ghana.
4. The backend must validate the market profile on every order and payment. The frontend is presentation only.
5. Money is stored with amount in minor units, currency code, FX rate, FX source and FX timestamp. Display is derived from the profile.

---

## 5. Prioritized recommendations

### P0: correctness, trust and safety

1. **Build the Market Profile config and wire it into onboarding, checkout, group buys, market prices and marketer payouts.**
2. **Make payment charging use `$order->currency_code` or fail closed.** If the selected gateway cannot present that currency, block with a clear message. Never silently charge GHS for an NGN-labelled order.
3. **Seed and manage shipping rates and FX rates.** Add admin CRUD and a scheduled FX refresh. Remove the two disconnected legacy FX paths or make them feed one canonical table.
4. **Fix customs resolution.** Store ISO codes consistently, add Senegal rules, and return `duty_configured=false` as a visible state instead of zero duty.
5. **Make identity verification country-aware and fail closed.** Replace `Ghana Card last 4` with `Government-issued ID last 4` from the market profile. If no scheme exists, disable the badge with an explicit message.
6. **Remove Ghana region fields when another country is selected.** Store country before location details.
7. **Delete user-facing debug strings:** `uyrttgr`, `quaternaries`, `Need a order id`, `1000৳` in English copy.

### P1: terminology and translation

1. Publish a glossary and route all new strings through it. Key replacements:

| Current | Recommended |
|---|---|
| `Ghana Card` | `Government-issued ID` with country-specific label |
| `Region (Ghana)` | `Region`, `State`, `County` from market profile |
| Hardcoded `GH₵` | `formatCurrency(amount, market)` |
| `Ghana Agro Index` | `Agro Market Index` with country qualifier when needed |
| `Standard Ghana Units` | `Local unit guide` |
| `Popular Ghana Staples` | `Popular staples` |
| `Guidance to your quaternaries` | `Answers to your questions` |
| `Telecel Cash` vs `Vodafone Cash` | One canonical label per market |

2. Fix the language selector: neutral `EN` label instead of US flag, then stage languages.
   - Phase A: `en-GH` with Ghanaian English terminology.
   - Phase B: Twi/Akan, Ewe, Ga, Fante based on user research.
   - Phase C: French for Senegal/Côte d'Ivoire, Swahili for East Africa, Hausa in Latin script for West Africa.
   - Remove `ha` from RTL list unless Ajami script is intentionally supported.
3. Add CI checks: every `t("...")` key must exist; flag raw literal toast/label/title props; pseudo-localize to find layout breaks.
4. Clean catalogs: remove duplicate keys, fix wrong-language values, lazy-load locale chunks, and avoid invalidating all queries on language change.

### P2: QoL that makes each country feel understood

1. **Onboarding asks country first**, then shows local address shape, phone prefix, ID type, payout method, currency and units.
2. **Generalize market prices.** Keep the existing GHS source plus explicit FX fallback pattern, but parameterize seasons, units, hubs and benchmark labels by country.
3. **Local support.** Put WhatsApp on the help page and normalize numbers with E.164 from the market profile.
4. **Receipts and invoices.** Show local tax labels, currency code, FX rate and `charged in` line so cross-border users are never surprised.
5. **Mobile ergonomics.** Raise the 8px step labels to at least 12px, wrap all mobile header titles in `t()`, keep inputs at 16px, use bottom sheets for long forms, and show sticky primary CTAs with error summaries above them.
6. **Translated admin/vendor surfaces.** Finish marketer, rider, backyard-farm, regional-tour, trade-bloc and organizer-verification Blade views using the same `translate()` conventions as the older 698 Blade files.

---

## 6. Decisions needed before implementation

1. Which countries are in v1? Recommendation: Ghana domestic first, then Nigeria and Kenya as a managed pilot only after P0 payment/FX/shipping fixes.
2. Is the first non-English language set Ghanaian languages or French/Swahili? This should follow user research and support capacity.
3. Which FX source is authoritative, and who owns rate refresh and reconciliation?
4. Which gateways are enabled per country, and what happens when a user selects an unsupported currency?
5. What ID schemes are accepted for verified organisers in each country?
6. Are unsupported countries shown as `coming soon`, or blocked at onboarding?

---

## 7. Verification performed

- Frontend, canonical backend and product documentation were read directly. No runtime exploitation or live API calls were used.
- Key claims were cross-checked with targeted greps: active language list, i18n imports, hardcoded `GH₵`, checkout currency payload, payment currency source, customs seeder format, customs resolver, currency-rate seed, shipping-rate seed note, unfinished strings, Ghana region fields, Ghana Card verification, backend language directories, and payout rails.
- No files were modified by this analysis.

---

## 8. Implementation status (market profiles slice)

This section records what was actually changed in the isolated `africa-market-profiles` branches, verified from `git diff` and `git log`, not from intent.

### Backend (branch `africa-market-profiles`, based on `a36abada`)

- `ba98015d` added `config/market_profiles.php` as the source of truth for GH, NG, TG, CI, BF, SN, BJ, ML, KE and ZA. Each profile carries locale, currency, phone, address labels, identity label, payment gateways, payout rails, units and support locale. Unsupported countries have no profile and fail closed.
- `ba98015d` added `MarketProfileService` with country/alias normalization and `assertPayable()`, which blocks a country/currency/gateway combination that is not allowed. Paystack supports XOF; Flutterwave does not, so XOF markets only offer Paystack.
- `ba98015d` changed `PaymentController` to charge using `$order->currency_code` and to reject unsupported combinations with HTTP 403 `unsupported_payment_currency`. The charge market is resolved from the order origin, then the fulfilling store, never a global Ghana default.
- `ba98015d` made customs resolution ISO-aware (full legacy names still match), added Togo and nearby ECOWAS customs rows, and added FX/shipping baseline seeders labelled `manual_baseline` with explicit provenance in quote responses.
- `ba98015d` added `market:rates:refresh` (daily schedule) writing dated `open.er-api.com` rates so manual baselines are visibly replaced by live data.
- `ba98015d` added XOF payout rails for TG, CI, BF, SN, BJ and ML.
- `67f10876` made store registration persist `country_code` and made marketer applications validate country, region labels, phone and payout network per market; unsupported countries are rejected with 403.
- `7bacdd5e` added admin FX and shipping lane CRUD at `/admin/market-rates` with a refresh button, so operators can replace indicative baselines manually.
- `ffd29f58` corrected cross-border charging to use the fulfilling store's market currency, because order amounts (including landed cost) are denominated there.

### Frontend (branch `africa-market-profiles`, based on `9ee09ea`)

- `5fc151b` added `src/utils/marketProfiles.js` mirroring the backend profiles, with `normalizeCountry`, `getMarketProfile`, `getCurrencyOptions`, `formatMarketCurrency`, country options and SSR-safe stored-country helpers.
- `5fc151b` made `CardHelpers.getAmountWithSign` use the market symbol and decimal places, so XOF markets show whole CFA amounts while Ghana keeps two-decimal cedi formatting.
- `5fc151b` replaced the cosmetic global currency selector in checkout with options derived from the fulfilling store's market; the payload now sends that market's currency only.
- `5fc151b` made store registration country-first with ISO codes, Ghana-only region/district fields, and localized manual fields for other markets.
- `5fc151b` made the marketer application country-first with market phone placeholders, region labels and payout networks.
- `5fc151b` made organiser verification country-aware: country-specific ID label, last-4 label and hint, and a fail-closed unavailable state when the market has no verification scheme.
- `5fc151b` replaced the US-flag English-only selector with English (Ghana/Nigeria) and French (Togo/Côte d'Ivoire) market pairs, and added a minimal `fr` i18n resource with English fallback.
- `a4d9614` corrected the checkout currency derivation to the fulfilling store market and updated the French copy accordingly.

### Explicitly deferred or not done

- No runtime or database verification was possible: no `vendor/autoload.php`, no DB configuration, and MySQL refused local connections. All checks are static (`php -l`, `git diff --check`, `npm run build`).
- No live FX rate, shipping quote or payment was executed. Seeded rates are labelled baselines and must be replaced with operator-confirmed values via the admin screen or the scheduled refresh before production use.
- The remaining hardcoded `GH₵` strings in group buys, trade RFQs, the agro ticker and order invoices were left as explicit GHS because their source amounts are GHS-denominated. Re-labelling them with another symbol without a real conversion would misrepresent amounts. Currency-code labelling and receipt conversion are tracked as P1/P2 work.
- `queryClient.invalidateQueries()` on language change is unchanged. The broad invalidation can cause stale UI state and is tracked separately.
- Full local-language catalogues (Twi, Ewe, Ga, Hausa, Swahili) and the `t()` key CI check are not implemented; this slice only enables a minimal French resource and market-aware base locales.
- Admin rate management exposes manual entry through Blade forms only; there is no bulk CSV import or audit log for rate changes.
### Push status (confirmed)

Pushed to both public production `main` branches and verified from a fresh `git fetch`: local and remote heads are identical (0 commits ahead, 0 behind).

- Frontend `origin/main` (`johnsonsemmanuel/aduanefie`) is at `032069a7104382ac30ce62ad6526f042216582b9`.
- Backend `backend/main` (`johnsonsemmanuel/aduanefie-backend`) is at `056370f031d36ce4aafb1f463814e5fd90540f3b`.

Both remotes had advanced with unrelated work after the initial fetch: 2 frontend commits and 7 backend commits (6 found on the first fetch, one more `8d03a590` during integration). The local branches were merged with those remote commits rather than force-pushed, so no remote work was discarded. The only overlapping file in the first merge was `routes/admin.php`; a second backend merge conflicted in `_agro-ops-strip.blade.php`. Both were resolved by keeping both sides' changes.

Additional commits added during integration:
- `032069a` (frontend) and `dc91b41d` (backend) removed U+2014 em dashes that the merged-in remote commits had reintroduced into UI strings.
- The merge commits (`2dc5098` frontend; `638648c7` and `056370f0` backend) preserve the remote work alongside the market-profiles slice.

No runtime/DB verification was performed after the push; deployment health still needs confirming in the live environment.

