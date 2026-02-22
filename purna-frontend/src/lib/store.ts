import { create } from "zustand";
import type { UserPreferences, Recipe, WeeklyPlan, IngredientAggregate } from "./mock-data";

export interface PlanData {
  recipes: Recipe[];
  weeklyPlan: WeeklyPlan;
  ingredients: IngredientAggregate[];
  reasoning: string;
  overlappingIngredients?: string[];
}

interface PurnaState {
  preferences: UserPreferences;
  currentStep: number;
  planGenerated: boolean;
  isGenerating: boolean;
  planData: PlanData | null;
  planError: string | null;
  setPreferences: (p: Partial<UserPreferences>) => void;
  setStep: (step: number) => void;
  setPlanData: (data: PlanData | null) => void;
  setPlanError: (error: string | null) => void;
  startGenerating: () => void;
  finishGenerating: () => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  zipCode: "",
  familySize: 4,
  weeklyBudget: 50,
  dietaryRestrictions: [],
  healthComplications: [],
  notes: "",
};

export const usePurnaStore = create<PurnaState>((set) => ({
  preferences: { ...defaultPreferences },
  currentStep: 0,
  planGenerated: false,
  isGenerating: false,
  planData: null,
  planError: null,
  setPreferences: (p) =>
    set((state) => ({ preferences: { ...state.preferences, ...p } })),
  setStep: (step) => set({ currentStep: step }),
  setPlanData: (planData) => set({ planData, planError: null }),
  setPlanError: (planError) => set({ planError, planData: null }),
  startGenerating: () => set({ isGenerating: true, planError: null }),
  finishGenerating: () => set({ isGenerating: false, planGenerated: true }),
  reset: () =>
    set({
      preferences: { ...defaultPreferences },
      currentStep: 0,
      planGenerated: false,
      isGenerating: false,
      planData: null,
      planError: null,
    }),
}));
