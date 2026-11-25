# Aduanefie — Production Zone Coverage & Polygon Overlap Audit (132 Active Zones)

Generated: 2026-11-25 (Read-only audit against `https://api.aduanefie.com/api/v1/zone/list` and `/api/v1/stores/get-stores/all`)
**Production `BusinessSetting` status**: Unchanged (`retail_delivery_zone_ids` and `max_retail_delivery_distance_km` remain unset pending business approval).

---

## 1. Executive Exposure Summary

- **Total active zones (`status = 1`)**: **132**
- **Total unique active stores across modules**: **62** across **19** zones (the remaining **113** active zones currently have **0** active stores).
- **How `OrderController::place_order` evaluates coverage today**:
  `Zone::where("id", $store->zone_id)->whereContains("coordinates", Point(delivery_lat, delivery_lng))->first()`
  Because `retail_delivery_zone_ids` and `max_retail_delivery_distance_km` are currently unset in production:
  1. **Zone 1 (`Ghana`, ~253,284 km²)** has **39 active stores** (32 Module 2 Wholesale, 4 Module 4 Equipment, 2 Module 5 Inputs, 1 Module 6 Services). Any delivery address anywhere inside Ghana passes `whereContains` for those 39 stores with no distance cap.
  2. **Zone 2 (`GREATER ACCRA`, ~3,760.6 km²)** has **2 active stores** (Module 4 & Module 5) and spans the entire Greater Accra Region (urban Accra + Tema + rural Ada/Shai-Osudoku).
  3. **Zone 3 (`VOLTA REGION`, ~105.1 km²)** and **Zone 15 (`Ho Civic Center Area`, ~0.4 km²)** have **3 active Module 1 Retail Food stores** outside Greater Accra (`kutsetse`, `Fresh Coconut Oil`, `Daavi Protein`) that currently accept retail delivery orders if a customer drops a pin inside their polygons.
  4. **Zone 93 (`Africa`, ~46,491,245 km²)** and **5 foreign country polygons** (`115: Nigeria`, `116: Togo`, `117: Benin`, `118: South Africa`, `119: Kenya`) are active (`status = 1`, `0` stores). If any retail store were ever assigned to Zone 93 or Zone 1, or if Zone 1 / Zone 2 / Zone 93 were included in `retail_delivery_zone_ids`, **they would completely defeat a narrower Greater Accra neighbourhood launch restriction**.

---

## 2. Broad Polygons That Would Defeat a Narrower Launch Restriction (DO NOT Add to `retail_delivery_zone_ids`)

