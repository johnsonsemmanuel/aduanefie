import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Property 5: Organic badge suppression on complaints
 * For any farm store object, if complaint_count_30d >= 3 then
 * is_organic_badge_active must be false.
 */

function shouldShowOrganicBadge(store) {
  const complaintCount = Number(store?.complaint_count_30d ?? 0);
  if (complaintCount >= 3) return false;
  return Boolean(store?.is_organic_badge_active);
}

describe("Property 5: Organic badge suppression on complaints", () => {
  test("badge is hidden when complaint_count_30d >= 3", () => {
    const store = {
      store_type: "farm",
      is_organic_badge_active: true,
      complaint_count_30d: 3,
    };
    assert.strictEqual(shouldShowOrganicBadge(store), false);
  });

  test("badge is hidden when complaint_count_30d > 3", () => {
    const store = {
      store_type: "farm",
      is_organic_badge_active: true,
      complaint_count_30d: 7,
    };
    assert.strictEqual(shouldShowOrganicBadge(store), false);
  });

  test("badge is shown when complaint_count_30d < 3 and active", () => {
    const store = {
      store_type: "farm",
      is_organic_badge_active: true,
      complaint_count_30d: 2,
    };
    assert.strictEqual(shouldShowOrganicBadge(store), true);
  });

  test("badge is hidden when complaint_count_30d < 3 but inactive", () => {
    const store = {
      store_type: "farm",
      is_organic_badge_active: false,
      complaint_count_30d: 1,
    };
    assert.strictEqual(shouldShowOrganicBadge(store), false);
  });

  test("badge state is unrestricted when complaint_count_30d is null", () => {
    const store = {
      store_type: "farm",
      is_organic_badge_active: true,
      complaint_count_30d: null,
    };
    assert.strictEqual(shouldShowOrganicBadge(store), true);
  });

  test("randomized property test over 100 samples", () => {
    for (let i = 0; i < 100; i++) {
      const complaints = Math.floor(Math.random() * 10);
      const active = Math.random() > 0.5;
      const store = {
        store_type: "farm",
        is_organic_badge_active: active,
        complaint_count_30d: complaints,
      };
      if (complaints >= 3) {
        assert.strictEqual(shouldShowOrganicBadge(store), false);
      } else {
        assert.strictEqual(shouldShowOrganicBadge(store), active);
      }
    }
  });
});

/**
 * Property 6: Out-of-season products excluded from OrganicSection
 * OrganicSection must never render a product card where is_in_season === false.
 */

function filterInSeasonProducts(products) {
  return products.filter((product) => product?.is_in_season !== false);
}

describe("Property 6: Out-of-season products excluded from OrganicSection", () => {
  test("excludes product with is_in_season === false", () => {
    const products = [
      { id: 1, name: "In-season", is_in_season: true },
      { id: 2, name: "Out-of-season", is_in_season: false },
      { id: 3, name: "Undefined", is_in_season: undefined },
    ];
    const filtered = filterInSeasonProducts(products);
    assert.strictEqual(filtered.find((p) => p.id === 2), undefined);
    assert.strictEqual(filtered.length, 2);
  });

  test("includes all products when all are in season", () => {
    const products = [
      { id: 1, is_in_season: true },
      { id: 2, is_in_season: true },
    ];
    const filtered = filterInSeasonProducts(products);
    assert.strictEqual(filtered.length, 2);
  });

  test("excludes all when none are in season", () => {
    const products = [
      { id: 1, is_in_season: false },
      { id: 2, is_in_season: false },
    ];
    const filtered = filterInSeasonProducts(products);
    assert.strictEqual(filtered.length, 0);
  });

  test("randomized property test over 100 samples", () => {
    for (let i = 0; i < 100; i++) {
      const products = Array.from({ length: 50 }, (_, idx) => ({
        id: idx,
        is_in_season: Math.random() > 0.3,
      }));
      const filtered = filterInSeasonProducts(products);
      for (const product of filtered) {
        assert.notStrictEqual(product.is_in_season, false);
      }
    }
  });
});
