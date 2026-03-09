"use client";

import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import CheckoutButton from "./CheckoutButton";
import { Trash2, Minus, Plus, ShoppingCart, X } from "lucide-react";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

export default function CartClient() {
  const mounted = useMounted();
  const { items, remove, setQty, clear } = useCart();

  if (!mounted)
    return (
      <div className="mt-8 flex items-center justify-center text-muted-foreground">
        Loading cart...
      </div>
    );

  if (items.length === 0)
    return (
      <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-9 w-9 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Add some products to get started.
        </p>
      </div>
    );

  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className="mt-6 space-y-4">
      {/* Cart items */}
      {items.map((x) => {
        const imgSrc = normalizeImageUrl(x.imageUrl);
        const subtotal = x.price * x.qty;

        return (
          <div
            key={x.productId}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
          >
            {/* Image */}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={x.title}
                className="h-20 w-20 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{x.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Rs. {x.price.toFixed(2)} each
              </p>
              <p className="text-sm font-bold text-primary mt-1">
                Rs. {subtotal.toFixed(2)}
              </p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              <button
                onClick={() => setQty(x.productId, Math.max(1, x.qty - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                {x.qty}
              </span>
              <button
                onClick={() => setQty(x.productId, x.qty + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => remove(x.productId)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {/* Footer */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        {/* Item count + clear */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {items.length} {items.length === 1 ? "item" : "items"} in cart
          </span>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-3 w-3" />
            Clear cart
          </button>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Total amount</p>
            <p className="text-2xl font-bold text-foreground">
              Rs. {total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Checkout */}
        <CheckoutButton />
      </div>
    </div>
  );
}