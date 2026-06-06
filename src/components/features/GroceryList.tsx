'use client'

import { useState, useCallback } from 'react'
import { Check, Copy, CheckCheck, ShoppingCart } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useMealPlanStore } from '@/store/meal-plan-store'
import type { GroceryList as GroceryListType, GroceryItem } from '@/types/meal-plan'

interface GroceryListProps {
  groceryList: GroceryListType
  className?: string
}

interface GroceryItemRowProps {
  item: GroceryItem
  itemKey: string
}

function GroceryItemRow({ item, itemKey }: GroceryItemRowProps) {
  const { checkedItems, toggleGroceryItem } = useMealPlanStore()
  const isChecked = checkedItems[itemKey] ?? false

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
        'hover:bg-surface-2 cursor-pointer',
        isChecked && 'opacity-50'
      )}
      onClick={() => toggleGroceryItem(itemKey)}
      id={`grocery-item-${itemKey}`}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
          isChecked
            ? 'bg-brand-green border-brand-green'
            : 'border-border hover:border-brand-green/50'
        )}
      >
        {isChecked && <Check className="w-3 h-3 text-black font-bold" strokeWidth={3} />}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-sm font-medium text-foreground',
            isChecked && 'line-through text-muted-foreground'
          )}
        >
          {item.name}
        </span>
        <span className="text-xs text-muted-foreground ml-2">
          {item.quantity} {item.unit}
        </span>
      </div>

      {/* Cost */}
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {formatCurrency(item.estimatedCost)}
      </span>
    </div>
  )
}

export function GroceryList({ groceryList, className }: GroceryListProps) {
  const [copied, setCopied] = useState(false)

  const allItems = Object.values(groceryList).flatMap((cat) => cat.items)
  const totalCost = allItems.reduce((sum, item) => sum + item.estimatedCost, 0)

  const copyToClipboard = useCallback(async () => {
    const lines: string[] = ['🛒 GROCERY LIST\n']

    for (const [, category] of Object.entries(groceryList)) {
      if (category.items.length === 0) continue
      lines.push(`${category.icon} ${category.name}`)
      for (const item of category.items) {
        lines.push(`  • ${item.name} — ${item.quantity} ${item.unit} (~${formatCurrency(item.estimatedCost)})`)
      }
      lines.push('')
    }
    lines.push(`💰 Total estimated: ${formatCurrency(totalCost)}`)

    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [groceryList, totalCost])

  const categories = Object.entries(groceryList).filter(([, cat]) => cat.items.length > 0)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with copy button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-brand-green" />
          <h3 className="text-lg font-semibold text-foreground">Grocery List</h3>
          <span className="badge-green text-xs">{allItems.length} items</span>
        </div>

        <button
          onClick={copyToClipboard}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
            'border border-border bg-surface hover:bg-surface-2',
            copied
              ? 'text-brand-green border-brand-green/40'
              : 'text-muted-foreground hover:text-foreground hover:border-brand-green/30'
          )}
          id="copy-grocery-list-btn"
        >
          {copied ? (
            <>
              <CheckCheck className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy List
            </>
          )}
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(([key, category]) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-card overflow-hidden"
            id={`grocery-category-${key}`}
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-border">
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm font-semibold text-foreground">{category.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {category.items.length} items
              </span>
            </div>

            {/* Items */}
            <div className="p-2">
              {category.items.map((item, i) => (
                <GroceryItemRow
                  key={i}
                  item={item}
                  itemKey={`${key}-${i}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-brand-green/20 bg-brand-green/5">
        <span className="text-sm font-medium text-foreground">Estimated Total</span>
        <span className="text-lg font-bold text-brand-green">{formatCurrency(totalCost)}</span>
      </div>
    </div>
  )
}
