import { prisma } from "@/lib/db";
import ProductCard from "../components/ProductCard";
import ProductFilters from "./ProductFilters";
import { Suspense } from "react";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SortKey = "newest" | "price_asc" | "price_desc" | "alpha";

function buildOrderBy(sort: SortKey) {
  switch (sort) {
    case "price_asc":  return { price: "asc"  } as const;
    case "price_desc": return { price: "desc" } as const;
    case "alpha":      return { title: "asc"  } as const;
    default:           return { createdAt: "desc" } as const;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: SortKey; min?: string; max?: string }>;
}) {
  // ✅ Next.js 15 — searchParams is a Promise
  const sp = await searchParams;

  const q        = sp.q?.trim() ?? "";
  const sort     = (sp.sort ?? "newest") as SortKey;
  const minPrice = sp.min ? parseFloat(sp.min) : undefined;
  const maxPrice = sp.max ? parseFloat(sp.max) : undefined;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      // ✅ MongoDB doesn't support mode:"insensitive" — use regex instead
      ...(q && {
        OR: [
          { title:       { contains: q } },
          { description: { contains: q } },
        ],
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    },
    orderBy: buildOrderBy(sort),
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      imageUrl: true,
    },
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Browse
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            All Products
          </h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Mobile filters — OUTSIDE the flex row */}
      <div className="mb-6 lg:hidden">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>
        </div>
      </div>

      {/* Sidebar + Grid */}
      <div className="flex gap-8 items-start">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block w-56 shrink-0 sticky top-24">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Suspense fallback={null}>
              <ProductFilters />
            </Suspense>
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
              <Package className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">
                No products found
              </p>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}