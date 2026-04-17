"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Label } from "@workspace/ui/components/label"
import { Shuffle, Copy, ArrowsClockwise } from "@phosphor-icons/react"
import { toast } from "sonner"

const ADJECTIVES_COOL = ["Shadow", "Cosmic", "Neon", "Phantom", "Blaze", "Frost", "Storm", "Viper", "Turbo", "Nova", "Cyber", "Dark", "Iron", "Steel", "Pixel", "Glitch", "Hyper", "Ultra", "Mega", "Quantum"]
const ADJECTIVES_AESTHETIC = ["Velvet", "Dreamy", "Lunar", "Serene", "Misty", "Crystal", "Coral", "Lush", "Bloom", "Peach", "Sage", "Honey", "Ivory", "Opal", "Azure", "Dusk", "Dawn", "Petal", "Ember", "Whimsy"]
const ADJECTIVES_PRO = ["Prime", "Alpha", "Elite", "Smart", "Core", "Lead", "Chief", "Swift", "Sharp", "Bold", "Clear", "Grand", "True", "Peak", "First", "Real", "Next", "Pro", "Max", "Top"]

const NOUNS_COOL = ["Wolf", "Dragon", "Phoenix", "Hawk", "Tiger", "Raven", "Cobra", "Panther", "Falcon", "Bear", "Snake", "Ninja", "Knight", "Blade", "Fury", "Hunter", "Reaper", "Ghost", "Titan", "Rex"]
const NOUNS_AESTHETIC = ["Moon", "Star", "Cloud", "Rose", "Lily", "Sky", "Rain", "Snow", "Wind", "Leaf", "Fern", "Wave", "Brook", "Dove", "Swan", "Willow", "Orchid", "Iris", "Flora", "Aura"]
const NOUNS_PRO = ["Tech", "Dev", "Craft", "Works", "Labs", "Hub", "Mind", "Flow", "Logic", "Code", "Base", "Edge", "Spark", "Link", "Forge", "Build", "Stack", "Rise", "Byte", "Node"]

const SUFFIXES = ["", "X", "One", "Pro", "IO", "HQ", "FX", "99", "21", "42", "007", "XO", "777", "360"]

type Style = "gaming" | "aesthetic" | "professional"

function getWordLists(style: Style) {
  switch (style) {
    case "gaming": return { adj: ADJECTIVES_COOL, noun: NOUNS_COOL }
    case "aesthetic": return { adj: ADJECTIVES_AESTHETIC, noun: NOUNS_AESTHETIC }
    case "professional": return { adj: ADJECTIVES_PRO, noun: NOUNS_PRO }
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function generateUsername(style: Style, separator: string, includeNumbers: boolean): string {
  const { adj, noun } = getWordLists(style)
  const parts = [pick(adj), pick(noun)]
  if (includeNumbers) parts.push(pick(SUFFIXES) || String(Math.floor(Math.random() * 999)))
  return parts.filter(Boolean).join(separator)
}

export function UsernameGeneratorTool() {
  const [style, setStyle] = React.useState<Style>("gaming")
  const [separator, setSeparator] = React.useState("_")
  const [includeNumbers, setIncludeNumbers] = React.useState(true)
  const [count, setCount] = React.useState("10")
  const [usernames, setUsernames] = React.useState<string[]>([])
  const [customPrefix, setCustomPrefix] = React.useState("")

  const generate = React.useCallback(() => {
    const n = Math.max(1, Math.min(50, parseInt(count) || 10))
    const results: string[] = []
    for (let i = 0; i < n; i++) {
      let name = generateUsername(style, separator, includeNumbers)
      if (customPrefix.trim()) {
        name = customPrefix.trim() + separator + name
      }
      results.push(name)
    }
    setUsernames(results)
  }, [style, separator, includeNumbers, count, customPrefix])

  React.useEffect(() => {
    generate()
  }, [generate])

  const copyOne = (name: string) => {
    navigator.clipboard.writeText(name)
    toast.success(`"${name}" copied!`)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(usernames.join("\n"))
    toast.success("All usernames copied!")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="text-primary" /> Username Generator
          </CardTitle>
          <CardDescription>Generate unique, aesthetic usernames and gamertags instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">🎮 Gaming</SelectItem>
                  <SelectItem value="aesthetic">🌸 Aesthetic</SelectItem>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">Underscore ( _ )</SelectItem>
                  <SelectItem value="-">Dash ( - )</SelectItem>
                  <SelectItem value=".">Dot ( . )</SelectItem>
                  <SelectItem value="">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Custom Prefix</Label>
              <Input value={customPrefix} onChange={(e) => setCustomPrefix(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              Include numbers / suffixes
            </label>

            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={copyAll}>
                <Copy className="mr-2" /> Copy All
              </Button>
              <Button onClick={generate} className="shadow-md">
                <ArrowsClockwise className="mr-2" /> Regenerate
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {usernames.map((name, i) => (
              <button
                key={`${name}-${i}`}
                onClick={() => copyOne(name)}
                className="group text-left bg-card border rounded-lg px-4 py-3 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-sm truncate">{name}</span>
                  <Copy size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">Click any username to copy. All generation happens locally.</p>

        </CardContent>
      </Card>
    </div>
  )
}