| Zone ID | Name | Country | Approx. Area (km²) | Bounding Box `[minLat, minLng]..[maxLat, maxLng]` | Active Stores | Overlap / Risk Implication |
|---:|---|---|---:|---|---:|---|
| `93` | Africa | GH | 46,491,245.2 | `[-37.004, -22.328]..[38.975, 60.289]` | 0 | Covers entire African continent; overlaps all Ghana/Accra zones |
| `118` | South Africa, West Africa | GH | 1,406,220.8 | `[-35.023, 15.918]..[-21.935, 32.793]` | 0 | Foreign national polygon; non-retail trade corridor only |
| `115` | Nigeria, West Africa | GH | 989,026.7 | `[4.266, 2.768]..[13.803, 14.809]` | 0 | Foreign national polygon; non-retail trade corridor only |
| `119` | Kenya, West Africa | GH | 594,161.4 | `[-4.718, 33.932]..[5.420, 42.458]` | 0 | Foreign national polygon; non-retail trade corridor only |
| `1` | Ghana | GH | 253,284.2 | `[4.464, -3.268]..[11.078, 1.302]` | 39 | Covers all of Ghana; overlaps all Accra zones (39 non-retail/wholesale stores — preserved via domestic_wholesale separation) |
| `117` | Benin, West Africa | GH | 130,956.4 | `[5.880, 0.794]..[12.470, 3.871]` | 0 | Foreign national polygon; non-retail trade corridor only |
| `116` | Togo, West Africa | GH | 61,077.9 | `[6.091, -0.079]..[11.086, 1.899]` | 0 | Foreign national polygon; non-retail trade corridor only |
| `136` | Bono East Region | GH | 22,670.8 | `[7.353, -2.311]..[8.897, -0.630]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `6` | NORTHEN REGION | GH | 20,497 | `[8.970, -1.360]..[10.529, 0.244]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `5` | CENTRAL REGION | GH | 20,426.5 | `[4.687, -2.418]..[6.273, -0.880]` | 1 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `135` | Bono Region | GH | 20,346.7 | `[6.959, -2.904]..[8.211, -0.970]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `4` | ASHANTI REGION | GH | 16,272.9 | `[6.265, -2.221]..[7.552, -0.815]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `132` | Upper West Region | GH | 8,234.3 | `[9.775, -2.852]..[10.683, -1.808]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `137` | Oti Region | GH | 8,170.4 | `[7.516, -0.213]..[8.664, 0.726]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `130` | Eastern Region | GH | 6,862 | `[5.801, -0.952]..[6.555, 0.136]` | 1 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `134` | Ahafo Region | GH | 6,260.2 | `[6.443, -2.855]..[7.414, -2.097]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `133` | Western North Region | GH | 4,916.8 | `[5.879, -3.150]..[6.666, -2.436]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `2` | GREATER ACCRA | GH | 3,760.6 | `[5.457, -0.509]..[6.107, 0.680]` | 2 | Covers entire Greater Accra Region (3,760 km²); overlaps all 13 urban Accra/Tema neighbourhood zones |
| `7` | WESTERN REGION | GH | 3,068.5 | `[5.333, -2.767]..[6.164, -2.119]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `131` | Upper East Region | GH | 2,567.9 | `[10.651, -1.439]..[10.991, -0.604]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |
| `138` | Gomoa | GH | 1,394.2 | `[5.243, -0.892]..[5.634, -0.348]` | 0 | Regional macro-polygon; suitable for farmer sourcing/wholesale, NOT last-mile retail riders |

---

## 3. Candidate Retail Launch Shortlist — Greater Accra / Tema Neighbourhood Zones With Active Retail Stores

These **13** neighbourhood-scale zones inside Greater Accra currently host active **Module 1 (Nearby Food Market)** retail stores:

