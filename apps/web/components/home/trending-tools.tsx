"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { getTrendingTools } from "@/lib/tools-registry";
import { categories } from "@/lib/categories";
import { motion } from "framer-motion";

export function TrendingTools() {
  const trending = getTrendingTools();

  if (trending.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            🔥 Trending Tools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Most popular tools right now
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trending.map((tool, idx) => {
          const cat = categories.find((c) => c.slug === tool.category);
          return (
            <motion.div
              key={`${tool.category}-${tool.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href={`/${tool.category}/${tool.slug}`}
                className="group block h-full"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group-hover:border-primary/20">
                  <CardHeader className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cat?.emoji}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {cat?.name}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {tool.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center pt-1">
                      <span className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Try it now <ArrowRight />
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
