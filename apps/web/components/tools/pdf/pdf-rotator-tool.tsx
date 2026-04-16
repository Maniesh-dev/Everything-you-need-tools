"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useAuth } from "@/hooks/useAuth";
import { SaveToAccountSection } from "@/components/tools/save-to-account-section";
import {
  MAX_SAVE_BYTES,
  formatFileSize,
  postSavedData,
  uint8ToBase64,
} from "@/lib/saved-data";

interface SelectedPdf {
  id: string;
  file: File;
  pageCount: number | null;
}

interface RotatedPdfOutput {
  fileName: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  sourceFiles: Array<{ name: string; size: number }>;
}

export function PdfRotatorTool() {
  const { user, isLoading, authFetch } = useAuth();
  const pathname = usePathname();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [pdf, setPdf] = React.useState<SelectedPdf | null>(null);
  const [rotations, setRotations] = React.useState<number[]>([]); // Array of degrees for each page
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [isRotating, setIsRotating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [rotatedOutput, setRotatedOutput] = React.useState<RotatedPdfOutput | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const redirectPath = pathname || "/";
  const signupHref = `/register?redirect=${encodeURIComponent(redirectPath)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  async function addFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file.");
      return;
    }

    setError(null);
    setSuccess(null);
    setRotatedOutput(null);
    setSaveError(null);
    setSaveSuccess(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPageCount();
      
      setPdf({
        file,
        id: `${file.name}-${file.size}-${Date.now()}`,
        pageCount: pages
      });
      setRotations(new Array(pages).fill(0));

    } catch {
      setError("Could not read PDF.");
    }
  }

  function rotatePage(index: number) {
    setRotations(prev => {
      const next = [...prev];
      const currentRotation = next[index] ?? 0;
      next[index] = (currentRotation + 90) % 360;
      return next;
    });
    setRotatedOutput(null);
    setSuccess(null);
    setSaveError(null);
    setSaveSuccess(null);
  }

  function rotateAll() {
    setRotations(prev => prev.map(r => (r + 90) % 360));
    setRotatedOutput(null);
    setSuccess(null);
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function rotatePdf() {
    if (!pdf) return;

    setIsRotating(true);
    setError(null);
    setSuccess(null);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = await pdf.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const currentRotation = page.getRotation().angle;
        const rotationDelta = rotations[index] ?? 0;
        page.setRotation(degrees(currentRotation + rotationDelta));
      });

      const rotatedBytes = await pdfDoc.save();
      const rotatedBytesForUse = new Uint8Array(rotatedBytes.length);
      rotatedBytesForUse.set(rotatedBytes);

      setRotatedOutput({
        fileName: pdf.file.name.replace(/\.pdf$/i, "_rotated.pdf"),
        mimeType: "application/pdf",
        size: rotatedBytesForUse.byteLength,
        bytes: rotatedBytesForUse,
        sourceFiles: [{ name: pdf.file.name, size: pdf.file.size }],
      });
      setSaveError(null);
      setSaveSuccess(null);

      const blob = new Blob([rotatedBytesForUse], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setSuccess("PDF pages rotated successfully.");
    } catch {
      setError("Failed to rotate PDF.");
    } finally {
      setIsRotating(false);
    }
  }

  async function saveFile() {
    if (!user) {
      setSaveError("Please sign in to save files.");
      return;
    }
    if (!rotatedOutput) {
      setSaveError("Rotate and download your PDF once, then click Save File.");
      return;
    }
    if (rotatedOutput.size > MAX_SAVE_BYTES) {
      setSaveError(
        `This file is ${formatFileSize(
          rotatedOutput.size
        )}. Maximum save size is ${formatFileSize(MAX_SAVE_BYTES)}.`
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const fileBase64 = uint8ToBase64(rotatedOutput.bytes);
      const result = await postSavedData(authFetch, {
        category: "pdf",
        toolId: "pdf-rotator",
        data: {
          fileName: rotatedOutput.fileName,
          mimeType: rotatedOutput.mimeType,
          fileSize: rotatedOutput.size,
          fileBase64,
          sourceFiles: rotatedOutput.sourceFiles,
          savedFromTool: "pdf-rotator",
          savedAt: new Date().toISOString(),
        },
      });
      if (!result.ok) {
        setSaveError(result.message);
        return;
      }
      setSaveSuccess(result.message);
    } catch {
      setSaveError("Failed to save file.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="min-h-[400px] border border-border/70">
      <CardHeader>
        <CardTitle>Rotate PDF Pages</CardTitle>
        <CardDescription>
          Rotate individual pages or the entire document and save the result.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => addFiles(e.target.files)} />

        {!pdf && (
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
            onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
            className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20"
            }`}
          >
            <p className="text-muted-foreground">Drop PDF here or click to select</p>
            <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>Upload PDF</Button>
          </div>
        )}

        {pdf && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{pdf.pageCount} Pages</Badge>
                <Button variant="outline" size="sm" onClick={rotateAll}>Rotate All 90°</Button>
                <Button variant="outline" size="sm" onClick={() => { setPdf(null); setRotatedOutput(null); }}>Clear</Button>
              </div>
              <Button onClick={rotatePdf} disabled={isRotating}>
                {isRotating ? "Processing..." : "Apply Rotations"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {rotations.map((deg, i) => (
                <div key={i} className="group relative flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/10 p-4 transition-all hover:border-primary/30">
                  <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-white shadow-sm transition-transform duration-300" style={{ transform: `rotate(${deg}deg)` }}>
                    <span className="text-2xl font-bold text-muted-foreground/30">{i + 1}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => rotatePage(i)}>
                    Rotate 90°
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewUrl && rotatedOutput && (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4">
             <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Preview Changes</p>
              <Button asChild>
                <a href={previewUrl} download={rotatedOutput.fileName}>Download PDF</a>
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border/70 bg-white aspect-video w-full">
              <iframe src={previewUrl} className="w-full h-full" />
            </div>
          </div>
        )}

        <SaveToAccountSection
          user={user ? { email: user.email } : null}
          isLoading={isLoading}
          signupHref={signupHref}
          loginHref={loginHref}
          onSave={saveFile}
          saveDisabled={!rotatedOutput || isSaving || isRotating}
          isSaving={isSaving}
          idleHint={
            user && !rotatedOutput
              ? "Rotate and download your PDF once, then click Save File."
              : null
          }
          readyHint={
            rotatedOutput
              ? `Ready to save: ${rotatedOutput.fileName} (${formatFileSize(
                  rotatedOutput.size
                )})`
              : null
          }
          error={saveError}
          success={saveSuccess}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}
      </CardContent>
    </Card>
  );
}
