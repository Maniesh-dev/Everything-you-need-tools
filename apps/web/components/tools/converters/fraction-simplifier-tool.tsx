"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

export function FractionSimplifierTool() {
  const [num, setNum] = React.useState("15");
  const [den, setDen] = React.useState("45");

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const calc = () => {
    const n = parseInt(num);
    const d = parseInt(den);

    if (isNaN(n) || isNaN(d) || d === 0) return { simpleN: n, simpleD: d, decimal: 0, whole: 0, mixedN: 0 };

    const divisor = gcd(n, d);
    let simpleN = n / divisor;
    let simpleD = d / divisor;
    
    // fix negative denominator
    if (simpleD < 0) {
       simpleN = -simpleN;
       simpleD = -simpleD;
    }

    const decimal = n / d;
    const whole = Math.floor(Math.abs(simpleN) / simpleD) * (simpleN < 0 ? -1 : 1);
    const mixedN = Math.abs(simpleN) % simpleD;

    return { simpleN, simpleD, decimal, whole, mixedN: simpleN < 0 && whole === 0 ? -mixedN : mixedN };
  };

  const res = calc();
  const isImproper = Math.abs(res.simpleN) >= res.simpleD && res.simpleD !== 1 && res.simpleD !== 0;

  return (
    <Card className="border border-border/70 max-w-xl mx-auto w-full">
      <CardHeader><CardTitle>Fraction Simplifier</CardTitle><CardDescription>Reduce fractions to their simplest form instantly.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-center gap-4 py-4">
           {/* Input Fraction */}
           <div className="flex flex-col gap-2 w-24">
             <Input type="number" className="text-center text-xl font-bold" value={num} onChange={e => setNum(e.target.value)} />
             <div className="border-b-4 border-foreground w-full"></div>
             <Input type="number" className="text-center text-xl font-bold" value={den} onChange={e => setDen(e.target.value)} />
           </div>
           
           <div className="text-3xl text-muted-foreground">=</div>
           
           {/* Output Fraction */}
           <div className="flex flex-col gap-2 min-w-[6rem] items-center text-primary">
             {!isNaN(res.simpleN) && res.simpleD !== 0 ? (
               res.simpleD === 1 ? (
                  <div className="text-5xl font-black">{res.simpleN}</div>
               ) : (
                  <>
                    <div className="text-3xl font-black">{res.simpleN}</div>
                    <div className="border-b-4 border-primary/50 w-full max-w-[4rem]"></div>
                    <div className="text-3xl font-black">{res.simpleD}</div>
                  </>
               )
             ) : (
               <div className="text-muted-foreground">-</div>
             )}
           </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 pt-6 border-t">
           <div className="bg-muted/10 border p-3 rounded-lg flex justify-between items-center">
             <span className="text-xs uppercase font-semibold text-muted-foreground">Decimal</span>
             <span className="font-bold tabular-nums">{!isNaN(res.decimal) && Number.isFinite(res.decimal) ? res.decimal.toFixed(4).replace(/\.?0+$/, '') : '-'}</span>
           </div>
           
           {isImproper && (
             <div className="bg-muted/10 border p-3 rounded-lg flex justify-between items-center col-span-1">
               <span className="text-xs uppercase font-semibold text-muted-foreground">Mixed Number</span>
               <span className="font-bold tabular-nums">
                 {res.whole !== 0 ? res.whole : ''} {Math.abs(res.mixedN)}/{res.simpleD}
               </span>
             </div>
           )}
        </div>

      </CardContent>
    </Card>
  );
}
