# Marketplace Page Audit: Color, Theme, and Mobile Inconsistencies

## Overview
This audit identifies inconsistencies in the marketplace pages' colors, theming, and mobile responsiveness, and the module switcher's availability across pages.

> **IMPORTANT - Correction after code verification (2026-11-21):**
> The initial version of this audit contained inaccuracies. It claimed the module
> switcher was "only on the home page" and that `ModuleSelect` was "hidden on
> mobile." Reading the actual header chain
> (`HeaderComponent` → `NewNavBar` → `MobileNavBar`) showed:
> - **Desktop** already shows the mode switcher on **every** route
>   (`NewNavBar.js` lines 608-659 + 833-836).
> - **Mobile** was the real gap: `MobileNavBar.js` gated the "Market" trigger
>   behind `showModuleTabs` = `/home` + `/home/*` only.
> - **`ModuleSelect` is dead code** - imported in `module-wise-layout/index.js`
>   but never rendered (the JSX is commented out at line 71), so its
>   `display: none` on `sm` is not user-visible.
> All findings below reflect the corrected, verified state.

---

## Header / Switcher Architecture (verified)

```
HeaderComponent (src/components/header/index.js)
  └─ NewNavBar (new-navbar/NewNavBar.js)
       ├─ isSmall (max-width:1180px)  → MobileNavBar (new-navbar/MobileNavBar.js)
       └─ otherwise                   → desktop top bar (renderDesktopTopBar)
```

Both `NewNavBar` and `MobileNavBar` render their own `ModeSwitcherModal`.

| Surface | Before Fix #1 | After Fix #1 |
|---------|---------------|--------------|
| Desktop, all routes | ✅ Switcher shown | ✅ unchanged |
| Mobile `/home`, `/home/*` | ✅ "Market" trigger | ✅ unchanged |
| Mobile `/store`, `/product`, `/trade`, etc. where navbar renders | ❌ no trigger | ✅ "Market" trigger |
| Mobile module-agnostic routes (`/welcome`, `/trade*`) | n/a | ⛔ intentionally excluded (mirrors `ModuleChecker.isModuleAgnosticRoute`) |
| Mobile routes where navbar returns `null` | ❌ no header at all | ✅ Fix #6: alternate header layers now carry the shared trigger |

---

## 1. Module Switcher Availability - FIXED (Fix #1)

**File:** `src/components/header/new-navbar/MobileNavBar.js`

**Before:**
```javascript
const showModuleTabs =
  router.pathname === "/home" || router.pathname.startsWith("/home/");
...
{showModuleTabs && modules?.length > 0 && ( ...Market trigger... )}
```

**After:**
```javascript
// The desktop navbar exposes the mode switcher on every route (see
// NewNavBar.renderDesktopTopBar), but mobile previously gated it behind
// /home only. Keep the mobile trigger in sync with desktop: show it on
// every page where this navbar renders, except the module-agnostic routes
// that don't carry ?module= (mirrors ModuleChecker.isModuleAgnosticRoute).
const isModuleAgnosticRoute =
  router.pathname === "/welcome" ||
  router.pathname === "/trade" ||
  router.pathname?.startsWith("/trade/");
const showModeSwitcher = modules?.length > 0 && !isModuleAgnosticRoute;
...
{showModeSwitcher && ( ...Market trigger... )}
```

**Verified:** `npx next build` compiled successfully (`✓ Compiled successfully in 40s`).

---

## 2. Module-Selector Theming & Dead Code - FIXED (Fix #2)

### 2a. Unified `ModeSwitcherModal` card surface
**File:** `src/components/module-select/ModeSwitcherModal.js`

Featured cards used `1.5px` borders while secondary cards used `1px`, with the
active/hover background and border colors duplicated in both places. Both now
spread one shared helper so they cannot drift again:

```javascript
const cardSurfaceSx = (isActive) => ({
  bgcolor: isActive ? theme.palette.primary.lite : theme.palette.background.paper,
  border: "1.5px solid",
  borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
  transition: "border-color 0.15s ease, background-color 0.15s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    bgcolor: theme.palette.primary.lite,
  },
});
```

