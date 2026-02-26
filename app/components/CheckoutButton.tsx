"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/app/components/useMounted";

export default function CheckoutButton() {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCart((s) => s.items);

  if (!mounted) return <Button disabled>Checkout</Button>;

  return (
    <Button
      type="button"
      disabled={items.length === 0}
      onClick={() => router.push("/checkout")}
    >
      Checkout
    </Button>
  );
}