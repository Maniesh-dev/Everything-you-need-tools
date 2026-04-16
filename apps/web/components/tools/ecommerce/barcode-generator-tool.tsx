"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";

export function BarcodeGeneratorTool() {
  const [text, setText] = React.useState("1234567890");
  const [format, setFormat] = React.useState("CODE128");
  const [width, setWidth] = React.useState(2);
  const [height, setHeight] = React.useState(100);
  const [displayValue, setDisplayValue] = React.useState(true);

  const svgRef = React.useRef<SVGSVGElement>(null);

  const generateBarcode = () => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, text, {
          format,
          width,
          height,
          displayValue,
          background: "transparent",
          lineColor: "currentColor",
          margin: 10
        });
      } catch (err: any) {
        toast.error("Invalid input for " + format);
      }
    }
  };

  React.useEffect(() => {
    generateBarcode();
  }, [text, format, width, height, displayValue]);

  const downloadBarcode = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = svg.getBoundingClientRect().width;
      canvas.height = svg.getBoundingClientRect().height;
      
      // Draw white background if needed for PNG
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "barcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("Barcode downloaded as PNG");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle>Barcode Generator</CardTitle>
        <CardDescription>Generate various barcode formats including CODE128, EAN, and UPC for products and inventory.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Value</Label>
              <Input 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="1234567890"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Format</Label>
                 <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="CODE128">CODE128</SelectItem>
                       <SelectItem value="EAN13">EAN-13</SelectItem>
                       <SelectItem value="UPC">UPC</SelectItem>
                       <SelectItem value="CODE39">CODE39</SelectItem>
                       <SelectItem value="ITF14">ITF-14</SelectItem>
                       <SelectItem value="MSI">MSI</SelectItem>
                       <SelectItem value="pharmacode">Pharmacode</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label>Options</Label>
                 <div className="flex h-10 items-center justify-between border rounded-lg px-3">
                    <span className="text-xs font-medium">Show Text</span>
                    <input 
                      type="checkbox" 
                      className="accent-primary h-4 w-4" 
                      checked={displayValue} 
                      onChange={e => setDisplayValue(e.target.checked)} 
                    />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Bar Width ({width})</Label>
                 <Input type="range" min="1" max="4" step="1" value={width} onChange={e => setWidth(Number(e.target.value))} />
               </div>
               <div className="space-y-2">
                 <Label>Height ({height})</Label>
                 <Input type="range" min="50" max="200" step="10" value={height} onChange={e => setHeight(Number(e.target.value))} />
               </div>
            </div>

            <Button className="w-full h-12 font-bold" onClick={downloadBarcode}>Download PNG</Button>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-muted/10 rounded-2xl border border-dashed border-border/60 min-h-[300px]">
             <div className="bg-white p-6 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <svg ref={svgRef} className="max-w-full h-auto text-black"></svg>
             </div>
             <p className="mt-6 text-xs text-muted-foreground text-center font-medium uppercase tracking-widest">Live Preview</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
