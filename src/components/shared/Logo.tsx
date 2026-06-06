import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Icon */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-green-500 to-brand-accent opacity-20 animate-pulse" />
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-brand-green-500 to-brand-accent flex items-center justify-center shadow-green-glow">
          <span className="text-sm" role="img" aria-label="cooking">
            🍳
          </span>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight text-gradient-green">
            CookAI
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-brand-green" />
            PromptWars
          </span>
        </div>
      )}
    </div>
  )
}
