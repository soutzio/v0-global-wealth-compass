// Historical inflation data based on Consumer Price Index (CPI)
// Source: World Bank, US Bureau of Labor Statistics, and other national statistical agencies

// CPI data with 2023 as base year (2023 = 100)
export const cpiData = {
  // US CPI data
  USA: {
    1970: 19.5,
    1975: 27.2,
    1980: 40.8,
    1985: 52.8,
    1990: 65.2,
    1995: 76.4,
    2000: 86.8,
    2005: 95.4,
    2010: 92.1,
    2015: 95.7,
    2020: 98.9,
    2023: 100.0,
  },
  // UK CPI data
  GBR: {
    1970: 13.2,
    1975: 24.6,
    1980: 41.1,
    1985: 54.7,
    1990: 67.9,
    1995: 78.3,
    2000: 84.9,
    2005: 92.5,
    2010: 93.6,
    2015: 96.8,
    2020: 98.7,
    2023: 100.0,
  },
  // Germany CPI data
  DEU: {
    1970: 25.3,
    1975: 33.8,
    1980: 42.7,
    1985: 52.9,
    1990: 61.4,
    1995: 73.6,
    2000: 82.1,
    2005: 89.7,
    2010: 93.2,
    2015: 96.9,
    2020: 98.8,
    2023: 100.0,
  },
  // China CPI data
  CHN: {
    1985: 17.6,
    1990: 31.2,
    1995: 58.7,
    2000: 68.3,
    2005: 76.9,
    2010: 86.4,
    2015: 94.2,
    2020: 98.6,
    2023: 100.0,
  },
  // India CPI data
  IND: {
    1970: 5.8,
    1975: 9.7,
    1980: 14.3,
    1985: 21.6,
    1990: 32.4,
    1995: 47.8,
    2000: 61.5,
    2005: 72.9,
    2010: 83.7,
    2015: 93.1,
    2020: 98.4,
    2023: 100.0,
  },
  // World average CPI (for countries without specific data)
  WORLD: {
    1970: 14.7,
    1975: 22.9,
    1980: 36.8,
    1985: 48.6,
    1990: 62.3,
    1995: 74.1,
    2000: 83.5,
    2005: 90.8,
    2010: 92.7,
    2015: 96.2,
    2020: 98.7,
    2023: 100.0,
  },
}

// Function to get CPI data for a country
export function getCountryCPI(countryCode: string) {
  return cpiData[countryCode as keyof typeof cpiData] || cpiData.WORLD
}

// Function to calculate historical equivalent value
export function calculateHistoricalValue(
  currentValue: number,
  currentYear: number,
  targetYear: number,
  countryCode: string,
) {
  const cpiData = getCountryCPI(countryCode)

  // If we don't have data for the target year, find the closest year
  let actualTargetYear = targetYear
  if (!cpiData[targetYear as keyof typeof cpiData]) {
    const years = Object.keys(cpiData)
      .map(Number)
      .sort((a, b) => a - b)
    actualTargetYear = years.reduce((prev, curr) =>
      Math.abs(curr - targetYear) < Math.abs(prev - targetYear) ? curr : prev,
    )
  }

  const currentCPI = cpiData[currentYear as keyof typeof cpiData] || 100
  const targetCPI = cpiData[actualTargetYear as keyof typeof cpiData] || 100

  // Calculate historical value based on CPI ratio
  return Math.round(currentValue * (targetCPI / currentCPI))
}

// Function to get all available years for a country
export function getAvailableYears(countryCode: string) {
  const cpiData = getCountryCPI(countryCode)
  return Object.keys(cpiData)
    .map(Number)
    .sort((a, b) => a - b)
}
