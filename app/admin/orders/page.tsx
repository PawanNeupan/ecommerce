export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShieldCheck,
  ShoppingBag,
  Package,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  BadgeDollarSign,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "PAID")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3 w-3" /> Paid
      </span>
    );
  if (s === "PENDING")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
        <Clock className="h-3 w-3" /> Pending
      </span>
    );
  if (s === "CANCELLED" || s === "FAILED")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
        <XCircle className="h-3 w-3" /> {status}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {status}
    </span>
  );
}

function PaymentBadge({ provider }: { provider: string | null }) {
  if (!provider) return <span className="text-xs text-muted-foreground">—</span>;
  const styles: Record<string, string> = {
    STRIPE: "bg-[#635BFF]/10 text-[#635BFF] border-[#635BFF]/20",
    ESEWA:  "bg-[#60BB46]/10 text-[#60BB46] border-[#60BB46]/20",
    KHALTI: "bg-[#5C2D91]/10 text-[#5C2D91] border-[#5C2D91]/20",
    COD:    "bg-muted text-muted-foreground border-border",
  };
  const cls = styles[provider] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <CreditCard className="h-3 w-3" />
      {provider}
    </span>
  );
}

export default async function AdminOrdersPage() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role !== "ADMIN") redirect("/");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  });

  // Stats
  const totalRevenue  = orders.filter((o) => o.status === "PAID").reduce((s, o) => s + o.total, 0);
  const paidCount     = orders.filter((o) => o.status === "PAID").length;
  const pendingCount  = orders.filter((o) => o.status === "PENDING").length;
  const uniqueUsers   = new Set(orders.map((o) => o.userId).filter(Boolean)).size;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Admin
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            All Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track every order placed on your store.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10">
            <BadgeDollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              Rs. {totalRevenue.toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-500/10">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{uniqueUsers}</p>
            <p className="text-xs text-muted-foreground">Unique Customers</p>
          </div>
        </div>
      </div>

      {/* ── Orders Table ─────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground">Orders</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((o) => (
              <TableRow
                key={o.id}
                className="group transition-colors hover:bg-muted/30"
              >
                {/* Order ID */}
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-primary">
                    #{o.id.slice(-6).toUpperCase()}
                  </span>
                </TableCell>

                {/* Customer */}
                <TableCell>
                  {o.user ? (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {o.user.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.user.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Guest
                    </span>
                  )}
                </TableCell>

                {/* Items */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {o.items.length}{" "}
                      {o.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 max-w-32 mt-0.5">
                    {o.items.map((i) => i.title).join(", ")}
                  </p>
                </TableCell>

                {/* Provider */}
                <TableCell>
                  <PaymentBadge provider={o.paymentProvider} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>

                {/* Total */}
                <TableCell>
                  <span className="font-semibold text-foreground">
                    Rs. {o.total.toFixed(2)}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <p className="text-xs text-foreground">
                    {new Date(o.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <ShoppingBag className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No orders yet.</p>
                    <p className="text-xs">
                      Orders will appear here once customers start purchasing.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}