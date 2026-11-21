# Nearby and community QoL / UI consistency audit

Scope: customer-facing nearby discovery and community surfaces across frontend routing/UI, API headers, backend nearby endpoints, and aggregation-hub data. Verification is static/code-level only: no DB or vendor autoload is available in these worktrees.

Baselines:
- Frontend worktree: `/tmp/opencode/aduanefie-market-frontend`, branch `africa-market-profiles`.
- Backend worktree: `/tmp/opencode/backend-market-profiles`, branch `africa-market-profiles`.
- Africa market-profile baseline: frontend `9ee09ea`, backend `a36abada`.

## Guiding decision

Use one module-agnostic Nearby surface. Make it map-first when the customer grants location permission and the map can load within the low-bandwidth budget; otherwise make it list-first. Never invent a location, and never present a fallback coordinate or unsupported country as if it were real nearby data.

## Verified state at audit time

### Frontend

1. `src/api-manage/MainApi.js` always sets `latitude` and `longitude` headers. When `currentLatLng` is absent it sends `0`, so every request carries a fabricated coordinate. Nearby results can therefore be sorted around `0,0` instead of telling the customer that location is unavailable.
2. The same interceptor falls back to `zoneid = "[1]"`, the Ghana national zone, whenever no valid zone is stored. A first-time visitor in Nigeria, Togo or any unsupported market silently gets Ghana-scoped data.
3. Geolocation exists elsewhere via the `useGeolocated` hook: `src/components/Map/MapModal.js`, `src/components/Map/UseCurrentLocation.js`, and `src/components/landing-page/hero-section/HeroLocationForm.js`. None of these is on the Nearby results surface. `UseCurrentLocation` only consumes already-cached `coords`; its destructured `getPosition()` is never called, so the button does not itself request permission. `AllowLocationDialog` covers a disabled permission state but has no unavailable/timed-out state.
4. `src/utils/sectionRegistry.ts` registers `nearby` in all six modules (`food`, `grocery`, `pharmacy`, `ecommerce`, `shop`, `service`) with backend key `nearby_page`. Module section configs in `food`, `grocery`, `pharmacy`, `ecommerce` and `service` all expose a Nearby chip, so the surface is expected everywhere, but behaviour is not country- or permission-aware.
5. Nearby is spread across several entry points rather than one coherent surface: `/home/nearby?module=...` via `TabbedSectionPage.js`, `/store/top-offer-nearby` via `TypeWiseStore.js`, home sliders (`top-offers-nearme`, `popular-items-nearby`, `new-arrival-stores`), suggested searches with `quick_action=nearby`, and sort-by-distance filters. `TabbedSectionPage.js` hardcodes `quick_action: "nearby"` with All/Items/Stores tabs and does not explain location source, ask for permission, offer a radius, or degrade to a clear list when location is missing.
6. Map code exists in `src/components/Map/GoogleMapComponent.js`, but it is a single centre marker/address picker. It loads the Google JS API on entry and has no nearby markers, no list/map toggle, and no low-bandwidth fallback. Grep found no customer Nearby results consumer for this component. `MapModal` also starts from `configData.default_location`, which can make a default pin look like a detected location.
7. `src/components/header/BottomNav.js` has five tabs: Home, Groups, Live Farm, Orders, Account. Nearby is reachable through section chips, search suggestions and store pages, but not from the primary mobile nav.

### Backend

1. `app/Http/Controllers/Api/V1/StoreController.php::get_top_offer_near_me()` requires only `zoneId`; it reads `latitude`/`longitude` headers with no validation. Missing, `0`, malformed and out-of-range values all pass through.
2. `app/CentralLogics/store.php::get_top_offer_near_me()` defaults `$longitude`/`$latitude` to `0` and calls `Store::withOpen($longitude ?? 0, $latitude ?? 0)`. `get_stores()` and category store paths use the same unvalidated header pattern.
3. `quick_action=nearby` is sent by `TabbedSectionPage.js` to `api/v1/get-combined-data`, but `SearchController::get_combined_data()` never reads `quick_action`. The Nearby section is currently a generic list whose only location influence is the unvalidated distance headers.
4. `app/Models/Store.php::distanceSqlExpression()` interpolates the coordinates into raw SQL after a float cast. The cast avoids injection, but `0,0` remains a valid coordinate and produces meaningless "nearby" ordering.
5. `stores.delivery_radius_km` is defined and appended in `Store.php`, but it is not used by the top-offer/nearby store query. It is used only by `ItemController::get_live_farming_items()` with `lat`, `lng` and `radius_km` query parameters, so the store discovery surface ignores each store's own service radius.
6. `app/Models/AggregationHub.php::scopeNearby()` exists with a haversine radius query, but no caller uses it. `FarmerController::aggregation_hubs()` is vendor-only and scoped to the vendor's own store.
7. `StoreLogic::get_stores()` sorts `filter=nearby` with `orderByDesc('distance')`, so generic store lists put the farthest stores first. Discounted, search and category nearby paths use ascending distance, so the same user-visible "Nearby" label means opposite things in different places.
8. Failure shape is inconsistent across nearby-adjacent endpoints. Some require zone only, `ItemController::get_live_farming_items()` silently ignores `nearby=true` when coordinates are absent, and `StoreController::get_quick_delivery_stores()` returns an empty success payload.
9. `ConfigController::configuration()` falls back to hardcoded Bangladesh coordinates (`23.757989, 90.360587`) for `default_location`, while `MapModal` initialises its pin from `configData.default_location`. A default pin can therefore look like a detected customer location.

