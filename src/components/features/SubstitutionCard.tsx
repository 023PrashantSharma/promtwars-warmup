import { ArrowRight, Leaf, DollarSign } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Substitution } from '@/types/meal-plan'

interface SubstitutionCardProps {
  substitutions: Substitution[]
  className?: string
}

export function SubstitutionCard({ substitutions, className }: SubstitutionCardProps) {
  if (substitutions.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <p className="text-sm">No substitutions needed for your dietary preference.</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🔄</span>
        <h3 className="text-lg font-semibold text-foreground">Ingredient Substitutions</h3>
        <span className="badge-green text-xs">{substitutions.length}</span>
      </div>

      <div className="space-y-3">
        {substitutions.map((sub, i) => (
          <div
            key={i}
            className="relative rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-brand-green/30 card-glow"
            id={`substitution-${i}`}
          >
            {/* Swap row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Original */}
              <div className="flex-1 px-3 py-2 rounded-lg bg-surface-2 border border-border">
                <p className="text-xs text-muted-foreground mb-0.5">Replace</p>
                <p className="text-sm font-semibold text-foreground">{sub.original}</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green/10 border border-brand-green/25 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-brand-green" />
              </div>

              {/* Substitute */}
              <div className="flex-1 px-3 py-2 rounded-lg bg-brand-green/5 border border-brand-green/20">
                <p className="text-xs text-brand-green mb-0.5">With</p>
                <p className="text-sm font-semibold text-foreground">{sub.substitute}</p>
              </div>
            </div>

            {/* Reason */}
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{sub.reason}</p>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {sub.costSaving > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <DollarSign className="w-3 h-3" />
                  Save {formatCurrency(sub.costSaving)}
                </span>
              )}
              {sub.isAllergyFriendly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Leaf className="w-3 h-3" />
                  Allergy-friendly
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
