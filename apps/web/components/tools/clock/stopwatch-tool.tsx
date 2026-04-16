"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

function pad(num: number) { return num.toString().padStart(2, "0"); }

export function StopwatchTool() {
  const [time, setTime] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [laps, setLaps] = React.useState<number[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const toggle = () => setRunning(!running);
  
  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  const lap = () => { if (running) setLaps(prev => [time, ...prev]); };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Online Stopwatch</CardTitle><CardDescription>Precise online stopwatch with lap timing features.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div className="font-mono text-6xl font-bold tabular-nums tracking-tighter text-primary bg-muted/20 p-8 rounded-3xl w-full text-center border shadow-inner">
          {formatTime(time)}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center w-full">
          <Button size="lg" className="w-32 font-bold" variant={running ? "destructive" : "default"} onClick={toggle}>
            {running ? "Stop" : "Start"}
          </Button>
          <Button size="lg" variant="outline" className="w-24" onClick={lap} disabled={!running}>Lap</Button>
          <Button size="lg" variant="secondary" className="w-24" onClick={reset} disabled={time === 0 && !running}>Reset</Button>
        </div>

        {laps.length > 0 && (
          <div className="w-full mt-4 space-y-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground flex justify-between px-2"><span>Lap</span><span>Time</span></h3>
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {laps.map((lapTime, i) => {
                const prev = laps[i + 1] || 0;
                const diff = lapTime - prev;
                return (
                  <div key={i} className="flex justify-between items-center bg-muted/20 p-3 rounded-xl border border-border/50">
                    <span className="font-mono text-xs text-muted-foreground">Lap {laps.length - i}</span>
                    <div className="flex gap-4">
                      {i < laps.length - 1 && <span className="font-mono text-xs text-muted-foreground">+{formatTime(diff)}</span>}
                      <span className="font-mono font-semibold">{formatTime(lapTime)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
