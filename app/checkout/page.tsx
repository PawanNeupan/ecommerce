import CartClient from "@/app/components/CartClient";

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Review your cart and confirm order.
      </p>

      <CartClient />
    </main>
  );
}