| Zone ID | Name | Approx. Area (km²) | Bounding Box | Active Stores (Module) | Overlapping Macro-Polygons |
|---:|---|---:|---|---|---|
| `9` | Accra (Adenta Zone) | 15.1 | `[5.705, -0.200]..[5.733, -0.136]` | Spices King (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `10` | Accra (North Legon - Haatso) | 12.4 | `[5.652, -0.223]..[5.685, -0.173]` | Aduanefie Market (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `11` | Accra (Abeka Lapaz) | 3.4 | `[5.593, -0.258]..[5.614, -0.234]` | Emmanuel ColdStore (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `13` | Accra (Dzorwulu) | 5 | `[5.603, -0.213]..[5.622, -0.177]` | Aduanefie Store (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `14` | Tema ( Community 11) | 0 | `[5.666, -0.024]..[5.667, -0.022]` | Alpha Snails (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `33` | Accra (Ashaley Botwe) | 7.1 | `[5.667, -0.153]..[5.688, -0.117]` | Enjoy Foods (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `38` | Accra (Batsoona - Spintex) | 0 | `[5.619, -0.095]..[5.621, -0.092]` | AllMighty Agroshop (mod 1), Deconnector Farms (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `50` | Accra (Dome) | 6.6 | `[5.647, -0.254]..[5.672, -0.222]` | Freshy Fresh (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `99` | Madina Market | 0.7 | `[5.675, -0.174]..[5.684, -0.166]` | Sea Foods Only (mod 1), Fruits Palace (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `108` | Accra (Tesano) | 4.3 | `[5.595, -0.243]..[5.613, -0.218]` | The Goat CEO (mod 1), Market Day Express (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `109` | Sapeiman, Accra, Ghana | 0.4 | `[5.722, -0.314]..[5.727, -0.306]` | Nigerian Foodstuff (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `139` | Accra (Kantamanto Market) | 0 | `[5.548, -0.214]..[5.550, -0.211]` | Nickrich Enterprise (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `140` | Accra (Danfa) | 24 | `[5.728, -0.177]..[5.805, -0.134]` | VALTIBLE FARM (mod 1) | 1:Ghana, 2:GREATER ACCRA, 93:Africa |

### Non-Accra Local Zones Currently Holding Module 1 Retail Stores (Requires Business Decision)

| Zone ID | Name | Approx. Area (km²) | Bounding Box | Active Stores (Module) | Implication if Excluded from `retail_delivery_zone_ids` |
|---:|---|---:|---|---|---|
| `3` | VOLTA REGION | 105.1 | `[6.554, 0.416]..[6.645, 0.539]` | kutsetse (mod 1), Fresh Coconut Oil (mod 1) | Retail delivery blocked (403 `out_of_coverage`); takeaway/pickup remains allowed |
| `15` | Ho Civic Center Area | 0.4 | `[6.612, 0.465]..[6.618, 0.472]` | Daavi Protein (mod 1) | Retail delivery blocked (403 `out_of_coverage`); takeaway/pickup remains allowed |

---

## 4. Complete Inventory of All 132 Active Zones

| Zone ID | Name | Country | Vertices | Approx. Area (km²) | Bounding Box | Stores | COD / Digital | Overlaps Broad Zones |
|---:|---|---|---:|---:|---|---:|---|---|
| `1` | Ghana | GH | 8 | 253,284.2 | `[4.464, -3.268]..[11.078, 1.302]` | 39 | COD/Dig | 93:Africa, 136:Bono East Region |
| `2` | GREATER ACCRA | GH | 21 | 3,760.6 | `[5.457, -0.509]..[6.107, 0.680]` | 2 | COD/Dig | 1:Ghana, 93:Africa |
| `3` | VOLTA REGION | GH | 10 | 105.1 | `[6.554, 0.416]..[6.645, 0.539]` | 2 | COD/Dig | 1:Ghana, 93:Africa |
| `4` | ASHANTI REGION | GH | 7 | 16,272.9 | `[6.265, -2.221]..[7.552, -0.815]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `5` | CENTRAL REGION | GH | 10 | 20,426.5 | `[4.687, -2.418]..[6.273, -0.880]` | 1 | COD/Dig | 1:Ghana, 93:Africa |
| `6` | NORTHEN REGION | GH | 7 | 20,497 | `[8.970, -1.360]..[10.529, 0.244]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `7` | WESTERN REGION | GH | 7 | 3,068.5 | `[5.333, -2.767]..[6.164, -2.119]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `9` | Accra (Adenta Zone) | GH | 7 | 15.1 | `[5.705, -0.200]..[5.733, -0.136]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `10` | Accra (North Legon - Haatso) | GH | 8 | 12.4 | `[5.652, -0.223]..[5.685, -0.173]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `11` | Accra (Abeka Lapaz) | GH | 6 | 3.4 | `[5.593, -0.258]..[5.614, -0.234]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `12` | Accra (Achimota) | GH | 9 | 13.4 | `[5.607, -0.252]..[5.641, -0.200]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `13` | Accra (Dzorwulu) | GH | 12 | 5 | `[5.603, -0.213]..[5.622, -0.177]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `14` | Tema ( Community 11) | GH | 7 | 0 | `[5.666, -0.024]..[5.667, -0.022]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `15` | Ho Civic Center Area | GH | 9 | 0.4 | `[6.612, 0.465]..[6.618, 0.472]` | 1 | COD/Dig | 1:Ghana, 93:Africa |
| `16` | Ho Technical University Area | GH | 9 | 2.4 | `[6.580, 0.460]..[6.595, 0.480]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `17` | Ho Mawuli Estate Area | GH | 6 | 0.2 | `[6.591, 0.471]..[6.595, 0.476]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `18` | Ho Market Area | GH | 8 | 1.7 | `[6.612, 0.465]..[6.625, 0.482]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `19` | Accra (Abelemkpe) | GH | 6 | 1.2 | `[5.606, -0.223]..[5.614, -0.209]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `20` | Accra (Abokobi) | GH | 8 | 0 | `[5.585, -0.166]..[5.586, -0.164]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `21` | Accra (Abossey Okai) | GH | 6 | 0.9 | `[5.558, -0.243]..[5.567, -0.233]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `22` | Accra Mall | GH | 8 | 0 | `[5.620, -0.175]..[5.623, -0.173]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `23` | Accra Newtown | GH | 7 | 2.9 | `[5.572, -0.223]..[5.589, -0.205]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `24` | Accra (Adabraka) | GH | 6 | 0.2 | `[5.561, -0.214]..[5.566, -0.209]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `25` | Accra (Afariwa) | GH | 9 | 0.1 | `[5.707, -0.021]..[5.709, -0.016]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `26` | Accra (Agbogba) | GH | 7 | 0.5 | `[5.691, -0.206]..[5.697, -0.199]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `27` | Accra (Agbogbloshie) | GH | 8 | 0.1 | `[5.544, -0.226]..[5.547, -0.222]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `28` | Accra (Airport) | GH | 7 | 5.1 | `[5.599, -0.190]..[5.618, -0.160]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `29` | Accra (Amasaman) | GH | 8 | 19.8 | `[5.683, -0.330]..[5.732, -0.280]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `30` | Accra (Amrahia) | GH | 6 | 5.2 | `[5.754, -0.151]..[5.777, -0.125]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `31` | Accra (Anyaa) | GH | 8 | 0.3 | `[5.597, -0.291]..[5.602, -0.284]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `32` | Accra ( Ashaiman) | GH | 9 | 15 | `[5.681, -0.059]..[5.713, -0.005]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `33` | Accra (Ashaley Botwe) | GH | 9 | 7.1 | `[5.667, -0.153]..[5.688, -0.117]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `34` | Accra (Ashongman Estate) | GH | 7 | 2.3 | `[5.700, -0.247]..[5.714, -0.228]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `35` | Accra (Aslyum Down) | GH | 7 | 0.3 | `[5.566, -0.210]..[5.571, -0.204]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `36` | Accra (Awoshie) | GH | 7 | 1.5 | `[5.582, -0.285]..[5.594, -0.270]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `37` | Accra (Awudome) | GH | 7 | 0 | `[5.603, -0.188]..[5.605, -0.186]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `38` | Accra (Batsoona - Spintex) | GH | 8 | 0 | `[5.619, -0.095]..[5.621, -0.092]` | 2 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `39` | Accra (Bortiano) | GH | 8 | 1.2 | `[5.507, -0.340]..[5.517, -0.327]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `40` | Accra (Bubuashie) | GH | 8 | 0.5 | `[5.576, -0.257]..[5.583, -0.247]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `41` | Accra (Cantoment) | GH | 8 | 1.3 | `[5.573, -0.185]..[5.585, -0.172]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `42` | Accra (Carprice) | GH | 9 | 0 | `[5.583, -0.218]..[5.584, -0.216]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `43` | Accra (Chorkor) | GH | 8 | 1.4 | `[5.527, -0.253]..[5.539, -0.240]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `44` | Accra (Circle) | GH | 16 | 0.3 | `[5.568, -0.221]..[5.572, -0.214]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `45` | Accra (Dansoman) | GH | 8 | 2.4 | `[5.535, -0.266]..[5.551, -0.248]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `46` | Accra (Dansoman Mataheko) | GH | 7 | 1.4 | `[5.561, -0.255]..[5.574, -0.242]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `47` | Accra (Dawhenya) | GH | 10 | 7 | `[5.745, 0.038]..[5.771, 0.068]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `48` | Accra (Dodowa) | GH | 10 | 1.8 | `[5.877, -0.105]..[5.891, -0.089]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 130:Eastern Region, 93:Africa |
| `49` | Accra (Darkuman) | GH | 7 | 1.1 | `[5.585, -0.256]..[5.596, -0.243]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `50` | Accra (Dome) | GH | 9 | 6.6 | `[5.647, -0.254]..[5.672, -0.222]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `51` | Accra (East Legon) | GH | 10 | 11.1 | `[5.622, -0.178]..[5.659, -0.145]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `52` | Accra (East Legon Hills) | GH | 10 | 0 | `[5.690, -0.101]..[5.692, -0.099]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `53` | Accra (Gbawe) | GH | 10 | 1.8 | `[5.571, -0.318]..[5.586, -0.305]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `54` | Accra (Gbetsile) | GH | 9 | 0 | `[5.768, -0.009]..[5.770, -0.007]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `55` | Accra (James Town) | GH | 9 | 0.5 | `[5.532, -0.217]..[5.539, -0.209]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `56` | Accra (Junction Mall) | GH | 10 | 0.1 | `[5.613, -0.073]..[5.615, -0.070]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `57` | Accra (Kanda) | GH | 7 | 0 | `[5.579, -0.197]..[5.580, -0.195]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `58` | Accra (Kaneshie) | GH | 10 | 0.7 | `[5.573, -0.248]..[5.583, -0.240]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `59` | Accra (Korle Bu) | GH | 9 | 3.2 | `[5.527, -0.237]..[5.545, -0.218]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `60` | Accra (Kpone) | GH | 8 | 8 | `[5.676, 0.034]..[5.708, 0.066]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `61` | Accra (Kwabenya) | GH | 8 | 5.7 | `[5.672, -0.266]..[5.699, -0.239]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `62` | Accra (Kwashieman) | GH | 8 | 1.5 | `[5.589, -0.275]..[5.600, -0.261]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `63` | Accra (Labadi) | GH | 9 | 6.4 | `[5.557, -0.166]..[5.582, -0.132]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `64` | Accra (Labone) | GH | 9 | 2.1 | `[5.561, -0.179]..[5.577, -0.161]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `65` | Accra (Lakeside Estate) | GH | 9 | 0 | `[5.709, -0.131]..[5.710, -0.129]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `66` | Accra (lartebiokorshie) | GH | 8 | 1 | `[5.550, -0.245]..[5.559, -0.232]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `67` | Accra (Lashibi) | GH | 9 | 0 | `[5.684, -0.039]..[5.686, -0.037]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `68` | Accra (Legon) | GH | 10 | 5.9 | `[5.639, -0.204]..[5.663, -0.170]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `69` | Accra (Makola) | GH | 8 | 0.1 | `[5.547, -0.208]..[5.549, -0.205]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `70` | Accra (Mallam) | GH | 9 | 1.6 | `[5.572, -0.294]..[5.585, -0.279]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `71` | Accra (Maamobi) | GH | 8 | 1.1 | `[5.592, -0.204]..[5.601, -0.192]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `72` | Accra (Mambrobi) | GH | 7 | 0.3 | `[5.535, -0.245]..[5.540, -0.238]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `73` | Accra (McCharthy Hill) | GH | 9 | 3.2 | `[5.557, -0.311]..[5.572, -0.288]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `74` | Accra (Michel Camp) | GH | 8 | 0 | `[5.729, -0.017]..[5.731, -0.015]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `75` | Accra (Ministeries) | GH | 7 | 0.1 | `[5.551, -0.198]..[5.553, -0.195]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `76` | Accra (Nima) | GH | 7 | 0.9 | `[5.578, -0.204]..[5.589, -0.195]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `77` | Accra (North Ridge) | GH | 10 | 3.7 | `[5.560, -0.205]..[5.577, -0.182]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `78` | Accra (Nungua) | GH | 8 | 0.1 | `[5.599, -0.072]..[5.601, -0.069]` | 0 | COD/Dig | 2:GREATER ACCRA, 93:Africa |
| `79` | Accra (Oblogo Mallam) | GH | 11 | 0.1 | `[5.556, -0.311]..[5.559, -0.307]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `80` | Accra (Odorkor) | GH | 7 | 1.7 | `[5.574, -0.270]..[5.588, -0.256]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `81` | Accra (Old Ashongman) | GH | 8 | 0 | `[5.702, -0.208]..[5.704, -0.205]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `82` | Accra (Osu) | GH | 7 | 1.3 | `[5.551, -0.182]..[5.564, -0.168]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `83` | Accra (Oyarifa) | GH | 9 | 2.3 | `[5.748, -0.180]..[5.764, -0.165]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `84` | Accra (Oyibi) | GH | 8 | 0.4 | `[5.810, -0.121]..[5.817, -0.114]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `85` | Accra (Pantang) | GH | 8 | 2.8 | `[5.724, -0.196]..[5.740, -0.175]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `86` | Accra (Prampram) | GH | 8 | 10.4 | `[5.707, 0.101]..[5.743, 0.138]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `87` | Accra (Sakumono) | GH | 7 | 3.1 | `[5.607, -0.059]..[5.627, -0.038]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `88` | Accra (Sowutuom) | GH | 8 | 1.2 | `[5.620, -0.278]..[5.632, -0.266]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `89` | Accra (Taifa) | GH | 6 | 3.2 | `[5.644, -0.261]..[5.665, -0.242]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `90` | Accra (Teiman) | GH | 8 | 0.8 | `[5.747, -0.194]..[5.755, -0.183]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `93` | Africa | GH | 16 | 46,491,245.2 | `[-37.004, -22.328]..[38.975, 60.289]` | 0 | —/— | — |
| `94` | Accra (Apenkwa) | GH | 5 | 4.6 | `[5.611, -0.247]..[5.635, -0.224]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `95` | Accra (Avenor) | GH | 6 | 3.9 | `[5.571, -0.229]..[5.590, -0.209]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `96` | Accra (Swabala, South) | GH | 5 | 1.5 | `[5.537, -0.220]..[5.551, -0.203]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `97` | Bawaleshi, Accra, Ghana | GH | 7 | 0.8 | `[5.631, -0.172]..[5.639, -0.162]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `98` | Weija (Accra) | GH | 8 | 24.2 | `[5.543, -0.364]..[5.588, -0.292]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `99` | Madina Market | GH | 7 | 0.7 | `[5.675, -0.174]..[5.684, -0.166]` | 2 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `100` | Madina Zongo Junction | GH | 10 | 0.6 | `[5.674, -0.180]..[5.682, -0.172]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `101` | Frafraha | GH | 5 | 64.4 | `[5.698, -0.179]..[5.763, -0.083]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `102` | Ring Road Central, Accra, Ghana | GH | 6 | 0.5 | `[5.570, -0.208]..[5.575, -0.198]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `103` | Burma Camp, Accra, Ghana | GH | 6 | 30.7 | `[5.577, -0.198]..[5.612, -0.119]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `105` | Roman Ridge, Accra, Ghana | GH | 6 | 30.2 | `[5.584, -0.233]..[5.621, -0.161]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `106` | Adjiringanor, Madina, Ghana | GH | 6 | 88.2 | `[5.616, -0.207]..[5.682, -0.064]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `107` | Oxford Street, Accra, Ghana | GH | 6 | 0.5 | `[5.556, -0.187]..[5.560, -0.178]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `108` | Accra (Tesano) | GH | 9 | 4.3 | `[5.595, -0.243]..[5.613, -0.218]` | 2 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `109` | Sapeiman, Accra, Ghana | GH | 14 | 0.4 | `[5.722, -0.314]..[5.727, -0.306]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `110` | Lakeside Marina Park, Accra, Ghana | GH | 9 | 0 | `[5.697, -0.138]..[5.699, -0.135]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `111` | Lakeside Estates, Adenta, Accra, Ghana | GH | 11 | 2.1 | `[5.697, -0.142]..[5.707, -0.117]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `112` | Adenta Barrier, Accra, Ghana | GH | 8 | 0.2 | `[5.705, -0.174]..[5.708, -0.169]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `113` | Pantang West , Adenta, Accra, Ghana | GH | 8 | 3.2 | `[5.725, -0.194]..[5.742, -0.174]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `114` | Madina Estate, Accra, Accra | GH | 11 | 0.2 | `[5.670, -0.169]..[5.674, -0.164]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `115` | Nigeria, West Africa | GH | 9 | 989,026.7 | `[4.266, 2.768]..[13.803, 14.809]` | 0 | —/— | 93:Africa |
| `116` | Togo, West Africa | GH | 16 | 61,077.9 | `[6.091, -0.079]..[11.086, 1.899]` | 0 | —/— | 93:Africa |
| `117` | Benin, West Africa | GH | 12 | 130,956.4 | `[5.880, 0.794]..[12.470, 3.871]` | 0 | —/— | 93:Africa |
| `118` | South Africa, West Africa | GH | 9 | 1,406,220.8 | `[-35.023, 15.918]..[-21.935, 32.793]` | 0 | —/— | 93:Africa |
| `119` | Kenya, West Africa | GH | 17 | 594,161.4 | `[-4.718, 33.932]..[5.420, 42.458]` | 0 | —/— | 93:Africa |
| `120` | Madina Post Office, Accra, Ghana | GH | 9 | 0.1 | `[5.676, -0.167]..[5.679, -0.164]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `121` | Madina Odbojo New Market, Accra, Ghana | GH | 9 | 0.1 | `[5.678, -0.152]..[5.680, -0.149]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `122` | Ogbojo, Adenta, Accra, Ghana | GH | 9 | 3 | `[5.659, -0.151]..[5.675, -0.130]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `123` | Madina UPSA, Accra, Ghana | GH | 11 | 0.1 | `[5.659, -0.167]..[5.662, -0.164]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `130` | Eastern Region | GH | 6 | 6,862 | `[5.801, -0.952]..[6.555, 0.136]` | 1 | COD/Dig | 1:Ghana, 93:Africa |
| `131` | Upper East Region | GH | 10 | 2,567.9 | `[10.651, -1.439]..[10.991, -0.604]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `132` | Upper West Region | GH | 11 | 8,234.3 | `[9.775, -2.852]..[10.683, -1.808]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `133` | Western North Region | GH | 7 | 4,916.8 | `[5.879, -3.150]..[6.666, -2.436]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `134` | Ahafo Region | GH | 13 | 6,260.2 | `[6.443, -2.855]..[7.414, -2.097]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `135` | Bono Region | GH | 11 | 20,346.7 | `[6.959, -2.904]..[8.211, -0.970]` | 0 | COD/Dig | 1:Ghana, 93:Africa, 136:Bono East Region |
| `136` | Bono East Region | GH | 11 | 22,670.8 | `[7.353, -2.311]..[8.897, -0.630]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `137` | Oti Region | GH | 11 | 8,170.4 | `[7.516, -0.213]..[8.664, 0.726]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `138` | Gomoa | GH | 11 | 1,394.2 | `[5.243, -0.892]..[5.634, -0.348]` | 0 | COD/Dig | 1:Ghana, 93:Africa |
| `139` | Accra (Kantamanto Market) | GH | 8 | 0 | `[5.548, -0.214]..[5.550, -0.211]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `140` | Accra (Danfa) | GH | 8 | 24 | `[5.728, -0.177]..[5.805, -0.134]` | 1 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `141` | University of Ghana (Legon) | GH | 12 | 5.1 | `[5.637, -0.203]..[5.658, -0.181]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
| `142` | UPSA Campus | GH | 8 | 0.3 | `[5.659, -0.172]..[5.664, -0.165]` | 0 | COD/Dig | 1:Ghana, 2:GREATER ACCRA, 93:Africa |