Both card `<Box>` elements now use `...cardSurfaceSx(isActive)`; only
size/layout props (`p`, `borderRadius`, `display`, `gap`) remain per-card.

### 2b. Removed dead `ModuleSelect` sidebar
`ModuleSelect.js` was imported but never rendered. It also held two exported
zone utilities that ARE used elsewhere, so those were extracted first:

- **New:** `src/components/module-select/moduleZone.js` - `getCurrentZoneIds`, `zoneWiseModule` (verbatim, no behavior change).
- **Updated imports:** `ModeSwitcherModal.js` (`./moduleZone`), `module-selection/index.js` (`../../../module-select/moduleZone`).
- **Deleted:** `src/components/module-select/ModuleSelect.js` (167 lines).
- **Cleaned:** `module-wise-layout/index.js` - removed the dead `ModuleSelect` import plus unused `useMediaQuery`/`isSmall`.

**Verified:** two builds, both `✓ Compiled successfully`; no remaining imports of `ModuleSelect`.

---

## 3. Header/Layout Follow-ups

### 3a. Module switcher missing from alternate mobile headers - FIXED (Fix #5)
`MobileNavBar` returns `null` on many routes. Those pages do not lack a header
- they render one of several *other* mobile header components, none of which
had a mode switcher.

A single shared `src/components/module-select/ModeSwitcherTrigger.js` now
provides the trigger in three variants (`mobile`, `desktop`, `compact`), with
one availability rule (`utils/moduleRoutes.js`) and one theming source. It owns
its own modal, so no header wires modal state anymore. Applied to every header
layer:

| Header layer | Routes covered |
|---|---|
| `ModeSwitcherTrigger variant="desktop"` in `NewNavBar` | all desktop routes |
| `variant="mobile"` in `MobileNavBar` default bar | all module-aware mobile routes |
| `variant="compact"` in `MobileNavBar` section/category bar | `/home/[...slug]`, `/home/category/[slug]` |
| `variant="compact"` in `SimpleMobileHeader` | ~26 routes (policies, registrations, rental, campaigns, wishlist, all-stores, trade) |
| `variant="compact"` in `CheckoutMobileHeader` | `/checkout` |
| `variant="compact"` in `MobileSearchPageBar` | `/search` (sidebar modules) |
| `variant="compact"` in `ProductDetails`, `UserInformation`, `Top-2` | `/product/[id]`, `/profile`, `/store/[id]` |

Also fixed: `ModuleChecker` and the trigger now share one `isModuleAgnosticRoute`
rule; `/service/checkout*`, `/service/all-providers` were added to
`MobileNavBar`'s null list because they already render `SimpleMobileHeader` and
`MainLayout` gives them a full-bleed offset (they previously showed two headers
and would now show two triggers); `ScrollUpButton` moved off its private
900px/1000px breakpoints onto the shared 1180px queries.

> **Critical bug caught during this fix:** Fix #1 had placed
> `showModeSwitcher = modules?.length ...` above the `useSelector` that declares
> `modules`, a temporal-dead-zone `ReferenceError` that `next build` cannot
> detect. Removed entirely when the shared trigger replaced the inline markup.

### 3b. Inconsistent `isSmall` breakpoints - FIXED (Fix #3)
The header shell used `theme.breakpoints.down("md")` → **1000px** (`md` is
customized in `base-theme-options.js`, not the MUI default 900px), while
`NewNavBar`/`MainLayout`/`BottomNav` used **1180px**. Between 1000-1180px the
mobile bar rendered **without** its scroll-collapse behavior, because the
collapse CSS was also keyed to `down("md")`.

**Fix:** added `src/utils/breakpoints.js` as the single source of truth:
```javascript
export const MOBILE_LAYOUT_BREAKPOINT = 1180;
export const MOBILE_LAYOUT_MEDIA_QUERY = `(max-width:${MOBILE_LAYOUT_BREAKPOINT}px)`;
export const DESKTOP_LAYOUT_MEDIA_QUERY = `(min-width:${MOBILE_LAYOUT_BREAKPOINT + 0.01}px)`;
```

