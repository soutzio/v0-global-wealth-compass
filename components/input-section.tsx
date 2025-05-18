"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countries } from "@/data/countries"
import { currencies } from "@/data/currencies"
import { ageGroups } from "@/data/age-groups"
import { cities } from "@/data/cities"

interface InputSectionProps {
  type: "income" | "networth"
  currency: string
  setCurrency: (currency: string) => void
  amount: number | null
  setAmount: (amount: number | null) => void
  country: string | null
  setCountry: (country: string | null) => void
  ageGroup: string | null
  setAgeGroup: (ageGroup: string | null) => void
  city: string | null
  setCity: (city: string | null) => void
  onSubmit: (
    value: number,
    type: "income" | "networth",
    currency: string,
    country: string | null,
    ageGroup: string | null,
    city: string | null,
  ) => void
}

export default function InputSection({
  type,
  currency,
  setCurrency,
  amount,
  setAmount,
  country,
  setCountry,
  ageGroup,
  setAgeGroup,
  city,
  setCity,
  onSubmit,
}: InputSectionProps) {
  const [error, setError] = useState<string | null>(null)
  const [filteredCities, setFilteredCities] = useState<{ value: string; label: string }[]>([])

  // Initialize filtered cities based on country
  useEffect(() => {
    if (country) {
      const countryCities = cities.filter((city) => city.countryCode === country)
      setFilteredCities(
        countryCities.map((city) => ({
          value: city.code,
          label: city.name,
        })),
      )
    } else {
      setFilteredCities([])
    }
  }, [country])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setAmount(null)
      setError(null)
      return
    }

    const numValue = Number(value.replace(/,/g, ""))
    if (isNaN(numValue)) {
      setError("Please enter a valid number")
      return
    }

    setAmount(numValue)
    setError(null)
  }

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry || null)
    setCity(null) // Reset city when country changes

    // Filter cities based on selected country
    if (selectedCountry) {
      const countryCities = cities.filter((city) => city.countryCode === selectedCountry)
      setFilteredCities(
        countryCities.map((city) => ({
          value: city.code,
          label: city.name,
        })),
      )
    } else {
      setFilteredCities([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount) {
      setError("Please enter an amount")
      return
    }

    onSubmit(amount, type, currency, country, ageGroup, city)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Label htmlFor="amount">{type === "income" ? "Annual Income" : "Net Worth"}</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {currencies.find((c) => c.code === currency)?.symbol || "$"}
                </span>
              </div>
              <Input
                id="amount"
                type="text"
                placeholder="0"
                className="pl-8"
                value={amount !== null ? amount.toLocaleString() : ""}
                onChange={handleAmountChange}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country (Optional)</Label>
            <Select value={country || ""} onValueChange={handleCountryChange}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age-group">Age Group (Optional)</Label>
            <Select value={ageGroup || ""} onValueChange={(value) => setAgeGroup(value || null)}>
              <SelectTrigger id="age-group">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {country && (
          <div>
            <Label htmlFor="city">City (Optional)</Label>
            <Select value={city || ""} onValueChange={(value) => setCity(value || null)}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredCities.length === 0 && country && (
              <p className="text-sm text-muted-foreground mt-1">No cities found. Using country-level data instead.</p>
            )}
          </div>
        )}
      </div>

      <Button id="calculate-button" type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        Calculate My Wealth Ranking
      </Button>
    </form>
  )
}
