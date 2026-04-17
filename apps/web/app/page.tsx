import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrendingTools } from "@/components/home/trending-tools";
import { MostUsedTools } from "@/components/home/most-used-tools";
import { DonationSection } from "@/components/home/donation-section";
import { PinnedToolsSection } from "@/components/home/pinned-tools-section";
import { Separator } from "@workspace/ui/components/separator";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "kraaft",
  url: "https://kraaft.manieshsanwal.in",
  description:
    "Your one-stop destination for 300+ free browser-based tools. No signup required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://kraaft.manieshsanwal.in/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <PinnedToolsSection />
      <Separator />
      <CategoryGrid />
      <Separator />
      <TrendingTools />
      <Separator />
      <MostUsedTools />
      <Separator />
      <DonationSection />
    </>
  );
}
