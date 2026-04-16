"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export function SpeedDistanceTimeControl() {
  const [mode, setMode] = React.useState<"speed" | "distance" | "time">("speed");
  const [speed, setSpeed] = React.useState("60");
  const [distance, setDistance] = React.useState("120");
  const [time, setTime] = React.useState("2");

  const solve = () => {
    const s = parseFloat(speed);
    const d = parseFloat(distance);
    const t = parseFloat(time);

    if (mode === "speed") {
      if (isNaN(d) || isNaN(t) || t === 0) return { speed: 0, distance: d, time: t };
      return { speed: d / t, distance: d, time: t };
    } else if (mode === "distance") {
      if (isNaN(s) || isNaN(t)) return { speed: s, distance: 0, time: t };
      return { speed: s, distance: s * t, time: t };
    } else {
      if (isNaN(s) || isNaN(d) || s === 0) return { speed: s, distance: d, time: 0 };
      return { speed: s, distance: d, time: d / s };
    }
  };

  const res = solve();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Speed, Distance & Time</CardTitle><CardDescription>Calculate the missing variable when given the other two.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex gap-2 p-1 bg-muted/20 border rounded-lg max-w-sm mb-4">
          <Button variant={mode === "speed" ? "default" : "ghost"} onClick={() => setMode("speed")} className="flex-1 text-xs sm:text-sm px-2">Find Speed</Button>
          <Button variant={mode === "distance" ? "default" : "ghost"} onClick={() => setMode("distance")} className="flex-1 text-xs sm:text-sm px-2">Find Distance</Button>
          <Button variant={mode === "time" ? "default" : "ghost"} onClick={() => setMode("time")} className="flex-1 text-xs sm:text-sm px-2">Find Time</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label className={mode === "speed" ? "text-primary font-bold" : ""}>Speed {mode === "speed" && "(Result)"}</Label>
            {mode === "speed" ? (
              <div className="h-10 px-3 rounded-md border bg-primary/10 border-primary/20 flex items-center font-bold text-primary">{res.speed.toFixed(2)}</div>
            ) : (
              <Input type="number" min="0" value={speed} onChange={e => setSpeed(e.target.value)} />
            )}
          </div>
          
          <div className="space-y-2">
            <Label className={mode === "distance" ? "text-primary font-bold" : ""}>Distance {mode === "distance" && "(Result)"}</Label>
            {mode === "distance" ? (
              <div className="h-10 px-3 rounded-md border bg-primary/10 border-primary/20 flex items-center font-bold text-primary">{res.distance.toFixed(2)}</div>
            ) : (
              <Input type="number" min="0" value={distance} onChange={e => setDistance(e.target.value)} />
            )}
          </div>
          
          <div className="space-y-2">
            <Label className={mode === "time" ? "text-primary font-bold" : ""}>Time {mode === "time" && "(Result)"}</Label>
            {mode === "time" ? (
              <div className="h-10 px-3 rounded-md border bg-primary/10 border-primary/20 flex items-center font-bold text-primary">{res.time.toFixed(2)}</div>
            ) : (
              <Input type="number" min="0" value={time} onChange={e => setTime(e.target.value)} />
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
