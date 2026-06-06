import { describe, it, expect } from 'vitest'
import { BudgetAnalysisSchema } from '@/validators/meal-plan'

// Pure calculation helpers extracted from BudgetAnalysis logic
function calculateRemaining(budget: number, cost: number): number {
  return parseFloat((budget - cost).toFixed(2))
}

function isBudgetExceeded(budget: number, cost: number): boolean {
  return cost > budget
}

function calculateUsagePercent(budget: number, cost: number): number {
  return Math.min((cost / budget) * 100, 100)
}

describe('Budget Calculator', () => {
  describe('calculateRemaining', () => {
    it('returns positive when under budget', () => {
      expect(calculateRemaining(100, 75)).toBe(25)
    })

    it('returns negative when over budget', () => {
      expect(calculateRemaining(50, 65)).toBe(-15)
    })

    it('returns zero when exactly on budget', () => {
      expect(calculateRemaining(50, 50)).toBe(0)
    })

    it('handles floating point correctly', () => {
      expect(calculateRemaining(30.5, 28.33)).toBe(2.17)
    })
  })

  describe('isBudgetExceeded', () => {
    it('returns false when under budget', () => {
      expect(isBudgetExceeded(100, 80)).toBe(false)
    })

    it('returns true when over budget', () => {
      expect(isBudgetExceeded(50, 60)).toBe(true)
    })

    it('returns false when exactly equal', () => {
      expect(isBudgetExceeded(50, 50)).toBe(false)
    })
  })

  describe('calculateUsagePercent', () => {
    it('returns correct percentage', () => {
      expect(calculateUsagePercent(100, 75)).toBe(75)
    })

    it('caps at 100% when over budget', () => {
      expect(calculateUsagePercent(50, 200)).toBe(100)
    })

    it('returns 0 for zero cost', () => {
      expect(calculateUsagePercent(100, 0)).toBe(0)
    })
  })

  describe('BudgetAnalysisSchema', () => {
    const validAnalysis = {
      estimatedTotalCost: 45,
      userBudget: 50,
      remainingBudget: 5,
      isBudgetExceeded: false,
      costBreakdown: {
        breakfast: 10,
        lunch: 15,
        dinner: 20,
        groceries: 0,
      },
      suggestions: ['Cook in bulk to save time'],
      savingTips: ['Buy seasonal vegetables'],
    }

    it('validates a correct budget analysis', () => {
      const result = BudgetAnalysisSchema.safeParse(validAnalysis)
      expect(result.success).toBe(true)
    })

    it('rejects negative budget', () => {
      const result = BudgetAnalysisSchema.safeParse({ ...validAnalysis, userBudget: -10 })
      expect(result.success).toBe(false)
    })

    it('allows negative remainingBudget (exceeded case)', () => {
      const result = BudgetAnalysisSchema.safeParse({
        ...validAnalysis,
        remainingBudget: -10,
        isBudgetExceeded: true,
      })
      expect(result.success).toBe(true)
    })
  })
})
