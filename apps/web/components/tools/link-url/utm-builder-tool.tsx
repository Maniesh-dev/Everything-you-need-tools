"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { LinkSimple, Copy, Eraser } from "@phosphor-icons/react"
import { toast } from "sonner"

export function UtmBuilderTool() {
  const [baseUrl, setBaseUrl] = React.useState("")
  const [source, setSource] = React.useState("")
  const [medium, setMedium] = React.useState("")
  const [campaign, setCampaign] = React.useState("")
  const [term, setTerm] = React.useState("")
  const [content, setContent] = React.useState("")

  const generatedUrl = React.useMemo(() => {
    if (!baseUrl.trim()) return ""
    try {
      const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`)
      if (source) url.searchParams.set("utm_source", source)
      if (medium) url.searchParams.set("utm_medium", medium)
      if (campaign) url.searchParams.set("utm_campaign", campaign)
      if (term) url.searchParams.set("utm_term", term)
      if (content) url.searchParams.set("utm_content", content)
      return url.toString()
    } catch {
      return ""
    }
  }, [baseUrl, source, medium, campaign, term, content])

  const handleCopy = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    toast.success("UTM link copied to clipboard!")
  }

  const handleReset = () => {
    setBaseUrl("")
    setSource("")
    setMedium("")
    setCampaign("")
    setTerm("")
    setContent("")
  }

  const presets = [
    { label: "Google Ads", s: "google", m: "cpc" },
    { label: "Facebook", s: "facebook", m: "social" },
    { label: "Newsletter", s: "newsletter", m: "email" },
    { label: "Twitter/X", s: "twitter", m: "social" },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkSimple className="text-primary" /> UTM Link Builder
          </CardTitle>
          <CardDescription>Build campaign-tagged URLs for tracking marketing performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-2">
            <Label className="text-base font-semibold">Landing Page URL *</Label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className="font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Quick Fill:</span>
            {presets.map((p) => (
              <Button key={p.label} variant="secondary" size="sm" onClick={() => { setSource(p.s); setMedium(p.m) }}>
                {p.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Campaign Source *</Label>
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. google, facebook" />
            </div>
            <div className="space-y-2">
              <Label>Campaign Medium *</Label>
              <Input value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="e.g. cpc, email, social" />
            </div>
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. summer_sale" />
            </div>
            <div className="space-y-2">
              <Label>Campaign Term</Label>
              <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. running+shoes" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Campaign Content</Label>
              <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g. banner_ad, text_link" />
            </div>
          </div>

          {generatedUrl && (
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-base font-semibold">Generated UTM Link</Label>
              <div className="bg-muted/50 border rounded-xl p-4 break-all font-mono text-sm text-primary select-all">
                {generatedUrl}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1 shadow-md">
                  <Copy className="mr-2" /> Copy Link
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <Eraser className="mr-2" /> Reset
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
