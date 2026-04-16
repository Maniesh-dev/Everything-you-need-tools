"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

const BRAILLE_MAP: Record<string, string> = {
  "a": "⠁", "b": "⠃", "c": "⠉", "d": "⠙", "e": "⠑", "f": "⠋", "g": "⠛", "h": "⠓", "i": "⠊", "j": "⠚",
  "k": "⠅", "l": "⠇", "m": "⠍", "n": "⠝", "o": "⠕", "p": "⠏", "q": "⠟", "r": "⠗", "s": "⠎", "t": "⠞",
  "u": "⠥", "v": "⠧", "w": "⠺", "x": "⠭", "y": "⠽", "z": "⠵",
  "1": "⠼⠁", "2": "⠼⠃", "3": "⠼⠉", "4": "⠼⠙", "5": "⠼⠑", "6": "⠼⠋", "7": "⠼⠛", "8": "⠼⠓", "9": "⠼⠊", "0": "⠼⠚",
  ",": "⠂", ";": "⠆", ":": "⠒", ".": "⠲", "!": "⠖", "?": "⠦", " ": " "
};

export function BrailleConverterTool() {
  const [text, setText] = React.useState("");
  const [braille, setBraille] = React.useState("");

  const handleTextChange = (val: string) => {
    setText(val);
    const b = val.toLowerCase().split('').map(char => BRAILLE_MAP[char] || char).join('');
    setBraille(b);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Braille Converter</CardTitle><CardDescription>Convert normal text into Unicode Braille characters instantly.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold">Normal Text</label>
          <Textarea 
            placeholder="Type your text here..." 
            className="min-h-[120px] resize-none text-base" 
            value={text} 
            onChange={e => handleTextChange(e.target.value)} 
          />
        </div>
        
        <div className="flex items-center justify-center -my-2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-up"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Braille (Unicode)</label>
          <Textarea 
            placeholder="⠞⠽⠏⠑ ⠽⠕⠥⠗ ⠞⠑⠭⠞ ⠓⠑⠗⠑" 
            className="min-h-[120px] resize-none text-3xl tracking-widest text-primary" 
            value={braille}
            readOnly
          />
        </div>

      </CardContent>
    </Card>
  );
}
