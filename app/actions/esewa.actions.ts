"use server";

import crypto from "crypto";
import { prisma } from "@/lib/db";
import type { CartItem } from "@/lib/cart-store";

function toBase64HmacSha256(secret: string, message: string) {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

export async function createEsewaPayloadAction(items: CartItem[]) {
  if (!items?.length) throw new Error("Cart is empty");

  const total = Number(items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2));
  const transaction_uuid = crypto.randomUUID();

  const product_code = process.env.ESEWA_PRODUCT_CODE!;
  const secret = process.env.ESEWA_SECRET_KEY!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // ✅ IMPORTANT: signed fields required by eSewa v2
  const signed_field_names = "total_amount,transaction_uuid,product_code";

  // ✅ Common v2 signing format:
  // total_amount=xx.xx,transaction_uuid=uuid,product_code=EPAYTEST
  const signString = `total_amount=${total},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = toBase64HmacSha256(secret, signString);

  // Create DB order as pending
  await prisma.order.create({
    data: {
      total,
      status: "PENDING",
      paymentProvider: "ESEWA",
      paymentStatus: "UNPAID",
      paymentRef: transaction_uuid,
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

  return {
    amount: total,
    tax_amount: 0,
    total_amount: total,
    transaction_uuid,
    product_code,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `${appUrl}/checkout/esewa/success?uuid=${transaction_uuid}`,
    failure_url: `${appUrl}/checkout/esewa/failure?uuid=${transaction_uuid}`,
    signed_field_names,
    signature,
  };
}

export async function markEsewaPaidAction(uuid: string) {
  await prisma.order.updateMany({
    where: { paymentProvider: "ESEWA", paymentRef: uuid },
    data: { status: "PAID", paymentStatus: "PAID" },
  });
}