// Real data on high-profile earnings for comparison
// Sources: Forbes, Bloomberg, public financial disclosures

export const highProfileEarnings = {
  // Billionaires
  "Elon Musk": {
    netWorth: 241000000000, // $241 billion
    annualIncome: 23000000000, // Estimated $23 billion in 2023
    hourlyIncome: 2626712, // $2.6 million per hour
    minuteIncome: 43778, // $43,778 per minute
    secondIncome: 729, // $729 per second
  },
  "Jeff Bezos": {
    netWorth: 167000000000, // $167 billion
    annualIncome: 7700000000, // Estimated $7.7 billion in 2023
    hourlyIncome: 878995, // $878,995 per hour
    minuteIncome: 14650, // $14,650 per minute
    secondIncome: 244, // $244 per second
  },
  "Bernard Arnault": {
    netWorth: 196000000000, // $196 billion
    annualIncome: 11800000000, // Estimated $11.8 billion in 2023
    hourlyIncome: 1347032, // $1.3 million per hour
    minuteIncome: 22450, // $22,450 per minute
    secondIncome: 374, // $374 per second
  },
  "Bill Gates": {
    netWorth: 128000000000, // $128 billion
    annualIncome: 5100000000, // Estimated $5.1 billion in 2023
    hourlyIncome: 582192, // $582,192 per hour
    minuteIncome: 9703, // $9,703 per minute
    secondIncome: 162, // $162 per second
  },
  "Mark Zuckerberg": {
    netWorth: 141000000000, // $141 billion
    annualIncome: 12000000000, // Estimated $12 billion in 2023
    hourlyIncome: 1369863, // $1.4 million per hour
    minuteIncome: 22831, // $22,831 per minute
    secondIncome: 380, // $380 per second
  },

  // Tech CEOs
  "Tim Cook (Apple)": {
    netWorth: 1500000000, // $1.5 billion
    annualIncome: 99000000, // $99 million in 2022
    hourlyIncome: 47596, // $47,596 per hour
    minuteIncome: 793, // $793 per minute
    secondIncome: 13.2, // $13.2 per second
  },
  "Satya Nadella (Microsoft)": {
    netWorth: 700000000, // $700 million
    annualIncome: 55000000, // $55 million in 2022
    hourlyIncome: 26442, // $26,442 per hour
    minuteIncome: 440, // $440 per minute
    secondIncome: 7.3, // $7.3 per second
  },
  "Sundar Pichai (Google)": {
    netWorth: 1300000000, // $1.3 billion
    annualIncome: 226000000, // $226 million in 2022
    hourlyIncome: 108654, // $108,654 per hour
    minuteIncome: 1811, // $1,811 per minute
    secondIncome: 30.2, // $30.2 per second
  },

  // Athletes
  "Cristiano Ronaldo": {
    netWorth: 500000000, // $500 million
    annualIncome: 200000000, // $200 million (salary + endorsements)
    hourlyIncome: 22831, // $22,831 per hour
    minuteIncome: 380, // $380 per minute
    secondIncome: 6.3, // $6.3 per second
  },
  "Lionel Messi": {
    netWorth: 600000000, // $600 million
    annualIncome: 130000000, // $130 million (salary + endorsements)
    hourlyIncome: 14840, // $14,840 per hour
    minuteIncome: 247, // $247 per minute
    secondIncome: 4.1, // $4.1 per second
  },
  "LeBron James": {
    netWorth: 1200000000, // $1.2 billion
    annualIncome: 119500000, // $119.5 million (salary + endorsements)
    hourlyIncome: 13641, // $13,641 per hour
    minuteIncome: 227, // $227 per minute
    secondIncome: 3.8, // $3.8 per second
  },

  // Entertainers
  "Taylor Swift": {
    netWorth: 1100000000, // $1.1 billion
    annualIncome: 185000000, // $185 million (tours + music + endorsements)
    hourlyIncome: 21118, // $21,118 per hour
    minuteIncome: 352, // $352 per minute
    secondIncome: 5.9, // $5.9 per second
  },
  "Dwayne 'The Rock' Johnson": {
    netWorth: 800000000, // $800 million
    annualIncome: 125000000, // $125 million (movies + endorsements)
    hourlyIncome: 14269, // $14,269 per hour
    minuteIncome: 238, // $238 per minute
    secondIncome: 4.0, // $4.0 per second
  },
  Beyoncé: {
    netWorth: 500000000, // $500 million
    annualIncome: 80000000, // $80 million (music + endorsements)
    hourlyIncome: 9132, // $9,132 per hour
    minuteIncome: 152, // $152 per minute
    secondIncome: 2.5, // $2.5 per second
  },

  // Political leaders
  "US President": {
    annualIncome: 400000, // $400,000 salary
    hourlyIncome: 192, // $192 per hour (based on 40-hour work week)
    minuteIncome: 3.2, // $3.20 per minute
    secondIncome: 0.05, // $0.05 per second
  },
  "UK Prime Minister": {
    annualIncome: 164080, // £164,080 (approx. $213,000)
    hourlyIncome: 102, // $102 per hour
    minuteIncome: 1.7, // $1.70 per minute
    secondIncome: 0.03, // $0.03 per second
  },
  "German Chancellor": {
    annualIncome: 360000, // €360,000 (approx. $396,000)
    hourlyIncome: 190, // $190 per hour
    minuteIncome: 3.2, // $3.20 per minute
    secondIncome: 0.05, // $0.05 per second
  },

  // Average workers
  "US Median Worker": {
    annualIncome: 54132, // $54,132 median US income
    hourlyIncome: 26, // $26 per hour
    minuteIncome: 0.43, // $0.43 per minute
    secondIncome: 0.007, // $0.007 per second
  },
  "Global Median Worker": {
    annualIncome: 5900, // $5,900 median global income
    hourlyIncome: 2.83, // $2.83 per hour
    minuteIncome: 0.047, // $0.047 per minute
    secondIncome: 0.0008, // $0.0008 per second
  },

  // Other interesting comparisons
  "Average Doctor (US)": {
    annualIncome: 243000, // $243,000 average physician salary in US
    hourlyIncome: 117, // $117 per hour
    minuteIncome: 1.95, // $1.95 per minute
    secondIncome: 0.032, // $0.032 per second
  },
  "Average Teacher (US)": {
    annualIncome: 67620, // $67,620 average teacher salary in US
    hourlyIncome: 32.5, // $32.50 per hour
    minuteIncome: 0.54, // $0.54 per minute
    secondIncome: 0.009, // $0.009 per second
  },
  "Average Software Engineer (US)": {
    annualIncome: 120000, // $120,000 average software engineer salary in US
    hourlyIncome: 57.7, // $57.70 per hour
    minuteIncome: 0.96, // $0.96 per minute
    secondIncome: 0.016, // $0.016 per second
  },
  "Average Nurse (US)": {
    annualIncome: 77600, // $77,600 average nurse salary in US
    hourlyIncome: 37.3, // $37.30 per hour
    minuteIncome: 0.62, // $0.62 per minute
    secondIncome: 0.01, // $0.010 per second
  },
  "Minimum Wage Worker (US)": {
    annualIncome: 15080, // $15,080 (federal minimum wage $7.25/hr)
    hourlyIncome: 7.25, // $7.25 per hour
    minuteIncome: 0.12, // $0.12 per minute
    secondIncome: 0.002, // $0.002 per second
  },
}

