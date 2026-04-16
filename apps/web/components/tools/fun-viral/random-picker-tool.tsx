"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function RandomPickerTool() {
  const [items, setItems] = React.useState("Alice\nBob\nCharlie\nDiana");
  const [winner, setWinner] = React.useState<string | null>(null);
  const [rolling, setRolling] = React.useState(false);

  const pick = () => {
    const lines = items.split("\n").map(l => l.trim()).filter(l => l !== "");
    if (lines.length === 0) return;

    setRolling(true);
    setWinner(null);

    // Fake rolling effect
    let rollCount = 0;
    const maxRolls = 20;
    
    const interval = setInterval(() => {
      const w = lines[Math.floor(Math.random() * lines.length)] || null;
      setWinner(w);
      rollCount++;

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 100);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Random Picker Tool</CardTitle><CardDescription>Enter a list of items and randomly select a winner.</CardDescription></CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        
        <div className="w-full max-w-lg space-y-2">
          <label className="text-sm font-semibold">Choices (One per line)</label>
          <Textarea 
            placeholder="Item 1\nItem 2\nItem 3..." 
            className="min-h-[150px] resize-none text-base" 
            value={items} 
            onChange={e => setItems(e.target.value)} 
          />
        </div>

        <div className="w-full max-w-lg mt-4 h-[120px] bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
          {winner ? (
            <div className={`text-4xl sm:text-5xl font-black tracking-tighter ${rolling ? 'text-primary/50 blur-[2px]' : 'text-primary'}`}>
              {winner}
            </div>
          ) : (
            <div className="text-muted-foreground font-semibold uppercase tracking-widest text-sm">Waiting to pick...</div>
          )}
        </div>
        
        <Button size="lg" className="w-full max-w-lg font-bold h-14 text-lg" onClick={pick} disabled={rolling || !items.trim()}>
          {rolling ? "Drawing Name..." : "Pick a Winner!"}
        </Button>

      </CardContent>
    </Card>
  );
}
