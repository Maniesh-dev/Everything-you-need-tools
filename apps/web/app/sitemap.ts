import type { MetadataRoute } from "next"
import { tools } from "@/lib/tools-registry"
import { categories } from "@/lib/categories"

const BASE_URL = "https://kraaft.manieshsanwal.in"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Homepage
  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ]

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Individual tool pages (only live tools get higher priority)
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: tool.status === "live" ? 0.7 : 0.3,
  }))

  return [...homepage, ...categoryPages, ...toolPages]
}
