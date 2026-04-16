"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function HashGeneratorTool() {
  const [input, setInput] = React.useState("");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});

  async function generateHashes() {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
    const results: Record<string, string> = {};
    for (const algo of algos) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(results);
  }

  async function copy(value: string) { await navigator.clipboard.writeText(value); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Hash Generator</CardTitle><CardDescription>Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes from text.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." className="min-h-[100px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <Button onClick={generateHashes} disabled={!input}>Generate Hashes</Button>
        {Object.keys(hashes).length > 0 && (
          <div className="space-y-2">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="rounded-xl border border-border/50 bg-muted/10 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{algo}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copy(hash)}>Copy</Button>
                </div>
                <code className="text-xs font-mono break-all text-foreground/80">{hash}</code>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
