import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  LogIn,
} from "lucide-react";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();

  if (s === "PAID")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
        <CheckCircle2 className="h-3 w-3" /> Paid
      </span>
    );

  if (s === "PENDING")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-700 border border-yellow-200">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );

  if (s === "CANCELLED")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive border border-destructive/20">
        <XCircle className="h-3 w-3" /> Cancelled
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground border border-border">
      {status}
    </span>
  );
}

function PaymentBadge({ provider }: { provider: string | null }) {
  if (!provider) return null;
  const colors: Record<string, string> = {
    STRIPE: "bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/20",
    ESEWA:  "bg-[#60BB46]/10 text-[#60BB46] border-[#60BB46]/20",
    KHALTI: "bg-[#5C2D91]/10 text-[#5C2D91] border-[#5C2D91]/20",
    COD:    "bg-muted text-muted-foreground border-border",
  };
  const cls = colors[provider] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <CreditCard className="h-3 w-3" />
      {provider}
    </span>
  );
}

export default async function OrdersPage() {
  const s = await getSession();

  if (!s) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-9 w-9 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Sign in to view orders
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You need to be logged in to see your order history.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your recent purchases and payment status.
          </p>
        </div>
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your completed orders will appear here.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-5">
        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-primary/20"
          >
            {/* Order header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Order{" "}
                    <span className="font-mono text-primary">
                      #{o.id.slice(-6).toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PaymentBadge provider={o.paymentProvider} />
                <StatusBadge status={o.status} />
                <div className="rounded-lg border border-border bg-background px-3 py-1.5 text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold text-foreground">
                    Rs. {o.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="divide-y divide-border px-6">
              {o.items.map((it) => {
                const imgSrc = normalizeImageUrl(it.imageUrl);
                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={String(it.title)}
                          className="h-14 w-14 rounded-xl object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted border border-border">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          {it.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Rs. {it.price.toFixed(2)} × {it.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-foreground shrink-0">
                      Rs. {(it.price * it.qty).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Order footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
              <p className="text-xs text-muted-foreground">
                {o.items.length} {o.items.length === 1 ? "item" : "items"}
              </p>
              <p className="text-xs text-muted-foreground">
                Ref:{" "}
                <span className="font-mono">
                  {o.paymentRef?.slice(0, 16) ?? "—"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}