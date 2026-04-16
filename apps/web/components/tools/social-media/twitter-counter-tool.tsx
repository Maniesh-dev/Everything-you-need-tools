"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";

export function TwitterCounterTool() {
  const [text, setText] = React.useState("");
  
  const MAX_LIMIT = 280;
  const chars = text.length;
  const remaining = MAX_LIMIT - chars;
  
  const percentage = Math.min((chars / MAX_LIMIT) * 100, 100);
  
  let color = "bg-primary";
  if (remaining <= 20 && remaining > 0) color = "bg-orange-500";
  if (remaining <= 0) color = "bg-red-500";

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Twitter Character Counter</CardTitle><CardDescription>Draft your tweets and ensure they fit within the 280 character limit.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <Textarea 
          placeholder="What is happening?!" 
          className="min-h-[150px] text-lg resize-none" 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${color}`} style={{ width: `${percentage}%` }}></div>
          </div>
          <div className={`font-mono font-bold text-lg ${remaining < 0 ? 'text-red-500' : ''}`}>
            {remaining}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
