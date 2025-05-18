// National wealth and income data by country
// Based on World Bank, OECD, and national statistical agencies

export const nationalWealthData = {
  // Country codes follow ISO 3166-1 alpha-3 format
  USA: {
    name: "United States",
    currency: "USD",
    exchangeRate: 1, // Base currency
    // Net worth percentiles in USD
    networth: {
      p10: 15400,
      p20: 52600,
      p30: 121800,
      p40: 188200,
      p50: 253700, // Median
      p60: 347100,
      p70: 522700,
      p80: 863800,
      p90: 1589300,
      p95: 2833200,
      p99: 11099100,
    },
    // Annual income percentiles in USD
    income: {
      p10: 15300,
      p20: 28900,
      p30: 42600,
      p40: 56800,
      p50: 71300, // Median
      p60: 87900,
      p70: 107800,
      p80: 133600,
      p90: 173700,
      p95: 246200,
      p99: 531300,
    },
    // Average wealth by age group in USD
    wealthByAge: {
      "18-24": 76800,
      "25-34": 142900,
      "35-44": 436200,
      "45-54": 833200,
      "55-64": 1175900,
      "65+": 1217700,
    },
    // Average income by age group in USD
    incomeByAge: {
      "18-24": 38500,
      "25-34": 61300,
      "35-44": 85800,
      "45-54": 90500,
      "55-64": 85300,
      "65+": 55000,
    },
  },
  GBR: {
    name: "United Kingdom",
    currency: "GBP",
    exchangeRate: 0.77, // GBP to USD
    // Net worth percentiles in GBP
    networth: {
      p10: 5300,
      p20: 20800,
      p30: 61700,
      p40: 117300,
      p50: 172100, // Median
      p60: 241900,
      p70: 340800,
      p80: 489600,
      p90: 831500,
      p95: 1432700,
      p99: 3614000,
    },
    // Annual income percentiles in GBP
    income: {
      p10: 9500,
      p20: 15600,
      p30: 21800,
      p40: 28100,
      p50: 34500, // Median
      p60: 41900,
      p70: 51300,
      p80: 64800,
      p90: 88700,
      p95: 121600,
      p99: 251800,
    },
    // Average wealth by age group in GBP
    wealthByAge: {
      "18-24": 27300,
      "25-34": 59700,
      "35-44": 170600,
      "45-54": 308600,
      "55-64": 412700,
      "65+": 489700,
    },
    // Average income by age group in GBP
    incomeByAge: {
      "18-24": 21700,
      "25-34": 31800,
      "35-44": 39600,
      "45-54": 42700,
      "55-64": 38900,
      "65+": 25600,
    },
  },
  DEU: {
    name: "Germany",
    currency: "EUR",
    exchangeRate: 0.91, // EUR to USD
    // Net worth percentiles in EUR
    networth: {
      p10: 4200,
      p20: 18700,
      p30: 51900,
      p40: 93800,
      p50: 146300, // Median
      p60: 215600,
      p70: 308700,
      p80: 449200,
      p90: 722800,
      p95: 1217600,
      p99: 3172000,
    },
    // Annual income percentiles in EUR
    income: {
      p10: 12800,
      p20: 19700,
      p30: 26900,
      p40: 34100,
      p50: 41600, // Median
      p60: 49800,
      p70: 59700,
      p80: 73600,
      p90: 97800,
      p95: 131700,
      p99: 261400,
    },
    // Average wealth by age group in EUR
    wealthByAge: {
      "18-24": 31600,
      "25-34": 68300,
      "35-44": 189700,
      "45-54": 319800,
      "55-64": 421900,
      "65+": 378600,
    },
    // Average income by age group in EUR
    incomeByAge: {
      "18-24": 23800,
      "25-34": 36900,
      "35-44": 47800,
      "45-54": 51300,
      "55-64": 46700,
      "65+": 29800,
    },
  },
  CHN: {
    name: "China",
    currency: "CNY",
    exchangeRate: 7.1, // CNY to USD
    // Net worth percentiles in CNY
    networth: {
      p10: 9800,
      p20: 32700,
      p30: 78600,
      p40: 142900,
      p50: 227800, // Median
      p60: 341700,
      p70: 498600,
      p80: 731900,
      p90: 1217600,
      p95: 2078300,
      p99: 5673000,
    },
    // Annual income percentiles in CNY
    income: {
      p10: 12600,
      p20: 21800,
      p30: 32700,
      p40: 45900,
      p50: 61800, // Median
      p60: 81700,
      p70: 108600,
      p80: 148900,
      p90: 227800,
      p95: 341700,
      p99: 796000,
    },
    // Average wealth by age group in CNY
    wealthByAge: {
      "18-24": 56900,
      "25-34": 142900,
      "35-44": 341700,
      "45-54": 569300,
      "55-64": 682100,
      "65+": 569300,
    },
    // Average income by age group in CNY
    incomeByAge: {
      "18-24": 37100,
      "25-34": 61800,
      "35-44": 81700,
      "45-54": 87600,
      "55-64": 74800,
      "65+": 43000,
    },
  },
  IND: {
    name: "India",
    currency: "INR",
    exchangeRate: 83.2, // INR to USD
    // Net worth percentiles in INR
    networth: {
      p10: 24900,
      p20: 74600,
      p30: 149200,
      p40: 248700,
      p50: 373000, // Median
      p60: 547800,
      p70: 796500,
      p80: 1194700,
      p90: 2141500,
      p95: 3730000,
      p99: 11190000,
    },
    // Annual income percentiles in INR
    income: {
      p10: 41600,
      p20: 74600,
      p30: 116200,
      p40: 166000,
      p50: 224100, // Median
      p60: 298800,
      p70: 398400,
      p80: 547800,
      p90: 846200,
      p95: 1293000,
      p99: 3233000,
    },
    // Average wealth by age group in INR
    wealthByAge: {
      "18-24": 99500,
      "25-34": 199000,
      "35-44": 398000,
      "45-54": 647000,
      "55-64": 796500,
      "65+": 697000,
    },
    // Average income by age group in INR
    incomeByAge: {
      "18-24": 116200,
      "25-34": 174300,
      "35-44": 248700,
      "45-54": 274600,
      "55-64": 224100,
      "65+": 149400,
    },
  },
  // Add more countries as needed
}

// Function to get country data by code
export function getCountryData(countryCode: string) {
  return nationalWealthData[countryCode as keyof typeof nationalWealthData] || nationalWealthData.USA
}

// Function to convert value to USD
export function convertToUSD(value: number, countryCode: string) {
  const country = getCountryData(countryCode)
  return value / country.exchangeRate
}

// Function to convert value from USD to local currency
export function convertFromUSD(valueUSD: number, countryCode: string) {
  const country = getCountryData(countryCode)
  return valueUSD * country.exchangeRate
}
