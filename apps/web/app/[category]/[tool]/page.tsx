import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getToolBySlug, getToolsByCategory, tools } from "@/lib/tools-registry";
import Link from "next/link";

interface ToolPageProps {
  params: Promise<{ category: string; tool: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category, tool: toolSlug } = await params;
  const toolData = getToolBySlug(category, toolSlug);
  const cat = getCategoryBySlug(category);

  if (!toolData || !cat) return {};

  return {
    title: `${toolData.name} — Free Online Tool`,
    description: toolData.description,
    openGraph: {
      title: `${toolData.name} | AllInOneTools`,
      description: toolData.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { category, tool: toolSlug } = await params;
  const cat = getCategoryBySlug(category);
  const toolData = getToolBySlug(category, toolSlug);

  if (!cat || !toolData) notFound();

  const relatedTools = getToolsByCategory(cat.slug)
    .filter((t) => t.slug !== toolData.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${cat.slug}`}>{cat.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{toolData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="animate-fade-in">
          {/* Tool header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{cat.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-heading text-2xl font-bold sm:text-3xl">
                    {toolData.name}
                  </h1>
                  {toolData.status === "coming-soon" ? (
                    <Badge variant="outline">Coming Soon</Badge>
                  ) : (
                    <Badge>Live</Badge>
                  )}
                  {toolData.isTrending && (
                    <Badge variant="secondary">🔥 Trending</Badge>
                  )}
                </div>
                <p className="mt-2 text-muted-foreground">
                  {toolData.description}
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Tool content area */}
          <Card className="min-h-[400px]">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <span className="text-6xl animate-float">{cat.emoji}</span>
              <h2 className="font-heading text-xl font-semibold text-muted-foreground">
                Coming Soon
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                We&apos;re building this tool. Check back soon or explore other
                tools in the{" "}
                <Link
                  href={`/${cat.slug}`}
                  className="text-primary underline underline-offset-4"
                >
                  {cat.name}
                </Link>{" "}
                category.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — related tools */}
        <aside className="animate-slide-up opacity-0 stagger-4">
          <div className="sticky top-24">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Related Tools
            </h3>
            <div className="flex flex-col gap-3">
              {relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${cat.slug}/${t.slug}`}
                  className="group"
                >
                  <Card className="transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                        {t.name}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-1">
                        {t.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <Separator className="my-4" />

            <Link
              href={`/${cat.slug}`}
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              ← All {cat.name}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
