"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react"
import { WealthDistributionChart } from "@/components/charts"
import { getCityData } from "@/data/cities"
import AgeSpecificResults from "@/components/age-specific-results"
import { calculateAgeSpecificPercentile } from "@/lib/calculations"
import FunFactSection from "@/components/fun-fact-section"
import CityInfo from "@/components/city-info"
import { Button } from "@/components/ui/button"
import { countries } from "@/data/countries"

interface ResultsSectionProps {
  results: {
    percentiles: {
      local: number
      national: number
      global: number
    }
    funFact: {
      text: string
      icon: string
      comparison: string
    }
    input: {
      value: number
      type: "income" | "networth"
      currency: string
      country: string | null
      ageGroup: string | null
      city: string | null
    }
  }
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  const { percentiles, funFact, input } = results
  const [showMoreInsights, setShowMoreInsights] = useState(false)

  // Determine emoji based on percentile
  const getEmoji = (percentile: number) => {
    if (percentile > 90) return "🔥"
    if (percentile > 75) return "🚀"
    if (percentile > 50) return "👍"
    if (percentile > 25) return "🌱"
    return "🌊"
  }

  // Get city name if city code is provided
  const cityName = input.city ? getCityData(input.city)?.name || input.city : null

  // Get country name
  const countryName = input.country ? countries.find((c) => c.code === input.country)?.name || input.country : null

  // Format the input value with commas and currency symbol
  const currencySymbol = input.currency === "USD" ? "$" : input.currency
  const formattedValue = `${currencySymbol}${input.value.toLocaleString()}`

  // Generate smart summary sentence
  const generateSmartSummary = () => {
    const incomeOrNetWorth = input.type === "income" ? "annual income" : "net worth"
    const locationText = cityName
      ? `in ${cityName}${countryName ? `, ${countryName}` : ""}`
      : countryName
        ? `in ${countryName}`
        : ""

    return `With ${input.type === "income" ? "an" : "a"} ${incomeOrNetWorth} of ${formattedValue} ${locationText}, 
            you have more wealth than ${Math.round(percentiles.global)}% of people globally, 
            ${Math.round(percentiles.national)}% nationally${cityName ? `, and ${Math.round(percentiles.local)}% locally` : ""}.`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Wealth Ranking Results</h2>

      <Card className="bg-white dark:bg-slate-900 shadow-md">
        <CardContent className="p-6">
          <p className="text-lg text-muted-foreground mb-4">{generateSmartSummary()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5 text-emerald-500" />
              Local Ranking
              {cityName && (
                <Badge variant="outline" className="ml-2">
                  {cityName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bottom</span>
                <span className="text-sm text-muted-foreground">Top</span>
              </div>
              <Progress value={percentiles.local} className="h-3" />
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                >
                  {getEmoji(percentiles.local)} Top {100 - Math.round(percentiles.local)}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Better than {Math.round(percentiles.local)}% locally
                </span>
              </div>

              {/* Achievement Badge for Local Ranking */}
              {percentiles.local >= 95 && (
                <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🏙️</span>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Top 5% {cityName ? `in ${cityName}` : "Locally"}
                  </span>
                </div>
              )}
              {percentiles.local >= 90 && percentiles.local < 95 && (
                <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🏙️</span>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Top 10% {cityName ? `in ${cityName}` : "Locally"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-emerald-500" />
              National Ranking
              {input.country && (
                <Badge variant="outline" className="ml-2">
                  {countryName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bottom</span>
                <span className="text-sm text-muted-foreground">Top</span>
              </div>
              <Progress value={percentiles.national} className="h-3" />
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                >
                  {getEmoji(percentiles.national)} Top {100 - Math.round(percentiles.national)}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Better than {Math.round(percentiles.national)}% nationally
                </span>
              </div>

              {/* Achievement Badge for National Ranking */}
              {percentiles.national >= 95 && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🏆</span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Top 5% Nationally</span>
                </div>
              )}
              {percentiles.national >= 90 && percentiles.national < 95 && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🏆</span>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Top 10% Nationally</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Globe className="mr-2 h-5 w-5 text-emerald-500" />
              Global Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bottom</span>
                <span className="text-sm text-muted-foreground">Top</span>
              </div>
              <Progress value={percentiles.global} className="h-3" />
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                >
                  {getEmoji(percentiles.global)} Top {100 - Math.round(percentiles.global)}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Better than {Math.round(percentiles.global)}% globally
                </span>
              </div>

              {/* Achievement Badge for Global Ranking */}
              {percentiles.global >= 95 && (
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🌍</span>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Top 5% Globally</span>
                </div>
              )}
              {percentiles.global >= 90 && percentiles.global < 95 && (
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-md flex items-center">
                  <span className="text-lg mr-2">🌍</span>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Top 10% Globally</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Info Card - Show if city is selected */}
      {input.city && (
        <CityInfo cityCode={input.city} countryCode={input.country} income={input.value} currency={input.currency} />
      )}

      {input.ageGroup && (
        <AgeSpecificResults
          ageGroup={input.ageGroup}
          percentileInAgeGroup={
            calculateAgeSpecificPercentile(input.value, input.type, input.currency, input.country, input.ageGroup) || 50
          }
          type={input.type}
        />
      )}

      <FunFactSection input={input} funFact={funFact} />

      <Button
        variant="outline"
        onClick={() => setShowMoreInsights(!showMoreInsights)}
        className="flex items-center gap-2 mx-auto"
      >
        {showMoreInsights ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Show Less Insights
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show More Insights
          </>
        )}
      </Button>

      {showMoreInsights && (
        <div className="grid grid-cols-1 gap-6">
          <WealthDistributionChart
            type={input.type}
            userValue={input.value}
            userPercentile={percentiles.global}
            currency={input.currency}
          />
        </div>
      )}
    </div>
  )
}
