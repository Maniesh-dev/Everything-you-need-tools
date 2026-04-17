"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Play as PlayIcon, Pause as PauseIcon, ArrowsCounterClockwise as RotateCcwIcon, Gear as SettingsIcon, CornersOut as Maximize2Icon, CornersIn as Minimize2Icon } from "@phosphor-icons/react";

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Rain", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_2bb0d035f6.mp3?filename=rain-and-thunder-16705.mp3" },
  { id: "cafe", name: "Cafe App", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_51cb4b3f81.mp3?filename=cafe-ambience-9252.mp3" },
  { id: "fire", name: "Fireplace", url: "https://cdn.pixabay.com/download/audio/2022/01/21/audio_0cb2a64c48.mp3?filename=cozy-fireplace-100224.mp3" },
  { id: "waves", name: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_33aaff27e1.mp3?filename=ocean-waves-112906.mp3" },
];

export function FocusModeTool() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [volumes, setVolumes] = React.useState<Record<string, number>>({});
  
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const audioRefs = React.useRef<Record<string, HTMLAudioElement>>({});

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Switch mode when time reaches 0
      const nextMode = mode === "focus" ? "break" : "focus";
      setMode(nextMode);
      setTimeLeft(nextMode === "focus" ? 25 * 60 : 5 * 60);
      setIsActive(false);
      
      // Try to play a simple alert beep
      try {
        const ctx = new window.AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 800; // Hz
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.start();
        osc.stop(ctx.currentTime + 1);
      } catch (err) {
        console.warn("Could not play alert", err);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  // Handle ambient sounds
  React.useEffect(() => {
    // Initialize audio elements if they don't exist
    if (Object.keys(audioRefs.current).length === 0) {
      AMBIENT_SOUNDS.forEach((sound) => {
        const audio = new Audio(sound.url);
        audio.loop = true;
        audio.volume = 0;
        audioRefs.current[sound.id] = audio;
      });
    }

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const handleVolumeChange = (id: string, value: number) => {
    setVolumes(prev => ({ ...prev, [id]: value }));
    
    const audio = audioRefs.current[id];
    if (audio) {
      audio.volume = value / 100;
        
      if (value > 0 && audio.paused) {
        // user clicked play, browsers require interaction so handle promise
        audio.play().catch(e => console.warn("Autoplay prevented", e));
      } else if (value === 0 && !audio.paused) {
        audio.pause();
      }
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <Card className="border border-border/70 group" ref={containerRef}>
      {!isFullscreen && (
        <CardHeader className="relative">
          <CardTitle>Focus Mode</CardTitle>
          <CardDescription>Pomodoro timer with ambient sounds for deep focus.</CardDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={toggleFullscreen}
            title="Fullscreen Mode"
          >
            <Maximize2Icon className="h-4 w-4" />
          </Button>
        </CardHeader>
      )}
      
      <CardContent className={`flex flex-col items-center justify-center transition-all ${isFullscreen ? 'h-screen w-full bg-background p-12' : 'p-6 space-y-8'}`}>
        
        {isFullscreen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-8 top-8 opacity-50 hover:opacity-100" 
            onClick={toggleFullscreen}
          >
            <Minimize2Icon className="h-6 w-6" />
          </Button>
        )}

        <div className="flex bg-muted p-1 rounded-full w-full max-w-sm mb-6">
          <Button 
            variant={mode === "focus" ? "default" : "ghost"} 
            className="flex-1 rounded-full"
            onClick={() => { setMode("focus"); setTimeLeft(25 * 60); setIsActive(false); }}
          >
            Focus
          </Button>
          <Button 
            variant={mode === "break" ? "default" : "ghost"} 
            className="flex-1 rounded-full bg-green-600 hover:bg-green-700 hover:text-white text-white" 
            style={mode === "break" ? {} : { backgroundColor: "transparent", color: "inherit" }}
            onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
          >
            Short Break
          </Button>
        </div>

        <div className={`font-mono font-bold tracking-tight mb-8 ${isFullscreen ? 'text-[15rem] leading-none' : 'text-8xl'}`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <Button 
            size="lg" 
            onClick={toggleTimer} 
            className={`h-16 w-32 text-xl rounded-2xl ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary'}`}
          >
            {isActive ? <PauseIcon className="mr-2 h-6 w-6" /> : <PlayIcon className="mr-2 h-6 w-6" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={resetTimer} className="h-16 w-16 p-0 rounded-2xl border-2">
            <RotateCcwIcon className="h-6 w-6" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>

        <div className={`mt-12 w-full max-w-lg space-y-6 bg-muted/30 p-6 rounded-2xl border ${isFullscreen ? 'absolute bottom-12' : ''}`}>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Ambient Mix</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AMBIENT_SOUNDS.map(sound => (
              <div key={sound.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{sound.name}</span>
                  <span className="text-muted-foreground text-xs">{volumes[sound.id] || 0}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volumes[sound.id] || 0}
                  onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
