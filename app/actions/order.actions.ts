"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type CartItem = {
  productId: string;
  title: string;
  price: number; // cents
  qty: number;
};

export async function placeOrderAction(items: CartItem[]) {
  const s = await getSession();
  if (!s) throw new Error("Please login first");

  if (!items?.length) throw new Error("Cart is empty");

  // calculate total
  const total = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  // optional: you can validate product stock here (kept simple)
  const order = await prisma.order.create({
    data: {
      userId: s.userId,
      total,
      status: "PENDING",
      items: {
        create: items.map((x) => ({
          productId: x.productId,
          title: x.title,
          price: x.price,
          qty: x.qty,
        })),
      },
    },
  });

  revalidatePath("/orders");
  return { ok: true, orderId: order.id };
}

export async function myOrdersAction() {
  const s = await getSession();
  if (!s) throw new Error("Please login first");

  const orders = await prisma.order.findMany({
    where: { userId: s.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return { orders };
}