Consumers migrated:
- `header/index.js` - `useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY)` (removed unused `useTheme`)
- `header/NavBar.style.js` - collapse CSS now `[`@media ${MOBILE_LAYOUT_MEDIA_QUERY}`]`
- `header/new-navbar/NewNavBar.js` - `useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY)`
- `layout/MainLayout.js` - `useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY)` (removed unused `useTheme`)
- `header/BottomNav.js` - `[`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]`

**Verified:** `✓ Compiled successfully`; grep confirms no stale `1180px`/`down("md")` in the header chain.

> Note: other components (categories, product page, checkout, store registration,
> etc.) still hardcode `1180px` for their own layout switches. They already
> agree on the value, so they were left untouched to keep this fix scoped.

### 3c. Mobile margin breakpoint mismatch - FIXED (Fix #4)
`getMobileMarginTop()` returns different values per module (default `7.6rem`,
rental `3rem`/`6.3rem`, parcel `5.4rem`, ride `4.9rem`, BOGO `3.25rem`). Those
values are **intentionally not uniform** - each module renders a different set
of header rows, so they were left unchanged (the stale comment claiming a
`11.9rem` default was corrected to `7.6rem`, and the intent is now documented
in the code).

The real bug was the *breakpoint*: `marginTop: { xs, md, lg }` switched at the
theme's `md = 1000px` while `MobileNavBar` still renders until 1180px, so
1000-1180px got a desktop offset under a mobile header. `MainLayout` now uses
`DESKTOP_LAYOUT_MEDIA_QUERY` (1180px) for the mobile→desktop switch and
`theme.breakpoints.up("lg")` for the 1240px refinement.

### 3d. Bottom-nav visibility vs. footer clearance - FIXED (Fix #4)
`BottomNav` was hidden for `page=parcel`, `/store/[id]`, `/product/[id]`,
`/service/provider/[id]` and `/service/service-details/[id]`, but
`footer/index.js` reserved `65px` for it on **every** non-`/welcome` route -
leaving a phantom gap on those pages. It also dropped clearance at `md=1000px`
while the nav persisted to 1180px, so the nav overlapped the footer on tablets.

**Fix:** new `src/utils/mobileBottomNav.js` is the single source of truth:
```javascript
export const MOBILE_BOTTOM_NAV_HEIGHT = 65;
export const shouldShowMobileBottomNav = ({ pathname, page }) => {
  if (page === "parcel") return false;
  return !HIDDEN_BOTTOM_NAV_ROUTES.has(pathname);
};
```
- `MainLayout.js` - `{isSmall && showBottomNav && <BottomNav />}` (replaces the inline condition).
- `footer/index.js` - clearance is `0` when the nav is hidden, `120px` on `/home` (ScrollUpButton above the nav), otherwise `MOBILE_BOTTOM_NAV_HEIGHT`; cleared via `DESKTOP_LAYOUT_MEDIA_QUERY`, not `md`.
- `BottomNav.js` - height comes from `MOBILE_BOTTOM_NAV_HEIGHT`.
- Happy-hour floating banner - bottom offset uses the same constant and hides at the shared 1180px query.

**Verified:** `✓ Compiled successfully`; `grep` confirms no remaining `65px` magic number or `HAPPY_HOUR_BANNER_BOTTOM` in these files.

---

### 3e. Headerless routes + cross-layer breakpoint consistency - FIXED (Fix #6)
Added `src/components/common/CompactMobileHeader.js` - back + title + shared
`ModeSwitcherTrigger`, hidden at the same 1180px cutoff as `MobileNavBar` and
`MainLayout`. It uses an explicit `backHref` where a detail page should return
to its list, with a safe module-home fallback on direct loads.

Routes now covered:
- `/search` for parcel/rental/ride (non-sidebar modules); the 60px spacer is
  only applied to the sidebar-module branch that still uses the fixed search bar.
- `/service/provider/[id]` → back to `/service/all-providers`.
- `/service/service-details/[id]` → back to the provider, or all-providers.
- `/home/wishlist` for rental - the old `RentalWishListLayout` returned `null`;
  it now renders the shared header plus a low-data empty state and CTA.
- `/service/custom-service/create` and `/service/custom-service/details/[id]`
  (also full-bleed and headerless - found during this pass).

Also verified/fixed:
- Every alternate mobile header (`SimpleMobileHeader`, `CheckoutMobileHeader`,
  `MobileSearchPageBar` wrapper, product/profile/store bars, category/section
  action bars, product-details spacer) now hides at **1180px**, not the theme's
  `md` = 1000px. Previously 1000–1180px lost these headers while the bottom nav
  and mobile offsets were still active.
- Added `/trade*` to `MobileNavBar`'s null list - those pages render
  `SimpleMobileHeader`, so the module bar was a second header.
- Added the new custom-service routes to the same null list.
- Removed dead `isSmall`/`useMediaQuery` from `Top-2.js`.

**Verified:** `npx next build` compiled successfully after the breakpoint group,
the route-header group, and the final cleanup; `grep` confirms one
`isModuleAgnosticRoute` definition, no stale inline switcher state, and trigger
coverage on all header layers.

---

## Fix Log
- **Fix #1 (done):** Mobile mode switcher available on all module-aware pages where the navbar renders - `MobileNavBar.js`, build verified.
- **Fix #2 (done):** Unified `ModeSwitcherModal` card surface and removed dead `ModuleSelect` sidebar (utilities extracted to `moduleZone.js`) - builds verified twice.
- **Fix #3 (done):** Aligned header/layout breakpoints via `utils/breakpoints.js` (1180px everywhere in the header chain) - build verified.
- **Fix #4 (done):** Unified bottom-nav visibility/geometry via `utils/mobileBottomNav.js`, aligned mobile-margin and footer-clearance breakpoints to 1180px, documented intentionally per-module top margins - build verified.
- **Fix #5 (done):** One shared `ModeSwitcherTrigger` across all seven header layers, shared module-agnostic route rule, fixed the Fix #1 TDZ crash, removed double headers on `/service/*`, aligned `ScrollUpButton` breakpoints - build verified.
- **Fix #6 (done):** Shared `CompactMobileHeader` on every previously headerless module-aware route; all alternate header layers moved to the shared 1180px cutoff; duplicate trade/custom-service navbars removed; `next build` verified - commit `d52be11`.

## Backend counterpart
The API side was on `aduanefie-backend` `main` as `75b8941a`
("add analytics and page metadata endpoints used by React frontend") at the
time of Fixes #1-#6. Its added controller methods and routes were byte-for-byte
identical to the local workspace commit `c19e70e`, so no backend push was
needed then. (A `backend` remote was added in the root repo pointing at
`aduanefie-backend` for that check.) The canonical backend head has since
advanced - see Fix #9.

## Known gaps deliberately left open
- The per-module `getMobileMarginTop()` values remain hand-tuned to each
  module's real header height; they were documented, not standardized.

## Fix #7 (done)
The last two non-header `md` = 1000px layout switches were aligned to 1180px:
product-details' split "more from store" layout and the store hero card/logo/
banner/mobile back arrow. `next build` verified; pushed as `1059b08`.

---

## Fix #8 - Shared group buying + no-data cleanup (done, 2026-11-21)

Written from the commits actually pushed, not from the implementation notes.

**Pushed commits**
- Frontend: `fdbf9a2` → `origin/main` (`aduanefie`), 14 files, +920/-517;
  follow-up `585f5d1` fixed the create dialog's prefilled item ID and was
  build-verified before push.
- Backend: `3c1ef4d0` → `backend/main` (`aduanefie-backend`), 14 files, +1299;
  follow-up `5f24302e` corrected the join event's committed count and was
  syntax-verified before push.
- Root local mirrors: `ce54568f` + `03d0b312` on local `master` only, **not
  pushed** (root tree layout differs from `backend/main`; pushing it there
  would be destructive).

**Verified**
- `npx next build`: compiled successfully; `/group-buys` and `/group-buys/[id]`
  both appear in the route table.
- `php -l` on all 12 changed/new PHP files: no syntax errors.
- `php artisan route:list --path=group-buys` in a worktree based on
  `backend/main`: 14 routes (8 customer, 6 admin).
- `git ls-remote` confirms both remote heads match the local commits above.

**Rules implemented**
- Target value is configurable per group (2,000 GHS is only the suggested
  example), derived from the catalogue item price snapshotted at creation.
- Equal integer shares: pooled units are rounded up to a multiple of the member
  limit, so every member receives the same count.
- Each member gets their own order, so delivery is charged per member and the
  supplier ships to each address.
- Failed/expired/cancelled groups release members. **No money is captured at
  join**, so "auto-refund" means nobody was charged - there is nothing to
  reverse with the current gateway set (no generic authorize/void/capture).
- `module_id` on every group makes it reusable across modules; pharmacy is the
  deliberate exception (prescription checkout rejects `group_buy_id`).
- Checkout fails closed: group must be locked, caller must be a committed
  member, cart must contain exactly the one item line, quantity must equal the
  fixed share, and the unit price is re-derived server-side. A unique
  `orders.group_buy_participant_id` column plus a locked re-check inside the
  transaction prevent two simultaneous checkouts of one share.

**No-data and dead-content cleanup**
- Removed fabricated testimonials (`John Smith`, `Sarah Johnson`, ...); the
  landing section now shows "No customer reviews yet" with an admin-dashboard
  hint when the list is empty. Nav arrows only render for multiple reviews.
- Deleted dead files: `home/featured-categories/demo.js` + its `example.png`,
  `useGetSearchPageData-old.js`, and the unused fake chat `sampleConversations`
  (date helpers in that file were kept).
- `/market-prices` already had an explicit "No market price data yet." state;
  admin CRUD for manual entry remains at `/admin/agro-prices`.
- Admin group moderation lives at `/admin/group-buys` (list, detail, cancel,
  expire, ship, deliver).

**Known gaps at the time (see Fix #9 for current status)**
- The migration `2026_11_21_000001_create_group_buys_tables.php` initially had
  **not** been run against any deployed database. A later deployment change
  (`cf7fbed8`, see Fix #9) addressed migration deployment.
- The scheduler must actually run `group-buys:expire` every 10 minutes; it is
  registered in `app/Console/Kernel.php`, but no crontab was provisioned here.
- If a capture-capable payment gateway is added later, the release path must be
  updated to reverse captured funds - today it only marks participants released
  because no charge ever occurs.
- Trade blocs had used `FALLBACK_TRADE_BLOCS` static reference copy; Fix #9
  removed that fallback from the frontend and enabled live API data by default.
- The root tree's local `master` commit is a mirror only. Do not push it to
  `origin/master`; the canonical backend branch is `backend/main`.

---

## Fix #9 - Mobile friction, guest 401s, live data, performance (done, 2026-11-21)

Written **after** the commits, from `git log` / `git show --stat`, not from
implementation notes. This is the last work-state section.

### Pushed commits (verified against the remotes)
| Repo | Commit | Content |
|---|---|---|
| `aduanefie` `origin/main` | `bc7801d` | `feat(marketplace): mobile-first group buying, trade and layout polish` - 50 files, +778/-424, including new `src/utils/tradeOptions.js` |
| `aduanefie-backend` `backend/main` | `81f9d48b` | `Add live trade bloc detail and corridor endpoints` - `TradeController.php` + `routes/api/v1/api.php`, +79/-33 |
| `aduanefie-backend` `backend/main` | `cf7fbed8` | `Deploy migrations and remove per-request setting queries` |
| root local `master` only | `9729a4c7` | Mirror-only group-buy expansion - **not pushed** (see Known gaps) |

`git status` on `Aduanefie/frontend` and on the canonical backend worktree is
clean (`## main...origin/main`, `## backend-group-buy...backend/main`).

### Changes, grouped by user-visible outcome
- **Mobile keyboard friction:** known option sets are now Selects / bottom sheets
  instead of free-text inputs - RFQ units and countries (`TradeRfqSection.js`),
  group destination and members (`pages/group-buys/index.js`,
  `CreateGroupBuyDialog.js`), 48 fixed 30-minute delivery/service time slots
  (`ScheduleDelivery.js`, `ServiceDetails.js`), and shared searchable selects
  (`SearchableSelect.tsx` only shows its search box for >6 options;
  `CustomMultiSelect.js` and `CustomPhoneInputManual.jsx` no longer autofocus).
  `CustomModal` in `src/components/modal/index.js` is the shared slide-up sheet;
  language confirmations, address picker and group creation now use it.
- **Header/layout consistency:** `SimpleMobileHeader` added to `/market-prices`,
  `/group-buys`, `/group-buys/[id]`; those routes joined `FULL_BLEED_MOBILE_ROUTES`,
  `SIMPLE_HEADER_ROUTES` and `isModuleAgnosticRoute` in `moduleRoutes.js`, so the
  mode switcher stays hidden on `/welcome`, `/trade` and `/trade/*`.
- **Guest 401s:** token checks added at the query boundary (because React Query
  v3 `refetch()` ignores `enabled`) in wish-list, profile, cashback, visit-again
  and `profileApi.js`; query keys include the token so a login/logout cannot
  reuse another identity's cache. `useReviewReminderCancel` stays `enabled:false`
  and only fires on an authenticated action.
- **No fallback data presented as current:** live trade API is on by default,
  seeded bloc data no longer serves as current data, FX fallback rates removed
  with an explicit GH₵ reference notice when live FX is unavailable; explicit
  empty/error/retry states added for market prices, group buys, RFQs and stores.
  `/store` is now a legacy alias that redirects to `/all-stores`.
- **Performance:** `_app.js` no longer runs `getInitialProps`, re-exports a bogus
  page `getServerSideProps`, or recreates `persistStore` on every render;
  `serverSidePropsHelper.js` fetches config and metadata in parallel.
- **UI cleanup:** agriculture icons replace restaurant/dining icons on store
  cards and modals; logistics registration matches the vendor step-0 chrome,
  required markers and inline upload errors.

### Verification actually run
- `npx next build`: **✓ Compiled successfully in 59s**; `First Load JS shared by
  all` still **632 kB** (no bundle-size regression from this work).
- `formatTimeSlot`: `"00:00" → "12:00 AM"`, `"08:00" → "8:00 AM"`,
  `"13:30" → "1:30 PM"`, `"23:30" → "11:30 PM"` (dayjs `customParseFormat` is
  not registered, so the helper formats the fixed slots directly).
- Production server restarted on `http://localhost:3006`; HTTP smoke test:
  `/store` **307 → `/all-stores`**, and `/market-prices`, `/group-buys`, `/trade`,
  `/trade/blocs`, `/all-stores` all **200**.
- Railway re-probe after redeploy (`zoneid:[1]`, `origin:https://aduanefie.com`,
  `moduleId:2`): `/api/v1/trade/blocs/{ecowas,afcfta}` → **200** with `{"bloc":…}`
  (TTFB 0.74–0.90s); both `/…/corridors` → **200** with `{"corridors":[]}`.
- Browser check at a real **486px** viewport across all six routes above:
  `document.documentElement.scrollWidth = 483` (no horizontal overflow),
  **0** `[autofocus]` elements, **0** network requests to
  `wish-list` / `customer/info` / `review-reminder` / `visit-again` /
  `cashback/list`, **0** 401s, **0** console errors. On `/market-prices` the
  only API calls were `config/get-zone-id`, `customer/cart/list` (guest id),
  `trade/agro-prices`, `trade/fx-rates` - all 200 (preflights 204).
- The create-group sheet was opened and measured in the DOM: `position:fixed`,
  `bottom:0`, full width (467px in a 486px viewport), rounded top corners (18px),
  **2** comboboxes (members, destination) and **0** text inputs - confirming the
  slide-up/no-keyboard behavior rather than relying on the code description.

### Known gaps deliberately left open (do not report these as done)
- Root `master` mirror commit `9729a4c7` adds consent enforcement, escrow
  tracking, notifications, GPS, customer web views and admin payment overview.
  It is **not** in canonical `backend/main` and was **not ported** - this was
  explicitly confirmed as the chosen disposition on 2026-11-21. Porting it
  blindly would make `GroupBuyService::join()` require `consent_accepted`, which
  the React join UI does not send - the join flow would silently fail closed.
  If it is ported, add matching consent UI and re-verify join **and** checkout.
- `First Load JS shared by all` is unchanged at 632 kB; CSS ≈215 kB, `_app`
  chunk ≈317 kB. Flaticon/language payload trimming and backend cache/index work
  were deferred with no build-size verification.
- Remaining free-text → bottom-sheet conversions beyond the flows named above
  were deferred.
- `group-buys:expire` is registered in `app/Console/Kernel.php` every 10 minutes,
  but crontab provisioning was not confirmed.
- There is still no capture-capable gateway. When one is added, failed-group and
  release paths must reverse captured funds; today nobody is charged at join.
- `http://localhost:3006` is a local verification server, not a deployment.

---

## Fix #10 - Trust badges, invite email, discovery, bloat removal (done, 2026-11-21)

Written last, after the commits, from `git log` / `git diff` and the actual
verification logs. This is the current work state.

### Pushed commits (verified against both remotes)
| Repo | Commit | Content |
|---|---|---|
| `aduanefie` `origin/main` | `eb65856` | `feat(marketplace): organizer trust badge, refer-a-friend invites, and discovery` - 114 files, +469/-7851 |
| `aduanefie` `origin/main` | `d28c65e` | Concurrent session: public Regional Tours page, WhatsApp group-buy sharing, ProfileDrawer quick-explore - 3 files, +425 |
| `aduanefie` `origin/main` | `dae2bce` | Replaced the last long em dash in Regional Tours copy - 1 file |
| `aduanefie-backend` `backend/main` | `0633ac60` | Concurrent session commit adding organizer verification service/model/migration files, admin review controller+view, regional tours, and marketer/security work - 26 files, +1654/-44 |
| `aduanefie-backend` `backend/main` | `6e7ccbae` | `fix(group-buy): wire organizer trust badge and invite endpoints` - re-applied the controller, API and admin route and generic-user field integration dropped by the commit above - 4 files, +128/-7 |

Earlier frontend commits already on `origin/main`: `c1d7b5a` (5-tab bottom
nav, consistent mobile headers, scoped footer, smart group CTA, close/leave
reasons), `6916d15` (module card declutter), `a1cbd98` (edit/members/chat UI).
Earlier backend commits already on `backend/main`: `b5b3422e` (member leave
reason, chat notice, organiser close reason) and `3b7d9a4d` (storage log 500,
offers/pro-customer routes).

### Integration regression caught and fixed
Twice in this session, a concurrent commit absorbed new trust/invite files but
dropped the edits that connect them to the API. The first occurrence was on
`b5b3422e`; the second was on `0633ac60`. On the second occurrence the pushed
state had service/model/migration files but **no** routes, **no** controller
methods, **no** admin route, and **no** generic-user field hiding, so every
new endpoint would have 404/500. All four integration points were re-applied,
linted, committed as `6e7ccbae`, and pushed. Verify they stay present in any
future commit that touches `GroupBuyController.php`, `routes/api/v1/api.php`,
`routes/admin.php` or `User.php`.

### Verified-organiser trust tier
- Badge is informational, not a creation gate. Any signed-in account can open a
  group; the badge requires `status === "verified"` plus a stored masked card
  reference, an admin-set verification timestamp, and at least **2 delivered
  external orders** (non-guest, no `group_buy_id`, own vendor store excluded).
- Ghana Card handling stores only the last 4 alphanumeric characters plus
  admin review status and note. Full card numbers and card images are never
  accepted or stored. NIA validation cannot be performed in-app, so review is
  manual through `/admin/organizer-verifications`.
- Public surfaces (group index/show and member list) expose only the boolean
  badge. The masked reference is returned solely from the owner's own
  `GET /api/v1/group-buys/organizer/verification`.
- Degraded security state fails closed: enrolled-but-unverified or
  rejected/pending never renders a verified badge.

### Refer-a-friend invite
- Sender-initiated only: a signed-in organiser or member submits one explicit
  friend email. No inferred-interest bulk email from purchases or wishlists.
- `POST /api/v1/group-buys/{id}/invite`, 24h per group+address and 20/day per
  sender limits. Invalid email returns 403, duplicate/rate limit 429, mail
  failure 502 with the invite row deleted.

### Marketplace discovery and UI
- `OngoingGroupBuysSection` inserted into Grocery and ecommerce `overviewContent`
  only, scoped to `status=open` and the module's `moduleId`, hidden when empty,
  and reusing `GroupBuyCard`. Pharmacy deliberately excluded.
- `VerifiedBadge` wired into group cards, detail, member list and profile
  settings. Invite and verification CTAs on group detail are insider-only and
  correctly absent in guest views.
- Product picker is supplier Autocomplete above product Select, with a searchable
  supplier list and auto target (already committed in earlier work).
- All long em dashes removed from changed frontend/backend source; all 46 in
  this audit document were also removed.

### Bloat removal
100 unused source files plus a demo MP4 and a zipped component were removed:
unreferenced hooks, shimmers, legacy cards, dead layouts, one-file utilities,
fake-data modules and unused SVG assets. The deletion list was checked against
`git status` with no missing entries.

### Verification actually run
- Clean `npx next build` with `outputFileTracingRoot: __dirname`: exit 0,
  `✓ Compiled successfully in 2.2min`, 15/15 static pages, no workspace-root
  warning. Log: `/tmp/opencode/aduanefie-build-tracingroot.log`.
- All 15 changed/new JS files parsed with `@babel/parser`: ALL OK.
- `php -l` on all 10 changed/new PHP files: no syntax errors. No runtime/DB test
  was possible (no `vendor/autoload.php` and no MySQL on 127.0.0.1:3306 in the
  backend worktree).
- HTTP smoke on the production server (port 3006): `/`, `/home`, `/group-buys`,
  `/live-farming`, `/profile`, `/checkout`, `/group-buys/1` all 200; `/404` 404.
- Browser smoke: `/home` rendered the live "Ongoing group buys" strip with two
  real groups and GH₵ prices; `/group-buys` and `/group-buys/1` rendered full
  content and the guest view correctly hid member-only CTAs.
- A React #418 hydration mismatch appears in console on `/home`, `/group-buys`
  and `/live-farming` but not `/profile` or `/checkout`. It also appears on
  `/live-farming`, which has no uncommitted change to its own file. It is
  **pre-existing** relative to this work, not introduced by it. Pages render
  fully because React regenerates the tree. A clean baseline build could not be
  produced because committed HEAD imported the three new untracked components,
  which are now included in `eb65856`.

### Known gaps deliberately left open (do not report these as done)
- Backend runtime/DB verification was not possible in this environment. The
  migrations and controller methods are syntax-checked only.
- The moderator/admin review view for Ghana Card submissions exists, but no
  external NIA/Ghana Card registry validation is performed.
- Concurrent regional-tours frontend work was committed on top of `eb65856` as
  `d28c65e`, then its remaining long em dash was removed in `dae2bce`. My trust
  and discovery work survived both commits; all four new component files and
  the `outputFileTracingRoot` fix were verified still present.
- Deferred backend gaps from earlier research remain: `groupCreated()` is never
  called, admin cancel sends no member notification, there is no group-buy
  push/FCM, group-buy mail bypasses notification opt-ins, API consent fields
  have no write path, and `Helpers::upload()` / `GroupBuyNotificationService`
  swallow failures.
- The scheduler still needs crontab provisioning for `group-buys:expire`.
- `http://localhost:3006` is a local verification server, not a deployment.
- Do not push the root `master` mirror. Canonical branches are
  `aduanefie/main` and `aduanefie-backend/main`.
