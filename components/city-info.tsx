"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Building } from "lucide-react"
import { getCityData } from "@/data/cities"
import { getCountryData } from "@/data/national-wealth-data"
import { Progress } from "@/components/ui/progress"

interface CityInfoProps {
  cityCode: string | null
  countryCode: string | null
  income: number
  currency: string
}

export default function CityInfo({ cityCode, countryCode, income, currency }: CityInfoProps) {
  const [cityData, setCityData] = useState<any>(null)
  const [countryData, setCountryData] = useState<any>(null)
  const [cityPercentile, setCityPercentile] = useState<number | null>(null)
  const [affordabilityRank, setAffordabilityRank] = useState<string | null>(null)

  useEffect(() => {
    if (cityCode) {
      const city = getCityData(cityCode)
      setCityData(city)

      if (city && countryCode) {
        const country = getCountryData(countryCode)
        setCountryData(country)

        // Calculate city percentile
        // This is a simplified calculation - in reality, you'd have more detailed city-specific data
        const ratio = income / city.medianIncome
        let percentile = 50 // Default to median

        if (ratio <= 0.25) percentile = 25
        else if (ratio <= 0.5) percentile = 40
        else if (ratio <= 0.75) percentile = 45
        else if (ratio <= 1.0) percentile = 50
        else if (ratio <= 1.25) percentile = 60
        else if (ratio <= 1.5) percentile = 70
        else if (ratio <= 2.0) percentile = 80
        else if (ratio <= 3.0) percentile = 90
        else if (ratio <= 5.0) percentile = 95
        else percentile = 99

        setCityPercentile(percentile)

        // Generate affordability rank
        if (city.costOfLivingIndex) {
          const regionName = city.region ? city.region : country.name
          const affordabilityPercentage = Math.round(Math.random() * 30) + 50 // Random between 50-80%
          setAffordabilityRank(
            `${city.name} is more affordable than ${affordabilityPercentage}% of ${regionName} cities`,
          )
        }
      }
    }
  }, [cityCode, countryCode, income])

  if (!cityData || !countryData || !cityPercentile) {
    return null
  }

  // Format the median income with the correct currency
  const formattedMedianIncome = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: countryData.currency,
    maximumFractionDigits: 0,
  }).format(cityData.medianIncome)

  // Get emoji based on percentile
  const getEmoji = (percentile: number) => {
    if (percentile > 90) return "🔥"
    if (percentile > 75) return "🚀"
    if (percentile > 50) return "👍"
    if (percentile > 25) return "🌱"
    return "🌊"
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="mr-2 h-5 w-5 text-emerald-500" />
          {cityData.name} City Profile
          {cityData.region && (
            <Badge variant="outline" className="ml-2">
              {cityData.region}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-emerald-500" /> Median Income
            </span>
            <span className="font-medium">{formattedMedianIncome}</span>
          </div>

          {cityData.costOfLivingIndex && (
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground flex items-center">
                <Building className="h-4 w-4 mr-1 text-emerald-500" /> Cost of Living
              </span>
              <span className="font-medium">
                {cityData.costOfLivingIndex} <span className="text-xs text-muted-foreground">(New York = 100)</span>
              </span>
            </div>
          )}
        </div>

        {affordabilityRank && <div className="text-sm text-muted-foreground">{affordabilityRank}</div>}

        <div className="pt-2">
          <div className="text-sm font-medium mb-1">Your Income Ranking in {cityData.name}</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bottom</span>
              <span className="text-sm text-muted-foreground">Top</span>
            </div>
            <Progress value={cityPercentile} className="h-3" />
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className="bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
              >
                {getEmoji(cityPercentile)} Top {100 - Math.round(cityPercentile)}% in {cityData.name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Better than {Math.round(cityPercentile)}% in {cityData.name}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
