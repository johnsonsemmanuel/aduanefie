# Aduanefie — current flow, and gaps for store / rider / marketer portals

**Status:** investigation only. No code changed.
**Date:** 2026-11-11
**Scope:** what is actually deployed and reachable today, how a visitor gets from `aduanefie.com` to a product, and what is missing for `store.aduanefie.com`, `logistics.aduanefie.com`, and a paid marketer programme.

---

## 0. TL;DR

1. `aduanefie.com` is **not** served by the React app. It 301-redirects to `web.aduanefie.com`, which is Vercel.
2. `api.`, `admin.`, `store.`, `logistics.` all point at **one Apache/Laravel app** on `185.151.30.164`. There is **no host-based routing**. Every subdomain returns the same HTML (`<title>Aduanefie Marketplace</title>`) and serves the same routes.
3. So `store.aduanefie.com` and `logistics.aduanefie.com` are **cosmetic aliases today**. Store owners really log in at `/login/store` and land in `/vendor-panel` — reachable from any of those hosts.
4. Store self-registration **already works end to end** (React form → `/api/v1/auth/vendor/register` → pending vendor + store → admin approval → `/vendor-panel`).
5. Riders have **no web portal at all**. Rider registration and login exist only as mobile API endpoints. `/login/delivery-man` is a 404.
6. ~~There is **no marketer / affiliate / registration-commission system** anywhere.~~ **Superseded:** a store-owned marketer commission ledger, a partners portal and admin payout screens now exist. See `docs/marketer-implementation.md`.
7. Cross-border `/trade` is currently **static marketing copy** over a seeded list of four trade blocs. The real trade/RFQ API exists in the Laravel codebase but is **not deployed**, and its tables are **not in the live MySQL database**.

---

## 1. What is actually deployed

| Host | Resolves to | Server | Behaviour |
|---|---|---|---|
| `aduanefie.com` | 185.151.30.164 | Apache | **301 → `https://web.aduanefie.com/`** |
| `www.aduanefie.com` | 216.198.79.1 / 64.29.17.1 | Vercel | 200, Next.js app |
| `web.aduanefie.com` | 216.198.79.1 / 64.29.17.1 | Vercel | 200, Next.js app (`aduanefie-production`, commit `20a6cf0`) |
| `api.aduanefie.com` | 185.151.30.164 | Apache | 200, Laravel |
| `admin.aduanefie.com` | 185.151.30.164 | Apache | 200, **same Laravel app** |
| `store.aduanefie.com` | 185.151.30.164 | Apache | 200, **same Laravel app** |
| `logistics.aduanefie.com` | 185.151.30.164 | Apache | 200, **same Laravel app** |

Evidence that the four Laravel hosts are one app:

- All four return `<title>Aduanefie Marketplace</title>`.
- All four return 200 for `/login/admin` and `/login/store`.
- All four return 404 for `/login/vendor` and `/login/delivery-man`.
- All four return 302→login for `/admin` and `/vendor-panel`.

There is no `Host`-header switch in the Laravel code, no separate `store`/`logistics` route file, and no per-subdomain document root.

**Consequence:** a store owner can log in at `https://admin.aduanefie.com/login/store` and get the same dashboard as `https://store.aduanefie.com/login/store`. The subdomain is branding only.

---

## 2. How aduanefie.com loads, step by step

```
aduanefie.com
  └─ 301 → web.aduanefie.com        (Apache, DNS-level redirect)
       └─ Vercel / Next.js
            └─ middleware.js
                 ├─ no `selectedModule` cookie → rewrite to /welcome   (marketing landing)
                 └─ has `selectedModule` cookie → rewrite to /home?module=<cookie>
```

### 2.1 Marketing landing (`/welcome`)

- `pages/welcome.js` renders `src/components/landing-page`.
- Server-side fetches `/api/v1/config` (business config, modules, landing content) and `/api/v1/landing-page`.
- The landing page contains, among other sections, a **hero with a location form** (`src/components/landing-page/hero-section/HeroLocationForm.js`) and a **module selection modal** (`hero-section/module-selection/index.js`). There is also an `AvailableZoneSection`.
- If the backend config call fails, `welcome.js` pushes `/404` — so a backend outage currently looks like a missing page rather than a maintenance page.

