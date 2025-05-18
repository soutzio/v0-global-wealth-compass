import { globalWealthPercentiles } from "@/data/global-wealth-data"
import { getCountryData, convertToUSD, nationalWealthData } from "@/data/national-wealth-data"
import { calculateHistoricalValue, getAvailableYears } from "@/data/inflation-data"
import { getEarningsComparison } from "@/data/high-profile-earnings"
import { getCityData, calculateCityPercentile } from "@/data/cities"

// Calculate percentile for a given value within a distribution
function calculatePercentileInDistribution(value: number, distribution: Record<string, number>): number {
  const percentiles = Object.keys(distribution)
    .filter((key) => key.startsWith("p"))
    .map((key) => ({
      percentile: Number.parseInt(key.substring(1), 10),
      value: distribution[key],
    }))
    .sort((a, b) => a.percentile - b.percentile)

  // If value is less than the lowest percentile
  if (value < percentiles[0].value) {
    return 0
  }

  // If value is greater than the highest percentile
  if (value > percentiles[percentiles.length - 1].value) {
    return 100
  }

  // Find the two percentiles that the value falls between
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (value >= percentiles[i].value && value <= percentiles[i + 1].value) {
      const lowerPercentile = percentiles[i]
      const upperPercentile = percentiles[i + 1]

      // Linear interpolation between the two percentiles
      const percentileRange = upperPercentile.percentile - lowerPercentile.percentile
      const valueRange = upperPercentile.value - lowerPercentile.value
      const valuePosition = value - lowerPercentile.value

      return lowerPercentile.percentile + (valuePosition / valueRange) * percentileRange
    }
  }

  return 50 // Default to median if something goes wrong
}

// Calculate percentiles for a given value
export function calculatePercentiles(
  value: number,
  type: "income" | "networth",
  currency: string,
  country: string | null,
  globalData: any,
  nationalData: any,
  city: string | null = null,
  ageGroup: string | null = null,
) {
  // Default to USA if no country is provided
  const countryCode = country || "USA"

  // Get country data
  const countryData = getCountryData(countryCode)

  // Convert value to USD for global comparison
  const valueInUSD = convertToUSD(value, countryCode)

  // Calculate global percentile
  const globalDistribution = globalWealthPercentiles[type]
  const globalPercentile = calculatePercentileInDistribution(valueInUSD, globalDistribution)

  // Calculate national percentile
  const nationalDistribution = countryData[type]
  const nationalPercentile = calculatePercentileInDistribution(
    value * (countryData.currency === currency ? 1 : convertToUSD(1, countryCode)),
    nationalDistribution,
  )

  // Calculate local percentile
  let localPercentile = 0

  if (city) {
    // If city data is available, use it for local percentile
    const cityData = getCityData(city)
    if (cityData) {
      // Use the more accurate city percentile calculation
      const cityPercentile = calculateCityPercentile(value, city, countryCode)
      if (cityPercentile !== null) {
        localPercentile = cityPercentile
      } else {
        // Fallback to national percentile with slight variation
        localPercentile = Math.min(100, Math.max(0, nationalPercentile * 0.9 + ((valueInUSD % 10) / 10) * 10))
      }
    } else {
      // Fallback to national percentile with slight variation
      localPercentile = Math.min(100, Math.max(0, nationalPercentile * 0.9 + ((valueInUSD % 10) / 10) * 10))
    }
  } else {
    // If no city is provided, use a function of the national percentile
    localPercentile = Math.min(100, Math.max(0, nationalPercentile * 0.9 + ((valueInUSD % 10) / 10) * 10))
  }

  return {
    local: Math.min(100, Math.max(0, localPercentile)),
    national: Math.min(100, Math.max(0, nationalPercentile)),
    global: Math.min(100, Math.max(0, globalPercentile)),
  }
}

