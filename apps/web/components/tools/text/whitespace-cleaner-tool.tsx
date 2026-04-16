"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function WhitespaceCleanerTool() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");

  function clean(mode: "trim" | "collapse" | "tabs" | "blank" | "all") {
    let out = text;
    switch (mode) {
      case "trim": out = out.split("\n").map(l => l.trim()).join("\n"); break;
      case "collapse": out = out.replace(/[^\S\n]+/g, " "); break;
      case "tabs": out = out.replace(/\t/g, "  "); break;
      case "blank": out = out.replace(/\n{3,}/g, "\n\n"); break;
      case "all": out = out.split("\n").map(l => l.trim()).join("\n").replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n"); break;
    }
    setResult(out);
  }

  async function copy() { if (result) await navigator.clipboard.writeText(result); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Whitespace Cleaner</CardTitle><CardDescription>Clean up extra whitespace, tabs, blank lines and trailing spaces.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text with messy whitespace..." className="min-h-[150px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <div className="flex flex-wrap gap-2">
          {([["trim", "Trim Lines"], ["collapse", "Collapse Spaces"], ["tabs", "Tabs → Spaces"], ["blank", "Remove Blank Lines"], ["all", "Clean All"]] as const).map(([key, label]) => (
            <Button key={key} variant="outline" size="sm" onClick={() => clean(key)} disabled={!text}>{label}</Button>
          ))}
        </div>
        {result && (
          <div className="space-y-2">
            <textarea value={result} readOnly className="min-h-[150px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono resize-y" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
