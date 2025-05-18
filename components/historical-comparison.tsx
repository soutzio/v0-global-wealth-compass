"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Clock, DollarSign } from "lucide-react"
import { HistoricalTrendChart } from "@/components/charts"

interface HistoricalComparisonProps {
  historicalData: {
    years: number[]
    values: number[]
    currentYear: number
    currentValue: number
    currency: string
  }
}

export default function HistoricalComparison({ historicalData }: HistoricalComparisonProps) {
  const [selectedYearIndex, setSelectedYearIndex] = useState(0)

  const handleSliderChange = (value: number[]) => {
    setSelectedYearIndex(value[0])
  }

  const selectedYear = historicalData.years[selectedYearIndex]
  const selectedValue = historicalData.values[selectedYearIndex]
  const currencySymbol = historicalData.currency === "USD" ? "$" : historicalData.currency

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Clock className="mr-2 h-5 w-5 text-emerald-500" />
            Compare Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{historicalData.years[0]}</span>
              <span>{historicalData.years[historicalData.years.length - 1]}</span>
            </div>
            <Slider
              value={[selectedYearIndex]}
              max={historicalData.years.length - 1}
              step={1}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">In {selectedYear}</div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-emerald-500 mr-1" />
                <span className="text-2xl font-bold">
                  {currencySymbol}
                  {selectedValue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Would have the same purchasing power as your current amount
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Today ({historicalData.currentYear})</div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-emerald-500 mr-1" />
                <span className="text-2xl font-bold">
                  {currencySymbol}
                  {historicalData.currentValue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">Your current amount</div>
            </div>
          </div>

          {/* D3.js Historical Trend Chart */}
          <HistoricalTrendChart historicalData={historicalData} />
        </CardContent>
      </Card>
    </div>
  )
}
