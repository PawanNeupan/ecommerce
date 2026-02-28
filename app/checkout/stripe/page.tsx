"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { createStripeCheckoutSessionAction } from "@/app/actions/stripe.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StripeCheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const [loading, setLoading] = useState(false);

  if (!mounted) return <p className="p-6">Loading...</p>;
  if (items.length === 0) return <p className="p-6">Cart is empty.</p>;

  const pay = async () => {
    setLoading(true);
    try {
      const url = await createStripeCheckoutSessionAction(items);
      if (!url) throw new Error("No Stripe URL returned");
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert("Stripe checkout failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pay with Stripe</h1>
      <p className="text-muted-foreground">
        You will be redirected to Stripe to complete payment.
      </p>

      <div className="flex gap-3">
        <Button onClick={pay} disabled={loading}>
          {loading ? "Redirecting..." : "Proceed to Stripe"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/checkout")} disabled={loading}>
          Back
        </Button>
      </div>
    </main>
  );
}