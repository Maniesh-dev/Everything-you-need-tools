"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function TextSorterTool() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");

  function sort(dir: "asc" | "desc" | "reverse" | "random" | "length") {
    const lines = text.split("\n").filter(l => l.trim());
    let sorted: string[];
    switch (dir) {
      case "asc": sorted = [...lines].sort((a, b) => a.localeCompare(b)); break;
      case "desc": sorted = [...lines].sort((a, b) => b.localeCompare(a)); break;
      case "reverse": sorted = [...lines].reverse(); break;
      case "random": sorted = [...lines].sort(() => Math.random() - 0.5); break;
      case "length": sorted = [...lines].sort((a, b) => a.length - b.length); break;
      default: sorted = lines;
    }
    setResult(sorted.join("\n"));
  }

  async function copy() { if (result) await navigator.clipboard.writeText(result); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Text Sorter</CardTitle><CardDescription>Sort lines alphabetically, by length, reverse, or randomize them.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste lines to sort..." className="min-h-[150px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <div className="flex flex-wrap gap-2">
          {([["asc", "A → Z"], ["desc", "Z → A"], ["reverse", "Reverse"], ["random", "Shuffle"], ["length", "By Length"]] as const).map(([key, label]) => (
            <Button key={key} variant="outline" size="sm" onClick={() => sort(key)} disabled={!text}>{label}</Button>
          ))}
        </div>
        {result && (
          <div className="space-y-2">
            <textarea value={result} readOnly className="min-h-[150px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm resize-y" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
