"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function PomodoroTimerTool() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  
  const [timeLeft, setTimeLeft] = React.useState(WORK_TIME);
  const [running, setRunning] = React.useState(false);
  const [mode, setMode] = React.useState<"work" | "break">("work");
  
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
             setRunning(false);
             if (timerRef.current) clearInterval(timerRef.current);
             // auto switch
             if (mode === "work") {
               setMode("break");
               return BREAK_TIME;
             } else {
               setMode("work");
               return WORK_TIME;
             }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, timeLeft, mode]);

  const toggle = () => setRunning(!running);
  
  const reset = () => {
    setRunning(false);
    setTimeLeft(mode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (m: "work" | "break") => {
    setRunning(false);
    setMode(m);
    setTimeLeft(m === "work" ? WORK_TIME : BREAK_TIME);
  };

  const format = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${pad(m)}:${pad(s)}`;
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Pomodoro Timer</CardTitle><CardDescription>Boost productivity with the 25-minute Pomodoro Technique.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        
        <div className="flex gap-2 p-1 bg-muted/20 border rounded-full max-w-xs mb-4">
          <Button variant={mode === "work" ? "default" : "ghost"} onClick={() => switchMode("work")} className="flex-1 rounded-full">Work (25m)</Button>
          <Button variant={mode === "break" ? "default" : "ghost"} onClick={() => switchMode("break")} className="flex-1 rounded-full text-green-600 dark:text-green-400">Break (5m)</Button>
        </div>

        <div className={`w-full max-w-sm aspect-square max-h-[300px] flex items-center justify-center rounded-full border-[12px] shadow-inner transition-colors duration-1000 ${mode === "work" ? "border-primary bg-primary/5" : "border-green-500 bg-green-500/5 text-green-600 dark:text-green-400"}`}>
          <div className="font-mono text-7xl sm:text-8xl font-bold tabular-nums tracking-tighter">
            {format(timeLeft)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center w-full max-w-sm mt-4">
          <Button size="lg" className="flex-1 font-bold h-14 text-lg" variant={running ? "destructive" : "default"} onClick={toggle}>
            {running ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" className="w-24 h-14" onClick={reset}>Reset</Button>
        </div>

      </CardContent>
    </Card>
  );
}
