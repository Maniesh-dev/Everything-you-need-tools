"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Browser, Copy } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"

interface BrowserData {
  userAgent: string
  platform: string
  language: string
  languages: string
  cookiesEnabled: boolean
  doNotTrack: boolean
  hardwareConcurrency: number
  maxTouchPoints: number
  onlineStatus: boolean
  vendor: string
  screenColorDepth: number
  timezone: string
  browserName: string
  browserVersion: string
  osName: string
}

function parseBrowser(ua: string): { browser: string; version: string; os: string } {
  let browser = "Unknown"
  let version = ""
  let os = "Unknown"

  // OS detection
  if (ua.includes("Windows NT 10")) os = "Windows 10/11"
  else if (ua.includes("Windows NT")) os = "Windows"
  else if (ua.includes("Mac OS X")) os = "macOS"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("CrOS")) os = "Chrome OS"

  // Browser detection (order matters)
  if (ua.includes("Edg/")) {
    browser = "Microsoft Edge"
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || ""
  } else if (ua.includes("OPR/") || ua.includes("Opera")) {
    browser = "Opera"
    version = ua.match(/(?:OPR|Opera)\/([\d.]+)/)?.[1] || ""
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browser = "Google Chrome"
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || ""
  } else if (ua.includes("Firefox/")) {
    browser = "Mozilla Firefox"
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || ""
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    browser = "Apple Safari"
    version = ua.match(/Version\/([\d.]+)/)?.[1] || ""
  }

  return { browser, version, os }
}

export function BrowserInfoTool() {
  const [info, setInfo] = React.useState<BrowserData | null>(null)

  React.useEffect(() => {
    const ua = navigator.userAgent
    const parsed = parseBrowser(ua)

    setInfo({
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages?.join(", ") || navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === "1",
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      onlineStatus: navigator.onLine,
      vendor: navigator.vendor || "N/A",
      screenColorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browserName: parsed.browser,
      browserVersion: parsed.version,
      osName: parsed.os,
    })
  }, [])

  const copyAll = () => {
    if (!info) return
    const text = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("Browser info copied!")
  }

  if (!info) return null

  const rows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Browser", value: `${info.browserName} ${info.browserVersion}`, highlight: true },
    { label: "Operating System", value: info.osName, highlight: true },
    { label: "Platform", value: info.platform },
    { label: "Language", value: info.language },
    { label: "All Languages", value: info.languages },
    { label: "Timezone", value: info.timezone },
    { label: "CPU Cores", value: String(info.hardwareConcurrency) },
    { label: "Touch Points", value: String(info.maxTouchPoints) },
    { label: "Cookies Enabled", value: info.cookiesEnabled ? "✅ Yes" : "❌ No" },
    { label: "Do Not Track", value: info.doNotTrack ? "🔒 Enabled" : "Disabled" },
    { label: "Online Status", value: info.onlineStatus ? "🟢 Online" : "🔴 Offline" },
    { label: "Color Depth", value: `${info.screenColorDepth}-bit` },
    { label: "Vendor", value: info.vendor },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Browser className="text-primary" /> Browser Info Detector
          </CardTitle>
          <CardDescription>View detailed information about your browser, OS, and device capabilities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Browser</div>
              <div className="text-xl font-black text-primary">{info.browserName}</div>
              <div className="text-sm text-muted-foreground font-mono">v{info.browserVersion}</div>
            </div>
            <div className="bg-muted/50 border rounded-xl p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Operating System</div>
              <div className="text-xl font-black">{info.osName}</div>
              <div className="text-sm text-muted-foreground font-mono">{info.platform}</div>
            </div>
          </div>

          {/* Detail Table */}
          <div className="border rounded-xl overflow-hidden">
            {rows.filter(r => !r.highlight).map((row, i) => (
              <div key={row.label} className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? "bg-muted/20" : "bg-card"}`}>
                <span className="font-medium text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-right max-w-[60%] truncate">{row.value}</span>
              </div>
            ))}
          </div>

          {/* User Agent */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-muted-foreground">Raw User Agent</div>
            <div className="bg-muted/30 border rounded-lg p-3 text-xs font-mono break-all select-all text-muted-foreground leading-relaxed">
              {info.userAgent}
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={copyAll}>
              <Copy className="mr-2" /> Copy All Info
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
