"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function WorkingDaysTool() {
  const [start, setStart] = React.useState<string>("");
  const [end, setEnd] = React.useState<string>("");
  const [includeSaturdays, setIncludeSaturdays] = React.useState(false);

  const calculateDays = () => {
    if (!start || !end) return null;
    
    let current = new Date(start);
    const endDate = new Date(end);
    let workingDays = 0;
    
    // Ensure start is before or equal to end
    if (current > endDate) return null;

    current.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && (includeSaturdays || dayOfWeek !== 6)) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  };

  const result = calculateDays();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Working Days Calculator</CardTitle><CardDescription>Calculate the number of business days between two dates.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={start} onChange={e => setStart(e.target.value)} /></div>
          <div className="space-y-2"><Label>End Date</Label><Input type="date" value={end} onChange={e => setEnd(e.target.value)} /></div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="sats" checked={includeSaturdays} onChange={e => setIncludeSaturdays(e.target.checked)} className="rounded border-gray-300" />
          <Label htmlFor="sats" className="font-normal cursor-pointer">Include Saturdays as working days</Label>
        </div>

        {result !== null && (
          <div className="bg-muted/10 p-6 rounded-2xl border text-center space-y-2">
            <h3 className="text-4xl font-bold text-primary tabular-nums">{result}</h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-center">Working Days</p>
          </div>
        )}
        {start && end && result === null && (
          <p className="text-sm text-destructive text-center">End date must be after start date.</p>
        )}
      </CardContent>
    </Card>
  );
}
