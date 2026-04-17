"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { DownloadSimple as DownloadIcon, Image as ImageIcon, TextT as TypeIcon, Smiley as SmileIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { Switch } from "@workspace/ui/components/switch";

export function FaviconGeneratorTool() {
  const [mode, setMode] = React.useState<"text" | "emoji" | "image">("emoji");

  // Text/Emoji state
  const [content, setContent] = React.useState("🎯");
  const [bgColor, setBgColor] = React.useState("#6366f1");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [isRounded, setIsRounded] = React.useState(true);

  // Image state
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [previewDataUrl, setPreviewDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    drawIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, content, bgColor, textColor, isRounded, imageSrc]);

  const drawIcon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed internal render size
    const SIZE = 512;
    canvas.width = SIZE;
    canvas.height = SIZE;

    ctx.clearRect(0, 0, SIZE, SIZE);

    if (mode === "text" || mode === "emoji") {
      // Draw background
      ctx.fillStyle = bgColor;

      if (isRounded) {
        const radius = SIZE * 0.2; // 20% rounding
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(SIZE - radius, 0);
        ctx.quadraticCurveTo(SIZE, 0, SIZE, radius);
        ctx.lineTo(SIZE, SIZE - radius);
        ctx.quadraticCurveTo(SIZE, SIZE, SIZE - radius, SIZE);
        ctx.lineTo(radius, SIZE);
        ctx.quadraticCurveTo(0, SIZE, 0, SIZE - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, SIZE, SIZE);
      }

      // Draw Content
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const textToDraw = content.substring(0, mode === "text" ? 2 : 1).toUpperCase() || (mode === "text" ? "A" : "🌟");

      // Calculate font size
      const fontSize = mode === "emoji" ? SIZE * 0.65 : SIZE * 0.55;
      ctx.font = `bold ${fontSize}px "Inter", "Segoe UI", sans-serif`;

      // Slight vertical adjustment for emojis vs text
      const yOffset = mode === "emoji" ? SIZE * 0.55 : SIZE * 0.5;

      ctx.fillText(textToDraw, SIZE / 2, yOffset);

      setPreviewDataUrl(canvas.toDataURL("image/png"));
    } else if (mode === "image" && imageSrc) {
      const img = new Image();
      img.onload = () => {
        // Draw image covering the canvas (center crop)
        const scale = Math.max(SIZE / img.width, SIZE / img.height);
        const x = (SIZE / 2) - (img.width / 2) * scale;
        const y = (SIZE / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setPreviewDataUrl(canvas.toDataURL("image/png"));
      };
      img.src = imageSrc;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateAndDownload = async () => {
    if (!previewDataUrl) return;

    const a = document.createElement("a");
    a.href = previewDataUrl;
    a.download = "favicon.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Favicon Generator</CardTitle>
        <CardDescription>Generate favicons from text, emojis, or your own image in seconds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        <div className="grid md:grid-cols-[1fr_300px] gap-8">

          <div className="space-y-6">
            <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="emoji"><SmileIcon className="h-4 w-4 mr-2" />Emoji</TabsTrigger>
                <TabsTrigger value="text"><TypeIcon className="h-4 w-4 mr-2" />Text</TabsTrigger>
                <TabsTrigger value="image"><ImageIcon className="h-4 w-4 mr-2" />Image</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {(mode === "emoji" || mode === "text") && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      <Label>{mode === "emoji" ? "Select an Emoji" : "Letters (1-2 chars)"}</Label>
                      <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={mode === "emoji" ? 2 : 2}
                        className="text-2xl h-14"
                        placeholder={mode === "emoji" ? "🌟" : "Ac"}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 p-1 h-10 cursor-pointer" />
                          <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 p-1 h-10 cursor-pointer" />
                          <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="font-mono" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border p-4 rounded-lg bg-muted/40">
                      <Label className="flex-1 cursor-pointer" htmlFor="rounded-toggle">Rounded Corners</Label>
                      <Switch id="rounded-toggle" checked={isRounded} onCheckedChange={setIsRounded} />
                    </div>
                  </div>
                )}

                {mode === "image" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors">
                      <div className="p-4 bg-primary/10 text-primary rounded-full">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">Click to upload image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
                      </div>
                      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                        Choose File
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </div>

          <div className="bg-muted/30 p-6 rounded-2xl flex flex-col items-center justify-center gap-6 border">
            <div>
              <Label className="text-muted-foreground uppercase text-xs font-semibold tracking-wider mb-4 block text-center">Preview</Label>
              <div className="relative shadow-sm rounded-xl overflow-hidden border border-border/80 bg-white dark:bg-black w-48 h-48 flex items-center justify-center">
                {/* 
                  Hidden canvas used for actual rendering and logic
                  We hide it and instead show an img tag so iOS/Safari doesn't taint it
                */}
                <canvas ref={canvasRef} className="hidden" />

                {previewDataUrl ? (
                  <img src={previewDataUrl} alt="Favicon Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-muted-foreground text-sm">Upload an image</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-center text-xs text-muted-foreground">
              <span className="flex flex-col items-center gap-1 border p-2 rounded-lg bg-background">
                <span className="w-8 h-8 rounded shrink-0 flex items-center justify-center">
                  {previewDataUrl && <img src={previewDataUrl} className="w-4 h-4 object-contain" />}
                </span>
                16x16
              </span>
              <span className="flex flex-col items-center gap-1 border p-2 rounded-lg bg-background">
                <span className="w-8 h-8 rounded shrink-0 flex items-center justify-center">
                  {previewDataUrl && <img src={previewDataUrl} className="w-8 h-8 object-contain" />}
                </span>
                32x32
              </span>
            </div>

            <Button onClick={generateAndDownload} className="w-full" size="lg" disabled={!previewDataUrl && mode === 'image'}>
              <DownloadIcon className="mr-2 w-4 h-4" /> Download PNG
            </Button>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
