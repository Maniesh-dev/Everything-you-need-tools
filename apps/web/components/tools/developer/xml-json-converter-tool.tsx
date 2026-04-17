"use client";

import * as React from "react";
import { xml2json, json2xml } from "xml-js";
import { ArrowsLeftRight, Code, Copy, Check, Broom, FileCode } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export function XmlJsonConverterTool() {
  const [xmlInput, setXmlInput] = React.useState("");
  const [jsonInput, setJsonInput] = React.useState("");
  const [mode, setMode] = React.useState<"xml2json" | "json2xml">("xml2json");
  const [copied, setCopied] = React.useState(false);

  const handleConvert = () => {
    try {
      if (mode === "xml2json") {
        if (!xmlInput.trim()) return;
        const result = xml2json(xmlInput, { compact: true, spaces: 2 });
        setJsonInput(result);
        toast.success("Converted to JSON!");
      } else {
        if (!jsonInput.trim()) return;
        const result = json2xml(jsonInput, { compact: true, spaces: 2 });
        setXmlInput(result);
        toast.success("Converted to XML!");
      }
    } catch (error) {
      toast.error(`Conversion failed: ${(error as Error).message}`);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setXmlInput("");
    setJsonInput("");
    toast.success("Cleared!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowsLeftRight className="h-6 w-6 text-indigo-500" />
            XML ↔ JSON Converter
          </CardTitle>
          <CardDescription>
            Seamlessly convert between XML and JSON data formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="xml2json" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" /> XML to JSON
              </TabsTrigger>
              <TabsTrigger value="json2xml" className="flex items-center gap-2">
                <Code className="h-4 w-4" /> JSON to XML
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {mode === "xml2json" ? "XML Input" : "JSON Input"}
                  </Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-[10px]">
                    <Broom className="mr-1 h-3 w-3" /> Clear
                  </Button>
                </div>
                <Textarea
                  placeholder={mode === "xml2json" ? "<note>\n  <body>Hello</body>\n</note>" : '{\n  "note": {\n    "body": "Hello"\n  }\n}'}
                  className="min-h-[400px] font-mono text-xs shadow-inner"
                  value={mode === "xml2json" ? xmlInput : jsonInput}
                  onChange={(e) => mode === "xml2json" ? setXmlInput(e.target.value) : setJsonInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Result ({mode === "xml2json" ? "JSON" : "XML"})
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopy(mode === "xml2json" ? jsonInput : xmlInput)}
                    disabled={mode === "xml2json" ? !jsonInput : !xmlInput}
                    className="h-7 text-[10px]"
                  >
                    {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                    Copy
                  </Button>
                </div>
                <Textarea
                  readOnly
                  placeholder="The converted data will appear here..."
                  className="min-h-[400px] font-mono text-xs bg-muted/20"
                  value={mode === "xml2json" ? jsonInput : xmlInput}
                />
              </div>
            </div>

            <Button className="w-full mt-6 h-12 text-lg font-heading" onClick={handleConvert}>
              Convert to {mode === "xml2json" ? "JSON" : "XML"}
            </Button>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground italic">Pro Tip:</p>
            <p>• The converter uses the "compact" format for cleaner JSON outputs.</p>
            <p>• Ensure your JSON keys follow XML naming rules (no spaces, starts with letter) for successful JSON to XML conversion.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
