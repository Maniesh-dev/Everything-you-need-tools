"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useAuth } from "@/hooks/useAuth";

interface SelectedPdf {
  id: string;
  file: File;
}

interface MergedPdfOutput {
  fileName: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  sourceFiles: Array<{ name: string; size: number }>;
}

const MAX_SAVE_BYTES = 8 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function normalizeOutputName(name: string): string {
  const cleaned = name.trim().replace(/[\\/:*?"<>|]+/g, "-");
  if (!cleaned) return "merged.pdf";
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 16 * 1024;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    let chunkBinary = "";
    for (let j = 0; j < chunk.length; j += 1) {
      chunkBinary += String.fromCharCode(chunk[j] ?? 0);
    }
    binary += chunkBinary;
  }

  return btoa(binary);
}

function getResponseMessage(payload: unknown): string | null {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return null;
}

export function PdfMergerTool() {
  const { user, isLoading, authFetch } = useAuth();
  const pathname = usePathname();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [pdfs, setPdfs] = React.useState<SelectedPdf[]>([]);
  const [outputName, setOutputName] = React.useState("merged.pdf");
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMerging, setIsMerging] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [mergedOutput, setMergedOutput] = React.useState<MergedPdfOutput | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      // Cleanup object URL on unmount to prevent memory leaks
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const totalSize = React.useMemo(
    () => pdfs.reduce((sum, item) => sum + item.file.size, 0),
    [pdfs]
  );
  const redirectPath = pathname || "/";
  const signupHref = `/register?redirect=${encodeURIComponent(redirectPath)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  function resetSavedState() {
    setMergedOutput(null);
    setSaveError(null);
    setSaveSuccess(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const incoming = Array.from(fileList);
    const accepted = incoming.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (accepted.length !== incoming.length) {
      setError("Some files were skipped because they are not PDF files.");
    } else {
      setError(null);
    }

    if (accepted.length === 0) return;

    setSuccess(null);
    resetSavedState();
    setPdfs((prev) => [
      ...prev,
      ...accepted.map((file, index) => ({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${index}`,
      })),
    ]);
  }

  function movePdf(from: number, to: number) {
    setPdfs((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(to, 0, moved);
      return next;
    });
  }

  function removePdf(id: string) {
    setPdfs((prev) => prev.filter((item) => item.id !== id));
    setSuccess(null);
    resetSavedState();
  }

  async function saveMergedFile() {
    if (!user) {
      setSaveError("Please sign in to save files.");
      return;
    }

    if (!mergedOutput) {
      setSaveError("Merge a file first, then click Save File.");
      return;
    }

    if (mergedOutput.size > MAX_SAVE_BYTES) {
      setSaveError(
        `This file is ${formatFileSize(
          mergedOutput.size
        )}. Maximum save size is ${formatFileSize(MAX_SAVE_BYTES)}.`
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const fileBase64 = uint8ToBase64(mergedOutput.bytes);
      const response = await authFetch("/api/saved-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "pdf",
          toolId: "pdf-merger",
          data: {
            fileName: mergedOutput.fileName,
            mimeType: mergedOutput.mimeType,
            fileSize: mergedOutput.size,
            fileBase64,
            sourceFiles: mergedOutput.sourceFiles,
            savedFromTool: "pdf-merger",
            savedAt: new Date().toISOString(),
          },
        }),
      });

      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        const message = getResponseMessage(payload) || "Failed to save file.";
        setSaveError(message);
        return;
      }

      setSaveSuccess("File saved to your account successfully.");
    } catch {
      setSaveError("Unable to save right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function mergePdfs() {
    if (pdfs.length < 2) {
      setError("Add at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);
    setSuccess(null);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();

      for (const item of pdfs) {
        const bytes = await item.file.arrayBuffer();
        const source = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(source, source.getPageIndices());
        for (const page of pages) {
          merged.addPage(page);
        }
      }

      const mergedBytes = await merged.save();
      const mergedBytesForUse = new Uint8Array(mergedBytes.length);
      mergedBytesForUse.set(mergedBytes);
      const outputFileName = normalizeOutputName(outputName);

      setMergedOutput({
        fileName: outputFileName,
        mimeType: "application/pdf",
        size: mergedBytesForUse.byteLength,
        bytes: mergedBytesForUse,
        sourceFiles: pdfs.map((item) => ({
          name: item.file.name,
          size: item.file.size,
        })),
      });

      const blob = new Blob([mergedBytesForUse.buffer], {
        type: "application/pdf",
      });
      
      // Cleanup previous preview if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setSuccess(`Merged ${pdfs.length} files successfully.`);
    } catch (mergeError) {
      const message =
        mergeError instanceof Error
          ? mergeError.message
          : "Unable to merge PDFs. Please try different files.";
      setError(message);
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <Card className="min-h-[400px] border border-border/70">
      <CardHeader>
        <CardTitle>Merge PDF Files</CardTitle>
        <CardDescription>
          Upload multiple PDF files, reorder them, and download one combined PDF.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Drag and drop PDFs here, or select files manually
          </p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Add PDF Files
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="output-name">Output filename</Label>
            <Input
              id="output-name"
              value={outputName}
              onChange={(event) => setOutputName(event.target.value)}
              placeholder="merged.pdf"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPdfs([]);
                setError(null);
                setSuccess(null);
                resetSavedState();
              }}
              disabled={pdfs.length === 0 || isMerging}
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={mergePdfs}
              disabled={pdfs.length < 2 || isMerging}
            >
              {isMerging ? "Merging..." : "Merge PDFs"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{pdfs.length} file(s)</Badge>
          <Badge variant="outline">{formatFileSize(totalSize)}</Badge>
          <Badge variant="outline">Order matters</Badge>
        </div>

        {pdfs.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-border/70 p-3">
            {pdfs.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/30 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {index + 1}. {item.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === 0 || isMerging}
                    onClick={() => movePdf(index, index - 1)}
                  >
                    Up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={index === pdfs.length - 1 || isMerging}
                    onClick={() => movePdf(index, index + 1)}
                  >
                    Down
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isMerging}
                    onClick={() => removePdf(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {previewUrl && mergedOutput && (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Preview Merged PDF</p>
              <Button asChild>
                <a href={previewUrl} download={mergedOutput.fileName}>
                  Download PDF
                </a>
              </Button>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-border/70 bg-white aspect-[3/4] sm:aspect-[4/3] w-full">
              <iframe 
                src={`${previewUrl}#toolbar=0`} 
                title="PDF Preview"
                className="w-full h-full" 
              />
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-sm font-medium">Save this file to your account</p>

          {!isLoading && !user && (
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href={signupHref}>Want to save this file? Sign up</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={loginHref}>Login</Link>
              </Button>
            </div>
          )}

          {!isLoading && user && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={saveMergedFile}
                disabled={!mergedOutput || isSaving || isMerging}
              >
                {isSaving ? "Saving..." : "Save File"}
              </Button>
              <span className="text-xs text-muted-foreground">
                Signed in as {user.email}
              </span>
            </div>
          )}

          {isLoading && (
            <Button type="button" variant="outline" disabled>
              Checking account...
            </Button>
          )}

          {user && !mergedOutput && (
            <p className="text-xs text-muted-foreground">
              Merge and download your PDF once, then click Save File.
            </p>
          )}
          {mergedOutput && (
            <p className="text-xs text-muted-foreground">
              Ready to save: <span className="font-medium">{mergedOutput.fileName}</span>{" "}
              ({formatFileSize(mergedOutput.size)})
            </p>
          )}
          {saveError && <p className="text-sm text-destructive">{saveError}</p>}
          {saveSuccess && <p className="text-sm text-emerald-600">{saveSuccess}</p>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}
      </CardContent>
    </Card>
  );
}
