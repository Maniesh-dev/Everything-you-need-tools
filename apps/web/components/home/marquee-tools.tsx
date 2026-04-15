"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getTrendingTools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";

export function HeroMarquee() {
  const trendingTools = getTrendingTools();

  if (!trendingTools.length) return null;

  // Duplicate items to ensure smooth infinite scroll
  const items = [...trendingTools, ...trendingTools, ...trendingTools];

  return (
    <div className="mt-20 w-full overflow-hidden border-y border-border/50 bg-muted/20 py-4 relative">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex gap-4">
        <motion.div
          className="flex whitespace-nowrap gap-4 px-4"
          initial={{ x: 0 }}
          animate={{ x: "-33.333333%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {items.map((tool, idx) => {
            const cat = categories.find((c) => c.slug === tool.category);
            return (
              <Link
                key={`${tool.slug}-${idx}`}
                href={`/${tool.category}/${tool.slug}`}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <span>{cat?.emoji}</span>
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
