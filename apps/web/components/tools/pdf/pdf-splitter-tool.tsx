"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
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

interface SplitPdfOutput {
  fileName: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  sourceFiles: Array<{ name: string; size: number }>;
}

function normalizeOutputName(name: string): string {
  const cleaned = name.trim().replace(/[\\/:*?"<>|]+/g, "-");
  if (!cleaned) return "split.pdf";
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

// Parses string like "1-3, 5, 8-10" into array of 0-based page indices
function parsePageRanges(rangeStr: string, maxPage: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = parseInt(startStr || "1", 10);
      const end = parseInt(endStr || String(maxPage), 10);
      
      if (isNaN(start) || isNaN(end)) continue;
      
      const min = Math.max(1, Math.min(start, end));
      const max = Math.min(maxPage, Math.max(start, end));
      
      for (let i = min; i <= max; i++) {
        pages.add(i - 1); // 0-based index
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPage) {
        pages.add(page - 1); // 0-based index
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export function PdfSplitterTool() {
  const { user, isLoading, authFetch } = useAuth();
  const pathname = usePathname();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [pdf, setPdf] = React.useState<SelectedPdf | null>(null);
  const [pageRanges, setPageRanges] = React.useState("1");
  const [outputName, setOutputName] = React.useState("split.pdf");
  
  const [isSplitting, setIsSplitting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [splitOutput, setSplitOutput] = React.useState<SplitPdfOutput | null>(null);
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
    setSplitOutput(null);
    setSaveError(null);
    setSaveSuccess(null);

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
      setPageRanges(`1-${pages}`);
      
      const newName = file.name.replace(/\.pdf$/i, "");
      setOutputName(`${newName}_split.pdf`);

    } catch {
      setError("Could not read PDF. It might be corrupted or protected.");
    }
  }

  function removePdf() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPdf(null);
    setPreviewUrl(null);
    setSuccess(null);
    setSplitOutput(null);
    setSaveError(null);
    setSaveSuccess(null);
  }

  async function saveSplitFile() {
    if (!user) {
      setSaveError("Please sign in to save files.");
      return;
    }
    if (!splitOutput) {
      setSaveError("Split and download your PDF once, then click Save File.");
      return;
    }
    if (splitOutput.size > MAX_SAVE_BYTES) {
      setSaveError(
        `This file is ${formatFileSize(
          splitOutput.size
        )}. Maximum save size is ${formatFileSize(MAX_SAVE_BYTES)}.`
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const fileBase64 = uint8ToBase64(splitOutput.bytes);
      const result = await postSavedData(authFetch, {
        category: "pdf",
        toolId: "pdf-splitter",
        data: {
          fileName: splitOutput.fileName,
          mimeType: splitOutput.mimeType,
          fileSize: splitOutput.size,
          fileBase64,
          sourceFiles: splitOutput.sourceFiles,
          savedFromTool: "pdf-splitter",
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

  async function splitPdf() {
    if (!pdf || !pdf.pageCount) return;

    const indicesToKeep = parsePageRanges(pageRanges, pdf.pageCount);
    if (indicesToKeep.length === 0) {
      setError("Invalid page range.");
      return;
    }

    setIsSplitting(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await pdf.file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, indicesToKeep);
      copiedPages.forEach(p => newPdf.addPage(p));

      const splitBytes = await newPdf.save();
      const splitBytesForUse = new Uint8Array(splitBytes.length);
      splitBytesForUse.set(splitBytes);

      setSplitOutput({
        fileName: normalizeOutputName(outputName),
        mimeType: "application/pdf",
        size: splitBytesForUse.byteLength,
        bytes: splitBytesForUse,
        sourceFiles: [{ name: pdf.file.name, size: pdf.file.size }],
      });
      setSaveError(null);
      setSaveSuccess(null);

      const blob = new Blob([splitBytesForUse], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setSuccess(`Extracted ${indicesToKeep.length} pages.`);
    } catch {
      setError("Unable to split PDF.");
    } finally {
      setIsSplitting(false);
    }
  }

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>PDF Splitter</CardTitle>
        <CardDescription>Extract specific ranges to create new PDFs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => addFiles(e.target.files)} />
        {!pdf ? (
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-xl border-2 border-dashed p-10 text-center hover:bg-muted/10">
            Select PDF File
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{pdf.file.name}</p>
                <p className="text-xs text-muted-foreground">{pdf.pageCount} Pages</p>
              </div>
              <Button size="sm" variant="destructive" onClick={removePdf}>Remove</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Page Range</Label>
                <Input value={pageRanges} onChange={e => setPageRanges(e.target.value)} placeholder="e.g. 1-3, 5" />
              </div>
              <div className="space-y-2">
                <Label>Output Name</Label>
                <Input value={outputName} onChange={e => setOutputName(e.target.value)} />
              </div>
            </div>
            <Button onClick={splitPdf} disabled={isSplitting} className="w-full">
              {isSplitting ? "Processing..." : "Extract Pages"}
            </Button>
          </div>
        )}

        {previewUrl && (
          <div className="space-y-4 border-t pt-4">
            <Button asChild className="w-full">
              <a href={previewUrl} download={outputName}>Download Split PDF</a>
            </Button>
            <iframe src={previewUrl} className="aspect-video w-full rounded-lg border" />
          </div>
        )}

        <SaveToAccountSection
          user={user ? { email: user.email } : null}
          isLoading={isLoading}
          signupHref={signupHref}
          loginHref={loginHref}
          onSave={saveSplitFile}
          saveDisabled={!splitOutput || isSaving || isSplitting}
          isSaving={isSaving}
          idleHint={
            user && !splitOutput
              ? "Split and download your PDF once, then click Save File."
              : null
          }
          readyHint={
            splitOutput
              ? `Ready to save: ${splitOutput.fileName} (${formatFileSize(
                  splitOutput.size
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
