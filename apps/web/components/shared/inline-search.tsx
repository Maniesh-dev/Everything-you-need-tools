"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Command as CommandPrimitive } from "cmdk";
import {
  Command,
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
import { cn } from "@workspace/ui/lib/utils";

interface InlineSearchProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  dropDirection?: "down" | "up";
}

export function InlineSearch({ 
  className, 
  placeholder = "Search tools, categories...", 
  autoFocus = false,
  dropDirection = "down"
}: InlineSearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => searchAll(query), [query]);

  function handleSelect(result: SearchResult) {
    if (result.type === "category") {
      router.push(`/${(result.item as typeof categories[0]).slug}`);
    } else {
      const tool = result.item as typeof tools[0];
      router.push(`/${tool.category}/${tool.slug}`);
    }
    setOpen(false);
    setQuery("");
  }

  const categoryResults = results.filter((r) => r.type === "category");
  const toolResults = results.filter((r) => r.type === "tool");

  return (
    <div className={cn("relative w-full", className)}>
      <Command
        shouldFilter={false}
        className="overflow-visible bg-transparent w-full"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false)
            e.currentTarget.blur()
          }
        }}
      >
        {/* The singular true input */}
        <div className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background/80 px-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
          <MagnifyingGlass
            className="text-muted-foreground transition-colors group-focus-within:text-primary"
            size={18}
          />
          <CommandPrimitive.Input
            placeholder={placeholder}
            value={query}
            onValueChange={(val) => {
              setQuery(val);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // Delay hiding to allow clicks on items to register
              setTimeout(() => setOpen(false), 200);
            }}
            className="flex-1 h-12 border-none bg-transparent focus:ring-0 focus:outline-none text-sm placeholder:text-muted-foreground w-full"
            autoFocus={autoFocus}
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
            {open ? "ESC" : "⌘K"}
          </kbd>
        </div>

        {/* Absolute Dropdown container */}
        {open && (
          <div className={cn(
            "absolute left-0 right-0 z-[100] rounded-xl border border-border bg-popover shadow-xl animate-in fade-in-0 duration-200",
            dropDirection === "down" 
              ? "top-[calc(100%+8px)] slide-in-from-top-2"
              : "bottom-[calc(100%+8px)] slide-in-from-bottom-2"
          )}>
            <CommandList className="max-h-[350px] overflow-y-auto w-full p-2">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No results found for "{query}".
              </CommandEmpty>

              {query.trim() === "" ? (
                <CommandGroup heading="Popular Categories">
                  {categories.slice(0, 5).map((cat) => (
                    <CommandItem
                      key={cat.slug}
                      value={cat.name}
                      onSelect={() => {
                        router.push(`/${cat.slug}`);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{cat.emoji}</span>
                      {cat.name}
                      <Badge variant="secondary" className="ml-auto">
                        {cat.toolCount}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
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
                            className="cursor-pointer"
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
                            className="cursor-pointer"
                          >
                            <span className="mr-2">{cat?.emoji}</span>
                            <div className="flex flex-col gap-0.5">
                              <span>{tool.name}</span>
                              <span className="text-xs text-muted-foreground line-clamp-1">{tool.description}</span>
                            </div>
                            {tool.status === "coming-soon" && (
                              <Badge variant="outline" className="ml-auto flex-shrink-0">
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
          </div>
        )}
      </Command>
    </div>
  );
}
