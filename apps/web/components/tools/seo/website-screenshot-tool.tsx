"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Camera as CameraIcon, DownloadSimple as DownloadIcon, Monitor as MonitorIcon, DeviceMobile as DeviceMobileIcon, Globe as GlobeIcon, ArrowsClockwise as RefreshIcon } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";

export function WebsiteScreenshotTool() {
  const [url, setUrl] = React.useState("");
  const [width, setWidth] = React.useState("1280");
  const [isFullPage, setIsFullPage] = React.useState("false");
  const [isLoading, setIsLoading] = React.useState(false);
  const [screenshotUrl, setScreenshotUrl] = React.useState<string | null>(null);

  const captureScreenshot = () => {
    if (!url) return;
    
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    setIsLoading(true);
    setScreenshotUrl(null);

    // Using thum.io API
    // Format: //image.thum.io/get/width/{width}/[fullpage]/[refresh]/[auth]/{URL}
    const params = [];
    params.push(`width/${width}`);
    if (isFullPage === "true") params.push("fullpage");
    
    const finalScreenshotUrl = `https://image.thum.io/get/${params.join("/")}/${targetUrl}`;
    
    // Test the image loading
    const img = new Image();
    img.onload = () => {
      setScreenshotUrl(finalScreenshotUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      alert("Failed to capture screenshot. Make sure the URL is public and accessible.");
      setIsLoading(false);
    };
    img.src = finalScreenshotUrl;
  };

  const downloadScreenshot = async () => {
    if (!screenshotUrl) return;
    
    try {
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `screenshot-${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback if fetch fails due to CORS on the raw image endpoint
      window.open(screenshotUrl, "_blank");
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CameraIcon className="h-6 w-6 text-primary" weight="duotone" />
          Website Screenshot
        </CardTitle>
        <CardDescription>
          Capture and download high-quality screenshots of any public website instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" /> Website URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://google.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && captureScreenshot()}
                className="h-12 flex-1 shadow-sm"
              />
              <Button 
                onClick={captureScreenshot} 
                disabled={isLoading || !url} 
                className="h-12 px-8 shadow-md"
              >
                {isLoading ? (
                  <RefreshIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CameraIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Capturing..." : "Capture"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Viewport Width</Label>
              <Select value={width} onValueChange={setWidth}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920">Desktop Large (1920px)</SelectItem>
                  <SelectItem value="1280">Desktop (1280px)</SelectItem>
                  <SelectItem value="1024">Tablet Landscape (1024px)</SelectItem>
                  <SelectItem value="768">Tablet Portrait (768px)</SelectItem>
                  <SelectItem value="375">Mobile (375px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Capture Mode</Label>
              <Select value={isFullPage} onValueChange={setIsFullPage}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Above the Fold (Viewport)</SelectItem>
                  <SelectItem value="true">Full Page (Entire Length)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {screenshotUrl && !isLoading && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500 pt-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <MonitorIcon className="h-4 w-4" /> Preview
              </Label>
              <Button variant="outline" size="sm" onClick={downloadScreenshot} className="shadow-sm">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
            <div className="relative border rounded-2xl overflow-hidden bg-muted/20 shadow-lg ring-1 ring-border/50">
              <img 
                src={screenshotUrl} 
                alt="Website screenshot" 
                className="w-full object-contain max-h-[600px]"
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 border-2 border-dashed rounded-2xl bg-muted/5">
             <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <CameraIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary shadow-sm" weight="duotone" />
             </div>
             <div className="text-center space-y-1">
                <h4 className="font-semibold text-lg">Capturing Website...</h4>
                <p className="text-sm text-muted-foreground">This usually takes 5-10 seconds depending on page size.</p>
             </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl">
        <div className="flex gap-2 items-start w-full">
           <DeviceMobileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
           <p className="text-xs text-muted-foreground">
             <strong>Note:</strong> Some websites with anti-bot protection or heavy JavaScript may not render perfectly. Thum.io free tier supports up to 1,000 captures per month.
           </p>
        </div>
      </CardFooter>
    </Card>
  );
}
