"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function DaysUntilSinceTool() {
  const [dateStr, setDateStr] = React.useState("");
  const [result, setResult] = React.useState<{ diff: number, type: "until" | "since" | "today" } | null>(null);

  React.useEffect(() => {
    if (!dateStr) { setResult(null); return; }
    
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setResult({ diff: diffDays, type: "until" });
    } else if (diffDays < 0) {
      setResult({ diff: Math.abs(diffDays), type: "since" });
    } else {
      setResult({ diff: 0, type: "today" });
    }
  }, [dateStr]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Days Until / Since</CardTitle><CardDescription>Calculate how many days are left until a date, or how many have passed.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select a Date</Label>
          <Input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} className="w-full max-w-sm" />
        </div>

        {result && (
          <div className="bg-muted/10 p-8 rounded-2xl border text-center space-y-2">
            {result.type === "today" ? (
              <h3 className="text-3xl font-bold text-primary">That&#39;s today!</h3>
            ) : (
              <>
                <div className="text-6xl font-black text-primary font-mono tabular-nums">{result.diff}</div>
                <p className="text-lg text-muted-foreground uppercase tracking-widest font-semibold">
                  Days {result.type}
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
