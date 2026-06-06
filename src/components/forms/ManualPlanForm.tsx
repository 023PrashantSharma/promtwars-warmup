'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import { Plus, Trash2, ChefHat, DollarSign, Clock, Flame, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CookingPlan } from '@/types/meal-plan'
import { useState } from 'react'

/* ─── Schemas ────────────────────────────────── */

const MealInputSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().min(5, 'Description required'),
  cookingTime: z.number({ invalid_type_error: 'Required' }).positive().max(480),
  estimatedCost: z.number({ invalid_type_error: 'Required' }).positive(),
  calories: z.number({ invalid_type_error: 'Required' }).positive().max(5000),
  ingredients: z.string().min(3, 'List at least one ingredient'),
  steps: z.string().min(5, 'Add at least one step'),
  emoji: z.string().default('🍽️'),
})

const GroceryItemInputSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  unit: z.string().min(1),
  estimatedCost: z.number().nonnegative(),
  category: z.enum(['vegetables', 'dairy', 'proteins', 'pantry', 'other']),
})

const SubstitutionInputSchema = z.object({
  original: z.string().min(1, 'Original ingredient required'),
  substitute: z.string().min(1, 'Substitute required'),
  reason: z.string().min(5, 'Reason required'),
  costSaving: z.number().nonnegative().default(0),
  isAllergyFriendly: z.boolean().default(false),
})

const ManualPlanSchema = z.object({
  budget: z.number({ invalid_type_error: 'Required' }).positive(),
  breakfast: MealInputSchema,
  lunch: MealInputSchema,
  dinner: MealInputSchema,
  groceryItems: z.array(GroceryItemInputSchema),
  substitutions: z.array(SubstitutionInputSchema),
})

// Use a distinct name to avoid clash with the exported component
type ManualPlanValues = z.infer<typeof ManualPlanSchema>

/* ─── Helpers ────────────────────────────────── */

function parseLinesField(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter(Boolean)
}