// Update the getEarningsComparison function to include more specific comparisons
export function getEarningsComparison(valueUSD: number, type: "income" | "networth") {
  const comparisons = []

  if (type === "income") {
    // Annual income comparisons
    for (const [person, data] of Object.entries(highProfileEarnings)) {
      if (data.annualIncome) {
        // How many times the person's income equals the user's income
        const ratio = data.annualIncome / valueUSD

        if (ratio > 1) {
          // They earn more than the user
          comparisons.push({
            person,
            text: `${person} earns ${ratio.toFixed(1)}x your annual income`,
            timeEquivalent: `${person} earns your annual income in ${calculateTimeEquivalent(valueUSD, data.hourlyIncome, data.minuteIncome, data.secondIncome)}`,
          })
        } else if (ratio < 1 && ratio > 0) {
          // User earns more than them
          comparisons.push({
            person,
            text: `You earn ${(1 / ratio).toFixed(1)}x what ${person} earns annually`,
            timeEquivalent: `You earn their annual income in ${calculateTimeEquivalent(data.annualIncome, valueUSD / 2080, valueUSD / 124800, valueUSD / 7488000)}`,
          })
        }
      }
    }
  } else {
    // Net worth comparisons
    for (const [person, data] of Object.entries(highProfileEarnings)) {
      if (data.netWorth) {
        // How many times the person's net worth equals the user's net worth
        const ratio = data.netWorth / valueUSD

        if (ratio > 1) {
          // They have more wealth than the user
          comparisons.push({
            person,
            text: `${person}'s net worth is ${ratio.toFixed(1)}x your net worth`,
            timeEquivalent: data.annualIncome
              ? `${person} earns your entire net worth in ${calculateTimeEquivalent(valueUSD, data.hourlyIncome, data.minuteIncome, data.secondIncome)}`
              : "",
          })
        } else if (ratio < 1 && ratio > 0) {
          // User has more wealth than them
          comparisons.push({
            person,
            text: `Your net worth is ${(1 / ratio).toFixed(1)}x ${person}'s net worth`,
            timeEquivalent: "",
          })
        }
      }
    }
  }

  // Sort by most extreme comparisons first
  return comparisons.sort((a, b) => {
    const ratioA = Number.parseFloat(a.text.match(/(\d+\.\d+)x/)?.[1] || "0")
    const ratioB = Number.parseFloat(b.text.match(/(\d+\.\d+)x/)?.[1] || "0")
    return ratioB - ratioA
  })
}

