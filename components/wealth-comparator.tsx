"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InputSection from "@/components/input-section"
import ResultsSection from "@/components/results-section"
import ShareCard from "@/components/share-card"
import ResetButton from "@/components/reset-button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { calculatePercentiles, calculateHistoricalEquivalent, getFunFact } from "@/lib/calculations"
import { globalWealthPercentiles } from "@/data/global-wealth-data"
import { nationalWealthData } from "@/data/national-wealth-data"
import { cpiData } from "@/data/inflation-data"
import { highProfileEarnings } from "@/data/high-profile-earnings"

export default function WealthComparator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Add a key to force re-render of the component
  const [resetKey, setResetKey] = useState(0)

  // Form state
  const [activeTab, setActiveTab] = useState<"income" | "networth">("income")
  const [currency, setCurrency] = useState("USD")
  const [amount, setAmount] = useState<number | null>(null)
  const [country, setCountry] = useState<string | null>("USA")
  const [ageGroup, setAgeGroup] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)

  // Application state
  const [results, setResults] = useState<any>(null)
  // Edit mode removed as requested
  const [hasCalculated, setHasCalculated] = useState(false)
  const isEditMode = false // Define isEditMode

  // Load data from URL if available
  useEffect(() => {
    if (isEditMode) return // Don't process URL params in edit mode

    const tabParam = searchParams.get("tab") as "income" | "networth"
    const amountParam = searchParams.get("amount")
    const currencyParam = searchParams.get("currency")
    const countryParam = searchParams.get("country")
    const ageParam = searchParams.get("age")
    const cityParam = searchParams.get("city")

    if (tabParam) setActiveTab(tabParam)
    if (currencyParam) setCurrency(currencyParam)
    if (countryParam) setCountry(countryParam)
    if (ageParam) setAgeGroup(ageParam)
    if (cityParam) setCity(cityParam)

    if (amountParam) {
      const parsedAmount = Number.parseInt(amountParam, 10)
      if (!isNaN(parsedAmount)) {
        setAmount(parsedAmount)

        // Calculate results immediately
        setTimeout(() => {
          calculateResults(
            parsedAmount,
            tabParam || "income",
            currencyParam || "USD",
            countryParam,
            ageParam,
            cityParam,
          )
        }, 0)
      }
    }
  }, [searchParams, resetKey]) // Remove isEditMode from dependencies to avoid loops

  const calculateResults = (
    value: number,
    type: "income" | "networth",
    selectedCurrency: string,
    selectedCountry: string | null,
    selectedAge: string | null,
    selectedCity: string | null,
  ) => {
    // Calculate percentiles based on real data
    const percentiles = calculatePercentiles(
      value,
      type,
      selectedCurrency,
      selectedCountry,
      globalWealthPercentiles,
      nationalWealthData,
      selectedCity,
      selectedAge,
    )

    // Get historical equivalent
    const historical = calculateHistoricalEquivalent(value, selectedCurrency, cpiData)

    // Get fun fact
    const funFact = getFunFact(value, selectedCurrency, highProfileEarnings)

    setResults({
      percentiles,
      historical,
      funFact,
      input: {
        value,
        type,
        currency: selectedCurrency,
        country: selectedCountry,
        ageGroup: selectedAge,
        city: selectedCity,
      },
    })

    setHasCalculated(true)

    // Update URL for sharing - use requestAnimationFrame to avoid immediate state updates
    requestAnimationFrame(() => {
      const params = new URLSearchParams()
      params.set("tab", type)
      params.set("amount", value.toString())
      params.set("currency", selectedCurrency)
      if (selectedCountry) params.set("country", selectedCountry)
      if (selectedAge) params.set("age", selectedAge)
      if (selectedCity) params.set("city", selectedCity)

      router.push(`/?${params.toString()}`, { scroll: false })
    })
  }

  const handleSubmit = (
    value: number,
    type: "income" | "networth",
    selectedCurrency: string,
    selectedCountry: string | null,
    selectedAge: string | null,
    selectedCity: string | null,
  ) => {
    // Only proceed if we have a valid value
    if (value && !isNaN(value)) {
      calculateResults(value, type, selectedCurrency, selectedCountry, selectedAge, selectedCity)
    }
  }

  // Update the handleReset function to completely reset the form and state
  const handleReset = () => {
    // Clear URL parameters
    router.push("/", { scroll: false })

    // Reset all state values
    setHasCalculated(false)
    setResults(null)
    setActiveTab("income")
    setCurrency("USD")
    setAmount(null)
    setCountry("USA")
    setAgeGroup(null)
    setCity(null)

    // Force a complete re-render by changing the key
    setResetKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col gap-8" key={resetKey}>
      <Header />

      {/* Always show the form if we're in edit mode or haven't calculated yet */}
      {!hasCalculated && (
        <Card className="w-full bg-white dark:bg-slate-900 shadow-lg">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "income" | "networth")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="income">Annual Income</TabsTrigger>
                <TabsTrigger value="networth">Net Worth</TabsTrigger>
              </TabsList>

              <TabsContent value="income" className="mt-0">
                <InputSection
                  type="income"
                  currency={currency}
                  setCurrency={setCurrency}
                  amount={amount}
                  setAmount={setAmount}
                  country={country}
                  setCountry={setCountry}
                  ageGroup={ageGroup}
                  setAgeGroup={setAgeGroup}
                  city={city}
                  setCity={setCity}
                  onSubmit={handleSubmit}
                />
              </TabsContent>

              <TabsContent value="networth" className="mt-0">
                <InputSection
                  type="networth"
                  currency={currency}
                  setCurrency={setCurrency}
                  amount={amount}
                  setAmount={setAmount}
                  country={country}
                  setCountry={setCountry}
                  ageGroup={ageGroup}
                  setAgeGroup={setAgeGroup}
                  city={city}
                  setCity={setCity}
                  onSubmit={handleSubmit}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Show results if we have calculated them */}
      {hasCalculated && results && (
        <>
          <ResultsSection results={results} />
          <ShareCard results={results} />
          <ResetButton onReset={handleReset} />
        </>
      )}

      <Footer />
    </div>
  )
}
