"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

export function TipCalculatorTool() {
  const [bill, setBill] = React.useState("100");
  const [tipPercent, setTipPercent] = React.useState("15");
  const [people, setPeople] = React.useState("1");

  const calc = () => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent);
    const p = parseInt(people);

    if (isNaN(b) || isNaN(t) || isNaN(p) || p < 1) return { tipAmount: 0, total: 0, perPerson: 0, tipPerPerson: 0 };

    const tipAmount = (b * t) / 100;
    const total = b + tipAmount;
    const perPerson = total / p;
    const tipPerPerson = tipAmount / p;

    return { tipAmount, total, perPerson, tipPerPerson };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Tip Calculator</CardTitle><CardDescription>Calculate tips and easily split bills between friends.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4 max-w-sm mx-auto w-full">
          <div className="space-y-2">
            <Label>Bill Amount</Label>
            <Input type="number" min="0" value={bill} onChange={e => setBill(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <Label>Tip %</Label>
            <div className="flex gap-2">
              <Input type="number" min="0" value={tipPercent} onChange={e => setTipPercent(e.target.value)} className="w-20" />
              <div className="flex flex-1 gap-1">
                {[10, 15, 18, 20].map(r => (
                  <Button key={r} variant={tipPercent === r.toString() ? "default" : "outline"} size="sm" onClick={() => setTipPercent(r.toString())} className="flex-1 px-0">{r}%</Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Number of People</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPeople(Math.max(1, parseInt(people || "1") - 1).toString())}>-</Button>
              <Input type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} className="text-center" />
              <Button variant="outline" size="icon" onClick={() => setPeople((parseInt(people || "1") + 1).toString())}>+</Button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t grid gap-4 grid-cols-2">
          <div className="bg-muted/30 p-4 rounded-xl border text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Tip</p>
            <p className="text-2xl font-bold tabular-nums text-primary">{res.tipAmount.toFixed(2)}</p>
            {parseInt(people) > 1 && <p className="text-[10px] text-muted-foreground">{res.tipPerPerson.toFixed(2)} / person</p>}
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-center space-y-1">
            <p className="text-xs text-primary uppercase tracking-wider font-semibold">Total Bill</p>
            <p className="text-2xl font-bold tabular-nums text-primary">{res.total.toFixed(2)}</p>
            {parseInt(people) > 1 && <p className="text-[10px] text-primary/70">{res.perPerson.toFixed(2)} / person</p>}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
