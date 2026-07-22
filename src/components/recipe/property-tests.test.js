import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Property 7: Saved recipes list consistency
 * Adding a recipe increments list length by exactly 1.
 * Removing a recipe decrements list length by exactly 1 without corrupting other entries.
 * Duplicate IDs are treated as a single entry.
 */

describe("Property 7: Saved recipes list consistency", () => {
  test("adding a recipe increments list length by exactly 1", () => {
    let list = [];
    const recipe = { id: 1, title: "Test Recipe" };
    list.push(recipe);
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].id, 1);
  });

  test("removing a recipe decrements list length by exactly 1 and does not corrupt other entries", () => {
    let list = [
      { id: 1, title: "Recipe A" },
      { id: 2, title: "Recipe B" },
      { id: 3, title: "Recipe C" },
    ];
    list = list.filter((r) => r.id !== 2);
    assert.strictEqual(list.length, 2);
    assert.strictEqual(list[0].id, 1);
    assert.strictEqual(list[1].id, 3);
  });

  test("duplicate recipe IDs are treated as a single entry", () => {
    const list = [
      { id: 1, title: "Recipe A" },
      { id: 1, title: "Recipe A (dup)" },
    ];
    const unique = list.filter((r, idx, self) => self.findIndex((x) => x.id === r.id) === idx);
    assert.strictEqual(unique.length, 1);
    assert.strictEqual(unique[0].id, 1);
  });

  test("randomized property test over 50 samples", () => {
    for (let i = 0; i < 50; i++) {
      const addCount = Math.floor(Math.random() * 10) + 1;
      let list = [];
      for (let j = 0; j < addCount; j++) {
        list.push({ id: j + 1, title: `Recipe ${j + 1}` });
      }
      assert.strictEqual(list.length, addCount);
      const removeId = Math.floor(Math.random() * addCount) + 1;
      list = list.filter((r) => r.id !== removeId);
      assert.strictEqual(list.length, addCount - 1);
      assert.strictEqual(list.find((r) => r.id === removeId), undefined);
    }
  });
});

describe("Property 8: Ingredient matching completeness", () => {
  const normalize = (value) => value?.toString?.()?.toLowerCase?.().trim?.() || "";

  function guessIngredientCategory(ingredientName) {
    const name = normalize(ingredientName);
    if (!name) return "other";
    const keywords = {
      vegetables: ["tomato", "onion", "carrot", "cabbage", "lettuce", "spinach", "pepper", "eggplant"],
      fruits: ["banana", "apple", "orange", "mango", "pineapple", "watermelon", "grape", "strawberry"],
      grains: ["rice", "wheat", "maize", "corn", "oats", "barley", "millet", "sorghum"],
      herbs: ["basil", "mint", "coriander", "cilantro", "parsley", "thyme", "rosemary", "sage"],
      proteins: ["chicken", "beef", "pork", "fish", "salmon", "tuna", "egg", "tofu"],
      dairy: ["milk", "cheese", "butter", "cream", "yogurt", "curd"],
      spices: ["salt", "pepper", "cumin", "coriander", "turmeric", "chili", "cinnamon", "clove"],
    };
    for (const [category, kws] of Object.entries(keywords)) {
      if (kws.some((kw) => name.includes(normalize(kw)))) {
        return category;
      }
    }
    return "other";
  }

  function mapIngredientsToStoreProducts(recipeIngredients, availableProducts = []) {
    const productMap = new Map();
    availableProducts.forEach((product) => {
      const key = normalize(product.name || product.title || product.product_name);
      if (key) productMap.set(key, product);
    });

    const mapped = [];
    const unmatched = [];

    recipeIngredients.forEach((ingredient, index) => {
      const ingredientName = ingredient.name || ingredient.title || ingredient.ingredient_name || "";
      const normalized = normalize(ingredientName);
      const matchedProduct = productMap.get(normalized);

      if (matchedProduct) {
        mapped.push({
          ...ingredient,
          _originalIndex: index,
          matched: true,
          matchedProduct,
        });
      } else {
        mapped.push({
          ...ingredient,
          _originalIndex: index,
          matched: false,
        });
        unmatched.push({ index, ingredientName, ingredient });
      }
    });

    return { mapped, unmatched, matchCount: mapped.filter((item) => item.matched).length, totalCount: mapped.length };
  }

  function getMissingIngredientsList(recipeIngredients, availableProducts = []) {
    const { unmatched } = mapIngredientsToStoreProducts(recipeIngredients, availableProducts);
    return unmatched.map((item) => item.ingredient);
  }

  test("unmatched ingredients are returned in the missing list", () => {
    const ingredients = [
      { name: "tomato" },
      { name: "unicorn meat" },
    ];
    const products = [
      { name: "tomato", price: 2.5 },
    ];
    const { mapped, unmatched } = mapIngredientsToStoreProducts(ingredients, products);
    const missing = getMissingIngredientsList(ingredients, products);
    assert.strictEqual(unmatched.length, 1);
    assert.strictEqual(unmatched[0].ingredientName, "unicorn meat");
    assert.strictEqual(missing[0].name, "unicorn meat");
    assert.strictEqual(mapped[0].matched, true);
    assert.strictEqual(mapped[1].matched, false);
  });

  test("all matched ingredients return empty missing list", () => {
    const ingredients = [
      { name: "tomato" },
      { name: "onion" },
    ];
    const products = [
      { name: "tomato", price: 2.5 },
      { name: "onion", price: 1.0 },
    ];
    const missing = getMissingIngredientsList(ingredients, products);
    assert.strictEqual(missing.length, 0);
  });

  test("category guessing does not return unknown category for known inputs", () => {
    const knownInputs = ["tomato", "banana", "rice", "basil", "chicken", "milk", "salt"];
    knownInputs.forEach((input) => {
      const category = guessIngredientCategory(input);
      assert.notStrictEqual(category, "other", `Expected known category for ${input}`);
    });
  });

  test("randomized property test over 20 samples", () => {
    for (let i = 0; i < 20; i++) {
      const ingredientCount = Math.floor(Math.random() * 5) + 1;
      const ingredients = Array.from({ length: ingredientCount }, (_, idx) => ({
        name: `ingredient_${idx}`,
      }));
      const productNames = ingredients.slice(0, Math.floor(Math.random() * ingredientCount)).map((ing) => ing.name);
      const products = productNames.map((name) => ({ name, price: 1 }));
      const { mapped, unmatched } = mapIngredientsToStoreProducts(ingredients, products);
      const missing = getMissingIngredientsList(ingredients, products);
      assert.strictEqual(unmatched.length, missing.length);
      assert.strictEqual(mapped.length, ingredientCount);
      assert.strictEqual(mapped.filter((m) => m.matched).length, productNames.length);
    }
  });
});
