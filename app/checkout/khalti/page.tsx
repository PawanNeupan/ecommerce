"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createKhaltiPaymentAction } from "@/app/actions/khalti";
import Image from "next/image";

export default function KhaltiCheckoutPage() {
  const mounted = useMounted();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <p className="p-6">Loading...</p>;
  if (items.length === 0)
    return <p className="p-6 text-center">Your cart is empty.</p>;

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const paymentUrl = await createKhaltiPaymentAction(items);
      window.location.href = paymentUrl;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {i.imageUrl && (
                  <Image
                    src={i.imageUrl}
                    alt={i.title}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                )}
                <span className="text-sm">
                  {i.title}{" "}
                  <span className="text-muted-foreground">× {i.qty}</span>
                </span>
              </div>
              <span className="font-medium text-sm">
                Rs. {(i.price * i.qty).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5C2D91] flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <CardTitle>Pay with Khalti</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be redirected to Khalti&apos;s secure payment page to
            complete your purchase.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </p>
          )}

          <Button
            className="w-full bg-[#5C2D91] hover:bg-[#4a2275] text-white"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Redirecting to Khalti…" : `Pay Rs. ${total.toFixed(2)}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Secured by Khalti · Test mode active
          </p>
        </CardContent>
      </Card>
    </main>
  );
}