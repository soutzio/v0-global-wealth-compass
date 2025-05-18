"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, RefreshCw } from "lucide-react"
import { getEarningsComparison } from "@/data/high-profile-earnings"
import { Button } from "@/components/ui/button"

interface FunFactSectionProps {
  input: {
    value: number
    type: "income" | "networth"
    currency: string
    country: string | null
  }
  funFact: {
    text: string
    icon: string
    comparison: string
  }
}

export default function FunFactSection({ input, funFact }: FunFactSectionProps) {
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0)
  const currencySymbol = input.currency === "USD" ? "$" : input.currency

  // Format the input value with commas and currency symbol
  const formattedValue = `${currencySymbol}${input.value.toLocaleString()}`

  // Get all comparisons
  const allComparisons = getEarningsComparison(input.value, input.type)

  // Get current comparison
  const currentComparison = allComparisons[currentComparisonIndex] || null

  const handleNextComparison = () => {
    setCurrentComparisonIndex((prev) => (prev + 1) % allComparisons.length)
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
            <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Fun Fact</h3>
            <p className="text-muted-foreground">
              With your {input.type === "income" ? "annual income" : "net worth"} of {formattedValue}, {funFact.text}
            </p>

            {currentComparison && currentComparison.timeEquivalent && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                <p className="font-medium text-amber-800 dark:text-amber-200">{currentComparison.timeEquivalent}</p>
              </div>
            )}

            {allComparisons.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextComparison}
                className="mt-3 text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/50"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Show another comparison ({currentComparisonIndex + 1}/{allComparisons.length})
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
