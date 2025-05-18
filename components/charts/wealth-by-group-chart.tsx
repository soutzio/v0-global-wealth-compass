"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { wealthShareByGroup } from "@/data/global-wealth-data"
import { useTheme } from "next-themes"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WealthByGroupChart({ userPercentile }: { userPercentile: number }) {
  const chartRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Determine user's wealth group
  const getUserGroup = (percentile: number) => {
    if (percentile >= 99) return "Top 1%"
    if (percentile >= 90) return "Next 9%"
    if (percentile >= 50) return "Middle 40%"
    return "Bottom 50%"
  }

  const userGroup = getUserGroup(userPercentile)

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

    // Set up dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const width = chartRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Prepare data
    const data = Object.entries(wealthShareByGroup).map(([group, value]) => ({
      group,
      value,
      isUserGroup: group === userGroup,
    }))

    // Sort data by wealth share (descending)
    data.sort((a, b) => b.value - a.value)

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.group))
      .range([0, width])
      .padding(0.3)

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0])

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.group) as number)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.value))
      .attr("fill", (d) => {
        if (d.isUserGroup) return "#f97316" // Orange for user's group
        return theme === "dark" ? "#14b8a6" : "#10b981" // Teal/Emerald for others
      })
      .attr("stroke", (d) => (d.isUserGroup ? "#fff" : "none"))
      .attr("stroke-width", (d) => (d.isUserGroup ? 2 : 0))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8)

        tooltip
          .style("visibility", "visible")
          .html(`${d.group}: ${d.value}% of global wealth`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .style("color", theme === "dark" ? "#e2e8f0" : "#334155")
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1)
        tooltip.style("visibility", "hidden")
      })

    // Add value labels on top of bars
    svg
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => (xScale(d.group) as number) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text((d) => `${d.value}%`)

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")
      .style("text-anchor", "middle")

    // Add y-axis
    svg
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => `${d}%`),
      )
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")

    // Add y-axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text("Share of Global Wealth (%)")

    // Add "You are here" label if user percentile is available
    if (userPercentile && userGroup) {
      const userGroupIndex = data.findIndex((d) => d.group === userGroup)
      if (userGroupIndex !== -1) {
        const userGroupData = data[userGroupIndex]
        svg
          .append("text")
          .attr("x", (xScale(userGroupData.group) as number) + xScale.bandwidth() / 2)
          .attr("y", yScale(userGroupData.value) + 20)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .attr("fill", "#f97316")
          .text("You are here")
      }
    }

    // Clean up function
    return () => {
      // Remove tooltip when component unmounts
      if (tooltip && !tooltip.empty()) {
        tooltip.style("visibility", "hidden")
      }
    }
  }, [theme, userPercentile, userGroup])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description:
        "This chart shows how global wealth is distributed among different wealth groups. The orange bar shows your group.",
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Wealth Distribution by Group</CardTitle>
          <button onClick={handleInfoClick} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Info className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg ref={chartRef} width="100%" height="300" />
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">Based on World Inequality Database</div>
      </CardContent>
    </Card>
  )
}
