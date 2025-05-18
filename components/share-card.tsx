"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Download, Copy, Check, Twitter, Linkedin, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import QRCode from "qrcode"
import { Progress } from "@/components/ui/progress"
import { getCityData } from "@/data/cities"
import { countries } from "@/data/countries"

interface ShareCardProps {
  results: {
    percentiles: {
      local: number
      national: number
      global: number
    }
    input: {
      value: number
      type: "income" | "networth"
      currency: string
      country: string | null
      city: string | null
      ageGroup: string | null
    }
    funFact: {
      text: string
      icon: string
      comparison: string
    }
  }
}

export default function ShareCard({ results }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Customization options
  const [cardTheme, setCardTheme] = useState<"emerald" | "blue" | "purple" | "gradient">("gradient")
  const [showBadges, setShowBadges] = useState(true)
  const [showQrCode, setShowQrCode] = useState(false)
  const [showFunFact, setShowFunFact] = useState(true)
  const [badgeStyle, setBadgeStyle] = useState<"minimal" | "standard" | "detailed">("standard")

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  // Get city and country names
  const cityName = results.input.city ? getCityData(results.input.city)?.name || null : null
  const countryName = results.input.country
    ? countries.find((c) => c.code === results.input.country)?.name || results.input.country
    : null

  // Format the input value with commas and currency symbol
  const currencySymbol = results.input.currency === "USD" ? "$" : results.input.currency
  const formattedValue = `${currencySymbol}${results.input.value.toLocaleString()}`

  // Determine emoji based on percentile
  const getEmoji = (percentile: number) => {
    if (percentile > 90) return "🔥"
    if (percentile > 75) return "🚀"
    if (percentile > 50) return "👍"
    if (percentile > 25) return "🌱"
    return "🌊"
  }

  // Generate QR code when URL changes or when showQrCode is enabled
  useEffect(() => {
    if (showQrCode && shareUrl) {
      QRCode.toDataURL(
        shareUrl,
        {
          width: 100,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (err, url) => {
          if (!err) {
            setQrCodeUrl(url)
          }
        },
      )
    }
  }, [shareUrl, showQrCode])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const downloadImage = async () => {
    if (!cardRef.current) return

    setGenerating(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = "wealth-compass-results.png"
      link.click()

      toast({
        title: "Image downloaded!",
        description: "Your wealth card has been downloaded",
      })
    } catch (err) {
      toast({
        title: "Failed to generate image",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const shareToTwitter = () => {
    const text = `I'm in the top ${100 - Math.round(results.percentiles.global)}% globally with my ${
      results.input.type === "income" ? "income" : "net worth"
    }. Check your ranking on Global Wealth Compass!`

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    )
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  // Get background color based on theme
  const getBackgroundStyle = () => {
    switch (cardTheme) {
      case "emerald":
        return "bg-gradient-to-br from-emerald-500 to-emerald-600"
      case "blue":
        return "bg-gradient-to-br from-blue-500 to-blue-600"
      case "purple":
        return "bg-gradient-to-br from-purple-500 to-purple-600"
      case "gradient":
        return "bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600"
      default:
        return "bg-gradient-to-br from-emerald-500 to-teal-600"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Share2 className="mr-2 h-5 w-5 text-emerald-500" />
            Share Your Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="pt-4">
              <div ref={cardRef} className={`p-6 ${getBackgroundStyle()} text-white rounded-lg shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Global Wealth Compass</h3>
                    <p className="text-white/80 text-sm">My Wealth Ranking</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Hero Text */}
                  <div className="text-center mb-2">
                    <h2 className="text-2xl font-bold">
                      🌍 Top {100 - Math.round(results.percentiles.global)}% Globally
                    </h2>
                    <p className="text-sm text-white/80">
                      Compared to Global, National{cityName ? `, and ${cityName}` : ""} benchmarks
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-3">
                    <p className="text-sm text-white/80">
                      My {results.input.type === "income" ? "Annual Income" : "Net Worth"}
                    </p>
                    <p className="text-xl font-bold">{formattedValue}</p>
                  </div>

                  {/* Bar Visualization */}
                  <div className="space-y-3">
                    {cityName && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>🏙️ {cityName}</span>
                          <span>Top {100 - Math.round(results.percentiles.local)}%</span>
                        </div>
                        <Progress
                          value={results.percentiles.local}
                          className="h-2 bg-white/20"
                          style={{ color: "rgba(255,255,255,0.9)" }}
                        />
                      </div>
                    )}

                    {countryName && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>🏆 {countryName}</span>
                          <span>Top {100 - Math.round(results.percentiles.national)}%</span>
                        </div>
                        <Progress
                          value={results.percentiles.national}
                          className="h-2 bg-white/20"
                          style={{ color: "rgba(255,255,255,0.9)" }}
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>🌍 Global</span>
                        <span>Top {100 - Math.round(results.percentiles.global)}%</span>
                      </div>
                      <Progress
                        value={results.percentiles.global}
                        className="h-2 bg-white/20"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      />
                    </div>
                  </div>

                  {/* Fun Fact */}
                  {showFunFact && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3">
                      <p className="text-sm font-medium">💡 {results.funFact.comparison || results.funFact.text}</p>
                    </div>
                  )}

                  {/* QR Code */}
                  {showQrCode && qrCodeUrl && (
                    <div className="flex justify-center mt-2">
                      <div className="bg-white p-1 rounded-lg">
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-16 h-16" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-white/80 text-center">
                  How do you compare? → globalwealthcompass.com
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  variant="outline"
                  onClick={downloadImage}
                  disabled={generating}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {generating ? "Generating..." : "Download Card"}
                </Button>

                <Button
                  variant="outline"
                  onClick={shareToTwitter}
                  className="flex items-center gap-2 text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
                >
                  <Twitter className="h-4 w-4" />
                  Share on Twitter
                </Button>

                <Button
                  variant="outline"
                  onClick={shareToLinkedIn}
                  className="flex items-center gap-2 text-[#0A66C2] hover:bg-[#0A66C2]/10"
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="customize" className="pt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Card Theme</h3>
                  <RadioGroup
                    value={cardTheme}
                    onValueChange={(value) => setCardTheme(value as "emerald" | "blue" | "purple" | "gradient")}
                    className="flex flex-wrap gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradient" id="gradient" />
                      <Label htmlFor="gradient" className="flex items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 mr-2"></div>
                        Gradient
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="emerald" id="emerald" />
                      <Label htmlFor="emerald" className="flex items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 mr-2"></div>
                        Emerald
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="blue" id="blue" />
                      <Label htmlFor="blue" className="flex items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-blue-500 mr-2"></div>
                        Blue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="purple" id="purple" />
                      <Label htmlFor="purple" className="flex items-center cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-purple-500 mr-2"></div>
                        Purple
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium mb-2">Card Elements</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-fun-fact" className="cursor-pointer">
                      Show Fun Fact
                    </Label>
                    <Switch id="show-fun-fact" checked={showFunFact} onCheckedChange={setShowFunFact} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-qr" className="cursor-pointer">
                      Show QR Code
                    </Label>
                    <Switch id="show-qr" checked={showQrCode} onCheckedChange={setShowQrCode} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
