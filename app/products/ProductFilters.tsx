"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest",            value: "newest"     },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc"},
  { label: "A - Z",             value: "alpha"      },
];

export default function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q        = params.get("q")    ?? "";
  const sort     = params.get("sort") ?? "newest";
  const minPrice = params.get("min")  ?? "";
  const maxPrice = params.get("max")  ?? "";

  const push = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      startTransition(() => router.push(`/products?${next.toString()}`));
    },
    [params, router]
  );

  const clearAll  = () => startTransition(() => router.push("/products"));
  const hasFilters = q || sort !== "newest" || minPrice || maxPrice;

  return (
    <aside className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            key={q} // ✅ resets input when cleared
            type="text"
            placeholder="Search products…"
            defaultValue={q}
            onChange={(e) => push("q", e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
          {q && (
            <button
              onClick={() => push("q", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sort By
        </label>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => push("sort", o.value)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                sort === o.value
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Price Range
        </label>
        <div className="space-y-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Rs.
            </span>
            <input
              type="number"
              placeholder="Min"
              defaultValue={minPrice}
              min={0}
              onChange={(e) => push("min", e.target.value)}
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Rs.
            </span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={maxPrice}
              min={0}
              onChange={(e) => push("max", e.target.value)}
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
        </div>
      </div>

      {isPending && (
        <p className="text-center text-xs text-muted-foreground animate-pulse">
          Updating…
        </p>
      )}
    </aside>
  );
}