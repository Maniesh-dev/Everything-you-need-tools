"use client";

import * as React from "react";
import { PDFDocument } from "pdf-lib";
import { FilePdf, Download, Trash, Lightning, Info, Spinner } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { toast } from "sonner";

export function PdfCompressorTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = React.useState<Blob | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [stats, setStats] = React.useState<{ original: number; compressed: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setCompressedBlob(null);
      setStats(null);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);

      // pdf-lib's "compression" is mostly about re-saving without unused objects 
      // and potentially stripping metadata. True image downsampling requires more complex logic.
      // We use the copyPages approach to "rebuild" the PDF which often reduces bloat.
      const compressedPdf = await PDFDocument.create();
      const pages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => compressedPdf.addPage(page));
      
      setProgress(80);
      const pdfBytes = await compressedPdf.save({ 
        useObjectStreams: true,
      });
      
      const blob = new Blob([pdfBytes.slice(0)], { type: "application/pdf" });
      setCompressedBlob(blob);
      setStats({
        original: file.size,
        compressed: blob.size,
      });
      setProgress(100);
      toast.success("PDF compressed successfully!");
    } catch (error) {
      toast.error(`Compression failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${file?.name || "document.pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePdf className="h-6 w-6 text-red-500" />
            PDF Compressor
          </CardTitle>
          <CardDescription>
            Reduce the file size of your PDF documents locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              file ? "border-primary/50 bg-primary/5" : "border-muted-foreground/20 hover:border-primary/30"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            {file ? (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FilePdf className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                    <Trash className="mr-2 h-4 w-4" /> Change
                  </Button>
                  {!compressedBlob && (
                    <Button size="sm" onClick={compressPdf} disabled={loading}>
                      <Lightning className="mr-2 h-4 w-4" /> Optimize now
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <FilePdf className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">Maximum 50MB per file</p>
                </div>
              </label>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <Spinner className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">Optimizing PDF structures...</p>
            </div>
          )}

          {stats && (
            <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10">
              <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg">
                    <Lightning className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      Reduced by {((stats.original - stats.compressed) / stats.original * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(stats.original)} → {formatSize(stats.compressed)}
                    </p>
                  </div>
                </div>
                <Button onClick={handleDownload} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
                  <Download className="mr-2 h-4 w-4" /> Download Optimized PDF
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1 italic">How it works:</p>
              This tool performs structural optimization by removing redundant objects, stripping unnecessary metadata, and using object streams. For PDFs with large high-resolution images, we recommend an image-specific compressor first.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
