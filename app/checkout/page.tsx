"use client";

import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, ChevronRight, Lock } from "lucide-react";

function normalizeImageUrl(url?: string | null) {
  if (!url) return "";
  return url.startsWith("/") ? url : `/${url}`;
}

const PAYMENT_METHODS = [
  {
    id: "stripe",
    label: "Pay with Stripe",
    description: "Credit / Debit card via Stripe",
    route: "/checkout/stripe",
    badgeBg: "bg-[#635BFF]",
    cardHover: "hover:border-[#635BFF] hover:shadow-[0_0_0_1px_#635BFF20]",
    accentText: "text-[#635BFF]",
    accentBg: "bg-[#635BFF]/10",
    letter: "S",
  },
  {
    id: "esewa",
    label: "Pay with eSewa",
    description: "Pay using your eSewa wallet",
    route: "/checkout/esewa",
    badgeBg: "bg-[#60BB46]",
    cardHover: "hover:border-[#60BB46] hover:shadow-[0_0_0_1px_#60BB4620]",
    accentText: "text-[#60BB46]",
    accentBg: "bg-[#60BB46]/10",
    letter: "e",
  },
  {
    id: "khalti",
    label: "Pay with Khalti",
    description: "Pay using your Khalti wallet",
    route: "/checkout/khalti",
    badgeBg: "bg-[#5C2D91]",
    cardHover: "hover:border-[#5C2D91] hover:shadow-[0_0_0_1px_#5C2D9120]",
    accentText: "text-[#5C2D91]",
    accentBg: "bg-[#5C2D91]/10",
    letter: "K",
  },
];

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const { items } = useCart();

  if (!mounted)
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );

  if (items.length === 0)
    return (
      <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-9 w-9 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Add some products before checking out.
        </p>
      </div>
    );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          Checkout
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          Complete your order
        </h1>
      </div>

      {/* Order Summary */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Order Summary</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="divide-y divide-border">
          {items.map((i) => {
            const imgSrc = normalizeImageUrl(i.imageUrl);
            return (
              <div key={i.productId} className="flex items-center gap-4 px-5 py-3">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={i.title}
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {i.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rs. {i.price.toFixed(2)} × {i.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0">
                  Rs. {(i.price * i.qty).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-4">
          <span className="text-sm text-muted-foreground">Total amount</span>
          <span className="text-xl font-bold text-foreground">
            Rs. {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Method Cards */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Select Payment Method</h2>
        <p className="text-xs text-muted-foreground -mt-1">
          Choose your preferred payment option to continue
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => router.push(m.route)}
              className={`
                group relative flex flex-col items-center gap-4 rounded-xl border border-border
                bg-card p-6 text-center shadow-sm
                transition-all duration-200
                hover:-translate-y-1 hover:shadow-md
                active:scale-95
                ${m.cardHover}
              `}
            >
              {/* Brand badge */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${m.badgeBg} text-white font-bold text-xl shadow-sm`}
              >
                {m.letter}
              </div>

              {/* Label */}
              <div>
                <p className={`font-semibold text-sm ${m.accentText}`}>
                  {m.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${m.accentBg} ${m.accentText} transition-all group-hover:gap-2`}
              >
                Continue
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security note */}
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        All transactions are secure and encrypted
      </p>
    </main>
  );
}