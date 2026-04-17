"use client";

import * as React from "react";
import { format } from "sql-formatter";
import { Code, Copy, Check, Broom, Gear } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { toast } from "sonner";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";

const DIALECTS = [
  { id: "sql", name: "Standard SQL" },
  { id: "mysql", name: "MySQL" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "sqlite", name: "SQLite" },
  { id: "tsql", name: "T-SQL (SQL Server)" },
  { id: "oracle", name: "Oracle" },
  { id: "bigquery", name: "BigQuery" },
  { id: "mariadb", name: "MariaDB" },
];

export function SqlFormatterTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [dialect, setDialect] = React.useState("sql");
  const [indent, setIndent] = React.useState("2");
  const [uppercase, setUppercase] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;

    try {
      const formatted = format(input, {
        language: dialect as any,
        tabWidth: parseInt(indent),
        keywordCase: uppercase ? "upper" : "lower",
      });
      setOutput(formatted);
    } catch (error) {
      toast.error("Failed to format SQL. Please check your syntax.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Formatted SQL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    toast.success("Cleared!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
                <Code className="h-6 w-6 text-blue-500" />
                SQL Formatter & Beautifier
              </CardTitle>
              <CardDescription>
                Format your SQL queries to make them readable and clean.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg border">
            <div className="space-y-2">
              <Label>Dialect</Label>
              <Select value={dialect} onValueChange={setDialect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Dialect" />
                </SelectTrigger>
                <SelectContent>
                  {DIALECTS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Indentation</Label>
              <Select value={indent} onValueChange={setIndent}>
                <SelectTrigger>
                  <SelectValue placeholder="Indent Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Spaces</SelectItem>
                  <SelectItem value="4">4 Spaces</SelectItem>
                  <SelectItem value="tab">Tab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <Label htmlFor="uppercase" className="cursor-pointer">Uppercase Keywords</Label>
              <Switch 
                id="uppercase" 
                checked={uppercase} 
                onCheckedChange={setUppercase} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Input SQL</Label>
                <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-[10px]">
                  <Broom className="mr-1 h-3 w-3" /> Clear
                </Button>
              </div>
              <Textarea
                placeholder="SELECT * FROM users WHERE id = 1;"
                className="min-h-[300px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Formatted Result</Label>
                <Button 
                  key="copy-btn"
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy} 
                  disabled={!output}
                  className="h-8 text-[10px]"
                >
                  {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  Copy
                </Button>
              </div>
              <div className="relative group">
                <Textarea
                  readOnly
                  placeholder="Formatted result will appear here..."
                  className="min-h-[300px] font-mono text-sm resize-none bg-muted/30"
                  value={output}
                />
              </div>
            </div>
          </div>

          <Button className="w-full h-12 text-lg" onClick={handleFormat} disabled={!input.trim()}>
            Format SQL Query
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
