"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

export function ColorPaletteTool() {
  const [palette, setPalette] = React.useState<Color[]>([]);

  const generatePalette = () => {
    const baseH = Math.floor(Math.random() * 360);
    const baseS = 40 + Math.floor(Math.random() * 40); // 40-80%
    const baseL = 40 + Math.floor(Math.random() * 20); // 40-60%

    // Create 5 variations: Analogous + Base
    const colors = [
      hslToColor(baseH, baseS, baseL),
      hslToColor((baseH + 30) % 360, baseS, baseL),
      hslToColor((baseH + 60) % 360, baseS, baseL),
      hslToColor((baseH + 180) % 360, baseS - 10, baseL + 10),
      hslToColor((baseH + 210) % 360, baseS - 10, baseL + 10),
    ];
    setPalette(colors);
  };

  const hslToColor = (h: number, s: number, l: number): Color => {
    const hex = hslToHex(h, s, l);
    const rgb = hslToRgb(h, s, l);
    return { hex, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, hsl: `hsl(${h}, ${s}%, ${l}%)` };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number, g: number, b: number } => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  React.useEffect(() => { generatePalette(); }, []);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Color copied!");
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Color Palette Generator</CardTitle>
            <CardDescription>Generate random but balanced color palettes for your UI designs.</CardDescription>
          </div>
          <Button onClick={generatePalette} className="rounded-full shadow-lg h-10 w-10 p-0" variant="secondary">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex h-[300px] rounded-2xl overflow-hidden border">
           {palette.map((c, i) => (
             <div 
               key={i} 
               className="flex-1 flex flex-col items-center justify-end pb-8 gap-4 transition-all hover:flex-[1.5] group cursor-pointer relative"
               style={{ backgroundColor: c.hex }}
               onClick={() => copy(c.hex)}
             >
                <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-[10px] font-bold text-white tracking-widest uppercase">Click to Copy</p>
                </div>
                <div className="bg-white/90 px-3 py-2 rounded-xl text-center shadow-lg">
                   <p className="text-sm font-bold">{c.hex}</p>
                   <p className="text-[9px] text-muted-foreground font-mono">{c.rgb}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
           <Button variant="outline" className="w-full" onClick={() => copy(palette.map(p => p.hex).join(", "))}>Copy as HEX List</Button>
           <Button variant="outline" className="w-full" onClick={() => copy(palette.map((p, i) => `--color-${i+1}: ${p.hex};`).join("\n"))}>Copy as CSS Variables</Button>
        </div>

      </CardContent>
    </Card>
  );
}
