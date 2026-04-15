import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";
import { categories } from "@/lib/categories";

export function Footer() {
  const columnSize = Math.ceil(categories.length / 4);
  const columns = [
    categories.slice(0, columnSize),
    categories.slice(columnSize, columnSize * 2),
    categories.slice(columnSize * 2, columnSize * 3),
    categories.slice(columnSize * 3),
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Brand + description */}
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
                A
              </span>
              AllInOneTools
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Your one-stop destination for 250+ free online tools. No login required.
              Fast, private, and built for everyone.
            </p>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col gap-2">
                {col.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {cat.emoji} {cat.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AllInOneTools. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
