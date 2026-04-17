"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { BracketsCurly as BracesIcon, Globe as GlobeIcon, ArrowsClockwise as RefreshIcon, Trash as TrashIcon, Clock as ClockIcon, Lightning as LightningIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

export function ApiFormatterTool() {
  const [url, setUrl] = React.useState("");
  const [method, setMethod] = React.useState("GET");
  const [headers, setHeaders] = React.useState("");
  const [body, setBody] = React.useState("");
  const [response, setResponse] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [responseTime, setResponseTime] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<number | null>(null);

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const handleFetch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);
    setStatus(null);

    const startTime = performance.now();

    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          throw new Error("Invalid headers JSON format");
        }
      }

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...parsedHeaders,
        },
      };

      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        try {
          JSON.parse(body); // Validate body is JSON
          options.body = body;
        } catch (e) {
          throw new Error("Invalid body JSON format");
        }
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      
      setResponseTime(Math.round(endTime - startTime));
      setStatus(res.status);

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setResponse(data);
      } else {
        const data = await res.text();
        setResponse(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setUrl("");
    setHeaders("");
    setBody("");
    setResponse(null);
    setError(null);
    setStatus(null);
    setResponseTime(null);
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlobeIcon className="h-6 w-6 text-primary" weight="duotone" />
          API Response Formatter
        </CardTitle>
        <CardDescription>Test API endpoints and format responses instantly. Supports JSON validation and response timing.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleFetch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-32">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="h-12 text-base pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {isLoading ? <RefreshIcon className="h-5 w-5 animate-spin" /> : <GlobeIcon className="h-5 w-5" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Headers (JSON)</Label>
              <Textarea 
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{ "Authorization": "Bearer token" }'
                className="font-mono text-xs min-h-[100px] bg-muted/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Body (JSON)</Label>
              <Textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{ "key": "value" }'
                className="font-mono text-xs min-h-[100px] bg-muted/20"
                disabled={method === "GET"}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 h-12 text-lg shadow-md" disabled={!url || isLoading}>
              {isLoading ? "Fetching..." : "Send Request"}
            </Button>
            <Button type="button" variant="outline" size="icon" className="h-12 w-12 text-red-500" onClick={clear}>
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {(error || response || status !== null) && (
          <div className="space-y-4 pt-6 border-t animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-wrap items-center gap-3 justify-between">
               <h3 className="font-semibold text-sm flex items-center gap-2">
                <BracesIcon className="h-4 w-4" /> Response Output
              </h3>
              <div className="flex gap-2">
                {status !== null && (
                  <Badge variant={status >= 200 && status < 300 ? "default" : "destructive"} className="font-mono">
                    Status: {status}
                  </Badge>
                )}
                {responseTime !== null && (
                  <Badge variant="secondary" className="font-mono flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" /> {responseTime}ms
                  </Badge>
                )}
              </div>
            </div>

            {error ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 text-sm">
                {error}
              </div>
            ) : response && (
              <div className="relative group">
                <Textarea 
                  value={formatJson(response)}
                  readOnly
                  className="font-mono text-xs min-h-[300px] bg-black text-green-400 p-4 rounded-xl overflow-auto focus-visible:ring-0"
                  spellCheck={false}
                />
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => navigator.clipboard.writeText(formatJson(response))}
                >
                  Copy JSON
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-primary/5 border-t border-border/50 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <LightningIcon className="h-4 w-4 text-amber-500" weight="fill" />
          Pro-tip: All requests are made client-side. Some APIs may block requests due to CORS settings.
        </div>
      </CardFooter>
    </Card>
  );
}
