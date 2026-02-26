"use client";

import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { Button } from "@/components/ui/button";
import CheckoutButton from "./CheckoutButton";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

export default function CartClient() {
  const mounted = useMounted();
  const { items, remove, setQty, clear } = useCart();

  if (!mounted) return <p className="mt-4">Loading cart...</p>;
  if (items.length === 0) return <p className="mt-4">Cart is empty.</p>;

  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className="mt-4 space-y-4">
      {items.map((x) => {
        const imgSrc = normalizeImageUrl(x.imageUrl);
        const subtotal = x.price * x.qty;

        return (
          <div
            key={x.productId}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-4">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={x.title}
                  className="h-16 w-16 rounded object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded bg-muted" />
              )}

              <div>
                <div className="font-medium">{x.title}</div>
                <div className="text-sm text-muted-foreground">
                  Price: ${x.price.toFixed(2)}
                </div>
                <div className="text-sm font-semibold">
                  Subtotal: ${subtotal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="w-16 rounded-md border px-2 py-1"
                type="number"
                min={1}
                value={x.qty}
                onChange={(e) =>
                  setQty(x.productId, Math.max(1, Number(e.target.value)))
                }
              />

              <Button variant="outline" onClick={() => remove(x.productId)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>

      <CheckoutButton />
    </div>
  );
}