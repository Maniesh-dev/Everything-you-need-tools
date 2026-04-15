"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagnifyingGlass, List, Moon, Sun, X, Heart, SignIn, UserCircle, SignOut } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@workspace/ui/components/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@workspace/ui/components/sheet";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { categories } from "@/lib/categories";
import { CommandSearch } from "@/components/shared/command-search";
import { useAuthContext } from "@/context/AuthContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuthContext();

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
              className="flex items-center gap-1.5 border-rose-500/30 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
            >
              <Link href="/#donate">
                <Heart weight="fill" />
                <span>Donate</span>
              </Link>
            </Button>

            <ThemeToggle />

            {/* Auth buttons */}
            {!isLoading && (
              <>
                {user ? (
                  /* ── Logged in: User menu ──────────────────────────────── */
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="relative"
                    >
                      <UserCircle size={22} weight="fill" />
                    </Button>

                    {userMenuOpen && (
                      <>
                        {/* Backdrop to close menu */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        {/* Dropdown */}
                        <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-1.5 shadow-xl shadow-black/10">
                          <div className="px-3 py-2 border-b border-border mb-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="px-3 py-2 border-b border-border mb-1 space-y-2">
                            <p className="text-sm font-medium text-foreground cursor-pointer">Your Saved Data</p>
                            <p className="text-sm font-medium text-foreground cursor-pointer">Feedback for us</p>
                          </div>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <SignOut size={16} />
                            Sign out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* ── Not logged in: Auth links ─────────────────────────── */
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="hidden sm:flex items-center gap-1.5 text-sm"
                    >
                      <Link href="/login">
                        <SignIn size={16} />
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="hidden sm:flex text-sm"
                    >
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <List />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <SheetTitle className="p-4 ">Menu</SheetTitle>
                <nav className="flex flex-col gap-1 pt-4">
                  {/* Auth section in mobile menu */}
                  {!isLoading && !user && (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                      >
                        <SignIn size={16} />
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-colors text-center"
                      >
                        Create account
                      </Link>
                      <Separator className="my-2" />
                    </>
                  )}

                  {!isLoading && user && (
                    <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <SignOut size={16} />
                        Sign out
                      </button>
                      <Separator className="my-2" />
                    </>
                  )}

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

