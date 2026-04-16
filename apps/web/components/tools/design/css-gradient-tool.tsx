"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function CssGradientTool() {
  const [type, setType] = React.useState<"linear" | "radial">("linear");
  const [angle, setAngle] = React.useState(90);
  const [color1, setColor1] = React.useState("#ec4899");
  const [color2, setColor2] = React.useState("#8b5cf6");
  
  const css = type === "linear" 
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;
    
  const rule = `background: ${css};`;

  async function copy() { await navigator.clipboard.writeText(rule); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>CSS Gradient Generator</CardTitle><CardDescription>Create beautiful CSS gradients visually and export the code.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="h-48 w-full rounded-2xl border border-border/50 shadow-inner overflow-hidden transition-all duration-300" style={{ background: css }} />
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button variant={type === "linear" ? "default" : "outline"} className="w-full" onClick={() => setType("linear")}>Linear</Button>
                <Button variant={type === "radial" ? "default" : "outline"} className="w-full" onClick={() => setType("radial")}>Radial</Button>
              </div>
            </div>
            
            {type === "linear" && (
              <div className="space-y-2">
                <div className="flex justify-between"><Label>Angle</Label><span className="text-xs text-muted-foreground">{angle}°</span></div>
                <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Color 1</Label>
              <div className="flex gap-2">
                <Input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-12 p-1 h-10 cursor-pointer shrink-0" />
                <Input value={color1} onChange={e => setColor1(e.target.value)} className="font-mono uppercase transition-colors" style={{ borderColor: color1 }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color 2</Label>
              <div className="flex gap-2">
                <Input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-12 p-1 h-10 cursor-pointer shrink-0" />
                <Input value={color2} onChange={e => setColor2(e.target.value)} className="font-mono uppercase transition-colors" style={{ borderColor: color2 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Label>CSS Code</Label>
          <div className="flex gap-2">
            <Input value={rule} readOnly className="font-mono text-xs bg-muted/20" />
            <Button shrink-0 onClick={copy}>Copy CSS</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
