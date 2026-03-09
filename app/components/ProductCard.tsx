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
    <Card className="group overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <Link href={`/products/${p.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={p.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* price badge that appears on hover */}
          <div className="absolute top-3 right-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            Rs. {p.price.toFixed(2)}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${p.id}`} className="block">
          <div className="font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {p.title}
          </div>
          <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {p.description}
          </div>
          <div className="mt-2 font-bold text-foreground">
            Rs. {p.price.toFixed(2)}
          </div>
        </Link>

        <div className="mt-3 transition-transform duration-200 group-hover:scale-[1.02]">
          <AddToCartButton
            product={{
              id: p.id,
              title: p.title,
              price: p.price,
              imageUrl: p.imageUrl,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}