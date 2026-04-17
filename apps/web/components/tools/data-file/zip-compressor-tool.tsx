"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { FileZip as FileZipIcon, DownloadSimple as DownloadIcon, Trash as TrashIcon, Folder as FolderZipIcon, FileText as FileIcon } from "@phosphor-icons/react";
import JSZip from "jszip";

export function ZipCompressorTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [zipName, setZipName] = React.useState("archive");
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [compressionResult, setCompressionResult] = React.useState<{ url: string, size: number, name: string } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilesAdded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (compressionResult) {
      URL.revokeObjectURL(compressionResult.url);
      setCompressionResult(null);
    }
  };

  const generateZip = async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    setCompressionResult(null);
    
    try {
      const zip = new JSZip();
      
      // Add all original files to root of the zip
      files.forEach((file) => {
        // Technically this flattens paths. In a real app we might read webkitRelativePath
        zip.file(file.name, file);
      });
      
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      }, (metadata) => {
        // We could hook into metadata.percent here for a progress bar
      });
      
      const resultName = `${zipName || 'archive'}.zip`;
      const url = URL.createObjectURL(content);

      setCompressionResult({
        url,
        size: content.size,
        name: resultName
      });
      
    } catch (err) {
      console.error("Compression error:", err);
      alert("Failed to compress files.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadZip = () => {
    if (!compressionResult) return;
    const a = document.createElement("a");
    a.href = compressionResult.url;
    a.download = compressionResult.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateTotalInputSize = () => {
    return files.reduce((acc, file) => acc + file.size, 0);
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>ZIP Compressor</CardTitle>
        <CardDescription>Compress multiple files into a single .zip archive instantly in your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div 
          className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-4 bg-primary/10 text-primary rounded-full">
            <FolderZipIcon weight="duotone" className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Click to select files</p>
            <p className="text-xs text-muted-foreground hidden sm:block">You can select multiple files at once.</p>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFilesAdded} 
            multiple
            className="hidden" 
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
              <span className="text-xs text-muted-foreground text-right w-full sm:w-auto">
                Total: {formatSize(calculateTotalInputSize())}
              </span>
            </div>
            
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="max-h-48 overflow-y-auto w-full">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-medium">Filename</th>
                      <th className="px-4 py-3 font-medium text-right w-32">Size</th>
                      <th className="px-4 py-3 font-medium w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {files.map((file, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="px-4 py-3 flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                          <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{file.name}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{formatSize(file.size)}</td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" onClick={() => removeFile(idx)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {!compressionResult && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                <div className="space-y-2 flex-1">
                  <Label>Archive Name</Label>
                  <div className="flex items-center">
                    <Input 
                      value={zipName} 
                      onChange={(e) => setZipName(e.target.value)} 
                      placeholder="archive"
                      className="rounded-r-none"
                    />
                    <div className="px-3 border border-l-0 rounded-r-md bg-muted text-muted-foreground h-10 flex items-center">
                      .zip
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={generateZip} disabled={isCompressing} size="lg" className="w-full sm:w-auto">
                    {isCompressing ? "Compressing..." : "Compress to ZIP"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {compressionResult && (
          <div className="bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-300 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/60 dark:text-green-400 rounded-full shrink-0">
                <FileZipIcon weight="fill" className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold">{compressionResult.name}</h3>
                <div className="flex gap-4 mt-1 text-sm opacity-80">
                  <span>Size: {formatSize(compressionResult.size)}</span>
                  <span>Items: {files.length}</span>
                </div>
              </div>
            </div>
            
            <Button size="lg" onClick={downloadZip} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md">
              <DownloadIcon className="mr-2 h-5 w-5" /> Download ZIP
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
