/**
 * Core domain types for the AI Cooking To-Do List app
 */

export interface Meal {
  title: string
  description: string
  cookingTime: number // in minutes
  estimatedCost: number // in USD
  calories: number
  ingredients: string[]
  steps: string[]
  emoji: string
}

export interface MealPlan {
  breakfast: Meal
  lunch: Meal
  dinner: Meal
}

export interface GroceryItem {
  name: string
  quantity: string
  unit: string
  estimatedCost: number
  checked: boolean
}

export interface GroceryCategory {
  name: string
  icon: string
  items: GroceryItem[]
}

export interface GroceryList {
  vegetables: GroceryCategory
  dairy: GroceryCategory
  proteins: GroceryCategory
  pantry: GroceryCategory
  other: GroceryCategory
}

export interface Substitution {
  original: string
  substitute: string
  reason: string
  costSaving: number
  isAllergyFriendly: boolean
}

export interface BudgetAnalysis {
  estimatedTotalCost: number
  userBudget: number
  remainingBudget: number
  isBudgetExceeded: boolean
  costBreakdown: {
    breakfast: number
    lunch: number
    dinner: number
    groceries: number
  }
  suggestions: string[]
  savingTips: string[]
}

export interface CookingPlan {
  mealPlan: MealPlan
  groceryList: GroceryList
  substitutions: Substitution[]
  budgetAnalysis: BudgetAnalysis
  generatedAt: string
  totalCookingTime: number
}

export interface UserInput {
  budget: number
  dietaryPreference: DietaryPreference
  availableIngredients: string
  cookingTime: number // minutes available
  servings: number
  cuisinePreference: string
}

export type DietaryPreference =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'keto'
  | 'paleo'
  | 'halal'
  | 'kosher'

export type AIProvider = 'openai'

export type GenerationStatus =
  | 'idle'
  | 'generating-meals'
  | 'generating-grocery'
  | 'generating-substitutions'
  | 'generating-budget'
  | 'complete'
  | 'error'

export interface GenerationProgress {
  status: GenerationStatus
  step: number
  totalSteps: number
  message: string
}

export interface AppError {
  code: string
  message: string
  details?: string
  retryable: boolean
}
