"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

const truths_list = [
  "What is your biggest fear?",
  "What is the most embarrassing thing you've ever done?",
  "What is a secret you've never told anyone?",
  "Have you ever lied to get out of trouble?",
  "If you had to switch lives with someone in this room, who would it be?",
  "What's the worst text message you've accidentally sent?",
  "What is your biggest regret?",
  "Have you ever ghosted someone?",
  "What's a weird habit that you have?",
];

const dares_list = [
  "Do 20 pushups right now.",
  "Let the group look through your phone for 1 minute.",
  "Sing the chorus of your favorite song loudly.",
  "Send an emoji to the 5th person in your contacts list.",
  "Speak in a random accent for the next 3 rounds.",
  "Show the most embarrassing photo on your phone.",
  "Do your best dance move without any music.",
  "Let someone write a word on your forehead with a marker (or pen).",
  "Eat a spoonful of whatever condiment the group chooses.",
];

export function TruthOrDareTool() {
  const [promptText, setPromptText] = React.useState("Click a button to start!");
  const [mode, setMode] = React.useState<"truth" | "dare" | null>(null);

  const getTruth = () => {
    const t = truths_list[Math.floor(Math.random() * truths_list.length)] || "What is a secret you've never told anyone?";
    setMode("truth");
    setPromptText(t);
  };

  const getDare = () => {
    const d = dares_list[Math.floor(Math.random() * dares_list.length)] || "Do your best dance move without any music.";
    setMode("dare");
    setPromptText(d);
  };

  return (
    <Card className="border border-border/70 max-w-2xl mx-auto w-full">
      <CardHeader className="text-center"><CardTitle>Truth or Dare</CardTitle><CardDescription>Instant prompts for your party or gathering.</CardDescription></CardHeader>
      <CardContent className="space-y-8 flex flex-col items-center">
        
        <div className={`w-full h-[250px] rounded-3xl flex items-center justify-center p-8 text-center transition-colors shadow-inner border-[10px] ${mode === "truth" ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" : mode === "dare" ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400" : "bg-muted/10 border-muted text-muted-foreground"}`}>
          <div className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {promptText}
          </div>
        </div>
        
        <div className="flex gap-4 w-full">
          <Button size="lg" className="flex-1 h-16 text-xl font-black bg-blue-600 hover:bg-blue-700 text-white" onClick={getTruth}>
            TRUTH
          </Button>
          <Button size="lg" className="flex-1 h-16 text-xl font-black bg-red-600 hover:bg-red-700 text-white" onClick={getDare}>
            DARE
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
