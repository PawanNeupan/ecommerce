"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EsewaFailure() {
  const router = useRouter();
  return (
    <main className="mx-auto max-w-xl p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold text-red-600">Payment Failed ❌</h1>
      <Button onClick={() => router.push("/checkout")}>Back to checkout</Button>
    </main>
  );
}