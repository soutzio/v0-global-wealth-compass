"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { wealthShareByRegion } from "@/data/global-wealth-data"
import { nationalWealthData } from "@/data/national-wealth-data"

interface WealthTreemapChartProps {
  userCountry: string | null
}

export default function WealthTreemapChart({ userCountry }: WealthTreemapChartProps) {
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
    const width = chartRef.current.clientWidth
    const height = 400

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(0,0)`)

    // Prepare hierarchical data
    const hierarchicalData = {
      name: "Global Wealth",
      children: Object.entries(wealthShareByRegion).map(([region, value]) => {
        // Get countries in this region
        const countriesInRegion = Object.entries(nationalWealthData)
          .filter(([_, countryData]) => {
            // This is a simplified approach - in a real app, you'd have region data for each country
            // For now, we'll just assign countries to regions based on some simple rules
            const name = countryData.name.toLowerCase()
            switch (region) {
              case "North America":
                return name.includes("united states") || name.includes("canada") || name.includes("mexico")
              case "Europe":
                return (
                  name.includes("united kingdom") ||
                  name.includes("germany") ||
                  name.includes("france") ||
                  name.includes("italy") ||
                  name.includes("spain") ||
                  name.includes("netherlands") ||
                  name.includes("switzerland") ||
                  name.includes("sweden")
                )
              case "Asia-Pacific":
                return name.includes("japan") || name.includes("australia") || name.includes("singapore")
              case "China":
                return name.includes("china")
              case "Latin America":
                return name.includes("brazil") || name.includes("mexico") || name.includes("argentina")
              case "India":
                return name.includes("india")
              case "Africa":
                return name.includes("south africa") || name.includes("nigeria") || name.includes("egypt")
              default:
                return false
            }
          })
          .map(([code, countryData]) => ({
            name: countryData.name,
            code,
            value: (value / 100) * (code === userCountry ? 1.5 : 1), // Slightly emphasize user's country
            isUserCountry: code === userCountry,
          }))

        return {
          name: region,
          value,
          children: countriesInRegion,
        }
      }),
    }

    // Create treemap layout
    const root = d3.hierarchy(hierarchicalData).sum((d: any) => d.value)

    // Use treemap layout
    d3.treemap().size([width, height]).padding(2)(root)

    // Color scale for regions
    const colorScale = d3.scaleOrdinal<string>().domain(Object.keys(wealthShareByRegion)).range([
      "#10b981", // emerald-500
      "#14b8a6", // teal-500
      "#06b6d4", // cyan-500
      "#0ea5e9", // sky-500
      "#3b82f6", // blue-500
      "#8b5cf6", // violet-500
      "#d946ef", // fuchsia-500
    ])

    // Create cells for regions
    const regions = svg
      .selectAll(".region")
      .data(root.children || [])
      .enter()
      .append("g")
      .attr("class", "region")

    // Add rectangles for regions
    regions
      .append("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => d.y1 - d.y0)
      .attr("fill", (d: any) => colorScale(d.data.name))
      .attr("stroke", theme === "dark" ? "#1e293b" : "#ffffff")
      .attr("stroke-width", 2)
      .style("opacity", 0.85)
      .on("mouseover", function (event, d: any) {
        d3.select(this).style("opacity", 1).attr("stroke-width", 3)
        showTooltip(event, `${d.data.name}: ${d.data.value}% of global wealth`)
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.85).attr("stroke-width", 2)
        hideTooltip()
      })

    // Add region labels
    regions
      .append("text")
      .attr("x", (d: any) => d.x0 + 5)
      .attr("y", (d: any) => d.y0 + 15)
      .attr("fill", "#ffffff")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .text((d: any) => d.data.name)

    // Create cells for countries (only for regions with enough space)
    regions.each(function (regionNode: any) {
      const regionWidth = regionNode.x1 - regionNode.x0
      const regionHeight = regionNode.y1 - regionNode.y0

      // Only show countries if the region is large enough
      if (regionWidth > 100 && regionHeight > 60 && regionNode.children) {
        // Create country treemap layout
        const countryRoot = d3.hierarchy({ children: regionNode.data.children }).sum((d: any) => d.value)

        d3
          .treemap()
          .size([regionWidth - 4, regionHeight - 20])
          .padding(1)(countryRoot)

        // Create country cells
        const countries = d3
          .select(this)
          .selectAll(".country")
          .data(countryRoot.children || [])
          .enter()
          .append("g")
          .attr("class", "country")
          .attr("transform", `translate(${regionNode.x0 + 2}, ${regionNode.y0 + 18})`)

        // Add rectangles for countries
        countries
          .append("rect")
          .attr("x", (d: any) => d.x0)
          .attr("y", (d: any) => d.y0)
          .attr("width", (d: any) => d.x1 - d.x0)
          .attr("height", (d: any) => d.y1 - d.y0)
          .attr("fill", (d: any) => {
            // Highlight user's country
            if (d.data.isUserCountry) {
              return "#f97316" // Orange
            }
            // Slightly different shade for each country
            const baseColor = colorScale(regionNode.data.name)
            const colorObj = d3.color(baseColor)
            if (colorObj) {
              colorObj.opacity = 0.7 + Math.random() * 0.3 // Random opacity for variety
              return colorObj.toString()
            }
            return baseColor
          })
          .attr("stroke", theme === "dark" ? "#1e293b" : "#ffffff")
          .attr("stroke-width", (d: any) => (d.data.isUserCountry ? 2 : 0.5))
          .on("mouseover", function (event, d: any) {
            d3.select(this).attr("stroke-width", 2)
            showTooltip(event, `${d.data.name}${d.data.isUserCountry ? " (Your country)" : ""}`)
          })
          .on("mouseout", function (event, d: any) {
            // Fixed: Added event parameter and proper error handling
            if (d && d.data && typeof d.data.isUserCountry !== "undefined") {
              d3.select(this).attr("stroke-width", d.data.isUserCountry ? 2 : 0.5)
            } else {
              d3.select(this).attr("stroke-width", 0.5)
            }
            hideTooltip()
          })

        // Add country labels (only for larger countries)
        countries.each(function (d: any) {
          const width = d.x1 - d.x0
          const height = d.y1 - d.y0

          if (width > 40 && height > 20) {
            d3.select(this)
              .append("text")
              .attr("x", d.x0 + width / 2)
              .attr("y", d.y0 + height / 2)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("fill", "#ffffff")
              .attr("font-size", "9px")
              .attr("pointer-events", "none")
              .text(d.data.name.length > 10 ? d.data.name.substring(0, 10) + "..." : d.data.name)
          }
        })
      }
    })

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
  }, [theme, userCountry])

  const handleInfoClick = () => {
    toast({
      title: "About this chart",
      description:
        "This treemap shows global wealth distribution by region and country. The size of each rectangle represents the share of global wealth. Your country is highlighted in orange if selected.",
      duration: 5000,
    })
  }

  return (
    <Card className="bg-white dark:bg-slate-900 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Global Wealth Treemap</CardTitle>
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
          Based on Credit Suisse Global Wealth Report and World Inequality Database
        </div>
      </CardContent>
    </Card>
  )
}
