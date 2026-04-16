"use client";

import * as React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Badge } from "@workspace/ui/components/badge";
import { getTotalToolCount } from "@/lib/categories";
import { InlineSearch } from "@/components/shared/inline-search";
import { motion, Variants } from "framer-motion";
import { HeroMarquee } from "./marquee-tools";
import { HeroCategoryFilter } from "./hero-category-filter";

interface FloatingTool {
  label: string;
  name: string;
  type: "trending" | "most-used";
  position: { top: string; left: string };
  rotate: number;
  floatDirection: "up" | "down";
  floatDuration: number;
  delay: number;
}

const floatingTools: FloatingTool[] = [
  { label: "Trending", name: "AI Text Detector", type: "trending", position: { top: "2rem", left: "-38rem" }, rotate: -4, floatDirection: "up", floatDuration: 4.2, delay: 0.2 },
  { label: "Most Used", name: "World Clock", type: "most-used", position: { top: "6rem", left: "-33rem" }, rotate: 2, floatDirection: "down", floatDuration: 5.0, delay: 0.35 },
  { label: "Most Used", name: "URL Shortener", type: "most-used", position: { top: "12rem", left: "-37rem" }, rotate: -2, floatDirection: "up", floatDuration: 4.6, delay: 0.1 },
  { label: "Trending", name: "AI Image Detector", type: "trending", position: { top: "17rem", left: "-35rem" }, rotate: 3, floatDirection: "down", floatDuration: 5.3, delay: 0.45 },
  { label: "Most Used", name: "Image to PDF", type: "most-used", position: { top: "2rem", left: "28rem" }, rotate: 3, floatDirection: "down", floatDuration: 4.8, delay: 0.3 },
  { label: "Trending", name: "AI Writing Humanizer", type: "trending", position: { top: "8rem", left: "23rem" }, rotate: -3, floatDirection: "up", floatDuration: 5.1, delay: 0.15 },
  { label: "Most Used", name: "JSON Formatter", type: "most-used", position: { top: "12rem", left: "27rem" }, rotate: 2, floatDirection: "down", floatDuration: 4.4, delay: 0.4 },
  { label: "Most Used", name: "Password Generator", type: "most-used", position: { top: "19rem", left: "22rem" }, rotate: -2, floatDirection: "up", floatDuration: 5.5, delay: 0.25 },
];

export function Hero() {
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
      <section className="relative overflow-hidden pt-10">
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
          {floatingTools.map((tool) => (
            <motion.span
              key={tool.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: tool.floatDirection === "up" ? [0, -12, 0] : [0, 12, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: tool.delay },
                scale: { duration: 0.5, delay: tool.delay },
                y: { duration: tool.floatDuration, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute",
                top: tool.position.top,
                left: "50%",
                marginLeft: tool.position.left,
                rotate: `${tool.rotate}deg`,
              }}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
            >
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${tool.type === "trending"
                  ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white"
                  : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                  }`}
              >
                {tool.label}
              </span>
              {tool.name}
            </motion.span>
          ))}
        </div>


        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          {/* Social Proof & Badge */}
          <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-1.5 text-sm backdrop-blur-sm transition-colors hover:bg-yellow-500/10 cursor-default">
              <span className="text-yellow-500 text-[10px] tracking-widest drop-shadow-sm">★★★★★</span>
              <span className="text-xs font-medium text-muted-foreground">Used by 10,000+ creators, devs &amp; marketers etc..</span>
            </div>

            <Badge variant="secondary" className="px-6 py-3 text-xs font-medium shadow-sm">
              ✨ 300+ Free Tools — No Signup Required
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
          <motion.div variants={itemVariants} className="mx-auto mt-10 max-w-xl relative">
            <InlineSearch className="py-4" placeholder="Search 300+ tools..." dropDirection="up" />
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
        <div className="relative z-50">
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
    </>
  );
}
