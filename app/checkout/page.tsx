"use client";

import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const { items } = useCart();

  if (!mounted) return <p className="p-6">Loading...</p>;

  if (items.length === 0)
    return <p className="p-6 text-center">Your cart is empty.</p>;

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between">
              <span>
                {i.title} × {i.qty}
              </span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={() => router.push("/checkout/stripe")}
          >
            Pay with Stripe
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/checkout/esewa")}
          >
            Pay with eSewa
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/checkout/khalti")}
          >
            Pay with Khalti
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}