### 2.2 Location → zone

- The hero location form uses browser geolocation (`useGetGeoCode`) and/or a manual address picker (`src/components/address/*`).
- Reverse geocode → `useGetZone` / `useGetCheckZone` → the backend decides which **zone** that point falls inside (`zones.coordinates`, a PostGIS polygon).
- The resulting zone ids are stored in `localStorage` as `zoneid` (may be a scalar or a JSON array such as `"[3,1]"`).
- `parseZoneIds()` in `src/helper-functions/getZoneIdWithModule.ts` normalises all of those shapes.
- Zones are polygons; a point can fall in more than one, hence the array.

### 2.3 Module selection

- `useGetModule()` pulls the available modules. From the live snapshot there are two:
  - **id 1 — "Nearby Market"** (`module_type: grocery`)
  - **id 2 — "Wholesale Market"** (`module_type: grocery`)
- The modal filters modules to those configured for the user's zone: `zoneWiseModule(data)` using `getCurrentZoneIds()`.
- On pick, `handleSingleModule` / `handleItemOnClick` does all of:
  1. `dispatch(setSelectedModule(item))` (redux `utilsData`)
  2. `localStorage["module"] = JSON.stringify(item)`
  3. `saveModuleParam(id, slug)` → writes `localStorage.selectedModuleId`, `.selectedModuleIdentifier`, and **cookies** `selectedModule` and `selectedModuleId` (1 year, `path=/`, `samesite=lax`)
  4. `router.push({ pathname: "/home", query: { module: <slug|id> } })`
- If the user has a rental cart and switches to a zone that does not support the existing pickup point, the cart is cleared first with an explanatory toast. This is the only cross-zone cart rule that exists.

### 2.4 Module persistence across the site

`middleware.js` then does three jobs on every non-asset request:

1. **Root smart entry** — `/` becomes `/welcome` or `/home?module=<cookie>`.
2. **Module injection** — for any route not in `excludeModuleRoutes`, if the URL lacks `module`/`module_id`, redirect to the same URL with `?module=<cookie>`. Excluded routes: `/`, `/welcome`, `/trade`, `/404`, `/500`, `/app-redirect`, `/maintainance`, `/checkout`, `/profile`, `/about-us`, the policy pages, `/help-and-support`, `/forgot-password`, `/deliveryman-registration`, `/store-registration`.
3. **Legacy param cleanup** — `module_id` is converted to `module`, and both together collapse to `module`.

`ZoneGuard` (`src/components/route-guard/ZoneGuard.js`) wraps `/home`. It requires a module from (in order) URL query → `localStorage.selectedModuleIdentifier` → `localStorage.selectedModuleId` → `selectedModule` cookie → `localStorage.module.slug|id`. If none exist it redirects to `/welcome`. **This is the real gate on "show me products" — not the zone, the module.** Zone only decides which modules and which stores are visible.

### 2.5 Marketplace

Once inside `/home?module=…`, the rest of the shopping surface is module-scoped:

`/home/[...slug]`, `/store/[id]`, `/product/[id]`, `/search`, `/all-stores`, `/all-brands`, `/campaigns`, `/flash-sales`, `/bogo-list`, `/checkout`, `/track-order`, `/profile`, plus `/parcel-delivery-info`.

All product, store and search queries are filtered by `module_id` and by the zone ids stored client-side, and the API calls are all on `api.aduanefie.com` (`NEXT_PUBLIC_BASE_URL`).

---

## 3. Cross-border / import-export (`/trade`)

Today `/trade` is a **static marketing surface**, not a working trade flow.

