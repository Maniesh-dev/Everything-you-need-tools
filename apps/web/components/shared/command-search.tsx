"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@workspace/ui/components/command";
import { Badge } from "@workspace/ui/components/badge";
import { categories } from "@/lib/categories";
import { tools } from "@/lib/tools-registry";
import { searchAll, type SearchResult } from "@/lib/search";

interface CommandSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => searchAll(query), [query]);

  // Global Cmd+K shortcut
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function handleSelect(result: SearchResult) {
    if (result.type === "category") {
      router.push(`/${(result.item as typeof categories[0]).slug}`);
    } else {
      const tool = result.item as typeof tools[0];
      router.push(`/${tool.category}/${tool.slug}`);
    }
    onOpenChange(false);
    setQuery("");
  }

  const categoryResults = results.filter((r) => r.type === "category");
  const toolResults = results.filter((r) => r.type === "tool");

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools, categories..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {query.trim() === "" ? (
          <>
            <CommandGroup heading="Popular Categories">
              {categories.slice(0, 8).map((cat) => (
                <CommandItem
                  key={cat.slug}
                  value={cat.name}
                  onSelect={() => {
                    router.push(`/${cat.slug}`);
                    onOpenChange(false);
                  }}
                >
                  <span className="mr-2">{cat.emoji}</span>
                  {cat.name}
                  <Badge variant="secondary" className="ml-auto">
                    {cat.toolCount}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <>
            {categoryResults.length > 0 && (
              <CommandGroup heading="Categories">
                {categoryResults.map((r) => {
                  const cat = r.item as typeof categories[0];
                  return (
                    <CommandItem
                      key={cat.slug}
                      value={cat.name}
                      onSelect={() => handleSelect(r)}
                    >
                      <span className="mr-2">{cat.emoji}</span>
                      {cat.name}
                      <Badge variant="secondary" className="ml-auto">
                        {cat.toolCount} tools
                      </Badge>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {categoryResults.length > 0 && toolResults.length > 0 && (
              <CommandSeparator />
            )}

            {toolResults.length > 0 && (
              <CommandGroup heading="Tools">
                {toolResults.map((r) => {
                  const tool = r.item as typeof tools[0];
                  const cat = categories.find((c) => c.slug === tool.category);
                  return (
                    <CommandItem
                      key={`${tool.category}-${tool.slug}`}
                      value={`${tool.name} ${tool.description}`}
                      onSelect={() => handleSelect(r)}
                    >
                      <span className="mr-2">{cat?.emoji}</span>
                      <div className="flex flex-col gap-0.5">
                        <span>{tool.name}</span>
                        <span className="text-xs text-muted-foreground">{tool.description}</span>
                      </div>
                      {tool.status === "coming-soon" && (
                        <Badge variant="outline" className="ml-auto">
                          Coming Soon
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