// Helper function to calculate time equivalent
function calculateTimeEquivalent(value: number, hourlyRate: number, minuteRate: number, secondRate: number) {
  // Prioritize seconds for smaller values to create more variation
  if (secondRate && value / secondRate < 300) {
    // Show seconds for values under 5 minutes
    const seconds = Math.ceil(value / secondRate)
    return `${seconds} second${seconds !== 1 ? "s" : ""}`
  } else if (minuteRate && value / minuteRate < 120) {
    // Show minutes for values under 2 hours
    const minutes = Math.ceil(value / minuteRate)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (hourlyRate && value / hourlyRate < 24) {
    const hours = Math.floor(value / hourlyRate)
    const minutes = Math.floor((value - hours * hourlyRate) / minuteRate)
    return hours > 0
      ? `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`
      : `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else if (hourlyRate && value / hourlyRate < 168) {
    const days = Math.floor(value / (hourlyRate * 24))
    const hours = Math.floor((value - days * hourlyRate * 24) / hourlyRate)
    return `${days} day${days !== 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""}`
  } else if (hourlyRate && value / hourlyRate < 8760) {
    const weeks = Math.floor(value / (hourlyRate * 24 * 7))
    const days = Math.floor((value - weeks * hourlyRate * 24 * 7) / (hourlyRate * 24))
    return `${weeks} week${weeks !== 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""}`
  } else if (hourlyRate) {
    const years = Math.floor(value / (hourlyRate * 8760))
    const months = Math.floor((value - years * hourlyRate * 8760) / (hourlyRate * 730))
    return `${years} year${years !== 1 ? "s" : ""} and ${months} month${months !== 1 ? "s" : ""}`
  }

  return "an unknown amount of time"
}
