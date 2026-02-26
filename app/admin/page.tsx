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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Create Product Form */}
          <AdminProductForm />

          <Separator className="my-6" />

          {/* Products Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
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
                  <TableRow key={p.id}>
                    {/* Image */}
                    <TableCell>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={p.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted" />
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell>{p.title}</TableCell>

                    {/* Price */}
                    <TableCell>
                      ${(p.price)}
                    </TableCell>

                    {/* Stock */}
                    <TableCell>{p.stock}</TableCell>

                    {/* Status */}
                    <TableCell>
                      {p.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="secondary">Hidden</Badge>
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
                          <Button
                            size="sm"
                            variant="outline"
                            type="submit"
                          >
                            {p.isActive ? "Hide" : "Show"}
                          </Button>
                        </form>

                        {/* Delete */}
                        <form
                          action={adminDeleteProductAction.bind(null, p.id)}
                        >
                          <Button
                            size="sm"
                            variant="destructive"
                            type="submit"
                          >
                            Delete
                          </Button>
                        </form>

                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}