"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function OneRepMaxTool() {
  const [weight, setWeight] = React.useState("100");
  const [reps, setReps] = React.useState("5");

  const calc = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return { epley: 0, brzycki: 0, percentages: [] };

    // Epley Formula: 1RM = W * (1 + r/30)
    const epley = w * (1 + r / 30);
    // Brzycki Formula: 1RM = W * (36 / (37 - r))
    const brzycki = w * (36 / (37 - r)) || 0;

    const base = Math.max(epley, brzycki); // usually close, take Epley as base for percentages
    
    const percentages = [
       { percent: 100, val: base * 1 },
       { percent: 95, val: base * 0.95 },
       { percent: 90, val: base * 0.90 },
       { percent: 85, val: base * 0.85 },
       { percent: 80, val: base * 0.80 },
       { percent: 75, val: base * 0.75 },
       { percent: 70, val: base * 0.70 },
    ];

    return { epley, brzycki, percentages };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>One Rep Max Calculator</CardTitle><CardDescription>Calculate your 1RM (One Rep Max) and view percentage breakdowns based on weight lifted and reps.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
          <div className="space-y-2">
            <Label>Weight Lifted (kg / lbs)</Label>
            <Input type="number" min="0" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Repetitions</Label>
            <Input type="number" min="1" max="30" value={reps} onChange={e => setReps(e.target.value)} />
          </div>
        </div>

        {res.epley > 0 && (
          <div className="pt-6 border-t mt-4 space-y-4">
            
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center space-y-2">
              <p className="text-sm tracking-wider uppercase font-semibold text-primary">Estimated 1 Rep Max</p>
              <div className="text-5xl font-bold tabular-nums text-primary">{Math.round(res.epley)}</div>
              <p className="text-xs text-muted-foreground mt-2">Epley: {Math.round(res.epley)} | Brzycki: {Math.round(res.brzycki)}</p>
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="font-semibold text-sm">Percentage Breakdown</h3>
              <div className="grid gap-2">
                <div className="flex bg-muted/20 px-4 py-2 rounded-lg font-mono text-sm border font-semibold">
                  <div className="flex-1">Percentage</div>
                  <div className="flex-1 text-right">Rep Range</div>
                  <div className="flex-1 text-right">Weight</div>
                </div>
                {res.percentages.map((p, i) => (
                  <div key={i} className="flex bg-muted/5 px-4 py-2 rounded-lg font-mono text-sm border-b last:border-0 border-border/50 items-center">
                    <div className="flex-1">{p.percent}%</div>
                    <div className="flex-1 text-right text-muted-foreground text-xs">{p.percent === 100 ? '1 Rep' : p.percent >= 90 ? '2-4 Reps' : p.percent >= 80 ? '5-8 Reps' : '9-12 Reps'}</div>
                    <div className="flex-1 text-right font-bold tabular-nums">{Math.round(p.val)}</div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}

      </CardContent>
    </Card>
  );
}
