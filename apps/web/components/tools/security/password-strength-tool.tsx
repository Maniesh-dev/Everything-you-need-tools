"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";

export function PasswordStrengthTool() {
  const [password, setPassword] = React.useState("");

  const analysis = React.useMemo(() => {
    if (!password) return null;
    const checks = [
      { label: "At least 8 characters", pass: password.length >= 8 },
      { label: "At least 12 characters", pass: password.length >= 12 },
      { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
      { label: "Contains lowercase", pass: /[a-z]/.test(password) },
      { label: "Contains numbers", pass: /[0-9]/.test(password) },
      { label: "Contains symbols", pass: /[^A-Za-z0-9]/.test(password) },
      { label: "No common patterns", pass: !/^(123|abc|password|qwerty|111|000)/i.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    let label: string, color: string, percent: number;
    if (score <= 2) { label = "Very Weak"; color = "bg-red-500"; percent = 15; }
    else if (score <= 3) { label = "Weak"; color = "bg-orange-500"; percent = 35; }
    else if (score <= 4) { label = "Fair"; color = "bg-yellow-500"; percent = 55; }
    else if (score <= 5) { label = "Strong"; color = "bg-blue-500"; percent = 75; }
    else { label = "Very Strong"; color = "bg-emerald-500"; percent = 100; }

    const entropy = password.length * Math.log2(
      ((/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/[0-9]/.test(password) ? 10 : 0) + (/[^A-Za-z0-9]/.test(password) ? 33 : 0)) || 1
    );

    return { checks, score, label, color, percent, entropy: Math.round(entropy) };
  }, [password]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Password Strength Checker</CardTitle><CardDescription>Check how strong your password is with detailed analysis.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password to check..." className="font-mono text-lg" />
        {analysis && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{analysis.label}</span>
                <span className="text-xs text-muted-foreground">~{analysis.entropy} bits entropy</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${analysis.color} transition-all duration-500`} style={{ width: `${analysis.percent}%` }} />
              </div>
            </div>
            <div className="grid gap-1.5">
              {analysis.checks.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span>{c.pass ? "✅" : "❌"}</span>
                  <span className={c.pass ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
