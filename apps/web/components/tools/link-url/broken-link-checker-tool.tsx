"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { LinkBreak as LinkBreakIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon, ArrowsClockwise as RefreshIcon, Trash as TrashIcon, ListPlus as ListPlusIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

interface LinkStatus {
  url: string;
  status: "pending" | "checking" | "up" | "down" | "error";
  code?: number;
  message?: string;
}

export function BrokenLinkCheckerTool() {
  const [urlList, setUrlList] = React.useState("");
  const [results, setResults] = React.useState<LinkStatus[]>([]);
  const [isChecking, setIsChecking] = React.useState(false);

  const startCheck = async () => {
    const urls = urlList
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map((u) => (u.startsWith("http") ? u : `https://${u}`));

    if (urls.length === 0) return;

    const initialResults: LinkStatus[] = urls.map((url) => ({ url, status: "pending" }));
    setResults(initialResults);
    setIsChecking(true);

    for (let i = 0; i < initialResults.length; i++) {
      const item = initialResults[i];
      if (!item) continue;
      const currentUrl = item.url;
      
      setResults((prev) => 
        prev.map((item, idx) => idx === i ? { ...item, status: "checking" } : item)
      );

      try {
        // We use 'no-cache' and a HEAD request if possible, but fetch is limited by CORS
        // Most sites will block this, so we explain it's a "Connectivity & CORS health check"
        const response = await fetch(currentUrl, { 
          method: "HEAD", 
          mode: "no-cors" // no-cors doesn't allow reading status code, but success means "opaque" result
        });
        
        // Note: With mode 'no-cors', we can't see the status code. 
        // If it throws, it's down or blocked. If it succeeds, it's at least reachable.
        setResults((prev) => 
          prev.map((item, idx) => idx === i ? { ...item, status: "up", message: "Reachable (Opaque)" } : item)
        );
      } catch (err: any) {
        setResults((prev) => 
          prev.map((item, idx) => idx === i ? { ...item, status: "down", message: "Connection Refused / Blocked" } : item)
        );
      }
    }
    
    setIsChecking(false);
  };

  const getStatusBadge = (status: LinkStatus["status"]) => {
    switch (status) {
      case "up": return <Badge className="bg-green-500/10 text-green-600 border-green-200">Online</Badge>;
      case "down": return <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200">Offline / Blocked</Badge>;
      case "checking": return <Badge variant="outline" className="animate-pulse">Checking...</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkBreakIcon className="h-6 w-6 text-primary" weight="duotone" />
          Broken Link Checker
        </CardTitle>
        <CardDescription>
          Check a list of URLs for availability and reachability. Note: Browser-side checks are subject to CORS limitations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 font-semibold">
            <ListPlusIcon className="h-4 w-4" /> Destination URLs (one per line)
          </Label>
          <Textarea
            placeholder="google.com&#10;github.com/non-existent-page&#10;https://example.org"
            value={urlList}
            onChange={(e) => setUrlList(e.target.value)}
            disabled={isChecking}
            className="min-h-[150px] font-mono text-sm shadow-sm"
          />
        </div>

        <Button 
          onClick={startCheck} 
          disabled={isChecking || !urlList.trim()} 
          className="w-full h-12 text-lg font-bold shadow-md"
        >
          {isChecking ? (
            <>
              <RefreshIcon className="mr-2 h-5 w-5 animate-spin" />
              Scanning Links...
            </>
          ) : (
            "Verify URL Reachability"
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Scan Results</h3>
              <Button variant="ghost" size="sm" onClick={() => setResults([])} className="h-8 text-xs">
                <TrashIcon className="mr-1 h-3 w-3" /> Clear Results
              </Button>
            </div>
            
            <div className="border rounded-2xl overflow-hidden shadow-sm bg-background">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((res, i) => (
                      <TableRow key={i} className="hover:bg-muted/30">
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {res.url}
                        </TableCell>
                        <TableCell>{getStatusBadge(res.status)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground italic">
                          {res.message || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-amber-50/50 dark:bg-amber-950/10 border-t border-amber-100 dark:border-amber-900/30 p-6 rounded-b-xl flex gap-3 items-start">
        <WarningIcon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
           <p className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase">CORS Limitation Note</p>
           <p className="text-xs text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
             Browser-side checkers cannot bypass Cross-Origin Resource Sharing (CORS) rules. If a website explicitly blocks automated browser requests, it may appear as "Offline" even if it's reachable via a normal browser tab.
           </p>
        </div>
      </CardFooter>
    </Card>
  );
}
