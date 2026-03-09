"use server";

import { prisma } from "@/lib/db";
import { OrderStatus, PaymentStatus, PaymentProvider } from "@prisma/client";
import type { CartItem } from "@/lib/cart-store";
import { getSession } from "@/lib/auth";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY!;
const KHALTI_INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

// ─── 1. Initiate Payment ──────────────────────────────────────────────────────
export async function createKhaltiPaymentAction(items: CartItem[]) {
  if (!items?.length) throw new Error("Cart is empty");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL missing");
  if (!KHALTI_SECRET_KEY) throw new Error("KHALTI_SECRET_KEY missing");

  // Optional: get logged-in userId
  let userId: string | null = null;
  try {
    const s = await getSession();
    userId = (s as any)?.userId ?? null;
  } catch {
    userId = null;
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Khalti requires amount in paisa (NPR × 100)
  const amountInPaisa = Math.round(total * 100);

  const purchaseOrderId = `ORDER_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase()}`;

  const payload = {
    return_url: `${baseUrl}/checkout/khalti/verify`,
    website_url: baseUrl,
    amount: amountInPaisa,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: `Cart Purchase (${items.length} item${
      items.length > 1 ? "s" : ""
    })`,
    product_details: items.map((i) => ({
      identity: i.productId,
      name: i.title,
      total_price: Math.round(i.price * i.qty * 100),
      quantity: i.qty,
      unit_price: Math.round(i.price * 100),
    })),
  };

  const res = await fetch(KHALTI_INITIATE_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Khalti initiation failed: ${errText}`);
  }

  const data = await res.json();
  // data.pidx      → unique payment identifier
  // data.payment_url → redirect user here

  // Create order in DB as PENDING, link via pidx
  await prisma.order.create({
    data: {
      userId: userId ?? undefined,
      status: OrderStatus.PENDING,
      total,
      paymentProvider: PaymentProvider.KHALTI,
      paymentStatus: PaymentStatus.UNPAID,
      paymentRef: data.pidx,
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

  return data.payment_url as string;
}

// ─── 2. Verify Payment ────────────────────────────────────────────────────────
// Khalti redirects to /checkout/khalti/verify?pidx=...&status=Completed&...

export type KhaltiStatus =
  | "Completed"
  | "Pending"
  | "Initiated"
  | "Refunded"
  | "Expired"
  | "User canceled";

export interface KhaltiLookupResult {
  pidx: string;
  status: KhaltiStatus;
  transaction_id: string | null;
  total_amount: number; // in paisa
  purchase_order_id: string;
}

export async function verifyKhaltiPaymentAction(
  pidx: string
): Promise<{ success: boolean; status: KhaltiStatus; data: KhaltiLookupResult }> {
  if (!pidx) throw new Error("pidx is required");

  const res = await fetch(KHALTI_LOOKUP_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Khalti lookup failed: ${errText}`);
  }

  const data: KhaltiLookupResult = await res.json();

  if (data.status === "Completed") {
    await prisma.order.updateMany({
      where: { paymentRef: pidx },
      data: {
        status: OrderStatus.PAID,           // ✅ matches your enum
        paymentStatus: PaymentStatus.PAID,  // ✅ matches your enum
      },
    });
    return { success: true, status: "Completed", data };
  }

  if (data.status === "User canceled" || data.status === "Expired") {
    await prisma.order.updateMany({
      where: { paymentRef: pidx },
      data: {
        status: OrderStatus.CANCELLED,       // ✅ matches your enum
        paymentStatus: PaymentStatus.FAILED, // ✅ matches your enum
      },
    });
  }

  return { success: false, status: data.status, data };
}