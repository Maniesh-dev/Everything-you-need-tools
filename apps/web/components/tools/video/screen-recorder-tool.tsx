"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Copy as CopyIcon, DownloadSimple as DownloadIcon, Play as PlayIcon, Square as SquareIcon, Pause as PauseIcon, VideoCamera as VideoIcon } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";

export function ScreenRecorderTool() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [includeAudio, setIncludeAudio] = React.useState(true);
  const [recordingTime, setRecordingTime] = React.useState(0);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      let finalStream = displayStream;

      // If user wants mic audio as well, merge it
      if (includeAudio) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const tracks = [...displayStream.getTracks(), ...micStream.getAudioTracks()];
          finalStream = new MediaStream(tracks);
        } catch (err) {
          console.warn("Microphone access denied or not available", err);
        }
      }

      streamRef.current = finalStream;
      const mediaRecorder = new MediaRecorder(finalStream, { mimeType: 'video/webm; codecs=vp9' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const chunks = mediaRecorderRef.current ? (mediaRecorderRef.current as any).chunks || [] : [];
        // We get chunks asynchronously, so we construct Blob in useEffect or let state handle it.
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordedChunks([]);
      setVideoUrl(null);

      // Handle "Stop Sharing" button from browser UI
      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopRecording();
        };
      }

    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please ensure you have granted permission.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
      setIsPaused(false);

      // Delay Blob generation slightly to ensure all chunks are captured
      setTimeout(() => {
        setRecordedChunks((chunks) => {
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
          }
          return chunks;
        });
      }, 500);
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  React.useEffect(() => {
    return () => {
      // Cleanup URLs on unmount
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [videoUrl]);

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Screen Recorder</CardTitle>
        <CardDescription>Record your screen, a specific window, or browser tab right from your browser without any watermarks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-xl bg-orange-50/50 dark:bg-orange-950/10">
          <div className="space-y-3 w-full">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Microphone Audio</Label>
                <p className="text-sm text-muted-foreground">Record your voice along with system audio.</p>
              </div>
              <Switch checked={includeAudio} onCheckedChange={setIncludeAudio} disabled={isRecording} />
            </div>
          </div>
        </div>

        {isRecording ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span className={`h-3 w-3 rounded-full bg-red-500 ${!isPaused ? 'animate-pulse' : ''}`}></span>
              <span className="text-2xl font-mono font-bold text-red-500">{formatTime(recordingTime)}</span>
            </div>

            <div className="flex gap-4">
              <Button onClick={pauseRecording} variant="outline" size="lg" className="px-8 border-red-200 hover:bg-red-100 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-900/50">
                {isPaused ? <PlayIcon className="mr-2 h-5 w-5" /> : <PauseIcon className="mr-2 h-5 w-5" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg" className="px-8 shadow-md">
                <SquareIcon className="mr-2 h-5 w-5 fill-current" />
                Stop Recording
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-8">
            <Button onClick={startRecording} size="lg" className="px-12 py-8 text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
              <VideoIcon className="mr-3 h-6 w-6" />
              Start Recording
            </Button>
          </div>
        )}

        {videoUrl && !isRecording && (
          <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400">Ready</Badge>
                Preview Recording
              </h3>
              <Button onClick={downloadVideo} variant="default">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download WebM
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden border shadow-sm bg-black aspect-video w-full">
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Recordings are processed entirely in your browser and are not uploaded to any server.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
