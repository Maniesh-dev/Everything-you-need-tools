"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export function JsonToCsvTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  const flattenObject = (obj: any, prefix = ""): any => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + "." : "";
      if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = typeof obj[k] === "object" && obj[k] !== null ? JSON.stringify(obj[k]) : obj[k];
      }
      return acc;
    }, {});
  };

  const convert = () => {
    try {
      if (!input.trim()) return;
      const json = JSON.parse(input);
      const arr = Array.isArray(json) ? json : [json];
      
      if (arr.length === 0) {
        setOutput("");
        return;
      }

      const flattened = arr.map(item => flattenObject(item));
      const headers = Array.from(new Set(flattened.flatMap(item => Object.keys(item))));
      
      const csvRows = [
        headers.join(","),
        ...flattened.map(row => 
          headers.map(h => {
            const val = row[h] === undefined || row[h] === null ? "" : String(row[h]);
            return `"${val.replace(/"/g, '""')}"`;
          }).join(",")
        )
      ];

      setOutput(csvRows.join("\n"));
      toast.success("JSON converted to CSV");
    } catch (err: any) {
      toast.error("Invalid JSON input");
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "converted.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>JSON to CSV Converter</CardTitle><CardDescription>Convert JSON data arrays into a flat CSV format for Excel and Google Sheets.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Input JSON</p>
          <Textarea 
            placeholder='[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]' 
            className="min-h-[200px] font-mono text-sm" 
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
           <Button className="flex-1 font-bold" onClick={convert}>Convert to CSV</Button>
           <Button variant="outline" onClick={() => setInput("")}>Clear</Button>
        </div>

        {output && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">CSV Result</p>
               <div className="flex gap-2">
                 <Button size="sm" variant="ghost" onClick={copy}>Copy</Button>
                 <Button size="sm" onClick={download}>Download .csv</Button>
               </div>
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
