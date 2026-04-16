"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function YoutubeTesterTool() {
  const [title, setTitle] = React.useState("");
  
  const chars = title.length;
  // YouTube cuts off around 60-70 chars on desktop/mobile
  const optimal = chars > 40 && chars <= 60;
  const tooLong = chars > 70;
  const max = 100;

  let message = "";
  let colorClass = "text-muted-foreground";

  if (chars === 0) {
    message = "Start typing your title...";
  } else if (chars < 40) {
    message = "A bit too short. Try to add more descriptive keywords.";
    colorClass = "text-orange-500";
  } else if (optimal) {
    message = "Optimal length! This title will fully display on most devices.";
    colorClass = "text-green-500";
  } else if (chars <= 70) {
    message = "Good, but might get slightly truncated on smaller screens.";
    colorClass = "text-yellow-500";
  } else if (!tooLong) {
      // Unreachable logically since tooLong is > 70, but fallback.
  } else if (tooLong) {
    message = "Too long! This will get truncated on almost all devices. Put important keywords first.";
    colorClass = "text-red-500";
  }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>YouTube Title Tester</CardTitle><CardDescription>Check if your YouTube title is optimized for search and fully visible across devices.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Video Title</Label>
          <Input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="How to Master Next.js 14 in 30 Minutes" 
            maxLength={max}
            className="text-lg py-6"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${chars > 70 ? 'bg-red-500' : chars > 60 ? 'bg-yellow-500' : chars > 40 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${Math.min((chars / max) * 100, 100)}%` }}></div>
          </div>
          <div className="font-mono font-bold">
            {chars} / {max}
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-xl border">
          <p className={`font-semibold ${colorClass}`}>{message}</p>
        </div>

        {title && (
          <div className="pt-4 border-t space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preview</h3>
            
            <div className="max-w-[320px] bg-background border p-2 rounded-lg shadow-sm">
               <div className="w-full aspect-video bg-muted rounded-md mb-2 flex items-center justify-center text-muted-foreground/50 text-xs">Thumbnail</div>
               <h4 className="font-semibold text-sm leading-tight line-clamp-2">
                 {title}
               </h4>
               <p className="text-xs text-muted-foreground mt-1">Channel Name • 1M views • 2 hours ago</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
