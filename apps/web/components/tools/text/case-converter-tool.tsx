"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

type CaseType = "upper" | "lower" | "title" | "sentence" | "toggle" | "camel" | "pascal" | "snake" | "kebab";

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    case "sentence": return text.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()).replace(/^(.)/, c => c.toUpperCase());
    case "toggle": return text.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join("");
    case "camel": return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
    case "pascal": { const camel = convertCase(text, "camel"); return camel.charAt(0).toUpperCase() + camel.slice(1); }
    case "snake": return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");
    case "kebab": return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
    default: return text;
  }
}

const CASES: { type: CaseType; label: string }[] = [
  { type: "upper", label: "UPPER CASE" },
  { type: "lower", label: "lower case" },
  { type: "title", label: "Title Case" },
  { type: "sentence", label: "Sentence case" },
  { type: "toggle", label: "tOGGLE cASE" },
  { type: "camel", label: "camelCase" },
  { type: "pascal", label: "PascalCase" },
  { type: "snake", label: "snake_case" },
  { type: "kebab", label: "kebab-case" },
];

export function CaseConverterTool() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");

  function apply(type: CaseType) {
    setResult(convertCase(text, type));
  }

  async function copy() {
    if (result) await navigator.clipboard.writeText(result);
  }

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Case Converter</CardTitle>
        <CardDescription>Convert text between upper, lower, title, sentence, camelCase and more.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter your text here..." className="min-h-[120px] w-full rounded-xl border border-border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" />
        <div className="flex flex-wrap gap-2">
          {CASES.map(c => (
            <Button key={c.type} variant="outline" size="sm" onClick={() => apply(c.type)} disabled={!text}>{c.label}</Button>
          ))}
        </div>
        {result && (
          <div className="space-y-2">
            <textarea value={result} readOnly className="min-h-[120px] w-full rounded-xl border border-border bg-muted/20 p-4 text-sm resize-y" />
            <Button size="sm" onClick={copy}>Copy Result</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
