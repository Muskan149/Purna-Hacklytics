// ─── Types ───────────────────────────────────────────────
export interface UserPreferences {
  zipCode: string;
  familySize: number;
  weeklyBudget: number;
  dietaryRestrictions: string[];
  healthComplications: string[];
  notes: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  tags: string[];
  timeMins: number;
  servings: number;
  estCost: number;
  estCostPerServing: number;
  ingredients: Ingredient[];
  steps: string[];
  nutrition: { calories: number; protein: string; carbs: string; fat: string; sodium: string };
  whySelected: string;
}

export interface DayPlan {
  dayName: string;
  meals: { recipeId: string }[];
}

export interface WeeklyPlan {
  days: DayPlan[];
  overlapScore: number;
  estTotalCost: number;
}

export interface IngredientAggregateItem {
  name: string;
  totalQty: number;
  unit: string;
  estPrice: number;
}

export interface IngredientAggregate {
  category: string;
  items: IngredientAggregateItem[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  supportsSNAP: boolean;
  availability: { haveCount: number; totalCount: number };
  matchedIngredients: string[];
  missingIngredients: string[];
  /** Optional coordinates for map display (from SNAP API or demo data). */
  latitude?: number;
  longitude?: number;
}

// ─── Mock Recipes ────────────────────────────────────────
export const mockRecipes: Recipe[] = [
  {
    id: "r1",
    title: "One-Pot Black Bean & Rice Bowl",
    tags: ["vegetarian", "dairy-free", "budget-friendly", "heart-healthy"],
    timeMins: 25,
    servings: 4,
    estCost: 4.80,
    estCostPerServing: 1.20,
    ingredients: [
      { name: "Black beans (canned)", quantity: 2, unit: "cans" },
      { name: "Brown rice", quantity: 2, unit: "cups" },
      { name: "Onion", quantity: 1, unit: "medium" },
      { name: "Bell pepper", quantity: 1, unit: "medium" },
      { name: "Cumin", quantity: 1, unit: "tsp" },
      { name: "Garlic", quantity: 2, unit: "cloves" },
    ],
    steps: [
      "Cook brown rice according to package directions.",
      "Sauté diced onion and bell pepper in a large pot with a drizzle of oil.",
      "Add garlic and cumin, cook 1 minute.",
      "Add drained black beans and ½ cup water. Simmer 10 minutes.",
      "Serve over rice. Season with salt and pepper.",
    ],
    nutrition: { calories: 380, protein: "14g", carbs: "68g", fat: "4g", sodium: "320mg" },
    whySelected: "Vegetarian, reuses brown rice and onions, very budget-friendly at $1.20/serving.",
  },
  {
    id: "r2",
    title: "Baked Chicken Thighs with Roasted Veggies",
    tags: ["gluten-free", "low-carb", "heart-healthy"],
    timeMins: 40,
    servings: 4,
    estCost: 7.50,
    estCostPerServing: 1.88,
    ingredients: [
      { name: "Chicken thighs", quantity: 4, unit: "pieces" },
      { name: "Sweet potato", quantity: 2, unit: "medium" },
      { name: "Broccoli (frozen)", quantity: 2, unit: "cups" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 3, unit: "cloves" },
      { name: "Paprika", quantity: 1, unit: "tsp" },
    ],
    steps: [
      "Preheat oven to 400°F.",
      "Season chicken thighs with paprika, salt, and pepper.",
      "Cube sweet potatoes. Toss with olive oil and garlic on a sheet pan.",
      "Place chicken on the pan. Bake 25 minutes.",
      "Add frozen broccoli, bake 10 more minutes.",
    ],
    nutrition: { calories: 420, protein: "32g", carbs: "30g", fat: "18g", sodium: "280mg" },
    whySelected: "Gluten-free, low-sodium, reuses garlic and olive oil from other meals.",
  },
  {
    id: "r3",
    title: "Lentil & Vegetable Soup",
    tags: ["vegan", "low-sodium", "heart-healthy", "budget-friendly"],
    timeMins: 35,
    servings: 6,
    estCost: 5.20,
    estCostPerServing: 0.87,
    ingredients: [
      { name: "Dried lentils", quantity: 1.5, unit: "cups" },
      { name: "Carrots", quantity: 3, unit: "medium" },
      { name: "Onion", quantity: 1, unit: "large" },
      { name: "Celery", quantity: 2, unit: "stalks" },
      { name: "Garlic", quantity: 3, unit: "cloves" },
      { name: "Canned diced tomatoes", quantity: 1, unit: "can" },
    ],
    steps: [
      "Rinse lentils. Dice onion, carrots, and celery.",
      "Sauté vegetables in a large pot until softened.",
      "Add garlic, cook 1 minute.",
      "Add lentils, tomatoes, and 6 cups water. Bring to boil.",
      "Simmer 25 minutes until lentils are tender. Season to taste.",
    ],
    nutrition: { calories: 280, protein: "18g", carbs: "48g", fat: "2g", sodium: "180mg" },
    whySelected: "Extremely affordable, vegan, low-sodium, and reuses onions and garlic.",
  },
  {
    id: "r4",
    title: "Turkey Taco Lettuce Wraps",
    tags: ["low-carb", "gluten-free", "diabetes-friendly"],
    timeMins: 20,
    servings: 4,
    estCost: 6.50,
    estCostPerServing: 1.63,
    ingredients: [
      { name: "Ground turkey", quantity: 1, unit: "lb" },
      { name: "Romaine lettuce", quantity: 1, unit: "head" },
      { name: "Onion", quantity: 1, unit: "medium" },
      { name: "Canned corn", quantity: 1, unit: "can" },
      { name: "Taco seasoning", quantity: 2, unit: "tbsp" },
      { name: "Salsa", quantity: 0.5, unit: "cup" },
    ],
    steps: [
      "Brown ground turkey with diced onion in a skillet.",
      "Add taco seasoning and ¼ cup water. Simmer 5 minutes.",
      "Add drained corn and salsa. Heat through.",
      "Spoon into lettuce leaves and serve.",
    ],
    nutrition: { calories: 310, protein: "28g", carbs: "18g", fat: "14g", sodium: "420mg" },
    whySelected: "Low-carb, diabetes-friendly, reuses onions.",
  },
  {
    id: "r5",
    title: "Pasta Primavera with Frozen Veggies",
    tags: ["vegetarian", "budget-friendly"],
    timeMins: 20,
    servings: 4,
    estCost: 4.20,
    estCostPerServing: 1.05,
    ingredients: [
      { name: "Penne pasta", quantity: 12, unit: "oz" },
      { name: "Frozen mixed veggies", quantity: 3, unit: "cups" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "cloves" },
      { name: "Parmesan cheese", quantity: 0.25, unit: "cup" },
      { name: "Italian seasoning", quantity: 1, unit: "tsp" },
    ],
    steps: [
      "Cook pasta according to package, adding frozen veggies in the last 3 minutes.",
      "Drain, reserving ½ cup pasta water.",
      "Toss with olive oil, garlic, Italian seasoning, and pasta water.",
      "Top with parmesan and serve.",
    ],
    nutrition: { calories: 400, protein: "14g", carbs: "62g", fat: "10g", sodium: "250mg" },
    whySelected: "Vegetarian, budget-friendly, reuses olive oil, garlic, and frozen veggies.",
  },
  {
    id: "r6",
    title: "Sheet Pan Sausage & Sweet Potatoes",
    tags: ["gluten-free", "dairy-free"],
    timeMins: 35,
    servings: 4,
    estCost: 6.80,
    estCostPerServing: 1.70,
    ingredients: [
      { name: "Turkey sausage", quantity: 4, unit: "links" },
      { name: "Sweet potato", quantity: 2, unit: "large" },
      { name: "Bell pepper", quantity: 2, unit: "medium" },
      { name: "Onion", quantity: 1, unit: "medium" },
      { name: "Olive oil", quantity: 2, unit: "tbsp" },
      { name: "Smoked paprika", quantity: 1, unit: "tsp" },
    ],
    steps: [
      "Preheat oven to 425°F.",
      "Cube sweet potatoes, slice sausage, chop peppers and onion.",
      "Toss everything with olive oil and smoked paprika on a sheet pan.",
      "Bake 30 minutes, tossing halfway through.",
    ],
    nutrition: { calories: 380, protein: "22g", carbs: "35g", fat: "16g", sodium: "520mg" },
    whySelected: "Reuses sweet potatoes, bell peppers, onions, and olive oil.",
  },
  {
    id: "r7",
    title: "Egg Fried Rice with Veggies",
    tags: ["vegetarian", "budget-friendly", "diabetes-friendly"],
    timeMins: 15,
    servings: 4,
    estCost: 3.60,
    estCostPerServing: 0.90,
    ingredients: [
      { name: "Brown rice", quantity: 3, unit: "cups cooked" },
      { name: "Eggs", quantity: 4, unit: "large" },
      { name: "Frozen mixed veggies", quantity: 2, unit: "cups" },
      { name: "Soy sauce (low sodium)", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 2, unit: "cloves" },
      { name: "Sesame oil", quantity: 1, unit: "tsp" },
    ],
    steps: [
      "Scramble eggs in a wok or large skillet. Set aside.",
      "Sauté frozen veggies and garlic until hot.",
      "Add cooked rice, soy sauce, and sesame oil. Stir-fry 3 minutes.",
      "Mix in eggs and serve.",
    ],
    nutrition: { calories: 340, protein: "16g", carbs: "50g", fat: "8g", sodium: "380mg" },
    whySelected: "Uses leftover brown rice and frozen veggies, extremely affordable at $0.90/serving.",
  },
];

// ─── Mock Weekly Plan ────────────────────────────────────
export const mockWeeklyPlan: WeeklyPlan = {
  days: [
    { dayName: "Monday", meals: [{ recipeId: "r1" }] },
    { dayName: "Tuesday", meals: [{ recipeId: "r2" }] },
    { dayName: "Wednesday", meals: [{ recipeId: "r3" }] },
    { dayName: "Thursday", meals: [{ recipeId: "r4" }] },
    { dayName: "Friday", meals: [{ recipeId: "r5" }] },
    { dayName: "Saturday", meals: [{ recipeId: "r6" }] },
    { dayName: "Sunday", meals: [{ recipeId: "r7" }] },
  ],
  overlapScore: 78,
  estTotalCost: 38.60,
};

// ─── Mock Aggregated Ingredients ─────────────────────────
export const mockIngredients: IngredientAggregate[] = [
  {
    category: "Produce",
    items: [
      { name: "Onion", totalQty: 5, unit: "medium", estPrice: 2.50 },
      { name: "Bell pepper", totalQty: 3, unit: "medium", estPrice: 2.25 },
      { name: "Sweet potato", totalQty: 4, unit: "medium", estPrice: 3.20 },
      { name: "Carrots", totalQty: 3, unit: "medium", estPrice: 1.00 },
      { name: "Celery", totalQty: 2, unit: "stalks", estPrice: 0.80 },
      { name: "Romaine lettuce", totalQty: 1, unit: "head", estPrice: 1.50 },
      { name: "Garlic", totalQty: 14, unit: "cloves", estPrice: 1.00 },
    ],
  },
  {
    category: "Pantry",
    items: [
      { name: "Brown rice", totalQty: 5, unit: "cups", estPrice: 2.00 },
      { name: "Penne pasta", totalQty: 12, unit: "oz", estPrice: 1.50 },
      { name: "Dried lentils", totalQty: 1.5, unit: "cups", estPrice: 1.80 },
      { name: "Olive oil", totalQty: 6, unit: "tbsp", estPrice: 2.00 },
      { name: "Soy sauce (low sodium)", totalQty: 2, unit: "tbsp", estPrice: 0.80 },
      { name: "Taco seasoning", totalQty: 2, unit: "tbsp", estPrice: 1.00 },
      { name: "Cumin", totalQty: 1, unit: "tsp", estPrice: 0.50 },
      { name: "Paprika", totalQty: 1, unit: "tsp", estPrice: 0.50 },
      { name: "Smoked paprika", totalQty: 1, unit: "tsp", estPrice: 0.50 },
      { name: "Italian seasoning", totalQty: 1, unit: "tsp", estPrice: 0.50 },
    ],
  },
  {
    category: "Protein",
    items: [
      { name: "Chicken thighs", totalQty: 4, unit: "pieces", estPrice: 4.50 },
      { name: "Ground turkey", totalQty: 1, unit: "lb", estPrice: 3.80 },
      { name: "Turkey sausage", totalQty: 4, unit: "links", estPrice: 3.50 },
      { name: "Eggs", totalQty: 4, unit: "large", estPrice: 1.20 },
    ],
  },
  {
    category: "Frozen",
    items: [
      { name: "Broccoli (frozen)", totalQty: 2, unit: "cups", estPrice: 1.50 },
      { name: "Frozen mixed veggies", totalQty: 5, unit: "cups", estPrice: 3.00 },
    ],
  },
  {
    category: "Canned & Jarred",
    items: [
      { name: "Black beans (canned)", totalQty: 2, unit: "cans", estPrice: 1.80 },
      { name: "Canned diced tomatoes", totalQty: 1, unit: "can", estPrice: 1.20 },
      { name: "Canned corn", totalQty: 1, unit: "can", estPrice: 0.90 },
      { name: "Salsa", totalQty: 0.5, unit: "cup", estPrice: 1.50 },
    ],
  },
  {
    category: "Dairy",
    items: [
      { name: "Parmesan cheese", totalQty: 0.25, unit: "cup", estPrice: 1.50 },
    ],
  },
];

// ─── Demo supermarkets (no API; for hackathon demo zips) ───
export const DEMO_ZIP_SUPERMARKETS = "30058";
export const DEMO_ZIP_30332 = "30332";

export const demoSupermarkets: Store[] = [
  {
    id: "demo-super-1",
    name: "Kroger",
    address: "7167 Covington Hwy, Lithonia, GA 30058",
    distanceMiles: 0.9,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.718,
    longitude: -84.118,
  },
  {
    id: "demo-super-2",
    name: "Publix",
    address: "6700 Covington Hwy, Lithonia, GA 30058",
    distanceMiles: 1.4,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.708,
    longitude: -84.125,
  },
  {
    id: "demo-super-3",
    name: "Aldi",
    address: "7410 Covington Hwy, Lithonia, GA 30058",
    distanceMiles: 1.1,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.714,
    longitude: -84.122,
  },
];

/** Demo supermarkets for zip 30332 (Atlanta / Georgia Tech area). */
export const demoSupermarkets30332: Store[] = [
  {
    id: "demo-30332-1",
    name: "Kroger",
    address: "725 Ponce de Leon Ave NE, Atlanta, GA 30332",
    distanceMiles: 1.2,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.773,
    longitude: -84.366,
  },
  {
    id: "demo-30332-2",
    name: "Publix",
    address: "950 Marietta St NW, Atlanta, GA 30332",
    distanceMiles: 0.8,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.778,
    longitude: -84.404,
  },
  {
    id: "demo-30332-3",
    name: "Aldi",
    address: "840 North Ave NW, Atlanta, GA 30332",
    distanceMiles: 1.0,
    supportsSNAP: false,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: 33.775,
    longitude: -84.391,
  },
];

// ─── Mock Stores (fallback only; prefer API + demo supermarkets) ───
export const mockStores: Store[] = [
  {
    id: "s1",
    name: "SaveMore Market",
    address: "1234 Pine St, Macon, GA 31201",
    distanceMiles: 1.2,
    supportsSNAP: true,
    availability: { haveCount: 22, totalCount: 26 },
    matchedIngredients: ["Brown rice", "Black beans", "Onion", "Bell pepper", "Chicken thighs", "Frozen veggies", "Eggs", "Olive oil"],
    missingIngredients: ["Dried lentils", "Smoked paprika", "Sesame oil", "Turkey sausage"],
  },
  {
    id: "s2",
    name: "Fresh Foods Co-op",
    address: "567 Elm Ave, Macon, GA 31204",
    distanceMiles: 2.8,
    supportsSNAP: true,
    availability: { haveCount: 25, totalCount: 26 },
    matchedIngredients: ["Brown rice", "Black beans", "Onion", "Bell pepper", "Chicken thighs", "Frozen veggies", "Eggs", "Olive oil", "Dried lentils", "Turkey sausage"],
    missingIngredients: ["Smoked paprika"],
  },
  {
    id: "s3",
    name: "QuickStop Grocery",
    address: "890 Oak Blvd, Macon, GA 31206",
    distanceMiles: 0.8,
    supportsSNAP: false,
    availability: { haveCount: 15, totalCount: 26 },
    matchedIngredients: ["Brown rice", "Onion", "Eggs", "Frozen veggies", "Pasta"],
    missingIngredients: ["Dried lentils", "Turkey sausage", "Chicken thighs", "Smoked paprika", "Sweet potato"],
  },
  {
    id: "s4",
    name: "Community Harvest",
    address: "321 Maple Dr, Macon, GA 31210",
    distanceMiles: 4.5,
    supportsSNAP: true,
    availability: { haveCount: 26, totalCount: 26 },
    matchedIngredients: ["All ingredients available"],
    missingIngredients: [],
  },
];

// ─── Dietary / Health Options ─────────────────────────────
export const dietaryOptions = [
  "Vegetarian", "Vegan", "Halal", "Kosher",
  "Dairy-free", "Gluten-free",
  "Low-sodium", "Low-carb",
  "Nut allergy", "Shellfish allergy",
];

export const healthOptions = [
  "Diabetes-friendly",
  "Hypertension / heart-healthy",
  "High cholesterol",
  "Weight management",
];
