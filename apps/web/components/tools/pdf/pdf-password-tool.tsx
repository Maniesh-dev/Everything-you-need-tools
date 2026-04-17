"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { FilePdf as FilePdfIcon, LockKey as LockIcon, DownloadSimple as DownloadIcon, ShieldCheck as ShieldIcon } from "@phosphor-icons/react";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

export function PdfPasswordTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0] || null);
      setResultUrl(null);
    }
  };

  const protectPdf = async () => {
    if (!file || !password) return;
    
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      const encryptedPdfBytes = await encryptPDF(pdfBytes, password, password);
      
      const blob = new Blob([encryptedPdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("PDF Encryption error:", err);
      alert("Failed to encrypt PDF. Make sure it's a valid PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `protected_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  React.useEffect(() => {
    // Cleanup URL
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>PDF Password Protector</CardTitle>
        <CardDescription>Add a secure password to any PDF file directly in your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!file ? (
          <div 
            className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-red-50 text-red-500 rounded-full dark:bg-red-950/30">
              <FilePdfIcon weight="duotone" className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Upload a PDF file</p>
              <p className="text-xs text-muted-foreground">Up to any size. Maximum privacy guaranteed.</p>
            </div>
            <Button variant="secondary" className="mt-2">Select PDF</Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/pdf"
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/30">
              <div className="flex items-center gap-3 overflow-hidden">
                <FilePdfIcon className="h-8 w-8 text-red-500 shrink-0" weight="fill" />
                <div className="truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResultUrl(null); }}>Change</Button>
            </div>

            {!resultUrl ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Set Password Document</Label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="pl-10 h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">This password will be required to open the PDF. Don't forget it!</p>
                </div>

                <Button 
                  onClick={protectPdf} 
                  disabled={!password || isProcessing} 
                  className="w-full h-12 text-lg"
                >
                  {isProcessing ? "Encrypting..." : "Protect PDF"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20 rounded-2xl text-center space-y-4 animate-in zoom-in-95">
                <div className="h-16 w-16 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <ShieldIcon weight="fill" className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Success! PDF is Protected</h3>
                <p className="text-sm text-green-700/80 dark:text-green-400/80 max-w-sm">
                  Your document has been securely encrypted. The password is required to view or print it.
                </p>
                
                <div className="pt-4 w-full">
                  <Button size="lg" className="w-full shadow-md" onClick={downloadPdf}>
                    <DownloadIcon className="mr-2 h-5 w-5" /> Download Protected PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}
