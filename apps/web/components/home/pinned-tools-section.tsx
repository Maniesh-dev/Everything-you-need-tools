"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PushPin } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { usePinnedTools } from "@/context/PinnedToolsContext";
import { tools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";
import { motion } from "framer-motion";

export function PinnedToolsSection() {
  const { pinnedTools, isLoadingPinned } = usePinnedTools();

  if (isLoadingPinned || pinnedTools.length === 0) return null;

  const validTools = pinnedTools
    .map(slug => tools.find(t => t.slug === slug))
    .filter(Boolean) as typeof tools;

  if (validTools.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-primary/5">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <PushPin weight="fill" size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Pinned Tools
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your favorite tools for quick access
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {validTools.map((tool, idx) => {
          const cat = categories.find((c) => c.slug === tool.category);
          return (
            <motion.div
              key={`pinned-${tool.slug}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/${tool.category}/${tool.slug}`}
                className="group block h-full"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group-hover:border-primary/30 border-primary/10">
                  <CardHeader className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cat?.emoji}</span>
                      <Badge variant="outline" className="text-[10px] text-primary/80 border-primary/20">
                        {cat?.name}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center pt-1 mt-auto">
                      <span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100 font-medium">
                        Open tool <ArrowRight size={12} weight="bold" />
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
