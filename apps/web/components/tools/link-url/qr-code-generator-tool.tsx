"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export function QrCodeGeneratorTool() {
  const [text, setText] = React.useState("https://kraaft.com");
  const [fgColor, setFgColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [size, setSize] = React.useState(256);
  const [level, setLevel] = React.useState<"L" | "M" | "Q" | "H">("L");
  const [includeMargin, setIncludeMargin] = React.useState(true);

  const qrRef = React.useRef<HTMLDivElement>(null);

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded as PNG");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Generate high-quality QR codes for URLs, text, or contact info.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Text or URL</Label>
              <Input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Foreground Color</Label>
                 <div className="flex gap-2 items-center">
                    <Input type="color" className="p-1 h-10 w-20" value={fgColor} onChange={e => setFgColor(e.target.value)} />
                    <span className="text-xs font-mono uppercase">{fgColor}</span>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Background Color</Label>
                 <div className="flex gap-2 items-center">
                    <Input type="color" className="p-1 h-10 w-20" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                    <span className="text-xs font-mono uppercase">{bgColor}</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Error Correction</Label>
                 <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
                    {["L", "M", "Q", "H"].map((lvl) => (
                      <Button 
                        key={lvl}
                        size="sm"
                        variant={level === lvl ? "secondary" : "ghost"}
                        className="flex-1 h-8"
                        onClick={() => setLevel(lvl as any)}
                      >
                        {lvl}
                      </Button>
                    ))}
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Options</Label>
                 <div className="flex h-10 items-center justify-between border rounded-lg px-3">
                    <span className="text-xs font-medium">Include Margin</span>
                    <input 
                      type="checkbox" 
                      className="accent-primary h-4 w-4" 
                      checked={includeMargin} 
                      onChange={e => setIncludeMargin(e.target.checked)} 
                    />
                 </div>
               </div>
            </div>

            <Button className="w-full h-12 font-bold" onClick={downloadQr}>Download PNG</Button>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-muted/10 rounded-2xl border border-dashed border-border/60">
             <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105">
                <QRCodeSVG 
                  value={text} 
                  size={size} 
                  level={level} 
                  fgColor={fgColor}
                  bgColor={bgColor}
                  marginSize={includeMargin ? 4 : 0}
                />
             </div>
             <p className="mt-6 text-xs text-muted-foreground text-center font-medium"> Live Preview - {size}x{size}px</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
