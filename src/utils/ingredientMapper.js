const CATEGORY_KEYWORDS = {
  vegetables: [
    "tomato",
    "onion",
    "carrot",
    "cabbage",
    "lettuce",
    "spinach",
    "pepper",
    "eggplant",
    "broccoli",
    "cauliflower",
    "okra",
    "cucumber",
    "radish",
    "beetroot",
    "pumpkin",
    "squash",
    "zucchini",
    "celery",
    "kale",
    "arugula",
  ],
  fruits: [
    "banana",
    "apple",
    "orange",
    "mango",
    "pineapple",
    "watermelon",
    "grape",
    "strawberry",
    "blueberry",
    "papaya",
    "avocado",
    "lemon",
    "lime",
    "pear",
    "peach",
    "cherry",
    "coconut",
    "guava",
    "passion",
    "kiwi",
  ],
  grains: [
    "rice",
    "wheat",
    "maize",
    "corn",
    "oats",
    "barley",
    "millet",
    "sorghum",
    "quinoa",
    " Couscous",
    "flour",
    "bread",
    "pasta",
    "noodle",
    "spaghetti",
    "macaroni",
  ],
  herbs: [
    "basil",
    "mint",
    "coriander",
    "cilantro",
    " Parsley",
    "thyme",
    "rosemary",
    "sage",
    "dill",
    "chives",
    "oregano",
    "bay leaf",
    "lemongrass",
    "ginger",
    "garlic",
    "turmeric",
  ],
  proteins: [
    "chicken",
    "beef",
    "pork",
    "fish",
    "salmon",
    "tuna",
    "egg",
    "tofu",
    "bean",
    "lentil",
    "chickpea",
    "pea",
    "nuts",
    "seed",
    "yogurt",
    "cheese",
    "milk",
  ],
  dairy: [
    "milk",
    "cheese",
    "butter",
    "cream",
    "yogurt",
    "curd",
    "buttermilk",
    "ghee",
    "ice cream",
    "whipped cream",
  ],
  spices: [
    "salt",
    "pepper",
    "cumin",
    "coriander",
    "turmeric",
    "chili",
    "paprika",
    "cinnamon",
    "clove",
    "nutmeg",
    "cardamom",
    "star anise",
    "fenugreek",
    "mustard",
    "bay leaf",
    "vanilla",
  ],
};

const normalize = (value) =>
  value?.toString?.()?.toLowerCase?.().trim?.() || "";

export function guessIngredientCategory(ingredientName) {
  const name = normalize(ingredientName);
  if (!name) return "other";

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => name.includes(normalize(keyword)))) {
      return category;
    }
  }
  return "other";
}

export function mapIngredientsToStoreProducts(recipeIngredients, availableProducts = []) {
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

  return {
    mapped,
    unmatched,
    matchCount: mapped.filter((item) => item.matched).length,
    totalCount: mapped.length,
  };
}

export function getMissingIngredientsList(recipeIngredients, availableProducts = []) {
  const { unmatched } = mapIngredientsToStoreProducts(recipeIngredients, availableProducts);
  return unmatched.map((item) => item.ingredient);
}

export default ingredientMapper;
