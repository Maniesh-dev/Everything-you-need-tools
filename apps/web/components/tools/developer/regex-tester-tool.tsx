"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface Match { text: string; index: number; groups: string[]; }

export function RegexTesterTool() {
  const [pattern, setPattern] = React.useState("");
  const [flags, setFlags] = React.useState("gi");
  const [testString, setTestString] = React.useState("");
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!pattern || !testString) { setMatches([]); setError(null); return; }
    try {
      const regex = new RegExp(pattern, flags);
      const found: Match[] = [];
      let m: RegExpExecArray | null;
      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          found.push({ text: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) break;
        }
      } else {
        m = regex.exec(testString);
        if (m) found.push({ text: m[0], index: m.index, groups: m.slice(1) });
      }
      setMatches(found);
      setError(null);
    } catch (e: any) { setError(e.message); setMatches([]); }
  }, [pattern, flags, testString]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Regex Tester</CardTitle><CardDescription>Test regular expressions with live matching and group capture.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2"><Label>Pattern</Label><Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="[a-z]+" className="font-mono" /></div>
          <div className="space-y-2"><Label>Flags</Label><Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" className="w-20 font-mono" /></div>
        </div>
        <div className="space-y-2"><Label>Test String</Label>
          <textarea value={testString} onChange={e => setTestString(e.target.value)} placeholder="Enter text to test against..." className="min-h-[100px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        </div>
        {error && <p className="text-sm text-destructive font-mono">❌ {error}</p>}
        <div className="rounded-xl border border-border/50 bg-muted/10 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">{matches.length} match(es)</p>
          {matches.length > 0 && (
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-mono p-1.5 rounded bg-muted/20">
                  <span className="text-muted-foreground w-8">#{i+1}</span>
                  <span className="text-primary font-semibold">&quot;{m.text}&quot;</span>
                  <span className="text-muted-foreground">@{m.index}</span>
                  {m.groups.length > 0 && <span className="text-muted-foreground">groups: [{m.groups.join(", ")}]</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
