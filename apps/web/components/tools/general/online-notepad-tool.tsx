"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function OnlineNotepadTool() {
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("notepad_draft");
    if (saved) setContent(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    localStorage.setItem("notepad_draft", val);
  };

  const copy = async () => { await navigator.clipboard.writeText(content); };
  
  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notepad.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setContent("");
    localStorage.removeItem("notepad_draft");
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Online Notepad</CardTitle><CardDescription>A simple scratchpad. Notes are autosaved locally in your browser.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex gap-2">
           <Button variant="secondary" size="sm" onClick={copy}>Copy All</Button>
           <Button variant="secondary" size="sm" onClick={download}>Download .txt</Button>
           <Button variant="destructive" size="sm" onClick={clear} className="ml-auto">Clear</Button>
        </div>

        <Textarea 
          value={content}
          onChange={handleChange}
          placeholder="Start typing your notes here..."
          className="min-h-[400px] text-base resize-y leading-relaxed font-mono"
        />

        <div className="flex justify-between text-xs text-muted-foreground pt-2 px-2">
           <span>{content.length} characters</span>
           <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
        </div>

      </CardContent>
    </Card>
  );
}
