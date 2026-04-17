"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Globe as GlobeIcon, MagnifyingGlass as SearchIcon, HardDrives as ServerIcon, WarningCircle as WarningCircleIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export function DnsLookupTool() {
  const [domain, setDomain] = React.useState("");
  const [recordType, setRecordType] = React.useState("ANY");
  const [isLoading, setIsLoading] = React.useState(false);
  const [records, setRecords] = React.useState<DnsRecord[] | null>(null);
  const [error, setError] = React.useState("");

  const dnsTypeMap: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
    33: 'SRV',
    255: 'ANY'
  };

  const lookupDns = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!domain) return;

    let cleanDomain = domain.trim();
    if (cleanDomain.startsWith('http://') || cleanDomain.startsWith('https://')) {
      try {
        const urlObj = new URL(cleanDomain);
        cleanDomain = urlObj.hostname;
      } catch (err) {
        // if it fails, just use the raw string
      }
    }
    
    // Remove trailing slash if any
    cleanDomain = cleanDomain.replace(/\/$/, "");

    if (!cleanDomain) return;

    setIsLoading(true);
    setError("");
    setRecords(null);

    try {
      // Using Google's public DNS-over-HTTPS JSON API
      // We pass the raw name and the type string
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=${recordType}`);
      const data = await response.json();

      if (data.Status !== 0) {
        // Status 3 is NXDOMAIN (domain doesn't exist)
        if (data.Status === 3) throw new Error("Domain not found (NXDOMAIN)");
        throw new Error(`DNS resolution failed with status: ${data.Status}`);
      }

      if (data.Answer) {
        setRecords(data.Answer);
      } else {
        setRecords([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch DNS records.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>DNS Lookup</CardTitle>
        <CardDescription>Query specific DNS records for any domain using Google public DNS.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <form onSubmit={lookupDns} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="pl-10 h-12 text-lg"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          
          <div className="w-full sm:w-32">
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger className="h-12 text-sm"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">ANY</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="AAAA">AAAA</SelectItem>
                <SelectItem value="CNAME">CNAME</SelectItem>
                <SelectItem value="MX">MX</SelectItem>
                <SelectItem value="TXT">TXT</SelectItem>
                <SelectItem value="NS">NS</SelectItem>
                <SelectItem value="SOA">SOA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" disabled={!domain || isLoading} className="h-12 px-8">
            <SearchIcon className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Searching..." : "Lookup"}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-3">
            <WarningCircleIcon className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {records && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ServerIcon className="h-4 w-4" /> 
              {records.length === 0 ? "No records found" : `${records.length} Record${records.length === 1 ? '' : 's'} Found`}
            </h3>
            
            {records.length > 0 && (
              <div className="border rounded-xl overflow-hidden bg-muted/20">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-muted text-muted-foreground text-xs uppercase border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Domain Name</th>
                        <th className="px-4 py-3 font-medium">TTL</th>
                        <th className="px-4 py-3 font-medium">Value / Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {records.map((r, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-mono bg-background">
                              {dnsTypeMap[r.type] || `TYPE${r.type}`}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{r.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.TTL}s</td>
                          <td className="px-4 py-3 font-mono text-xs break-all max-w-[300px] sm:max-w-md overflow-hidden text-ellipsis bg-background cursor-text select-all">
                            {r.data}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
