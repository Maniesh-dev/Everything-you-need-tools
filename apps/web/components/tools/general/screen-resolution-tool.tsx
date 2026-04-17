"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Monitor, Copy } from "@phosphor-icons/react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "sonner"

interface ScreenInfo {
  screenWidth: number
  screenHeight: number
  viewportWidth: number
  viewportHeight: number
  devicePixelRatio: number
  colorDepth: number
  orientation: string
  touchSupport: boolean
  availWidth: number
  availHeight: number
}

export function ScreenResolutionTool() {
  const [info, setInfo] = React.useState<ScreenInfo | null>(null)

  React.useEffect(() => {
    function gather() {
      setInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        orientation: screen.orientation?.type || "unknown",
        touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
      })
    }
    gather()
    window.addEventListener("resize", gather)
    return () => window.removeEventListener("resize", gather)
  }, [])

  const copyAll = () => {
    if (!info) return
    const text = Object.entries(info).map(([k, v]) => `${k}: ${v}`).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("Screen info copied!")
  }

  if (!info) return null

  const cards = [
    { label: "Screen Resolution", value: `${info.screenWidth} × ${info.screenHeight}`, sub: "Physical screen pixels", accent: true },
    { label: "Viewport Size", value: `${info.viewportWidth} × ${info.viewportHeight}`, sub: "Current browser window" },
    { label: "Available Screen", value: `${info.availWidth} × ${info.availHeight}`, sub: "Minus taskbar / dock" },
    { label: "Device Pixel Ratio", value: `${info.devicePixelRatio}x`, sub: info.devicePixelRatio > 1 ? "Retina / HiDPI display" : "Standard display" },
    { label: "Color Depth", value: `${info.colorDepth}-bit`, sub: info.colorDepth >= 24 ? "True Color" : "Limited palette" },
    { label: "Orientation", value: info.orientation.replace("-", " ").replace("primary", "").trim() || "Landscape", sub: "Screen orientation" },
    { label: "Touch Support", value: info.touchSupport ? "Yes" : "No", sub: info.touchSupport ? "Touch device detected" : "Mouse/pointer device" },
    { label: "CSS Pixels", value: `${Math.round(info.screenWidth / info.devicePixelRatio)} × ${Math.round(info.screenHeight / info.devicePixelRatio)}`, sub: "Logical resolution" },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="text-primary" /> Screen Resolution Checker
          </CardTitle>
          <CardDescription>Instantly detect your screen resolution, viewport, pixel ratio, and display capabilities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div
                key={c.label}
                className={`rounded-xl p-5 text-center border shadow-sm ${c.accent ? "bg-primary/10 border-primary/20 col-span-2" : "bg-card"}`}
              >
                <div className={`text-2xl md:text-3xl font-black tabular-nums ${c.accent ? "text-primary" : ""}`}>
                  {c.value}
                </div>
                <div className="text-sm font-semibold mt-2">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Visual Representation */}
          <div className="flex items-center justify-center py-4">
            <div
              className="border-2 border-primary/40 rounded-lg relative bg-primary/5 flex items-center justify-center"
              style={{
                width: Math.min(300, info.screenWidth / 8),
                height: Math.min(200, info.screenHeight / 8),
              }}
            >
              <div
                className="border-2 border-dashed border-blue-400/60 rounded bg-blue-400/10 flex items-center justify-center"
                style={{
                  width: Math.min(250, info.viewportWidth / 8),
                  height: Math.min(170, info.viewportHeight / 8),
                }}
              >
                <span className="text-[10px] text-muted-foreground font-mono">viewport</span>
              </div>
              <span className="absolute -bottom-5 text-[10px] text-muted-foreground font-mono">screen</span>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="outline" onClick={copyAll}>
              <Copy className="mr-2" /> Copy All Info
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
