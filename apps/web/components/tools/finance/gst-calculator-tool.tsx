"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export function GstCalculatorTool() {
  const [amount, setAmount] = React.useState("1000");
  const [rate, setRate] = React.useState("18");
  const [mode, setMode] = React.useState<"add" | "remove">("add");

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (isNaN(a) || isNaN(r)) return { net: 0, tax: 0, total: 0 };

    if (mode === "add") {
      const tax = (a * r) / 100;
      return { net: a, tax, total: a + tax };
    } else {
      const net = a / (1 + r / 100);
      const tax = a - net;
      return { net, tax, total: a };
    }
  };

  const results = calculate();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>GST / VAT Calculator</CardTitle><CardDescription>Quickly calculate tax to add or remove from an amount.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex gap-2 p-1 bg-muted/20 border rounded-lg">
          <Button variant={mode === "add" ? "default" : "ghost"} onClick={() => setMode("add")} className="flex-1">Add Tax (+)</Button>
          <Button variant={mode === "remove" ? "default" : "ghost"} onClick={() => setMode("remove")} className="flex-1">Remove Tax (-)</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <div className="flex gap-2">
              <Input type="number" min="0" value={rate} onChange={e => setRate(e.target.value)} className="w-24" />
              <div className="flex flex-1 gap-1">
                {[5, 12, 18, 28].map(r => (
                  <Button key={r} variant="outline" size="sm" onClick={() => setRate(r.toString())} className="flex-1 px-0">{r}%</Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t text-center">
          <div className="bg-muted/10 p-3 sm:p-4 rounded-xl border space-y-1">
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Net Amount</p>
            <p className="text-lg sm:text-2xl font-bold tabular-nums">{results.net.toFixed(2)}</p>
          </div>
          <div className="bg-orange-500/10 p-3 sm:p-4 rounded-xl border border-orange-500/20 space-y-1">
            <p className="text-[10px] sm:text-xs text-orange-600 uppercase tracking-wider font-semibold">Tax ({rate}%)</p>
            <p className="text-lg sm:text-2xl font-bold tabular-nums text-orange-600">{results.tax.toFixed(2)}</p>
          </div>
          <div className="bg-green-500/10 p-3 sm:p-4 rounded-xl border border-green-500/20 space-y-1">
            <p className="text-[10px] sm:text-xs text-green-700 uppercase tracking-wider font-semibold">Total / Gross</p>
            <p className="text-lg sm:text-2xl font-bold tabular-nums text-green-700">{results.total.toFixed(2)}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
