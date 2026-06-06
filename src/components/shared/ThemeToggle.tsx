'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9 rounded-lg bg-muted animate-pulse', className)} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative w-9 h-9 rounded-lg flex items-center justify-center',
        'border border-border bg-surface hover:bg-surface-2',
        'transition-all duration-200 hover:border-brand-green/40',
        'focus:outline-none focus:ring-2 focus:ring-brand-green/50',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="theme-toggle-btn"
    >
      <div className="relative w-4 h-4">
        <Sun
          className={cn(
            'absolute inset-0 w-4 h-4 text-brand-green transition-all duration-300',
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 w-4 h-4 text-brand-green transition-all duration-300',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          )}
        />
      </div>
    </button>
  )
}
