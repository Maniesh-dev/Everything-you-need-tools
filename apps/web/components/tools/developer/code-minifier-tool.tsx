"use client";

import * as React from "react";
import { minify as terserMinify } from "terser";
import { Code, Copy, Check, Broom, Lightning, FileHtml, FileCss, FileJs, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { toast } from "sonner";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";

export function CodeMinifierTool() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<"html" | "css" | "javascript">("javascript");
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<{ original: number; minified: number; reduction: number } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const minifyJS = async (code: string) => {
    try {
      const result = await terserMinify(code, {
        compress: true,
        mangle: true,
      });
      return result.code || "";
    } catch (error) {
      throw new Error(`JS Minification failed: ${(error as Error).message}`);
    }
  };

  const minifyCSS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s*([\{\}:;,])\s*/g, "$1") // Remove spaces around delimiters
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  };

  const minifyHTML = (code: string) => {
    return code
      .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .replace(/>\s+</g, "><") // Remove space between tags
      .trim();
  };

  const handleMinify = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      let minified = "";
      if (mode === "javascript") {
        minified = await minifyJS(input);
      } else if (mode === "css") {
        minified = minifyCSS(input);
      } else {
        minified = minifyHTML(input);
      }

      setOutput(minified);

      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      const reduction = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;

      setStats({
        original: originalSize,
        minified: minifiedSize,
        reduction: Math.max(0, reduction),
      });

      toast.success("Minification complete!");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Minified code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning className="h-6 w-6 text-yellow-500" />
            Code Minifier (HTML/CSS/JS)
          </CardTitle>
          <CardDescription>
            Compress your web code to reduce file size and improve loading speed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setOutput(""); setStats(null); }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="javascript" className="flex items-center gap-2">
                <FileJs className="h-4 w-4" /> JS
              </TabsTrigger>
              <TabsTrigger value="css" className="flex items-center gap-2">
                <FileCss className="h-4 w-4" /> CSS
              </TabsTrigger>
              <TabsTrigger value="html" className="flex items-center gap-2">
                <FileHtml className="h-4 w-4" /> HTML
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Original Code</Label>
                  <Button variant="ghost" size="sm" onClick={() => setInput("")} className="h-7 text-[10px]">
                    <Broom className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
                <Textarea
                  placeholder={`Paste your ${mode.toUpperCase()} code here...`}
                  className="min-h-[400px] font-mono text-xs shadow-inner resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Minified Output</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!output}
                    className="h-7 text-[10px]"
                  >
                    {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                    Copy Result
                  </Button>
                </div>
                <Textarea
                  readOnly
                  placeholder="Minified code will appear here..."
                  className="min-h-[400px] font-mono text-xs bg-muted/20 resize-none"
                  value={output}
                />
              </div>
            </div>

            <Button className="w-full mt-6 h-12 text-lg" onClick={handleMinify} disabled={loading || !input.trim()}>
              {loading ? "Compressing..." : `Minify ${mode.toUpperCase()}`}
            </Button>
          </Tabs>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <StatCard label="Original Size" value={formatSize(stats.original)} />
          <StatCard label="Minified Size" value={formatSize(stats.minified)} />
          <StatCard 
            label="Reduction" 
            value={`${stats.reduction.toFixed(1)}%`} 
            highlight 
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <Card className={highlight ? "bg-emerald-500/10 border-emerald-500/20" : ""}>
      <CardContent className="pt-6 pb-6 text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-bold ${highlight ? "text-emerald-500" : ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
