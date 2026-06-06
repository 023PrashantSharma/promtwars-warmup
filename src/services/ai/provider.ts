import type { CookingPlan, UserInput } from '@/types/meal-plan'

/**
 * Abstract AI Provider interface.
 * All providers must implement this contract.
 * Swap providers without touching UI code.
 */
export interface AIProvider {
  readonly name: string
  readonly model: string
  generateCookingPlan(input: UserInput): Promise<CookingPlan>
}

/**
 * Result type for safe AI calls
 */
export type AIResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; retryable: boolean }

/**
 * Safely parse JSON from AI response — never trust raw output
 */
export function safeParseJSON(raw: string): unknown {
  // Strip markdown code blocks if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```$/im, '')
    .trim()

  return JSON.parse(cleaned)
}

/**
 * Extract JSON from text that may contain surrounding text
 */
export function extractJSON(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON object found in AI response')
  }
  return jsonMatch[0]
}
