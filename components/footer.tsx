import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mb-4">
        <p>Data sources:</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link
            href="https://www.credit-suisse.com/about-us/en/reports-research/global-wealth-report.html"
            target="_blank"
            className="flex items-center hover:text-emerald-600 transition-colors"
          >
            Credit Suisse Global Wealth Report <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
          <Link
            href="https://wid.world/"
            target="_blank"
            className="flex items-center hover:text-emerald-600 transition-colors"
          >
            World Inequality Database <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
          <Link
            href="https://www.worldbank.org/"
            target="_blank"
            className="flex items-center hover:text-emerald-600 transition-colors"
          >
            World Bank <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
          <Link
            href="https://www.oecd.org/"
            target="_blank"
            className="flex items-center hover:text-emerald-600 transition-colors"
          >
            OECD <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
          <Link
            href="https://www.bls.gov/cpi/"
            target="_blank"
            className="flex items-center hover:text-emerald-600 transition-colors"
          >
            US Bureau of Labor Statistics <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
      <p>© {new Date().getFullYear()} Global Wealth Compass. All rights reserved.</p>
      <p className="mt-2 text-xs">
        Data is based on the latest available research and may vary from other sources. All calculations are
        approximate.
      </p>
    </footer>
  )
}
