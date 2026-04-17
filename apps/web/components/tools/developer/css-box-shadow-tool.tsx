"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Drop, Copy } from "@phosphor-icons/react"
import { toast } from "sonner"

export function CssBoxShadowTool() {
  const [offsetX, setOffsetX] = React.useState(5)
  const [offsetY, setOffsetY] = React.useState(5)
  const [blur, setBlur] = React.useState(15)
  const [spread, setSpread] = React.useState(0)
  const [color, setColor] = React.useState("#000000")
  const [opacity, setOpacity] = React.useState(0.3)
  const [inset, setInset] = React.useState(false)
  const [bgColor, setBgColor] = React.useState("#ffffff")
  const [boxColor, setBoxColor] = React.useState("#6366f1")

  const rgba = React.useMemo(() => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }, [color, opacity])

  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`
  const cssCode = `box-shadow: ${shadowValue};`

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success("CSS copied to clipboard!")
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Drop className="text-primary" /> CSS Box Shadow Generator
          </CardTitle>
          <CardDescription>Design beautiful box shadows visually and grab the CSS code.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">

            {/* Controls */}
            <div className="space-y-5">
              {[
                { label: "Offset X", value: offsetX, set: setOffsetX, min: -50, max: 50 },
                { label: "Offset Y", value: offsetY, set: setOffsetY, min: -50, max: 50 },
                { label: "Blur Radius", value: blur, set: setBlur, min: 0, max: 100 },
                { label: "Spread Radius", value: spread, set: setSpread, min: -50, max: 50 },
              ].map((s) => (
                <div key={s.label} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">{s.label}</Label>
                    <span className="text-xs font-mono text-muted-foreground">{s.value}px</span>
                  </div>
                  <input
                    type="range"
                    min={s.min} max={s.max}
                    value={s.value}
                    onChange={(e) => s.set(parseInt(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Opacity</Label>
                  <span className="text-xs font-mono text-muted-foreground">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Shadow</Label>
                  <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 px-1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Box</Label>
                  <Input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="h-10 px-1" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Background</Label>
                  <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 px-1" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm pt-1">
                <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="accent-primary w-4 h-4" />
                Inset shadow
              </label>
            </div>

            {/* Preview + Code */}
            <div className="space-y-6">
              <div
                className="rounded-2xl flex items-center justify-center min-h-[350px] transition-all duration-200"
                style={{ backgroundColor: bgColor }}
              >
                <div
                  className="w-48 h-48 rounded-2xl transition-all duration-200"
                  style={{ backgroundColor: boxColor, boxShadow: shadowValue }}
                />
              </div>

              <div className="bg-muted/50 border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">CSS Code</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
                    <Copy className="mr-1" size={14} /> Copy
                  </Button>
                </div>
                <pre className="font-mono text-sm text-primary break-all select-all">{cssCode}</pre>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
