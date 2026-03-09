"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEsewaPayloadAction } from "@/app/actions/esewa.actions";
import Image from "next/image";

export default function EsewaPage() {
  const mounted = useMounted();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <p className="p-6">Loading...</p>;
  if (items.length === 0)
    return <p className="p-6 text-center">Your cart is empty.</p>;

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const pay = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await createEsewaPayloadAction(items);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = process.env.NEXT_PUBLIC_ESEWA_FORM_URL!;

      Object.entries(payload).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setError(err.message ?? "eSewa init failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((i) => (
            <div
              key={i.productId}
              className="flex items-center justify-between gap-4"
            >
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

      {/* Pay Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#60BB46] flex items-center justify-center text-white font-bold text-sm">
              e
            </div>
            <CardTitle>Pay with eSewa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be redirected to eSewa&apos;s secure payment page to
            complete your purchase.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </p>
          )}

          <Button
            className="w-full bg-[#60BB46] hover:bg-[#4fa336] text-white"
            onClick={pay}
            disabled={loading}
          >
            {loading ? "Redirecting to eSewa…" : `Pay Rs. ${total.toFixed(2)}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Secured by eSewa · Test mode active
          </p>
        </CardContent>
      </Card>
    </main>
  );
}