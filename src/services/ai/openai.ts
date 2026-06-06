import OpenAI from 'openai'
import type { AIProvider } from './provider'
import { safeParseJSON, extractJSON } from './provider'
import type { CookingPlan, UserInput } from '@/types/meal-plan'
import { CookingPlanSchema } from '@/validators/meal-plan'
import { buildSystemPrompt, buildUserPrompt } from './prompts'

/**
 * OpenAI provider implementation.
 * Uses gpt-4o by default — falls back gracefully.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = 'OpenAI'
  readonly model: string

  private readonly client: OpenAI

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    this.client = new OpenAI({ apiKey })
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o'
  }

  async generateCookingPlan(input: UserInput): Promise<CookingPlan> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('OpenAI returned empty response')
    }

    const raw = safeParseJSON(extractJSON(content))
    const validated = CookingPlanSchema.parse(raw)
    return validated
  }
}
