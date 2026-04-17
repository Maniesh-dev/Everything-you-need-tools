"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Globe as GlobeIcon, MagnifyingGlass as SearchIcon, Calendar as CalendarIcon, Info as InfoIcon, WarningCircle as WarningCircleIcon, Clock as ClockIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

interface DomainData {
  domain: string;
  created?: string;
  updated?: string;
  expiry?: string;
  registrar?: string;
  ageInDays?: number;
  status?: string[];
}

export function DomainAgeCheckerTool() {
  const [domain, setDomain] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DomainData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const checkDomainAge = async () => {
    if (!domain) return;
    
    // Simple validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain.trim().toLowerCase())) {
      setError("Please enter a valid domain name (e.g., google.com)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use RDAP via rdap.org which is CORS-friendly
      const cleanDomain = domain.trim().toLowerCase();
      const response = await fetch(`https://rdap.org/domain/${cleanDomain}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? "Domain not found or registry not supported by RDAP." : "Failed to fetch domain data.");
      }

      const data = await response.json();
      
      // Parse dates from 'events' array
      // Standard event actions in RDAP: 'registration', 'last update', 'expiration'
      const events = data.events || [];
      const registrationEvent = events.find((e: any) => e.eventAction === "registration");
      const updateEvent = events.find((e: any) => e.eventAction === "last update");
      const expirationEvent = events.find((e: any) => e.eventAction === "expiration");

      const created = registrationEvent?.eventDate;
      const updated = updateEvent?.eventDate;
      const expiry = expirationEvent?.eventDate;
      
      let ageInDays = 0;
      if (created) {
        const born = new Date(created);
        const now = new Date();
        ageInDays = Math.floor((now.getTime() - born.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Registrar usually in 'entities'
      const registrarEntity = data.entities?.find((e: any) => e.roles?.includes("registrar"));
      const registrar = registrarEntity?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3];

      setResult({
        domain: cleanDomain,
        created,
        updated,
        expiry,
        registrar: registrar || "Unknown",
        ageInDays,
        status: data.status || []
      });
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAge = (days: number) => {
    if (days < 0) return "Just registered";
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    const finalDays = remainingDays % 30;

    let parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (finalDays > 0 || parts.length === 0) parts.push(`${finalDays} day${finalDays > 1 ? 's' : ''}`);
    
    return parts.join(", ");
  };

  const formatDate = (isoStr: string | undefined) => {
    if (!isoStr) return "N/A";
    return new Date(isoStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-6 w-6 text-primary" weight="duotone" />
          Domain Age Checker
        </CardTitle>
        <CardDescription>
          Check the registration date, age, and expiration of any domain name.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <GlobeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Enter domain (e.g., apple.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkDomainAge()}
              className="pl-9 h-12"
            />
          </div>
          <Button onClick={checkDomainAge} disabled={isLoading} className="h-12 px-8">
            {isLoading ? "Checking..." : "Check Age"}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 animate-in fade-in slide-in-from-top-1">
            <WarningCircleIcon className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{result.domain}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4" />
                    Domain Age: <span className="font-semibold text-foreground">{formatAge(result.ageInDays || 0)}</span>
                  </p>
                </div>
                <Badge variant="secondary" className="px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                  {result.ageInDays && result.ageInDays > 3650 ? "🏛️ Legacy Domain" : "🚀 Active"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-sm text-muted-foreground">Registered On</span>
                    <span className="font-medium">{formatDate(result.created)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-sm text-muted-foreground">Expires On</span>
                    <span className="font-medium">{formatDate(result.expiry)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{formatDate(result.updated)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-sm text-muted-foreground">Registrar</span>
                    <span className="font-medium truncate ml-4 text-right">{result.registrar}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Domain Status</span>
                    <div className="flex flex-wrap gap-1">
                      {result.status?.map((s, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] capitalize font-normal">
                          {s.replace(/ /g, "_")}
                        </Badge>
                      )) || "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl flex gap-2 items-start">
        <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Domain information is retrieved via the RDAP protocol. Dates and availability may vary based on the specific TLD registry's data sharing policies.
        </p>
      </CardFooter>
    </Card>
  );
}
