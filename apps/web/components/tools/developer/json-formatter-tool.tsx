"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function JsonFormatterTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [indent, setIndent] = React.useState(2);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  }

  async function copy() { if (output) await navigator.clipboard.writeText(output); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>JSON Formatter</CardTitle><CardDescription>Format, validate and minify JSON data with syntax highlighting.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={input} onChange={e => { setInput(e.target.value); setError(null); }} placeholder='{"key": "value"}' className="min-h-[180px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={format} disabled={!input}>Format</Button>
          <Button variant="outline" onClick={minify} disabled={!input}>Minify</Button>
          <label className="flex items-center gap-2 text-sm">Indent: <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="rounded border bg-background p-1 text-sm">{[2, 4, 8].map(n => <option key={n} value={n}>{n} spaces</option>)}</select></label>
        </div>
        {error && <p className="text-sm text-destructive font-mono">❌ {error}</p>}
        {output && (
          <div className="space-y-2">
            <textarea value={output} readOnly className="min-h-[180px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono resize-y" />
            <Button size="sm" onClick={copy}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
