"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { markEsewaPaidAction } from "@/app/actions/esewa.actions";

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
    <main className="mx-auto max-w-xl p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold text-green-600">
        eSewa Payment Success ✅
      </h1>
      <Button onClick={() => router.push("/products")}>Continue shopping</Button>
    </main>
  );
}