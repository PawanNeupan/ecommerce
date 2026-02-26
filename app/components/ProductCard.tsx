import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { Card, CardContent } from "@/components/ui/card";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

export default function ProductCard({
  p,
}: {
  p: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string | null;
  };
}) {
  const imgSrc = normalizeImageUrl(p.imageUrl);

  return (
    <Card className="overflow-hidden rounded-2xl">
      <Link href={`/products/${p.id}`} className="block">
        <div className="h-44 w-full bg-muted">
          {imgSrc ? (
            <img src={imgSrc} alt={p.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${p.id}`} className="block">
          <div className="font-medium">{p.title}</div>
          <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</div>
          <div className="mt-2 font-semibold">${p.price.toFixed(2)}</div>
        </Link>

        <div className="mt-3">
          {/* ✅ pass imageUrl */}
          <AddToCartButton
            product={{ id: p.id, title: p.title, price: p.price, imageUrl: p.imageUrl }}
          />
        </div>
      </CardContent>
    </Card>
  );
}