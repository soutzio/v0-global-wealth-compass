"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { wealthShareByRegion } from "@/data/global-wealth-data"
import { useTheme } from "next-themes"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WealthByRegionChart() {
  const chartRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const tooltipRef = useRef<any>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove()

    // Create tooltip div if it doesn't exist
    let tooltip = d3.select("body").select(".chart-tooltip")
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", theme === "dark" ? "#1e293b" : "#ffffff")
        .style("border", theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0")
        .style("border-radius", "4px")
        .style("padding", "5px 8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "100")
        .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
    }

    // Store tooltip in ref for use in cleanup
    tooltipRef.current = tooltip

    // Set up dimensions
    const width = chartRef.current.clientWidth
    const height = 300
    const radius = Math.min(width, height) / 2 - 40

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Prepare data
    const data = Object.entries(wealthShareByRegion).map(([region, value]) => ({
      region,
      value,
    }))

    // Color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.region))
      .range([
        "#10b981", // emerald-500
        "#14b8a6", // teal-500
        "#06b6d4", // cyan-500
        "#0ea5e9", // sky-500
        "#3b82f6", // blue-500
        "#8b5cf6", // violet-500
        "#d946ef", // fuchsia-500
      ])

    // Create pie generator
    const pie = d3
      .pie<any>()
      .value((d) => d.value)
      .sort(null)

    // Create arc generator
    const arc = d3
      .arc<any>()
      .innerRadius(radius * 0.5) // Create a donut chart
      .outerRadius(radius)

    // Create outer arc for labels
    const outerArc = d3
      .arc<any>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1)

    // Function to show tooltip with delay
    const showTooltip = (event: MouseEvent, text: string) => {
      // Clear any existing timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }

      tooltip
        .style("visibility", "visible")
        .html(text)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`)
        .style("color", theme === "dark" ? "#e2e8f0" : "#334155")
    }

    // Function to hide tooltip with delay
    const hideTooltip = () => {
      // Clear any existing timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }

      // Set a new timeout to hide the tooltip after 1 second
      tooltipTimeoutRef.current = setTimeout(() => {
        tooltip.style("visibility", "hidden")
        tooltipTimeoutRef.current = null
      }, 1000) // 1 second delay
    }

    // Generate pie chart
    const arcs = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc")

    // Add slices
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.region) as string)
      .attr("stroke", theme === "dark" ? "#1e293b" : "#ffffff")
      .attr("stroke-width", 1)
      .style("opacity", 0.9)
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1).attr("stroke-width", 2)
        showTooltip(event, `${d.data.region}: ${d.data.value}%`)
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.9).attr("stroke-width", 1)
        hideTooltip()
      })

    // Add labels
    const threshold = 5 // Only show labels for regions with more than 5% share

    arcs
      .filter((d) => d.data.value >= threshold)
      .append("text")
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d)
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1)
        return `translate(${pos})`
      })
      .attr("dy", ".35em")
      .attr("text-anchor", (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return midAngle < Math.PI ? "start" : "end"
      })
      .text((d) => d.data.region)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .attr("font-size", "12px")

    // Add polylines for labels
    arcs
      .filter((d) => d.data.value >= threshold)
      .append("polyline")
      .attr("points", (d) => {
        const pos = outerArc.centroid(d)
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1)
        return [arc.centroid(d), outerArc.centroid(d), pos].join(",")
      })
      .attr("fill", "none")
      .attr("stroke", theme === "dark" ? "#64748b" : "#94a3b8")
      .attr("stroke-width", 1)

    // Add center text
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "14px")
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text("Global Wealth")

    // Clean up function
    return () => {
      // Clear any existing timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }

      // Remove tooltip when component unmounts
      if (tooltipRef.current && !tooltipRef.current.empty()) {
        tooltipRef.current.style("visibility", "hidden")
      }
    }
  }, [theme])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description:
        "This chart shows how global wealth is distributed across different regions. Hover over segments for details.",
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Wealth Distribution by Region</CardTitle>
          <button onClick={handleInfoClick} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Info className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg ref={chartRef} width="100%" height="300" />
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">
          Based on Credit Suisse Global Wealth Report
        </div>
      </CardContent>
    </Card>
  )
}
