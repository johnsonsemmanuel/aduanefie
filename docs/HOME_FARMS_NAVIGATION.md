# Home and Farms navigation — 25 November 2026

The previous Home/welcome and Shop/catalogue tabs were too similar. Home now opens the actual shopping feed. The growing side has a distinct Farms entry, with Live Farming and Backyard Farms choices. Bottom navigation is Home · Farms · Orders · Account; desktop also exposes Farms.

- `/` redirects to `/home?module=<saved or requested id>`, defaulting to wholesale module 2. Equipment, inputs and service shopping contexts remain available on Home.
- `/welcome` remains a separate introduction, reachable through Getting started in the account drawer.
- `/farms` is a module-independent discovery hub with two real links: `/live-farming` and `/live-farming?backyard=1`.
- The Backyard destination starts with the existing backend backyard filter enabled, and keeps that scope when clearing other filters.
- Farm feed requests retain retail/wholesale produce context, defaulting to wholesale when the user last browsed an unrelated module. Query cache keys include market/location context.
- Feature visibility/route flags govern farming entry availability. Loading failures show Retry instead of masquerading as an empty feed. No counts, crops or availability are invented.
- Registration uses the existing farm/store application form; the current form supports Backyard Grower selection. No investment, funding or new financial workflow is introduced.

Read-only production checks before rollout: both the regular live-farming feed and `backyard=1` returned HTTP 200, with zero listings in the checked wholesale context. Empty listings are therefore an expected state to test, not an invitation to seed fake stock.

Regression checks cover Home defaults and saved context, legacy entry links, malformed IDs, distinct shopping/farming active states, produce scope, safe preview return paths, stored module parsing and primary contrast. Private preview and paused RFQ commitments remain unchanged.
