"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

const EMOJI_LIST = [
  "😀","😂","🤣","😊","😍","🥰","😘","😭","😅","🥺",
  "😎","🤔","🙄","😴","😷","🥳","🤯","🤬","💀","👽",
  "👍","👎","👏","🙌","👐","🤝","✌️","🤞","🎯","🔥",
  "✨","🎉","🎈","❤️","💔","💯","✅","❌","🚀","💡"
];

export function EmojiPickerTool() {
  const [selected, setSelected] = React.useState("");

  const copy = async () => {
    if (selected) {
      await navigator.clipboard.writeText(selected);
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Emoji Picker</CardTitle><CardDescription>Pick and combine popular emojis to copy them to your clipboard.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        
        <div className="flex gap-2 w-full max-w-md">
          <Input 
            value={selected} 
            onChange={e => setSelected(e.target.value)} 
            className="text-2xl h-14" 
            placeholder="Select emojis below..." 
          />
          <Button onClick={copy} size="lg" className="h-14 shrink-0 font-bold">Copy</Button>
          <Button onClick={() => setSelected("")} variant="secondary" size="lg" className="h-14 shrink-0">Clear</Button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 pt-4">
          {EMOJI_LIST.map((e, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelected(prev => prev + e)}
              className="text-3xl hover:scale-125 transition-transform duration-200 aspect-square flex items-center justify-center bg-muted/20 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border"
            >
              {e}
            </button>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
