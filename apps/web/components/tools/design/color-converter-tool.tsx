"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1]!, 16), g: parseInt(result[2]!, 16), b: parseInt(result[3]!, 16) } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function ColorConverterTool() {
  const [hex, setHex] = React.useState("#3B82F6");
  const [rgb, setRgb] = React.useState("59, 130, 246");
  const [hsl, setHsl] = React.useState("217, 90%, 60%");
  
  function updateFromHex(val: string) {
    setHex(val);
    const parsedRgb = hexToRgb(val);
    if (parsedRgb) {
      setRgb(`${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b}`);
      const parsedHsl = rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b);
      setHsl(`${parsedHsl.h}, ${parsedHsl.s}%, ${parsedHsl.l}%`);
    }
  }

  function updateFromRgb(val: string) {
    setRgb(val);
    const match = val.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]!), g = parseInt(match[2]!), b = parseInt(match[3]!);
      if (r <= 255 && g <= 255 && b <= 255) {
        setHex(rgbToHex(r, g, b));
        const parsedHsl = rgbToHsl(r, g, b);
        setHsl(`${parsedHsl.h}, ${parsedHsl.s}%, ${parsedHsl.l}%`);
      }
    }
  }

  function updateFromHsl(val: string) {
    setHsl(val);
    const match = val.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
    if (match) {
      const h = parseInt(match[1]!), s = parseInt(match[2]!), l = parseInt(match[3]!);
      if (h <= 360 && s <= 100 && l <= 100) {
        const parsedRgb = hslToRgb(h, s, l);
        setRgb(`${parsedRgb.r}, ${parsedRgb.g}, ${parsedRgb.b}`);
        setHex(rgbToHex(parsedRgb.r, parsedRgb.g, parsedRgb.b));
      }
    }
  }

  async function copy(val: string) { await navigator.clipboard.writeText(val); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Color Converter</CardTitle><CardDescription>Convert colors between HEX, RGB, and HSL formats.</CardDescription></CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>HEX</Label>
            <div className="flex gap-2">
              <Input value={hex} onChange={e => updateFromHex(e.target.value)} placeholder="#000000" className="font-mono" />
              <Button variant="outline" onClick={() => copy(hex)}>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>RGB</Label>
            <div className="flex gap-2">
              <Input value={rgb} onChange={e => updateFromRgb(e.target.value)} placeholder="0, 0, 0" className="font-mono" />
              <Button variant="outline" onClick={() => copy(`rgb(${rgb})`)}>Copy</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>HSL</Label>
            <div className="flex gap-2">
              <Input value={hsl} onChange={e => updateFromHsl(e.target.value)} placeholder="0, 0%, 0%" className="font-mono" />
              <Button variant="outline" onClick={() => copy(`hsl(${hsl})`)}>Copy</Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="h-40 w-40 rounded-full shadow-lg border-4 border-white dark:border-zinc-800 transition-colors" style={{ backgroundColor: hex || "transparent" }} />
        </div>
      </CardContent>
    </Card>
  );
}
