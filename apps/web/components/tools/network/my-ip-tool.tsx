"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function MyIpTool() {
  const [ip, setIp] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const fetchIp = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setIp(data.ip);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIp();
  }, []);

  const copy = async () => { if (ip) await navigator.clipboard.writeText(ip); };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>My IP Address</CardTitle><CardDescription>Quickly find your current public IP address without any tracking.</CardDescription></CardHeader>
      <CardContent className="space-y-6 text-center">
        
        <div className="bg-muted/10 border p-8 rounded-2xl flex flex-col items-center justify-center min-h-[200px] space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your Public IP</p>
          
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-48 bg-muted rounded"></div>
            </div>
          ) : error ? (
            <p className="text-destructive font-semibold">Failed to fetch IP address.</p>
          ) : (
            <div className="text-4xl sm:text-6xl font-black font-mono tracking-tighter tabular-nums text-primary">{ip}</div>
          )}

          {!loading && !error && ip && (
            <div className="flex gap-2 mt-4">
              <Button onClick={copy} variant="secondary">Copy to Clipboard</Button>
              <Button onClick={fetchIp} variant="outline">Refresh</Button>
            </div>
          )}
          {error && <Button onClick={fetchIp} variant="secondary">Try Again</Button>}
        </div>

      </CardContent>
    </Card>
  );
}
