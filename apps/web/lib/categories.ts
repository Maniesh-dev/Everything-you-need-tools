export type CategorySlug =
  | "clock-time"
  | "weather"
  | "todo-task"
  | "calendar-date"
  | "link-url"
  | "image"
  | "pdf"
  | "video-audio-download"
  | "video-editing"
  | "audio-music"
  | "text-writing"
  | "developer"
  | "data-file"
  | "design-color"
  | "security-privacy"
  | "network-web"
  | "converters-calculators"
  | "finance-business"
  | "seo-web"
  | "social-media"
  | "email"
  | "ai-content"
  | "document-legal"
  | "student-education"
  | "maps-location"
  | "health-fitness"
  | "astrology-religious"
  | "parenting-family"
  | "travel-commute"
  | "food-cooking"
  | "shopping-deals"
  | "ecommerce-seller"
  | "mobile-app"
  | "fun-viral"
  | "language-translation"
  | "general-productivity";

export interface Category {
  slug: CategorySlug;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  tag?: "everyday" | "trending" | "hard to find" | "India demand";
  toolCount: number;
}

export const categories: Category[] = [
  {
    slug: "clock-time",
    name: "Clock & Time Tools",
    emoji: "🕐",
    description: "World clock, stopwatch, countdown, alarms and timezone planning",
    gradient: "from-blue-500 to-cyan-400",
    tag: "everyday",
    toolCount: 7,
  },
  {
    slug: "weather",
    name: "Weather Tools",
    emoji: "🌤️",
    description: "Current weather, forecasts, air quality, UV index and more",
    gradient: "from-sky-400 to-indigo-500",
    tag: "everyday",
    toolCount: 7,
  },
  {
    slug: "todo-task",
    name: "To-Do & Task Tools",
    emoji: "✅",
    description: "Simple to-do lists, planners, kanban boards and checklists",
    gradient: "from-emerald-500 to-teal-400",
    tag: "everyday",
    toolCount: 7,
  },
  {
    slug: "calendar-date",
    name: "Calendar & Date Tools",
    emoji: "📅",
    description: "Date calculators, holiday calendars and countdown pages",
    gradient: "from-orange-500 to-amber-400",
    tag: "everyday",
    toolCount: 7,
  },
  {
    slug: "link-url",
    name: "Link & URL Tools",
    emoji: "🔗",
    description: "URL shortener, QR codes, UTM builder and link tools",
    gradient: "from-violet-500 to-purple-400",
    toolCount: 7,
  },
  {
    slug: "image",
    name: "Image Tools",
    emoji: "🖼️",
    description: "Compress, resize, convert, remove backgrounds and more",
    gradient: "from-pink-500 to-rose-400",
    toolCount: 12,
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    emoji: "📄",
    description: "Merge, split, compress, convert and protect PDF files",
    gradient: "from-red-500 to-orange-400",
    toolCount: 9,
  },
  {
    slug: "video-audio-download",
    name: "Video & Audio Download",
    emoji: "🎬",
    description: "Download videos from YouTube, Instagram, TikTok and more",
    gradient: "from-red-600 to-pink-500",
    toolCount: 9,
  },
  {
    slug: "video-editing",
    name: "Video Editing Tools",
    emoji: "✂️",
    description: "Trim, compress, convert videos and create GIFs",
    gradient: "from-fuchsia-500 to-purple-500",
    toolCount: 8,
  },
  {
    slug: "audio-music",
    name: "Audio & Music Tools",
    emoji: "🎵",
    description: "BPM detector, pitch changer, vocals remover and more",
    gradient: "from-green-500 to-emerald-400",
    tag: "hard to find",
    toolCount: 8,
  },
  {
    slug: "text-writing",
    name: "Text & Writing Tools",
    emoji: "📝",
    description: "Word counter, case converter, text diff and formatting tools",
    gradient: "from-amber-500 to-yellow-400",
    toolCount: 12,
  },
  {
    slug: "developer",
    name: "Developer Tools",
    emoji: "💻",
    description: "JSON formatter, Base64, regex tester, hash generator and more",
    gradient: "from-slate-600 to-zinc-500",
    toolCount: 15,
  },
  {
    slug: "data-file",
    name: "Data & File Tools",
    emoji: "📊",
    description: "CSV/JSON converters, ZIP compressor and file utilities",
    gradient: "from-teal-500 to-cyan-400",
    tag: "hard to find",
    toolCount: 7,
  },
  {
    slug: "design-color",
    name: "Design & Color Tools",
    emoji: "🎨",
    description: "Color palettes, gradients, contrast checker and design utilities",
    gradient: "from-rose-500 to-pink-400",
    toolCount: 11,
  },
  {
    slug: "security-privacy",
    name: "Security & Privacy",
    emoji: "🔒",
    description: "Password generator, encryptor, IP lookup and privacy tools",
    gradient: "from-gray-700 to-slate-500",
    toolCount: 7,
  },
  {
    slug: "network-web",
    name: "Network & Web Diagnostic",
    emoji: "🌍",
    description: "DNS lookup, SSL checker, port scanner and web diagnostics",
    gradient: "from-blue-600 to-indigo-500",
    tag: "hard to find",
    toolCount: 9,
  },
  {
    slug: "converters-calculators",
    name: "Converters & Calculators",
    emoji: "🔢",
    description: "Unit, currency, number base converters and scientific calculators",
    gradient: "from-indigo-500 to-blue-400",
    toolCount: 13,
  },
  {
    slug: "finance-business",
    name: "Finance & Business",
    emoji: "💰",
    description: "GST calculator, EMI planner, invoice generator and more",
    gradient: "from-emerald-600 to-green-400",
    toolCount: 12,
  },
  {
    slug: "seo-web",
    name: "SEO & Web Tools",
    emoji: "🔍",
    description: "Meta tag generator, sitemap builder and SEO analysis tools",
    gradient: "from-cyan-500 to-blue-400",
    toolCount: 9,
  },
  {
    slug: "social-media",
    name: "Social Media Tools",
    emoji: "📱",
    description: "Hashtag generator, image resizer and social media utilities",
    gradient: "from-pink-500 to-violet-500",
    toolCount: 9,
  },
  {
    slug: "email",
    name: "Email Tools",
    emoji: "📧",
    description: "Temp email, spam scorer, signature generator and email utilities",
    gradient: "from-blue-500 to-sky-400",
    tag: "hard to find",
    toolCount: 7,
  },
  {
    slug: "ai-content",
    name: "AI & Content Tools",
    emoji: "🤖",
    description: "AI detector, plagiarism checker, humanizer and content tools",
    gradient: "from-purple-600 to-violet-400",
    tag: "trending",
    toolCount: 8,
  },
  {
    slug: "document-legal",
    name: "Document & Legal",
    emoji: "📜",
    description: "Privacy policy generator, resume builder and legal templates",
    gradient: "from-stone-600 to-amber-500",
    tag: "hard to find",
    toolCount: 8,
  },
  {
    slug: "student-education",
    name: "Student & Education",
    emoji: "🎓",
    description: "Citation generator, GPA calculator and study tools",
    gradient: "from-blue-500 to-purple-500",
    tag: "hard to find",
    toolCount: 9,
  },
  {
    slug: "maps-location",
    name: "Maps & Location Tools",
    emoji: "🗺️",
    description: "Distance calculator, coordinates finder and location utilities",
    gradient: "from-green-500 to-teal-400",
    toolCount: 7,
  },
  {
    slug: "health-fitness",
    name: "Health & Fitness",
    emoji: "💪",
    description: "BMI calculator, calorie counter and health tracking tools",
    gradient: "from-red-500 to-rose-400",
    toolCount: 11,
  },
  {
    slug: "astrology-religious",
    name: "Astrology & Religious",
    emoji: "🌙",
    description: "Panchang, prayer times, moon phases and spiritual tools",
    gradient: "from-amber-600 to-orange-400",
    tag: "India demand",
    toolCount: 7,
  },
  {
    slug: "parenting-family",
    name: "Parenting & Family",
    emoji: "🧒",
    description: "Baby name finder, pregnancy calculator and family tools",
    gradient: "from-pink-400 to-rose-300",
    toolCount: 7,
  },
  {
    slug: "travel-commute",
    name: "Travel & Commute",
    emoji: "🚗",
    description: "Fuel calculator, flight time estimator and travel utilities",
    gradient: "from-sky-500 to-blue-400",
    toolCount: 7,
  },
  {
    slug: "food-cooking",
    name: "Food & Cooking",
    emoji: "🍽️",
    description: "Recipe converter, meal planner and cooking utilities",
    gradient: "from-orange-400 to-yellow-400",
    toolCount: 7,
  },
  {
    slug: "shopping-deals",
    name: "Shopping & Deals",
    emoji: "🛒",
    description: "Coupon finder, package tracker and shopping utilities",
    gradient: "from-green-500 to-lime-400",
    toolCount: 7,
  },
  {
    slug: "ecommerce-seller",
    name: "E-commerce & Seller",
    emoji: "🏪",
    description: "Product description generator, shipping calculator and seller tools",
    gradient: "from-violet-600 to-indigo-400",
    tag: "hard to find",
    toolCount: 7,
  },
  {
    slug: "mobile-app",
    name: "Mobile & App Tools",
    emoji: "📲",
    description: "APK downloader, icon resizer and mobile app utilities",
    gradient: "from-slate-500 to-gray-400",
    tag: "hard to find",
    toolCount: 6,
  },
  {
    slug: "fun-viral",
    name: "Fun & Viral Tools",
    emoji: "🎮",
    description: "Username generator, quiz maker, random picker and fun tools",
    gradient: "from-yellow-500 to-orange-400",
    tag: "trending",
    toolCount: 9,
  },
  {
    slug: "language-translation",
    name: "Language & Translation",
    emoji: "🌐",
    description: "Text translator, morse code, braille converter and language tools",
    gradient: "from-teal-500 to-emerald-400",
    toolCount: 7,
  },
  {
    slug: "general-productivity",
    name: "General Productivity",
    emoji: "⚡",
    description: "Online notepad, screen checker, clipboard manager and more",
    gradient: "from-amber-500 to-orange-400",
    toolCount: 8,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTotalToolCount(): number {
  return categories.reduce((sum, c) => sum + c.toolCount, 0);
}
