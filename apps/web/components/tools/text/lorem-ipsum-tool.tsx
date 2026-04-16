"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = React.useState(3);
  const [result, setResult] = React.useState("");

  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
    "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula ut dictum pharetra, nisi nunc fringilla magna.",
    "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
    "Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.",
    "Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit.",
    "Pellentesque egestas sem. Suspendisse commodo ullamcorper magna. Ut nulla. Vivamus bibendum, nulla ut congue fringilla, lorem ipsum ultricies risus, ut rutrum velit tortor vel purus.",
  ];

  function generate() {
    const count = Math.max(1, Math.min(20, paragraphs));
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(LOREM[i % LOREM.length] as string);
    }
    setResult(result.join("\n\n"));
  }

  async function copy() {
    if (result) await navigator.clipboard.writeText(result);
  }

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Lorem Ipsum Generator</CardTitle>
        <CardDescription>Generate placeholder text for your designs and layouts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="space-y-2">
            <Label>Paragraphs</Label>
            <Input type="number" min={1} max={20} value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))} className="w-24" />
          </div>
          <Button onClick={generate}>Generate</Button>
        </div>
        {result && (
          <div className="space-y-2">
            <textarea value={result} readOnly className="min-h-[200px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm resize-y" />
            <Button size="sm" onClick={copy}>Copy Text</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
