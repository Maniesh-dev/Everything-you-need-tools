"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function SalaryCalculatorTool() {
  const [ctc, setCtc] = React.useState("1200000"); // annual
  const [bonus, setBonus] = React.useState("100000"); // annual bonus
  const [pf, setPf] = React.useState("12"); // PF percentage
  const [deductions, setDeductions] = React.useState("2000"); // monthly other deductions

  const calc = () => {
    const ctcVal = parseFloat(ctc) || 0;
    const bonusVal = parseFloat(bonus) || 0;
    const pfPerc = parseFloat(pf) || 0;
    const monthlyDed = parseFloat(deductions) || 0;

    const baseAnnual = ctcVal - bonusVal;
    // rough Indian salary calc
    const basicProp = 0.5; // Basic is usually 50% of base
    const basicAnnual = baseAnnual * basicProp;
    const basicMonthly = basicAnnual / 12;
    
    const pfMonthly = (basicMonthly * pfPerc) / 100;
    
    // total monthly gross
    const grossMonthly = baseAnnual / 12;
    const totalDeductionsMonthly = pfMonthly + monthlyDed;
    
    const takeHomeMonthly = grossMonthly - totalDeductionsMonthly;

    return {
      grossMonthly,
      takeHomeMonthly,
      pfMonthly,
      totalDeductionsMonthly
    };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Salary Calculator</CardTitle><CardDescription>Estimate your monthly take-home pay based on annual CTC.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Annual CTC</Label>
            <Input type="number" min="0" value={ctc} onChange={e => setCtc(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Annual Bonus (Part of CTC)</Label>
            <Input type="number" min="0" value={bonus} onChange={e => setBonus(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>PF Factor (%)</Label>
            <Input type="number" min="0" value={pf} onChange={e => setPf(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Other Monthly Deductions (Tax/PT)</Label>
            <Input type="number" min="0" value={deductions} onChange={e => setDeductions(e.target.value)} />
          </div>
        </div>

        <div className="pt-6 border-t mt-4 grid gap-4 grid-cols-2 sm:grid-cols-4 text-center">
          <div className="col-span-2 sm:col-span-4 bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-2">
            <p className="text-sm tracking-wider uppercase font-semibold text-primary">Monthly Take Home</p>
            <div className="text-4xl sm:text-5xl font-bold tabular-nums text-primary">{Math.max(0, res.takeHomeMonthly).toFixed(2)}</div>
          </div>
          
          <div className="col-span-1 sm:col-span-2 bg-muted/30 p-4 rounded-xl border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Gross Monthly</p>
            <p className="text-xl font-bold tabular-nums">{res.grossMonthly.toFixed(2)}</p>
          </div>
          <div className="col-span-1 sm:col-span-2 bg-muted/30 p-4 rounded-xl border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Deductions</p>
            <p className="text-xl font-bold tabular-nums text-red-500">{res.totalDeductionsMonthly.toFixed(2)}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
