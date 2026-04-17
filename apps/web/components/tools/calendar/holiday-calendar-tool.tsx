"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Calendar as CalendarIcon, MapPin as MapPinIcon, Globe as GlobeIcon, DownloadSimple as DownloadIcon, Info as InfoIcon, WarningCircle as WarningCircleIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "RU", name: "Russia" },
  { code: "CN", name: "China" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
];

const YEARS = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  type: string;
}

export function HolidayCalendarTool() {
  const [country, setCountry] = React.useState("US");
  const [year, setYear] = React.useState(new Date().getFullYear().toString());
  const [holidays, setHolidays] = React.useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHolidays = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      if (!response.ok) throw new Error("Could not fetch holidays for this country/year.");
      const data = await response.json();
      setHolidays(data);
    } catch (err: any) {
      setError(err.message || "Failed to load holidays.");
      setHolidays([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHolidays();
  }, [country, year]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" weight="duotone" />
          Public Holiday Calendar
        </CardTitle>
        <CardDescription>View and explore public holidays for dozens of countries. Plan your trips and schedules ahead of time.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/20 p-6 rounded-2xl border">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><MapPinIcon className="h-4 w-4" /> Select Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Select Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map(y => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={fetchHolidays} disabled={isLoading} className="w-full h-11 shadow-sm">
               <GlobeIcon className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
               {isLoading ? 'Fetching...' : 'Update List'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-3">
            <WarningCircleIcon className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {holidays.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  {holidays.length} Holidays in {year}
                </h3>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                  {COUNTRIES.find(c => c.code === country)?.name}
                </Badge>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {holidays.map((holiday, i) => (
                 <div key={i} className="group p-4 rounded-2xl border border-border/50 bg-background hover:border-primary/50 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-mono text-xs text-primary font-bold">{formatDate(holiday.date)}</div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter opacity-70">
                        {holiday.type}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{holiday.name}</h4>
                      {holiday.localName !== holiday.name && (
                        <p className="text-sm text-muted-foreground italic">{holiday.localName}</p>
                      )}
                      <p className="text-xs font-medium text-muted-foreground/80">{getDayName(holiday.date)}</p>
                    </div>
                    
                    {holiday.fixed && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">
                        <InfoIcon className="h-3 w-3" /> Fixed Date
                      </div>
                    )}
                 </div>
               ))}
             </div>
          </div>
        )}

        {holidays.length === 0 && !isLoading && !error && (
          <div className="text-center py-20 opacity-50">
             <CalendarIcon className="h-16 w-16 mx-auto mb-4" weight="thin" />
             <p>Select a country and year to view holidays.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-primary/5 border-t border-border/50 p-4">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          * Holiday data provided by the Nager.Date API. Local holiday types and observed days may vary depending on regional regulations.
        </p>
      </CardFooter>
    </Card>
  );
}
