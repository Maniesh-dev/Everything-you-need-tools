"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { categories, type CategorySlug } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-registry";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { ArrowRight } from "@phosphor-icons/react";

export function HeroCategoryFilter() {
  const [activeCategory, setActiveCategory] = React.useState<CategorySlug>("pdf");
  const currentTools = React.useMemo(() => {
    return getToolsByCategory(activeCategory).slice(0, 6); // Limit to 6 for the hero preview
  }, [activeCategory]);

  return (
    <div className="mx-auto mt-12 mb-8 max-w-5xl px-4 text-left sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Filter Tools by Category
        </h3>
        <Link href={`/${activeCategory}`} className="text-xs text-primary hover:underline underline-offset-4">
          View all in category →
        </Link>
      </div>

      {/* Horizontal text-only category filter */}
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterBubble"
                    className="absolute inset-0 z-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>
                    {cat.emoji}
                  </span>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden sm:flex" />
      </ScrollArea>

      {/* Tools Grid matching selected category */}
      <div className="mt-6 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentTools.map((tool) => {
              const cat = categories.find((c) => c.slug === tool.category);
              return (
                <Link
                  key={`${tool.category}-${tool.slug}`}
                  href={`/${tool.category}/${tool.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group-hover:border-primary/20">
                    <CardHeader className="flex flex-col gap-3 p-4">
                      <div className="w-full flex items-center justify-between">
                        <span className="text-2xl">{cat?.emoji}</span>
                        {tool.status === "coming-soon" ? (
                          <Badge variant="outline" className="text-[10px]">
                            Coming Soon
                          </Badge>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
