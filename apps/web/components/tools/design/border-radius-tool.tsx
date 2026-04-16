"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function BorderRadiusTool() {
  const [tl, setTl] = React.useState(16);
  const [tr, setTr] = React.useState(16);
  const [br, setBr] = React.useState(16);
  const [bl, setBl] = React.useState(16);
  const [all, setAll] = React.useState(16);
  const [sync, setSync] = React.useState(true);

  React.useEffect(() => {
    if (sync) { setTl(all); setTr(all); setBr(all); setBl(all); }
  }, [all, sync]);

  const cssVal = sync ? `${all}px` : `${tl}px ${tr}px ${br}px ${bl}px`;
  const rule = `border-radius: ${cssVal};`;

  async function copy() { await navigator.clipboard.writeText(rule); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Border Radius Generator</CardTitle><CardDescription>Visually generate CSS border radius values.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center p-8 bg-muted/10 rounded-2xl border border-border/50">
          <div className="h-48 w-48 bg-primary/80 shadow-lg transition-all duration-200 border-4 border-primary/20" style={{ borderRadius: cssVal }} />
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sync} onChange={e => setSync(e.target.checked)} />
            Sync all corners
          </label>
          
          {sync ? (
            <div className="space-y-2">
              <div className="flex justify-between"><Label>All Corners</Label><span className="text-xs">{all}px</span></div>
              <input type="range" min={0} max={100} value={all} onChange={e => setAll(Number(e.target.value))} className="w-full" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><div className="flex justify-between"><Label>Top Left</Label><span className="text-xs">{tl}px</span></div><input type="range" min={0} max={100} value={tl} onChange={e => setTl(Number(e.target.value))} className="w-full" /></div>
              <div className="space-y-2"><div className="flex justify-between"><Label>Top Right</Label><span className="text-xs">{tr}px</span></div><input type="range" min={0} max={100} value={tr} onChange={e => setTr(Number(e.target.value))} className="w-full" /></div>
              <div className="space-y-2"><div className="flex justify-between"><Label>Bottom Left</Label><span className="text-xs">{bl}px</span></div><input type="range" min={0} max={100} value={bl} onChange={e => setBl(Number(e.target.value))} className="w-full" /></div>
              <div className="space-y-2"><div className="flex justify-between"><Label>Bottom Right</Label><span className="text-xs">{br}px</span></div><input type="range" min={0} max={100} value={br} onChange={e => setBr(Number(e.target.value))} className="w-full" /></div>
            </div>
          )}
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
