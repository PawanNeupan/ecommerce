import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

function statusBadgeVariant(status: string) {
  const s = status?.toUpperCase();
  if (s === "PAID") return "default";
  if (s === "PENDING") return "secondary";
  return "destructive";
}

export default async function OrdersPage() {
  const s = await getSession();

  if (!s) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Please login to view your orders.
            </p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Track your recent purchases and payment status.
          </p>
        </div>
        <Badge variant="secondary">{orders.length} orders</Badge>
      </div>

      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <Card key={o.id} className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  Order <span className="font-mono">#{o.id.slice(-6)}</span>
                </CardTitle>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={statusBadgeVariant(o.status) as any}>
                  {o.status}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="font-semibold">${o.total.toFixed(2)}</div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Separator className="mb-4" />

              <div className="space-y-3">
                {o.items.map((it) => {
                  const imgSrc = normalizeImageUrl(it.imageUrl);

                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={String(it.title)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>

                        <div>
                          <div className="font-medium leading-tight">
                            {it.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${it.price.toFixed(2)} × {it.qty}
                          </div>
                        </div>
                      </div>

                      <div className="font-semibold">
                        ${(it.price * it.qty).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card className="rounded-2xl">
            <CardContent className="py-10 text-center text-muted-foreground">
              No orders yet.{" "}
              <Link href="/products" className="underline">
                Browse products
              </Link>
              .
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}