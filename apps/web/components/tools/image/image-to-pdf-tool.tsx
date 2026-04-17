"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { FilePdf, UploadSimple, DownloadSimple, X } from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"

export function ImageToPdfTool() {
  const [images, setImages] = React.useState<{ src: string; name: string; file: File }[]>([])
  const [generating, setGenerating] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [...prev, { src: event.target?.result as string, name: file.name, file }])
      }
      reader.readAsDataURL(file)
    })
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved!)
      return next
    })
  }

  const generatePdf = async () => {
    if (images.length === 0) return
    setGenerating(true)

    try {
      const pdfDoc = await PDFDocument.create()

      for (const img of images) {
        const arrayBuffer = await img.file.arrayBuffer()
        const uint8 = new Uint8Array(arrayBuffer)

        let embeddedImage
        if (img.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(uint8)
        } else {
          // Convert non-JPEG/PNG to JPEG via canvas
          if (img.file.type === "image/jpeg" || img.file.type === "image/jpg") {
            embeddedImage = await pdfDoc.embedJpg(uint8)
          } else {
            // For WebP, GIF, etc., convert via canvas
            const bitmap = await createImageBitmap(img.file)
            const canvas = document.createElement("canvas")
            canvas.width = bitmap.width
            canvas.height = bitmap.height
            const ctx = canvas.getContext("2d")!
            ctx.drawImage(bitmap, 0, 0)
            const blob = await new Promise<Blob>((resolve) =>
              canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
            )
            const jpgBytes = new Uint8Array(await blob.arrayBuffer())
            embeddedImage = await pdfDoc.embedJpg(jpgBytes)
          }
        }

        const { width, height } = embeddedImage.scale(1)
        const page = pdfDoc.addPage([width, height])
        page.drawImage(embeddedImage, { x: 0, y: 0, width, height })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "images-combined.pdf"
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("PDF generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePdf className="text-primary" /> Image to PDF
          </CardTitle>
          <CardDescription>Combine multiple images into a single PDF document. All processing happens in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
              <UploadSimple size={40} className="opacity-50" />
              <div>
                <p className="font-semibold text-foreground">Click to add images</p>
                <p className="text-sm mt-1">PNG, JPG, WebP supported. Select multiple files.</p>
              </div>
            </div>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{images.length} image{images.length > 1 ? "s" : ""} added</h3>
                <Button variant="ghost" size="sm" onClick={() => setImages([])} className="text-xs text-muted-foreground">
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group border rounded-lg overflow-hidden bg-muted/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.name} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {i > 0 && (
                        <Button size="icon" variant="secondary" className="h-7 w-7 text-xs" onClick={() => moveImage(i, i - 1)}>←</Button>
                      )}
                      {i < images.length - 1 && (
                        <Button size="icon" variant="secondary" className="h-7 w-7 text-xs" onClick={() => moveImage(i, i + 1)}>→</Button>
                      )}
                      <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => removeImage(i)}>
                        <X size={14} />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 py-1">
                      <span className="text-[10px] font-mono truncate block text-muted-foreground">{i + 1}. {img.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                  <UploadSimple className="mr-2" /> Add More
                </Button>
                <Button onClick={generatePdf} disabled={generating} className="flex-1 shadow-md">
                  <DownloadSimple className="mr-2" />
                  {generating ? "Generating..." : "Generate PDF"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
