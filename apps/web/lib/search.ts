import Fuse from "fuse.js";
import { tools, type Tool } from "./tools-registry";
import { categories, type Category } from "./categories";

const toolFuse = new Fuse(tools, {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.3 },
  ],
  threshold: 0.35,
  includeScore: true,
});

const categoryFuse = new Fuse(categories, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "emoji", weight: 0.2 },
  ],
  threshold: 0.35,
  includeScore: true,
});

export interface SearchResult {
  type: "tool" | "category";
  item: Tool | Category;
  score: number;
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const toolResults = toolFuse.search(query).map((r) => ({
    type: "tool" as const,
    item: r.item,
    score: r.score ?? 1,
  }));

  const categoryResults = categoryFuse.search(query).map((r) => ({
    type: "category" as const,
    item: r.item,
    score: r.score ?? 1,
  }));

  return [...categoryResults, ...toolResults]
    .sort((a, b) => a.score - b.score)
    .slice(0, 20);
}
