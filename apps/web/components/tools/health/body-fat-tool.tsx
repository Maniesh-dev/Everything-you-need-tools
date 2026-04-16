"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";

export function BodyFatTool() {
  const [gender, setGender] = React.useState<"male" | "female">("male");
  const [height, setHeight] = React.useState(170);
  const [waist, setWaist] = React.useState(80);
  const [neck, setNeck] = React.useState(40);
  const [hip, setHip] = React.useState(90); // only for female

  const [result, setResult] = React.useState<number | null>(null);

  const calculateInfo = () => {
    let bf = 0;
    if (gender === "male") {
      // US Navy Method (cm)
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
    setResult(Math.max(0, Math.round(bf * 10) / 10));
  };

  const getCategory = (bf: number) => {
    if (gender === "male") {
      if (bf < 6) return { label: "Essential Fat", color: "text-blue-500" };
      if (bf < 14) return { label: "Athelete", color: "text-emerald-500" };
      if (bf < 18) return { label: "Fitness", color: "text-green-500" };
      if (bf < 25) return { label: "Average", color: "text-yellow-500" };
      return { label: "Obese", color: "text-red-500" };
    } else {
      if (bf < 14) return { label: "Essential Fat", color: "text-blue-500" };
      if (bf < 21) return { label: "Athelete", color: "text-emerald-500" };
      if (bf < 25) return { label: "Fitness", color: "text-green-500" };
      if (bf < 32) return { label: "Average", color: "text-yellow-500" };
      return { label: "Obese", color: "text-red-500" };
    }
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle>Body Fat Estimator</CardTitle>
        <CardDescription>Estimate your body fat percentage using the US Navy Method.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
           <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                 </SelectContent>
              </Select>
           </div>
           <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
           </div>
           <div className="space-y-2">
              <Label>Waist (cm)</Label>
              <Input type="number" value={waist} onChange={e => setWaist(Number(e.target.value))} />
           </div>
           <div className="space-y-2">
              <Label>Neck (cm)</Label>
              <Input type="number" value={neck} onChange={e => setNeck(Number(e.target.value))} />
           </div>
           {gender === "female" && (
             <div className="space-y-2">
                <Label>Hip (cm)</Label>
                <Input type="number" value={hip} onChange={e => setHip(Number(e.target.value))} />
             </div>
           )}
        </div>

        <Button className="w-full h-12 text-lg font-bold" onClick={calculateInfo}>Calculate Body Fat %</Button>

        {result !== null && (
          <div className="pt-6 border-t text-center space-y-2">
             <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Your Estimated Body Fat</p>
             <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black">{result}%</span>
                <span className={`text-lg font-bold ${getCategory(result).color}`}>{getCategory(result).label}</span>
             </div>
             <p className="text-xs text-muted-foreground max-w-xs mx-auto pt-2 italic">
                *The US Navy Method provides an estimate. For precision, consider a DEXA scan or hydro-static weighing.
             </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
