"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function DuplicateRemoverTool() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [removed, setRemoved] = React.useState(0);

  function removeDuplicates() {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const line of lines) {
      if (!seen.has(line)) {
        seen.add(line);
        unique.push(line);
      }
    }
    setRemoved(lines.length - unique.length);
    setResult(unique.join("\n"));
  }

  async function copy() { if (result) await navigator.clipboard.writeText(result); }

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Duplicate Line Remover</CardTitle>
        <CardDescription>Remove duplicate lines from your text, keeping only unique entries.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text with duplicate lines..." className="min-h-[150px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <Button onClick={removeDuplicates} disabled={!text}>Remove Duplicates</Button>
        {result && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{removed} duplicate line(s) removed</p>
            <textarea value={result} readOnly className="min-h-[150px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm resize-y" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
