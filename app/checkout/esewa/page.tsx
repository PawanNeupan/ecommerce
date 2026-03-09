"use client";

import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";
import { Button } from "@/components/ui/button";
import { createEsewaPayloadAction } from "@/app/actions/esewa.actions";
import { useState } from "react";

export default function EsewaPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const [loading, setLoading] = useState(false);

  if (!mounted) return <p className="p-6">Loading...</p>;
  if (items.length === 0) return <p className="p-6">Cart is empty.</p>;

  const pay = async () => {
    setLoading(true);
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
    } catch (e) {
      console.error(e);
      alert("eSewa init failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Pay with eSewa</h1>
      <Button className="w-full" onClick={pay} disabled={loading}>
        {loading ? "Redirecting..." : "Proceed to eSewa"}
      </Button>
    </main>
  );
}