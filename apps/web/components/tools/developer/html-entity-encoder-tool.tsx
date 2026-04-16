"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function HtmlEntityEncoderTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");

  function process() {
    if (mode === "encode") {
      setOutput(input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"));
    } else {
      const el = document.createElement("textarea");
      el.innerHTML = input;
      setOutput(el.value);
    }
  }

  async function copy() { if (output) await navigator.clipboard.writeText(output); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>HTML Entity Encoder</CardTitle><CardDescription>Encode special characters to HTML entities or decode them back.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === "encode" ? "default" : "outline"} size="sm" onClick={() => setMode("encode")}>Encode</Button>
          <Button variant={mode === "decode" ? "default" : "outline"} size="sm" onClick={() => setMode("decode")}>Decode</Button>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encode" ? '<div class="hello">' : "&lt;div class=&quot;hello&quot;&gt;"} className="min-h-[120px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <Button onClick={process} disabled={!input}>{mode === "encode" ? "Encode" : "Decode"}</Button>
        {output && (
          <div className="space-y-2">
            <textarea value={output} readOnly className="min-h-[120px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono resize-y" />
            <Button size="sm" onClick={copy}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
