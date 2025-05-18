"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { DollarSign, TrendingUp } from "lucide-react"
import { globalWealthPercentiles } from "@/data/global-wealth-data"

interface IncomePercentileSliderProps {
  currency: string
}

export default function IncomePercentileSlider({ currency }: IncomePercentileSliderProps) {
  const [percentile, setPercentile] = useState(90) // Default to top 10%
  const [requiredIncome, setRequiredIncome] = useState(0)
  const currencySymbol = currency === "USD" ? "$" : currency

  // Calculate required income for the selected percentile
  useEffect(() => {
    // Get the closest percentile from our data
    const percentileKey = `p${100 - percentile}`

    // If we have the exact percentile, use it
    if (globalWealthPercentiles.income[percentileKey as keyof typeof globalWealthPercentiles.income]) {
      setRequiredIncome(
        globalWealthPercentiles.income[percentileKey as keyof typeof globalWealthPercentiles.income] as number,
      )
      return
    }

    // Otherwise, interpolate between the closest percentiles
    const percentiles = Object.keys(globalWealthPercentiles.income)
      .filter((key) => key.startsWith("p"))
      .map((key) => ({
        percentile: Number(key.substring(1)),
        value: globalWealthPercentiles.income[key as keyof typeof globalWealthPercentiles.income] as number,
      }))
      .sort((a, b) => a.percentile - b.percentile)

    const targetPercentile = 100 - percentile

    // Find the two closest percentiles
    let lowerIndex = 0
    for (let i = 0; i < percentiles.length; i++) {
      if (percentiles[i].percentile <= targetPercentile) {
        lowerIndex = i
      } else {
        break
      }
    }

    const upperIndex = Math.min(lowerIndex + 1, percentiles.length - 1)

    if (lowerIndex === upperIndex) {
      setRequiredIncome(percentiles[lowerIndex].value)
      return
    }

    // Linear interpolation
    const lowerPercentile = percentiles[lowerIndex].percentile
    const upperPercentile = percentiles[upperIndex].percentile
    const lowerValue = percentiles[lowerIndex].value
    const upperValue = percentiles[upperIndex].value

    const ratio = (targetPercentile - lowerPercentile) / (upperPercentile - lowerPercentile)
    const interpolatedValue = lowerValue + ratio * (upperValue - lowerValue)

    setRequiredIncome(Math.round(interpolatedValue))
  }, [percentile])

  const handleSliderChange = (value: number[]) => {
    setPercentile(value[0])
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
          Global Income Percentile Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Top 50%</span>
            <span>Top 0.1%</span>
          </div>
          <Slider
            value={[percentile]}
            min={50}
            max={99.9}
            step={0.1}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="text-center text-lg font-bold">Top {percentile.toFixed(1)}%</div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Required Annual Income</div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-emerald-500 mr-1" />
            <span className="text-2xl font-bold">
              {currencySymbol}
              {requiredIncome.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            To be in the top {percentile.toFixed(1)}% of global income earners
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Based on World Inequality Database and Credit Suisse Global Wealth Report
        </div>
      </CardContent>
    </Card>
  )
}
