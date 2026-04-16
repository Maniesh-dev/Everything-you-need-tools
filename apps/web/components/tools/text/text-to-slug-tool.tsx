"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function TextToSlugTool() {
  const [text, setText] = React.useState("");
  const slug = React.useMemo(() => text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, ""), [text]);
  async function copy() { if (slug) await navigator.clipboard.writeText(slug); }

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Text to URL Slug</CardTitle><CardDescription>Convert any text into a clean, URL-friendly slug instantly.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to slugify..." className="min-h-[100px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        {slug && (
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
            <code className="flex-1 text-sm font-mono break-all">{slug}</code>
            <Button size="sm" onClick={copy}>Copy</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
