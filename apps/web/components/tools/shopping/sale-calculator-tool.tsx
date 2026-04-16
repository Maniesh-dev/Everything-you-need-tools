"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function SaleCalculatorTool() {
  const [price, setPrice] = React.useState("100");
  const [discount1, setDiscount1] = React.useState("20");
  const [discount2, setDiscount2] = React.useState("0"); // e.g. extra 10% off
  const [tax, setTax] = React.useState("0"); // optional sales tax

  const calc = () => {
    const p = parseFloat(price) || 0;
    const d1 = parseFloat(discount1) || 0;
    const d2 = parseFloat(discount2) || 0;
    const t = parseFloat(tax) || 0;

    const afterD1 = p - (p * (d1 / 100));
    const afterD2 = afterD1 - (afterD1 * (d2 / 100));
    
    const finalPriceBeforeTax = afterD2;
    const taxAmount = finalPriceBeforeTax * (t / 100);
    const finalPrice = finalPriceBeforeTax + taxAmount;
    
    const totalSaved = p - finalPriceBeforeTax;

    return { finalPrice, totalSaved, taxAmount };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Sale Price Calculator</CardTitle><CardDescription>Calculate compound sale prices, clearance discounts, and sales tax.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Original Price</Label>
            <Input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Base Discount (%)</Label>
            <Input type="number" min="0" value={discount1} onChange={e => setDiscount1(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Extra / Additional Discount (%)</Label>
            <Input type="number" min="0" value={discount2} onChange={e => setDiscount2(e.target.value)} placeholder="0 for none" />
          </div>
          <div className="space-y-2">
            <Label>Sales Tax (%)</Label>
            <Input type="number" min="0" value={tax} onChange={e => setTax(e.target.value)} placeholder="0 for none" />
          </div>
        </div>

        <div className="pt-6 border-t mt-4 grid gap-4 grid-cols-2 text-center">
          <div className="col-span-2 bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-2">
            <p className="text-sm tracking-wider uppercase font-semibold text-primary">Final Price (Incl. Tax)</p>
            <div className="text-5xl font-bold tabular-nums text-primary">{res.finalPrice.toFixed(2)}</div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-xl border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Saved</p>
            <p className="text-xl font-bold tabular-nums text-green-500">{res.totalSaved.toFixed(2)}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tax Applied</p>
            <p className="text-xl font-bold tabular-nums">{res.taxAmount.toFixed(2)}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
