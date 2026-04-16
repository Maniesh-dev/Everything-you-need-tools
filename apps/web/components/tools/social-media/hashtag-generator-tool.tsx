"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function HashtagGeneratorTool() {
  const [text, setText] = React.useState("");
  
  const generate = () => {
    if (!text) return "";
    const words = text.split(/[\s,.;\n]+/).filter(w => w.length > 2);
    // Unique list
    const uniques = Array.from(new Set(words));
    return uniques.map(w => `#${w.toLowerCase()}`).join(" ");
  };

  const hashtags = generate();

  const copy = async () => { if (hashtags) await navigator.clipboard.writeText(hashtags); };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Hashtag Generator</CardTitle><CardDescription>Convert a list of keywords or a paragraph into formatted hashtags.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <Textarea 
          placeholder="Enter keywords separated by spaces or commas..." 
          className="min-h-[100px]" 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        
        {hashtags && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium">Your Hashtags</h3>
            <div className="relative">
              <Textarea value={hashtags} readOnly className="min-h-[100px] bg-muted/20 pr-24" />
              <Button size="sm" onClick={copy} className="absolute right-2 top-2">Copy All</Button>
            </div>
            <p className="text-xs text-muted-foreground">{hashtags.split(" ").length} hashtags generated.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
