"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";

export function ImageToBase64Tool() {
  const [base64, setBase64] = React.useState("");
  const [previewSize, setPreviewSize] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewSize((file.size / 1024).toFixed(2) + " KB");

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    if (base64) await navigator.clipboard.writeText(base64);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>Image to Base64</CardTitle><CardDescription>Convert any image into a Base64 encoded string format natively in your browser.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Image File</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors border-border">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        {base64 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
               <div className="w-32 h-32 shrink-0 bg-muted/20 border flex items-center justify-center rounded-lg overflow-hidden object-cover p-1">
                 <img src={base64} alt="Preview" className="max-w-full max-h-full object-contain" />
               </div>
               <div className="flex-1 space-y-2 w-full">
                 <div className="flex items-center justify-between">
                   <Label>Base64 Data (Data URI)</Label>
                   <span className="text-xs text-muted-foreground">Original Size: {previewSize}</span>
                 </div>
                 <div className="relative">
                   <Textarea readOnly value={base64} className="h-24 resize-none font-mono text-xs pr-24" />
                   <Button size="sm" onClick={copy} className="absolute right-2 top-2">Copy Base64</Button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
