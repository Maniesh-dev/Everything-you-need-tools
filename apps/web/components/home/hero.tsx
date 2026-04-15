"use client";

import * as React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { getTotalToolCount } from "@/lib/categories";
import { CommandSearch } from "@/components/shared/command-search";
import { motion, Variants } from "framer-motion";
import { HeroMarquee } from "./marquee-tools";
import { HeroCategoryFilter } from "./hero-category-filter";

const leftFloatingTools = [
  "Most Used : World Clock",
  "Most Used : URL Shortener",
  "Trending : AI Text Detector",
  "Trending : AI Image Detector",
];

const rightFloatingTools = [
  "Most Used : Image to PDF",
  "Most Used : JSON Formatter",
  "Most Used : Password Generator",
  "Trending : AI Writing Humanizer",
];

export function Hero() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const totalTools = getTotalToolCount();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <>
      <section className="relative overflow-hidden pt-20 sm:pt-28 lg:pt-32">
        {/* Background gradient orbs and floating elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-40 -right-40 size-80 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/5 blur-3xl"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 hidden xl:block" aria-hidden="true">
          <div className="absolute left-1/2 top-24 flex -translate-x-[39rem] flex-col gap-4">
            {leftFloatingTools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.25 + index * 0.08 },
                  x: { duration: 0.6, delay: 0.25 + index * 0.08 },
                  y: { duration: 4.5 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="inline-flex w-fit -rotate-3 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
              >
                {tool}
              </motion.span>
            ))}
          </div>

          <div className="absolute left-1/2 top-24 flex translate-x-[28rem] flex-col gap-4">
            {rightFloatingTools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.35 + index * 0.08 },
                  x: { duration: 0.6, delay: 0.35 + index * 0.08 },
                  y: { duration: 4.8 + index * 0.3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="inline-flex w-fit rotate-3 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <Badge variant="secondary" className="px-6 py-3 text-xs font-medium">
              ✨ {totalTools}+ Free Tools — No Signup Required
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl"
          >
            Every tool you need
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              here you can find
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            From developer utilities to everyday calculators — fast, free, and
            privacy-first browser tools that just work.
          </motion.p>

          {/* Search bar */}
          <motion.div variants={itemVariants} className="mx-auto mt-10 max-w-xl">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background/80 px-5 py-4 shadow-lg shadow-primary/5 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer"
            >
              <MagnifyingGlass
                className="text-muted-foreground transition-colors group-hover:text-primary"
                data-icon="inline-start"
              />
              <span className="flex-1 text-left text-muted-foreground text-sm">
                Search {totalTools}+ tools...
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" />
              100% Free
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              No Login Required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-purple-500" />
              Privacy First
            </div>
          </motion.div>
        </motion.div>

        {/* Category text filter below the main headline */}
        <div className="relative z-20">
          <HeroCategoryFilter />
        </div>

        {/* Marquee for trending tools */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <HeroMarquee />
        </motion.div>
      </section>

      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
