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

interface FormField {
  name: string;
  type: "text" | "checkbox" | "radio" | "dropdown" | "other";
  value: string | boolean;
}

interface FilledPdfOutput {
  fileName: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
  sourceFiles: Array<{ name: string; size: number }>;
}

export function PdfFormFillerTool() {
  const { user, isLoading, authFetch } = useAuth();
  const pathname = usePathname();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  
  const [pdf, setPdf] = React.useState<{ file: File; bytes: ArrayBuffer } | null>(null);
  const [fields, setFields] = React.useState<FormField[]>([]);
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [filledOutput, setFilledOutput] = React.useState<FilledPdfOutput | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const redirectPath = pathname || "/";
  const signupHref = `/register?redirect=${encodeURIComponent(redirectPath)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(redirectPath)}`;

  async function handleFileUpload(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setSaveError(null);
    setSaveSuccess(null);
    setFilledOutput(null);
    setPreviewUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const form = pdfDoc.getForm();
      const pdfFields = form.getFields();

      const extractedFields: FormField[] = pdfFields.map(f => {
        const name = f.getName();
        let type: FormField["type"] = "other";
        
        // This is a simplified field detection
        const constructorName = f.constructor.name;
        if (constructorName.includes("TextField")) type = "text";
        else if (constructorName.includes("CheckBox")) type = "checkbox";
        else if (constructorName.includes("Dropdown")) type = "dropdown";
        else if (constructorName.includes("Radio")) type = "radio";

        return { name, type, value: type === "checkbox" ? false : "" };
      });

      setPdf({ file, bytes });
      setFields(extractedFields);
    } catch {
      setError("Failed to parse PDF form.");
    }
  }

  async function fillForm() {
    if (!pdf) return;
    setIsProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(pdf.bytes);
      const form = pdfDoc.getForm();

      fields.forEach(f => {
        try {
          if (f.type === "text") form.getTextField(f.name).setText(String(f.value));
          else if (f.type === "checkbox" && typeof f.value === "boolean") {
            const cb = form.getCheckBox(f.name);
            if (f.value) {
              cb.check();
            } else {
              cb.uncheck();
            }
          }
        } catch {
          console.warn(`Could not fill field ${f.name}`);
        }
      });

      const filledBytes = await pdfDoc.save();
      const filledBytesForUse = new Uint8Array(filledBytes.length);
      filledBytesForUse.set(filledBytes);
      const outputFileName = pdf.file.name.replace(/\.pdf$/i, "_filled.pdf");

      setFilledOutput({
        fileName: outputFileName,
        mimeType: "application/pdf",
        size: filledBytesForUse.byteLength,
        bytes: filledBytesForUse,
        sourceFiles: [{ name: pdf.file.name, size: pdf.file.size }],
      });
      setSaveError(null);
      setSaveSuccess(null);

      const blob = new Blob([filledBytesForUse], { type: "application/pdf" });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setSuccess("Form filled successfully!");
    } catch {
      setError("Error creating filled PDF.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function saveFilledFile() {
    if (!user) {
      setSaveError("Please sign in to save files.");
      return;
    }
    if (!filledOutput) {
      setSaveError("Fill and download your PDF once, then click Save File.");
      return;
    }
    if (filledOutput.size > MAX_SAVE_BYTES) {
      setSaveError(
        `This file is ${formatFileSize(
          filledOutput.size
        )}. Maximum save size is ${formatFileSize(MAX_SAVE_BYTES)}.`
      );
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const fileBase64 = uint8ToBase64(filledOutput.bytes);
      const result = await postSavedData(authFetch, {
        category: "pdf",
        toolId: "pdf-form-filler",
        data: {
          fileName: filledOutput.fileName,
          mimeType: filledOutput.mimeType,
          fileSize: filledOutput.size,
          fileBase64,
          sourceFiles: filledOutput.sourceFiles,
          savedFromTool: "pdf-form-filler",
          savedAt: new Date().toISOString(),
          fieldCount: fields.length,
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
        <CardTitle>PDF Form Filler</CardTitle>
        <CardDescription>Upload a PDF with form fields, fill them out, and download the result.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFileUpload(e.target.files)} />
        
        {!pdf && (
          <div 
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/30"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-muted-foreground">Click or drag PDF form here</p>
          </div>
        )}

        {pdf && fields.length > 0 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f, i) => (
                <div key={i} className="space-y-2">
                  <Label>{f.name}</Label>
                  {f.type === "checkbox" ? (
                    <input type="checkbox" checked={!!f.value} onChange={e => {
                      const next = [...fields];
                      const field = next[i];
                      if (!field) return;
                      field.value = e.target.checked;
                      setFields(next);
                    }} />
                  ) : (
                    <Input value={String(f.value)} onChange={e => {
                      const next = [...fields];
                      const field = next[i];
                      if (!field) return;
                      field.value = e.target.value;
                      setFields(next);
                    }} placeholder={`Enter ${f.name}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={fillForm} disabled={isProcessing}>{isProcessing ? "Processing..." : "Fill & Preview"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPdf(null);
                  setFields([]);
                  setFilledOutput(null);
                  setSaveError(null);
                  setSaveSuccess(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {pdf && fields.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No interactive form fields found in this PDF.</p>
            <Button variant="outline" className="mt-4" onClick={() => setPdf(null)}>Try another file</Button>
          </div>
        )}

        {previewUrl && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Preview Result</p>
              <Button asChild>
                <a href={previewUrl} download={filledOutput?.fileName ?? "filled_form.pdf"}>
                  Download PDF
                </a>
              </Button>
            </div>
            <iframe src={previewUrl} className="aspect-video w-full rounded-xl border" />
          </div>
        )}

        <SaveToAccountSection
          user={user ? { email: user.email } : null}
          isLoading={isLoading}
          signupHref={signupHref}
          loginHref={loginHref}
          onSave={saveFilledFile}
          saveDisabled={!filledOutput || isSaving || isProcessing}
          isSaving={isSaving}
          idleHint={
            user && !filledOutput
              ? "Fill and download your PDF once, then click Save File."
              : null
          }
          readyHint={
            filledOutput
              ? `Ready to save: ${filledOutput.fileName} (${formatFileSize(
                  filledOutput.size
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
