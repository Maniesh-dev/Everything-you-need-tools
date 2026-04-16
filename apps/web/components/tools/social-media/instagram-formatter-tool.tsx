"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function InstagramFormatterTool() {
  const [text, setText] = React.useState("");

  const formatCaption = () => {
    // Replaces newlines with a zero-width space after the newline 
    // to force Instagram to respect line breaks properly.
    if (!text) return;
    
    // Clean up excessive newlines
    let formatted = text.replace(/(?:\r\n|\r|\n)/g, '\n');
    
    // Add the zero width space (U+200B) at the start of empty lines
    const lines = formatted.split('\n');
    formatted = lines.map(line => {
      if (line.trim() === '') {
        return '\u200B';
      }
      return line;
    }).join('\n');

    navigator.clipboard.writeText(formatted);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Instagram Caption Formatter</CardTitle><CardDescription>Format captions to perfectly preserve clean line breaks on Instagram.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <Textarea 
            placeholder="Type your caption here, use Enter for new gaps..." 
            className="min-h-[200px] resize-none text-base" 
            value={text} 
            onChange={e => setText(e.target.value)} 
          />
        </div>
        
        <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/20">
          <strong>Why use this?</strong> Instagram normally eats empty lines, turning your structured caption into a giant block of text. This tool injects invisible characters to force Instagram to keep your clean paragraphs.
        </div>

        <Button size="lg" className="w-full font-bold h-12" onClick={formatCaption} disabled={!text.trim()}>
          Format & Copy to Clipboard
        </Button>

      </CardContent>
    </Card>
  );
}
