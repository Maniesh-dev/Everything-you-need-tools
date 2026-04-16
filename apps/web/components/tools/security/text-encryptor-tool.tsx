"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function TextEncryptorTool() {
  const [text, setText] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [result, setResult] = React.useState("");
  const [mode, setMode] = React.useState<"encrypt" | "decrypt">("encrypt");
  const [error, setError] = React.useState<string | null>(null);

  async function process() {
    if (!text || !secret) return;
    setError(null);
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      
      const keyBuffer = await crypto.subtle.digest("SHA-256", keyData);
      const key = await crypto.subtle.importKey(
        "raw", keyBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]
      );

      if (mode === "encrypt") {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedText = encoder.encode(text);
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText);
        
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);
        
        let binary = "";
        for (let i = 0; i < combined.byteLength; i++) binary += String.fromCharCode(combined[i]!);
        setResult(btoa(binary));
      } else {
        const binary = atob(text);
        const combined = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) combined[i] = binary.charCodeAt(i);
        
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);
        
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
        setResult(new TextDecoder().decode(decrypted));
      }
    } catch {
      setError(`Failed to ${mode}. Check your input and secret key.`);
      setResult("");
    }
  }

  async function copy() { if (result) await navigator.clipboard.writeText(result); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Text Encryptor</CardTitle><CardDescription>Encrypt and decrypt text securely using AES-GCM encryption natively in your browser.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button variant={mode === "encrypt" ? "default" : "outline"} size="sm" onClick={() => { setMode("encrypt"); setResult(""); setError(null); }}>Encrypt</Button>
          <Button variant={mode === "decrypt" ? "default" : "outline"} size="sm" onClick={() => { setMode("decrypt"); setResult(""); setError(null); }}>Decrypt</Button>
        </div>
        
        <div className="space-y-2"><Label>Secret Key (Required)</Label><Input type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Enter a strong secret key..." /></div>
        <div className="space-y-2"><Label>{mode === "encrypt" ? "Text to Encrypt" : "Text to Decrypt (Base64)"}</Label>
          <textarea value={text} onChange={e => setText(e.target.value)} className="min-h-[100px] w-full rounded-xl border border-border bg-background p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        </div>
        
        <Button onClick={process} disabled={!text || !secret}>{mode === "encrypt" ? "Encrypt Text" : "Decrypt Text"}</Button>
        
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && (
          <div className="space-y-2">
            <Label>Result</Label>
            <textarea value={result} readOnly className="min-h-[100px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm font-mono resize-y break-all" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
