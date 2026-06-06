import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CookingPlan, GenerationProgress } from '@/types/meal-plan'

interface MealPlanState {
  // Data
  currentPlan: CookingPlan | null
  savedPlans: CookingPlan[]

  // UI State
  progress: GenerationProgress
  error: string | null

  // Grocery checklist state
  checkedItems: Record<string, boolean>

  // Actions
  setPlan: (plan: CookingPlan) => void
  clearPlan: () => void
  savePlan: (plan: CookingPlan) => void
  removeSavedPlan: (generatedAt: string) => void
  setProgress: (progress: GenerationProgress) => void
  setError: (error: string | null) => void
  toggleGroceryItem: (key: string) => void
  clearCheckedItems: () => void
}

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      currentPlan: null,
      savedPlans: [],
      progress: {
        status: 'idle',
        step: 0,
        totalSteps: 4,
        message: '',
      },
      error: null,
      checkedItems: {},

      setPlan: (plan) => set({ currentPlan: plan, error: null }),
      clearPlan: () =>
        set({
          currentPlan: null,
          progress: { status: 'idle', step: 0, totalSteps: 4, message: '' },
        }),

      savePlan: (plan) =>
        set((state) => ({
          savedPlans: [
            plan,
            ...state.savedPlans.filter((p) => p.generatedAt !== plan.generatedAt),
          ].slice(0, 5), // Keep last 5
        })),

      removeSavedPlan: (generatedAt) =>
        set((state) => ({
          savedPlans: state.savedPlans.filter((p) => p.generatedAt !== generatedAt),
        })),

      setProgress: (progress) => set({ progress }),
      setError: (error) => set({ error }),

      toggleGroceryItem: (key) =>
        set((state) => ({
          checkedItems: {
            ...state.checkedItems,
            [key]: !state.checkedItems[key],
          },
        })),

      clearCheckedItems: () => set({ checkedItems: {} }),
    }),
    {
      name: 'promptwars-meal-plan',
      partialize: (state) => ({
        savedPlans: state.savedPlans,
        checkedItems: state.checkedItems,
      }),
    }
  )
)
