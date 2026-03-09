"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { markEsewaPaidAction } from "@/app/actions/esewa.actions";
import { CheckCircle } from "lucide-react";

export default function EsewaSuccess() {
  const sp = useSearchParams();
  const uuid = sp.get("uuid");
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  useEffect(() => {
    if (!uuid) return;
    markEsewaPaidAction(uuid);
    clear();
  }, [uuid, clear]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Your eSewa payment was confirmed and your order is being processed.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/orders")}>View Orders</Button>
          <Button variant="outline" onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </main>
  );
}