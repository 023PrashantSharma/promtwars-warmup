'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, ChefHat, DollarSign, Clock, Leaf, Users, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserInputSchema, type UserInputSchemaType } from '@/validators/meal-plan'

interface MealPlanFormProps {
  onSubmit: (data: UserInputSchemaType) => void
  isGenerating: boolean
}

const DIETARY_OPTIONS = [
  { value: 'none', label: 'No Restrictions', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { value: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🥩' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'kosher', label: 'Kosher', emoji: '✡️' },
] as const

const COOKING_TIME_PRESETS = [
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
]

export function MealPlanForm({ onSubmit, isGenerating }: MealPlanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserInputSchemaType>({
    resolver: zodResolver(UserInputSchema),
    defaultValues: {
      budget: 50,
      dietaryPreference: 'none',
      availableIngredients: '',
      cookingTime: 60,
      servings: 2,
      cuisinePreference: 'any',
    },
  })

  const watchedDiet = watch('dietaryPreference')
  const watchedTime = watch('cookingTime')

  const inputClass = cn(
    'w-full px-4 py-3 rounded-xl text-sm text-foreground',
    'bg-surface border border-border',
    'placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/60',
    'transition-all duration-200'
  )

  const labelClass = 'block text-sm font-semibold text-foreground mb-2 flex items-center gap-2'
  const errorClass = 'mt-1.5 text-xs text-destructive'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="meal-plan-form" noValidate>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className={labelClass}>
          <DollarSign className="w-4 h-4 text-brand-green" />
          Daily Budget (USD)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
          <input
            id="budget"
            type="number"
            step="0.01"
            min="1"
            max="10000"
            {...register('budget', { valueAsNumber: true })}
            className={cn(inputClass, 'pl-8')}
            placeholder="50.00"
          />
        </div>
        {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
      </div>

      {/* Dietary Preference */}
      <div>
        <label className={labelClass}>
          <Leaf className="w-4 h-4 text-brand-green" />
          Dietary Preference
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue('dietaryPreference', opt.value, { shouldValidate: true })}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium',
                'border transition-all duration-200',
                watchedDiet === opt.value
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : 'border-border bg-surface hover:bg-surface-2 text-muted-foreground hover:text-foreground'
              )}
              id={`diet-${opt.value}`}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-center leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>
        {errors.dietaryPreference && (
          <p className={errorClass}>{errors.dietaryPreference.message}</p>
        )}
      </div>

      {/* Available Ingredients */}
      <div>
        <label htmlFor="availableIngredients" className={labelClass}>
          <ChefHat className="w-4 h-4 text-brand-green" />
          Available Ingredients
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            What&apos;s in your kitchen?
          </span>
        </label>
        <textarea
          id="availableIngredients"
          {...register('availableIngredients')}
          rows={3}
          className={cn(inputClass, 'resize-none')}
          placeholder="e.g., chicken breast, garlic, onions, olive oil, pasta, canned tomatoes..."
        />
        {errors.availableIngredients && (
          <p className={errorClass}>{errors.availableIngredients.message}</p>
        )}
      </div>

      {/* Cooking Time */}
      <div>
        <label className={labelClass}>
          <Clock className="w-4 h-4 text-brand-green" />
          Available Cooking Time Today
        </label>
        <div className="flex gap-2 mb-3">
          {COOKING_TIME_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setValue('cookingTime', preset.value, { shouldValidate: true })}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-medium border transition-all duration-200',
                watchedTime === preset.value
                  ? 'border-brand-green bg-brand-green/10 text-brand-green'
                  : 'border-border bg-surface hover:bg-surface-2 text-muted-foreground'
              )}
              id={`time-preset-${preset.value}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <input
          id="cookingTime"
          type="number"
          min="10"
          max="480"
          {...register('cookingTime', { valueAsNumber: true })}
          className={inputClass}
          placeholder="Custom minutes..."
        />
        {errors.cookingTime && <p className={errorClass}>{errors.cookingTime.message}</p>}
      </div>

      {/* Servings & Cuisine */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="servings" className={labelClass}>
            <Users className="w-4 h-4 text-brand-green" />
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min="1"
            max="20"
            {...register('servings', { valueAsNumber: true })}
            className={inputClass}
            placeholder="2"
          />
          {errors.servings && <p className={errorClass}>{errors.servings.message}</p>}
        </div>

        <div>
          <label htmlFor="cuisinePreference" className={labelClass}>
            <Globe className="w-4 h-4 text-brand-green" />
            Cuisine
          </label>
          <input
            id="cuisinePreference"
            type="text"
            {...register('cuisinePreference')}
            className={inputClass}
            placeholder="e.g., Italian, Asian, Any"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isGenerating}
        className={cn(
          'w-full py-4 rounded-xl font-bold text-base text-black',
          'bg-gradient-to-r from-brand-green-500 to-brand-accent',
          'hover:opacity-90 active:scale-[0.99] transition-all duration-200',
          'shadow-green-glow btn-glow',
          'flex items-center justify-center gap-3',
          'focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:ring-offset-2 focus:ring-offset-background',
          isGenerating && 'opacity-60 cursor-not-allowed'
        )}
        id="generate-plan-btn"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            Generating your plan...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate My Cooking Plan
          </>
        )}
      </button>
    </form>
  )
}
