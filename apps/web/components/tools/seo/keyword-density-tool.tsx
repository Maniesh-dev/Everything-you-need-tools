"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

export function KeywordDensityTool() {
  const [text, setText] = React.useState("");
  
  const results = React.useMemo(() => {
    if (!text.trim()) return [];
    
    // simple word tokenization
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    const total = words.length;
    
    if (total === 0) return [];

    const counts: Record<string, number> = {};
    words.forEach(w => { counts[w] = (counts[w] || 0) + 1; });

    const sorted = Object.entries(counts)
      .map(([word, count]) => ({ word, count, density: ((count / total) * 100).toFixed(2) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return sorted;
  }, [text]);

  const totalWords = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Keyword Density Checker</CardTitle><CardDescription>Analyze text to find the most frequently used words and their density percentages.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <Textarea 
          placeholder="Paste your article or content here..." 
          className="min-h-[250px]" 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        
        {results.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex justify-between">
              <span>Top Keywords</span>
              <span className="text-sm font-normal text-muted-foreground ml-auto">Total Words: {totalWords}</span>
            </h3>
            
            <div className="grid gap-2">
              <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                <div className="col-span-6">Keyword</div>
                <div className="col-span-3 text-right">Count</div>
                <div className="col-span-3 text-right">Density</div>
              </div>
              
              {results.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center bg-muted/20 p-2 rounded-lg border border-border/50 text-sm">
                  <div className="col-span-6 font-medium truncate pr-2">{item.word}</div>
                  <div className="col-span-3 text-right font-mono">{item.count}</div>
                  <div className="col-span-3 text-right font-mono">
                    <span className={`px-2 py-1 rounded-md ${parseFloat(item.density) > 5 ? 'bg-red-500/10 text-red-600' : parseFloat(item.density) > 2 ? 'bg-orange-500/10 text-orange-600' : 'bg-green-500/10 text-green-600'}`}>
                      {item.density}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
