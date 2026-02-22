import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Minus, Plus, Info, Search, Loader2, Sparkles, ShoppingCart, ChefHat } from "lucide-react";
import { usePurnaStore } from "@/lib/store";
import { dietaryOptions, healthOptions } from "@/lib/mock-data";
import { buildUserContext, fetchRecipes, mapRecipesResponseToPlan } from "@/lib/api";
import PurnaHeader from "@/components/PurnaHeader";

const STEP_LABELS = ["Household", "Dietary", "Health", "Notes", "Review"];

const slideVariant = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const Plan = () => {
  const nav = useNavigate();
  const { preferences, setPreferences, currentStep, setStep, startGenerating, finishGenerating, isGenerating, setPlanData, setPlanError, planError } = usePurnaStore();
  const [dir, setDir] = useState(1);

  const goNext = useCallback(() => {
    setDir(1);
    setStep(Math.min(currentStep + 1, 4));
  }, [currentStep, setStep]);

  const goBack = useCallback(() => {
    setDir(-1);
    setStep(Math.max(currentStep - 1, 0));
  }, [currentStep, setStep]);

  const canNext = useMemo(() => {
    if (currentStep === 0) return preferences.zipCode.length >= 5 && preferences.weeklyBudget > 0;
    return true;
  }, [currentStep, preferences]);

  const generate = useCallback(async () => {
    startGenerating();
    try {
      const userContext = buildUserContext(preferences);
      const response = await fetchRecipes(userContext);
      const plan = mapRecipesResponseToPlan(response);
      setPlanData(plan);
      finishGenerating();
      nav("/plan/results");
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : "Failed to load recipes");
      finishGenerating();
    }
  }, [preferences, startGenerating, finishGenerating, setPlanData, setPlanError, nav]);

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background">
        <PurnaHeader />
        <div className="flex flex-col items-center justify-center py-32">
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <GeneratingSteps />
          </motion.div>
        </div>
      </div>
    );
  }

  if (planError) {
    return (
      <div className="min-h-screen bg-background">
        <PurnaHeader />
        <div className="container max-w-xl py-10">
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="font-medium text-destructive">Could not load your plan</p>
            <p className="mt-2 text-sm text-muted-foreground">{planError}</p>
            <Button className="mt-4 rounded-xl" onClick={() => setPlanError(null)}>Try again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PurnaHeader />
      <div className="container max-w-xl py-10">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex justify-between text-xs font-medium text-muted-foreground">
            {STEP_LABELS.map((l, i) => (
              <span key={l} className={i <= currentStep ? "text-primary font-semibold" : ""}>{l}</span>
            ))}
          </div>
          <Progress value={((currentStep + 1) / 5) * 100} className="h-2 rounded-full" />
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={currentStep}
            custom={dir}
            variants={slideVariant}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {currentStep === 0 && <StepHousehold />}
            {currentStep === 1 && <StepDietary />}
            {currentStep === 2 && <StepHealth />}
            {currentStep === 3 && <StepNotes />}
            {currentStep === 4 && <StepReview onGenerate={generate} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={currentStep === 0} className="rounded-xl gap-1">
            <ArrowLeft size={16} /> Back
          </Button>
          {currentStep < 4 && (
            <Button onClick={goNext} disabled={!canNext} className="rounded-xl gap-1">
              Next <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Step Components ───────────────────────────────── */

const StepHousehold = () => {
  const { preferences, setPreferences } = usePurnaStore();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tell us about your household</h2>
        <p className="mt-1 text-sm text-muted-foreground">Let's build a plan that fits your budget.</p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="zip">Zip code</Label>
          <Input
            id="zip"
            placeholder="e.g. 31201"
            value={preferences.zipCode}
            onChange={(e) => setPreferences({ zipCode: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            className="mt-1 rounded-xl"
            maxLength={5}
          />
        </div>
        <div>
          <Label>Family members</Label>
          <div className="mt-1 flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => setPreferences({ familySize: Math.max(1, preferences.familySize - 1) })}
              aria-label="Decrease family size"
            >
              <Minus size={16} />
            </Button>
            <span className="w-10 text-center text-lg font-semibold">{preferences.familySize}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() => setPreferences({ familySize: Math.min(12, preferences.familySize + 1) })}
              aria-label="Increase family size"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="budget">Weekly grocery budget ($)</Label>
          <p className="text-xs text-muted-foreground mb-1">This is for groceries for the week.</p>
          <Input
            id="budget"
            type="number"
            placeholder="50"
            value={preferences.weeklyBudget || ""}
            onChange={(e) => setPreferences({ weeklyBudget: Number(e.target.value) })}
            className="mt-1 rounded-xl"
            min={0}
          />
        </div>
      </div>
    </div>
  );
};

const StepDietary = () => {
  const { preferences, setPreferences } = usePurnaStore();
  const [filter, setFilter] = useState("");
  const filtered = dietaryOptions.filter((o) => o.toLowerCase().includes(filter.toLowerCase()));

  const toggle = (opt: string) => {
    const current = preferences.dietaryRestrictions;
    setPreferences({
      dietaryRestrictions: current.includes(opt) ? current.filter((x) => x !== opt) : [...current, opt],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dietary restrictions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select any that apply — or skip this step.</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <Checkbox
              checked={preferences.dietaryRestrictions.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <span className="text-sm text-foreground">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const StepHealth = () => {
  const { preferences, setPreferences } = usePurnaStore();

  const toggle = (opt: string) => {
    const current = preferences.healthComplications;
    setPreferences({
      healthComplications: current.includes(opt) ? current.filter((x) => x !== opt) : [...current, opt],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">Health considerations</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={16} className="text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Not medical advice — just meal preferences.</TooltipContent>
          </Tooltip>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">We'll tailor recipes to be friendlier for these conditions.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {healthOptions.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/60"
          >
            <Checkbox
              checked={preferences.healthComplications.includes(opt)}
              onCheckedChange={() => toggle(opt)}
            />
            <span className="text-sm text-foreground">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const StepNotes = () => {
  const { preferences, setPreferences } = usePurnaStore();
  const maxLen = 300;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Anything else?</h2>
        <p className="mt-1 text-sm text-muted-foreground">No pressure — tell us what helps.</p>
      </div>
      <div>
        <Textarea
          placeholder="e.g. Prefer 30-min dinners, No spicy food, Use microwave only"
          value={preferences.notes}
          onChange={(e) => setPreferences({ notes: e.target.value.slice(0, maxLen) })}
          className="rounded-xl min-h-[120px]"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">{preferences.notes.length}/{maxLen}</p>
      </div>
    </div>
  );
};

const StepReview = ({ onGenerate }: { onGenerate: () => void }) => {
  const { preferences } = usePurnaStore();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review your plan setup</h2>
        <p className="mt-1 text-sm text-muted-foreground">Everything look right? Let's generate your plan.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-card">
        <Row label="Zip code" value={preferences.zipCode} />
        <Row label="Family size" value={`${preferences.familySize} people`} />
        <Row label="Weekly budget" value={`$${preferences.weeklyBudget}`} />
        <Row label="Dietary" value={preferences.dietaryRestrictions.join(", ") || "None"} />
        <Row label="Health" value={preferences.healthComplications.join(", ") || "None"} />
        {preferences.notes && <Row label="Notes" value={preferences.notes} />}
      </div>
      <Button onClick={onGenerate} size="lg" className="w-full rounded-xl gap-2 text-base">
        <Sparkles size={18} /> Generate weekly plan
      </Button>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="font-medium text-muted-foreground">{label}</span>
    <span className="text-right text-foreground">{value}</span>
  </div>
);

const GeneratingSteps = () => {
  const [step, setStepIdx] = useState(0);
  const msgs = [
    { icon: <ChefHat size={18} />, text: "Finding recipes…" },
    { icon: <Sparkles size={18} />, text: "Optimizing for budget…" },
    { icon: <ShoppingCart size={18} />, text: "Maximizing ingredient overlap…" },
  ];

  useState(() => {
    const t1 = setTimeout(() => setStepIdx(1), 1000);
    const t2 = setTimeout(() => setStepIdx(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });

  return (
    <div className="space-y-3">
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          className={`flex items-center gap-2 text-sm ${i <= step ? "text-foreground" : "text-muted-foreground/40"}`}
          animate={{ opacity: i <= step ? 1 : 0.3 }}
        >
          {m.icon} {m.text}
        </motion.div>
      ))}
    </div>
  );
};

export default Plan;
