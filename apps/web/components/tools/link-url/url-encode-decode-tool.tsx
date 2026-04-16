"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export function UrlEncodeDecodeTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleAction = (type: "encode" | "decode") => {
    try {
      if (!input.trim()) return;
      if (type === "encode") {
        setOutput(encodeURIComponent(input));
        toast.success("URL encoded successfully");
      } else {
        setOutput(decodeURIComponent(input));
        toast.success("URL decoded successfully");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>URL Encoder / Decoder</CardTitle>
        <CardDescription>Encode and decode URLs to ensure they are safe for web browsers and HTTP requests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Input Text</p>
          <Textarea 
            placeholder="Type or paste your URL here..." 
            className="min-h-[150px] font-mono text-sm" 
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <Button className="h-11 font-bold" onClick={() => handleAction("encode")}>Encode URL</Button>
           <Button variant="outline" className="h-11 font-bold border-primary text-primary hover:bg-primary/5" onClick={() => handleAction("decode")}>Decode URL</Button>
        </div>

        {output && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">Result</p>
               <div className="flex gap-2">
                 <Button size="sm" variant="ghost" onClick={() => setInput(output)}>Use as Input</Button>
                 <Button size="sm" onClick={copy}>Copy to Clipboard</Button>
               </div>
            </div>
            <Textarea 
              readOnly
              className="min-h-[150px] font-mono text-sm bg-muted/20" 
              value={output}
            />
          </div>
        )}

      </CardContent>
    </Card>
  );
}