- `pages/trade/index.js` — hero ("African agricultural trade, in one place"), "Shop Wholesale Market", "Explore Trade Blocs", and an "Available now" section.
- `pages/trade/blocs/index.js` and `pages/trade/blocs/[slug].js` list the four regional blocs.
- Data comes from `src/components/trade/tradeData.js`, which is a **hard-coded snapshot of `soft/database/seeders/TradeBlocSeeder.php`** (ECOWAS, SADC, and two others) used as `FALLBACK_TRADE_BLOCS`.
- `TRADE_API_ENABLED` is gated by `NEXT_PUBLIC_TRADE_API_ENABLED === "true"` and is **off**. The comment in that file says the read-only trade API "is not deployed on the live host yet, so its calls 404".
- "Shop Wholesale Market" simply calls `getWholesaleMarketHref()` → `/home?module=2`. **It is the ordinary module-2 catalogue, not a special B2B/export flow.** There is no origin-country filter, no Incoterm, no cross-border shipping calculation, no duty, no FX.

What exists in Laravel but is not live:

- API: `routes/api/v1/api.php` prefix `trade` — `corridors`, `corridors/{origin}/{destination}`, `blocs`, `blocs/{slug}`, `blocs/{slug}/corridors`, `sourcing/{id}/match-sellers`, `seller/dashboard`, `seller/rfq/{id}/respond`, `seller/upgrade-gold`, `reports/corridors`.
- Web: `trade-requests/*`, `trade-contracts/*` (create, deposit, confirm-delivery, verify-documents, release, refund, summary, view), `trade-bloc/*`, `trade-assurance/*`, `bulk-trade/*`, `seller/*`, and `vendor/trade-requests/*`.
- Controllers: `TradeBlocController`, `TradeRequestController`, `TradeFinanceController`, `TradeDocumentController`, `TradeCorridorController`, `SellerDashboardController`, `TradeAssuranceController`, `BuyerSourcingController` (web + API copies).
- Migrations: `trade_requests`, `trade_request_quotes`, `trade_corridors`, `trade_documents`, `trade_contracts`, `trade_blocs`, `trade_assurances`.
- Seeders: `TradeBlocSeeder`, `TradeCorridorSeeder`, `AgriTradePositioningSeeder`.

But: **none of the `trade_*` tables exist in the live MySQL snapshot.** That is why `/vendor-panel/trade-requests/received` failed with `relation "trade_requests" does not exist` — one of the 6 known pre-existing failing routes. The vendor-side routes were removed in `82edbae`; the customer-side routes remain (see §8.2). So the trade surface is code without a database and copy without a backend.

---

## 4. Registration and login paths that exist today

| Actor | Register | Login | Dashboard |
|---|---|---|---|
| Customer | React sign-up → `/api/v1/auth/sign-up` | React → `/api/v1/auth/login`, or web `/login/customer` | `/profile` (React) |
| **Store owner** | React `/store-registration` → `/api/v1/auth/vendor/register`; also web `/vendor/apply` | **`/login/store`** (web tab) or `/api/v1/auth/vendor/login` | **`/vendor-panel`** (Laravel) |
| Store employee | created by store owner | `/login/store-employee` | `/vendor-panel` (restricted) |
| Admin | admin panel | `/login/admin` | `/admin` |
| Admin employee | admin panel | `/login/admin-employee` | `/admin` (restricted) |
| **Rider** | React `/deliveryman-registration` → `/api/v1/auth/delivery-man/store`; also web `/deliveryman/apply` | **API only:** `/api/v1/auth/delivery-man/login` — **no web login** | **none** (admin panel CRUD only) |

### 4.1 How `/login/{tab}` resolves

- `routes/web.php:46` — single route `Route::get('login/{tab}', 'LoginController@login')`.
- `LoginController::login()` maps the tab to a guard using `DataSetting` keys:
  - `admin_login_url` → `admin`
  - `admin_employee_login_url` → `admin-employee`
  - `store_login_url` → `store`
  - `store_employee_login_url` → `store-employee`
- Defaults are seeded in `InstallController` as `login_admin`, `login_store`, etc.
- If the tab does not match a known type: `abort_if(!$user_type, 404)` — which is exactly why `/login/vendor` and `/login/delivery-man` return 404.
- One shared Blade view: `resources/views/auth/login.blade.php`, with `$role` controlling which "forgot password" block shows.
- Guards in `config/auth.php`: `admin`, `vendor`, `vendor_employee`, `customer`, `delivery_men`, `api` (Passport).

