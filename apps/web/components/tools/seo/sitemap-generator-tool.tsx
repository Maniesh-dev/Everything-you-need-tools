"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { FileCode as FileCodeIcon, DownloadSimple as DownloadIcon, Trash as TrashIcon, ListPlus as ListPlusIcon, CheckCircle as CheckCircleIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

export function SitemapGeneratorTool() {
  const [urls, setUrls] = React.useState("");
  const [priority, setPriority] = React.useState("0.8");
  const [changefreq, setChangefreq] = React.useState("weekly");
  const [generatedSitemap, setGeneratedSitemap] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);

  const generateSitemap = () => {
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      alert("Please enter at least one URL");
      return;
    }

    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const xmlFooter = "\n</urlset>";
    const now = new Date().toISOString().split("T")[0];

    const urlEntries = urlList.map((url) => {
      // Basic URL cleanup
      let formattedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }

      return `
  <url>
    <loc>${formattedUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    setGeneratedSitemap(xmlHeader + urlEntries.join("") + xmlFooter);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSitemap);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadSitemap = () => {
    const blob = new Blob([generatedSitemap], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCodeIcon className="h-6 w-6 text-primary" weight="duotone" />
          XML Sitemap Generator
        </CardTitle>
        <CardDescription>
          Generate a search-engine friendly XML sitemap for your website by entering your URLs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <ListPlusIcon className="h-4 w-4" /> Enter URLs (one per line)
          </Label>
          <Textarea
            placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Default Change Frequency</Label>
            <Select value={changefreq} onValueChange={setChangefreq}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default Priority (0.0 to 1.0)</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                <SelectItem value="0.8">0.8 (High)</SelectItem>
                <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                <SelectItem value="0.3">0.3 (Low)</SelectItem>
                <SelectItem value="0.1">0.1 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generateSitemap} className="w-full h-12 text-lg font-semibold shadow-md">
          Generate Sitemap
        </Button>

        {generatedSitemap && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
              <Label>Generated XML Output</Label>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {generatedSitemap.split("<url>").length - 1} URLs
              </Badge>
            </div>
            <div className="relative group">
              <pre className="bg-muted/50 p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-[300px] whitespace-pre-wrap">
                {generatedSitemap}
              </pre>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={copyToClipboard} className="shadow-sm">
                  {isCopied ? <CheckCircleIcon className="h-4 w-4" /> : "Copy"}
                </Button>
                <Button size="sm" onClick={downloadSitemap} className="shadow-sm">
                  <DownloadIcon className="mr-1 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl">
        <p className="text-xs text-muted-foreground text-center w-full">
          <strong>Tip:</strong> Upload your <code>sitemap.xml</code> to your website's root directory and submit it via Google Search Console.
        </p>
      </CardFooter>
    </Card>
  );
}
