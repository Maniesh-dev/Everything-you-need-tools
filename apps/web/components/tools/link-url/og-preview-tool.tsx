"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { ShareNetwork as ShareIcon, Eye as EyeIcon, FacebookLogo as FacebookIcon, TwitterLogo as TwitterIcon, LinkedinLogo as LinkedinIcon, Globe as GlobeIcon, ArrowsClockwise as RefreshIcon } from "@phosphor-icons/react";
import { Separator } from "@workspace/ui/components/separator";

interface OGData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export function OgPreviewTool() {
  const [url, setUrl] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<OGData | null>(null);

  const fetchPreview = async () => {
    if (!url) return;
    
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http")) targetUrl = `https://${targetUrl}`;

    setIsLoading(true);
    setData(null);

    try {
      // Use LinkPreview API (Free tier, limited requests per hour)
      const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY_NOT_NEEDED_FOR_TESTS&q=${encodeURIComponent(targetUrl)}`);
      
      // If no key is provided, it might fail or work on limited trial
      // Alternative: some public proxies or our own logic if we had a backend
      // But since we are purely client-side, we rely on a public service
      
      if (!response.ok) {
        throw new Error("Failed to fetch preview. Free limit and key requirements might apply.");
      }

      const json = await response.json();
      setData({
        title: json.title || "No Title Found",
        description: json.description || "No description available for this webpage.",
        image: json.image || "https://placehold.co/600x315/f1f5f9/64748b?text=No+Image+Found",
        url: targetUrl
      });
    } catch (err) {
      // Manual fallback for demo if API fails
      // In a real app, you'd want a proper API key
      setData({
        title: "Preview Unavailable",
        description: "Could not fetch metadata directly from the browser due to CORS or API limits. Try checking in a normal browser tab.",
        image: "https://placehold.co/600x315/fef2f2/ef4444?text=Preview+Error",
        url: targetUrl
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShareIcon className="h-6 w-6 text-primary" weight="duotone" />
          OG Preview Checker
        </CardTitle>
        <CardDescription>
          See how your website appears when shared on social media platforms like Facebook, Twitter, and LinkedIn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPreview()}
              className="pl-9 h-12 shadow-sm"
            />
          </div>
          <Button onClick={fetchPreview} disabled={isLoading || !url} className="h-12 px-8 shadow-md">
            {isLoading ? <RefreshIcon className="mr-2 h-4 w-4 animate-spin" /> : <EyeIcon className="mr-2 h-4 w-4" />}
            {isLoading ? "Fetching..." : "Preview"}
          </Button>
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Facebook Preview Style */}
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <FacebookIcon weight="fill" className="h-5 w-5" /> Facebook Preview
               </div>
               <div className="border bg-white rounded-lg overflow-hidden shadow-sm dark:bg-[#242526] dark:border-[#3e4042]">
                  <img src={data.image} alt="OG Preview" className="w-full aspect-[1.91/1] object-cover" />
                  <div className="p-3 bg-[#f0f2f5] dark:bg-[#323436] space-y-1">
                     <p className="text-xs text-muted-foreground uppercase uppercase truncate">{new URL(data.url).hostname}</p>
                     <p className="font-bold text-sm line-clamp-1">{data.title}</p>
                     <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
                  </div>
               </div>
            </div>

            {/* Twitter Preview Style */}
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-sky-500 font-bold text-sm">
                  <TwitterIcon weight="fill" className="h-5 w-5" /> Twitter (X) Preview
               </div>
               <div className="border border-border/50 rounded-2xl overflow-hidden bg-white dark:bg-black shadow-sm">
                  <img src={data.image} alt="OG Preview" className="w-full aspect-[1.91/1] object-cover" />
                  <div className="p-3 space-y-0.5 border-t">
                     <p className="text-sm text-muted-foreground truncate">{new URL(data.url).hostname}</p>
                     <p className="font-semibold text-sm line-clamp-1">{data.title}</p>
                     <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
                  </div>
               </div>
            </div>

            {/* LinkedIn Preview Style */}
            <div className="space-y-3 col-span-full">
               <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <LinkedinIcon weight="fill" className="h-5 w-5" /> LinkedIn Preview
               </div>
               <div className="border rounded-lg overflow-hidden bg-white shadow-sm dark:bg-[#1b1f23]">
                  <div className="flex flex-col sm:flex-row h-full">
                     <div className="w-full sm:w-1/3 border-r h-full">
                        <img src={data.image} alt="OG Preview" className="w-full h-full aspect-video sm:aspect-auto object-cover" />
                     </div>
                     <div className="p-4 flex-1 space-y-1 bg-muted/20">
                        <p className="font-bold text-sm line-clamp-2">{data.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{new URL(data.url).hostname}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl flex gap-2 items-start">
        <ShareIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-xs text-muted-foreground">
          This tool generates previews based on the Open Graph (OG) tags and Twitter Card tags found in the target URL's metadata.
        </p>
      </CardFooter>
    </Card>
  );
}
