import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          MyShop
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/contact">Contact</Link>

          {!session ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </>
          ) : (
            <>
              {session.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <LogoutButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}