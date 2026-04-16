"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { useAuth } from "@/hooks/useAuth";
import { SaveToAccountSection } from "@/components/tools/save-to-account-section";
import {
  MAX_SAVE_BYTES,
  formatFileSize,
  postSavedData,
  uint8ToBase64,
} from "@/lib/saved-data";

interface ConvertedImageArchive {
  fileName: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  imageCount: number;
  sourceFiles: Array<{ name: string; size: number }>;
}

function toSafeArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export function PdfToImageTool() {
  const { user, isLoading, authFetch } = useAuth();
  const pathname = usePathname();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  
  const [file, setFile] = React.useState<File | null>(null);
  const [format, setFormat] = React.useState<"png" | "jpg">("png");
  const [images, setImages] = React.useState<string[]>([]);
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [archiveOutput, setArchiveOutput] = React.useState<ConvertedImageArchive | null>(null);

  const redirectPath = pathname || "/";
  const signupHref = `/register?redirect=${encodeURIComponent(redirectPath)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  async function handleFileUpload(fileList: FileList | null) {
    const f = fileList?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setImages([]);
    setArchiveOutput(null);
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function convertToImages() {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSaveError(null);
    setSaveSuccess(null);
    setArchiveOutput(null);

    try {
      // Dynamic import to avoid SSR issues with pdfjs
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer, cMapUrl: "https://unpkg.com/pdfjs-dist@5.6.205/cmaps/", cMapPacked: true });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const convertedImages: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 }); // High quality
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport, canvas }).promise;
        convertedImages.push(canvas.toDataURL(`image/${format}`, 0.9));
      }

      setImages(convertedImages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to convert PDF: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const [isDownloadingAll, setIsDownloadingAll] = React.useState(false);

  async function buildArchiveOutput(): Promise<ConvertedImageArchive> {
    if (!file || images.length === 0) {
      throw new Error("No converted images available.");
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    images.forEach((img, i) => {
      const base64Data = img.split(",")[1];
      if (base64Data) {
        zip.file(`page_${i + 1}.${format}`, base64Data, { base64: true });
      }
    });

    const bytes = await zip.generateAsync({ type: "uint8array" });
    const safeBaseName = file.name.replace(/\.[^/.]+$/, "");

    return {
      fileName: `${safeBaseName}_images.zip`,
      mimeType: "application/zip",
      size: bytes.byteLength,
      bytes,
      imageCount: images.length,
      sourceFiles: [{ name: file.name, size: file.size }],
    };
  }

  async function downloadAll() {
    if (images.length === 0) return;
    setIsDownloadingAll(true);
    try {
      const output = await buildArchiveOutput();
      setArchiveOutput(output);

      const blob = new Blob([toSafeArrayBuffer(output.bytes)], {
        type: output.mimeType,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = output.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create ZIP", err);
      setError("Failed to create ZIP file.");
    } finally {
      setIsDownloadingAll(false);
    }
  }

  function downloadImage(url: string, index: number) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `page_${index + 1}.${format}`;
    link.click();
  }

  async function saveArchiveFile() {
    if (!user) {
      setSaveError("Please sign in to save files.");
      return;
    }
    if (!file || images.length === 0) {
      setSaveError("Convert and download your images once, then click Save File.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const output = await buildArchiveOutput();
      setArchiveOutput(output);

      if (output.size > MAX_SAVE_BYTES) {
        setSaveError(
          `This file is ${formatFileSize(
            output.size
          )}. Maximum save size is ${formatFileSize(MAX_SAVE_BYTES)}.`
        );
        return;
      }

      const fileBase64 = uint8ToBase64(output.bytes);
      const result = await postSavedData(authFetch, {
        category: "pdf",
        toolId: "pdf-to-image",
        data: {
          fileName: output.fileName,
          mimeType: output.mimeType,
          fileSize: output.size,
          fileBase64,
          sourceFiles: output.sourceFiles,
          imageCount: output.imageCount,
          outputFormat: format,
          savedFromTool: "pdf-to-image",
          savedAt: new Date().toISOString(),
        },
      });

      if (!result.ok) {
        setSaveError(result.message);
        return;
      }

      setSaveSuccess(result.message);
    } catch {
      setSaveError("Unable to save right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>PDF to Image</CardTitle>
        <CardDescription>Convert each page of your PDF into high-quality PNG or JPG images.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFileUpload(e.target.files)} />
        
        {!file && (
          <div 
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-muted-foreground">Click or drag PDF here</p>
          </div>
        )}

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setImages([]);
                  setArchiveOutput(null);
                  setSaveError(null);
                  setSaveSuccess(null);
                }}
              >
                Remove
              </Button>
            </div>
            
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <p className="text-xs font-medium">Output Format</p>
                <Select
                  value={format}
                  onValueChange={(value) => {
                    if (value === "png" || value === "jpg") {
                      setFormat(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={convertToImages} disabled={isProcessing}>
                {isProcessing ? "Converting..." : "Convert to Images"}
              </Button>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-4 pt-6 border-t font-sans">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm font-semibold">Converted Pages ({images.length})</p>
              <Button variant="outline" size="sm" onClick={downloadAll} disabled={isDownloadingAll}>
                {isDownloadingAll ? "Zipping..." : "Download All (ZIP)"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-lg border bg-white aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Page ${i+1}`} className="h-full w-full object-contain" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="w-full h-8 text-[11px]" onClick={() => downloadImage(img, i)}>
                      Download Page {i + 1}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <SaveToAccountSection
          user={user ? { email: user.email } : null}
          isLoading={isLoading}
          signupHref={signupHref}
          loginHref={loginHref}
          onSave={saveArchiveFile}
          saveDisabled={images.length === 0 || isSaving || isProcessing || isDownloadingAll}
          isSaving={isSaving}
          idleHint={
            user && images.length === 0
              ? "Convert and download your images once, then click Save File."
              : null
          }
          readyHint={
            archiveOutput
              ? `Ready to save: ${archiveOutput.fileName} (${formatFileSize(
                  archiveOutput.size
                )})`
              : null
          }
          error={saveError}
          success={saveSuccess}
        />
      </CardContent>
    </Card>
  );
}
