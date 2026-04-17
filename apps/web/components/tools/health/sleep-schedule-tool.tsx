"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Clock as ClockIcon, Moon as MoonIcon, Sun as SunIcon, Info as InfoIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";


interface SleepCycle {
  time: string;
  cycles: number;
  duration: string;
  recommended: boolean;
}

export function SleepScheduleTool() {
  const [mode, setMode] = React.useState<"wake" | "sleep">("wake");
  const [time, setTime] = React.useState("07:00");
  const [results, setResults] = React.useState<SleepCycle[]>([]);

  // Average time to fall asleep
  const FALL_ASLEEP_MINUTES = 15;
  // One sleep cycle is roughly 90 minutes
  const SLEEP_CYCLE_MINUTES = 90;

  const calculateTimes = () => {
    if (!time) return;

    // Parse input time
    const [hoursStr = "0", minutesStr = "0"] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hoursStr), parseInt(minutesStr), 0, 0);

    const newResults: SleepCycle[] = [];

    if (mode === "wake") {
      // Calculate backwards from wake time
      // 6, 5, 4, 3 cycles
      for (let i = 6; i >= 3; i--) {
        const cycleDate = new Date(date.getTime());
        // Subtract (cycles * 90 mins) and (15 mins to fall asleep)
        const totalMinutes = (i * SLEEP_CYCLE_MINUTES) + FALL_ASLEEP_MINUTES;
        cycleDate.setMinutes(cycleDate.getMinutes() - totalMinutes);

        newResults.push({
          time: formatTimeObj(cycleDate),
          cycles: i,
          duration: `${(i * 1.5).toFixed(1)} hours`,
          recommended: i === 5 || i === 6 // 5 or 6 cycles is optimal (7.5-9 hours)
        });
      }
    } else {
      // Calculate forwards from sleep time
      // Add 15 mins to fall asleep, then add 3, 4, 5, 6 cycles
      const awakeDate = new Date(date.getTime());
      awakeDate.setMinutes(awakeDate.getMinutes() + FALL_ASLEEP_MINUTES);

      for (let i = 3; i <= 6; i++) {
        const cycleDate = new Date(awakeDate.getTime());
        cycleDate.setMinutes(cycleDate.getMinutes() + (i * SLEEP_CYCLE_MINUTES));

        newResults.push({
          time: formatTimeObj(cycleDate),
          cycles: i,
          duration: `${(i * 1.5).toFixed(1)} hours`,
          recommended: i === 5 || i === 6
        });
      }
    }

    setResults(newResults);
  };

  const formatTimeObj = (d: Date) => {
    let hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${mins} ${ampm}`;
  };

  const formatInputTimeForDisplay = () => {
    if (!time) return "";
    const [h = "0", m = "0"] = time.split(":");
    let dh = parseInt(h);
    const ampm = dh >= 12 ? 'pm' : 'am';
    dh = dh % 12 || 12;
    return `${dh}:${m} ${ampm}`;
  };

  // Run initial calculation when tab changes or initially
  React.useEffect(() => {
    calculateTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, time]);

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Sleep Schedule Optimizer</CardTitle>
        <CardDescription>Calculate the optimal times to go to sleep or wake up so you don't wake up groggy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="wake"><SunIcon className="h-4 w-4 mr-2" /> I want to wake up at</TabsTrigger>
            <TabsTrigger value="sleep"><MoonIcon className="h-4 w-4 mr-2" /> I am going to bed at</TabsTrigger>
          </TabsList>

          <div className="flex items-end gap-4 justify-center">
            <div className="space-y-2">
              <Label>{mode === "wake" ? "Wake time" : "Bed time"}</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-2xl h-14 w-48 text-center"
              />
            </div>
            <Button size="lg" className="h-14" onClick={calculateTimes}>Calculate</Button>
          </div>
        </Tabs>

        {results.length > 0 && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-center font-medium text-lg mb-6">
              {mode === "wake"
                ? <span>To wake up fresh at <strong className="text-primary">{formatInputTimeForDisplay()}</strong>, go to bed at one of these times:</span>
                : <span>If you sleep at <strong className="text-primary">{formatInputTimeForDisplay()}</strong>, wake up at one of these times:</span>
              }
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((rc, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center p-6 border rounded-2xl transition-all ${rc.recommended
                      ? 'bg-primary/10 border-primary shadow-sm scale-105 z-10'
                      : 'bg-muted/30 border-border/50 hover:border-border'
                    }`}
                >
                  {rc.recommended && (
                    <Badge className="absolute -top-3">Recommended</Badge>
                  )}
                  <span className={`text-3xl font-bold font-heading mb-2 ${rc.recommended ? 'text-primary' : 'text-foreground'}`}>
                    {rc.time}
                  </span>
                  <div className="flex flex-col items-center text-sm text-muted-foreground mt-2">
                    <span className="font-medium flex items-center"><ClockIcon className="h-3.5 w-3.5 mr-1" /> {rc.duration} of sleep</span>
                    <span className="mt-1">{rc.cycles} sleep cycles</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900 rounded-xl p-4 flex items-start gap-3">
              <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">How does this work?</h4>
                <p className="text-sm mt-1 opacity-90">
                  A good night's sleep consists of 5-6 complete sleep cycles. Each cycle lasts about 90 minutes.
                  Waking up in the middle of a sleep cycle leaves you feeling groggy and tired.
                  These calculations also factor in the average 15 minutes it takes to fall asleep.
                </p>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
