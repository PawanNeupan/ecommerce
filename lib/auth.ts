import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret_change_me");

export type SessionUser = {
  userId: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
};

export async function setSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  (await cookies()).set(COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") throw new Error("UNAUTHORIZED");
  return s;
}