# 🍳 CookAI — AI Cooking To-Do List

> Built for **PromptWars Warm-up Challenge** · "Build, pitch & win in one day"

A production-grade AI micro-app that generates a personalized daily cooking plan based on your budget, dietary preference, available ingredients, and cooking time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🍽️ **3 Meal Plans** | Breakfast, Lunch & Dinner with steps |
| 🛒 **Grocery List** | Categorized & interactive checklist |
| 🔄 **Substitutions** | Smart ingredient swaps |
| 💰 **Budget Analysis** | Visual cost breakdown & tips |
| 📄 **PDF Export** | Download your full cooking plan |
| 🔖 **Save Plans** | Persist up to 5 plans locally |
| 🌙 **Dark / Light Mode** | PromptWars green & black theme |
| 📱 **Mobile First** | Responsive across all screen sizes |

---

## 🚀 Quick Start

```bash
# 1. Clone and enter directory
cd warm-up

# 2. Install dependencies
pnpm install

# 3. Set your API key
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 4. Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔧 Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Run Vitest tests |
| `pnpm format` | Prettier format |

---

## 🏗️ Architecture

```
src/
├── app/              # Next.js App Router pages & layouts
├── actions/          # Server Actions (AI generation)
├── components/
│   ├── features/     # MealCard, GroceryList, BudgetAnalysis…
│   ├── forms/        # MealPlanForm (React Hook Form + Zod)
│   └── shared/       # Logo, ThemeToggle
├── hooks/            # useMealPlan, usePDFExport
├── providers/        # ThemeProvider (next-themes)
├── services/ai/      # Provider abstraction (OpenAI/Gemini/Anthropic)
├── store/            # Zustand (meal plan state)
├── types/            # TypeScript interfaces
└── validators/       # Zod schemas (validate ALL AI output)
```

### AI Provider Abstraction

Swap providers without touching UI code:

```
services/ai/
├── provider.ts    # Abstract AIProvider interface
├── openai.ts      # GPT-4o (active)
├── gemini.ts      # Gemini 1.5 Pro (stub)
├── anthropic.ts   # Claude 3.5 Sonnet (stub)
└── index.ts       # Factory — auto-detects from env keys
```

Set `AI_PROVIDER=gemini` in `.env` to switch providers instantly.

---

## 🔑 Environment Variables

```bash
# Required — pick one provider
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...

# Optional overrides
AI_PROVIDER=openai          # Force a specific provider
OPENAI_MODEL=gpt-4o         # Override model
```

---

## 🛡️ Security

- ✅ No API keys exposed to client — all AI calls via Server Actions
- ✅ Every AI response validated through Zod schemas
- ✅ Input sanitized via React Hook Form + Zod on both client and server
- ✅ XSS-safe React rendering throughout

---

## 🧪 Tests

```bash
pnpm test
```

Coverage:
- `ai-parser.test.ts` — JSON extraction & Zod schema validation
- `budget-calculator.test.ts` — Budget math & schema
- `grocery-generator.test.ts` — Grocery helpers & schema

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS + CSS Variables |
| UI | Radix UI primitives + Lucide Icons |
| AI | OpenAI GPT-4o (swappable) |
| Validation | Zod (client + server) |
| Forms | React Hook Form |
| State | Zustand (persisted) |
| Fonts | Poppins (Google Fonts) |
| Tests | Vitest + Testing Library |
| Git | Husky + Commitlint + lint-staged |

---

## 🎨 Theme

PromptWars green & black with full dark/light mode:

- **Dark**: Pure `#0A0A0A` black with `#4ADE80` glowing green accents
- **Light**: Clean white with deep `#16A34A` forest green

Toggle via the moon/sun icon in the navbar.

---

*Built with ❤️ for PromptWars · Think like a Senior Staff Engineer shipping a real SaaS product.*
