"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { categories } from "@/lib/categories";
import { motion } from "framer-motion";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          Browse by Category
        </h2>
        <p className="mt-2 text-muted-foreground">
          {categories.length} categories packed with tools for every need
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
            className="group h-full"
          >
            <Link href={`/${cat.slug}`} className="block h-full">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group-hover:border-primary/20">
                <CardHeader className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="flex items-center gap-2">
                      {cat.tag && (
                        <Badge
                          variant={
                            cat.tag === "trending"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] capitalize"
                        >
                          {cat.tag === "trending" ? "🔥 Trending" : cat.tag}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs line-clamp-2">
                      {cat.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">
                      {cat.toolCount} tools
                    </span>
                    <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Explore →
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
