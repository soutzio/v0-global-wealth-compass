"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { nationalWealthData } from "@/data/national-wealth-data"
import { ageGroups } from "@/data/age-groups"

interface WealthHeatmapChartProps {
  type: "income" | "networth"
  userCountry: string | null
  userAgeGroup: string | null
}

export default function WealthHeatmapChart({ type, userCountry, userAgeGroup }: WealthHeatmapChartProps) {
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

    // Set up dimensions
    const margin = { top: 50, right: 25, bottom: 70, left: 100 }
    const width = chartRef.current.clientWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Prepare data for heatmap
    // Select a subset of countries for better visualization
    const selectedCountries = ["USA", "GBR", "DEU", "CHN", "IND"]
    const ageGroupValues = ageGroups.map((group) => group.value)

    // Create data array for heatmap
    const heatmapData: { country: string; ageGroup: string; value: number; isUserCell: boolean }[] = []

    selectedCountries.forEach((countryCode) => {
      const countryData = nationalWealthData[countryCode as keyof typeof nationalWealthData]
      if (!countryData) return

      const dataByAgeKey = type === "income" ? "incomeByAge" : "wealthByAge"

      ageGroupValues.forEach((ageGroup) => {
        // Get the wealth/income value for this country and age group
        const value = countryData[dataByAgeKey][ageGroup as keyof typeof countryData.wealthByAge] || 0

        heatmapData.push({
          country: countryCode,
          ageGroup,
          value,
          isUserCell: countryCode === userCountry && ageGroup === userAgeGroup,
        })
      })
    })

    // Create scales
    const xScale = d3.scaleBand().domain(ageGroupValues).range([0, width]).padding(0.05)

    const yScale = d3.scaleBand().domain(selectedCountries).range([0, height]).padding(0.05)

    // Create color scale
    const valueExtent = d3.extent(heatmapData, (d) => d.value) as [number, number]
    const colorScale = d3
      .scaleSequential()
      .domain(valueExtent)
      .interpolator(theme === "dark" ? d3.interpolateViridis : d3.interpolateYlGn)

    // Add rectangles for heatmap cells
    svg
      .selectAll(".heatmap-cell")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("class", "heatmap-cell")
      .attr("x", (d) => xScale(d.ageGroup) as number)
      .attr("y", (d) => yScale(d.country) as number)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => colorScale(d.value))
      .attr("stroke", (d) => (d.isUserCell ? "#f97316" : "none")) // Highlight user's cell
      .attr("stroke-width", (d) => (d.isUserCell ? 3 : 0))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8)

        const countryName = nationalWealthData[d.country as keyof typeof nationalWealthData]?.name || d.country
        const formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: nationalWealthData[d.country as keyof typeof nationalWealthData]?.currency || "USD",
          maximumFractionDigits: 0,
        }).format(d.value)

        showTooltip(
          event,
          `${countryName}, Age ${d.ageGroup}<br>Average ${type === "income" ? "Income" : "Net Worth"}: ${formattedValue}${
            d.isUserCell ? "<br><strong>Your selection</strong>" : ""
          }`,
        )
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1)
        hideTooltip()
      })

    // Add x-axis (age groups)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")
      .style("text-anchor", "middle")

    // Add y-axis (countries)
    svg
      .append("g")
      .call(
        d3.axisLeft(yScale).tickFormat((d) => {
          return nationalWealthData[d as keyof typeof nationalWealthData]?.name || (d as string)
        }),
      )
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")

    // Add x-axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text("Age Group")

    // Add y-axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text("Country")

    // Add title
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`Average ${type === "income" ? "Income" : "Net Worth"} by Country and Age Group`)

    // Add color legend
    const legendWidth = width * 0.6
    const legendHeight = 10
    const legendX = (width - legendWidth) / 2
    const legendY = height + 40

    // Create gradient for legend
    const defs = svg.append("defs")
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")

    // Add color stops
    const numStops = 10
    for (let i = 0; i <= numStops; i++) {
      const offset = `${(i * 100) / numStops}%`
      const value = valueExtent[0] + (i / numStops) * (valueExtent[1] - valueExtent[0])
      linearGradient.append("stop").attr("offset", offset).attr("stop-color", colorScale(value))
    }

    // Add legend rectangle
    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)")

    // Add legend axis
    const legendScale = d3.scaleLinear().domain(valueExtent).range([0, legendWidth])
    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(5)
      .tickFormat((d) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(Number(d))
      })

    svg
      .append("g")
      .attr("transform", `translate(${legendX},${legendY + legendHeight})`)
      .call(legendAxis)
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")

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
  }, [theme, type, userCountry, userAgeGroup])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description: `This heatmap shows average ${
        type === "income" ? "income" : "net worth"
      } across different countries and age groups. Brighter colors indicate higher values. Your selection is highlighted with an orange border if applicable.`,
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{type === "income" ? "Income" : "Net Worth"} by Country and Age</CardTitle>
          <button onClick={handleInfoClick} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Info className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full">
          <svg ref={chartRef} width="100%" height="400" />
        </div>
        <div className="text-xs text-center text-muted-foreground mt-2">
          Based on national statistical agencies and World Bank data
        </div>
      </CardContent>
    </Card>
  )
}