function parseCommaField(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildGroceryList(
  items: ManualPlanValues['groceryItems']
): CookingPlan['groceryList'] {
  const list: CookingPlan['groceryList'] = {
    vegetables: { name: 'Vegetables', icon: '🥦', items: [] },
    dairy: { name: 'Dairy', icon: '🥛', items: [] },
    proteins: { name: 'Proteins', icon: '🥩', items: [] },
    pantry: { name: 'Pantry', icon: '🫙', items: [] },
    other: { name: 'Other', icon: '🛒', items: [] },
  }
  for (const item of items) {
    list[item.category].items.push({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      estimatedCost: item.estimatedCost,
      checked: false,
    })
  }
  return list
}

function buildBudgetAnalysis(
  data: ManualPlanValues
): CookingPlan['budgetAnalysis'] {
  const mealTotal =
    data.breakfast.estimatedCost + data.lunch.estimatedCost + data.dinner.estimatedCost
  const groceryCost = data.groceryItems.reduce((s, i) => s + i.estimatedCost, 0)
  const total = Number.parseFloat((mealTotal + groceryCost).toFixed(2))
  const remaining = Number.parseFloat((data.budget - total).toFixed(2))

  return {
    estimatedTotalCost: total,
    userBudget: data.budget,
    remainingBudget: remaining,
    isBudgetExceeded: remaining < 0,
    costBreakdown: {
      breakfast: data.breakfast.estimatedCost,
      lunch: data.lunch.estimatedCost,
      dinner: data.dinner.estimatedCost,
      groceries: Number.parseFloat(groceryCost.toFixed(2)),
    },
    suggestions: [],
    savingTips: [],
  }
}

/* ─── Shared styles ──────────────────────────── */

const inputCls = [
  'w-full px-3 py-2.5 rounded-xl text-sm text-foreground bg-surface border border-border',
  'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40',
  'focus:border-brand-green/60 transition-all duration-200',
].join(' ')

const labelCls =
  'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'

/* ─── Meal Sub-form ──────────────────────────── */

const MEAL_EMOJIS: Readonly<Record<string, readonly string[]>> = {
  breakfast: ['🍳', '🥞', '🥣', '🧇', '🥐', '🍵', '🫐', '🍌'],
  lunch: ['🥗', '🌮', '🥙', '🍜', '🥪', '🍱', '🫕', '🌯'],
  dinner: ['🍝', '🥩', '🍛', '🥘', '🍲', '🫔', '🍖', '🦞'],
}

interface MealSectionProps {
  readonly prefix: 'breakfast' | 'lunch' | 'dinner'
  readonly label: string
  readonly icon: string
  readonly register: UseFormRegister<ManualPlanValues>
  readonly errors: FieldErrors<ManualPlanValues>
  readonly setValue: UseFormSetValue<ManualPlanValues>
}

const TITLE_PLACEHOLDER: Record<'breakfast' | 'lunch' | 'dinner', string> = {
  breakfast: 'e.g., Avocado Toast',
  lunch: 'e.g., Grilled Chicken Salad',
  dinner: 'e.g., Pasta Primavera',
}

function MealSection({ prefix, label, icon, register, errors, setValue }: MealSectionProps) {
  const [emoji, setEmoji] = useState(MEAL_EMOJIS[prefix]?.[0] ?? '🍽️')
  const err = errors[prefix]
  const emojiKey = `${prefix}.emoji` as const

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      {/* Header + emoji picker */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-base font-bold text-foreground">{label}</h3>
        <div className="ml-auto flex gap-1 flex-wrap justify-end">
          {(MEAL_EMOJIS[prefix] ?? []).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setEmoji(e)
                setValue(emojiKey, e)
              }}
              className={cn(
                'w-7 h-7 rounded-lg text-base transition-all duration-150',
                emoji === e
                  ? 'bg-brand-green/20 border border-brand-green/40 scale-110'
                  : 'bg-surface hover:bg-surface-2 border border-border'
              )}
              title={e}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor={`${prefix}-title`} className={labelCls}>
          Meal Title
        </label>
        <input
          id={`${prefix}-title`}
          {...register(`${prefix}.title`)}
          className={inputCls}
          placeholder={TITLE_PLACEHOLDER[prefix]}
        />
        {err?.title && (
          <p className="mt-1 text-xs text-destructive">{err.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor={`${prefix}-description`} className={labelCls}>
          Description
        </label>
        <textarea
          id={`${prefix}-description`}
          {...register(`${prefix}.description`)}
          rows={2}
          className={cn(inputCls, 'resize-none')}
          placeholder="A short appetizing description..."
        />
        {err?.description && (
          <p className="mt-1 text-xs text-destructive">{err.description.message}</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor={`${prefix}-time`} className={cn(labelCls, 'flex items-center gap-1')}>
            <Clock className="w-3 h-3 text-brand-green" /> Minutes
          </label>
          <input
            id={`${prefix}-time`}
            type="number"
            {...register(`${prefix}.cookingTime`, { valueAsNumber: true })}
            className={inputCls}
            placeholder="30"
          />
          {err?.cookingTime && (
            <p className="mt-1 text-xs text-destructive">{err.cookingTime.message}</p>
          )}
        </div>
        <div>
          <label htmlFor={`${prefix}-cost`} className={cn(labelCls, 'flex items-center gap-1')}>
            <DollarSign className="w-3 h-3 text-brand-green" /> Cost ($)
          </label>
          <input
            id={`${prefix}-cost`}
            type="number"
            step="0.01"
            {...register(`${prefix}.estimatedCost`, { valueAsNumber: true })}
            className={inputCls}
            placeholder="8.00"
          />
          {err?.estimatedCost && (
            <p className="mt-1 text-xs text-destructive">{err.estimatedCost.message}</p>
          )}
        </div>
        <div>
          <label htmlFor={`${prefix}-calories`} className={cn(labelCls, 'flex items-center gap-1')}>
            <Flame className="w-3 h-3 text-brand-green" /> Calories
          </label>
          <input
            id={`${prefix}-calories`}
            type="number"
            {...register(`${prefix}.calories`, { valueAsNumber: true })}
            className={inputCls}
            placeholder="450"
          />
          {err?.calories && (
            <p className="mt-1 text-xs text-destructive">{err.calories.message}</p>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label htmlFor={`${prefix}-ingredients`} className={labelCls}>
          {'Ingredients'}
          {' '}
          <span className="normal-case font-normal text-muted-foreground">(comma-separated)</span>
        </label>
        <textarea
          id={`${prefix}-ingredients`}
          {...register(`${prefix}.ingredients`)}
          rows={2}
          className={cn(inputCls, 'resize-none')}
          placeholder="chicken breast, garlic, olive oil, lemon, rosemary"
        />
        {err?.ingredients && (
          <p className="mt-1 text-xs text-destructive">{err.ingredients.message}</p>
        )}
      </div>

      {/* Steps */}
      <div>
        <label htmlFor={`${prefix}-steps`} className={labelCls}>
          {'Cooking Steps'}
          {' '}
          <span className="normal-case font-normal text-muted-foreground">(one per line)</span>
        </label>
        <textarea
          id={`${prefix}-steps`}
          {...register(`${prefix}.steps`)}
          rows={4}
          className={cn(inputCls, 'resize-none')}
          placeholder={'Preheat pan over medium heat.\nSeason chicken with salt and pepper.\nCook for 6-7 minutes per side.'}
        />
        {err?.steps && (
          <p className="mt-1 text-xs text-destructive">{err.steps.message}</p>
        )}
      </div>
    </div>
  )
}

/* ─── Main Manual Form ───────────────────────── */

interface ManualPlanFormProps {
  readonly onComplete: (plan: CookingPlan) => void
}

const CATEGORY_OPTIONS = [
  { value: 'vegetables', label: '🥦 Vegetables' },
  { value: 'dairy', label: '🥛 Dairy' },
  { value: 'proteins', label: '🥩 Proteins' },
  { value: 'pantry', label: '🫙 Pantry' },
  { value: 'other', label: '🛒 Other' },
] as const

export function ManualPlanForm({ onComplete }: ManualPlanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ManualPlanValues>({
    resolver: zodResolver(ManualPlanSchema),
    defaultValues: {
      budget: 50,
      breakfast: { emoji: '🍳', cookingTime: 15, estimatedCost: 5, calories: 350 },
      lunch: { emoji: '🥗', cookingTime: 20, estimatedCost: 10, calories: 500 },
      dinner: { emoji: '🍝', cookingTime: 40, estimatedCost: 15, calories: 650 },
      groceryItems: [],
      substitutions: [],
    },
  })

  const {
    fields: groceryFields,
    append: appendGrocery,
    remove: removeGrocery,
  } = useFieldArray({ control, name: 'groceryItems' })

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({ control, name: 'substitutions' })

  const addBtnCls = cn(
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
    'border border-brand-green/30 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition-all'
  )

  const onSubmit = (data: ManualPlanValues) => {
    const buildMeal = (m: ManualPlanValues['breakfast']): CookingPlan['mealPlan']['breakfast'] => ({
      title: m.title,
      description: m.description,
      cookingTime: m.cookingTime,
      estimatedCost: m.estimatedCost,
      calories: m.calories,
      ingredients: parseCommaField(m.ingredients),
      steps: parseLinesField(m.steps),
      emoji: m.emoji,
    })

    const plan: CookingPlan = {
      mealPlan: {
        breakfast: buildMeal(data.breakfast),
        lunch: buildMeal(data.lunch),
        dinner: buildMeal(data.dinner),
      },
      groceryList: buildGroceryList(data.groceryItems),
      substitutions: data.substitutions.map((s) => ({
        original: s.original,
        substitute: s.substitute,
        reason: s.reason,
        costSaving: s.costSaving,
        isAllergyFriendly: s.isAllergyFriendly,
      })),
      budgetAnalysis: buildBudgetAnalysis(data),
      generatedAt: new Date().toISOString(),
      totalCookingTime:
        data.breakfast.cookingTime + data.lunch.cookingTime + data.dinner.cookingTime,
    }
    onComplete(plan)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="manual-plan-form" noValidate>

      {/* Budget */}
      <div>
        <label htmlFor="manual-budget" className={labelCls}>
          <DollarSign className="w-3 h-3 text-brand-green inline mr-1" />
          Daily Budget (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            $
          </span>
          <input
            id="manual-budget"
            type="number"
            step="0.01"
            {...register('budget', { valueAsNumber: true })}
            className={cn(inputCls, 'pl-8')}
            placeholder="50.00"
          />
        </div>
        {errors.budget && (
          <p className="mt-1 text-xs text-destructive">{errors.budget.message}</p>
        )}
      </div>

      {/* Meal sections */}
      <MealSection prefix="breakfast" label="Breakfast" icon="🌅" register={register} errors={errors} setValue={setValue} />
      <MealSection prefix="lunch" label="Lunch" icon="☀️" register={register} errors={errors} setValue={setValue} />
      <MealSection prefix="dinner" label="Dinner" icon="🌙" register={register} errors={errors} setValue={setValue} />

      {/* Grocery Items */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            {'🛒 Grocery Items'}
            {' '}
            <span className="badge-green text-xs">{groceryFields.length}</span>
          </h3>
          <button
            type="button"
            onClick={() =>
              appendGrocery({ name: '', quantity: '1', unit: 'pc', estimatedCost: 0, category: 'other' })
            }
            className={addBtnCls}
            id="add-grocery-item-btn"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        {groceryFields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No grocery items yet. Click &quot;Add Item&quot; to start.
          </p>
        )}

        <div className="space-y-3">
          {groceryFields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-start p-3 rounded-xl bg-surface border border-border"
            >
              <div className="col-span-4">
                <input {...register(`groceryItems.${i}.name`)} className={inputCls} placeholder="Item name" />
              </div>
              <div className="col-span-2">
                <input {...register(`groceryItems.${i}.quantity`)} className={inputCls} placeholder="Qty" />
              </div>
              <div className="col-span-2">
                <input {...register(`groceryItems.${i}.unit`)} className={inputCls} placeholder="Unit" />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`groceryItems.${i}.estimatedCost`, { valueAsNumber: true })}
                  className={inputCls}
                  placeholder="$"
                />
              </div>
              <div className="col-span-2 flex gap-1">
                <select
                  {...register(`groceryItems.${i}.category`)}
                  className={cn(inputCls, 'flex-1 text-xs px-2')}
                >
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeGrocery(i)}
                  className="flex-shrink-0 w-9 h-[42px] rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-all"
                  id={`remove-grocery-${i}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Substitutions */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            {'🔄 Substitutions'}
            {' '}
            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </h3>
          <button
            type="button"
            onClick={() =>
              appendSub({ original: '', substitute: '', reason: '', costSaving: 0, isAllergyFriendly: false })
            }
            className={addBtnCls}
            id="add-substitution-btn"
          >
            <Plus className="w-3.5 h-3.5" /> Add Swap
          </button>
        </div>

        <div className="space-y-3">
          {subFields.map((field, i) => (
            <div key={field.id} className="p-4 rounded-xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2">
                <input
                  {...register(`substitutions.${i}.original`)}
                  className={cn(inputCls, 'flex-1')}
                  placeholder="Replace (e.g. Milk)"
                />
                <ArrowRight className="w-5 h-5 text-brand-green flex-shrink-0" />
                <input
                  {...register(`substitutions.${i}.substitute`)}
                  className={cn(inputCls, 'flex-1')}
                  placeholder="With (e.g. Almond Milk)"
                />
                <button
                  type="button"
                  onClick={() => removeSub(i)}
                  className="flex-shrink-0 w-9 h-[42px] rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 flex items-center justify-center"
                  id={`remove-sub-${i}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    {...register(`substitutions.${i}.reason`)}
                    className={inputCls}
                    placeholder="Reason (e.g. dairy-free option)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`substitutions.${i}.costSaving`, { valueAsNumber: true })}
                    className={inputCls}
                    placeholder="$ saved"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  {...register(`substitutions.${i}.isAllergyFriendly`)}
                  className="w-4 h-4 rounded accent-green-500"
                />
                {'Allergy-friendly substitution'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={cn(
          'w-full py-4 rounded-xl font-bold text-base text-black',
          'bg-gradient-to-r from-brand-green-500 to-brand-accent',
          'hover:opacity-90 active:scale-[0.99] transition-all duration-200',
          'shadow-green-glow btn-glow flex items-center justify-center gap-3',
          'focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:ring-offset-2 focus:ring-offset-background'
        )}
        id="create-manual-plan-btn"
      >
        <ChefHat className="w-5 h-5" />
        Create My Plan
      </button>
    </form>
  )
}