### 4.2 Store self-registration — what it actually does

`VendorLoginController@register` (API):

1. Gated by `BusinessSetting` key `toggle_store_registration`; if off, returns "store self-registration disabled".
2. Validates `f_name`, `email` (unique on `vendors`), `phone` (unique), `latitude`, `longitude`, `zone_id`, `module_id`, `logo`, `tax`, password policy (8+, mixed case, number, symbol, not breached).
3. **Verifies the pin is inside the chosen zone** using PostGIS `whereContains(coordinates, new Point(lat, lng, POINT_SRID))`. Out-of-zone coordinates are rejected with 403. (This is the one place where zone is a hard security/business constraint rather than a filter.)
4. Creates `Vendor` with `status = null`.
5. Creates `Store` with `status = 0`, `store_business_model = 'none'`, `zone_id`, `module_id`, `delivery_time`, optional `pickup_zone_id` (rental).
6. Writes translations (name + address per locale).
7. Emails the vendor ("pending") and the super admin ("new store registration") subject to mail/notification settings.

The React form also collects optional **TIN, TIN expiry, TIN certificate image** — evidence that KYC-ish fields were already anticipated for this market.

Then the vendor picks a subscription package (`/api/v1/vendor/package-view`, `business_plan`, `subscription/payment/api`) and the admin approves. Only after approval does `/vendor-panel` become useful.

### 4.3 Rider registration — what it actually does

- React `/deliveryman-registration` → `usePostDeliveryManRegisterInfo` → `POST /api/v1/auth/delivery-man/store`.
- Login exists only as `POST /api/v1/auth/delivery-man/login` (token for the mobile app).
- There is **no `delivery-man` web route**, no Blade dashboard, no `delivery_men` guard usage on any web route (`config/auth.php` defines the guard, but nothing mounts it for the web).
- The only web-adjacent integration is `POST /external-login-from-drivemond` in `LoginController`, which accepts a Drivemond token and logs the rider into the **customer** guard, using `ExternalConfiguration` for the Drivemond base URL. That is a bridge to an external delivery app, not a rider portal.
- Admin can create/edit riders and assign them to orders (`Admin/OrderController@add_delivery_man`), and there are DM earnings and DM wallet features in admin and vendor panels.

---

## 5. Gap analysis

### 5.1 `store.aduanefie.com`

**What already works:** store registration, admin approval, store login, full vendor dashboard (`/vendor-panel` with orders, products, POS, coupons, campaigns, reports, wallet, subscription, employees, delivery-men, trade-requests).

**What is missing:**

| Gap | Impact |
|---|---|
| No host-based routing | The subdomain is cosmetic; `/admin` and `/vendor-panel` are both reachable from `store.` |
| No per-host entry redirect | `store.aduanefie.com/` shows the generic Laravel welcome, not a store login |
| No host restriction on admin routes | A store owner can *see* `/login/admin` and `/admin` from their own subdomain |
| No per-host cookie naming | `SESSION_DOMAIN` is unset in every repo env file, so the session cookie is host-only today (see §7). That is safe by accident, not by design, and one `.env` line would collapse it |
| No store-side onboarding/status page | A pending vendor has no "your application is under review" screen; they just can't use the panel |
| No KYC document review workflow in UI | TIN fields are collected but the approval side is generic vendor CRUD |
| No store-facing trade/B2B surface | `vendor/trade-requests/*` exists but the tables don't |

**Options:**

- **A. One app, host-aware middleware (recommended).** Add a middleware that reads `Host` and (a) 404s admin routes on `store.`/`logistics.`, (b) redirects `store./` → `/login/store`, (c) redirects `logistics./` → its own entry. Scope the session cookie to the host. Cheapest, no redeploy duplication, and preserves the existing login URLs.
- **B. Separate deployments per role.** Real isolation, but triples deploy surface, config drift and cost, for the same codebase.
- **C. Keep aliases, rely on role guards only.** Zero work, but leaves the confusing cross-host behaviour and the admin login visible on store/logistics hosts. Not acceptable at launch.

