'use client'

import { useState, useTransition } from 'react'
import { generateCookingPlan } from '@/actions/generate-meal-plan'
import { useMealPlanStore } from '@/store/meal-plan-store'
import type { UserInputSchemaType } from '@/validators/meal-plan'

const PROGRESS_STEPS = [
  { step: 1, status: 'generating-meals' as const, message: 'Creating your personalized meals...' },
  {
    step: 2,
    status: 'generating-grocery' as const,
    message: 'Building your grocery list...',
  },
  {
    step: 3,
    status: 'generating-substitutions' as const,
    message: 'Finding ingredient substitutions...',
  },
  {
    step: 4,
    status: 'generating-budget' as const,
    message: 'Analyzing your budget...',
  },
]

export function useMealPlan() {
  const [isPending, startTransition] = useTransition()
  const [localError, setLocalError] = useState<string | null>(null)

  const { setPlan, setProgress, setError, savePlan } = useMealPlanStore()

  const generate = async (input: UserInputSchemaType) => {
    setLocalError(null)
    setError(null)

    // Simulate multi-step progress animation
    let stepIndex = 0
    const progressInterval = setInterval(() => {
      if (stepIndex < PROGRESS_STEPS.length) {
        const step = PROGRESS_STEPS[stepIndex]
        setProgress({
          status: step.status,
          step: step.step,
          totalSteps: PROGRESS_STEPS.length,
          message: step.message,
        })
        stepIndex++
      }
    }, 1500)

    startTransition(async () => {
      try {
        const result = await generateCookingPlan(input)

        clearInterval(progressInterval)

        if (result.success) {
          setProgress({
            status: 'complete',
            step: 4,
            totalSteps: 4,
            message: 'Your cooking plan is ready!',
          })
          setPlan(result.plan)
          savePlan(result.plan)
        } else {
          setProgress({
            status: 'error',
            step: 0,
            totalSteps: 4,
            message: result.error,
          })
          setError(result.error)
          setLocalError(result.error)
        }
      } catch {
        clearInterval(progressInterval)
        const msg = 'An unexpected error occurred. Please try again.'
        setProgress({ status: 'error', step: 0, totalSteps: 4, message: msg })
        setError(msg)
        setLocalError(msg)
      }
    })
  }

  return {
    generate,
    isGenerating: isPending,
    error: localError,
  }
}
