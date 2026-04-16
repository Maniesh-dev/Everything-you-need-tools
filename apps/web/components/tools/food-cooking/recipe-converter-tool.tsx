"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

type ConversionMap = Record<string, Record<string, number>>;

// Very simplified conversion factors (approximate for water/general baking)
const factors: ConversionMap = {
  cups: { cups: 1, tbsp: 16, tsp: 48, ml: 240, grams: 240, oz: 8 },
  tbsp: { cups: 0.0625, tbsp: 1, tsp: 3, ml: 15, grams: 15, oz: 0.5 },
  tsp: { cups: 0.0208, tbsp: 0.333, tsp: 1, ml: 5, grams: 5, oz: 0.166 },
  ml: { cups: 0.00416, tbsp: 0.0666, tsp: 0.2, ml: 1, grams: 1, oz: 0.0338 },
  grams: { cups: 0.00416, tbsp: 0.0666, tsp: 0.2, ml: 1, grams: 1, oz: 0.0352 },
  oz: { cups: 0.125, tbsp: 2, tsp: 6, ml: 29.57, grams: 28.35, oz: 1 },
};

const units = ["cups", "tbsp", "tsp", "ml", "grams", "oz"];

export function RecipeConverterTool() {
  const [value, setValue] = React.useState("1");
  const [fromUnit, setFromUnit] = React.useState("cups");
  const [toUnit, setToUnit] = React.useState("grams");

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    
    // safe fallback
    const rate = factors[fromUnit]?.[toUnit] || 1;
    return val * rate;
  };

  const result = convert();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Recipe Unit Converter</CardTitle><CardDescription>Quickly convert between common cooking measurements.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-2 lg:col-span-2">
             <Label>Amount</Label>
             <div className="flex gap-2">
                <Input type="number" min="0" value={value} onChange={e => setValue(e.target.value)} className="w-1/2" />
                <select className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center pb-2">
             <span className="text-2xl text-muted-foreground">=</span>
          </div>

          <div className="space-y-2 lg:col-span-2">
             <Label>Converted</Label>
             <div className="flex gap-2">
                <div className="flex-1 h-10 px-3 rounded-md border bg-muted/20 flex items-center font-bold tabular-nums">
                  {result.toFixed(2)}
                </div>
                <select className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm" value={toUnit} onChange={e => setToUnit(e.target.value)}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
           <p className="text-xs text-orange-600 font-medium">Note: Gram to Volume conversions vary by ingredient density. These are standard liquid/water approximations.</p>
        </div>

      </CardContent>
    </Card>
  );
}
