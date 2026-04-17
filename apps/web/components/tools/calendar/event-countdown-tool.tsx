"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Timer, Confetti } from "@phosphor-icons/react"

export function EventCountdownTool() {
  const [eventName, setEventName] = React.useState("My Event")
  const [targetDate, setTargetDate] = React.useState("")
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const diff = React.useMemo(() => {
    if (!targetDate) return null
    const target = new Date(targetDate + "T00:00:00")
    if (isNaN(target.getTime())) return null

    const ms = target.getTime() - now.getTime()
    if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }

    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))

    return { days, hours, minutes, seconds, expired: false }
  }, [targetDate, now])

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="text-primary" /> Event Countdown
          </CardTitle>
          <CardDescription>Set a future date and watch a real-time countdown to your event.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. Product Launch" />
            </div>
            <div className="space-y-2">
              <Label>Target Date</Label>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
          </div>

          {diff && (
            <div className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-muted-foreground">
                  {diff.expired ? "🎉 " : "⏳ "}
                  {eventName || "Your Event"}
                </h3>
              </div>

              {diff.expired ? (
                <div className="text-center py-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
                  <Confetti size={64} className="mx-auto text-green-500 mb-4" weight="fill" />
                  <h2 className="text-3xl font-black text-green-600 dark:text-green-400">Event Has Arrived!</h2>
                  <p className="text-muted-foreground mt-2">The countdown has reached zero.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: diff.days, label: "Days" },
                    { value: diff.hours, label: "Hours" },
                    { value: diff.minutes, label: "Minutes" },
                    { value: diff.seconds, label: "Seconds" },
                  ].map((unit) => (
                    <div key={unit.label} className="bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/20 rounded-2xl p-6 text-center shadow-sm">
                      <div className="text-5xl md:text-6xl font-black text-primary tabular-nums leading-none">
                        {String(unit.value).padStart(2, "0")}
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground mt-3 uppercase tracking-widest">
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!targetDate && (
            <div className="text-center py-12 text-muted-foreground">
              <Timer size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Pick a date above to start counting down.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
