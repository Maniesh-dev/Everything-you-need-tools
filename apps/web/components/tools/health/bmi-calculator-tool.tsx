"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export function BmiCalculatorTool() {
  const [unit, setUnit] = React.useState<"metric" | "imperial">("metric");
  const [weightMetric, setWeightMetric] = React.useState("70");
  const [heightMetric, setHeightMetric] = React.useState("175");
  
  const [weightImperial, setWeightImperial] = React.useState("154");
  const [heightFeet, setHeightFeet] = React.useState("5");
  const [heightInches, setHeightInches] = React.useState("9");

  const calc = () => {
    let w = 0;
    let h = 0; // in meters
    if (unit === "metric") {
      w = parseFloat(weightMetric);
      h = parseFloat(heightMetric) / 100;
    } else {
      w = parseFloat(weightImperial) * 0.453592;
      h = ((parseFloat(heightFeet) * 12) + parseFloat(heightInches)) * 0.0254;
    }

    if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) return { bmi: 0, status: "", ideal: "", color: "" };

    const bmi = w / (h * h);
    
    let status = "";
    let color = "";
    if (bmi < 18.5) { status = "Underweight"; color = "text-blue-500"; }
    else if (bmi < 25) { status = "Normal weight"; color = "text-green-500"; }
    else if (bmi < 30) { status = "Overweight"; color = "text-orange-500"; }
    else { status = "Obese"; color = "text-red-500"; }

    // ideal based on BMI 22
    const idealKg = 22 * (h * h);
    const idealStr = unit === "metric" ? `${idealKg.toFixed(1)} kg` : `${(idealKg * 2.20462).toFixed(1)} lbs`;

    return { bmi, status, ideal: idealStr, color };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>BMI & Ideal Weight</CardTitle><CardDescription>Calculate your Body Mass Index and find your ideal target weight.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex gap-2 p-1 bg-muted/20 border rounded-lg max-w-xs mb-4">
          <Button variant={unit === "metric" ? "default" : "ghost"} onClick={() => setUnit("metric")} className="flex-1">Metric (kg/cm)</Button>
          <Button variant={unit === "imperial" ? "default" : "ghost"} onClick={() => setUnit("imperial")} className="flex-1">Imperial (lbs/ft)</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {unit === "metric" ? (
            <>
              <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" min="0" value={weightMetric} onChange={e => setWeightMetric(e.target.value)} /></div>
              <div className="space-y-2"><Label>Height (cm)</Label><Input type="number" min="0" value={heightMetric} onChange={e => setHeightMetric(e.target.value)} /></div>
            </>
          ) : (
            <>
              <div className="space-y-2"><Label>Weight (lbs)</Label><Input type="number" min="0" value={weightImperial} onChange={e => setWeightImperial(e.target.value)} /></div>
              <div className="space-y-2"><Label>Height</Label>
                <div className="flex gap-2">
                  <div className="flex-1"><Input type="number" min="0" value={heightFeet} onChange={e => setHeightFeet(e.target.value)} placeholder="Ft" /></div>
                  <div className="flex-1"><Input type="number" min="0" value={heightInches} onChange={e => setHeightInches(e.target.value)} placeholder="In" /></div>
                </div>
              </div>
            </>
          )}
        </div>

        {res.bmi > 0 && (
          <div className="pt-6 border-t mt-4 text-center space-y-4">
            <div className="p-6 bg-muted/10 border rounded-xl">
              <p className="text-sm tracking-wider uppercase font-semibold text-muted-foreground">Your BMI</p>
              <div className={`text-6xl font-black tabular-nums my-2 ${res.color}`}>{res.bmi.toFixed(1)}</div>
              <div className={`text-lg font-bold uppercase ${res.color} bg-current/10 inline-block px-4 py-1 rounded-full`}>{res.status}</div>
            </div>
            <div className="p-4 bg-muted/30 border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ideal Target Weight</p>
              <p className="text-xl font-bold tabular-nums mt-1">{res.ideal}</p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
