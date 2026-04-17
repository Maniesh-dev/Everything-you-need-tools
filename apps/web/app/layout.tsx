import { GoogleOAuthProvider } from '@react-oauth/google';
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
    default: "kraaft — 300+ Free Online Tools | No Signup Required",
    template: "%s | kraaft",
  },
  description:
    "Your one-stop destination for 300+ free browser-based tools. JSON formatter, PDF merger, image compressor, QR code generator, unit converter, password generator and more — fast, private, no login required.",
  keywords: [
    "free online tools",
    "browser tools no signup",
    "JSON formatter online",
    "PDF merge tool",
    "image compressor free",
    "QR code generator",
    "password generator",
    "unit converter",
    "developer tools online",
    "base64 encoder decoder",
    "color picker",
    "word counter",
    "calculator online",
    "free SEO tools",
    "UUID generator",
    "markdown to HTML",
    "currency converter",
    "BMI calculator",
    "countdown timer online",
    "CSS gradient generator",
  ],
  metadataBase: new URL("https://kraaft.manieshsanwal.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "kraaft | 300+ Free Online Tools",
    description:
      "Fast, free, and privacy-first browser tools for everyone. No login required.",
    type: "website",
    siteName: "kraaft",
    url: "https://kraaft.manieshsanwal.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "kraaft — 300+ Free Online Tools",
    description:
      "Fast, free, and privacy-first browser tools for everyone. No login required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
