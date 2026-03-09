export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

import AdminProductForm from "../components/AdminProductForm";
import {
  adminDeleteProductAction,
  adminToggleProductAction,
} from "../actions/product.actions";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  ShieldCheck,
  PlusCircle,
  Eye,
  EyeOff,
  Trash2,
  LayoutGrid,
  TrendingUp,
  Archive,
} from "lucide-react";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

export default async function AdminPage() {
  const s = await getSession();

  if (!s) redirect("/login");
  if (s.role !== "ADMIN") redirect("/");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCount  = products.filter((p) => p.isActive).length;
  const hiddenCount  = products.filter((p) => !p.isActive).length;
  const totalValue   = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Admin
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>
        <span className="text-sm text-muted-foreground">
          Welcome back, {s.email ?? "Admin"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active Products</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
            <Archive className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{hiddenCount}</p>
            <p className="text-xs text-muted-foreground">Hidden Products</p>
          </div>
        </div>
      </div>

      {/* Add Product */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <PlusCircle className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Add New Product</h2>
        </div>
        <div className="p-6">
          <AdminProductForm />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground">All Products</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((p) => {
              const imgSrc = normalizeImageUrl(p.imageUrl);
              return (
                <TableRow
                  key={p.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Image */}
                  <TableCell>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={p.title}
                        className="h-12 w-12 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted border border-border">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-48">
                      {p.description}
                    </p>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <span className="font-semibold text-foreground">
                      Rs. {p.price.toFixed(2)}
                    </span>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <span
                      className={`font-medium ${
                        p.stock === 0
                          ? "text-destructive"
                          : p.stock < 5
                          ? "text-yellow-600"
                          : "text-foreground"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {p.isActive ? (
                      <Badge className="bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/10">
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground"
                      >
                        Hidden
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Toggle */}
                      <form
                        action={adminToggleProductAction.bind(
                          null,
                          p.id,
                          !p.isActive
                        )}
                      >
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors
                            ${
                              p.isActive
                                ? "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                        >
                          {p.isActive ? (
                            <>
                              <EyeOff className="h-3.5 w-3.5" /> Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-3.5 w-3.5" /> Show
                            </>
                          )}
                        </button>
                      </form>

                      {/* Delete */}
                      <form
                        action={adminDeleteProductAction.bind(null, p.id)}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Package className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No products yet.</p>
                    <p className="text-xs">Add your first product above.</p>
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