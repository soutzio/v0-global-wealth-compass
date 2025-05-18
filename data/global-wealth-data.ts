// Real global wealth distribution data based on Credit Suisse Global Wealth Report 2022
// and World Inequality Database

// Global wealth percentiles in USD
export const globalWealthPercentiles = {
  // Net worth percentiles (USD)
  networth: {
    p1: 0, // Bottom 1%
    p5: 100,
    p10: 850,
    p20: 2900,
    p30: 7800,
    p40: 14600,
    p50: 24200, // Median global wealth
    p60: 39500,
    p70: 71600,
    p80: 129800,
    p90: 249700,
    p95: 486800,
    p99: 1100000, // Top 1%
    p999: 11100000, // Top 0.1%
  },
  // Annual income percentiles (USD)
  income: {
    p1: 300, // Bottom 1%
    p5: 600,
    p10: 1000,
    p20: 1800,
    p30: 2900,
    p40: 4300,
    p50: 5900, // Median global income
    p60: 8700,
    p70: 13200,
    p80: 21500,
    p90: 38400,
    p95: 58600,
    p99: 124000, // Top 1%
    p999: 458000, // Top 0.1%
  },
}

// Global wealth share by region
export const wealthShareByRegion = {
  "North America": 31.7,
  Europe: 24.5,
  "Asia-Pacific": 21.7,
  China: 18.2,
  "Latin America": 1.8,
  India: 1.5,
  Africa: 0.6,
}

// Global wealth share by wealth group
export const wealthShareByGroup = {
  "Top 1%": 45.8,
  "Next 9%": 38.1,
  "Middle 40%": 15.1,
  "Bottom 50%": 1.0,
}

// Global wealth to income ratios by region
export const wealthToIncomeRatios = {
  "North America": 6.7,
  Europe: 5.8,
  "Asia-Pacific": 5.2,
  China: 7.1,
  "Latin America": 4.9,
  India: 5.0,
  Africa: 3.8,
  "World Average": 5.7,
}
