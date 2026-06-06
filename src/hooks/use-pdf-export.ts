'use client'

import { useCallback } from 'react'
import type { CookingPlan } from '@/types/meal-plan'

export function usePDFExport() {
  const exportToPDF = useCallback(async (plan: CookingPlan) => {
    // Dynamic import for code splitting
    const { default: jsPDF } = await import('jspdf')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let y = margin

    // Header
    doc.setFillColor(10, 10, 10)
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(74, 222, 128)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('PromptWars Cooking Plan', margin, 20)

    doc.setTextColor(200, 200, 200)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date(plan.generatedAt).toLocaleString()}`, margin, 32)

    y = 55

    // Helper: section header
    const sectionHeader = (title: string, emoji: string) => {
      doc.setFillColor(20, 20, 20)
      doc.roundedRect(margin - 5, y - 5, pageWidth - margin * 2 + 10, 12, 2, 2, 'F')
      doc.setTextColor(74, 222, 128)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text(`${emoji}  ${title}`, margin, y + 4)
      y += 16
    }

    // Helper: write meal
    const writeMeal = (label: string, meal: CookingPlan['mealPlan']['breakfast']) => {
      sectionHeader(`${label}: ${meal.title}`, meal.emoji)

      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')

      const descLines = doc.splitTextToSize(meal.description, pageWidth - margin * 2)
      doc.text(descLines, margin, y)
      y += descLines.length * 5 + 3

      doc.setTextColor(74, 222, 128)
      doc.setFontSize(8)
      doc.text(
        `⏱ ${meal.cookingTime} min  |  💰 $${meal.estimatedCost.toFixed(2)}  |  🔥 ${meal.calories} cal`,
        margin,
        y
      )
      y += 10
    }

    writeMeal('Breakfast', plan.mealPlan.breakfast)
    writeMeal('Lunch', plan.mealPlan.lunch)
    writeMeal('Dinner', plan.mealPlan.dinner)

    // Budget
    if (y > 240) { doc.addPage(); y = margin }
    sectionHeader('Budget Analysis', '💰')
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    const b = plan.budgetAnalysis
    doc.text(`Total Cost: $${b.estimatedTotalCost.toFixed(2)}`, margin, y); y += 6
    doc.text(`Your Budget: $${b.userBudget.toFixed(2)}`, margin, y); y += 6
    doc.text(
      `Remaining: $${b.remainingBudget.toFixed(2)} ${b.isBudgetExceeded ? '(EXCEEDED)' : '✓'}`,
      margin,
      y
    ); y += 12

    // Save
    doc.save(`cooking-plan-${new Date().toISOString().slice(0, 10)}.pdf`)
  }, [])

  return { exportToPDF }
}
