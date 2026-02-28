"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import type { CartItem } from "@/lib/cart-store";
import { getSession } from "@/lib/auth"; // if you have it; otherwise remove

function absImageUrl(imageUrl: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const p = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${base}${p}`;
}

export async function createStripeCheckoutSessionAction(items: CartItem[]) {
  if (!items?.length) throw new Error("Cart is empty");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL missing");

  // Optional: attach userId if logged in
  let userId: string | null = null;
  try {
    const s = await getSession();
    userId = (s as any)?.userId ?? null;
  } catch {
    userId = null;
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  // 1) Create Stripe session first
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout?canceled=1`,
    line_items: items.map((x) => ({
      quantity: x.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(x.price * 100),
        product_data: {
          name: x.title,
          images: x.imageUrl ? [absImageUrl(x.imageUrl)] : [],
          metadata: { productId: x.productId },
        },
      },
    })),
    metadata: {
      // helpful in webhook
      userId: userId ?? "",
    },
  });

  // 2) Create DB order as PENDING and store Stripe session id in paymentRef
  await prisma.order.create({
    data: {
      userId: userId ?? undefined,
      status: "PENDING",
      total,
      paymentProvider: "STRIPE",
      paymentStatus: "UNPAID",
      paymentRef: session.id, // ✅ link order to Stripe session
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          qty: i.qty,
          imageUrl: i.imageUrl || null,
        })),
      },
    },
  });

  return session.url;
}