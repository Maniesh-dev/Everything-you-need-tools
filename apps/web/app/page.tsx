import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { TrendingTools } from "@/components/home/trending-tools";
import { MostUsedTools } from "@/components/home/most-used-tools";
import { DonationSection } from "@/components/home/donation-section";
import { Separator } from "@workspace/ui/components/separator";

export default function HomePage() {
  return (
    <>
      <Hero />
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