### 5.2 `logistics.aduanefie.com`

**What exists:** rider records, admin CRUD, order assignment, DM earnings, DM wallet, DM reviews, last-location endpoint, mobile API auth.

**What is missing — essentially everything web:**

| Gap | Notes |
|---|---|
| No web login | `/login/delivery-man` 404; no `delivery_men` web guard in use |
| No rider routes | Nothing under `/delivery-man/*` except the registration page |
| No rider dashboard | No assigned orders, no status transitions, no history |
| No earnings/payout UI | DM earnings tables exist; no rider-facing view, no withdrawal request |
| No web session for mobile riders | Mobile uses Passport tokens; web needs a guard + login tab |
| No zone/corridor assignment model | Cross-border last-mile is undefined; a rider is bound to a store's zone, not a corridor |
| Drivemond bridge logs rider in as *customer* | Wrong principal — it cannot be reused as the rider portal's auth |

**Recommendation:** decide mobile-first vs web portal before building. If a web portal is wanted, the minimum viable version is: `login/logistics` tab + `delivery_men` guard + three screens (available/assigned orders, status update, earnings). Anything more (live map, route optimisation, COD reconciliation) should wait.

### 5.3 Remote marketers / registration agents

> **Built since this audit.** What shipped differs from the recommendation below
> in three deliberate ways: attribution is **store-owned** (`stores.marketer_id`)
> rather than a per-registration ref code; the commission is a **share of the
> platform's per-order commission**, not a fee per registered store; and the
> portal reuses the **admin guard + MFA** rather than a new `marketer` guard.
> The admin approval and payout screens exist. The authoritative description,
> including what is still open, is `docs/marketer-implementation.md`. The text
> below is the original audit and is kept as the rationale.

**What existed at audit time:** nothing. Only **customer-to-customer referral**:

- `ref_code` on customers, validated in `Api/V1/Auth/CustomerAuthController` (`Referrer code already used`).
- A `referrer` **wallet transaction** and notifications `customer_referral_bonus_earning`, `customer_new_referral_join`.
- Logic in `CentralLogics/order.php` and `SocialAuthController`.

That is wallet credit for bringing a *customer*, not cash for registering a *store or farmer*, and it has no KYC, no payout method, no country awareness and no approval workflow.

**What a marketer programme needs:**

1. **Identity** — marketer account with own login (separate guard/table recommended; reusing `admins` or `customers` will leak permissions).
2. **Attribution** — a code/link per marketer, captured at store/rider registration, stored on the created vendor/store so the link survives approval.
3. **KYC** — legal name, ID/passport, phone, country, region/locality, mobile-money or bank payout details. Per-country payout rails (MTN MoMo, Airtel Money, M-Pesa, Paystack/Flutterwave) differ; this cannot be a single global field.
4. **Commission rules** — must be explicit, e.g. flat fee per *approved and live* store, not per form submit. Otherwise the fraud surface is enormous.
5. **Approval chain** — registration → admin verifies store → store goes live → commission accrues → holding period → payable → paid.
6. **Fraud controls** — duplicate phone/TIN/email detection, same-device/same-IP clustering, one-marketer-per-store rule, clawback if the store is delisted within N days, cap per locality.
7. **Payout ledger** — `marketer_commissions` + `marketer_payouts` with status, FX rate, currency, reference, and an immutable audit trail. First version can be admin-approved batches exported as CSV for manual MoMo transfer.
8. **Dashboards** — marketer portal (my registrations, status, accrued, paid) and admin queue (verify, approve, reject, pay, reverse).
9. **Country/locality coverage** — country + region + zone on the marketer record, and commission currency derived from the store's country. This must line up with the existing `zones` polygons, or you get "registered but not in any zone" orphans.

**Options:**

| Option | Description | Verdict |
|---|---|---|
| 1. Reuse customer referral | Give marketers a customer account and `ref_code`; pay into customer wallet | Wrong semantics, no KYC, no payout control, wallet ≠ cash, no store attribution. **Not recommended.** |
| 2. Dedicated marketer module | `marketers`, `marketer_registrations`, `marketer_commissions`, `marketer_payouts`, new `marketer` guard, portal on `partners.aduanefie.com` | **Recommended.** Contained, auditable, can start with manual payouts. |
| 3. Affiliate network with downlines/tiers | Agents recruit sub-agents, revenue share | Powerful but a compliance and fraud project of its own. **Defer** until option 2 has real volume. |

