"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { ClockCounterClockwise, Copy } from "@phosphor-icons/react"
import { toast } from "sonner"

const MINUTES = ["*", "0", "5", "10", "15", "20", "30", "45"]
const HOURS = ["*", "0", "1", "2", "3", "6", "8", "9", "12", "15", "18", "21"]
const DAYS = ["*", "1", "5", "10", "15", "20", "25", "28"]
const MONTHS = ["*", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
const WEEKDAYS_MAP: Record<string, string> = { "*": "Every day", "0": "Sunday", "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday" }
const WEEKDAYS = Object.keys(WEEKDAYS_MAP)
const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function describeCron(min: string, hour: string, day: string, month: string, weekday: string): string {
  const parts: string[] = []

  // Time
  if (min === "*" && hour === "*") parts.push("Every minute")
  else if (min === "*") parts.push(`Every minute of hour ${hour}`)
  else if (hour === "*") parts.push(`At minute ${min} of every hour`)
  else parts.push(`At ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`)

  // Day of month
  if (day !== "*") parts.push(`on day ${day}`)

  // Month
  if (month !== "*") parts.push(`of ${MONTH_NAMES[parseInt(month)] || month}`)

  // Weekday
  if (weekday !== "*") parts.push(`on ${WEEKDAYS_MAP[weekday]}s`)

  return parts.join(" ")
}

function getNextRuns(expression: string, count: number): Date[] {
  const [min, hour, day, month, weekday] = expression.split(" ")
  const results: Date[] = []
  const now = new Date()
  const candidate = new Date(now)
  candidate.setSeconds(0, 0)

  for (let i = 0; i < 1000 && results.length < count; i++) {
    candidate.setMinutes(candidate.getMinutes() + 1)

    const m = candidate.getMinutes()
    const h = candidate.getHours()
    const d = candidate.getDate()
    const mo = candidate.getMonth() + 1
    const wd = candidate.getDay()

    if (min !== "*" && m !== parseInt(min!)) continue
    if (hour !== "*" && h !== parseInt(hour!)) continue
    if (day !== "*" && d !== parseInt(day!)) continue
    if (month !== "*" && mo !== parseInt(month!)) continue
    if (weekday !== "*" && wd !== parseInt(weekday!)) continue

    results.push(new Date(candidate))
  }
  return results
}

export function CronBuilderTool() {
  const [min, setMin] = React.useState("0")
  const [hour, setHour] = React.useState("*")
  const [day, setDay] = React.useState("*")
  const [month, setMonth] = React.useState("*")
  const [weekday, setWeekday] = React.useState("*")

  const expression = `${min} ${hour} ${day} ${month} ${weekday}`
  const description = describeCron(min, hour, day, month, weekday)
  const nextRuns = React.useMemo(() => getNextRuns(expression, 5), [expression])

  const handleCopy = () => {
    navigator.clipboard.writeText(expression)
    toast.success("CRON expression copied!")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockCounterClockwise className="text-primary" /> CRON Expression Builder
          </CardTitle>
          <CardDescription>Build cron expressions visually and see the next scheduled runs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Minute</Label>
              <Select value={min} onValueChange={setMin}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MINUTES.map(v => <SelectItem key={v} value={v}>{v === "*" ? "Every" : v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Hour</Label>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{HOURS.map(v => <SelectItem key={v} value={v}>{v === "*" ? "Every" : v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DAYS.map(v => <SelectItem key={v} value={v}>{v === "*" ? "Every" : v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map(v => <SelectItem key={v} value={v}>{v === "*" ? "Every" : MONTH_NAMES[parseInt(v)] || v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Weekday</Label>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{WEEKDAYS.map(v => <SelectItem key={v} value={v}>{WEEKDAYS_MAP[v]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Expression Output */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Expression</Label>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
                <Copy className="mr-1" size={14} /> Copy
              </Button>
            </div>
            <div className="font-mono text-2xl md:text-3xl font-black text-primary tracking-widest text-center py-2">
              {expression}
            </div>
            <p className="text-sm text-center text-muted-foreground font-medium">{description}</p>
          </div>

          {/* Next Runs */}
          {nextRuns.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Next 5 Scheduled Runs</Label>
              <div className="space-y-2">
                {nextRuns.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-2 text-sm font-mono">
                    <span className="bg-primary/20 text-primary font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs">{i + 1}</span>
                    <span>{d.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
