"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { TextT as TextTIcon, ArrowsClockwise as RefreshIcon, Copy as CopyIcon, Layout as LayoutIcon, Eye as EyeIcon, Palette as PaletteIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

// Popular font pairings
const FONT_PAIRINGS = [
  { header: "Playfair Display", body: "Source Sans Pro", category: "Serif + Sans Serif" },
  { header: "Montserrat", body: "Lora", category: "Sans Serif + Serif" },
  { header: "Roboto", body: "Roboto Slab", category: "Sans Serif + Slab Serif" },
  { header: "Merriweather", body: "Open Sans", category: "Serif + Sans Serif" },
  { header: "Oswald", body: "Quattrocento", category: "Display + Serif" },
  { header: "Abel", body: "Ubuntu", category: "Modern + Humanist" },
  { header: "Raleway", body: "Cabin", category: "Geometric + Humanist" },
  { header: "Libre Baskerville", body: "Source Sans Pro", category: "Classic Serif + Sans" },
  { header: "Fira Sans", body: "Merriweather", category: "Sans + Serif" },
];

export function FontPairingTool() {
  const [pairingIndex, setPairingIndex] = React.useState(0);
  const [customText, setCustomText] = React.useState("The quick brown fox jumps over the lazy dog.");
  const [activePairing, setActivePairing] = React.useState(FONT_PAIRINGS[0]);

  const currentPairing = (FONT_PAIRINGS[pairingIndex] ?? FONT_PAIRINGS[0]) as (typeof FONT_PAIRINGS)[number];

  // Dynamically load Google Fonts
  React.useEffect(() => {
    const fontsToLoad = FONT_PAIRINGS.flatMap(p => [p.header, p.body]);
    const uniqueFonts = Array.from(new Set(fontsToLoad));
    const fontString = uniqueFonts.map(f => f.replace(/ /g, "+")).join("|");

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css?family=${fontString}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const randomize = () => {
    const newIndex = Math.floor(Math.random() * FONT_PAIRINGS.length);
    setPairingIndex(newIndex);
  };

  const copyCss = () => {
    const css = `/* Heading Font */\nh1, h2, h3 {\n  font-family: '${currentPairing.header}', serif;\n}\n\n/* Body Font */\nbody {\n  font-family: '${currentPairing.body}', sans-serif;\n}`;
    navigator.clipboard.writeText(css);
  };

  return (
    <Card className="border border-border/70 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TextTIcon className="h-6 w-6 text-primary" weight="duotone" />
          Font Pairing Suggester
        </CardTitle>
        <CardDescription>Explore beautiful Google Font combinations for your next design project. Preview headings and body text in real-time.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-muted/20 p-4 rounded-xl border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{currentPairing.category}</Badge>
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{pairingIndex + 1} / {FONT_PAIRINGS.length}</span>
            </div>
            <h3 className="font-bold text-lg">{currentPairing.header} + {currentPairing.body}</h3>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={randomize} variant="outline" className="flex-1 sm:flex-none">
              <RefreshIcon className="mr-2 h-4 w-4" /> Next Pairing
            </Button>
            <Button onClick={copyCss} className="flex-1 sm:flex-none">
              <CopyIcon className="mr-2 h-4 w-4" /> Copy CSS
            </Button>
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-3">
            <Label className="text-muted-foreground flex items-center gap-2"><LayoutIcon className="h-4 w-4" /> Heading Preview</Label>
            <h1
              style={{ fontFamily: `'${currentPairing.header}', serif` }}
              className="text-4xl sm:text-6xl font-bold leading-tight"
            >
              The Art of Visual Hierarchy
            </h1>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground flex items-center gap-2"><EyeIcon className="h-4 w-4" /> Body Text Preview</Label>
            <div className="grid gap-6 md:grid-cols-2">
              <p
                style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                Selecting the right font pairing is essential for creating a professional and readable design.
                High contrast between your headers and your body text helps guide the user's eye across
                the page, improving user experience and engagement.
              </p>
              <p
                style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                This combination uses <strong>{currentPairing.header}</strong> for headlines to create a
                distinct brand personality, while <strong>{currentPairing.body}</strong> ensures your main
                content remains accessible across all screen sizes.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t">
            <Label className="text-muted-foreground flex items-center gap-2"><PaletteIcon className="h-4 w-4" /> Custom Text Preview</Label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="resize-none h-24 text-xl"
              style={{ fontFamily: `'${currentPairing.body}', sans-serif` }}
              placeholder="Enter text to preview..."
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-primary/5 border-t border-border/50 p-6">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-[1.02]">
            <Label className="text-xs uppercase text-muted-foreground mb-2 block">Heading Font</Label>
            <div className="flex justify-between items-center">
              <span className="font-bold">{currentPairing.header}</span>
              <a
                href={`https://fonts.google.com/specimen/${currentPairing.header.replace(/ /g, "+")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View on Google Fonts
              </a>
            </div>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-[1.02]">
            <Label className="text-xs uppercase text-muted-foreground mb-2 block">Body Font</Label>
            <div className="flex justify-between items-center">
              <span className="font-bold">{currentPairing.body}</span>
              <a
                href={`https://fonts.google.com/specimen/${currentPairing.body.replace(/ /g, "+")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View on Google Fonts
              </a>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
