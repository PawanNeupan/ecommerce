"use server";

import { prisma } from "@/lib/db";
import { setSession, clearSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) throw new Error("Email and password required");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already used");

  const hash = await bcrypt.hash(password, 10);

  // simple rule: env ADMIN_EMAIL becomes ADMIN
  const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

  const user = await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hash,
      role: isAdmin ? "ADMIN" : "CUSTOMER",
    },
    select: { id: true, email: true, role: true },
  });

  await setSession({ userId: user.id, email: user.email, role: user.role });
  return { ok: true, role: user.role };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  await setSession({ userId: user.id, email: user.email, role: user.role });
  return { ok: true, role: user.role };
}

export async function logoutAction() {
  await clearSession();
  return { ok: true };
}