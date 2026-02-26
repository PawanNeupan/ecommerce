import { prisma } from "@/lib/db";
import AddToCartButton from "@/app/components/AddToCartButton";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

export default async function ProductDetail({
  params,
}: {
  params: { id?: string };
}) {
  if (!params?.id) return notFound();

  const p = await prisma.product.findUnique({ where: { id: params.id } });
  if (!p) return notFound();
  if (!p.isActive) return notFound();

  const imgSrc = normalizeImageUrl(p.imageUrl);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card className="overflow-hidden rounded-2xl">
        <div className="grid md:grid-cols-2">
          <div className="h-80 w-full bg-muted">
            {imgSrc ? (
              <img src={imgSrc} alt={p.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          <div className="p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">{p.title}</CardTitle>
            </CardHeader>

            <CardContent className="p-0 mt-4">
              <Badge variant="secondary" className="mb-4">
                Stock: {p.stock}
              </Badge>

              <p className="text-muted-foreground">{p.description}</p>

              <Separator className="my-6" />

              <div className="text-2xl font-bold mb-6">
                ${p.price.toFixed(2)}
              </div>

              {/* ✅ pass imageUrl */}
              <AddToCartButton
                product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl }}
              />
            </CardContent>
          </div>
        </div>
      </Card>
    </main>
  );
}