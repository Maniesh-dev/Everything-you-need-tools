"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function NumberBaseConverterTool() {
  const [input, setInput] = React.useState("");
  const [fromBase, setFromBase] = React.useState(10);
  const results = React.useMemo(() => {
    if (!input.trim()) return null;
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) return null;
      return {
        decimal: decimal.toString(10),
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        hex: decimal.toString(16).toUpperCase(),
      };
    } catch { return null; }
  }, [input, fromBase]);

  async function copy(v: string) { await navigator.clipboard.writeText(v); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Number Base Converter</CardTitle><CardDescription>Convert between binary, octal, decimal and hexadecimal.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2 flex-1 min-w-[150px]"><Label>Input</Label><Input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter number..." className="font-mono" /></div>
          <div className="space-y-2"><Label>From Base</Label>
            <select value={fromBase} onChange={e => setFromBase(Number(e.target.value))} className="rounded border bg-background p-2 text-sm">
              <option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={10}>Decimal (10)</option><option value={16}>Hex (16)</option>
            </select>
          </div>
        </div>
        {results && (
          <div className="grid gap-2 sm:grid-cols-2">
            {([["Decimal", results.decimal], ["Binary", results.binary], ["Octal", results.octal], ["Hex", results.hex]] as const).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/10 p-3">
                <div><p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p><code className="text-sm font-mono break-all">{value}</code></div>
                <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => copy(value)}>Copy</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
