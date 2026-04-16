"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";

export function PasswordGeneratorTool() {
  const [length, setLength] = React.useState(16);
  const [upper, setUpper] = React.useState(true);
  const [lower, setLower] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [symbols, setSymbols] = React.useState(true);
  const [passwords, setPasswords] = React.useState<string[]>([]);

  function generate() {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) return;
    const list: string[] = [];
    for (let i = 0; i < 5; i++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      list.push(Array.from(arr, v => chars[v % chars.length]).join(""));
    }
    setPasswords(list);
  }

  async function copy(pw: string) { await navigator.clipboard.writeText(pw); }

  function getStrength(pw: string): { label: string; color: string; percent: number } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { label: "Weak", color: "bg-red-500", percent: 25 };
    if (score <= 4) return { label: "Fair", color: "bg-yellow-500", percent: 50 };
    if (score <= 5) return { label: "Strong", color: "bg-blue-500", percent: 75 };
    return { label: "Very Strong", color: "bg-emerald-500", percent: 100 };
  }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Password Generator</CardTitle><CardDescription>Generate strong, cryptographically secure passwords.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Length: {length}</Label>
            <input type="range" min={4} max={64} value={length} onChange={e => setLength(Number(e.target.value))} className="w-40" />
          </div>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> A-Z</label>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> a-z</label>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} /> 0-9</label>
          <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} /> !@#</label>
        </div>
        <Button onClick={generate}>Generate Passwords</Button>
        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => {
              const s = getStrength(pw);
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/10 p-3">
                  <code className="flex-1 text-sm font-mono break-all select-all">{pw}</code>
                  <div className="shrink-0 w-16">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full ${s.color} transition-all`} style={{ width: `${s.percent}%` }} /></div>
                    <p className="text-[9px] text-center text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 h-7 text-xs" onClick={() => copy(pw)}>Copy</Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
