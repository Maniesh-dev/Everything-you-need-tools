"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export function FdRdCalculatorTool() {
  const [fdPrincipal, setFdPrincipal] = React.useState(100000);
  const [fdRate, setFdRate] = React.useState(7);
  const [fdTime, setFdTime] = React.useState(5);

  const [rdMonthly, setRdMonthly] = React.useState(5000);
  const [rdRate, setRdRate] = React.useState(7);
  const [rdTime, setRdTime] = React.useState(5);

  const calculateFd = () => {
    // A = P(1 + r/n)^(nt)
    // Compounded quarterly (std in India)
    const P = fdPrincipal;
    const r = fdRate / 100;
    const n = 4;
    const t = fdTime;
    const maturity = Math.round(P * Math.pow(1 + r/n, n * t));
    const interest = maturity - P;
    return { maturity, interest };
  };

  const calculateRd = () => {
    // M = R * [(1 + i)^n - 1] / (1 - (1 + i)^(-1/3))
    // Standard quarterly compounding formula for RD
    const R = rdMonthly;
    const r = rdRate / 100;
    const n = rdTime * 12; // months
    const i = r / 4; // quarterly rate
    
    // M = R * ((1+i)^n - 1) / (1 - (1+i)^(-1/3))
    // Simplified: Total = Sum of P * (1 + r/4)^(quarters_left)
    let maturity = 0;
    for (let j = 1; j <= n; j++) {
      maturity += R * Math.pow(1 + r/4, (n - j + 1) / 3);
    }
    maturity = Math.round(maturity);
    const totalDeposit = R * n;
    const interest = maturity - totalDeposit;
    return { maturity, interest, totalDeposit };
  };

  const fd = calculateFd();
  const rd = calculateRd();

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <Card className="border border-border/70 overflow-hidden font-sans">
      <CardHeader>
        <CardTitle>FD / RD Calculator</CardTitle>
        <CardDescription>Compare Fixed Deposits and Recurring Deposits returns with quarterly compounding.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="fd" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fd">Fixed Deposit (FD)</TabsTrigger>
            <TabsTrigger value="rd">Recurring Deposit (RD)</TabsTrigger>
          </TabsList>

          <TabsContent value="fd" className="space-y-6 outline-none">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Total Investment</Label>
                <Input type="number" value={fdPrincipal} onChange={e => setFdPrincipal(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Rate of Interest (%)</Label>
                <Input type="number" step="0.1" value={fdRate} onChange={e => setFdRate(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Time Period (Years)</Label>
                <Input type="number" value={fdTime} onChange={e => setFdTime(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t">
               <div className="p-4 rounded-xl bg-muted/20 border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Invested</p>
                  <p className="text-xl font-bold">{formatCurrency(fdPrincipal)}</p>
               </div>
               <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] uppercase font-bold text-primary/70 mb-1">Interest</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(fd.interest)}</p>
               </div>
               <div className="p-4 rounded-xl bg-primary text-primary-foreground">
                  <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Maturity</p>
                  <p className="text-xl font-black">{formatCurrency(fd.maturity)}</p>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="rd" className="space-y-6 outline-none">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Monthly Deposit</Label>
                <Input type="number" value={rdMonthly} onChange={e => setRdMonthly(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Rate of Interest (%)</Label>
                <Input type="number" step="0.1" value={rdRate} onChange={e => setRdRate(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Time Period (Years)</Label>
                <Input type="number" value={rdTime} onChange={e => setRdTime(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t">
               <div className="p-4 rounded-xl bg-muted/20 border">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Invested</p>
                  <p className="text-xl font-bold">{formatCurrency(rd.totalDeposit)}</p>
               </div>
               <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] uppercase font-bold text-primary/70 mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(rd.interest)}</p>
               </div>
               <div className="p-4 rounded-xl bg-primary text-primary-foreground">
                  <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Maturity</p>
                  <p className="text-xl font-black">{formatCurrency(rd.maturity)}</p>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
