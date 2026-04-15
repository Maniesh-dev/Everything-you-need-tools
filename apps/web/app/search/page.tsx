"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@workspace/ui/components/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { searchAll, type SearchResult } from "@/lib/search";
import { categories } from "@/lib/categories";
import { type Tool } from "@/lib/tools-registry";
import { type Category } from "@/lib/categories";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);
  const results = React.useMemo(() => searchAll(query), [query]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Search Tools</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 250+ tools..."
          className="pl-10 h-12 text-base"
          autoFocus
        />
      </div>

      {/* Results */}
      {query.trim() && (
        <p className="mb-4 text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      <div className="flex flex-col gap-3">
        {results.map((r) => {
          if (r.type === "category") {
            const cat = r.item as Category;
            return (
              <Link key={cat.slug} href={`/${cat.slug}`} className="group">
                <Card className="transition-all hover:border-primary/20 hover:shadow-sm">
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="flex-1">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {cat.name}
                      </CardTitle>
                      <CardDescription className="text-xs">{cat.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{cat.toolCount} tools</Badge>
                  </CardHeader>
                </Card>
              </Link>
            );
          }

          const tool = r.item as Tool;
          const cat = categories.find((c) => c.slug === tool.category);
          return (
            <Link
              key={`${tool.category}-${tool.slug}`}
              href={`/${tool.category}/${tool.slug}`}
              className="group"
            >
              <Card className="transition-all hover:border-primary/20 hover:shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <span className="text-2xl">{cat?.emoji}</span>
                  <div className="flex-1">
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{tool.description}</CardDescription>
                  </div>
                  {tool.status === "coming-soon" && (
                    <Badge variant="outline" className="text-[10px]">Coming Soon</Badge>
                  )}
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-muted-foreground">
            No tools found matching &quot;{query}&quot;. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
