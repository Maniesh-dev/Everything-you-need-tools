"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function WaterIntakeTool() {
  const [weight, setWeight] = React.useState("70");
  const [exercise, setExercise] = React.useState("30");

  const calc = () => {
    const w = parseFloat(weight); // kg
    const e = parseFloat(exercise); // minutes

    if (isNaN(w) || isNaN(e) || w <= 0) return { liters: 0, glasses: 0 };

    // approx 35ml per kg
    let ml = w * 35;
    // plus approx 12ml for every min of exercise
    ml += e * 12;

    const liters = ml / 1000;
    const glasses = Math.round(ml / 250); // 250ml glasses

    return { liters, glasses };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Water Intake Calculator</CardTitle><CardDescription>Calculate your recommended daily water intake based on weight and activity.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Body Weight (kg)</Label>
            <Input type="number" min="0" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Daily Exercise (minutes)</Label>
            <Input type="number" min="0" value={exercise} onChange={e => setExercise(e.target.value)} />
          </div>
        </div>

        {res.liters > 0 && (
          <div className="pt-6 border-t mt-4 text-center space-y-4">
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-2">
              <p className="text-sm tracking-wider uppercase font-semibold text-blue-600 dark:text-blue-400">Total Daily Water</p>
              <div className="text-5xl font-bold tabular-nums text-blue-600 dark:text-blue-400">{res.liters.toFixed(1)} <span className="text-2xl text-blue-500/50">L</span></div>
            </div>
            
            <div className="p-4 bg-muted/30 border rounded-xl flex items-center justify-center gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold w-full">Which is roughly</p>
              <div className="text-3xl font-bold tabular-nums">{res.glasses}</div>
              <p className="text-sm text-muted-foreground font-medium">Glasses (250ml)</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
