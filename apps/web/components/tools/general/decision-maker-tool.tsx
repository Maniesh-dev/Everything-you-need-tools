"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { Coin as CoinsIcon, DiceTwo as DicesIcon, Question as HelpCircleIcon, Funnel as ListFilterIcon } from "@phosphor-icons/react";

export function DecisionMakerTool() {
  const [mode, setMode] = React.useState<"coin" | "dice" | "yesno" | "list">("coin");
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [result, setResult] = React.useState<string | React.ReactNode | null>(null);

  // List mode state
  const [listInput, setListInput] = React.useState("Pizza\nBurgers\nSushi\nTacos\nSalad");

  const flipCoin = () => {
    setIsAnimating(true);
    setResult("...");
    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      setResult(isHeads ? "HEADS" : "TAILS");
      setIsAnimating(false);
    }, 1000);
  };

  const rollDice = () => {
    setIsAnimating(true);
    setResult("...");
    setTimeout(() => {
      const num = Math.floor(Math.random() * 6) + 1;
      setResult(num.toString());
      setIsAnimating(false);
    }, 800);
  };

  const askMagicBall = () => {
    setIsAnimating(true);
    setResult("...");
    const answers = [
      "It is certain", "Without a doubt", "Yes definitely", "You may rely on it",
      "As I see it, yes", "Most likely", "Outlook good", "Yes",
      "Reply hazy, try again", "Ask again later", "Better not tell you now",
      "Cannot predict now", "Concentrate and ask again",
      "Don't count on it", "My reply is no", "My sources say no",
      "Outlook not so good", "Very doubtful"
    ];
    setTimeout(() => {
      const idx = Math.floor(Math.random() * answers.length);
      setResult(answers[idx]);
      setIsAnimating(false);
    }, 1200);
  };

  const pickFromList = () => {
    const items = listInput.split("\n").map(i => i.trim()).filter(i => i.length > 0);
    if (items.length === 0) {
      setResult("Please enter some choices!");
      return;
    }
    
    setIsAnimating(true);
    setResult("Choosing...");
    
    // Quick flash effect before settling
    let flashes = 0;
    const interval = setInterval(() => {
      flashes++;
      setResult(items[Math.floor(Math.random() * items.length)]);
      if (flashes >= 15) {
        clearInterval(interval);
        const finalChoice = items[Math.floor(Math.random() * items.length)];
        setResult(
          <div className="flex flex-col items-center">
            <span className="text-xl font-normal text-muted-foreground mb-2">I choose...</span>
            <span className="text-4xl text-primary">{finalChoice}</span>
          </div>
        );
        setIsAnimating(false);
      }
    }, 100);
  };

  // Reset result when changing tabs
  React.useEffect(() => {
    setResult(null);
    setIsAnimating(false);
  }, [mode]);

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Decision Maker</CardTitle>
        <CardDescription>Can't decide? Let fate choose for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="coin" className="flex gap-2"><CoinsIcon className="h-4 w-4 hidden sm:block"/> <span className="sm:inline hidden">Coin Flip</span><span className="sm:hidden block">Coin</span></TabsTrigger>
            <TabsTrigger value="dice" className="flex gap-2"><DicesIcon className="h-4 w-4 hidden sm:block"/> <span className="sm:inline hidden">Roll Dice</span><span className="sm:hidden block">Dice</span></TabsTrigger>
            <TabsTrigger value="yesno" className="flex gap-2"><HelpCircleIcon className="h-4 w-4 hidden sm:block"/> <span className="sm:inline hidden">Magic 8 Ball</span><span className="sm:hidden block">8-Ball</span></TabsTrigger>
            <TabsTrigger value="list" className="flex gap-2"><ListFilterIcon className="h-4 w-4 hidden sm:block"/> <span className="sm:inline hidden">Random Picker</span><span className="sm:hidden block">Picker</span></TabsTrigger>
          </TabsList>
          
          <div className="mt-8 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] bg-muted/20 relative overflow-hidden">
            
            {/* The Result Display Area */}
            <div className={`text-center transition-all duration-300 ${isAnimating ? 'scale-110 opacity-70 blur-[1px]' : 'scale-100 opacity-100'}`}>
              {result ? (
                <div className={`font-bold font-heading ${mode === 'dice' ? 'text-9xl' : 'text-5xl'} text-foreground leading-tight`}>
                  {result}
                </div>
              ) : (
                <div className="text-muted-foreground">Click the button below to decide</div>
              )}
            </div>

            {/* Specific Controls per mode */}
            
            {mode === "list" && (
              <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${result && !isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                <Textarea 
                  value={listInput}
                  onChange={(e) => setListInput(e.target.value)}
                  placeholder="Enter choices here (one per line)&#10;Choice A&#10;Choice B" 
                  className="min-h-[100px] bg-background shadow-sm"
                />
              </div>
            )}
            
            {/* The Action Button */}
            <div className={`absolute left-0 right-0 p-6 flex justify-center transition-all duration-300 ease-in-out ${
              result && !isAnimating && mode !== "list" 
                ? 'bottom-2 opacity-100' 
                : mode === "list" && (!result || isAnimating) 
                  ? '-bottom-16 opacity-0 pointer-events-none' /* Hide standard button in list edit view */
                  : 'bottom-1/4 translate-y-1/2 opacity-100'
            }`}>
              {mode === "list" && (!result || isAnimating) ? null : (
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (mode === "coin") flipCoin();
                    if (mode === "dice") rollDice();
                    if (mode === "yesno") askMagicBall();
                    if (mode === "list") pickFromList();
                  }}
                  disabled={isAnimating}
                  className={`text-lg px-8 py-6 rounded-full shadow-lg ${isAnimating ? 'animate-pulse' : 'hover:scale-105 transition-transform'}`}
                >
                  {mode === "coin" && "Flip Coin"}
                  {mode === "dice" && "Roll Dice"}
                  {mode === "yesno" && "Ask 8-Ball"}
                  {mode === "list" && "Pick Randomly"}
                </Button>
              )}
            </div>
            
            {/* Custom Action button position for List format */}
            {mode === "list" && (!result || isAnimating) && (
               <div className="absolute top-4 right-4 z-10 transition-opacity">
                <Button 
                  onClick={pickFromList}
                  disabled={isAnimating}
                  className="shadow-sm font-semibold"
                >
                  Pick Randomly
                </Button>
               </div>
            )}
            
            {/* Reset button for list view */}
            {mode === "list" && result && !isAnimating && (
              <Button 
                variant="outline" 
                className="absolute top-4 right-4 hover:bg-muted"
                onClick={() => setResult(null)}
              >
                Edit List
              </Button>
            )}

          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
