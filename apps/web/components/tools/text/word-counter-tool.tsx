"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function WordCounterTool() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const lines = text.trim() === "" ? 0 : text.split("\n").length;
    const avgWordLen = words > 0 ? (charsNoSpaces / words).toFixed(1) : "0";
    const readTime = Math.max(1, Math.ceil(words / 200));
    const speakTime = Math.max(1, Math.ceil(words / 130));
    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, avgWordLen, readTime, speakTime };
  }, [text]);

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Word & Character Counter</CardTitle>
        <CardDescription>Count words, characters, sentences, paragraphs and estimate reading time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="min-h-[200px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
        />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {[
            ["Words", stats.words],
            ["Characters", stats.chars],
            ["No Spaces", stats.charsNoSpaces],
            ["Sentences", stats.sentences],
            ["Paragraphs", stats.paragraphs],
            ["Lines", stats.lines],
            ["Avg Word", stats.avgWordLen],
            ["Read (min)", stats.readTime],
            ["Speak (min)", stats.speakTime],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setText("")} disabled={!text}>Clear</Button>
      </CardContent>
    </Card>
  );
}
