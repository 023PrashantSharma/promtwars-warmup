'use client'

import { RefreshCcw, Download, Bookmark, BookmarkCheck, Clock, ChefHat } from 'lucide-react'
import { useState } from 'react'
import { cn, formatTime } from '@/lib/utils'
import { useMealPlanStore } from '@/store/meal-plan-store'
import { usePDFExport } from '@/hooks/use-pdf-export'
import { MealCard } from './MealCard'
import { GroceryList } from './GroceryList'
import { SubstitutionCard } from './SubstitutionCard'
import { BudgetAnalysis } from './BudgetAnalysis'
import type { CookingPlan } from '@/types/meal-plan'

type Tab = 'meals' | 'grocery' | 'substitutions' | 'budget'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'meals', label: 'Meal Plan', icon: '🍽️' },
  { id: 'grocery', label: 'Grocery', icon: '🛒' },
  { id: 'substitutions', label: 'Substitutions', icon: '🔄' },
  { id: 'budget', label: 'Budget', icon: '💰' },
]

interface MealPlanResultProps {
  plan: CookingPlan
  onRegenerate: () => void
}

export function MealPlanResult({ plan, onRegenerate }: MealPlanResultProps) {
  const [activeTab, setActiveTab] = useState<Tab>('meals')
  const [isSaved, setIsSaved] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { savePlan } = useMealPlanStore()
  const { exportToPDF } = usePDFExport()

  const handleSave = () => {
    savePlan(plan)
    setIsSaved(true)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(plan)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-brand-green/20 bg-gradient-to-r from-brand-green/5 to-brand-accent/5">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-brand-green" />
            Your Cooking Plan is Ready!
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Total cooking time: {formatTime(plan.totalCookingTime)}
            <span className="mx-2">·</span>
            Generated {new Date(plan.generatedAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRegenerate}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
              'border border-border bg-surface hover:bg-surface-2 text-muted-foreground hover:text-foreground',
              'transition-all duration-200 hover:border-brand-green/30'
            )}
            id="regenerate-plan-btn"
          >
            <RefreshCcw className="w-4 h-4" />
            Regenerate
          </button>

          <button
            onClick={handleSave}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
              'border transition-all duration-200',
              isSaved
                ? 'border-brand-green/40 bg-brand-green/10 text-brand-green'
                : 'border-border bg-surface hover:bg-surface-2 text-muted-foreground hover:text-foreground hover:border-brand-green/30'
            )}
            id="save-plan-btn"
          >
            {isSaved ? (
              <><BookmarkCheck className="w-4 h-4" /> Saved</>
            ) : (
              <><Bookmark className="w-4 h-4" /> Save</>
            )}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold',
              'bg-gradient-to-r from-brand-green-500 to-brand-accent text-black',
              'hover:opacity-90 transition-all duration-200 btn-glow',
              isExporting && 'opacity-70 cursor-not-allowed'
            )}
            id="export-pdf-btn"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
              'transition-all duration-200 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-brand-green text-black shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
            )}
            id={`tab-${tab.id}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'meals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MealCard meal={plan.mealPlan.breakfast} mealType="Breakfast" />
            <MealCard meal={plan.mealPlan.lunch} mealType="Lunch" />
            <MealCard meal={plan.mealPlan.dinner} mealType="Dinner" />
          </div>
        )}

        {activeTab === 'grocery' && (
          <GroceryList groceryList={plan.groceryList} />
        )}

        {activeTab === 'substitutions' && (
          <SubstitutionCard substitutions={plan.substitutions} />
        )}

        {activeTab === 'budget' && (
          <BudgetAnalysis analysis={plan.budgetAnalysis} />
        )}
      </div>
    </div>
  )
}
