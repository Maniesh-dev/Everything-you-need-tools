"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { TwitterLogo, DownloadSimple, Heart, ArrowsClockwise, ChatCircle, Export } from "@phosphor-icons/react"

export function FakeTweetMakerTool() {
  const [displayName, setDisplayName] = React.useState("Kraaft Tools")
  const [handle, setHandle] = React.useState("kraafttools")
  const [tweetText, setTweetText] = React.useState("Just shipped 100+ free browser tools! No login required. Check them out 🚀")
  const [likes, setLikes] = React.useState("4,287")
  const [retweets, setRetweets] = React.useState("891")
  const [replies, setReplies] = React.useState("142")
  const [verified, setVerified] = React.useState(true)
  const [theme, setTheme] = React.useState<"light" | "dark">("dark")

  const tweetRef = React.useRef<HTMLDivElement>(null)

  const downloadAsImage = async () => {
    if (!tweetRef.current) return

    // Use canvas to capture the tweet card
    const el = tweetRef.current
    const canvas = document.createElement("canvas")
    const scale = 2
    canvas.width = el.offsetWidth * scale
    canvas.height = el.offsetHeight * scale
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw background
    ctx.scale(scale, scale)
    ctx.fillStyle = theme === "dark" ? "#000000" : "#ffffff"
    ctx.fillRect(0, 0, el.offsetWidth, el.offsetHeight)

    // Since we can't use html2canvas, we'll use a simpler SVG foreignObject approach
    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${el.offsetWidth}" height="${el.offsetHeight}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; ${theme === "dark" ? "background:#000;color:#e7e9ea;" : "background:#fff;color:#0f1419;"}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:20px;">${displayName.charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight:700;font-size:15px;">${displayName} ${verified ? "✓" : ""}</div>
                <div style="color:#71767b;font-size:14px;">@${handle}</div>
              </div>
            </div>
            <div style="font-size:17px;line-height:1.5;white-space:pre-wrap;margin-bottom:16px;">${tweetText.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</div>
            <div style="color:#71767b;font-size:13px;padding-bottom:12px;border-bottom:1px solid ${theme === "dark" ? "#2f3336" : "#eff3f4"};">
              ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div style="display:flex;gap:24px;padding-top:12px;color:#71767b;font-size:14px;">
              <span>💬 ${replies}</span>
              <span>🔁 ${retweets}</span>
              <span>❤️ ${likes}</span>
              <span>📤 Share</span>
            </div>
          </div>
        </foreignObject>
      </svg>`

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const link = document.createElement("a")
      link.download = "fake-tweet.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data)
  }

  const isDark = theme === "dark"

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TwitterLogo className="text-primary" /> Fake Tweet Maker
          </CardTitle>
          <CardDescription>Create realistic mock tweet screenshots for presentations, memes, or social proof.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

            {/* Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>@Handle</Label>
                  <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tweet Text</Label>
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  rows={4}
                  maxLength={280}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground text-right">{tweetText.length}/280</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Replies</Label>
                  <Input value={replies} onChange={(e) => setReplies(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Retweets</Label>
                  <Input value={retweets} onChange={(e) => setRetweets(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Likes</Label>
                  <Input value={likes} onChange={(e) => setLikes(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="accent-primary w-4 h-4" />
                  Verified badge
                </label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Theme:</Label>
                  <Button variant={isDark ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>Dark</Button>
                  <Button variant={!isDark ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>Light</Button>
                </div>
              </div>

              <Button onClick={downloadAsImage} className="w-full shadow-md mt-4" size="lg">
                <DownloadSimple className="mr-2" size={20} /> Download as Image
              </Button>
            </div>

            {/* Preview */}
            <div className="flex items-start justify-center">
              <div
                ref={tweetRef}
                className={`w-full max-w-[400px] rounded-2xl border shadow-lg overflow-hidden ${isDark ? "bg-black text-[#e7e9ea] border-[#2f3336]" : "bg-white text-[#0f1419] border-gray-200"}`}
              >
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[15px] truncate">{displayName}</span>
                        {verified && (
                          <svg viewBox="0 0 22 22" className="w-5 h-5 text-blue-500 shrink-0 fill-current">
                            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.853-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.144.271.587.703 1.087 1.24 1.44s1.167.551 1.813.568c.645-.017 1.27-.213 1.81-.567.542-.355.974-.853 1.246-1.44.606.223 1.264.272 1.897.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.633.083-1.29-.14-1.896.587-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                          </svg>
                        )}
                      </div>
                      <div className={`text-sm ${isDark ? "text-[#71767b]" : "text-gray-500"}`}>@{handle}</div>
                    </div>
                    <TwitterLogo size={24} className={`ml-auto shrink-0 ${isDark ? "text-white" : "text-[#1d9bf0]"}`} />
                  </div>

                  {/* Tweet Body */}
                  <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{tweetText}</p>

                  {/* Timestamp */}
                  <div className={`text-[13px] ${isDark ? "text-[#71767b]" : "text-gray-500"} pb-3 border-b ${isDark ? "border-[#2f3336]" : "border-gray-100"}`}>
                    {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  {/* Engagement */}
                  <div className={`flex gap-6 text-sm ${isDark ? "text-[#71767b]" : "text-gray-500"} pt-1`}>
                    <span className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer"><ChatCircle size={18} /> {replies}</span>
                    <span className="flex items-center gap-1.5 hover:text-green-500 cursor-pointer"><ArrowsClockwise size={18} /> {retweets}</span>
                    <span className="flex items-center gap-1.5 hover:text-pink-500 cursor-pointer"><Heart size={18} /> {likes}</span>
                    <span className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer ml-auto"><Export size={18} /></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
