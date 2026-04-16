"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

interface Timer {
  id: string;
  name: string;
  duration: number; // original seconds
  timeLeft: number; // current seconds
  running: boolean;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function CookingTimerTool() {
  const [timers, setTimers] = React.useState<Timer[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => {
        if (t.running && t.timeLeft > 0) {
          return { ...t, timeLeft: t.timeLeft - 1, running: t.timeLeft - 1 > 0 };
        }
        return t;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTimer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string) || `Timer ${timers.length + 1}`;
    const min = parseInt(fd.get("min") as string) || 0;
    const sec = parseInt(fd.get("sec") as string) || 0;
    const duration = min * 60 + sec;

    if (duration > 0) {
       setTimers([...timers, { id: crypto.randomUUID(), name, duration, timeLeft: duration, running: true }]);
       e.currentTarget.reset();
    }
  };

  const toggle = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, running: !t.running && t.timeLeft > 0 } : t));
  };

  const reset = (id: string) => {
    setTimers(prev => prev.map(t => t.id === id ? { ...t, timeLeft: t.duration, running: false } : t));
  };
  
  const remove = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const format = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${pad(m)}:${pad(s)}`;
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Multiple Cooking Timer</CardTitle><CardDescription>Set multiple independent timers for different dishes.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <form onSubmit={addTimer} className="flex gap-2 flex-wrap items-end bg-muted/20 p-4 rounded-xl border">
          <div className="space-y-1 flex-1 min-w-[120px]">
             <span className="text-xs uppercase font-semibold text-muted-foreground ml-1">Label</span>
             <Input name="name" placeholder="Pasta, Bake, etc." />
          </div>
          <div className="space-y-1 w-20">
             <span className="text-xs uppercase font-semibold text-muted-foreground ml-1">Min</span>
             <Input name="min" type="number" min="0" placeholder="0" defaultValue="10" />
          </div>
          <div className="space-y-1 w-20">
             <span className="text-xs uppercase font-semibold text-muted-foreground ml-1">Sec</span>
             <Input name="sec" type="number" min="0" max="59" placeholder="0" defaultValue="0" />
          </div>
          <Button type="submit" className="shrink-0 mb-[2px]">Add Timer</Button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {timers.map((t) => {
            const isDone = t.timeLeft === 0;
            const progress = ((t.duration - t.timeLeft) / t.duration) * 100;
            
            return (
              <div key={t.id} className={`relative overflow-hidden p-4 rounded-2xl border transition-colors ${isDone ? 'bg-red-500/10 border-red-500/30' : 'bg-background'}`}>
                 <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                 </div>
                 
                 <div className="flex justify-between items-center mb-2 mt-2">
                    <h3 className="font-bold truncate pr-2">{t.name}</h3>
                    <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-destructive">&times;</button>
                 </div>
                 
                 <div className={`text-4xl font-mono font-bold tracking-tighter tabular-nums ${isDone ? 'text-red-500 animate-pulse' : ''}`}>
                    {format(t.timeLeft)}
                 </div>
                 
                 <div className="flex gap-2 mt-4">
                    <Button size="sm" variant={t.running ? "secondary" : isDone ? "outline" : "default"} onClick={() => toggle(t.id)} disabled={isDone} className="flex-1">
                      {t.running ? "Pause" : "Start"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reset(t.id)}>Reset</Button>
                 </div>
              </div>
            )
          })}
        </div>
        {timers.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
            No timers active. Add one above.
          </div>
        )}

      </CardContent>
    </Card>
  );
}
