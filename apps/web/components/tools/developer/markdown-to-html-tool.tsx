"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { marked } from "marked";

export function MarkdownToHtmlTool() {
  const [input, setInput] = React.useState("# Hello World\n\n- List item 1\n- List item 2\n\n**Bold text**");
  const [output, setOutput] = React.useState("");
  const [showPreview, setShowPreview] = React.useState(true);

  const convert = async () => {
    try {
      const html = await marked.parse(input);
      setOutput(html);
      toast.success("Markdown converted");
    } catch (err) {
      toast.error("Conversion failed");
    }
  };

  React.useEffect(() => {
    convert();
  }, [input]);

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("HTML copied to clipboard");
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle>Markdown to HTML</CardTitle>
        <CardDescription>Compose Markdown and instantly convert it to clean HTML with a live preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <p className="text-sm font-medium">Editor (Markdown)</p>
               <Button size="sm" variant="ghost" onClick={() => setInput("")}>Clear</Button>
            </div>
            <Textarea 
              placeholder="Write your markdown here..." 
              className="min-h-[400px] font-mono text-sm leading-relaxed" 
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center h-8">
               <div className="flex gap-2">
                 <Button 
                   size="sm" 
                   variant={showPreview ? "secondary" : "ghost"} 
                   onClick={() => setShowPreview(true)}
                 >
                   Preview
                 </Button>
                 <Button 
                   size="sm" 
                   variant={!showPreview ? "secondary" : "ghost"} 
                   onClick={() => setShowPreview(false)}
                 >
                   HTML
                 </Button>
               </div>
               <Button size="sm" variant="outline" onClick={copy}>Copy Output</Button>
            </div>

            {showPreview ? (
              <div 
                className="min-h-[400px] p-6 rounded-xl border bg-muted/20 prose prose-sm dark:prose-invert max-w-none overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <Textarea 
                readOnly
                className="min-h-[400px] font-mono text-xs bg-muted/20" 
                value={output}
              />
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
