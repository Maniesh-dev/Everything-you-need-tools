"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { FileImage as FileImageIcon, DownloadSimple as DownloadIcon, Trash as TrashIcon, TextT as TextTIcon, Hash as HashIcon, Archive as ArchiveIcon, Plus as PlusIcon } from "@phosphor-icons/react";
import JSZip from "jszip";

export function BulkImageRenamerTool() {
  const [images, setImages] = React.useState<File[]>([]);
  const [prefix, setPrefix] = React.useState("");
  const [suffix, setSuffix] = React.useState("");
  const [startNumber, setStartNumber] = React.useState("1");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getNewName = (originalName: string, index: number) => {
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const number = (parseInt(startNumber) || 1) + index;
    return `${prefix}${number}${suffix}${extension}`;
  };

  const downloadAll = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      images.forEach((file, index) => {
        const newName = getNewName(file.name, index);
        zip.file(newName, file);
      });
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "renamed_images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Renaming error:", err);
      alert("Failed to package renamed images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TextTIcon className="h-6 w-6 text-primary" weight="duotone" />
          Bulk Image Renamer
        </CardTitle>
        <CardDescription>
          Rename multiple images at once using patterns and download them all as a organized ZIP file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-muted/20 rounded-2xl border">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TextTIcon className="h-4 w-4" /> Filename Prefix
            </Label>
            <Input 
              placeholder="e.g. photo_" 
              value={prefix} 
              onChange={(e) => setPrefix(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <HashIcon className="h-4 w-4" /> Start Number
            </Label>
            <Input 
              type="number" 
              value={startNumber} 
              onChange={(e) => setStartNumber(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TextTIcon className="h-4 w-4" /> Filename Suffix
            </Label>
            <Input 
              placeholder="e.g. _v1" 
              value={suffix} 
              onChange={(e) => setSuffix(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        {!images.length ? (
          <div 
            className="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-primary/10 text-primary rounded-full ring-8 ring-primary/5">
              <PlusIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="font-semibold text-lg">Click to select images</p>
              <p className="text-sm text-muted-foreground mt-1">Select multiple images to rename them in bulk.</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*"
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Renaming Queue ({images.length} files)
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="shadow-sm">
                  <PlusIcon className="mr-1 h-3 w-3" /> Add More
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setImages([])} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <TrashIcon className="mr-1 h-3 w-3" /> Clear All
                </Button>
              </div>
            </div>

            <div className="border rounded-2xl overflow-hidden shadow-sm bg-background">
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[40%]">Original Name</TableHead>
                      <TableHead className="w-[40%]">New Name (Preview)</TableHead>
                      <TableHead className="w-[20%] text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {images.map((file, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/30">
                        <TableCell className="font-medium truncate max-w-[200px]">
                           <div className="flex items-center gap-2">
                              <FileImageIcon className="h-4 w-4 text-blue-500 shrink-0" weight="fill" />
                              <span className="truncate">{file.name}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-primary font-semibold truncate max-w-[200px]">
                          {getNewName(file.name, idx)}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => removeImage(idx)}>
                              <TrashIcon className="h-4 w-4" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Button size="lg" className="w-full h-14 text-lg shadow-xl" onClick={downloadAll} disabled={isProcessing}>
              <ArchiveIcon className="mr-2 h-6 w-6" /> 
              {isProcessing ? "Packaging ZIP..." : "Download Rename Group (ZIP)"}
            </Button>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*"
          className="hidden" 
        />
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl">
        <p className="text-xs text-muted-foreground text-center w-full italic">
          Files are processed entirely in your browser. No images are uploaded to any server.
        </p>
      </CardFooter>
    </Card>
  );
}