---

## 6. Decisions needed before any implementation

1. **Host strategy** — one app with host-aware middleware (recommended), separate deployments, or keep aliases?
2. **Rider portal** — build a web portal at `logistics.` now, or stay mobile-only and make `logistics.` just a download/landing page?
3. **Marketer model** — go with option 2 (dedicated module)? And what is the **commission trigger**: store approved, store live, first order, or first subscription payment?
4. **Marketer payout** — which rails per country for v1 (manual MoMo batch vs Paystack/Flutterwave), and what holding period before commission is payable?
5. **Cross-border scope** — is `/trade` launching as a real RFQ/escrow flow now, or staying a catalogue entry point into module 2 until the security review closes? (The escrow code is frozen by your own rule.)
6. **Sequencing** — launch store/rider/marketer portals on the current MySQL host now (fast, but double work), or wait for the Supabase + R2 cutover (slower, one migration)?
7. **The 6 pre-existing failing routes** — fix before cutover or after? Two of them are in the launch-critical admin report area.

---

## 7. Risks worth flagging now

- **Shared session is not currently a hole — but only because of a default.** `SESSION_DOMAIN` is unset in `.env`, `.env.staging`, `.env.localpg` and `.env.localmysql`, so `config/session.php` leaves `domain => null` and the cookie is **host-only**. Subdomains do *not* share a session today. Do not set `SESSION_DOMAIN=.aduanefie.com`: that single line would merge the admin, vendor and rider sessions. Verify the live host has no such override before launch; the repo cannot prove it.
- **Adding a rider login is not a one-line tab.** `LoginController@login` resolves roles from a hard-coded `$loginTypes` map of exactly four entries, and `login_attemp()` returns **only `'admin'` or `'vendor'`**, with `submit()` branching on those two return values. A `delivery_men` web login therefore touches `login()`, `submit()`, `login_attemp()`, the role/locale maps, the login Blade (which only has forgot-password blocks for admin and vendor), and needs a new `DataSetting` key. Budget it as a real change, not a config toggle.
- **`APP_URL` is `localhost` in every repo env file.** Multi-host installs can only have one `APP_URL`; anything generating URLs outside a request (queued mail, scheduled jobs, CLI) will point at that one host. Password-reset and subscription mails already read `store_login_url` from `DataSetting`, which helps, but signed URLs do not.
- **Pending vendors have no status page.** Registration "succeeds" and then the user hits a login wall with no explanation. Expect support load at launch.
- **`toggle_store_registration` can silently disable the entire store signup path** — worth checking its live value before a marketing push.
- **Wholesale ≠ cross-border.** "Shop Wholesale Market" is module 2. If the site implies export/import, users will land in a domestic catalogue. Either build the corridor flow or word the page as "coming".
- **Zone containment is enforced at registration but only filtered at browse time.** A store can be approved in zone A and then have its zone changed by an admin, orphaning it.
- **Latency on the current backend** (45–180 s for some admin pages against Supabase) will be the biggest complaint from store owners on `store.` if the cutover ships before the N+1 work.
- **No git in the workspace root**, so there is no rollback for the Laravel changes already made. That should be fixed before a multi-portal build starts.

---

## 8. Decisions taken (2026-11-11)

1. **Host strategy — one app + host-aware middleware.** Keep the single Laravel codebase. A middleware reads the `Host` header, redirects each portal's root to its own login, and 404s routes that do not belong to that host. Existing login URLs keep working; nothing is redeployed per role.
2. **Rider portal — minimal web portal now.** New rider login tab plus three screens: assigned/available orders, status updates, earnings. The mobile app stays the primary rider tool.
3. **Marketer commission trigger — store approved *and* live.** Commission accrues only after admin approval and the store going live, with a holding period before it becomes payable.

### 8.1 Implementation shape implied by those decisions

