import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { BudgetAnalysis as BudgetAnalysisType } from '@/types/meal-plan'

interface BudgetAnalysisProps {
  analysis: BudgetAnalysisType
  className?: string
}

export function BudgetAnalysis({ analysis, className }: BudgetAnalysisProps) {
  const usedPercent = Math.min((analysis.estimatedTotalCost / analysis.userBudget) * 100, 100)
  const exceeded = analysis.isBudgetExceeded

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">💰</span>
        <h3 className="text-lg font-semibold text-foreground">Budget Analysis</h3>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
            exceeded
              ? 'bg-destructive/10 text-destructive border-destructive/25'
              : 'bg-brand-green/15 text-brand-green border-brand-green/25'
          )}
        >
          {exceeded ? (
            <><AlertTriangle className="w-3 h-3" /> Over Budget</>
          ) : (
            <><CheckCircle2 className="w-3 h-3" /> Within Budget</>
          )}
        </span>
      </div>

      {/* Main budget visualization */}
      <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
        {/* Big numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your Budget</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(analysis.userBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
            <p className={cn('text-2xl font-bold', exceeded ? 'text-destructive' : 'text-brand-green')}>
              {formatCurrency(analysis.estimatedTotalCost)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {exceeded ? 'Over by' : 'Remaining'}
            </p>
            <p className={cn('text-2xl font-bold', exceeded ? 'text-destructive' : 'text-brand-green')}>
              {exceeded
                ? formatCurrency(Math.abs(analysis.remainingBudget))
                : formatCurrency(analysis.remainingBudget)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget used</span>
            <span>{Math.round(usedPercent)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                exceeded
                  ? 'bg-gradient-to-r from-red-500 to-destructive'
                  : 'bg-gradient-to-r from-brand-green-500 to-brand-accent'
              )}
              style={{
                width: `${usedPercent}%`,
                boxShadow: exceeded
                  ? '0 0 8px rgba(239, 68, 68, 0.4)'
                  : '0 0 8px rgba(74, 222, 128, 0.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-brand-green" />
          Cost Breakdown
        </h4>
        {[
          { label: '🌅 Breakfast', value: analysis.costBreakdown.breakfast },
          { label: '☀️ Lunch', value: analysis.costBreakdown.lunch },
          { label: '🌙 Dinner', value: analysis.costBreakdown.dinner },
          { label: '🛒 Groceries', value: analysis.costBreakdown.groceries },
        ].map(({ label, value }) => {
          const pct = (value / analysis.estimatedTotalCost) * 100
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{formatCurrency(value)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-green/60"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips and Suggestions */}
      {(analysis.savingTips.length > 0 || analysis.suggestions.length > 0) && (
        <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-brand-green flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Smart Tips
          </h4>
          <ul className="space-y-2">
            {[...analysis.savingTips, ...analysis.suggestions].slice(0, 5).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
