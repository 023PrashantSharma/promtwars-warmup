'use client'

import { cn } from '@/lib/utils'

interface AIThinkingLoaderProps {
  message?: string
  step?: number
  totalSteps?: number
  className?: string
}

const COOKING_FACTS = [
  'Did you know? Searing meat doesn\'t actually seal in juices — it creates flavor through the Maillard reaction.',
  'Mise en place (everything in its place) is the secret to stress-free cooking.',
  'Salt enhances flavor by suppressing bitterness and amplifying sweetness.',
  'Resting meat after cooking redistributes juices for a more tender result.',
  'The perfect pasta water should taste like mild seawater.',
]

export function AIThinkingLoader({
  message = 'Generating your cooking plan...',
  step = 1,
  totalSteps = 4,
  className,
}: AIThinkingLoaderProps) {
  const fact = COOKING_FACTS[step % COOKING_FACTS.length]
  const progress = (step / totalSteps) * 100

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] gap-8 p-8 text-center',
        className
      )}
    >
      {/* Animated Chef Icon */}
      <div className="relative">
        {/* Outer glow rings */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-brand-green scale-150" />
        <div
          className="absolute inset-0 rounded-full opacity-30 bg-brand-green scale-125"
          style={{ animation: 'pulseGreen 2s ease-in-out infinite' }}
        />

        {/* Main circle */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-green-500 to-brand-accent flex items-center justify-center shadow-green-glow-lg">
          <span className="text-4xl animate-bounce-gentle" role="img" aria-label="cooking">
            🍳
          </span>
        </div>

        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-green animate-spin" />
      </div>

      {/* Status message */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{message}</h3>
        <div className="flex items-center justify-center gap-1.5">
          <span className="thinking-dot" />
          <span className="thinking-dot" />
          <span className="thinking-dot" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-green">
          <div
            className="progress-green-fill"
            style={{ width: `${progress}%`, transition: 'width 0.7s ease-out' }}
          />
        </div>
      </div>

      {/* Fun cooking fact */}
      <div className="max-w-sm p-4 rounded-xl bg-surface border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-brand-green font-medium">💡 Chef&apos;s tip: </span>
          {fact}
        </p>
      </div>
    </div>
  )
}
