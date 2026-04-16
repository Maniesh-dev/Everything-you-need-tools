"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function MetaTagGeneratorTool() {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [keywords, setKeywords] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [robots, setRobots] = React.useState("index, follow");
  const [previewOpen, setPreviewOpen] = React.useState(false);

  const metaHtml = `<title>${title || "Site Title"}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="${robots}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">`;

  const copy = async () => { await navigator.clipboard.writeText(metaHtml); };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Meta Tag Generator</CardTitle><CardDescription>Generate HTML SEO meta tags for your website headers.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label>Site Title (max 60 chars)</Label><Input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} /></div>
          <div className="space-y-2 md:col-span-2"><Label>Site Description (max 160 chars)</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={160} rows={3} /></div>
          <div className="space-y-2"><Label>Keywords (comma separated)</Label><Input value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
          <div className="space-y-2"><Label>Author</Label><Input value={author} onChange={e => setAuthor(e.target.value)} /></div>
          <div className="space-y-2 md:col-span-2">
            <Label>Robots Tag</Label>
            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={robots} onChange={e => setRobots(e.target.value)}>
              <option value="index, follow">Index, Follow</option>
              <option value="index, nofollow">Index, No Follow</option>
              <option value="noindex, follow">No Index, Follow</option>
              <option value="noindex, nofollow">No Index, No Follow</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Label>Generated Meta Tags</Label>
          <div className="relative">
            <Textarea value={metaHtml} readOnly rows={10} className="font-mono text-xs bg-muted/20" />
            <Button onClick={copy} size="sm" className="absolute top-2 right-2">Copy HTML</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
