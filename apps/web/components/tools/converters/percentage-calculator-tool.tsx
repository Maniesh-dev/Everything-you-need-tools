"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function PercentageCalculatorTool() {
  const [val1A, setVal1A] = React.useState("");
  const [val1B, setVal1B] = React.useState("");
  const [res1, setRes1] = React.useState<number | null>(null);

  const [val2A, setVal2A] = React.useState("");
  const [val2B, setVal2B] = React.useState("");
  const [res2, setRes2] = React.useState<number | null>(null);

  const [val3A, setVal3A] = React.useState("");
  const [val3B, setVal3B] = React.useState("");
  const [res3, setRes3] = React.useState<number | null>(null);

  React.useEffect(() => {
    const a = parseFloat(val1A), b = parseFloat(val1B);
    setRes1(!isNaN(a) && !isNaN(b) ? (a / 100) * b : null);
  }, [val1A, val1B]);

  React.useEffect(() => {
    const a = parseFloat(val2A), b = parseFloat(val2B);
    setRes2(!isNaN(a) && !isNaN(b) && b !== 0 ? (a / b) * 100 : null);
  }, [val2A, val2B]);

  React.useEffect(() => {
    const a = parseFloat(val3A), b = parseFloat(val3B);
    setRes3(!isNaN(a) && !isNaN(b) && a !== 0 ? ((b - a) / Math.abs(a)) * 100 : null);
  }, [val3A, val3B]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Percentage Calculator</CardTitle><CardDescription>Calculate percentages, ratios, and percentage changes.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
          <p className="font-medium text-sm">1. What is X% of Y?</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">What is</span>
            <Input type="number" value={val1A} onChange={e => setVal1A(e.target.value)} className="w-24" />
            <span className="text-sm">% of</span>
            <Input type="number" value={val1B} onChange={e => setVal1B(e.target.value)} className="w-32" />
            <span className="text-sm font-semibold">= {res1 !== null ? Number(res1.toFixed(4)) : "?"}</span>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
          <p className="font-medium text-sm">2. X is what % of Y?</p>
          <div className="flex flex-wrap items-center gap-3">
            <Input type="number" value={val2A} onChange={e => setVal2A(e.target.value)} className="w-32" />
            <span className="text-sm">is what % of</span>
            <Input type="number" value={val2B} onChange={e => setVal2B(e.target.value)} className="w-32" />
            <span className="text-sm font-semibold">= {res2 !== null ? Number(res2.toFixed(4)) + "%" : "?"}</span>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border/50 bg-muted/10 p-4">
          <p className="font-medium text-sm">3. Percentage change from X to Y</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">From</span>
            <Input type="number" value={val3A} onChange={e => setVal3A(e.target.value)} className="w-32" />
            <span className="text-sm">to</span>
            <Input type="number" value={val3B} onChange={e => setVal3B(e.target.value)} className="w-32" />
            <span className="text-sm font-semibold">
              = {res3 !== null ? (res3 > 0 ? "+" : "") + Number(res3.toFixed(4)) + "%" : "?"}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
