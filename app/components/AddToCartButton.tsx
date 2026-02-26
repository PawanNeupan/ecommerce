"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";

export default function AddToCartButton({
  product,
}: {
  product: { id: string; title: string; price: number; imageUrl?: string | null };
}) {
  const mounted = useMounted();
  const add = useCart((s) => s.add);

  if (!mounted) return <Button disabled>Add to Cart</Button>;

  const img =
    product.imageUrl && product.imageUrl.length
      ? product.imageUrl.startsWith("/")
        ? product.imageUrl
        : `/${product.imageUrl}`
      : "";

  return (
    <Button
      type="button"
      onClick={() =>
        add({
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: img,
        })
      }
    >
      Add to Cart
    </Button>
  );
}