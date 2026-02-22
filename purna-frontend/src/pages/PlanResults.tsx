import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Clock, Users, DollarSign, RefreshCw, Clipboard, Printer, Download,
  ArrowRight, Repeat, Leaf, MapPin, ExternalLink,
} from "lucide-react";
import PurnaHeader from "@/components/PurnaHeader";
import SnapBadge from "@/components/SnapBadge";
import AvailabilityMeter from "@/components/AvailabilityMeter";
import { mockRecipes, mockWeeklyPlan, mockIngredients, demoSupermarkets, demoSupermarkets30332, DEMO_ZIP_SUPERMARKETS, DEMO_ZIP_30332, type Recipe, type WeeklyPlan, type IngredientAggregate, type Store } from "@/lib/mock-data";
import { usePurnaStore } from "@/lib/store";
import { fetchSnapStores, mapBackendSnapStoreToStore } from "@/lib/api";
import StoresMap from "@/components/StoresMap";
import { useToast } from "@/hooks/use-toast";

const PlanResults = () => {
  const { preferences, planData } = usePurnaStore();
  const budget = preferences.weeklyBudget || 50;
  const recipes = planData?.recipes ?? mockRecipes;
  const weeklyPlan = planData?.weeklyPlan ?? mockWeeklyPlan;
  const ingredients = planData?.ingredients ?? mockIngredients;
  const overlappingIngredients = planData?.overlappingIngredients ?? [];
  const total = ingredients.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.estPrice, 0), 0);
  const budgetPct = Math.min((total / budget) * 100, 100);
  const budgetColor = budgetPct > 100 ? "bg-destructive" : "bg-primary";


  return (
    <div className="min-h-screen bg-background">
      <PurnaHeader />
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Your Weekly Plan</h1>
          <p className="mt-1 text-muted-foreground">No pressure — swap recipes anytime.</p>

          {/* Budget bar */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Estimated total for this plan: <span className="font-bold">${total.toFixed(2)}</span> / ${budget}
              </span>
              {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Repeat size={14} className="text-primary" />
                Overlap score: {weeklyPlan.overlapScore}%
              </div> */}
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${budgetColor}`} style={{ width: `${budgetPct}%` }} />
            </div>
            {overlappingIngredients.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Leaf size={12} className="text-primary" />
                You'll reuse: {overlappingIngredients.join(", ")}
              </p>
            )}
          </div>
        </motion.div>

        <Tabs defaultValue="plan" className="space-y-6">
          <TabsList className="rounded-xl bg-muted/80 p-1">
            <TabsTrigger value="plan" className="rounded-lg">Plan</TabsTrigger>
            <TabsTrigger value="ingredients" className="rounded-lg">Ingredients & Prices</TabsTrigger>
            <TabsTrigger value="stores" className="rounded-lg">Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="plan"><PlanTab recipes={recipes} weeklyPlan={weeklyPlan} /></TabsContent>
          <TabsContent value="ingredients"><IngredientsTab ingredients={ingredients} /></TabsContent>
          <TabsContent value="stores"><StoresTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* ─── Plan Tab ──────────────────────────────────────── */
const PlanTab = ({ recipes, weeklyPlan }: { recipes: Recipe[]; weeklyPlan: WeeklyPlan }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyPlan.days.map((day) => {
          const recipe = recipes.find((r) => r.id === day.meals[0]?.recipeId);
          if (!recipe) return null;
          return (
            <motion.div
              key={day.dayName}
              className="rounded-2xl border border-border bg-card p-4 shadow-card cursor-pointer transition-shadow hover:shadow-elevated"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">{day.dayName}</span>
              <h3 className="mt-2 text-sm font-bold text-foreground leading-snug">{recipe.title}</h3>
              {(recipe.tags?.length ?? 0) > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recipe.tags!.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] rounded-md">{t}</Badge>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} />{recipe.timeMins}m</span>
                <span className="flex items-center gap-1"><Users size={12} />{recipe.servings}</span>
                {/* <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign size={12} />${(recipe.estCostPerServing || (recipe.servings ? recipe.estCost / recipe.servings : 0)).toFixed(2)}/srv</span> */}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile accordion view */}
      <div className="mt-6 sm:hidden">
        <Accordion type="single" collapsible>
          {weeklyPlan.days.map((day) => {
            const recipe = recipes.find((r) => r.id === day.meals[0]?.recipeId);
            if (!recipe) return null;
            return (
              <AccordionItem key={day.dayName} value={day.dayName}>
                <AccordionTrigger className="text-sm font-semibold">
                  {day.dayName}: {recipe.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{recipe.timeMins} min · {recipe.servings} servings · ${recipe.estCost.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </>
  );
};

/* Dummy nutrition when API doesn't provide values (per serving) */
const DUMMY_NUTRITION = {
  calories: 320,
  protein: "12g",
  carbs: "45g",
  fat: "8g",
  sodium: "300mg",
};

function NutritionDisplay({
  nutrition,
}: {
  nutrition: { calories: number; protein: string; carbs: string; fat: string; sodium: string };
}) {
  const hasRealData =
    (nutrition?.calories ?? 0) > 0 ||
    (nutrition?.protein?.trim() ?? "") !== "" ||
    (nutrition?.carbs?.trim() ?? "") !== "";
  const n = hasRealData && nutrition ? nutrition : DUMMY_NUTRITION;
  const isDummy = !hasRealData;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
        <span>Calories: {n.calories}</span>
        <span>Protein: {n.protein}</span>
        <span>Carbs: {n.carbs}</span>
        <span>Fat: {n.fat}</span>
        <span>Sodium: {n.sodium}</span>
      </div>
      {isDummy && (
        <p className="text-xs text-muted-foreground">Estimated values; actual nutrition may vary.</p>
      )}
    </div>
  );
}

/* ─── Recipe Detail Modal ──────────────────────────── */
const RecipeDetailModal = ({ recipe, onClose }: { recipe: Recipe | null; onClose: () => void }) => {
  if (!recipe) return null;
  return (
    <Dialog open={!!recipe} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{recipe.title}</DialogTitle>
        </DialogHeader>
        {(recipe.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags!.map((t) => <Badge key={t} variant="secondary" className="rounded-md text-xs">{t}</Badge>)}
          </div>
        )}
        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock size={14} />{recipe.timeMins} min</span>
          <span className="flex items-center gap-1"><Users size={14} />{recipe.servings} servings</span>
          <span className="flex items-center gap-1"><DollarSign size={14} />${recipe.estCost.toFixed(2)}</span>
        </div>

        {(recipe.ingredients?.length ?? 0) > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Ingredients</h4>
            <ul className="space-y-1 text-sm text-foreground">
              {recipe.ingredients!.map((ing) => (
                <li key={ing.name}>• {ing.quantity} {ing.unit} {ing.name}</li>
              ))}
            </ul>
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="steps">
            <AccordionTrigger className="text-sm font-semibold">Steps</AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
                {(recipe.steps?.length ? recipe.steps : []).map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="nutrition">
            <AccordionTrigger className="text-sm font-semibold">Nutrition</AccordionTrigger>
            <AccordionContent>
              <NutritionDisplay nutrition={recipe.nutrition} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* {recipe.whySelected && (
          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Why this recipe?</span> {recipe.whySelected}
          </div>
        )} */}
      </DialogContent>
    </Dialog>
  );
};

/* ─── Ingredients Tab ──────────────────────────────── */
const IngredientsTab = ({ ingredients }: { ingredients: IngredientAggregate[] }) => {
  const { toast } = useToast();

  const copyAll = () => {
    const text = ingredients
      .flatMap((cat) => [cat.category, ...cat.items.map((i) => `  ${i.name}: ${i.totalQty} ${i.unit} — $${i.estPrice.toFixed(2)}`)])
      .join("\n");
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Ingredient list copied to clipboard." });
  };

  const printIngredients = () => {
    window.print();
    toast({ title: "Print", description: "Use your browser's print dialog to print the ingredient list." });
  };

  const escapeCsv = (val: string | number): string => {
    const s = String(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const downloadCsv = () => {
    const headers = ["Category", "Name", "Quantity", "Unit", "Price"];
    const rows = ingredients.flatMap((cat) =>
      cat.items.map((i) => [cat.category, i.name, i.totalQty, i.unit, i.estPrice.toFixed(2)].map(escapeCsv).join(","))
    );
    const csv = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "purna-ingredients.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Ingredient list saved as CSV." });
  };

  const total = ingredients.reduce((s, c) => s + c.items.reduce((s2, i) => s2 + i.estPrice, 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Itemized Ingredients</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs" onClick={copyAll}>
            <Clipboard size={12} /> Copy
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs" onClick={printIngredients}>
            <Printer size={12} /> Print
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs" onClick={downloadCsv}>
            <Download size={12} /> CSV
          </Button>
        </div>
      </div>

      {ingredients.map((cat) => (
        <div key={cat.category}>
          <h3 className="mb-2 text-sm font-semibold text-primary sticky top-0 bg-background py-1">{cat.category}</h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {cat.items.map((item, i) => (
              <div
                key={item.name}
                className={`flex items-center justify-between px-4 py-3 text-sm ${i < cat.items.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-foreground font-medium">{item.name}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{item.totalQty} {item.unit}</span>
                  <span className="font-semibold text-foreground">${item.estPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl bg-primary/10 p-4 flex justify-between items-center">
        <span className="font-semibold text-foreground">Groceries total </span>
        <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

/* ─── Stores Tab ───────────────────────────────────── */
const StoresTab = () => {
  const { preferences } = usePurnaStore();
  const zip = (preferences.zipCode ?? "").replace(/\D/g, "").slice(0, 5);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (zip.length !== 5) {
      setStores([]);
      setError(null);
      return;
    }
    setError(null);
    setLoading(true);
    fetchSnapStores(zip)
      .then((list) => {
        const snapStores = list.map(mapBackendSnapStoreToStore);
        const extraStores =
          zip === DEMO_ZIP_SUPERMARKETS
            ? demoSupermarkets
            : zip === DEMO_ZIP_30332
              ? demoSupermarkets30332
              : [];
        const withSupermarkets = [...snapStores, ...extraStores];
        withSupermarkets.sort((a, b) => a.distanceMiles - b.distanceMiles);
        setStores(withSupermarkets);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load stores");
        setStores([]);
      })
      .finally(() => setLoading(false));
  }, [zip]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Nearby Stores</h2>
        <Badge variant="outline" className="rounded-lg text-xs">Closest first</Badge>
      </div>
      {error && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      {loading && (
        <p className="text-sm text-muted-foreground">Loading stores for {zip}…</p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {!loading && stores.map((store) => (
            <div key={store.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{store.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {store.address}
                  </p>
                </div>
                {store.supportsSNAP && <SnapBadge />}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{store.distanceMiles.toFixed(1)} miles away</div>
              {store.availability.totalCount > 0 && (
                <div className="mt-3">
                  <AvailabilityMeter have={store.availability.haveCount} total={store.availability.totalCount} />
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1" asChild>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={12} /> Directions
                  </a>
                </Button>
              </div>
            </div>
          ))}
          {!loading && zip.length !== 5 && (
            <p className="text-sm text-muted-foreground">Set your zip code in the plan step to see nearby stores.</p>
          )}
        </div>

        {/* Map */}
        <div className="hidden lg:block min-h-[400px]">
          <StoresMap stores={stores} minHeight={400} />
        </div>
      </div>
    </div>
  );
};

export default PlanResults;
