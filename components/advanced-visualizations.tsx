"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WealthTreemapChart, WealthHeatmapChart } from "@/components/charts"
import { BarChart3, Grid3X3 } from "lucide-react"

interface AdvancedVisualizationsProps {
  type: "income" | "networth"
  userCountry: string | null
  userAgeGroup: string | null
}

export default function AdvancedVisualizations({ type, userCountry, userAgeGroup }: AdvancedVisualizationsProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Advanced Visualizations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="treemap" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="treemap" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Treemap
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Heatmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treemap" className="mt-0">
            <WealthTreemapChart userCountry={userCountry} />
          </TabsContent>

          <TabsContent value="heatmap" className="mt-0">
            <WealthHeatmapChart type={type} userCountry={userCountry} userAgeGroup={userAgeGroup} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
