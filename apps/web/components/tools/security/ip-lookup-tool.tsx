"use client";

import * as React from "react";
import { Globe, MapPin, Building, Broadcast, MapTrifold, ShieldCheck, Copy, Check } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

interface IpData {
  ip: string;
  version: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  org: string;
  asn: string;
}

export function IpLookupTool() {
  const [query, setQuery] = React.useState("");
  const [data, setData] = React.useState<IpData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const fetchIpData = async (ipAddr?: string) => {
    setLoading(true);
    try {
      const url = ipAddr ? `https://ipapi.co/${ipAddr}/json/` : "https://ipapi.co/json/";
      const response = await fetch(url);
      const json = await response.json();

      if (json.error) {
        throw new Error(json.reason || "Invalid IP address");
      }

      setData(json);
      if (!ipAddr) setQuery(json.ip);
    } catch (error) {
      toast.error(`Lookup failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIpData(); // Initial load for current IP
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("IP address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            IP Address Lookup & Diagnostics
          </CardTitle>
          <CardDescription>
            Get detailed geographical and network information for any IP address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" onClick={() => fetchIpData(query)} disabled={loading}>
              {loading ? "Searching..." : "Lookup"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-mono text-primary flex items-center gap-2">
                  {data.ip}
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(data.ip)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardTitle>
                <Badge variant="secondary">{data.version}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4">
                <InfoItem icon={<MapPin />} label="City" value={data.city} />
                <InfoItem icon={<Globe />} label="Region" value={data.region} />
                <InfoItem icon={<Globe />} label="Country" value={`${data.country_name} (${data.country_code})`} />
                <InfoItem icon={<MapTrifold />} label="Postal Code" value={data.postal || "N/A"} />
                <InfoItem icon={<ClockIcon />} label="Timezone" value={`${data.timezone} (${data.utc_offset})`} />
                <InfoItem icon={<Building />} label="Provider (ISP)" value={data.org} />
                <InfoItem icon={<Broadcast />} label="ASN" value={data.asn} />
                <InfoItem icon={<Globe />} label="Coordinates" value={`${data.latitude}, ${data.longitude}`} />
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`, '_blank')}>
                  <MapTrifold className="mr-2 h-4 w-4" /> View on Map
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`https://who.is/whois-ip/ip-address/${data.ip}`, '_blank')}>
                  <Globe className="mr-2 h-4 w-4" /> WHOIS Lookup
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SpecBox label="Currency" value={data.currency} />
              <SpecBox label="Calling Code" value={data.country_calling_code} />
              <SpecBox label="Continent" value={data.continent_code} />
              <div className="pt-4 p-4 rounded-lg bg-background/50 border text-[10px] text-muted-foreground leading-relaxed">
                <p className="font-bold text-[11px] mb-1 text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Privacy Note
                </p>
                This lookup was performed client-side using a third-party API. Your IP was only sent to resolve geographical data.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{label}</dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}

function SpecBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center bg-background p-3 rounded-md border shadow-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
    </svg>
  );
}
