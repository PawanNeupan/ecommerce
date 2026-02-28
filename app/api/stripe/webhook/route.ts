import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text(); // raw body required
  const sig = (await headers()).get("stripe-signature");

  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Payment completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // session.id is the Checkout Session ID we saved in paymentRef
    await prisma.order.updateMany({
      where: { paymentRef: session.id, paymentProvider: "STRIPE" },
      data: {
        status: "PAID",
        paymentStatus: "PAID",
      },
    });
  }

  // Optional: handle failed payments/refunds too
  // event.type === "payment_intent.payment_failed" etc.

  return new Response("OK", { status: 200 });
}