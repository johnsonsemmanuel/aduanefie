# Home · Shop · Live · Profile — 25 November 2026

The four primary tabs use the user's exact short labels. Their functions are distinct:

- **Home**: the overview/market introduction at `/`; `/welcome` remains an equivalent explicit introduction.
- **Shop**: the actual catalogue at `/home?module=<selected id>`, preserving a saved shopping market and defaulting to wholesale module 2. Equipment, inputs and service shopping contexts remain supported.
- **Live**: `/live`, grouping Live Farming and Backyard Farms. The initial `/farms` link redirects here for compatibility.
- **Profile**: account information, orders and tracking. Orders remain available through the existing Orders & Trips account entry.

The Live hub links to the real `/live-farming` and `/live-farming?backyard=1` feeds. Backyard starts with the backend filter enabled and keeps that scope while clearing other filters. Farming query caches include market/location context and use produce modules when the shopper previously browsed equipment or services. Failed requests show Retry rather than a fake empty success state.

Feature visibility/route flags govern availability. Registration uses the existing farm/store application form, which supports Backyard Grower selection. No investment, funding or new financial workflow is introduced. A hard-coded Ghana season badge was removed because it is not reliable across African markets.

Read-only production checks: both regular and backyard-filtered farming APIs return HTTP 200, with no listings in the checked wholesale context. Empty availability is displayed honestly.

Regression checks cover overview versus catalogue entry, exact labels, module preservation, malformed IDs, distinct active states, produce scoping, stored module parsing, safe preview return paths and primary contrast. Private preview and paused RFQ commitments remain unchanged.