### Cross-cutting consistency

- Country terminology and currency are handled by `MarketProfileService` on paid flows, but nearby headers bypass any country/profile awareness: a Ghana zone and `0,0` are universal defaults.
- No feature currently distinguishes "location not requested", "permission denied", "permission granted but position unavailable", and "outside supported zone". Customers see ordinary empty or sorted results for all four.
- Map-first UI must remain optional. On low bandwidth, a forced Google Maps JS load is worse than a plain list with distances.

## Findings and priority

| ID | Priority | Finding | Risk |
| --- | --- | --- | --- |
| P0-1 | P0 | Frontend sends fake `0,0` coordinates; backend accepts/defaults them | Misleading nearby results and a false impression that location was detected |
| P0-2 | P0 | Ghana `zoneid = "[1]"` fallback for all first-time/unknown markets | Unsupported countries silently receive Ghana-scoped data |
| P0-3 | P0 | Nearby results page has no location flow; existing `UseCurrentLocation` button does not call `getPosition()` and has no unavailable/timed-out state | No informed consent on Nearby, no recovery path, privacy surprise |
| P1-1 | P1 | Nearby is fragmented across section page, store page, sliders, search and filters with no shared location/status banner; backend ignores `quick_action=nearby` | Customers cannot tell what "nearby" means or why results changed |
| P1-2 | P1 | Generic store `filter=nearby` sorts farthest first while other nearby paths sort nearest first; store discovery ignores `delivery_radius_km` | Contradictory results and stores outside their service area |
| P1-3 | P1 | `AggregationHub::scopeNearby()` unused; hubs vendor-only | Community aggregation hubs cannot be discovered by customers |
| P2-1 | P2 | No map/list toggle or low-bandwidth fallback in Nearby | Map load cost and single-marker UX are not appropriate as the only view |
| P2-2 | P2 | Nearby absent from mobile bottom nav | Discovery depends on section chips, search suggestions and store pages customers may never open |
| P2-3 | P2 | Backend `default_location` falls back to Bangladesh coordinates and map UI treats it as the starting pin | Foreign default can be mistaken for customer location |

## Recommended implementation order

1. **P0-1** Stop emitting fake coordinates. Only send `latitude`/`longitude` when a verified customer location exists. Make backend nearby endpoints return an explicit error/status when coordinates are absent or invalid.
2. **P0-2** Replace the Ghana zone fallback with market-aware behaviour. Unknown/unsupported markets must not be scoped to Ghana.
3. **P0-3** Add an explicit "Use my location" control with loading, denied, unavailable, and outside-supported-area states.
4. **P1-1** Add a Nearby status banner and keep list-first results when permission is absent.
5. **P1-2** Apply store `delivery_radius_km` to nearby store discovery.
6. **P1-3** Expose a customer aggregation-hub endpoint using `scopeNearby()`, with country/zone checks.
7. **P2-1** Add opt-in map view with list fallback and lazy map loading.
8. **P2-2** Re-evaluate bottom nav placement only after the Nearby flow is trustworthy.
9. **P2-3** Replace the hardcoded `default_location` fallback so no foreign coordinate can be mistaken for a customer location.

## Implementation status

- P0-1: fixed in frontend commit `58acf7d` and backend commit `64acc489`. Verified with frontend `npm run build`, `npx tsc --noEmit`, backend `php -l`, `git diff --check`, and a U+2014 scan. The frontend now sends location headers only for a validated stored location and disables nearby queries until one exists. Backend nearby entry points validate coordinates and reject missing, malformed, out-of-range and placeholder `0,0` values.
- P0-2: fixed in frontend commit `07406b3`. Verified with `npx tsc --noEmit` and `npm run build`. The interceptor now sends `zoneid` only when both a valid stored zone and a supported active market exist; language-selector country changes clear stale zone, coordinate and location cache entries.
- P0-3: pending.
- P1-1: pending.
- P1-2: pending.
- P1-3: pending.
- P2-1: pending.
- P2-2: pending.
- P2-3: pending.

Status is updated from `git diff` / `git log` after each verified commit, not from memory.

## Verification commands

- Frontend: `npm run build` and `npx tsc --noEmit`.
- Backend: `php -l` on changed PHP files.
- Both: `git diff --check` and a U+2014 scan.
- Avoid `npx next lint` in these worktrees: root `.eslintrc.json` fails with `Failed to load config "next/core-web-vitals"`.

## Known gaps

- Runtime/DB verification is unavailable here, so radius SQL and endpoint responses are reviewed statically.
- P0-1 disables nearby requests until a valid stored location exists, but the customer-facing explanation and recovery action are deferred to P0-3. Backend error messages are plain English for now; the UI must map the `latitude-longitude` code to localised copy.
- P0-2 resolves the Ghana fallback by omitting `zoneid` when the active market is unsupported or unknown. Zone selection still depends on the existing location picker writing a correct zone for the active market.
- No analytics exist for nearby permission acceptance, denial, or empty results, so post-release behaviour cannot yet be measured.
