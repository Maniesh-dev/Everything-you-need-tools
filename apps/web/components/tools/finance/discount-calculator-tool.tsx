"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function DiscountCalculatorTool() {
  const [originalPrice, setOriginalPrice] = React.useState("100");
  const [discountPercent, setDiscountPercent] = React.useState("15");

  const calc = () => {
    const o = parseFloat(originalPrice);
    const d = parseFloat(discountPercent);

    if (isNaN(o) || isNaN(d)) return { saved: 0, finalPrice: 0 };

    const saved = (o * d) / 100;
    const finalPrice = o - saved;

    return { saved, finalPrice };
  };

  const res = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Discount Calculator</CardTitle><CardDescription>Calculate the final price after a percentage discount.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Original Price</Label>
            <Input type="number" min="0" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Discount (%)</Label>
            <Input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} />
          </div>
        </div>

        <div className="pt-6 border-t grid gap-4 sm:grid-cols-2">
          <div className="bg-muted/30 p-4 rounded-xl border text-center space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">You Save</p>
            <p className="text-2xl font-bold tabular-nums text-green-600">{res.saved.toFixed(2)}</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-center space-y-1">
            <p className="text-xs text-primary uppercase tracking-wider font-semibold">Final Price</p>
            <p className="text-3xl font-bold tabular-nums text-primary">{res.finalPrice.toFixed(2)}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
