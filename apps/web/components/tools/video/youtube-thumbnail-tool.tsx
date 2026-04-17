"use client";

import * as React from "react";
import { YoutubeLogo, Download, Copy, Check } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { toast } from "sonner";

interface ThumbnailInfo {
  url: string;
  label: string;
  resolution: string;
}

export function YoutubeThumbnailTool() {
  const [videoUrl, setVideoUrl] = React.useState("");
  const [thumbnails, setThumbnails] = React.useState<ThumbnailInfo[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7] && match[7].length === 11) ? match[7] : null;
  };

  const getThumbnails = () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    const host = "https://img.youtube.com/vi";
    const formats: ThumbnailInfo[] = [
      { url: `${host}/${videoId}/maxresdefault.jpg`, label: "High Resolution (HD)", resolution: "1280x720" },
      { url: `${host}/${videoId}/sddefault.jpg`, label: "Standard Definition", resolution: "640x480" },
      { url: `${host}/${videoId}/hqdefault.jpg`, label: "High Quality", resolution: "480x360" },
      { url: `${host}/${videoId}/mqdefault.jpg`, label: "Medium Quality", resolution: "320x180" },
    ];
    setThumbnails(formats);
    setLoading(false);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Thumbnail URL copied!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDownload = async (url: string, label: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `youtube-thumbnail-${label.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Direct download might fail due to CORS on img.youtube.com for some users
      // Fallback: Open in new tab
      window.open(url, "_blank");
      toast.info("Download started in a new tab");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <YoutubeLogo className="h-6 w-6 text-red-600" />
            Enter YouTube Video URL
          </CardTitle>
          <CardDescription>
            Support for standard links, shorts, and mobile URLs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={getThumbnails} disabled={!videoUrl || loading}>
              Get Thumbnails
            </Button>
          </div>
        </CardContent>
      </Card>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {thumbnails.map((thumb, index) => (
            <Card key={index} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted animate-in fade-in zoom-in duration-300">
                {/* Image check since maxresdefault doesn't exist for all videos */}
                <img
                  src={thumb.url}
                  alt={thumb.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide HD if it fails (not all videos have HD)
                    if (thumb.resolution === "1280x720") {
                      (e.target as HTMLImageElement).closest('.card')?.setAttribute('style', 'display: none');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary" onClick={() => handleDownload(thumb.url, thumb.label)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleCopy(thumb.url)}>
                    {copiedUrl === thumb.url ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    Copy URL
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{thumb.label}</span>
                  <Badge variant="outline">{thumb.resolution}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Badge component wrapper for local use if not in UI
function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) {
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
