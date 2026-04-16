"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import Papa from "papaparse";

export function CsvToJsonTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const convert = () => {
    if (!input.trim()) return;
    
    Papa.parse(input, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        if (results.errors && results.errors.length > 0) {
          toast.error("Parsing failed: " + (results.errors[0]?.message || "Unknown error"));
        } else {
          setOutput(JSON.stringify(results.data, null, 2));
          toast.success("CSV converted to JSON");
        }
      }
    });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          setInput(Papa.unparse(results.data));
          setOutput(JSON.stringify(results.data, null, 2));
          toast.success("File loaded and converted");
        }
      });
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>CSV to JSON Converter</CardTitle>
        <CardDescription>Convert CSV data or Excel exports into structured JSON format.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <p className="text-sm font-medium">Input CSV</p>
             <div className="flex gap-2">
               <input 
                 type="file" 
                 accept=".csv" 
                 className="hidden" 
                 id="csv-upload" 
                 onChange={handleFileUpload}
               />
               <Button size="sm" variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                 Upload .csv
               </Button>
               <Button size="sm" variant="ghost" onClick={() => setInput("")}>Clear</Button>
             </div>
          </div>
          <Textarea 
            placeholder={"name,age,city\nJohn,30,New York\nJane,25,Los Angeles"} 
            className="min-h-[200px] font-mono text-sm" 
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <Button className="w-full font-bold" onClick={convert}>Convert to JSON</Button>

        {output && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">JSON Result</p>
               <Button size="sm" variant="ghost" onClick={copy}>Copy JSON</Button>
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
