import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/(auth)/", "/saved-data/", "/search"],
      },
    ],
    sitemap: "https://kraaft.manieshsanwal.in/sitemap.xml",
  }
}
