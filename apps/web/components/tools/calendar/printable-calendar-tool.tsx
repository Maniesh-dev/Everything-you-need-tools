"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Label } from "@workspace/ui/components/label"
import { Printer, CaretLeft, CaretRight } from "@phosphor-icons/react"

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // Returns 0=Mon, 1=Tue, ... 6=Sun (ISO week)
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function PrintableCalendarTool() {
  const now = new Date()
  const [month, setMonth] = React.useState(now.getMonth())
  const [year, setYear] = React.useState(now.getFullYear())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells: (number | null)[] = []

  // Leading blanks
  for (let i = 0; i < firstDay; i++) cells.push(null)
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Trailing blanks to fill the grid
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handlePrint = () => {
    window.print()
  }

  const todayDate = now.getDate()
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="text-primary" /> Printable Calendar
          </CardTitle>
          <CardDescription>Generate a clean monthly calendar for any month. Use the print button to save or print.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Controls - hidden during print */}
          <div className="flex flex-wrap gap-4 items-end print:hidden">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={String(month)} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((name, i) => (
                    <SelectItem key={i} value={String(i)}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setYear(y => y - 1)}>
                  <CaretLeft />
                </Button>
                <span className="w-16 text-center font-bold text-lg tabular-nums">{year}</span>
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setYear(y => y + 1)}>
                  <CaretRight />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={prevMonth}><CaretLeft className="mr-1" /> Prev</Button>
              <Button variant="outline" onClick={nextMonth}>Next <CaretRight className="ml-1" /></Button>
              <Button onClick={handlePrint} className="shadow-md">
                <Printer className="mr-2" /> Print
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-black">
            {/* Month/Year Header */}
            <div className="bg-primary text-primary-foreground py-4 px-6 text-center print:bg-black print:text-white">
              <h2 className="text-2xl font-bold tracking-wide">{MONTH_NAMES[month]} {year}</h2>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b bg-muted/50">
              {DAY_HEADERS.map((d) => (
                <div key={d} className="py-2 text-center text-sm font-bold text-muted-foreground border-r last:border-r-0">
                  {d}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`
                    min-h-[70px] md:min-h-[90px] p-2 border-r border-b last:border-r-0 text-sm
                    ${day ? "bg-card" : "bg-muted/20"}
                    ${isCurrentMonth && day === todayDate ? "bg-primary/10 font-bold" : ""}
                    print:min-h-[80px]
                  `}
                >
                  {day && (
                    <span className={`
                      inline-flex items-center justify-center rounded-full w-7 h-7 text-sm
                      ${isCurrentMonth && day === todayDate ? "bg-primary text-primary-foreground" : ""}
                    `}>
                      {day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
