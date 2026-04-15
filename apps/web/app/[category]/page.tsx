import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-registry";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: `${cat.name} — Free Online Tools`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) notFound();

  const toolsList = getToolsByCategory(cat.slug);

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
            <BreadcrumbPage>{cat.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{cat.emoji}</span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold">{cat.name}</h1>
              {cat.tag && (
                <Badge
                  variant={cat.tag === "trending" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {cat.tag === "trending" ? "🔥 Trending" : cat.tag}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">{cat.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {cat.toolCount} tools available
            </p>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Tools grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {toolsList.map((tool, index) => (
          <Link
            key={tool.slug}
            href={`/${cat.slug}/${tool.slug}`}
            className="group animate-slide-up opacity-0"
            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group-hover:border-primary/20">
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                    {tool.name}
                  </CardTitle>
                  {tool.status === "coming-soon" ? (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      Coming Soon
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px] shrink-0">
                      Live
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {tool.description}
                </CardDescription>
                <div className="flex items-center pt-1">
                  <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open tool →
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
