import { prisma } from "@/lib/db";
import ProductCard from "./components/ProductCard";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <section className="rounded-2xl border p-6">
        <h1 className="text-3xl font-semibold">Welcome to MyShop</h1>
        <p className="mt-2 text-muted-foreground">
          Simple eCommerce website with Admin product management, cart, and orders.
        </p>
      </section>

      <h2 className="mt-8 text-xl font-semibold">Latest Products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: { id: string; title: string; description: string; price: number; }) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}