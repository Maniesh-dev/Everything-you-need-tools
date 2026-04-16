"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import yaml from "js-yaml";

export function YamlJsonConverterTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");

  const convert = () => {
    try {
      if (!input.trim()) return;
      
      if (mode === "yaml-to-json") {
        const obj = yaml.load(input);
        setOutput(JSON.stringify(obj, null, 2));
        toast.success("YAML converted to JSON");
      } else {
        const obj = JSON.parse(input);
        setOutput(yaml.dump(obj));
        toast.success("JSON converted to YAML");
      }
    } catch (err: any) {
      toast.error(`Conversion failed: ${err.message}`);
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const toggleMode = () => {
     setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
     setInput(output);
     setOutput("");
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>YAML ↔ JSON Converter</CardTitle>
        <CardDescription>Convert between YAML and JSON formats with ease.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex justify-center mb-4">
           <Button variant="outline" className="rounded-full px-6 gap-2" onClick={toggleMode}>
              {mode === "yaml-to-json" ? "YAML → JSON" : "JSON → YAML"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
           </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Input {mode === "yaml-to-json" ? "YAML" : "JSON"}</p>
          <Textarea 
            placeholder={mode === "yaml-to-json" ? "key: value\nlist:\n  - item 1" : '{\n  "key": "value"\n}'} 
            className="min-h-[200px] font-mono text-sm" 
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <Button className="w-full font-bold" onClick={convert}>Convert</Button>

        {output && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">Result {mode === "yaml-to-json" ? "JSON" : "YAML"}</p>
               <Button size="sm" variant="ghost" onClick={copy}>Copy to Clipboard</Button>
            </div>
            <Textarea 
              readOnly
              className="min-h-[200px] font-mono text-sm bg-muted/20" 
              value={output}
            />
          </div>
        )}

      </CardContent>
    </Card>
  );
}
