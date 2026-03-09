"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({
  product,
}: {
  product: { id: string; title: string; price: number; imageUrl?: string | null };
}) {
  const mounted = useMounted();
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [animating, setAnimating] = useState(false);

  if (!mounted)
    return (
      <button
        disabled
        className="relative w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary/50 px-4 py-2 text-sm font-medium text-primary-foreground cursor-not-allowed"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </button>
    );

  const img =
    product.imageUrl && product.imageUrl.length
      ? product.imageUrl.startsWith("/")
        ? product.imageUrl
        : `/${product.imageUrl}`
      : "";

  function handleAdd() {
    if (added) return;

    // pop animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    add({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: img,
    });

    // success state
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`
        relative w-full inline-flex items-center justify-center gap-2
        rounded-md px-4 py-2 text-sm font-medium
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${added
          ? "bg-red-800 text-white scale-[0.98]"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
        }
        ${animating ? "scale-90" : ""}
      `}
    >
      {/* icon */}
      <span className={`transition-all duration-300 ${added ? "scale-125" : "scale-100"}`}>
        {added ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </span>

      {/* label */}
      <span>{added ? "Added!" : "Add to Cart"}</span>

      {/* ripple burst */}
      {animating && (
        <span className="absolute inset-0 rounded-md animate-ping bg-primary/30 pointer-events-none" />
      )}
    </button>
  );
}