"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function UuidGeneratorTool() {
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(5);

  function generate() {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(crypto.randomUUID());
    }
    setUuids(list);
  }

  async function copyAll() { await navigator.clipboard.writeText(uuids.join("\n")); }
  async function copyOne(u: string) { await navigator.clipboard.writeText(u); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>UUID Generator</CardTitle><CardDescription>Generate unique UUIDs (v4) instantly.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm">Count:</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))} className="rounded border bg-background p-1.5 text-sm">
            {[1, 5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <Button onClick={generate}>Generate</Button>
          {uuids.length > 0 && <Button variant="outline" size="sm" onClick={copyAll}>Copy All</Button>}
        </div>
        {uuids.length > 0 && (
          <div className="space-y-1 max-h-[400px] overflow-y-auto rounded-xl border border-border/50 bg-muted/10 p-3">
            {uuids.map((u, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-muted/20 transition-colors">
                <code className="text-xs font-mono break-all">{u}</code>
                <Button variant="ghost" size="sm" className="shrink-0 h-7 text-xs" onClick={() => copyOne(u)}>Copy</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
