import { z } from 'zod'

/* =============================================
   ZOD SCHEMAS — Validate every AI response
   ============================================= */

export const MealSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  cookingTime: z.number().int().positive().max(480),
  estimatedCost: z.number().positive().max(1000),
  calories: z.number().int().positive().max(5000),
  ingredients: z.array(z.string().min(1)).min(1).max(30),
  steps: z.array(z.string().min(5)).min(1).max(20),
  emoji: z.string().min(1).max(4),
})

export const MealPlanSchema = z.object({
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
})

export const GroceryItemSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.string().min(1),
  unit: z.string().min(1),
  estimatedCost: z.number().nonnegative().max(500),
  checked: z.boolean().default(false),
})

export const GroceryCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  items: z.array(GroceryItemSchema),
})

export const GroceryListSchema = z.object({
  vegetables: GroceryCategorySchema,
  dairy: GroceryCategorySchema,
  proteins: GroceryCategorySchema,
  pantry: GroceryCategorySchema,
  other: GroceryCategorySchema,
})

export const SubstitutionSchema = z.object({
  original: z.string().min(1).max(100),
  substitute: z.string().min(1).max(100),
  reason: z.string().min(10).max(300),
  costSaving: z.number().nonnegative(),
  isAllergyFriendly: z.boolean(),
})

export const BudgetAnalysisSchema = z.object({
  estimatedTotalCost: z.number().nonnegative(),
  userBudget: z.number().positive(),
  remainingBudget: z.number(),
  isBudgetExceeded: z.boolean(),
  costBreakdown: z.object({
    breakfast: z.number().nonnegative(),
    lunch: z.number().nonnegative(),
    dinner: z.number().nonnegative(),
    groceries: z.number().nonnegative(),
  }),
  suggestions: z.array(z.string().min(5)).max(5),
  savingTips: z.array(z.string().min(5)).max(5),
})

export const CookingPlanSchema = z.object({
  mealPlan: MealPlanSchema,
  groceryList: GroceryListSchema,
  substitutions: z.array(SubstitutionSchema).max(10),
  budgetAnalysis: BudgetAnalysisSchema,
  generatedAt: z.string(),
  totalCookingTime: z.number().positive(),
})

export const UserInputSchema = z.object({
  budget: z
    .number({ required_error: 'Budget is required' })
    .positive({ message: 'Budget must be positive' })
    .max(10000, { message: 'Budget seems too high' }),
  dietaryPreference: z.enum([
    'none',
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'keto',
    'paleo',
    'halal',
    'kosher',
  ]),
  availableIngredients: z
    .string()
    .min(3, { message: 'Please list at least a few ingredients' })
    .max(1000, { message: 'Too many ingredients listed' }),
  cookingTime: z
    .number({ required_error: 'Cooking time is required' })
    .int()
    .positive()
    .max(480, { message: 'Max 8 hours' }),
  servings: z
    .number()
    .int()
    .positive()
    .max(20, { message: 'Max 20 servings' })
    .default(2),
  cuisinePreference: z.string().max(100).default('any'),
})

// Type inference from schemas
export type MealSchemaType = z.infer<typeof MealSchema>
export type MealPlanSchemaType = z.infer<typeof MealPlanSchema>
export type GroceryListSchemaType = z.infer<typeof GroceryListSchema>
export type SubstitutionSchemaType = z.infer<typeof SubstitutionSchema>
export type BudgetAnalysisSchemaType = z.infer<typeof BudgetAnalysisSchema>
export type CookingPlanSchemaType = z.infer<typeof CookingPlanSchema>
export type UserInputSchemaType = z.infer<typeof UserInputSchema>
