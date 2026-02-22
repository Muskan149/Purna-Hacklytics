/**
 * Backend API client for https://purna-backend.vercel.app
 * POST /recipes expects { user_context: string } and returns recipes + groceryList + reasoning.
 */

const API_BASE = "https://purna-backend.vercel.app";

// ─── Backend response types (from Python) ─────────────────
export interface BackendRecipe {
  id: string | number;
  url?: string;
  name?: string;
  directions?: string[];
  servings?: number;
  totalPrice?: number;
  preparationTime?: number;
}

export interface BackendGroceryItem {
  ingredient?: string;
  quantity?: string | number;
  pricePerUnit?: number;
  totalPrice?: number;
}

export interface RecipesResponse {
  recipes?: BackendRecipe[];
  groceryList?: BackendGroceryItem[];
  reasoning?: string;
  overlappingIngredients?: string[];
}

export interface RecipeRequest {
  user_context: string;
}

/**
 * Build a user_context string from preferences for the backend.
 */
export function buildUserContext(preferences: {
  zipCode: string;
  familySize: number;
  weeklyBudget: number;
  dietaryRestrictions: string[];
  healthComplications: string[];
  notes: string;
}): string {
  const parts: string[] = [];
  parts.push(`I have a family of ${preferences.familySize} people`);
  parts.push(`and we have a weekly budget of $${preferences.weeklyBudget}`);
  if (preferences.zipCode) parts.push(`(ZIP: ${preferences.zipCode})`);
  if (preferences.dietaryRestrictions.length)
    parts.push(`Dietary restrictions: ${preferences.dietaryRestrictions.join(", ")}`);
  if (preferences.healthComplications.length)
    parts.push(`Health complications: ${preferences.healthComplications.join(", ")}`);
  if (preferences.notes.trim()) parts.push(`Notes: ${preferences.notes.trim()}`);
  return parts.join(". ");
}

/**
 * Fetch recipes and grocery list from the backend.
 */
