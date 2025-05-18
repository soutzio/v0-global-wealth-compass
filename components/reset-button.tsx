"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResetButtonProps {
  onReset: () => void
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  const { toast } = useToast()

  const handleReset = () => {
    // Call the parent's reset function
    onReset()

    // Force a complete page reload to ensure everything is reset
    window.location.href = window.location.pathname

    toast({
      title: "Reset complete",
      description: "All inputs have been cleared. You can start over.",
      duration: 3000,
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleReset}
      className="flex items-center gap-2 mx-auto mt-4 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
    >
      <RefreshCw className="h-4 w-4" />
      Start Over
    </Button>
  )
}
