'use client'

import { Clock, DollarSign, Flame, ChefHat, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { cn, formatCurrency, formatTime } from '@/lib/utils'
import type { Meal } from '@/types/meal-plan'

interface MealCardProps {
  meal: Meal
  mealType: 'Breakfast' | 'Lunch' | 'Dinner'
  className?: string
}

const MEAL_COLORS = {
  Breakfast: {
    gradient: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    icon: '🌅',
  },
  Lunch: {
    gradient: 'from-brand-green-500/10 to-brand-accent/5',
    border: 'border-brand-green/20 hover:border-brand-green/40',
    badge: 'bg-brand-green/15 text-brand-green border-brand-green/25',
    icon: '☀️',
  },
  Dinner: {
    gradient: 'from-purple-500/10 to-indigo-500/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    icon: '🌙',
  },
}

export function MealCard({ meal, mealType, className }: MealCardProps) {
  const [showSteps, setShowSteps] = useState(false)
  const colors = MEAL_COLORS[mealType]

  return (
    <div
      className={cn(
        'group relative rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300',
        'shadow-card-dark hover:shadow-green-glow card-glow',
        colors.gradient,
        colors.border,
        'bg-card',
        className
      )}
      id={`meal-card-${mealType.toLowerCase()}`}
    >
      {/* Meal Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
            colors.badge
          )}
        >
          <span>{colors.icon}</span>
          {mealType}
        </span>
        <span className="text-3xl" role="img" aria-label={meal.title}>
          {meal.emoji}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">{meal.title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{meal.description}</p>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
          <Clock className="w-4 h-4 text-brand-green mb-1" />
          <span className="text-sm font-semibold text-foreground">{formatTime(meal.cookingTime)}</span>
          <span className="text-[10px] text-muted-foreground">Cook time</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
          <DollarSign className="w-4 h-4 text-brand-green mb-1" />
          <span className="text-sm font-semibold text-foreground">{formatCurrency(meal.estimatedCost)}</span>
          <span className="text-[10px] text-muted-foreground">Per serving</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
          <Flame className="w-4 h-4 text-brand-green mb-1" />
          <span className="text-sm font-semibold text-foreground">{meal.calories}</span>
          <span className="text-[10px] text-muted-foreground">Calories</span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Ingredients
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {meal.ingredients.slice(0, 8).map((ingredient, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-2 border border-border text-foreground"
            >
              {ingredient}
            </span>
          ))}
          {meal.ingredients.length > 8 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-surface-2 border border-border text-muted-foreground">
              +{meal.ingredients.length - 8} more
            </span>
          )}
        </div>
      </div>

      {/* Expandable Steps */}
      <button
        onClick={() => setShowSteps(!showSteps)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium',
          'border border-border bg-surface hover:bg-surface-2 transition-all duration-200',
          'text-foreground hover:text-brand-green hover:border-brand-green/30'
        )}
        id={`meal-steps-toggle-${mealType.toLowerCase()}`}
      >
        <span className="flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-brand-green" />
          Cooking Steps ({meal.steps.length})
        </span>
        {showSteps ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {showSteps && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {meal.steps.map((step, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-surface border border-border">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green/15 border border-brand-green/25 flex items-center justify-center text-xs font-bold text-brand-green">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
