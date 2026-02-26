import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default async function OrdersPage() {
  const s = await getSession();
  if (!s) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-4">Please <Link className="underline" href="/login">login</Link> to view orders.</p>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      <div className="mt-6 space-y-4">
        {orders.map((o: { id: string | any[]; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; total: number; items: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }[]; }) => (
          <div key={String(o.id)} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Order #{o.id.slice(-6)}</div>
              <div className="text-sm text-muted-foreground">{o.status}</div>
            </div>

            <div className="mt-2 text-sm">Total: Rs. {(o.total / 100).toFixed(2)}</div>

            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {o.items.map((it: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <div key={it.id}>
                  {it.title} × {it.qty}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}