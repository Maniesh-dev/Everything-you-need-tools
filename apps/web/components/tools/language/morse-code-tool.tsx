"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

const MORSE_MAP: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..", "0": "-----", "1": ".----", "2": "..---",
  "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..",
  "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
  "-": "-....-", "_": "..--.-", "\"": ".-..-.", "$": "...-..-", "@": ".--.-.",
  " ": "/"
};

const REVERSE_MAP = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

export function MorseCodeTool() {
  const [text, setText] = React.useState("");
  const [morse, setMorse] = React.useState("");

  const handleTextChange = (val: string) => {
    setText(val);
    const m = val.toUpperCase().split('').map(char => MORSE_MAP[char] || char).join(' ');
    setMorse(m);
  };

  const handleMorseChange = (val: string) => {
    setMorse(val);
    // Morse words are usually separated by / or double spaces. Letters by single spaces.
    const t = val.split(' ').map(token => REVERSE_MAP[token] || token).join('');
    setText(t.replace(/\//g, " ")); // fix spacing
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Morse Code Converter</CardTitle><CardDescription>Translate text to Morse code and vice-versa instantly.</CardDescription></CardHeader>
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
          <label className="text-sm font-semibold">Morse Code</label>
          <Textarea 
            placeholder="Type morse code here (e.g. .... . .-.. .-.. ---)" 
            className="min-h-[120px] resize-none text-base font-mono font-bold tracking-widest text-primary" 
            value={morse} 
            onChange={e => handleMorseChange(e.target.value)} 
          />
        </div>
        
        <div className="text-xs text-muted-foreground p-3 border rounded-lg bg-muted/20">
          <strong>Rules:</strong> Letters are separated by a space. Words are separated by a forward slash (<code className="font-bold">/</code>). 
        </div>

      </CardContent>
    </Card>
  );
}
