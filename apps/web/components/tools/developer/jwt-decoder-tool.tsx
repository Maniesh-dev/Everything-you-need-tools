"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const final = pad ? padded + "=".repeat(4 - pad) : padded;
  return decodeURIComponent(escape(atob(final)));
}

export function JwtDecoderTool() {
  const [token, setToken] = React.useState("");
  const [header, setHeader] = React.useState("");
  const [payload, setPayload] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function decode() {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) { setError("Invalid JWT: must have 3 parts separated by dots."); return; }
      setHeader(JSON.stringify(JSON.parse(decodeBase64Url(parts[0]!)), null, 2));
      const payloadData = JSON.parse(decodeBase64Url(parts[1]!));
      if (payloadData.exp) payloadData._exp_readable = new Date(payloadData.exp * 1000).toISOString();
      if (payloadData.iat) payloadData._iat_readable = new Date(payloadData.iat * 1000).toISOString();
      setPayload(JSON.stringify(payloadData, null, 2));
      setError(null);
    } catch { setError("Failed to decode JWT. Check the token format."); }
  }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>JWT Decoder</CardTitle><CardDescription>Decode and inspect JWT tokens. See header, payload and expiration.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={token} onChange={e => setToken(e.target.value)} placeholder="Paste your JWT token here..." className="min-h-[80px] w-full rounded-xl border border-border bg-background p-4 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y break-all" />
        <Button onClick={decode} disabled={!token}>Decode</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {header && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Header</p>
              <pre className="rounded-xl border bg-muted/20 p-3 text-xs font-mono overflow-auto max-h-[300px]">{header}</pre>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Payload</p>
              <pre className="rounded-xl border bg-muted/20 p-3 text-xs font-mono overflow-auto max-h-[300px]">{payload}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
