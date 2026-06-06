import { describe, it, expect } from 'vitest'
import { CookingPlanSchema, MealSchema } from '@/validators/meal-plan'
import { safeParseJSON, extractJSON } from '@/services/ai/provider'

describe('AI Parser — safeParseJSON', () => {
  it('parses clean JSON string', () => {
    const input = '{"key": "value"}'
    expect(safeParseJSON(input)).toEqual({ key: 'value' })
  })

  it('strips markdown code block before parsing', () => {
    const input = '```json\n{"key": "value"}\n```'
    expect(safeParseJSON(input)).toEqual({ key: 'value' })
  })

  it('throws on invalid JSON', () => {
    expect(() => safeParseJSON('not json')).toThrow()
  })
})

describe('AI Parser — extractJSON', () => {
  it('extracts JSON from surrounding text', () => {
    const input = 'Here is the plan: {"mealPlan": {}} rest of text'
    expect(extractJSON(input)).toBe('{"mealPlan": {}}')
  })

  it('throws when no JSON found', () => {
    expect(() => extractJSON('no json here')).toThrow('No JSON object found')
  })
})

describe('MealSchema validation', () => {
  const validMeal = {
    title: 'Avocado Toast',
    description: 'Creamy avocado on toasted sourdough with a sprinkle of chili flakes.',
    cookingTime: 10,
    estimatedCost: 4.5,
    calories: 350,
    ingredients: ['sourdough bread', 'avocado', 'lemon', 'chili flakes'],
    steps: ['Toast bread.', 'Mash avocado with lemon juice.', 'Spread on toast.'],
    emoji: '🥑',
  }

  it('validates a correct meal object', () => {
    const result = MealSchema.safeParse(validMeal)
    expect(result.success).toBe(true)
  })

  it('rejects meal with missing required fields', () => {
    const result = MealSchema.safeParse({ title: 'Incomplete' })
    expect(result.success).toBe(false)
  })

  it('rejects negative cooking time', () => {
    const result = MealSchema.safeParse({ ...validMeal, cookingTime: -5 })
    expect(result.success).toBe(false)
  })

  it('rejects meal with zero calories', () => {
    const result = MealSchema.safeParse({ ...validMeal, calories: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects empty ingredients array', () => {
    const result = MealSchema.safeParse({ ...validMeal, ingredients: [] })
    expect(result.success).toBe(false)
  })
})

describe('CookingPlanSchema validation', () => {
  it('rejects invalid top-level structure', () => {
    const result = CookingPlanSchema.safeParse({ invalid: true })
    expect(result.success).toBe(false)
  })
})
