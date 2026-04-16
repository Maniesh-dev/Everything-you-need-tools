"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";

export function TextToSpeechTool() {
  const [text, setText] = React.useState("Hello world! This is a simple Text to Speech tool acting entirely in your browser.");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<string>("");
  const [rate, setRate] = React.useState(1);
  const [pitch, setPitch] = React.useState(1);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      const firstVoice = v[0];
      if (firstVoice && !selectedVoice) setSelectedVoice(firstVoice.name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const speak = () => {
    if (typeof window === "undefined" || !text) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Text to Speech (TTS)</CardTitle><CardDescription>Convert text into spoken audio using your browser's native capabilities.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <Textarea 
          placeholder="Enter text to speak..." 
          className="min-h-[150px] resize-none" 
          value={text} 
          onChange={e => setText(e.target.value)} 
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Select Voice</Label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" 
              value={selectedVoice} 
              onChange={e => setSelectedVoice(e.target.value)}
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center"><Label>Speed (Rate)</Label><span className="text-xs text-muted-foreground">{rate}x</span></div>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center"><Label>Pitch</Label><span className="text-xs text-muted-foreground">{pitch}</span></div>
            <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button size="lg" className="flex-1 font-bold h-12" onClick={speak} disabled={playing || !text}>
            {playing ? "Speaking..." : "Play Audio"}
          </Button>
          <Button size="lg" variant="secondary" className="w-24 h-12" onClick={stop} disabled={!playing}>Stop</Button>
        </div>

      </CardContent>
    </Card>
  );
}
