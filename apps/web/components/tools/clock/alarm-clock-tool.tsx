"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function AlarmClockTool() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [alarmTime, setAlarmTime] = React.useState("");
  const [alarmSet, setAlarmSet] = React.useState(false);
  const [isRinging, setIsRinging] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (alarmSet && alarmTime && !isRinging) {
        const h = pad(now.getHours());
        const m = pad(now.getMinutes());
        if (`${h}:${m}` === alarmTime) {
          setIsRinging(true);
          setAlarmSet(false);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarmSet, alarmTime, isRinging]);

  const toggleAlarm = () => {
    if (isRinging) {
      setIsRinging(false);
    } else {
      if (alarmTime) setAlarmSet(!alarmSet);
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Alarm Clock</CardTitle><CardDescription>Browser-based alarm clock.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        
        <div className={`w-full p-8 rounded-3xl border shadow-inner text-center transition-all duration-500 ${isRinging ? "bg-red-500/20 text-red-500 border-red-500/50 animate-pulse" : "bg-muted/20"}`}>
          <div className="font-mono text-5xl sm:text-7xl font-bold tracking-tighter">
            {pad(currentTime.getHours())}:{pad(currentTime.getMinutes())}<span className="text-2xl sm:text-4xl text-muted-foreground opacity-50 ml-2">{pad(currentTime.getSeconds())}</span>
          </div>
          {isRinging && <div className="mt-4 font-bold uppercase tracking-widest animate-bounce">Wake Up!</div>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end w-full max-w-sm">
          <div className="space-y-2 flex-1 w-full">
            <Label>Set Alarm Time</Label>
            <Input type="time" value={alarmTime} onChange={e => setAlarmTime(e.target.value)} disabled={alarmSet || isRinging} className="text-lg py-6" />
          </div>
          <Button size="lg" className="h-[52px] sm:w-32 w-full font-bold" onClick={toggleAlarm} variant={isRinging ? "destructive" : alarmSet ? "secondary" : "default"} disabled={!alarmTime && !isRinging}>
            {isRinging ? "Stop" : alarmSet ? "Turn Off" : "Set Alarm"}
          </Button>
        </div>

        {alarmSet && (
          <p className="text-sm text-green-600 dark:text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
            Alarm set for <span className="font-bold">{alarmTime}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
