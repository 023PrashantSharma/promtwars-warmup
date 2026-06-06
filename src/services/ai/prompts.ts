import type { DietaryPreference, UserInput } from '@/types/meal-plan'

/**
 * Build the system prompt for the AI
 */
export function buildSystemPrompt(): string {
  return `You are an expert personal chef and nutritionist AI assistant.
Your task is to create a comprehensive, personalized daily cooking plan.
You must ALWAYS respond with valid JSON only — no markdown, no explanations, no text outside the JSON.
Every field in the schema is required. Never omit fields.
Ensure all costs are realistic and in USD.
Make meals practical, delicious, and achievable within the given constraints.`
}

/**
 * Build the user prompt from input
 */
export function buildUserPrompt(input: UserInput): string {
  const dietaryNote = getDietaryNote(input.dietaryPreference)

  return `Generate a complete cooking plan for today based on:

CONSTRAINTS:
- Daily budget: $${input.budget}
- Dietary preference: ${input.dietaryPreference}${dietaryNote}
- Available ingredients I have: ${input.availableIngredients || 'none specified'}
- Total available cooking time today: ${input.cookingTime} minutes
- Servings needed: ${input.servings} people
- Cuisine preference: ${input.cuisinePreference || 'any'}

Return ONLY a valid JSON object with this exact structure:
{
  "mealPlan": {
    "breakfast": {
      "title": "string",
      "description": "string (2-3 sentences, appetizing)",
      "cookingTime": number (minutes),
      "estimatedCost": number (USD per serving),
      "calories": number,
      "ingredients": ["string"],
      "steps": ["string (clear cooking step)"],
      "emoji": "single emoji"
    },
    "lunch": { same structure },
    "dinner": { same structure }
  },
  "groceryList": {
    "vegetables": {
      "name": "Vegetables",
      "icon": "🥦",
      "items": [{ "name": "string", "quantity": "string", "unit": "string", "estimatedCost": number, "checked": false }]
    },
    "dairy": { "name": "Dairy", "icon": "🥛", "items": [] },
    "proteins": { "name": "Proteins", "icon": "🥩", "items": [] },
    "pantry": { "name": "Pantry", "icon": "🫙", "items": [] },
    "other": { "name": "Other", "icon": "🛒", "items": [] }
  },
  "substitutions": [
    {
      "original": "string",
      "substitute": "string",
      "reason": "string",
      "costSaving": number,
      "isAllergyFriendly": boolean
    }
  ],
  "budgetAnalysis": {
    "estimatedTotalCost": number,
    "userBudget": ${input.budget},
    "remainingBudget": number,
    "isBudgetExceeded": boolean,
    "costBreakdown": {
      "breakfast": number,
      "lunch": number,
      "dinner": number,
      "groceries": number
    },
    "suggestions": ["string"],
    "savingTips": ["string"]
  },
  "generatedAt": "${new Date().toISOString()}",
  "totalCookingTime": number
}`
}

function getDietaryNote(pref: DietaryPreference): string {
  const notes: Record<DietaryPreference, string> = {
    none: '',
    vegetarian: ' — No meat or fish, eggs and dairy are fine',
    vegan: ' — Strictly plant-based, no animal products',
    'gluten-free': ' — No wheat, barley, rye, or gluten-containing products',
    'dairy-free': ' — No milk, cheese, butter, or dairy products',
    keto: ' — High fat, very low carb (under 20g net carbs)',
    paleo: ' — Whole foods only, no grains, legumes, or processed foods',
    halal: ' — Halal certified meats only, no pork or alcohol',
    kosher: ' — Kosher dietary laws, no mixing meat and dairy',
  }
  return notes[pref]
}
