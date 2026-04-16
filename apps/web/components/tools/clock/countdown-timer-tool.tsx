"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function CountdownTimerTool() {
  const [inputMin, setInputMin] = React.useState("5");
  const [inputSec, setInputSec] = React.useState("0");
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 mins in seconds
  const [running, setRunning] = React.useState(false);
  
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, timeLeft]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    let m = parseInt(inputMin);
    let s = parseInt(inputSec);
    if (isNaN(m)) m = 0;
    if (isNaN(s)) s = 0;
    setTimeLeft(m * 60 + s);
  };

  const handleSet = () => {
    reset();
  };

  const format = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  };

  const isDone = timeLeft === 0 && !running;

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Countdown Timer</CardTitle><CardDescription>Set a timer and countdown to zero.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        {!running && !isDone && timeLeft === parseInt(inputMin || "0") * 60 + parseInt(inputSec || "0") && (
          <div className="flex gap-2 items-center bg-muted/20 p-4 rounded-2xl w-full justify-center">
            <div className="space-y-1"><Input type="number" value={inputMin} onChange={e => setInputMin(e.target.value)} className="w-16 text-center" min="0" /><p className="text-[10px] text-center text-muted-foreground uppercase">Min</p></div>
            <span className="mb-4 font-bold">:</span>
            <div className="space-y-1"><Input type="number" value={inputSec} onChange={e => setInputSec(e.target.value)} className="w-16 text-center" min="0" max="59" /><p className="text-[10px] text-center text-muted-foreground uppercase">Sec</p></div>
            <div className="ml-4 space-y-1"><Button onClick={handleSet} variant="secondary">Set</Button><p className="text-[10px] text-center opacity-0">_</p></div>
          </div>
        )}

        <div className={`font-mono text-7xl font-bold tabular-nums tracking-tighter w-full text-center p-8 rounded-3xl border shadow-inner transition-colors duration-500 ${isDone ? "bg-red-500/20 text-red-500 border-red-500/50 animate-pulse" : "bg-muted/20 text-primary"}`}>
          {format(timeLeft)}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center w-full">
          {!running ? (
            <Button size="lg" className="w-32 font-bold" onClick={start} disabled={timeLeft === 0}>Start</Button>
          ) : (
            <Button size="lg" className="w-32 font-bold" onClick={pause} variant="secondary">Pause</Button>
          )}
          <Button size="lg" variant="outline" className="w-24" onClick={reset}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}
