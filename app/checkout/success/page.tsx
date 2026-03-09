"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground">
          Your order has been confirmed and is being processed.
        </p>
        <p className="text-xs text-muted-foreground break-all">
          Session: {sp.get("session_id")}
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