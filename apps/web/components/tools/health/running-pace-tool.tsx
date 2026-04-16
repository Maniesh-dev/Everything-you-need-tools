"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";

export function RunningPaceTool() {
  const [distance, setDistance] = React.useState("5");
  const [distUnit, setDistUnit] = React.useState("km");
  
  const [hours, setHours] = React.useState("0");
  const [minutes, setMinutes] = React.useState("25");
  const [seconds, setSeconds] = React.useState("0");

  const [pace, setPace] = React.useState<{ min: number; sec: number } | null>(null);

  const calculatePace = () => {
    const totalSec = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
    const distNum = Number(distance);
    
    if (totalSec <= 0 || distNum <= 0) return;

    let distInKm = distNum;
    if (distUnit === "miles") distInKm = distNum * 1.60934;

    const paceSecPerKm = totalSec / distInKm;
    const paceMin = Math.floor(paceSecPerKm / 60);
    const paceSec = Math.round(paceSecPerKm % 60);

    setPace({ min: paceMin, sec: paceSec });
  };

  const setPreset = (d: string, u: string) => {
    setDistance(d);
    setDistUnit(u);
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle>Running Pace Calculator</CardTitle>
        <CardDescription>Calculate your running pace (min/km) based on your time and distance goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex flex-wrap gap-2 mb-2">
           <Button variant="outline" size="sm" onClick={() => setPreset("5", "km")}>5K</Button>
           <Button variant="outline" size="sm" onClick={() => setPreset("10", "km")}>10K</Button>
           <Button variant="outline" size="sm" onClick={() => setPreset("21.1", "km")}>Half Marathon</Button>
           <Button variant="outline" size="sm" onClick={() => setPreset("42.2", "km")}>Marathon</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
           <div className="space-y-2">
              <Label>Distance</Label>
              <div className="flex gap-2">
                <Input type="number" step="0.01" value={distance} onChange={e => setDistance(e.target.value)} />
                <Select value={distUnit} onValueChange={setDistUnit}>
                   <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                   <SelectContent>
                      <SelectItem value="km">KM</SelectItem>
                      <SelectItem value="miles">Miles</SelectItem>
                   </SelectContent>
                </Select>
              </div>
           </div>
           <div className="space-y-2">
              <Label>Target Time (HH:MM:SS)</Label>
              <div className="flex gap-2">
                 <Input type="number" placeholder="HH" value={hours} onChange={e => setHours(e.target.value)} />
                 <Input type="number" placeholder="MM" value={minutes} onChange={e => setMinutes(e.target.value)} />
                 <Input type="number" placeholder="SS" value={seconds} onChange={e => setSeconds(e.target.value)} />
              </div>
           </div>
        </div>

        <Button className="w-full font-bold" onClick={calculatePace}>Calculate Pace</Button>

        {pace && (
          <div className="pt-6 border-t text-center space-y-2">
             <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Required Pace</p>
             <div className="text-5xl font-black">{pace.min}:{pace.sec.toString().padStart(2, '0')} <span className="text-xl font-medium text-muted-foreground">min / km</span></div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
