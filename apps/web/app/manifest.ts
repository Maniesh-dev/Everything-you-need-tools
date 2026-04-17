import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kraaft — 300+ Free Online Tools",
    short_name: "kraaft",
    description:
      "Your one-stop destination for 300+ free browser-based tools. Developer utilities, converters, image editors, PDF tools and more — no signup required.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
