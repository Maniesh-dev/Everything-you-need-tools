"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Table, Printer } from "@phosphor-icons/react"

export function MultiplicationTableTool() {
  const [rangeStart, setRangeStart] = React.useState(1)
  const [rangeEnd, setRangeEnd] = React.useState(12)
  const [highlight, setHighlight] = React.useState("")

  const size = Math.max(1, Math.min(20, rangeEnd - rangeStart + 1))
  const numbers = Array.from({ length: size }, (_, i) => rangeStart + i)
  const highlightNum = parseInt(highlight) || 0

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="text-primary" /> Multiplication Table
          </CardTitle>
          <CardDescription>Generate interactive multiplication grids with custom ranges.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="flex flex-wrap gap-4 items-end print:hidden">
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="number" min={1} max={20} value={rangeStart} onChange={(e) => setRangeStart(Math.max(1, parseInt(e.target.value) || 1))} className="w-20" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="number" min={1} max={20} value={rangeEnd} onChange={(e) => setRangeEnd(Math.min(20, parseInt(e.target.value) || 12))} className="w-20" />
            </div>
            <div className="space-y-2">
              <Label>Highlight multiples of</Label>
              <Input type="number" min={0} value={highlight} onChange={(e) => setHighlight(e.target.value)} placeholder="e.g. 7" className="w-20" />
            </div>
            <Button variant="outline" onClick={() => window.print()} className="ml-auto">
              <Printer className="mr-2" /> Print
            </Button>
          </div>

          {/* Grid */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-primary text-primary-foreground font-bold px-3 py-2 text-center border-r border-primary-foreground/20 sticky left-0 z-10">×</th>
                  {numbers.map((n) => (
                    <th key={n} className="bg-primary text-primary-foreground font-bold px-3 py-2 text-center border-r border-primary-foreground/20 min-w-[48px]">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numbers.map((row) => (
                  <tr key={row}>
                    <td className="bg-primary text-primary-foreground font-bold px-3 py-2 text-center border-b border-primary-foreground/20 sticky left-0 z-10">{row}</td>
                    {numbers.map((col) => {
                      const product = row * col
                      const isHighlighted = highlightNum > 0 && product % highlightNum === 0
                      const isDiagonal = row === col
                      return (
                        <td
                          key={col}
                          className={`px-3 py-2 text-center border-r border-b font-mono tabular-nums transition-colors ${
                            isHighlighted
                              ? "bg-yellow-200/60 dark:bg-yellow-500/20 font-bold text-yellow-800 dark:text-yellow-300"
                              : isDiagonal
                              ? "bg-primary/5 font-semibold"
                              : "bg-card hover:bg-muted/50"
                          }`}
                        >
                          {product}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-center text-muted-foreground print:hidden">
            Diagonal cells are squares. {highlightNum > 0 && `Yellow cells are multiples of ${highlightNum}.`}
          </p>

        </CardContent>
      </Card>
    </div>
  )
}
