"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { FileImage as FileImageIcon, Trash as TrashIcon, Info as InfoIcon, Camera as CameraIcon, MapPin as MapPinIcon, Clock as ClockIcon, Lightning as LightningIcon } from "@phosphor-icons/react";
import ExifReader from "exifreader";

export function ExifViewerTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [exifData, setExifData] = React.useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      readExif(selectedFile);
    }
  };

  const readExif = async (file: File) => {
    setIsLoading(true);
    setExifData(null);
    try {
      const tags = await ExifReader.load(file);
      // Remove thumbnail from main data to keep it clean
      delete tags['Thumbnail'];
      setExifData(tags);
    } catch (err) {
      console.error("Exif error:", err);
      // Even if no EXIF data, we show the file
      setExifData({});
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setExifData(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const getImportantTags = () => {
    if (!exifData) return [];
    
    const importantKeys = [
      'Make', 'Model', 'DateTime', 'ExposureTime', 'FNumber', 
      'ISOSpeedRatings', 'FocalLength', 'Software', 'GPSLatitude', 'GPSLongitude'
    ];
    
    return Object.entries(exifData)
      .filter(([key]) => importantKeys.includes(key))
      .map(([key, val]) => ({ key, label: key, value: val.description || val.value }));
  };

  const getAllTags = () => {
    if (!exifData) return [];
    return Object.entries(exifData)
      .map(([key, val]) => ({ 
        key, 
        value: val.description || (Array.isArray(val.value) ? val.value.join(', ') : String(val.value)) 
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-6 w-6 text-primary" weight="duotone" />
          EXIF Data Viewer
        </CardTitle>
        <CardDescription>
          Extract detailed metadata from your images, including camera settings, location data, and timestamps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <div 
            className="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-4 bg-primary/10 text-primary rounded-full">
              <FileImageIcon className="h-10 w-10" />
            </div>
            <div>
              <p className="font-semibold text-lg">Upload image to view EXIF</p>
              <p className="text-sm text-muted-foreground mt-1">Supports JPEG, TIFF, PNG, HEIC, and more.</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*"
              className="hidden" 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-6">
              <div className="relative group rounded-2xl overflow-hidden border bg-black/5 flex items-center justify-center min-h-[300px]">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="max-h-[500px] object-contain" />
                )}
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={removeFile}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">File Basics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Filename</p>
                    <p className="text-sm font-medium truncate">{file.name}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Size</p>
                    <p className="text-sm font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Reading metadata...</p>
                </div>
              ) : exifData ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                     <QuickStat icon={<CameraIcon />} label="Model" value={exifData.Model?.description || "N/A"} />
                     <QuickStat icon={<ClockIcon />} label="Date" value={exifData.DateTime?.description?.split(' ')[0] || "N/A"} />
                     <QuickStat icon={<MapPinIcon />} label="GPS" value={exifData.GPSLatitude ? "Available" : "No GPS"} color={exifData.GPSLatitude ? "text-green-500" : "text-muted-foreground"} />
                     <QuickStat icon={<LightningIcon />} label="Exposure" value={exifData.ExposureTime?.description || "N/A"} />
                  </div>

                  <div className="border rounded-2xl overflow-hidden bg-background shadow-sm">
                    <div className="max-h-[500px] overflow-y-auto w-full">
                      <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-1/3">Tag</TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getAllTags().length > 0 ? (
                            getAllTags().map((tag) => (
                              <TableRow key={tag.key} className="hover:bg-muted/30">
                                <TableCell className="font-medium text-xs text-muted-foreground">{tag.key}</TableCell>
                                <TableCell className="text-xs font-mono break-all">{tag.value}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-10 text-muted-foreground italic">
                                No EXIF data found in this image.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t p-6 rounded-b-xl flex gap-2 items-start">
        <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Your image remains private; all metadata extraction happens entirely in your browser. Note: Many messaging apps and social media platforms strip EXIF data before sharing.
        </p>
      </CardFooter>
    </Card>
  );
}

function QuickStat({ icon, label, value, color = "text-foreground" }: { icon: React.ReactNode, label: string, value: string, color?: string }) {
  return (
    <div className="p-3 bg-muted/40 rounded-xl border border-border/30 flex flex-col items-center text-center gap-1">
      <div className="text-primary mb-1">{icon}</div>
      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">{label}</p>
      <p className={`text-[11px] font-bold truncate w-full ${color}`}>{value}</p>
    </div>
  );
}
