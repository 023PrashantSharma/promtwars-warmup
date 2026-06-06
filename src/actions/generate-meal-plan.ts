'use server'

import { getAIProvider } from '@/services/ai'
import { UserInputSchema } from '@/validators/meal-plan'
import type { CookingPlan } from '@/types/meal-plan'
import type { UserInputSchemaType } from '@/validators/meal-plan'
import { ZodError } from 'zod'

export type ActionResult =
  | { success: true; plan: CookingPlan }
  | { success: false; error: string; retryable: boolean; fieldErrors?: Record<string, string[]> }

/* ─── Error classifiers ─────────────────────── */

function isRateLimit(msg: string): boolean {
  return msg.includes('rate limit') || msg.includes('429')
}

function isNetworkError(msg: string): boolean {
  return msg.includes('network') || msg.includes('fetch')
}

function buildErrorMessage(msg: string): string {
  if (isRateLimit(msg)) return 'AI service is busy. Please wait a moment and try again.'
  if (isNetworkError(msg)) return 'Network error. Please check your connection and retry.'
  return `Generation failed: ${msg}`
}

function buildFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString() ?? 'general'
    if (!fieldErrors[field]) fieldErrors[field] = []
    fieldErrors[field].push(issue.message)
  }
  return fieldErrors
}

/**
 * Main server action — generate the full cooking plan.
 * Validates input, calls AI, validates response, returns typed result.
 * Never exposes API keys to the client.
 */
export async function generateCookingPlan(rawInput: UserInputSchemaType): Promise<ActionResult> {
  // 1. Validate input
  const parseResult = UserInputSchema.safeParse(rawInput)
  if (!parseResult.success) {
    return {
      success: false,
      error: 'Invalid input. Please check the form.',
      retryable: false,
      fieldErrors: buildFieldErrors(parseResult.error),
    }
  }

  // 2. Call AI provider
  try {
    const provider = getAIProvider()
    const plan = await provider.generateCookingPlan(parseResult.data)
    return { success: true, plan }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: 'AI returned an invalid response format. Please try again.',
        retryable: true,
      }
    }

    if (error instanceof Error) {
      const message = buildErrorMessage(error.message)
      const retryable = isRateLimit(error.message) || isNetworkError(error.message)
      return { success: false, error: message, retryable }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      retryable: true,
    }
  }
}
