import { describe, it, expect } from 'vitest'
import { GroceryListSchema, GroceryItemSchema } from '@/validators/meal-plan'

// Grocery generation helpers
function formatGroceryText(items: Array<{ name: string; quantity: string; unit: string; estimatedCost: number }>): string {
  return items.map((item) => `• ${item.name} — ${item.quantity} ${item.unit}`).join('\n')
}

function sumGroceryCosts(items: Array<{ estimatedCost: number }>): number {
  return parseFloat(items.reduce((sum, item) => sum + item.estimatedCost, 0).toFixed(2))
}

function filterCheckedItems<T extends { name: string }>(items: T[], checkedKeys: Set<string>): T[] {
  return items.filter((item) => !checkedKeys.has(item.name))
}

describe('Grocery Generator', () => {
  const sampleItems = [
    { name: 'Tomatoes', quantity: '3', unit: 'pieces', estimatedCost: 1.5 },
    { name: 'Garlic', quantity: '1', unit: 'bulb', estimatedCost: 0.75 },
    { name: 'Chicken breast', quantity: '500', unit: 'g', estimatedCost: 5.5 },
  ]

  describe('formatGroceryText', () => {
    it('formats items correctly', () => {
      const result = formatGroceryText([sampleItems[0]])
      expect(result).toBe('• Tomatoes — 3 pieces')
    })

    it('joins multiple items with newlines', () => {
      const result = formatGroceryText(sampleItems.slice(0, 2))
      expect(result).toContain('\n')
      expect(result.split('\n')).toHaveLength(2)
    })

    it('returns empty string for empty array', () => {
      expect(formatGroceryText([])).toBe('')
    })
  })

  describe('sumGroceryCosts', () => {
    it('sums costs correctly', () => {
      expect(sumGroceryCosts(sampleItems)).toBe(7.75)
    })

    it('returns 0 for empty array', () => {
      expect(sumGroceryCosts([])).toBe(0)
    })

    it('handles floating point precision', () => {
      const items = [{ estimatedCost: 0.1 }, { estimatedCost: 0.2 }]
      expect(sumGroceryCosts(items)).toBe(0.3)
    })
  })

  describe('filterCheckedItems', () => {
    it('removes checked items', () => {
      const result = filterCheckedItems(sampleItems, new Set(['Tomatoes']))
      expect(result).toHaveLength(2)
      expect(result.find((i) => i.name === 'Tomatoes')).toBeUndefined()
    })

    it('returns all items when nothing checked', () => {
      expect(filterCheckedItems(sampleItems, new Set())).toHaveLength(3)
    })
  })

  describe('GroceryItemSchema', () => {
    it('validates a correct grocery item', () => {
      const result = GroceryItemSchema.safeParse({
        name: 'Spinach',
        quantity: '200',
        unit: 'g',
        estimatedCost: 2.0,
        checked: false,
      })
      expect(result.success).toBe(true)
    })

    it('defaults checked to false', () => {
      const result = GroceryItemSchema.safeParse({
        name: 'Spinach',
        quantity: '200',
        unit: 'g',
        estimatedCost: 2.0,
      })
      expect(result.success).toBe(true)
      if (result.success) expect(result.data.checked).toBe(false)
    })

    it('rejects negative cost', () => {
      const result = GroceryItemSchema.safeParse({
        name: 'Spinach',
        quantity: '200',
        unit: 'g',
        estimatedCost: -1,
        checked: false,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('GroceryListSchema', () => {
    it('validates correct grocery list structure', () => {
      const emptyCategory = {
        name: 'Test',
        icon: '🧪',
        items: [],
      }
      const list = {
        vegetables: emptyCategory,
        dairy: emptyCategory,
        proteins: emptyCategory,
        pantry: emptyCategory,
        other: emptyCategory,
      }
      const result = GroceryListSchema.safeParse(list)
      expect(result.success).toBe(true)
    })
  })
})
