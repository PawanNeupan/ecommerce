"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function adminCreateProductAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);

  const file = formData.get("image") as File | null;

  if (!title || !description || !price) throw new Error("Missing required fields");
  if (!file || file.size === 0) throw new Error("Image is required");
  if (!file.type.startsWith("image/")) throw new Error("Only image files allowed");

  // ✅ ensure uploads folder exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  // ✅ create file name
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;

  // ✅ write file
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  // ✅ store public path
  const imageUrl = `/uploads/${filename}`;

  await prisma.product.create({
    data: { title, description, price, stock, imageUrl, isActive: true },
  });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function adminDeleteProductAction(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  // delete image if local upload
  if (product.imageUrl?.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", product.imageUrl);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore missing file
    }
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function adminToggleProductAction(productId: string, isActive: boolean) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");
}