'use client'

import { useState } from 'react'
import { Sparkles, Star, Bot, PenLine } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { MealPlanForm } from '@/components/forms/MealPlanForm'
import { ManualPlanForm } from '@/components/forms/ManualPlanForm'
import { AIThinkingLoader } from '@/components/features/AIThinkingLoader'
import { MealPlanResult } from '@/components/features/MealPlanResult'
import { useMealPlan } from '@/hooks/use-meal-plan'
import { useMealPlanStore } from '@/store/meal-plan-store'
import { cn } from '@/lib/utils'
import type { UserInputSchemaType } from '@/validators/meal-plan'
import type { CookingPlan } from '@/types/meal-plan'

type Mode = 'ai' | 'manual'

export default function HomePage() {
  const { generate, isGenerating } = useMealPlan()
  const { currentPlan, progress, clearPlan, setPlan, savePlan } = useMealPlanStore()
  const [showForm, setShowForm] = useState(!currentPlan)
  const [mode, setMode] = useState<Mode>('ai')

  /* ── AI mode submit ─────────────────────────── */
  const handleAISubmit = async (data: UserInputSchemaType) => {
    setShowForm(false)
    await generate(data)
  }

  /* ── Manual mode submit ─────────────────────── */
  const handleManualComplete = (plan: CookingPlan) => {
    setPlan(plan)
    savePlan(plan)
    setShowForm(false)
  }

  /* ── Regenerate / reset ─────────────────────── */
  const handleRegenerate = () => {
    clearPlan()
    setShowForm(true)
  }

  const isLoading = isGenerating && progress.status !== 'idle'
  const hasResult = !isGenerating && currentPlan && progress.status === 'complete'
  const hasError = !isGenerating && progress.status === 'error'

  return (
    <div className="min-h-screen flex flex-col">

      {/* ─── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="section-container flex items-center justify-between h-14">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-green/10 border border-brand-green/25 text-brand-green">
              <Star className="w-3 h-3" />
              PromptWars Warm-up
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-border bg-surface hover:bg-surface-2 hover:border-brand-green/40 transition-all duration-200"
              aria-label="GitHub"
            >
              {/* GitHub SVG mark — avoids deprecated lucide icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-muted-foreground" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── Hero (only when form visible) ──────── */}
      {showForm && (
        <section className="relative overflow-hidden py-12 sm:py-20">
          {/* Glow blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] opacity-20 dark:opacity-25 rounded-full blur-3xl bg-gradient-to-r from-brand-green-500 to-brand-accent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[180px] opacity-10 rounded-full blur-3xl bg-brand-green-600 pointer-events-none" />

          <div className="section-container relative text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/5 text-sm text-brand-green font-medium">
              <Sparkles className="w-4 h-4 animate-glow-pulse" />
              AI-Powered Cooking Planner
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="text-foreground">Your Personal </span>
              <span className="text-gradient-green">AI Chef</span>
              <br />
              <span className="text-foreground">for Every Day</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Generate a full cooking plan with AI — or build one yourself manually.
              Get meals, grocery lists, substitutions &amp; budget analysis.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {['🍳 3 Meals', '🛒 Grocery List', '🔄 Substitutions', '💰 Budget', '📄 PDF Export'].map(
                (f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-muted-foreground"
                  >
                    {f}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Main Content ────────────────────────── */}
      <main className="flex-1 section-container pb-16">

        {/* Form area */}
        {showForm && (
          <div className="max-w-2xl mx-auto space-y-4">

            {/* ── MODE SWITCHER ─────────────────── */}
            <div className="flex p-1 rounded-2xl bg-surface border border-border gap-1" role="tablist">
              <button
                role="tab"
                aria-selected={mode === 'ai'}
                onClick={() => setMode('ai')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  mode === 'ai'
                    ? 'bg-gradient-to-r from-brand-green-500 to-brand-accent text-black shadow-green-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                )}
                id="mode-tab-ai"
              >
                <Bot className="w-4 h-4" />
                AI Generate
                <span
                  className={cn(
                    'hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold',
                    mode === 'ai' ? 'bg-black/20' : 'bg-muted text-muted-foreground'
                  )}
                >
                  RECOMMENDED
                </span>
              </button>

              <button
                role="tab"
                aria-selected={mode === 'manual'}
                onClick={() => setMode('manual')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  mode === 'manual'
                    ? 'bg-gradient-to-r from-brand-green-500 to-brand-accent text-black shadow-green-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                )}
                id="mode-tab-manual"
              >
                <PenLine className="w-4 h-4" />
                Manual Plan
              </button>
            </div>

            {/* Mode hint */}
            <p className="text-xs text-center text-muted-foreground">
              {mode === 'ai'
                ? '🤖 AI will generate your complete cooking plan from your preferences'
                : '✏️ Enter your own meals, grocery items and budget manually'}
            </p>

            {/* ── FORM CARD ─────────────────────── */}
            <div className="rounded-2xl border border-border bg-card shadow-card-dark p-6 sm:p-8 glass">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green-500 to-brand-accent flex items-center justify-center shadow-green-glow">
                  {mode === 'ai' ? <Bot className="w-5 h-5 text-black" /> : <PenLine className="w-5 h-5 text-black" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {mode === 'ai' ? 'Tell AI About Your Day' : 'Build Your Plan'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'ai'
                      ? 'Fill in your preferences and let AI do the cooking'
                      : 'Enter each meal, groceries and substitutions yourself'}
                  </p>
                </div>
              </div>

              {mode === 'ai' ? (
                <MealPlanForm onSubmit={handleAISubmit} isGenerating={isGenerating} />
              ) : (
                <ManualPlanForm onComplete={handleManualComplete} />
              )}
            </div>
          </div>
        )}

        {/* Loading (AI only) */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-brand-green/20 bg-card shadow-card-dark glass">
              <AIThinkingLoader
                message={progress.message}
                step={progress.step}
                totalSteps={progress.totalSteps}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {hasError && (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
              <span className="text-5xl">⚠️</span>
              <h3 className="text-xl font-bold text-foreground">Generation Failed</h3>
              <p className="text-muted-foreground text-sm">{progress.message}</p>
              <button
                onClick={handleRegenerate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green-500 to-brand-accent text-black font-semibold hover:opacity-90 transition-opacity btn-glow"
                id="retry-btn"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {hasResult && (
          <MealPlanResult plan={currentPlan} onRegenerate={handleRegenerate} />
        )}

        {/* Manual plan direct result (no loading step) */}
        {!isGenerating && currentPlan && progress.status === 'idle' && !showForm && (
          <MealPlanResult plan={currentPlan} onRegenerate={handleRegenerate} />
        )}
      </main>

      {/* ─── Footer ──────────────────────────────── */}
      <footer className="border-t border-border bg-background py-6">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo showText={false} />
          <p className="text-xs text-muted-foreground text-center">
            Built for{' '}
            <span className="text-brand-green font-semibold">PromptWars</span> Warm-up Challenge
            {' '}· AI Cooking To-Do List
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>AI by</span>
            <span className="text-brand-green font-medium">OpenAI GPT-4o</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