// Add function to calculate age-specific percentile
export function calculateAgeSpecificPercentile(
  value: number,
  type: "income" | "networth",
  currency: string,
  country: string | null,
  ageGroup: string | null,
) {
  if (!ageGroup || !country) {
    return null
  }

  // Default to USA if no country is provided
  const countryCode = country || "USA"

  // Get country data
  const countryData = getCountryData(countryCode)

  // Convert value to local currency if needed
  const valueInLocalCurrency = value * (countryData.currency === currency ? 1 : convertToUSD(1, countryCode))

  // Get age-specific data
  const ageKey = type === "income" ? "incomeByAge" : "wealthByAge"
  const ageData = countryData[ageKey]

  if (!ageData || !ageData[ageGroup as keyof typeof ageData]) {
    return null
  }

  // Get median value for this age group
  const medianForAgeGroup = ageData[ageGroup as keyof typeof ageData]

  // Calculate percentile based on ratio to median
  // This is a simplified calculation - in a real app, you'd have more detailed age-specific distribution data
  const ratio = valueInLocalCurrency / medianForAgeGroup

  let percentile = 0

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

  return percentile
}

// Calculate historical equivalent values
export function calculateHistoricalEquivalent(value: number, currency: string, inflationData: any) {
  const currentYear = new Date().getFullYear()

  // Determine country code from currency
  let countryCode = "USA" // Default
  Object.entries(nationalWealthData).forEach(([code, data]) => {
    if (data.currency === currency) {
      countryCode = code
    }
  })

  // Get available years for the country
  const years = getAvailableYears(countryCode)

  // Calculate historical values
  const values = years.map((year) => calculateHistoricalValue(value, currentYear, year, countryCode))

  return {
    years,
    values,
    currentYear,
    currentValue: value,
    currency,
  }
}

// Update the getFunFact function to include specific names in comparisons
export function getFunFact(value: number, currency: string, highProfileEarnings: any) {
  // Determine country code from currency
  let countryCode = "USA" // Default
  Object.entries(nationalWealthData).forEach(([code, data]) => {
    if (data.currency === currency) {
      countryCode = code
    }
  })

  // Convert to USD for comparison
  const valueInUSD = convertToUSD(value, countryCode)

  // Get global percentile
  const globalIncomePercentile = calculatePercentileInDistribution(valueInUSD, globalWealthPercentiles.income)

  const globalWealthPercentile = calculatePercentileInDistribution(valueInUSD, globalWealthPercentiles.networth)

  // Get earnings comparisons
  const comparisons = getEarningsComparison(valueInUSD, "income")

  // Select a fun fact based on the value
  if (globalIncomePercentile > 99) {
    return {
      text: "you are in the top 1% of global earners.",
      icon: "award",
      comparison:
        comparisons.length > 0 ? comparisons[0].timeEquivalent : "You earn more than 99% of the world's population.",
    }
  } else if (globalIncomePercentile > 90) {
    return {
      text: "you are in the top 10% of global earners.",
      icon: "trending-up",
      comparison:
        comparisons.length > 0 ? comparisons[0].timeEquivalent : "You earn more than 90% of the world's population.",
    }
  } else if (globalIncomePercentile > 75) {
    return {
      text: "you earn more than 3/4 of the world's population.",
      icon: "bar-chart",
      comparison:
        comparisons.length > 0
          ? comparisons[0].timeEquivalent
          : `The global median income is $${globalWealthPercentiles.income.p50.toLocaleString()} USD.`,
    }
  } else if (globalIncomePercentile > 50) {
    return {
      text: "you earn more than half of the world's population.",
      icon: "globe",
      comparison:
        comparisons.length > 0
          ? comparisons[0].timeEquivalent
          : `The global median income is $${globalWealthPercentiles.income.p50.toLocaleString()} USD.`,
    }
  } else {
    return {
      text: "you are among the bottom 50% of global earners.",
      icon: "globe",
      comparison:
        comparisons.length > 0
          ? comparisons[0].timeEquivalent
          : `The global median income is $${globalWealthPercentiles.income.p50.toLocaleString()} USD.`,
    }
  }
}