**A. Host scoping (Laravel only)**

- `config/portals.php` mapping host → portal (`admin`, `store`, `logistics`, `partners`, `api`).
- One middleware, prepended so it runs before `StartSession`, doing three things:
  1. Rewrite `GET /` to the portal's login route.
  2. `abort(404)` for out-of-scope path prefixes (e.g. `admin/*` on `store.` and `logistics.`; `vendor-panel/*` on `logistics.` and `admin.` if desired).
  3. Give each host its own session cookie name, so isolation is explicit rather than a side effect of `SESSION_DOMAIN` being unset. Do **not** set `SESSION_DOMAIN` to the apex.
- Keep `APP_URL` pointing at the canonical host; route generation inside a request already follows the request host.

**B. Rider portal (Laravel)**

Touches the shared login controller — plan accordingly:

- `LoginController@login`: add `delivery_man` → `delivery_man_login_url` to `$loginTypes`, `$siteDirections`, `$locals`, and the `DataSetting` key list.
- `LoginController@submit`: add a rider branch with the equivalent status/approval check.
- `LoginController@login_attemp`: extend beyond the current `admin`/`vendor` return to a third principal, or split the function per guard. This is the part that makes it non-trivial.
- New `routes/logistics.php` under `auth:delivery_men`, plus three Blade views and a controller reading orders where `delivery_man_id = auth()->id()`, with status transitions and earnings. Existing DM earnings/wallet tables and `OrderController@add_delivery_man` already provide the data; the views are what's missing.
- Reuse `DMPasswordResetController` for forgotten passwords rather than writing new mail logic.

**C. Marketer module (Laravel + one small React change)**

- Tables: `marketers` (identity, country, region, KYC fields, payout method JSON, unique `ref_code`, status), `marketer_registrations` (polymorphic to vendor/store/rider, attribution, approved_at, live_at), `marketer_commissions` (amount, currency, fx_rate, status `accrued|held|payable|paid|reversed`, hold_until), `marketer_payouts` + items (batch, method, reference).
- New `marketer` guard. Do not reuse `customers` or `admins`.
- Attribution capture: `marketer_ref` on store and rider registration. Store it on the vendor *and* on `marketer_registrations` so it survives approval.
- Admin queue: verify → mark store live → commission accrues → hold → payable → batch payout (CSV first, manual mobile money; Paystack/Flutterwave later).
- Marketer portal on its own host, using the same host-scoping middleware.
- React change is small: carry a `?ref=` value through `/store-registration` into the existing `usePostStoreRegistration` payload.

**D. Deliberately out of scope for this build**

- RFQ/escrow money flows (frozen until the security review closes).
- Corridor pricing, duty, FX, customs documents.
- Marketer downlines / tiers.
- Live rider maps, route optimisation, COD reconciliation.

### 8.2 Still open

1. Marketer payout rails per country (mobile money, per country). **Decided:** commission
   becomes payable **14 days after delivery**.
2. Whether `/trade` stays catalogue-only at launch or gets the corridor flow. **Decided:**
   catalogue-only for now; no RFQ or escrow money path until that security review closes.
3. Build on the current MySQL host now, or after the Supabase/R2 cutover. **Decided:** build
   on MySQL first, then port.
4. ~~The 6 pre-existing failing routes~~ — fixed in `82edbae` on MySQL, before the marketer
   module. See `docs/six-failing-routes-fix.md`. The customer-side trade routes in
   `routes/web.php` still reference the absent `trade_*` tables and are still open (item 2).
5. `git init` in the workspace root before any of this — there is no rollback today.
   **Done** — the repo exists and tracks `soft/` and `docs/`.

---

## 9. Verified constraints on `/admin-login`

`/admin-login` currently returns **404**, so the path is free. But it cannot be delivered through the theme's existing "login URL" feature:

