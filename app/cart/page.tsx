import CartClient from "../components/CartClient";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <CartClient />
    </main>
  );
}