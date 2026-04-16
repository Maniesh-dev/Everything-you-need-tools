"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const streets = ["Main St", "Oak St", "Pine St", "Maple Ave", "Cedar Ln", "Elm St", "Washington Blvd", "Lake Rd", "Hill St", "Park Ave"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA", "TX", "CA"];
const domains = ["example.com", "test.org", "demo.net", "sample.co", "mailinator.com"];

interface FakeData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  username: string;
  uuid: string;
}

export function FakeDataTool() {
  const [data, setData] = React.useState<FakeData | null>(null);

  const generate = () => {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)] || "John";
    const l = lastNames[Math.floor(Math.random() * lastNames.length)] || "Doe";
    const c = cities[Math.floor(Math.random() * cities.length)] || "City";
    const s = states[Math.floor(Math.random() * states.length)] || "ST";
    const st = streets[Math.floor(Math.random() * streets.length)] || "Street";
    const dom = domains[Math.floor(Math.random() * domains.length)] || "example.com";
    
    const num = Math.floor(Math.random() * 9000) + 1000;
    const phone = `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    setData({
      fullName: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}${Math.floor(Math.random()*100)}@${dom}`,
      phone,
      address: `${num} ${st}, ${c}, ${s} ${Math.floor(Math.random()*90000)+10000}`,
      company: `${l} LLC`,
      username: `${f.toLowerCase()}${num}`,
      uuid: crypto.randomUUID()
    });
  };

  React.useEffect(() => {
    generate();
  }, []);

  const copy = (val: string) => navigator.clipboard.writeText(val);

  return (
    <Card className="border border-border/70 max-w-2xl mx-auto w-full">
      <CardHeader><CardTitle>Fake Data Generator</CardTitle><CardDescription>Generate random identities for testing, QA, and mockup purposes.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        {data && (
          <div className="space-y-2 border rounded-xl overflow-hidden text-sm flex flex-col font-mono bg-muted/5">
             {[
               { label: "Full Name", val: data.fullName },
               { label: "Email", val: data.email },
               { label: "Phone", val: data.phone },
               { label: "Address", val: data.address },
               { label: "Company", val: data.company },
               { label: "Username", val: data.username },
               { label: "UUID", val: data.uuid }
             ].map((row, i) => (
               <div key={i} className="flex border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <div className="w-1/3 p-3 bg-muted/10 font-semibold text-muted-foreground border-r">{row.label}</div>
                  <div className="w-2/3 p-3 flex justify-between items-center group">
                    <span className="truncate pr-2">{row.val}</span>
                    <button onClick={() => copy(row.val)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        <Button size="lg" className="w-full font-bold" onClick={generate}>
          Generate New Identity
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-2">All data generated is completely random and runs locally in your browser.</p>

      </CardContent>
    </Card>
  );
}
