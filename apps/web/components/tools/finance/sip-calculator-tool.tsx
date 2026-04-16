"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Slider } from "@workspace/ui/components/slider";

export function SipCalculatorTool() {
  const [investment, setInvestment] = React.useState(5000);
  const [rate, setRate] = React.useState(12);
  const [years, setYears] = React.useState(10);

  const calculateSip = () => {
    const P = investment;
    const i = rate / 12 / 100;
    const n = years * 12;

    const maturityAmount = Math.round(P * (((Math.pow(1 + i, n)) - 1) / i) * (1 + i));
    const investedAmount = investment * n;
    const estReturns = maturityAmount - investedAmount;

    return { maturityAmount, investedAmount, estReturns };
  };

  const { maturityAmount, investedAmount, estReturns } = calculateSip();

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  const percentInvested = (investedAmount / maturityAmount) * 100;

  return (
    <Card className="border border-border/70 overflow-hidden font-sans">
      <CardHeader>
        <CardTitle>SIP Calculator</CardTitle>
        <CardDescription>Calculate the potential returns on your Systematic Investment Plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="grid gap-8 md:grid-cols-2">
           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Monthly Investment</Label>
                    <span className="text-sm font-bold text-primary">{formatCurrency(investment)}</span>
                 </div>
                 <Slider value={[investment]} min={500} max={100000} step={500} onValueChange={v => setInvestment(v[0] || 500)} />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Expected Return Rate (p.a)</Label>
                    <span className="text-sm font-bold text-primary">{rate}%</span>
                 </div>
                 <Slider value={[rate]} min={1} max={30} step={0.5} onValueChange={v => setRate(v[0] || 1)} />
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Time Period (Years)</Label>
                    <span className="text-sm font-bold text-primary">{years} Yr</span>
                 </div>
                 <Slider value={[years]} min={1} max={40} step={1} onValueChange={v => setYears(v[0] || 1)} />
              </div>
           </div>

           <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/10 border border-border/50 relative">
              <div className="relative w-48 h-48 mb-6">
                 <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray={`${100 - percentInvested} 100`} strokeDashoffset="0"></circle>
                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="4" strokeDasharray={`${percentInvested} 100`} strokeDashoffset={`${-(100 - percentInvested)}`}></circle>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Value</span>
                    <span className="text-lg font-black">{formatCurrency(maturityAmount)}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                       <span className="text-[10px] uppercase font-bold text-muted-foreground">Invested</span>
                    </div>
                    <p className="text-sm font-bold">{formatCurrency(investedAmount)}</p>
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-primary"></div>
                       <span className="text-[10px] uppercase font-bold text-muted-foreground">Returns</span>
                    </div>
                    <p className="text-sm font-bold">{formatCurrency(estReturns)}</p>
                 </div>
              </div>
           </div>
        </div>

      </CardContent>
    </Card>
  );
}
