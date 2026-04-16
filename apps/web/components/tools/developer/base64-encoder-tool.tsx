"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function Base64EncoderTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");

  function process() {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput("Error: Invalid input for " + mode);
    }
  }

  async function copy() { if (output) await navigator.clipboard.writeText(output); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Base64 Encoder / Decoder</CardTitle><CardDescription>Encode text to Base64 or decode Base64 strings back to text.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === "encode" ? "default" : "outline"} size="sm" onClick={() => setMode("encode")}>Encode</Button>
          <Button variant={mode === "decode" ? "default" : "outline"} size="sm" onClick={() => setMode("decode")}>Decode</Button>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."} className="min-h-[120px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <Button onClick={process} disabled={!input}>{mode === "encode" ? "Encode" : "Decode"}</Button>
        {output && (
          <div className="space-y-2">
            <textarea value={output} readOnly className="min-h-[120px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono resize-y break-all" />
            <Button size="sm" onClick={copy}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
