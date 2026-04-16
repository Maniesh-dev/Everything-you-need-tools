"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function FuelCostTool() {
  const [distance, setDistance] = React.useState("500");
  const [efficiency, setEfficiency] = React.useState("15"); // km per liter
  const [price, setPrice] = React.useState("100"); // price per liter

  const calc = () => {
    const d = parseFloat(distance) || 0;
    const e = parseFloat(efficiency) || 0;
    const p = parseFloat(price) || 0;

    if (d <= 0 || e <= 0 || p <= 0) return { fuelNeeded: 0, cost: 0 };

    const fuelNeeded = d / e;
    const cost = fuelNeeded * p;

    return { fuelNeeded, cost };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Fuel Cost Calculator</CardTitle><CardDescription>Calculate fuel needed and total trip cost based on mileage.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Total Trip Distance</Label>
            <Input type="number" min="0" value={distance} onChange={e => setDistance(e.target.value)} placeholder="km or miles" />
          </div>
          <div className="space-y-2">
            <Label>Vehicle Efficiency</Label>
            <Input type="number" min="0" value={efficiency} onChange={e => setEfficiency(e.target.value)} placeholder="km/L or mpg" />
          </div>
          <div className="space-y-2">
            <Label>Fuel Price (per L or Gal)</Label>
            <Input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
        </div>

        <div className="pt-6 border-t mt-4 grid gap-4 md:grid-cols-2 text-center">
          <div className="bg-muted/30 p-4 rounded-xl border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Fuel Needed</p>
            <p className="text-3xl font-bold tabular-nums">{res.fuelNeeded.toFixed(2)}</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-1">
            <p className="text-xs text-primary uppercase tracking-wider font-semibold">Total Fuel Cost</p>
            <p className="text-3xl font-bold tabular-nums text-primary">{res.cost.toFixed(2)}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
