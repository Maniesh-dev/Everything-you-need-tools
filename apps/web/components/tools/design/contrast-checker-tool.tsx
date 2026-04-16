"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1]!, 16), parseInt(result[2]!, 16), parseInt(result[3]!, 16)] : null;
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

function calculateRatio(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return null;
  const lum1 = luminance(rgb1[0]!, rgb1[1]!, rgb1[2]!);
  const lum2 = luminance(rgb2[0]!, rgb2[1]!, rgb2[2]!);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function ContrastCheckerTool() {
  const [fg, setFg] = React.useState("#FFFFFF");
  const [bg, setBg] = React.useState("#3B82F6");

  const ratio = React.useMemo(() => calculateRatio(fg, bg), [fg, bg]);
  
  const results = React.useMemo(() => {
    if (!ratio) return null;
    return {
      ratio: ratio.toFixed(2),
      aaLarge: ratio >= 3,
      aaNormal: ratio >= 4.5,
      aaaLarge: ratio >= 4.5,
      aaaNormal: ratio >= 7,
    };
  }, [ratio]);

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Contrast Checker</CardTitle><CardDescription>Check if your text and background colors meet WCAG accessibility standards.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Text Color (Foreground)</Label>
            <div className="flex gap-2">
              <Input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-12 p-1 h-10 cursor-pointer" />
              <Input value={fg} onChange={e => setFg(e.target.value)} className="font-mono uppercase" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-12 p-1 h-10 cursor-pointer" />
              <Input value={bg} onChange={e => setBg(e.target.value)} className="font-mono uppercase" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <div className="p-8 text-center" style={{ color: fg, backgroundColor: bg }}>
            <p className="text-2xl font-bold mb-2">The quick brown fox jumps over the lazy dog</p>
            <p className="text-sm border-t pt-4" style={{ borderColor: fg }}>Contrast Ratio Preview Panel</p>
          </div>
        </div>

        {results && (
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-muted/10 p-3">
                <p className="text-sm font-semibold mb-2">AA Standard</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Normal Text</span><span>{results.aaNormal ? "✅ Pass" : "❌ Fail"}</span></div>
                  <div className="flex justify-between"><span>Large Text</span><span>{results.aaLarge ? "✅ Pass" : "❌ Fail"}</span></div>
                </div>
              </div>
              <div className="rounded-xl border bg-muted/10 p-3">
                <p className="text-sm font-semibold mb-2">AAA Standard</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Normal Text</span><span>{results.aaaNormal ? "✅ Pass" : "❌ Fail"}</span></div>
                  <div className="flex justify-between"><span>Large Text</span><span>{results.aaaLarge ? "✅ Pass" : "❌ Fail"}</span></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center rounded-xl bg-primary/10 px-8 py-4">
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest">Ratio</p>
              <p className="text-4xl font-bold text-primary">{results.ratio}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
