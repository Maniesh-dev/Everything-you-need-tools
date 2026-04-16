"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function RomanNumeralTool() {
  const [arabic, setArabic] = React.useState("");
  const [roman, setRoman] = React.useState("");

  const intToRoman = (num: number): string => {
    const map: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [val, char] of map) {
      while (num >= val) {
        result += char;
        num -= val;
      }
    }
    return result;
  };

  const romanToInt = (s: string): number => {
    const map: Record<string, number> = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    let result = 0;
    for (let i = 0; i < s.length; i++) {
      const current = map[s[i]!];
      const next = map[s[i + 1]!];
      if (current === undefined) return NaN;
      if (next !== undefined && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  };

  function handleArabicChange(val: string) {
    setArabic(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0 && num < 4000) {
      setRoman(intToRoman(num));
    } else {
      setRoman("");
    }
  }

  function handleRomanChange(val: string) {
    const str = val.toUpperCase().replace(/[^IVXLCDM]/g, "");
    setRoman(str);
    if (str) {
      const num = romanToInt(str);
      if (!isNaN(num)) {
        setArabic(num.toString());
      } else {
        setArabic("");
      }
    } else {
      setArabic("");
    }
  }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Roman Numeral Converter</CardTitle><CardDescription>Convert between numbers (1-3999) and Roman numerals.</CardDescription></CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Number (Arabic)</Label>
          <Input type="number" value={arabic} onChange={e => handleArabicChange(e.target.value)} placeholder="e.g. 2024" min="1" max="3999" />
        </div>
        <div className="space-y-2">
          <Label>Roman Numeral</Label>
          <Input type="text" value={roman} onChange={e => handleRomanChange(e.target.value)} placeholder="e.g. MMXXIV" className="uppercase font-mono" />
        </div>
      </CardContent>
    </Card>
  );
}
