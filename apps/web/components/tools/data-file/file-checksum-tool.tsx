"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export function FileChecksumTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [checksums, setChecksums] = React.useState<{ algo: string; hash: string }[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const calculateHashes = async (f: File) => {
    setIsProcessing(true);
    try {
      const buffer = await f.arrayBuffer();
      const algos: AlgorithmIdentifier[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      
      const results = await Promise.all(algos.map(async (algo) => {
        const hashBuffer = await crypto.subtle.digest(algo, buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return { algo: String(algo), hash: hashHex };
      }));

      setChecksums(results);
      toast.success("Hashes calculated successfully");
    } catch (err) {
      toast.error("Failed to calculate hashes");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      calculateHashes(f);
    }
  };

  const copy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Hash copied to clipboard");
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>File Checksum Verifier</CardTitle>
        <CardDescription>Verify file integrity by calculating SHA-1, SHA-256, and SHA-512 hashes locally.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <input 
          ref={fileInputRef} 
          type="file" 
          className="hidden" 
          onChange={handleFile} 
        />

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center bg-muted/20 hover:bg-muted/30 transition-colors"
        >
          {file ? (
            <div className="space-y-1">
               <p className="font-semibold text-primary">{file.name}</p>
               <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
               <p className="text-xs text-primary/70 mt-2">Click to change file</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Click to select or drag file here</p>
          )}
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <p className="text-sm animate-pulse">Calculating hashes...</p>
          </div>
        )}

        {checksums.length > 0 && !isProcessing && (
          <div className="space-y-3 pt-4 border-t">
            {checksums.map((c, i) => (
              <div key={i} className="space-y-1.5 p-3 rounded-xl border bg-muted/10 group">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{c.algo}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copy(c.hash)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
                <div className="font-mono text-[11px] break-all bg-background border rounded px-3 py-2 leading-relaxed">
                  {c.hash}
                </div>
              </div>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
