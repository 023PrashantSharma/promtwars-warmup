import type { AIProvider } from './provider'
import { OpenAIProvider } from './openai'

/**
 * Get the active AI provider — OpenAI only.
 * Instantiated per-request (no singleton).
 */
export function getAIProvider(): AIProvider {
  return new OpenAIProvider()
}

export type { AIProvider }
