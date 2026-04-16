"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function AgeCalculatorTool() {
  const [dob, setDob] = React.useState("");
  const [result, setResult] = React.useState<null | { years: number; months: number; days: number; totalDays: number; nextBirthday: number; }>(null);

  function calculate() {
    const birth = new Date(dob);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const nextBirthday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, nextBirthday });
  }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Age Calculator</CardTitle><CardDescription>Calculate your exact age in years, months, and days.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
          <Button onClick={calculate} disabled={!dob}>Calculate</Button>
        </div>
        {result && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {([["Years", result.years], ["Months", result.months], ["Days", result.days], ["Total Days", result.totalDays], ["Next Birthday", `${result.nextBirthday} days`]] as const).map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
