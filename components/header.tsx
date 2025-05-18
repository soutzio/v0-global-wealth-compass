import { Globe } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 py-6">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 text-white p-2 rounded-full">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Wealth Compass</h1>
          <p className="text-muted-foreground">Compare your wealth to local, national, and global benchmarks</p>
        </div>
      </div>
      <ModeToggle />
    </header>
  )
}
