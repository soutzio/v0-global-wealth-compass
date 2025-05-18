"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HistoricalTrendChartProps {
  historicalData: {
    years: number[]
    values: number[]
    currentYear: number
    currentValue: number
    currency: string
  }
}

export default function HistoricalTrendChart({ historicalData }: HistoricalTrendChartProps) {
  const chartRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()
  const { toast } = useToast()
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || !historicalData) return

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
    const data = historicalData.years.map((year, i) => ({
      year,
      value: historicalData.values[i],
    }))

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.year) as number, d3.max(data, (d) => d.year) as number])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.value) as number) * 1.1])
      .range([height, 0])

    // Create line generator
    const line = d3
      .line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Add line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", theme === "dark" ? "#14b8a6" : "#10b981")
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add area
    const area = d3
      .area<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y0(height)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    svg
      .append("path")
      .datum(data)
      .attr("fill", theme === "dark" ? "rgba(20, 184, 166, 0.2)" : "rgba(16, 185, 129, 0.2)")
      .attr("d", area)

    // Add data points
    svg
      .selectAll(".data-point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", theme === "dark" ? "#14b8a6" : "#10b981")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6)

        const formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: historicalData.currency,
          maximumFractionDigits: 0,
        }).format(d.value)

        tooltip
          .style("visibility", "visible")
          .html(`${d.year}: ${formattedValue}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .style("color", theme === "dark" ? "#e2e8f0" : "#334155")
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4)
        tooltip.style("visibility", "hidden")
      })

    // Add current year marker
    const currentYearData = data.find((d) => d.year === historicalData.currentYear)
    if (currentYearData) {
      svg
        .append("circle")
        .attr("cx", xScale(currentYearData.year))
        .attr("cy", yScale(currentYearData.value))
        .attr("r", 6)
        .attr("fill", "#f97316") // Orange
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", function (event) {
          d3.select(this).attr("r", 8)

          const formattedValue = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: historicalData.currency,
            maximumFractionDigits: 0,
          }).format(currentYearData.value)

          tooltip
            .style("visibility", "visible")
            .html(`Current (${currentYearData.year}): ${formattedValue}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .style("color", theme === "dark" ? "#e2e8f0" : "#334155")
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 6)
          tooltip.style("visibility", "hidden")
        })
    }

    // Add axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => d.toString())

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
          currency: historicalData.currency,
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
      .text("Year")

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .attr("fill", theme === "dark" ? "#e2e8f0" : "#334155")
      .text(`Value (${historicalData.currency})`)

    // Clean up function
    return () => {
      // Remove tooltip when component unmounts
      if (tooltip && !tooltip.empty()) {
        tooltip.style("visibility", "hidden")
      }
    }
  }, [historicalData, theme])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description:
        "This chart shows the historical equivalent of your current wealth/income adjusted for inflation. The orange dot represents the current year.",
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Historical Equivalent Value</CardTitle>
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
          Adjusted for inflation based on Consumer Price Index (CPI) data
        </div>
      </CardContent>
    </Card>
  )
}
