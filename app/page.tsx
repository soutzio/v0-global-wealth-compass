import type { Metadata } from "next"
import WealthComparator from "@/components/wealth-comparator"

export const metadata: Metadata = {
  title: "Global Wealth Compass",
  description: "Compare your income or net worth globally and see where you stand",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        <WealthComparator />
      </div>
    </div>
  )
}