export async function fetchRecipes(userContext: string): Promise<RecipesResponse> {
  console.log("fetching recipes");
  const res = await fetch(`${API_BASE}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_context: userContext }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recipes API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

// ─── Mappers: backend → frontend types ───────────────────
import type { Recipe, WeeklyPlan, DayPlan, IngredientAggregate, IngredientAggregateItem, Store } from "./mock-data";

/** Parse quantity string like "2 cups" or "1" into number and unit. */
function parseQuantity(q: string | number | undefined): { quantity: number; unit: string } {
  if (q === undefined || q === null) return { quantity: 0, unit: "" };
  if (typeof q === "number") return { quantity: q, unit: "" };
  const trimmed = String(q).trim();
  const match = trimmed.match(/^([\d./]+)\s*(.*)$/);
  if (match) {
    const num = parseFloat(match[1]);
    return { quantity: isNaN(num) ? 0 : num, unit: (match[2] || "").trim() };
  }
  return { quantity: 0, unit: trimmed };
}

export function mapBackendRecipeToRecipe(r: BackendRecipe): Recipe {
  const id = String(r.id ?? "");
  const servings = typeof r.servings === "number" ? r.servings : 4;
  const estCost = typeof r.totalPrice === "number" ? r.totalPrice : 0;
  return {
    id,
    title: r.name ?? "Recipe",
    tags: [],
    timeMins: typeof r.preparationTime === "number" ? r.preparationTime : 0,
    servings,
    estCost,
    estCostPerServing: servings > 0 ? estCost / servings : 0,
    ingredients: [],
    steps: Array.isArray(r.directions) ? r.directions : [],
    nutrition: { calories: 0, protein: "", carbs: "", fat: "", sodium: "" },
    whySelected: "",
  };
}

export function mapBackendRecipesToRecipes(recipes: BackendRecipe[]): Recipe[] {
  return recipes.map(mapBackendRecipeToRecipe);
}

export function mapBackendGroceryToAggregate(items: BackendGroceryItem[]): IngredientAggregate[] {
  if (!items?.length) return [];
  const list: IngredientAggregateItem[] = items.map((i) => {
    const { quantity, unit } = parseQuantity(i.quantity);
    return {
      name: i.ingredient ?? "",
      totalQty: quantity,
      unit: unit || "unit",
      estPrice: typeof i.totalPrice === "number" ? i.totalPrice : 0,
    };
  });
  return [{ category: "Grocery", items: list }];
}

/** Build a weekly plan: one recipe per day in order. */
export function buildWeeklyPlanFromRecipes(recipes: Recipe[]): WeeklyPlan {
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const days: DayPlan[] = dayNames.slice(0, recipes.length).map((dayName, i) => ({
    dayName,
    meals: [{ recipeId: recipes[i]?.id ?? "" }],
  }));
  const estTotalCost = recipes.reduce((s, r) => s + r.estCost, 0);
  return { days, overlapScore: 0, estTotalCost };
}

export function mapRecipesResponseToPlan(res: RecipesResponse): {
  recipes: Recipe[];
  weeklyPlan: WeeklyPlan;
  ingredients: IngredientAggregate[];
  reasoning: string;
  overlappingIngredients: string[];
} {
  const recipes = mapBackendRecipesToRecipes(res.recipes ?? []);
  const weeklyPlan = buildWeeklyPlanFromRecipes(recipes);
  const ingredients = mapBackendGroceryToAggregate(res.groceryList ?? []);
  const overlappingIngredients = Array.isArray(res.overlappingIngredients) ? res.overlappingIngredients : [];
  return {
    recipes,
    weeklyPlan,
    ingredients,
    reasoning: res.reasoning ?? "",
    overlappingIngredients,
  };
}

// ─── SNAP Stores (GET /snap-stores/closest?q=zip_code) ───
export interface BackendSnapStore {
  record_id: string;
  store_name: string;
  store_type: string;
  street_number: string;
  street_name: string;
  additional_address: string;
  city: string;
  state: string;
  zip_code: string;
  zip4: string;
  county: string;
  latitude: number;
  longitude: number;
  authorization_date: string;
  end_date: string;
  distance_miles: number;
}

/** Fetch closest SNAP stores by zip code. Returns list ordered by distance (closest first). */
export async function fetchSnapStores(zipCode: string): Promise<BackendSnapStore[]> {
  const q = encodeURIComponent(zipCode.trim());
  const res = await fetch(`${API_BASE}/snap-stores/closest?zip_code=${q}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SNAP stores API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  const list = Array.isArray(data) ? data : [];
  return list
    .filter((s: BackendSnapStore) => s != null && typeof s.distance_miles === "number")
    .sort((a: BackendSnapStore, b: BackendSnapStore) => a.distance_miles - b.distance_miles);
}

/** Build address string from backend SNAP store fields. */
function formatSnapStoreAddress(s: BackendSnapStore): string {
  const parts: string[] = [];
  if (s.street_number?.trim()) parts.push(s.street_number.trim());
  if (s.street_name?.trim()) parts.push(s.street_name.trim());
  const addl = s.additional_address?.trim();
  if (addl && addl !== "nan") parts.push(addl);
  const cityStateZip = [s.city?.trim(), s.state?.trim(), s.zip_code?.trim()].filter(Boolean).join(", ");
  if (cityStateZip) parts.push(cityStateZip);
  return parts.join(" ");
}

/** Map a backend SNAP store to frontend Store. Uses record_id for id; availability left as placeholder. */
export function mapBackendSnapStoreToStore(s: BackendSnapStore): Store {
  return {
    id: `snap-${s.record_id}`,
    name: (s.store_name ?? "").trim() || "SNAP Store",
    address: formatSnapStoreAddress(s),
    distanceMiles: s.distance_miles,
    supportsSNAP: true,
    availability: { haveCount: 0, totalCount: 0 },
    matchedIngredients: [],
    missingIngredients: [],
    latitude: typeof s.latitude === "number" ? s.latitude : undefined,
    longitude: typeof s.longitude === "number" ? s.longitude : undefined,
  };
}
