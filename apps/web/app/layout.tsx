import { Geist_Mono, DM_Sans, Inter } from "next/font/google";
import type { Metadata } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@workspace/ui/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "kraaft — 300+ Free Online Tools",
    template: "%s | kraaft",
  },
  description:
    "Your one-stop destination for 300+ free browser-based tools. Developer utilities, converters, image editors, PDF tools and more — no signup required.",
  keywords: [
    "online tools",
    "free tools",
    "developer tools",
    "converter",
    "calculator",
    "image tools",
    "PDF tools",
    "AI Tools",
    "clock-time",
    "weather",
    "todo-task",
    "calendar-date",
    "link-url",
    "image",
    "pdf",
    "image-editor",
    "video-audio-download",
    "video-editing",
    "audio-music",
    "text-writing",
    "developer",
    "data-file",
    "design-color",
    "security-privacy",
    "network-web",
    "converters-calculators",
    "finance-business",
    "seo-web",
    "social-media",
    "email",
    "ai-content",
    "document-legal",
    "student-education",
    "maps-location",
    "health-fitness",
    "astrology-religious",
    "parenting-family",
    "travel-commute",
    "food-cooking",
    "shopping-deals",
    "ecommerce-seller",
    "mobile-app",
    "fun-viral",
    "language-translation",
    "general-productivity",
  ],
  metadataBase: new URL("https://kraaft.dev"),
  openGraph: {
    title: "kraaft — 250+ Free Online Tools",
    description:
      "Fast, free, and privacy-first browser tools for everyone. No login required.",
    type: "website",
    siteName: "kraaft",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        interHeading.variable
      )}
    >
      <body className="min-h-svh flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
