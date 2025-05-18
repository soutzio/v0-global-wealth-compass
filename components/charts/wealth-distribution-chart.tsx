"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { globalWealthPercentiles } from "@/data/global-wealth-data"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Info } from "lucide-react"

interface WealthDistributionChartProps {
  type: "income" | "networth"
  userValue: number
  userPercentile: number
  currency: string
}

export default function WealthDistributionChart({
  type,
  userValue,
  userPercentile,
  currency,
}: WealthDistributionChartProps) {
  const chartRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const tooltipRef = useRef<any>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get the appropriate data based on the type
  const data = globalWealthPercentiles[type]

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

    // Extract percentiles and values
    const percentiles = Object.keys(data)
      .filter((key) => key.startsWith("p"))
      .map((key) => Number(key.substring(1)))

    const values = Object.keys(data)
      .filter((key) => key.startsWith("p"))
      .map((key) => data[key])

    // Create scales
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width])

    const yScale = d3
      .scaleLog()
      .domain([Math.max(10, (d3.min(values) as number) / 2), (d3.max(values) as number) * 1.2])
      .range([height, 0])

    // Create line generator
    const line = d3
      .line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    // Create area generator
    const area = d3
      .area<[number, number]>()
      .x((d) => xScale(d[0]))
      .y0(height)
      .y1((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX)

    // Combine percentiles and values into data points
    const dataPoints: [number, number][] = percentiles.map((p, i) => [p, values[i]])

    // Add area
    svg
      .append("path")
      .datum(dataPoints)
      .attr("fill", theme === "dark" ? "rgba(20, 184, 166, 0.2)" : "rgba(16, 185, 129, 0.2)")
      .attr("d", area)

    // Add line
    svg
      .append("path")
      .datum(dataPoints)
      .attr("fill", "none")
      .attr("stroke", theme === "dark" ? "#14b8a6" : "#10b981")
      .attr("stroke-width", 2)
      .attr("d", line)

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

    // Add data points
    svg
      .selectAll(".data-point")
      .data(dataPoints)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 4)
      .attr("fill", theme === "dark" ? "#14b8a6" : "#10b981")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6)

        const [percentile, value] = d
        const formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value)

        showTooltip(event, `${percentile}th percentile: ${formattedValue}`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4)
        hideTooltip()
      })

    // Add user's position if available
    if (userValue && userPercentile) {
      // Add user marker
      svg
        .append("circle")
        .attr("cx", xScale(userPercentile))
        .attr("cy", yScale(userValue))
        .attr("r", 6)
        .attr("fill", "#f97316") // Orange color
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function (event: any) {
          d3.select(this).attr("r", 8)

          const formattedValue = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
          }).format(userValue)

          showTooltip(event, `Your position: ${formattedValue} (${userPercentile.toFixed(1)}th percentile)`)
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 6)
          hideTooltip()
        })

      // Add vertical line from x-axis to user position
      svg
        .append("line")
        .attr("x1", xScale(userPercentile))
        .attr("y1", height)
        .attr("x2", xScale(userPercentile))
        .attr("y2", yScale(userValue))
        .attr("stroke", "#f97316")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4")

      // Add horizontal line from y-axis to user position
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", yScale(userValue))
        .attr("x2", xScale(userPercentile))
        .attr("y2", yScale(userValue))
        .attr("stroke", "#f97316")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4")
    }

    // Add axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => `${d}%`)
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")

    const yAxis = d3
      .axisLeft(yScale)
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
      .call(yAxis)
      .selectAll("text")
      .attr("fill", theme === "dark" ? "#94a3b8" : "#64748b")

    // Add axis labels
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text("Percentile")

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text(type === "income" ? "Annual Income (USD)" : "Net Worth (USD)")

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
  }, [data, userValue, userPercentile, theme, type, currency])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description:
        "This chart shows the global distribution of " +
        (type === "income" ? "annual income" : "net worth") +
        ". The orange dot shows your position. Hover over points for details.",
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Global {type === "income" ? "Income" : "Wealth"} Distribution</CardTitle>
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
          {type === "income"
            ? "Global income distribution based on World Inequality Database"
            : "Global wealth distribution based on Credit Suisse Global Wealth Report"}
        </div>
      </CardContent>
    </Card>
  )
}
