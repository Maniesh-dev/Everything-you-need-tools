"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export function DateAddSubtractTool() {
  const [baseDate, setBaseDate] = React.useState<string>(() => new Date().toISOString().split("T")[0] || "");
  const [operation, setOperation] = React.useState<"add" | "subtract">("add");
  const [years, setYears] = React.useState(0);
  const [months, setMonths] = React.useState(0);
  const [days, setDays] = React.useState(0);
  const [result, setResult] = React.useState<string>("");

  React.useEffect(() => {
    if (!baseDate) return;
    
    const d = new Date(baseDate);
    const multiplier = operation === "add" ? 1 : -1;
    
    // Add years and months carefully
    d.setFullYear(d.getFullYear() + (years * multiplier));
    d.setMonth(d.getMonth() + (months * multiplier));
    d.setDate(d.getDate() + (days * multiplier));

    setResult(d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, [baseDate, operation, years, months, days]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Date Add / Subtract</CardTitle><CardDescription>Add or subtract days, months, and years from a specific date.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <div className="flex gap-2">
              <Button className="flex-1" variant={operation === "add" ? "default" : "outline"} onClick={() => setOperation("add")}>Add</Button>
              <Button className="flex-1" variant={operation === "subtract" ? "default" : "outline"} onClick={() => setOperation("subtract")}>Subtract</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2"><Label>Years</Label><Input type="number" min="0" value={years} onChange={e => setYears(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Months</Label><Input type="number" min="0" value={months} onChange={e => setMonths(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>Days</Label><Input type="number" min="0" value={days} onChange={e => setDays(Number(e.target.value))} /></div>
        </div>

        <div className="bg-muted/20 p-6 rounded-2xl border text-center space-y-2 mt-4">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Result Date</p>
          <div className="text-2xl sm:text-3xl font-bold text-primary">{result || "-"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
