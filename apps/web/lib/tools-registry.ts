import { type CategorySlug } from "./categories";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
  isMostUsed?: boolean;
  status: "live" | "coming-soon";
}

export const tools: Tool[] = [
  // ─── Clock & Time Tools ──────────────────────────────────────
  { slug: "world-clock", name: "World Clock", description: "Current time in any city around the world", category: "clock-time", tags: ["time", "timezone", "city", "clock"], isMostUsed: true, status: "coming-soon" },
  { slug: "stopwatch", name: "Online Stopwatch", description: "Stopwatch with lap timer functionality", category: "clock-time", tags: ["stopwatch", "lap", "timer"], status: "live" },
  { slug: "countdown-timer", name: "Countdown Timer", description: "Set a countdown and share a link", category: "clock-time", tags: ["countdown", "timer", "share"], status: "live" },
  { slug: "alarm-clock", name: "Alarm Clock", description: "Browser-based alarm clock", category: "clock-time", tags: ["alarm", "clock", "wake"], status: "live" },
  { slug: "timezone-planner", name: "Timezone Planner", description: "Plan meetings across multiple timezones", category: "clock-time", tags: ["meeting", "timezone", "planner"], status: "coming-soon" },
  { slug: "sunrise-sunset", name: "Sunrise & Sunset", description: "Sunrise and sunset times by city", category: "clock-time", tags: ["sunrise", "sunset", "city", "daylight"], status: "coming-soon" },
  { slug: "time-elapsed", name: "Time Elapsed", description: "Calculate how much time has passed since a date", category: "clock-time", tags: ["time", "elapsed", "date", "since"], status: "coming-soon" },

  // ─── Weather Tools ──────────────────────────────────────────
  { slug: "current-weather", name: "Current Weather", description: "Check the current weather by location", category: "weather", tags: ["weather", "temperature", "location"], status: "coming-soon" },
  { slug: "weather-forecast", name: "7-Day Forecast", description: "Get a 7-day weather forecast", category: "weather", tags: ["weather", "forecast", "week"], status: "coming-soon" },
  { slug: "air-quality", name: "Air Quality Index", description: "Check the air quality index (AQI)", category: "weather", tags: ["air", "quality", "aqi", "pollution"], status: "coming-soon" },
  { slug: "uv-index", name: "UV Index Checker", description: "Check the current UV index", category: "weather", tags: ["uv", "sun", "index"], status: "coming-soon" },
  { slug: "rain-humidity", name: "Rain & Humidity", description: "Track rain and humidity levels", category: "weather", tags: ["rain", "humidity", "moisture"], status: "coming-soon" },
  { slug: "wind-speed", name: "Wind Speed & Direction", description: "Check wind speed and direction", category: "weather", tags: ["wind", "speed", "direction"], status: "coming-soon" },
  { slug: "weather-widget", name: "Weather Widget Generator", description: "Generate an embeddable weather widget", category: "weather", tags: ["weather", "widget", "embed"], status: "coming-soon" },

  // ─── To-Do & Task Tools ──────────────────────────────────────
  { slug: "todo-list", name: "Simple To-Do List", description: "No-login to-do list for quick tasks", category: "todo-task", tags: ["todo", "list", "tasks"], status: "coming-soon" },
  { slug: "daily-planner", name: "Daily Planner", description: "Schedule builder for your day", category: "todo-task", tags: ["planner", "schedule", "daily"], status: "coming-soon" },
  { slug: "shared-checklist", name: "Shared Checklist", description: "Create and share a checklist via link", category: "todo-task", tags: ["checklist", "share", "link"], status: "coming-soon" },
  { slug: "grocery-list", name: "Grocery List", description: "Grocery and shopping list maker", category: "todo-task", tags: ["grocery", "shopping", "list"], status: "coming-soon" },
  { slug: "recurring-task", name: "Recurring Tasks", description: "Set up recurring tasks and reminders", category: "todo-task", tags: ["recurring", "reminder", "task"], status: "coming-soon" },
  { slug: "kanban-board", name: "Kanban Board", description: "Simple kanban board with no signup", category: "todo-task", tags: ["kanban", "board", "project"], status: "coming-soon" },
  { slug: "priority-matrix", name: "Priority Matrix", description: "Eisenhower priority matrix for task management", category: "todo-task", tags: ["priority", "eisenhower", "matrix"], status: "coming-soon" },

  // ─── Calendar & Date Tools ──────────────────────────────────
  { slug: "days-until-since", name: "Days Until / Since", description: "Calculate days until or since a date", category: "calendar-date", tags: ["days", "until", "since", "date"], status: "live" },
  { slug: "holiday-calendar", name: "Holiday Calendar", description: "Holiday calendar by country", category: "calendar-date", tags: ["holiday", "calendar", "country"], status: "coming-soon" },
  { slug: "week-number", name: "Week Number Calculator", description: "Find the week number for any date", category: "calendar-date", tags: ["week", "number", "date"], status: "coming-soon" },
  { slug: "printable-calendar", name: "Printable Calendar", description: "Generate a printable blank calendar", category: "calendar-date", tags: ["calendar", "print", "blank"], status: "coming-soon" },
  { slug: "event-countdown", name: "Event Countdown", description: "Create a shareable event countdown page", category: "calendar-date", tags: ["event", "countdown", "share"], status: "coming-soon" },
  { slug: "working-days", name: "Working Days Calculator", description: "Calculate working days between dates", category: "calendar-date", tags: ["working", "days", "business"], status: "live" },
  { slug: "date-add-subtract", name: "Date Add / Subtract", description: "Add or subtract days, months, years from a date", category: "calendar-date", tags: ["date", "add", "subtract", "calculator"], status: "live" },

  // ─── Link & URL Tools ──────────────────────────────────────
  { slug: "url-shortener", name: "URL Shortener", description: "Shorten any URL for easy sharing", category: "link-url", tags: ["url", "short", "link"], isMostUsed: true, status: "coming-soon" },
  { slug: "qr-code-generator", name: "QR Code Generator", description: "Generate QR codes for any text or URL", category: "link-url", tags: ["qr", "code", "generator"], status: "live" },
  { slug: "utm-builder", name: "UTM Link Builder", description: "Build UTM-tagged campaign links", category: "link-url", tags: ["utm", "campaign", "marketing", "link"], status: "coming-soon" },
  { slug: "url-encode-decode", name: "URL Encoder / Decoder", description: "Encode or decode URL components", category: "link-url", tags: ["url", "encode", "decode"], status: "live" },
  { slug: "broken-link-checker", name: "Broken Link Checker", description: "Check for broken links on a webpage", category: "link-url", tags: ["broken", "link", "checker"], status: "coming-soon" },
  { slug: "og-preview", name: "OG Preview Checker", description: "Preview Open Graph tags for any URL", category: "link-url", tags: ["og", "opengraph", "preview", "meta"], status: "coming-soon" },
  { slug: "link-protector", name: "Link Protector", description: "Add expiry or password protection to links", category: "link-url", tags: ["link", "password", "expiry", "protect"], status: "coming-soon" },

  // ─── Image Tools ──────────────────────────────────────────
  { slug: "image-to-pdf", name: "Image to PDF", description: "Convert images to PDF documents", category: "image", tags: ["image", "pdf", "convert"], isMostUsed: true, status: "coming-soon" },
  { slug: "image-compressor", name: "Image Compressor", description: "Compress images without losing quality", category: "image", tags: ["image", "compress", "optimize"], status: "coming-soon" },
  { slug: "image-resizer", name: "Image Resizer & Cropper", description: "Resize and crop images easily", category: "image", tags: ["image", "resize", "crop"], status: "coming-soon" },
  { slug: "background-remover", name: "Background Remover", description: "Remove background from any image", category: "image", tags: ["background", "remove", "image"], status: "coming-soon" },
  { slug: "image-format-converter", name: "Format Converter", description: "Convert between PNG, JPG, WebP, AVIF formats", category: "image", tags: ["image", "format", "convert", "png", "jpg", "webp"], status: "coming-soon" },
  { slug: "image-to-base64", name: "Image to Base64", description: "Convert images to Base64 strings", category: "image", tags: ["image", "base64", "encode"], status: "live" },
  { slug: "watermark-adder", name: "Watermark Adder", description: "Add watermarks to your images", category: "image", tags: ["watermark", "image", "protect"], status: "coming-soon" },
  { slug: "color-picker-image", name: "Color Picker from Image", description: "Pick colors from any image", category: "image", tags: ["color", "picker", "image", "eyedropper"], status: "coming-soon" },
  { slug: "bulk-image-renamer", name: "Bulk Image Renamer", description: "Rename multiple images at once", category: "image", tags: ["bulk", "rename", "image"], status: "coming-soon" },
  { slug: "exif-viewer", name: "EXIF Data Viewer", description: "View and remove EXIF metadata from images", category: "image", tags: ["exif", "metadata", "image", "privacy"], status: "coming-soon" },
  { slug: "reverse-image-search", name: "Reverse Image Search", description: "Find the source of any image", category: "image", tags: ["reverse", "image", "search"], status: "coming-soon" },
  { slug: "image-to-text", name: "Image to Text (OCR)", description: "Extract text from images using OCR", category: "image", tags: ["ocr", "image", "text", "extract"], status: "coming-soon" },

  // ─── PDF Tools ──────────────────────────────────────────
  { slug: "pdf-merger", name: "PDF Merger", description: "Merge multiple PDF files into one", category: "pdf", tags: ["pdf", "merge", "combine"], status: "live" },
  { slug: "pdf-splitter", name: "PDF Splitter", description: "Split a PDF into separate files", category: "pdf", tags: ["pdf", "split", "separate"], status: "live" },
  { slug: "pdf-compressor", name: "PDF Compressor", description: "Compress PDF files to reduce size", category: "pdf", tags: ["pdf", "compress", "size"], status: "coming-soon" },
  { slug: "pdf-to-word", name: "PDF to Word / Excel", description: "Convert PDF to Word or Excel documents", category: "pdf", tags: ["pdf", "word", "excel", "convert"], status: "coming-soon" },
  { slug: "word-to-pdf", name: "Word / Excel to PDF", description: "Convert Word or Excel files to PDF", category: "pdf", tags: ["word", "excel", "pdf", "convert"], status: "coming-soon" },
  { slug: "pdf-password", name: "PDF Password Protector", description: "Add password protection to PDF files", category: "pdf", tags: ["pdf", "password", "protect", "security"], status: "coming-soon" },
  { slug: "pdf-rotator", name: "PDF Page Rotator", description: "Rotate and reorder PDF pages", category: "pdf", tags: ["pdf", "rotate", "reorder", "page"], status: "live" },
  { slug: "pdf-form-filler", name: "PDF Form Filler", description: "Fill out PDF forms in the browser", category: "pdf", tags: ["pdf", "form", "fill"], status: "live" },
  { slug: "pdf-to-image", name: "PDF to Image", description: "Convert PDF pages to PNG or JPG images", category: "pdf", tags: ["pdf", "image", "png", "jpg", "convert"], status: "live" },

  // ─── Video & Audio Download ──────────────────────────────────
  { slug: "youtube-downloader", name: "YouTube Downloader", description: "Download YouTube videos in multiple formats", category: "video-audio-download", tags: ["youtube", "video", "download"], status: "coming-soon" },
  { slug: "youtube-thumbnail", name: "YouTube Thumbnail", description: "Download YouTube video thumbnails", category: "video-audio-download", tags: ["youtube", "thumbnail", "download"], status: "coming-soon" },
  { slug: "instagram-downloader", name: "Instagram Downloader", description: "Download Instagram videos and reels", category: "video-audio-download", tags: ["instagram", "video", "reel", "download"], status: "coming-soon" },
  { slug: "tiktok-downloader", name: "TikTok Downloader", description: "Download TikTok videos without watermark", category: "video-audio-download", tags: ["tiktok", "video", "download", "watermark"], status: "coming-soon" },
  { slug: "facebook-downloader", name: "Facebook Downloader", description: "Download Facebook videos", category: "video-audio-download", tags: ["facebook", "video", "download"], status: "coming-soon" },
  { slug: "twitter-downloader", name: "Twitter/X Downloader", description: "Download Twitter/X videos", category: "video-audio-download", tags: ["twitter", "x", "video", "download"], status: "coming-soon" },
  { slug: "reddit-downloader", name: "Reddit Downloader", description: "Download Reddit videos", category: "video-audio-download", tags: ["reddit", "video", "download"], status: "coming-soon" },
  { slug: "pinterest-downloader", name: "Pinterest Downloader", description: "Download Pinterest videos", category: "video-audio-download", tags: ["pinterest", "video", "download"], status: "coming-soon" },
  { slug: "dailymotion-downloader", name: "Dailymotion / Vimeo", description: "Download Dailymotion and Vimeo videos", category: "video-audio-download", tags: ["dailymotion", "vimeo", "video", "download"], status: "coming-soon" },

  // ─── Video Editing Tools ──────────────────────────────────────
  { slug: "video-to-mp3", name: "Video to MP3", description: "Extract audio from any video file", category: "video-editing", tags: ["video", "mp3", "audio", "extract"], status: "coming-soon" },
  { slug: "video-compressor", name: "Video Compressor", description: "Compress videos to reduce file size", category: "video-editing", tags: ["video", "compress", "size"], status: "coming-soon" },
  { slug: "video-format-converter", name: "Video Format Converter", description: "Convert videos between MP4, MKV, AVI formats", category: "video-editing", tags: ["video", "format", "convert", "mp4"], status: "coming-soon" },
  { slug: "video-trimmer", name: "Video Trimmer", description: "Trim and cut video clips in the browser", category: "video-editing", tags: ["video", "trim", "cut"], status: "coming-soon" },
  { slug: "gif-maker", name: "GIF Maker", description: "Create GIFs from video clips", category: "video-editing", tags: ["gif", "video", "create"], status: "coming-soon" },
  { slug: "screen-recorder", name: "Screen Recorder", description: "Record your screen in the browser", category: "video-editing", tags: ["screen", "recorder", "capture"], status: "coming-soon" },
  { slug: "video-to-gif", name: "Video to GIF", description: "Convert video files to animated GIFs", category: "video-editing", tags: ["video", "gif", "convert"], status: "coming-soon" },
  { slug: "add-subtitles", name: "Add Subtitles", description: "Add subtitles and captions to videos", category: "video-editing", tags: ["subtitles", "captions", "video"], status: "coming-soon" },

  // ─── Audio & Music Tools ──────────────────────────────────────
  { slug: "bpm-detector", name: "BPM Detector", description: "Detect the tempo (BPM) of any song", category: "audio-music", tags: ["bpm", "tempo", "music", "detect"], status: "coming-soon" },
  { slug: "pitch-speed-changer", name: "Pitch & Speed Changer", description: "Change the pitch and speed of audio", category: "audio-music", tags: ["pitch", "speed", "audio", "change"], status: "coming-soon" },
  { slug: "vocals-remover", name: "Vocals Remover", description: "Remove vocals or split music tracks", category: "audio-music", tags: ["vocals", "remove", "music", "split"], status: "coming-soon" },
  { slug: "audio-waveform", name: "Audio Waveform", description: "Visualize audio waveforms", category: "audio-music", tags: ["audio", "waveform", "visualize"], status: "coming-soon" },
  { slug: "mp3-tag-editor", name: "MP3 Tag Editor", description: "Edit MP3 metadata and ID3 tags", category: "audio-music", tags: ["mp3", "tag", "metadata", "id3"], status: "coming-soon" },
  { slug: "ringtone-maker", name: "Ringtone Maker", description: "Cut and export audio as ringtones", category: "audio-music", tags: ["ringtone", "cut", "audio"], status: "coming-soon" },
  { slug: "audio-trimmer", name: "Audio Trimmer", description: "Trim audio files in the browser", category: "audio-music", tags: ["audio", "trim", "cut"], status: "coming-soon" },
  { slug: "audio-format-converter", name: "Audio Format Converter", description: "Convert between MP3, WAV, FLAC formats", category: "audio-music", tags: ["audio", "format", "convert", "mp3", "wav"], status: "coming-soon" },

  // ─── Text & Writing Tools ──────────────────────────────────────
  { slug: "word-counter", name: "Word & Character Counter", description: "Count words, characters, sentences and paragraphs", category: "text-writing", tags: ["word", "character", "counter", "count"], status: "live" },
  { slug: "case-converter", name: "Case Converter", description: "Convert text between upper, lower, title and other cases", category: "text-writing", tags: ["case", "upper", "lower", "title", "convert"], status: "live" },
  { slug: "text-diff", name: "Text Diff Checker", description: "Compare two texts and see the differences", category: "text-writing", tags: ["diff", "compare", "text", "difference"], status: "coming-soon" },
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder lorem ipsum text", category: "text-writing", tags: ["lorem", "ipsum", "placeholder", "text"], status: "live" },
  { slug: "duplicate-remover", name: "Duplicate Line Remover", description: "Remove duplicate lines from text", category: "text-writing", tags: ["duplicate", "remove", "line", "unique"], status: "live" },
  { slug: "text-to-slug", name: "Text to URL Slug", description: "Convert text to URL-friendly slugs", category: "text-writing", tags: ["slug", "url", "text", "convert"], status: "live" },
  { slug: "fancy-text", name: "Fancy Text Styler", description: "Generate fancy and stylish text fonts", category: "text-writing", tags: ["fancy", "text", "font", "style", "unicode"], status: "coming-soon" },
  { slug: "readability-scorer", name: "Readability Scorer", description: "Check the readability score of your text", category: "text-writing", tags: ["readability", "score", "flesch", "grade"], status: "coming-soon" },
  { slug: "text-sorter", name: "Text Sorter", description: "Sort text lines alphabetically or reverse", category: "text-writing", tags: ["sort", "text", "alphabetical", "reverse"], status: "live" },
  { slug: "find-replace", name: "Find & Replace", description: "Find and replace text with regex support", category: "text-writing", tags: ["find", "replace", "regex", "text"], status: "live" },
  { slug: "line-numbers", name: "Line Number Adder", description: "Add or remove line numbers from text", category: "text-writing", tags: ["line", "number", "add", "remove"], status: "coming-soon" },
  { slug: "whitespace-cleaner", name: "Whitespace Cleaner", description: "Clean up extra whitespace from text", category: "text-writing", tags: ["whitespace", "clean", "space", "trim"], status: "live" },

  // ─── Developer Tools ──────────────────────────────────────────
  { slug: "json-formatter", name: "JSON Formatter", description: "Format and validate JSON data", category: "developer", tags: ["json", "format", "validate", "pretty"], isMostUsed: true, status: "live" },
  { slug: "base64-encoder", name: "Base64 Encoder / Decoder", description: "Encode or decode Base64 strings", category: "developer", tags: ["base64", "encode", "decode"], status: "live" },
  { slug: "html-css-js-minifier", name: "HTML/CSS/JS Minifier", description: "Minify HTML, CSS and JavaScript code", category: "developer", tags: ["minify", "html", "css", "javascript", "compress"], status: "coming-soon" },
  { slug: "html-entity-encoder", name: "HTML Entity Encoder", description: "Encode and decode HTML entities", category: "developer", tags: ["html", "entity", "encode", "decode"], status: "live" },
  { slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions with live matching", category: "developer", tags: ["regex", "regular", "expression", "test", "match"], status: "live" },
  { slug: "markdown-to-html", name: "Markdown to HTML", description: "Convert Markdown to HTML and preview", category: "developer", tags: ["markdown", "html", "convert", "preview"], status: "live" },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate unique UUIDs / GUIDs", category: "developer", tags: ["uuid", "guid", "generate", "unique"], status: "live" },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-256 and other hashes", category: "developer", tags: ["hash", "md5", "sha256", "sha", "generate"], status: "live" },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JWT tokens", category: "developer", tags: ["jwt", "token", "decode", "inspect"], status: "live" },
  { slug: "cron-builder", name: "CRON Expression Builder", description: "Build and understand CRON expressions", category: "developer", tags: ["cron", "expression", "schedule", "builder"], status: "coming-soon" },
  { slug: "api-formatter", name: "API Response Formatter", description: "Format and beautify API responses", category: "developer", tags: ["api", "response", "format", "json"], status: "coming-soon" },
  { slug: "xml-json-converter", name: "XML ↔ JSON Converter", description: "Convert between XML and JSON formats", category: "developer", tags: ["xml", "json", "convert"], status: "coming-soon" },
  { slug: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries", category: "developer", tags: ["sql", "format", "beautify", "query"], status: "coming-soon" },
  { slug: "css-gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients visually", category: "developer", tags: ["css", "gradient", "generator", "color"], status: "coming-soon" },
  { slug: "css-box-shadow", name: "CSS Box Shadow Generator", description: "Generate CSS box shadow code visually", category: "developer", tags: ["css", "shadow", "box", "generator"], status: "coming-soon" },

  // ─── Data & File Tools ──────────────────────────────────────
  { slug: "csv-to-json", name: "CSV to JSON", description: "Convert CSV and Excel files to JSON", category: "data-file", tags: ["csv", "excel", "json", "convert"], status: "live" },
  { slug: "json-to-csv", name: "JSON to CSV", description: "Convert JSON data to CSV or Excel", category: "data-file", tags: ["json", "csv", "excel", "convert"], status: "live" },
  { slug: "file-checksum", name: "File Checksum Verifier", description: "Verify file integrity with checksums", category: "data-file", tags: ["file", "checksum", "hash", "verify", "md5", "sha"], status: "live" },
  { slug: "zip-compressor", name: "ZIP Compressor", description: "Compress files into ZIP archives", category: "data-file", tags: ["zip", "compress", "archive", "file"], status: "coming-soon" },
  { slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert Excel files to PDF documents", category: "data-file", tags: ["excel", "pdf", "convert"], status: "coming-soon" },
  { slug: "csv-viewer", name: "CSV Viewer & Editor", description: "View and edit CSV files in the browser", category: "data-file", tags: ["csv", "viewer", "editor", "table"], status: "coming-soon" },
  { slug: "yaml-json-converter", name: "YAML ↔ JSON Converter", description: "Convert between YAML and JSON formats", category: "data-file", tags: ["yaml", "json", "convert"], status: "live" },

  // ─── Design & Color Tools ──────────────────────────────────
  { slug: "color-palette", name: "Color Palette Generator", description: "Generate harmonious color palettes", category: "design-color", tags: ["color", "palette", "generate", "harmony"], status: "live" },
  { slug: "gradient-generator", name: "Gradient CSS Generator", description: "Create CSS gradients with a visual editor", category: "design-color", tags: ["gradient", "css", "generator", "color"], status: "live" },
  { slug: "hex-rgb-hsl", name: "HEX / RGB / HSL Converter", description: "Convert colors between HEX, RGB and HSL", category: "design-color", tags: ["hex", "rgb", "hsl", "color", "convert"], status: "live" },
  { slug: "contrast-checker", name: "Contrast Ratio Checker", description: "Check WCAG contrast ratios for accessibility", category: "design-color", tags: ["contrast", "wcag", "accessibility", "ratio"], status: "live" },
  { slug: "favicon-generator", name: "Favicon Generator", description: "Generate favicons from images or text", category: "design-color", tags: ["favicon", "icon", "generator"], status: "coming-soon" },
  { slug: "border-radius-generator", name: "Border Radius Generator", description: "Generate CSS border radius visually", category: "design-color", tags: ["border", "radius", "css", "generator"], status: "live" },
  { slug: "font-pairing", name: "Font Pairing Suggester", description: "Get font pairing suggestions for your designs", category: "design-color", tags: ["font", "pairing", "typography", "suggest"], status: "coming-soon" },
  { slug: "svg-optimizer", name: "SVG Optimizer", description: "Optimize and minify SVG files", category: "design-color", tags: ["svg", "optimize", "minify"], status: "coming-soon" },
  { slug: "placeholder-image", name: "Placeholder Image Generator", description: "Generate placeholder images with custom sizes", category: "design-color", tags: ["placeholder", "image", "generator"], status: "coming-soon" },
  { slug: "device-mockup", name: "Device Frame Mockup", description: "Place screenshots in device frame mockups", category: "design-color", tags: ["device", "mockup", "frame", "screenshot"], status: "coming-soon" },
  { slug: "app-screenshot", name: "App Store Screenshot", description: "Generate app store screenshots", category: "design-color", tags: ["app", "store", "screenshot", "generator"], status: "coming-soon" },

  // ─── Security & Privacy Tools ──────────────────────────────
  { slug: "password-generator", name: "Password Generator", description: "Generate strong, secure passwords", category: "security-privacy", tags: ["password", "generate", "secure", "strong"], isMostUsed: true, status: "live" },
  { slug: "password-strength", name: "Password Strength Checker", description: "Check how strong your password is", category: "security-privacy", tags: ["password", "strength", "check", "security"], status: "live" },
  { slug: "text-encryptor", name: "Text Encryptor", description: "Encrypt and decrypt text with AES", category: "security-privacy", tags: ["encrypt", "decrypt", "text", "aes", "security"], status: "live" },
  { slug: "ip-lookup", name: "IP Address Lookup", description: "Look up information about any IP address", category: "security-privacy", tags: ["ip", "address", "lookup", "location"], status: "coming-soon" },
  { slug: "fake-data-generator", name: "Fake Data Generator", description: "Generate fake identity and data for testing", category: "security-privacy", tags: ["fake", "data", "identity", "generator", "test"], status: "live" },
  { slug: "email-leak-checker", name: "Email Leak Checker", description: "Check if your email has been in a data breach", category: "security-privacy", tags: ["email", "leak", "breach", "check"], status: "coming-soon" },
  { slug: "temp-email", name: "Temporary Email", description: "Get a disposable temporary email address", category: "security-privacy", tags: ["temp", "email", "disposable", "temporary"], status: "coming-soon" },

  // ─── Network & Web Diagnostic ──────────────────────────────
  { slug: "dns-lookup", name: "DNS Lookup", description: "Look up DNS records for any domain", category: "network-web", tags: ["dns", "lookup", "domain", "record"], status: "coming-soon" },
  { slug: "whois-lookup", name: "WHOIS Lookup", description: "Look up WHOIS information for domains", category: "network-web", tags: ["whois", "domain", "lookup", "registration"], status: "coming-soon" },
  { slug: "ssl-checker", name: "SSL Certificate Checker", description: "Check SSL certificate details and validity", category: "network-web", tags: ["ssl", "certificate", "check", "https"], status: "coming-soon" },
  { slug: "http-headers", name: "HTTP Header Checker", description: "View HTTP headers for any URL", category: "network-web", tags: ["http", "header", "check", "response"], status: "coming-soon" },
  { slug: "port-scanner", name: "Port Scanner", description: "Scan open ports on any domain", category: "network-web", tags: ["port", "scan", "network", "security"], status: "coming-soon" },
  { slug: "uptime-monitor", name: "Uptime Monitor", description: "Monitor website uptime and availability", category: "network-web", tags: ["uptime", "monitor", "website", "availability"], status: "coming-soon" },
  { slug: "ping-traceroute", name: "Ping & Traceroute", description: "Ping and trace route to any host", category: "network-web", tags: ["ping", "traceroute", "network", "latency"], status: "coming-soon" },
  { slug: "speed-test", name: "Internet Speed Test", description: "Test your internet connection speed", category: "network-web", tags: ["speed", "test", "internet", "bandwidth"], status: "coming-soon" },
  { slug: "my-ip", name: "My IP Address", description: "Find your public IP address", category: "network-web", tags: ["ip", "address", "my", "public"], status: "live" },

  // ─── Converters & Calculators ──────────────────────────────
  { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature and more", category: "converters-calculators", tags: ["unit", "convert", "length", "weight", "temperature"], status: "coming-soon" },
  { slug: "currency-converter", name: "Currency Converter", description: "Convert currencies with live exchange rates", category: "converters-calculators", tags: ["currency", "convert", "exchange", "rate"], status: "coming-soon" },
  { slug: "number-base-converter", name: "Number Base Converter", description: "Convert between binary, hex, octal and decimal", category: "converters-calculators", tags: ["binary", "hex", "octal", "decimal", "convert"], status: "live" },
  { slug: "age-calculator", name: "Age Calculator", description: "Calculate your exact age in years, months, days", category: "converters-calculators", tags: ["age", "calculator", "birthday"], status: "live" },
  { slug: "date-difference", name: "Date Difference Calculator", description: "Calculate the difference between two dates", category: "converters-calculators", tags: ["date", "difference", "between", "days"], status: "live" },
  { slug: "timezone-converter", name: "Timezone Converter", description: "Convert times between timezones", category: "converters-calculators", tags: ["timezone", "convert", "time"], status: "coming-soon" },
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate your Body Mass Index", category: "converters-calculators", tags: ["bmi", "body", "mass", "index", "health"], status: "coming-soon" },
  { slug: "calorie-calculator", name: "Calorie Calculator", description: "Calculate daily calorie needs", category: "converters-calculators", tags: ["calorie", "calculator", "diet", "nutrition"], status: "coming-soon" },
  { slug: "roman-numeral", name: "Roman Numeral Converter", description: "Convert between Roman and Arabic numerals", category: "converters-calculators", tags: ["roman", "numeral", "convert"], status: "live" },
  { slug: "fraction-simplifier", name: "Fraction Simplifier", description: "Simplify fractions to their lowest terms", category: "converters-calculators", tags: ["fraction", "simplify", "math"], status: "live" },
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Calculate percentages quickly", category: "converters-calculators", tags: ["percentage", "calculator", "math"], status: "live" },
  { slug: "scientific-calculator", name: "Scientific Calculator", description: "Full-featured scientific calculator", category: "converters-calculators", tags: ["scientific", "calculator", "math", "advanced"], status: "coming-soon" },
  { slug: "statistics-calculator", name: "Statistics Calculator", description: "Calculate mean, median, mode and standard deviation", category: "converters-calculators", tags: ["statistics", "mean", "median", "mode", "std"], status: "coming-soon" },

  // ─── Finance & Business ──────────────────────────────────────
  { slug: "gst-calculator", name: "GST / VAT Calculator", description: "Calculate GST or VAT for any amount", category: "finance-business", tags: ["gst", "vat", "tax", "calculator"], status: "live" },
  { slug: "emi-calculator", name: "EMI / Loan Calculator", description: "Calculate EMI for loans and mortgages", category: "finance-business", tags: ["emi", "loan", "mortgage", "calculator"], status: "live" },
  { slug: "invoice-generator", name: "Invoice Generator", description: "Create professional invoices with PDF export", category: "finance-business", tags: ["invoice", "generator", "pdf", "business"], status: "coming-soon" },
  { slug: "tip-calculator", name: "Tip Calculator", description: "Calculate tips and split bills", category: "finance-business", tags: ["tip", "calculator", "bill", "split"], status: "live" },
  { slug: "discount-calculator", name: "Discount Calculator", description: "Calculate discounts and profit margins", category: "finance-business", tags: ["discount", "profit", "margin", "calculator"], status: "live" },
  { slug: "sip-calculator", name: "SIP Calculator", description: "Calculate SIP and mutual fund returns", category: "finance-business", tags: ["sip", "mutual", "fund", "returns", "investment"], status: "live" },
  { slug: "fd-calculator", name: "FD / RD Calculator", description: "Calculate fixed and recurring deposit interest", category: "finance-business", tags: ["fd", "rd", "interest", "deposit", "calculator"], status: "live" },
  { slug: "salary-calculator", name: "Salary Calculator", description: "Calculate take-home pay after deductions", category: "finance-business", tags: ["salary", "take-home", "pay", "calculator"], status: "live" },
  { slug: "net-worth-calculator", name: "Net Worth Calculator", description: "Calculate your total net worth", category: "finance-business", tags: ["net", "worth", "calculator", "finance"], status: "coming-soon" },
  { slug: "budget-planner", name: "Budget Planner", description: "Plan your monthly budget", category: "finance-business", tags: ["budget", "planner", "monthly", "finance"], status: "coming-soon" },
  { slug: "expense-splitter", name: "Expense Splitter", description: "Split expenses between friends", category: "finance-business", tags: ["expense", "split", "friends", "share"], status: "coming-soon" },
  { slug: "roas-calculator", name: "ROAS / ROI Calculator", description: "Calculate return on ad spend and investment", category: "finance-business", tags: ["roas", "roi", "return", "calculator"], status: "coming-soon" },

  // ─── SEO & Web Tools ──────────────────────────────────────
  { slug: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO-friendly meta tags", category: "seo-web", tags: ["meta", "tag", "seo", "generator"], status: "live" },
  { slug: "robots-txt-generator", name: "Robots.txt Generator", description: "Generate robots.txt files for your website", category: "seo-web", tags: ["robots", "txt", "seo", "crawler"], status: "live" },
  { slug: "sitemap-generator", name: "Sitemap Generator", description: "Generate XML sitemaps for your website", category: "seo-web", tags: ["sitemap", "xml", "seo", "generator"], status: "coming-soon" },
  { slug: "domain-age-checker", name: "Domain Age Checker", description: "Check the age of any domain", category: "seo-web", tags: ["domain", "age", "check"], status: "coming-soon" },
  { slug: "website-screenshot", name: "Website Screenshot", description: "Take screenshots of any website", category: "seo-web", tags: ["website", "screenshot", "capture"], status: "coming-soon" },
  { slug: "keyword-density", name: "Keyword Density Checker", description: "Check keyword density of your content", category: "seo-web", tags: ["keyword", "density", "seo", "content"], status: "live" },
  { slug: "page-speed-tester", name: "Page Speed Tester", description: "Test your website page speed", category: "seo-web", tags: ["page", "speed", "test", "performance"], status: "coming-soon" },
  { slug: "backlink-checker", name: "Backlink Checker", description: "Check backlinks for any domain", category: "seo-web", tags: ["backlink", "check", "seo", "link"], status: "coming-soon" },
  { slug: "schema-markup-generator", name: "Schema Markup Generator", description: "Generate schema markup for structured data", category: "seo-web", tags: ["schema", "markup", "structured", "data", "seo"], status: "coming-soon" },

  // ─── Social Media Tools ──────────────────────────────────────
  { slug: "hashtag-generator", name: "Hashtag Generator", description: "Generate relevant hashtags for your posts", category: "social-media", tags: ["hashtag", "social", "media", "generate"], status: "live" },
  { slug: "social-image-resizer", name: "Social Image Resizer", description: "Resize images for all social platforms", category: "social-media", tags: ["social", "image", "resize", "platform"], status: "coming-soon" },
  { slug: "bio-link-builder", name: "Bio Link Builder", description: "Build a Linktree-style bio link page", category: "social-media", tags: ["bio", "link", "linktree", "builder"], status: "coming-soon" },
  { slug: "twitter-counter", name: "Twitter Character Counter", description: "Count characters for Twitter/X posts", category: "social-media", tags: ["twitter", "character", "counter", "x"], status: "live" },
  { slug: "instagram-formatter", name: "Instagram Caption Formatter", description: "Format Instagram captions with line breaks", category: "social-media", tags: ["instagram", "caption", "format", "line break"], status: "live" },
  { slug: "thread-reader", name: "Thread Reader", description: "Read and export Twitter/X threads", category: "social-media", tags: ["twitter", "thread", "reader", "export"], status: "coming-soon" },
  { slug: "youtube-tester", name: "YouTube Title Tester", description: "Test YouTube titles and thumbnails", category: "social-media", tags: ["youtube", "title", "thumbnail", "test"], status: "live" },
  { slug: "emoji-picker", name: "Emoji Picker", description: "Pick and combine emojis easily", category: "social-media", tags: ["emoji", "picker", "combine"], status: "live" },
  { slug: "post-preview", name: "Post Schedule Preview", description: "Preview how your posts will look", category: "social-media", tags: ["post", "schedule", "preview", "social"], status: "coming-soon" },

  // ─── Email Tools ──────────────────────────────────────────
  { slug: "disposable-email", name: "Disposable Email", description: "Get a temporary disposable email address", category: "email", tags: ["disposable", "email", "temporary"], status: "coming-soon" },
  { slug: "spam-scorer", name: "Email Spam Scorer", description: "Check if your email subject line triggers spam", category: "email", tags: ["email", "spam", "score", "subject"], status: "coming-soon" },
  { slug: "email-builder", name: "HTML Email Builder", description: "Build and preview HTML email templates", category: "email", tags: ["email", "html", "builder", "template"], status: "coming-soon" },
  { slug: "email-header-analyzer", name: "Email Header Analyzer", description: "Analyze email headers for debugging", category: "email", tags: ["email", "header", "analyze", "debug"], status: "coming-soon" },
  { slug: "email-validator", name: "Bulk Email Validator", description: "Validate email addresses in bulk", category: "email", tags: ["email", "validate", "bulk", "check"], status: "coming-soon" },
  { slug: "email-signature", name: "Email Signature Generator", description: "Create professional email signatures", category: "email", tags: ["email", "signature", "generator", "professional"], status: "coming-soon" },
  { slug: "auto-reply-template", name: "Auto-Reply Template", description: "Create auto-reply email templates", category: "email", tags: ["auto-reply", "email", "template"], status: "coming-soon" },

  // ─── AI & Content Tools ──────────────────────────────────────
  { slug: "ai-text-detector", name: "AI Text Detector", description: "Detect AI-generated text", category: "ai-content", tags: ["ai", "text", "detector", "chatgpt"], isTrending: true, status: "coming-soon" },
  { slug: "ai-image-detector", name: "AI Image Detector", description: "Detect AI-generated images", category: "ai-content", tags: ["ai", "image", "detector", "deepfake"], isTrending: true, status: "coming-soon" },
  { slug: "plagiarism-checker", name: "Plagiarism Checker", description: "Check content for plagiarism", category: "ai-content", tags: ["plagiarism", "check", "content", "copy"], status: "coming-soon" },
  { slug: "ai-humanizer", name: "AI Writing Humanizer", description: "Make AI-written text sound more human", category: "ai-content", tags: ["ai", "humanizer", "rewrite", "natural"], isTrending: true, status: "coming-soon" },
  { slug: "prompt-builder", name: "Prompt Builder", description: "Build and optimize AI prompts", category: "ai-content", tags: ["prompt", "builder", "ai", "chatgpt", "optimize"], status: "coming-soon" },
  { slug: "article-summarizer", name: "Article Summarizer", description: "Summarize articles and URLs", category: "ai-content", tags: ["article", "summarize", "url", "content"], status: "coming-soon" },
  { slug: "paraphrasing-tool", name: "Paraphrasing Tool", description: "Paraphrase and rewrite text", category: "ai-content", tags: ["paraphrase", "rewrite", "text"], status: "coming-soon" },
  { slug: "grammar-checker", name: "Grammar Checker", description: "Check grammar and spelling", category: "ai-content", tags: ["grammar", "spell", "check", "writing"], status: "coming-soon" },

  // ─── Document & Legal ──────────────────────────────────────
  { slug: "privacy-policy", name: "Privacy Policy Generator", description: "Generate a privacy policy for your website", category: "document-legal", tags: ["privacy", "policy", "generator", "legal"], status: "coming-soon" },
  { slug: "terms-conditions", name: "Terms & Conditions Generator", description: "Generate terms and conditions", category: "document-legal", tags: ["terms", "conditions", "generator", "legal"], status: "coming-soon" },
  { slug: "esignature", name: "Digital E-Signature", description: "Create digital signatures for documents", category: "document-legal", tags: ["signature", "digital", "esign", "document"], status: "coming-soon" },
  { slug: "resume-builder", name: "Resume / CV Builder", description: "Build a professional resume with PDF export", category: "document-legal", tags: ["resume", "cv", "builder", "pdf", "career"], status: "coming-soon" },
  { slug: "cover-letter", name: "Cover Letter Generator", description: "Generate cover letters for job applications", category: "document-legal", tags: ["cover", "letter", "generator", "job"], status: "coming-soon" },
  { slug: "nda-template", name: "NDA / Contract Template", description: "Fill NDA and contract templates", category: "document-legal", tags: ["nda", "contract", "template", "legal"], status: "coming-soon" },
  { slug: "affidavit-format", name: "Affidavit Format Generator", description: "Generate affidavit format documents", category: "document-legal", tags: ["affidavit", "format", "legal", "document"], status: "coming-soon" },
  { slug: "business-letter", name: "Business Letter Template", description: "Create business letter templates", category: "document-legal", tags: ["business", "letter", "template", "formal"], status: "coming-soon" },

  // ─── Student & Education ──────────────────────────────────
  { slug: "citation-generator", name: "Citation Generator", description: "Generate citations in APA, MLA, Chicago formats", category: "student-education", tags: ["citation", "apa", "mla", "chicago", "reference"], status: "coming-soon" },
  { slug: "bibliography-maker", name: "Bibliography Maker", description: "Create formatted bibliographies", category: "student-education", tags: ["bibliography", "reference", "academic"], status: "coming-soon" },
  { slug: "gpa-calculator", name: "GPA Calculator", description: "Calculate your grade point average", category: "student-education", tags: ["gpa", "grade", "calculator", "academic"], status: "live" },
  { slug: "pomodoro-timer", name: "Pomodoro Timer", description: "Study timer with pomodoro technique and stats", category: "student-education", tags: ["pomodoro", "timer", "study", "focus"], status: "live" },
  { slug: "flashcard-maker", name: "Flashcard & Quiz Maker", description: "Create flashcards and quizzes for studying", category: "student-education", tags: ["flashcard", "quiz", "study", "learn"], status: "coming-soon" },
  { slug: "deadline-tracker", name: "Assignment Deadline Tracker", description: "Track assignment deadlines and due dates", category: "student-education", tags: ["assignment", "deadline", "tracker", "due date"], status: "coming-soon" },
  { slug: "essay-word-count", name: "Essay Word Count", description: "Count words in essays with formatting info", category: "student-education", tags: ["essay", "word", "count", "writing"], status: "coming-soon" },
  { slug: "periodic-table", name: "Periodic Table Reference", description: "Interactive periodic table of elements", category: "student-education", tags: ["periodic", "table", "elements", "chemistry"], status: "coming-soon" },
  { slug: "multiplication-table", name: "Multiplication Table", description: "Generate multiplication tables", category: "student-education", tags: ["multiplication", "table", "math"], status: "coming-soon" },

  // ─── Maps & Location ──────────────────────────────────────
  { slug: "distance-calculator", name: "Distance Calculator", description: "Calculate distance between two places", category: "maps-location", tags: ["distance", "places", "calculator", "map"], status: "coming-soon" },
  { slug: "lat-long-finder", name: "Lat / Long Finder", description: "Find latitude and longitude for any location", category: "maps-location", tags: ["latitude", "longitude", "coordinates", "finder"], status: "coming-soon" },
  { slug: "pincode-lookup", name: "Pincode / ZIP Lookup", description: "Look up pincode and ZIP code information", category: "maps-location", tags: ["pincode", "zip", "code", "lookup"], status: "coming-soon" },
  { slug: "calling-code", name: "Country Calling Code", description: "Find ISD and calling codes for any country", category: "maps-location", tags: ["calling", "code", "isd", "country", "phone"], status: "coming-soon" },
  { slug: "nearest-city", name: "Nearest City Finder", description: "Find the nearest city to any location", category: "maps-location", tags: ["nearest", "city", "finder", "location"], status: "coming-soon" },
  { slug: "area-code-directory", name: "Area Code Directory", description: "Look up area codes for phone numbers", category: "maps-location", tags: ["area", "code", "directory", "phone"], status: "coming-soon" },
  { slug: "location-timezone", name: "Location Timezone", description: "Find the timezone for any location", category: "maps-location", tags: ["location", "timezone", "time"], status: "coming-soon" },

  // ─── Health & Fitness ──────────────────────────────────────
  { slug: "bmi-ideal-weight", name: "BMI & Ideal Weight", description: "Calculate BMI and ideal weight range", category: "health-fitness", tags: ["bmi", "ideal", "weight", "health"], status: "live" },
  { slug: "body-fat", name: "Body Fat Estimator", description: "Estimate your body fat percentage", category: "health-fitness", tags: ["body", "fat", "percentage", "estimate"], status: "live" },
  { slug: "one-rep-max", name: "One Rep Max Calculator", description: "Calculate your one rep max for weightlifting", category: "health-fitness", tags: ["one rep max", "1rm", "weightlifting", "strength"], status: "live" },
  { slug: "running-pace", name: "Running Pace Calculator", description: "Calculate running pace and speed", category: "health-fitness", tags: ["running", "pace", "speed", "calculator"], status: "live" },
  { slug: "steps-converter", name: "Steps to Calories", description: "Convert steps to calories and distance", category: "health-fitness", tags: ["steps", "calories", "distance", "converter"], status: "coming-soon" },
  { slug: "water-intake", name: "Water Intake Calculator", description: "Calculate daily water intake recommendations", category: "health-fitness", tags: ["water", "intake", "hydration", "calculator"], status: "live" },
  { slug: "sleep-schedule", name: "Sleep Schedule Optimizer", description: "Optimize your sleep schedule", category: "health-fitness", tags: ["sleep", "schedule", "optimizer", "health"], status: "coming-soon" },
  { slug: "macro-calculator", name: "Macro Calculator", description: "Calculate daily macronutrient needs", category: "health-fitness", tags: ["macro", "nutrition", "protein", "carbs", "fat"], status: "coming-soon" },
  { slug: "period-tracker", name: "Period Tracker", description: "Track period and ovulation cycles", category: "health-fitness", tags: ["period", "ovulation", "cycle", "tracker"], status: "coming-soon" },
  { slug: "pill-reminder", name: "Medicine Reminder", description: "Generate medicine and pill reminders", category: "health-fitness", tags: ["medicine", "pill", "reminder", "health"], status: "coming-soon" },
  { slug: "habit-tracker", name: "Habit Tracker", description: "Track daily habits with check-ins", category: "health-fitness", tags: ["habit", "tracker", "daily", "checkin"], status: "coming-soon" },

  // ─── Astrology & Religious ──────────────────────────────────
  { slug: "panchang", name: "Panchang Calendar", description: "Hindu daily panchang and calendar", category: "astrology-religious", tags: ["panchang", "hindu", "calendar", "daily"], status: "coming-soon" },
  { slug: "rahu-kaal", name: "Rahu Kaal Calculator", description: "Calculate Rahu Kaal and auspicious times", category: "astrology-religious", tags: ["rahu", "kaal", "auspicious", "time"], status: "coming-soon" },
  { slug: "moon-phase", name: "Moon Phase Tracker", description: "Track current and future moon phases", category: "astrology-religious", tags: ["moon", "phase", "lunar", "tracker"], status: "coming-soon" },
  { slug: "prayer-time", name: "Namaz / Prayer Time", description: "Prayer times by city and location", category: "astrology-religious", tags: ["namaz", "prayer", "time", "islam"], status: "coming-soon" },
  { slug: "kundli", name: "Kundli Generator", description: "Generate Kundli and birth charts", category: "astrology-religious", tags: ["kundli", "birth", "chart", "astrology"], status: "coming-soon" },
  { slug: "festival-calendar", name: "Festival Calendar", description: "Festival and vrat calendar year-wise", category: "astrology-religious", tags: ["festival", "vrat", "calendar", "religious"], status: "coming-soon" },
  { slug: "nakshatra-finder", name: "Nakshatra Finder", description: "Find your birth nakshatra", category: "astrology-religious", tags: ["nakshatra", "birth", "astrology", "star"], status: "coming-soon" },

  // ─── Parenting & Family ──────────────────────────────────────
  { slug: "baby-name-finder", name: "Baby Name Finder", description: "Find baby names with meanings", category: "parenting-family", tags: ["baby", "name", "meaning", "finder"], status: "coming-soon" },
  { slug: "pregnancy-calculator", name: "Pregnancy Week Calculator", description: "Calculate pregnancy week and due date", category: "parenting-family", tags: ["pregnancy", "week", "due date", "calculator"], status: "coming-soon" },
  { slug: "child-growth", name: "Child Growth Predictor", description: "Predict child height and growth", category: "parenting-family", tags: ["child", "growth", "height", "predictor"], status: "coming-soon" },
  { slug: "chore-chart", name: "Chore Chart Generator", description: "Generate chore and reward charts", category: "parenting-family", tags: ["chore", "chart", "reward", "kids"], status: "coming-soon" },
  { slug: "screen-time", name: "Screen Time Calculator", description: "Calculate recommended screen time for kids", category: "parenting-family", tags: ["screen", "time", "kids", "calculator"], status: "coming-soon" },
  { slug: "school-fee-tracker", name: "School Fee Tracker", description: "Track school fees and payments", category: "parenting-family", tags: ["school", "fee", "tracker", "payment"], status: "coming-soon" },
  { slug: "age-activity-finder", name: "Activity Finder", description: "Find age-appropriate activities for kids", category: "parenting-family", tags: ["activity", "kids", "age", "finder"], status: "coming-soon" },

  // ─── Travel & Commute ──────────────────────────────────────
  { slug: "fuel-calculator", name: "Fuel Cost Calculator", description: "Calculate fuel costs for your trip", category: "travel-commute", tags: ["fuel", "cost", "trip", "calculator"], status: "live" },
  { slug: "speed-distance-time", name: "Speed / Distance / Time", description: "Calculate speed, distance, or time", category: "travel-commute", tags: ["speed", "distance", "time", "calculator"], status: "live" },
  { slug: "pnr-status", name: "Train PNR Status", description: "Check train PNR status (India)", category: "travel-commute", tags: ["pnr", "train", "status", "india", "railway"], status: "coming-soon" },
  { slug: "flight-time", name: "Flight Time Calculator", description: "Calculate flight time between cities", category: "travel-commute", tags: ["flight", "time", "calculator", "travel"], status: "coming-soon" },
  { slug: "visa-checker", name: "Visa Requirement Checker", description: "Check visa requirements by passport", category: "travel-commute", tags: ["visa", "requirement", "passport", "travel"], status: "coming-soon" },
  { slug: "packing-list", name: "Packing List Generator", description: "Generate packing lists by destination", category: "travel-commute", tags: ["packing", "list", "travel", "destination"], status: "coming-soon" },
  { slug: "hotel-cost", name: "Hotel Cost Calculator", description: "Calculate hotel costs per night", category: "travel-commute", tags: ["hotel", "cost", "night", "calculator"], status: "coming-soon" },

  // ─── Food & Cooking ──────────────────────────────────────
  { slug: "recipe-converter", name: "Recipe Unit Converter", description: "Convert recipe units (cups, grams, etc.)", category: "food-cooking", tags: ["recipe", "unit", "converter", "cooking"], status: "live" },
  { slug: "cooking-timer", name: "Multiple Cooking Timer", description: "Set multiple timers for cooking", category: "food-cooking", tags: ["cooking", "timer", "multiple", "kitchen"], status: "live" },
  { slug: "nutrition-calculator", name: "Nutrition Calculator", description: "Calculate calories and nutrition", category: "food-cooking", tags: ["nutrition", "calorie", "calculator", "food"], status: "coming-soon" },
  { slug: "meal-planner", name: "Weekly Meal Planner", description: "Plan your weekly meals", category: "food-cooking", tags: ["meal", "planner", "weekly", "food"], status: "coming-soon" },
  { slug: "ingredient-substitution", name: "Ingredient Substitution", description: "Find ingredient substitutions", category: "food-cooking", tags: ["ingredient", "substitution", "alternative", "cooking"], status: "coming-soon" },
  { slug: "food-expiry", name: "Food Expiry Tracker", description: "Track food expiry dates", category: "food-cooking", tags: ["food", "expiry", "date", "tracker"], status: "coming-soon" },
  { slug: "recipe-scaler", name: "Recipe Scaler", description: "Scale recipes up or down", category: "food-cooking", tags: ["recipe", "scale", "servings", "cooking"], status: "coming-soon" },

  // ─── Shopping & Deals ──────────────────────────────────────
  { slug: "coupon-finder", name: "Coupon Code Finder", description: "Find coupon codes by store", category: "shopping-deals", tags: ["coupon", "code", "finder", "discount"], status: "coming-soon" },
  { slug: "package-tracker", name: "Package Tracker", description: "Track shipments across multiple carriers", category: "shopping-deals", tags: ["package", "tracker", "shipment", "delivery"], status: "coming-soon" },
  { slug: "emi-eligibility", name: "EMI Eligibility Checker", description: "Check EMI eligibility for purchases", category: "shopping-deals", tags: ["emi", "eligibility", "check", "finance"], status: "coming-soon" },
  { slug: "price-drop-alert", name: "Price Drop Alert", description: "Get notified when prices drop", category: "shopping-deals", tags: ["price", "drop", "alert", "deal"], status: "coming-soon" },
  { slug: "review-summarizer", name: "Review Summarizer", description: "Summarize product reviews", category: "shopping-deals", tags: ["review", "summarizer", "product"], status: "coming-soon" },
  { slug: "sale-calculator", name: "Sale Price Calculator", description: "Calculate discount and sale prices", category: "shopping-deals", tags: ["sale", "price", "discount", "calculator"], status: "live" },
  { slug: "barcode-scanner", name: "Barcode Scanner", description: "Scan barcodes and QR codes", category: "shopping-deals", tags: ["barcode", "qr", "scanner", "scan"], status: "coming-soon" },

  // ─── E-commerce & Seller ──────────────────────────────────
  { slug: "product-description", name: "Product Description Generator", description: "Generate product descriptions", category: "ecommerce-seller", tags: ["product", "description", "generator", "ecommerce"], status: "coming-soon" },
  { slug: "listing-optimizer", name: "Listing Optimizer", description: "Optimize Amazon/Flipkart listings", category: "ecommerce-seller", tags: ["listing", "optimizer", "amazon", "flipkart"], status: "coming-soon" },
  { slug: "shipping-estimator", name: "Shipping Cost Estimator", description: "Estimate shipping costs", category: "ecommerce-seller", tags: ["shipping", "cost", "estimator", "delivery"], status: "coming-soon" },
  { slug: "seller-roas", name: "Seller ROAS Calculator", description: "Calculate ROAS and profit margins for sellers", category: "ecommerce-seller", tags: ["roas", "profit", "margin", "calculator", "seller"], status: "coming-soon" },
  { slug: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes for products", category: "ecommerce-seller", tags: ["barcode", "generator", "product"], status: "live" },
  { slug: "receipt-generator", name: "Receipt Generator", description: "Generate invoices and receipts", category: "ecommerce-seller", tags: ["receipt", "invoice", "generator"], status: "coming-soon" },
  { slug: "store-name-generator", name: "Store Name Generator", description: "Generate store names and slogans", category: "ecommerce-seller", tags: ["store", "name", "slogan", "generator"], status: "coming-soon" },

  // ─── Mobile & App Tools ──────────────────────────────────────
  { slug: "apk-downloader", name: "APK Downloader", description: "Download APK files for Android apps", category: "mobile-app", tags: ["apk", "download", "android", "app"], status: "coming-soon" },
  { slug: "deep-link-generator", name: "Deep Link Generator", description: "Generate and test deep links", category: "mobile-app", tags: ["deep", "link", "generator", "mobile"], status: "coming-soon" },
  { slug: "push-notification-preview", name: "Push Notification Preview", description: "Preview push notifications", category: "mobile-app", tags: ["push", "notification", "preview", "mobile"], status: "coming-soon" },
  { slug: "responsive-tester", name: "Responsive Tester", description: "Test website responsiveness on mobile", category: "mobile-app", tags: ["responsive", "tester", "mobile", "viewport"], status: "coming-soon" },
  { slug: "app-icon-resizer", name: "App Icon Resizer", description: "Resize app icons for all platforms", category: "mobile-app", tags: ["app", "icon", "resize", "ios", "android"], status: "coming-soon" },
  { slug: "app-screenshot-maker", name: "App Screenshot Maker", description: "Create app store screenshots", category: "mobile-app", tags: ["app", "screenshot", "store", "maker"], status: "coming-soon" },

  // ─── Fun & Viral Tools ──────────────────────────────────────
  { slug: "username-generator", name: "Username Generator", description: "Generate aesthetic usernames and gamertags", category: "fun-viral", tags: ["username", "gamertag", "generator", "aesthetic"], isTrending: true, status: "coming-soon" },
  { slug: "roast-compliment", name: "Roast & Compliment Generator", description: "Get AI-powered roasts and compliments", category: "fun-viral", tags: ["roast", "compliment", "ai", "fun"], isTrending: true, status: "coming-soon" },
  { slug: "personality-quiz", name: "Personality Quiz Maker", description: "Create personality quizzes", category: "fun-viral", tags: ["personality", "quiz", "maker", "fun"], status: "coming-soon" },
  { slug: "fake-tweet-maker", name: "Fake Tweet Maker", description: "Create fake tweet and chat screenshots", category: "fun-viral", tags: ["fake", "tweet", "chat", "screenshot"], status: "coming-soon" },
  { slug: "tier-list-maker", name: "Tier List Maker", description: "Create custom tier lists", category: "fun-viral", tags: ["tier", "list", "maker", "ranking"], status: "coming-soon" },
  { slug: "random-picker", name: "Random Picker / Wheel", description: "Spin a wheel or pick randomly", category: "fun-viral", tags: ["random", "picker", "wheel", "spinner"], status: "live" },
  { slug: "would-you-rather", name: "Would You Rather", description: "Generate 'would you rather' questions", category: "fun-viral", tags: ["would", "you", "rather", "game", "fun"], status: "coming-soon" },
  { slug: "truth-or-dare", name: "Truth or Dare", description: "Generate truth or dare questions", category: "fun-viral", tags: ["truth", "dare", "game", "fun"], status: "live" },
  { slug: "name-meaning", name: "Name Meaning Lookup", description: "Look up name meanings and origins", category: "fun-viral", tags: ["name", "meaning", "origin", "lookup"], status: "coming-soon" },

  // ─── Language & Translation ──────────────────────────────────
  { slug: "text-translator", name: "Text Translator", description: "Translate text between languages", category: "language-translation", tags: ["translate", "language", "text"], status: "coming-soon" },
  { slug: "language-detector", name: "Language Detector", description: "Detect the language of text", category: "language-translation", tags: ["language", "detect", "identify"], status: "coming-soon" },
  { slug: "morse-code", name: "Morse Code Converter", description: "Encode and decode Morse code", category: "language-translation", tags: ["morse", "code", "encode", "decode"], status: "live" },
  { slug: "braille-converter", name: "Braille Converter", description: "Convert text to Braille", category: "language-translation", tags: ["braille", "convert", "accessibility"], status: "live" },
  { slug: "emoji-to-text", name: "Emoji to Text", description: "Convert emojis to text descriptions", category: "language-translation", tags: ["emoji", "text", "convert"], status: "coming-soon" },
  { slug: "text-to-speech", name: "Text to Speech", description: "Convert text to speech online", category: "language-translation", tags: ["tts", "text", "speech", "audio"], status: "live" },
  { slug: "phonetic-alphabet", name: "Phonetic Alphabet", description: "Convert text to NATO phonetic alphabet", category: "language-translation", tags: ["phonetic", "nato", "alphabet", "convert"], status: "coming-soon" },

  // ─── General Productivity ──────────────────────────────────
  { slug: "online-notepad", name: "Online Notepad", description: "Simple online notepad and scratchpad", category: "general-productivity", tags: ["notepad", "notes", "scratchpad", "text"], status: "live" },
  { slug: "screen-resolution", name: "Screen Resolution Checker", description: "Check your screen resolution", category: "general-productivity", tags: ["screen", "resolution", "display", "checker"], status: "coming-soon" },
  { slug: "browser-info", name: "Browser Info Detector", description: "View your browser information", category: "general-productivity", tags: ["browser", "info", "detector", "user-agent"], status: "coming-soon" },
  { slug: "clipboard-manager", name: "Clipboard Manager", description: "Temporary clipboard manager", category: "general-productivity", tags: ["clipboard", "manager", "copy", "paste"], status: "coming-soon" },
  { slug: "focus-mode", name: "Focus Mode", description: "Focus mode with ambient sounds", category: "general-productivity", tags: ["focus", "ambient", "sound", "productivity"], status: "coming-soon" },
  { slug: "decision-maker", name: "Random Decision Maker", description: "Help make random decisions", category: "general-productivity", tags: ["decision", "random", "maker", "choice"], status: "coming-soon" },
  { slug: "meeting-agenda", name: "Meeting Agenda Builder", description: "Build meeting agendas quickly", category: "general-productivity", tags: ["meeting", "agenda", "builder", "productivity"], status: "coming-soon" },
  { slug: "read-it-later", name: "Read It Later", description: "Save articles to read later (no login)", category: "general-productivity", tags: ["read", "later", "save", "article", "bookmark"], status: "coming-soon" },
];

// ─── Helper Functions ──────────────────────────────────────────

export function getToolsByCategory(category: CategorySlug): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getToolBySlug(categorySlug: string, toolSlug: string): Tool | undefined {
  return tools.find((t) => t.category === categorySlug && t.slug === toolSlug);
}

export function getTrendingTools(): Tool[] {
  return tools.filter((t) => t.isTrending);
}

export function getMostUsedTools(): Tool[] {
  return tools.filter((t) => t.isMostUsed);
}

export function getNewTools(): Tool[] {
  return tools.filter((t) => t.isNew);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q))
  );
}
