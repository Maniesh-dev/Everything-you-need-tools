"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Sneaker } from "@phosphor-icons/react"

export function StepsConverterTool() {
  const [steps, setSteps] = React.useState("10000")
  const [weight, setWeight] = React.useState("70") // kg
  const [strideLength, setStrideLength] = React.useState("0.76") // meters

  const results = React.useMemo(() => {
    const s = parseInt(steps) || 0
    const w = parseFloat(weight) || 70
    const stride = parseFloat(strideLength) || 0.76

    const distanceKm = (s * stride) / 1000
    const distanceMi = distanceKm * 0.621371

    // MET value for walking (~3.5 METs moderate pace)
    // Calories = MET × weight(kg) × duration(hours)
    // Avg walking speed ~5 km/h → duration = distance / 5
    const durationHours = distanceKm / 5
    const calories = 3.5 * w * durationHours
    const activeMinutes = durationHours * 60

    return {
      calories: Math.round(calories),
      distanceKm: distanceKm.toFixed(2),
      distanceMi: distanceMi.toFixed(2),
      activeMinutes: Math.round(activeMinutes),
      steps: s,
    }
  }, [steps, weight, strideLength])

  const cards = [
    { label: "Calories Burned", value: `${results.calories}`, unit: "kcal", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    { label: "Distance", value: results.distanceKm, unit: "km", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Distance", value: results.distanceMi, unit: "miles", color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Active Time", value: `${results.activeMinutes}`, unit: "min", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20" },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sneaker className="text-primary" /> Steps to Calories
          </CardTitle>
          <CardDescription>Convert your daily steps into calories burned, distance, and active minutes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Steps</Label>
              <Input type="number" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="10000" />
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
            </div>
            <div className="space-y-2">
              <Label>Stride (m)</Label>
              <Input type="number" step="0.01" value={strideLength} onChange={(e) => setStrideLength(e.target.value)} placeholder="0.76" />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            {cards.map((c) => (
              <div key={c.label + c.unit} className={`${c.bg} border rounded-xl p-5 text-center`}>
                <div className={`text-3xl font-black tabular-nums ${c.color}`}>{c.value}</div>
                <div className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{c.unit}</div>
                <div className="text-sm font-medium mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Progress toward 10k steps */}
          {results.steps > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Goal Progress</span>
                <span className="font-bold">{Math.min(100, Math.round((results.steps / 10000) * 100))}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (results.steps / 10000) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">Based on 10,000 steps/day goal</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
