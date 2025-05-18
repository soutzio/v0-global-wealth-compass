"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AgeSpecificResultsProps {
  ageGroup: string | null
  percentileInAgeGroup: number
  type: "income" | "networth"
}

export default function AgeSpecificResults({ ageGroup, percentileInAgeGroup, type }: AgeSpecificResultsProps) {
  const { toast } = useToast()

  if (!ageGroup) {
    return null
  }

  // Determine emoji based on percentile
  const getEmoji = (percentile: number) => {
    if (percentile > 90) return "🔥"
    if (percentile > 75) return "🚀"
    if (percentile > 50) return "👍"
    if (percentile > 25) return "🌱"
    return "🌊"
  }

  const handleInfoClick = () => {
    toast({
      title: "Age-specific ranking",
      description: `This shows how your ${
        type === "income" ? "income" : "net worth"
      } compares to others in your age group (${ageGroup}).`,
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5 text-emerald-500" />
          Age Group Ranking
          <Badge variant="outline" className="ml-2">
            {ageGroup}
          </Badge>
          <button
            onClick={handleInfoClick}
            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Users className="h-5 w-5" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Bottom</span>
            <span className="text-sm text-muted-foreground">Top</span>
          </div>
          <Progress value={percentileInAgeGroup} className="h-3" />
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
              {getEmoji(percentileInAgeGroup)} Top {100 - Math.round(percentileInAgeGroup)}% in age group
            </Badge>
            <span className="text-sm text-muted-foreground">
              Better than {Math.round(percentileInAgeGroup)}% in your age group
            </span>
          </div>

          {/* Achievement Badge for Age Group Ranking */}
          {percentileInAgeGroup >= 95 && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md flex items-center">
              <span className="text-lg mr-2">👨‍👩‍👧‍👦</span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Top 5% in {ageGroup} age group
              </span>
            </div>
          )}
          {percentileInAgeGroup >= 90 && percentileInAgeGroup < 95 && (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md flex items-center">
              <span className="text-lg mr-2">👨‍👩‍👧‍👦</span>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Top 10% in {ageGroup} age group
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
