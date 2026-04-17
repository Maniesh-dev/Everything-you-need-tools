"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { CalendarDots, Info } from "@phosphor-icons/react"

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

function getQuarter(date: Date): number {
  return Math.ceil((date.getMonth() + 1) / 3)
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function WeekNumberTool() {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const [dateStr, setDateStr] = React.useState(todayStr)

  const date = React.useMemo(() => {
    const d = new Date(dateStr + "T00:00:00")
    return isNaN(d.getTime()) ? null : d
  }, [dateStr])

  const stats = React.useMemo(() => {
    if (!date) return null
    const year = date.getFullYear()
    const totalDays = isLeapYear(year) ? 366 : 365
    const dayOfYear = getDayOfYear(date)
    return {
      weekNumber: getISOWeekNumber(date),
      dayOfYear,
      quarter: getQuarter(date),
      daysRemaining: totalDays - dayOfYear,
      totalDays,
      isLeap: isLeapYear(year),
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
    }
  }, [date])

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDots className="text-primary" /> Week Number Calculator
          </CardTitle>
          <CardDescription>Find the ISO week number, day of year, and quarter for any date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-2">
            <Label>Select a Date</Label>
            <Input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="max-w-xs" />
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center col-span-2 md:col-span-1">
                <div className="text-4xl font-black text-primary">{stats.weekNumber}</div>
                <div className="text-sm text-muted-foreground mt-1 font-medium">ISO Week Number</div>
              </div>

              <div className="bg-muted/50 border rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{stats.dayOfYear}</div>
                <div className="text-sm text-muted-foreground mt-1">Day of Year</div>
              </div>

              <div className="bg-muted/50 border rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">Q{stats.quarter}</div>
                <div className="text-sm text-muted-foreground mt-1">Quarter</div>
              </div>

              <div className="bg-muted/50 border rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{stats.daysRemaining}</div>
                <div className="text-sm text-muted-foreground mt-1">Days Remaining</div>
              </div>

              <div className="bg-muted/50 border rounded-xl p-5 text-center">
                <div className="text-3xl font-bold">{stats.dayName}</div>
                <div className="text-sm text-muted-foreground mt-1">Day of Week</div>
              </div>

              <div className="bg-muted/50 border rounded-xl p-5 text-center">
                <div className="text-3xl font-bold flex items-center justify-center gap-2">
                  {stats.totalDays}
                  {stats.isLeap && <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full font-semibold">Leap</span>}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Days in Year</div>
              </div>

            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg mt-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>Week numbers follow the ISO 8601 standard where weeks start on Monday and Week 1 contains the first Thursday of the year.</span>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
