"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";

export function RobotsTxtGeneratorTool() {
  const [defaultRule, setDefaultRule] = React.useState("Allow");
  const [crawlDelay, setCrawlDelay] = React.useState("");
  const [sitemap, setSitemap] = React.useState("");
  
  const [disallowed, setDisallowed] = React.useState([{ path: "/cgi-bin/" }, { path: "/wp-admin/" }]);

  const addDisallowed = () => { setDisallowed([...disallowed, { path: "" }]); };
  const updateDisallowed = (i: number, val: string) => { 
    const n = [...disallowed]; 
    const row = n[i];
    if (row) {
      row.path = val; 
      setDisallowed(n); 
    }
  };
  const removeDisallowed = (i: number) => { 
    setDisallowed(disallowed.filter((_, idx) => idx !== i)); 
  };

  const generateRobotsTxt = () => {
    let output = "User-agent: *\n";
    if (defaultRule === "Disallow") {
      output += "Disallow: /\n";
    } else {
      disallowed.forEach(d => {
        if (d.path) output += `Disallow: ${d.path}\n`;
      });
    }

    if (crawlDelay) output += `Crawl-delay: ${crawlDelay}\n`;
    if (sitemap) output += `Sitemap: ${sitemap}\n`;

    return output;
  };

  const robotsTxt = generateRobotsTxt();

  const download = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Robots.txt Generator</CardTitle><CardDescription>Create a robots.txt file to guide search engine crawlers on your website.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Default Rule for All Robots</Label>
            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={defaultRule} onChange={e => setDefaultRule(e.target.value)}>
              <option value="Allow">Allow all (except disallowed below)</option>
              <option value="Disallow">Disallow all</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Crawl Delay (seconds)</Label>
            <Input type="number" min="0" placeholder="e.g. 10" value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Sitemap URL</Label>
            <Input type="url" placeholder="https://example.com/sitemap.xml" value={sitemap} onChange={e => setSitemap(e.target.value)} />
          </div>
        </div>

        {defaultRule === "Allow" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Label>Disallowed Directories/Pages</Label>
              <Button size="sm" variant="outline" onClick={addDisallowed}>Add Row</Button>
            </div>
            
            {disallowed.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input value={item.path} onChange={e => updateDisallowed(i, e.target.value)} placeholder="/private/" />
                <Button variant="destructive" size="icon" onClick={() => removeDisallowed(i)}>&times;</Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Label>Generated robots.txt</Label>
            <Button onClick={download} size="sm">Download .txt</Button>
          </div>
          <Textarea value={robotsTxt} readOnly rows={8} className="font-mono text-sm bg-muted/20" />
        </div>

      </CardContent>
    </Card>
  );
}
