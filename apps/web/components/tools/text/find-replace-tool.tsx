"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function FindReplaceTool() {
  const [text, setText] = React.useState("");
  const [find, setFind] = React.useState("");
  const [replace, setReplace] = React.useState("");
  const [useRegex, setUseRegex] = React.useState(false);
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [count, setCount] = React.useState(0);

  function doReplace() {
    try {
      let regex: RegExp;
      if (useRegex) {
        regex = new RegExp(find, caseSensitive ? "g" : "gi");
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        regex = new RegExp(escaped, caseSensitive ? "g" : "gi");
      }
      const matches = text.match(regex);
      setCount(matches ? matches.length : 0);
      setResult(text.replace(regex, replace));
    } catch {
      setResult("Invalid regex pattern");
      setCount(0);
    }
  }

  async function copy() { if (result) await navigator.clipboard.writeText(result); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Find & Replace</CardTitle><CardDescription>Find and replace text with optional regex support.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your text here..." className="min-h-[120px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2"><Label>Find</Label><Input value={find} onChange={e => setFind(e.target.value)} placeholder="Search text..." /></div>
          <div className="space-y-2"><Label>Replace with</Label><Input value={replace} onChange={e => setReplace(e.target.value)} placeholder="Replacement..." /></div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} /> Regex</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} /> Case-sensitive</label>
          <Button onClick={doReplace} disabled={!text || !find}>Replace All</Button>
        </div>
        {result && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{count} match(es) replaced</p>
            <textarea value={result} readOnly className="min-h-[120px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm resize-y" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
