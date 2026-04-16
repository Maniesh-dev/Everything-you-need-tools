"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = React.useState("100000");
  const [rate, setRate] = React.useState("10");
  const [tenure, setTenure] = React.useState("12"); // in months

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    if (r === 0) return { emi: p / n, totalInterest: 0, totalPayment: p };

    const emi = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalInterest, totalPayment };
  };

  const res = calculateEMI();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>EMI / Loan Calculator</CardTitle><CardDescription>Calculate your monthly EMI, total interest, and total payment for a loan.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Loan Amount</Label>
            <Input type="number" min="0" value={principal} onChange={e => setPrincipal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (p.a %)</Label>
            <Input type="number" min="0" step="0.1" value={rate} onChange={e => setRate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tenure (Months)</Label>
            <Input type="number" min="1" value={tenure} onChange={e => setTenure(e.target.value)} />
          </div>
        </div>

        <div className="pt-6 border-t mt-4">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm tracking-wider uppercase font-semibold text-primary">Monthly EMI</p>
            <div className="text-5xl font-bold tabular-nums text-primary">{res.emi.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-muted/30 p-4 rounded-xl border text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Interest</p>
              <p className="text-xl font-bold tabular-nums">{res.totalInterest.toFixed(2)}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Payment</p>
              <p className="text-xl font-bold tabular-nums">{res.totalPayment.toFixed(2)}</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
