"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass, List, Moon, Sun, X, Heart } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@workspace/ui/components/sheet";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { categories } from "@/lib/categories";
import { CommandSearch } from "@/components/shared/command-search";

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight"
          >
            <span className="flex px-4 py-2 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
              Kraaft
            </span>
            <span className="hidden sm:inline font-bold tracking-lg">All in One Tools</span>
          </Link>

          {/* Search bar (desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted cursor-pointer max-w-md flex-1"
          >
            <MagnifyingGlass data-icon="inline-start" />
            <span className="flex-1 text-left">Search tools...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <MagnifyingGlass />
            </Button>

            <Button
              asChild
              variant="outline"
              className="hidden sm:flex items-center gap-1.5 border-rose-500/30 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
            >
              <Link href="/#donate">
                <Heart weight="fill" />
                <span>Donate</span>
              </Link>
            </Button>

            <ThemeToggle />

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <List />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetTitle>Menu</SheetTitle>
                <nav className="flex flex-col gap-1 pt-4">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === "/"
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    Home
                  </Link>
                  <Separator className="my-2" />
                  <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === `/${cat.slug}`
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span>{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
