import { prisma } from "@/lib/db";
import ProductCard from "./components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b bg-primary px-6 py-24 text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 h-52 w-52 rounded-full bg-secondary/10 blur-2xl" />

        <div className="relative mx-auto max-w-6xl">
          <Badge
            variant="secondary"
            className="mb-4 border border-primary-foreground/20 bg-primary-foreground/10 font-mono text-primary-foreground"
          >
            <Zap className="mr-1 h-3 w-3" /> New arrivals every week
          </Badge>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Shop Smarter.{" "}
            <span className="text-secondary">Pay Easier.</span>
          </h1>

          <p className="mt-4 max-w-xl text-lg text-primary-foreground/70">
            Stripe, eSewa, and Khalti — pay your way. Browse our latest
            collection and check out in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 font-mono text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop Now
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3 font-mono text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              My Orders
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-sm text-primary-foreground/60">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-secondary" /> Free delivery over Rs. 2000
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-secondary" /> Secure payments
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" /> Instant confirmation
            </span>
          </div>
        </div>
      </section>

      {/* ── Payment Methods Banner ────────────────────────── */}
      <section className="border-b bg-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-4">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            We accept
          </span>
          {[
            { label: "Stripe", color: "bg-[#635BFF]" },
            { label: "eSewa", color: "bg-[#60BB46]" },
            { label: "Khalti", color: "bg-[#5C2D91]" },
          ].map((p) => (
            <span
              key={p.label}
              className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-card-foreground"
            >
              <span className={`h-2 w-2 rounded-full ${p.color}`} />
              {p.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Products Grid ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Fresh drops
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              Latest Products
            </h2>
          </div>
          <Link
            href="/products"
            className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
            No products yet. Add some from the admin panel.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(
              (p: {
                id: string;
                title: string;
                description: string;
                price: number;
              }) => (
                <ProductCard key={p.id} p={p} />
              )
            )}
          </div>
        )}
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="mx-6 mb-14 overflow-hidden rounded-xl border bg-secondary px-10 py-12">
        <div className="mx-auto max-w-6xl flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-secondary-foreground">
              Ready to order?
            </h3>
            <p className="mt-1 text-secondary-foreground/70">
              Checkout takes less than a minute with your preferred payment method.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-6 py-3 font-mono text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}