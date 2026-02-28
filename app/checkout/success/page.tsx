"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Payment Successful ✅</h1>
      <p className="text-muted-foreground">Session: {sp.get("session_id")}</p>

      <Button onClick={() => router.push("/products")}>Continue shopping</Button>
    </main>
  );
}