| Constraint | Evidence | Consequence |
|---|---|---|
| Login URLs are a single path segment under `/login/` | `routes/web.php:46` — `Route::get('login/{tab}')`; `LoginController@login` does `array_search($login_url, $data)` against `DataSetting` values | Setting the value to `admin-login` produces `/login/admin-login`, **not** `/admin-login` |
| Values cannot contain `/` | `BusinessSettingsController@login_url_page_update` validates `regex:/^[a-zA-Z0-9\-\_]+$/u` | A full path cannot be stored |
| Values must be unique across all four roles | same rule adds `unique:data_settings,value` | Cannot reuse an existing value |
| Mail links are built from the value | `Helpers::get_login_url('admin_login_url')`, used at `LoginController.php:438` and `:472` | Hard-coding `/admin-login` means updating those two call sites too |
| The login URL is admin-editable | `/admin/login-url-setup` page | A fixed `/admin-login` route conflicts with the "change your login URL" feature; one of them has to go |

**So `/admin-login` needs a dedicated route and controller, not a settings change.** Recommended: add `Route::get('admin-login', [AdminAuthController::class, 'showLogin'])` before the `login/{tab}` catch-all, keep `/login/{tab}` for store/store-employee during transition, and 301 the old admin path.

### 9.1 What `/admin-login` does *not* buy you

Verified in the current code:

- **No rate limiting on web login.** `login_submit` carries only `actch`, and `ActivationCheckMiddleware` is a no-op (`return $next($request)`). The only `RateLimiter` defined is `'api'` in `RouteServiceProvider`. Web login is brute-forceable today.
- **No MFA on admin or vendor login.** The `2factor` references are the *2factor.in SMS gateway*, not TOTP. There is no `two_factor`/`totp` column, package or middleware.
- A non-obvious URL is **obscurity, not access control**. Moving to `/admin-login` is fine for clarity and branding, but it must ship *with* throttling, MFA and an audit log, or it changes nothing that matters.

---

## 10. Recommended target architecture

**One codebase, one database, host-scoped portals — a modular monolith.** This is the standard shape for a marketplace with staff, seller and courier surfaces (the same pattern as a storefront plus a separate admin app on its own host). It is the right call at this size; the alternative — separate deployments — costs three pipelines for one product.

### 10.1 The rule that makes "one" safe

Hosts are **privilege rings**, not just branding:

| Host | Allowed | Denied |
|---|---|---|
| `admin.` | everything (highest privilege; may preview store/rider surfaces for support) | — |
| `store.` | `/vendor-panel`, `/login/store*`, `/api/*`, shared public | `admin/*`, `login/admin*` → **404** |
| `logistics.` | rider routes, `/login/logistics`, `/api/*`, shared public | `admin/*`, `vendor-panel/*` → **404** |
| `partners.` | marketer routes, its login, `/api/*` | admin, vendor-panel → **404** |
| `api.` | `/api/*`, webhooks | all HTML routes → **404** |
| `web.` / apex | React app only | everything Laravel-side except `/api/*` |

Denial is a **404, not a redirect** — a redirect confirms the route exists.

### 10.2 Structural rules

1. **Portals never share an auth controller.** `LoginController@login_attemp` currently returns only `'admin'` or `'vendor'`; extending it to four principals turns one function into a branching mess and is how the rider login becomes risky. One controller per principal: `AdminAuthController`, `VendorAuthController`, `RiderAuthController`, `MarketerAuthController`, each with its own guard, throttle and redirect.
2. **Authorization lives in policies and guards, never in the host check.** Host scoping is defence in depth; a route is only safe if its own middleware enforces the guard.
3. **Per-host session cookie names, and never `SESSION_DOMAIN=.aduanefie.com`.** Isolation is currently a side effect of the default; make it explicit.
4. **`SESSION_DRIVER` must move off `file`** before more than one app server. `database` or Redis.
5. **One route→guard matrix test in CI.** Enumerate every route and assert its required guard. This is the cheapest guard against "accidentally public" and it catches the class of bug where a fix lands on one entry point and not the others.
6. **Feature-flag each portal** so one deploy can ship rider while marketer stays dark.

### 10.3 What is *not* worth doing

- Microservices or separate apps per portal.
- Per-portal databases.
- Separate Laravel installs sharing one DB. That is the worst of both: duplicated code, divergent migrations, one shared failure domain.

