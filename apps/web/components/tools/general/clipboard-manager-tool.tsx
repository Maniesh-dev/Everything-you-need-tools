"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Clipboard, Copy, Trash, Plus } from "@phosphor-icons/react"
import { toast } from "sonner"

interface ClipSlot {
  id: string
  text: string
  createdAt: Date
}

export function ClipboardManagerTool() {
  const [slots, setSlots] = React.useState<ClipSlot[]>([])
  const [input, setInput] = React.useState("")

  const addSlot = () => {
    if (!input.trim()) return
    setSlots((prev) => [
      { id: crypto.randomUUID(), text: input.trim(), createdAt: new Date() },
      ...prev,
    ])
    setInput("")
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setSlots((prev) => [
          { id: crypto.randomUUID(), text: text.trim(), createdAt: new Date() },
          ...prev,
        ])
        toast.success("Pasted from clipboard!")
      }
    } catch {
      toast.error("Clipboard access denied. Try typing or pasting manually.")
    }
  }

  const copySlot = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied back to clipboard!")
  }

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  const clearAll = () => {
    setSlots([])
    toast.success("All slots cleared.")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="text-primary" /> Clipboard Manager
          </CardTitle>
          <CardDescription>Save multiple text snippets temporarily. Click any slot to copy it back.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here..."
              onKeyDown={(e) => e.key === "Enter" && addSlot()}
              className="flex-1"
            />
            <Button onClick={addSlot} disabled={!input.trim()}>
              <Plus className="mr-1" /> Add
            </Button>
            <Button variant="outline" onClick={pasteFromClipboard} title="Paste from system clipboard">
              <Clipboard />
            </Button>
          </div>

          {/* Slots */}
          {slots.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">{slots.length} slot{slots.length > 1 ? "s" : ""}</h3>
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-destructive">
                  <Trash className="mr-1" /> Clear All
                </Button>
              </div>

              <div className="space-y-2">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="group flex items-start gap-3 border rounded-lg p-3 bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => copySlot(slot.text)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono whitespace-pre-wrap break-all line-clamp-3">
                        {slot.text}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {slot.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); copySlot(slot.text) }}
                      >
                        <Copy size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); removeSlot(slot.id) }}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slots.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Clipboard size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No clips saved yet.</p>
              <p className="text-sm mt-1">Add text above or paste from your clipboard.</p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
