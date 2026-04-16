"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function DateDifferenceTool() {
  const [date1, setDate1] = React.useState(new Date().toISOString().split('T')[0] || "");
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  const [date2, setDate2] = React.useState(tomorrow.toISOString().split('T')[0] || "");

  const calc = () => {
    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      const days = remainingDays % 30;

      return { totalDays: diffTime === 0 ? 0 : diffDays, years, months, days };
    } catch {
      return { totalDays: 0, years: 0, months: 0, days: 0 };
    }
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Date Difference Calculator</CardTitle><CardDescription>Calculate the exact number of days between two dates.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={date1} onChange={e => setDate1(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={date2} onChange={e => setDate2(e.target.value)} />
          </div>
        </div>

        <div className="pt-6 border-t mt-4 text-center">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-2">
            <p className="text-sm tracking-wider uppercase font-semibold text-primary">Time Between Dates</p>
            <div className="text-5xl font-bold tabular-nums text-primary">{res.totalDays} <span className="text-xl">Days</span></div>
            {res.totalDays > 30 && (
              <p className="text-sm text-muted-foreground mt-2 font-medium">Or roughly {res.years > 0 ? `${res.years}y ` : ''}{res.months > 0 ? `${res.months}m ` : ''}{res.days}d</p>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
