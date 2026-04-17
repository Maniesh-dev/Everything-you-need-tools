"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { Toaster } from "@workspace/ui/components/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { PinnedToolsProvider } from "@/context/PinnedToolsContext";

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== "d") return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        if (
          target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT"
        )
          return;
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, setTheme]);

  return null;
}

function TabVisibility() {
  React.useEffect(() => {
    let originalTitle = document.title;
    let originalFavicon = "/icon.png";

    function handleVisibilityChange() {
      if (document.hidden) {
        // Only update originalTitle if it's not the "missing you" title
        if (document.title !== "Kraaft | We are missing you!") {
          originalTitle = document.title;
        }
        document.title = "Kraaft | We are missing you!";

        let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (link) {
          originalFavicon = link.getAttribute("href") || "/icon.png";
        } else {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.type = "image/svg+xml";
        link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥺</text></svg>";
      } else {
        document.title = originalTitle;
        let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (link) {
          link.type = "image/png";
          link.href = originalFavicon;
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <PinnedToolsProvider>
          <TooltipProvider>
            <ThemeHotkey />
            <TabVisibility />
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </PinnedToolsProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}

