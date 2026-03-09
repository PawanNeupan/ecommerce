import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Menu,
  ShoppingBag,
  Package,
  ShoppingCart,
  Shield,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";

const linkBase =
  "flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:text-primary";

const btnBase =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

const btnSm = "h-9 px-3";
const btnIcon = "h-9 w-9";

const btnPrimary =
  "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]";
const btnOutline =
  "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
const btnGhost =
  "hover:bg-accent hover:text-accent-foreground transition-colors";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b bg-red-950/50 rounded-b-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-primary transition-colors"
        >
          MyShop
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {session ? (
            <>
              <Link href="/products" className={linkBase}>
                <ShoppingBag className="h-4 w-4" />
                Products
              </Link>

              <Link href="/orders" className={linkBase}>
                <Package className="h-4 w-4" />
                Orders
              </Link>

              <Link href="/cart" className={linkBase}>
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>

              {session.role === "ADMIN" && (
                <Link href="/admin" className={linkBase}>
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}

              <Separator orientation="vertical" className="h-5" />

              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/products" className={linkBase}>
                <ShoppingBag className="h-4 w-4" />
                Products
              </Link>

              <Link href="/contact" className={linkBase}>
                <Phone className="h-4 w-4" />
                Contact
              </Link>

              <Separator orientation="vertical" className="h-5" />

              <Link href="/login" className={`${btnBase} ${btnSm} ${btnOutline}`}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>

              <Link href="/signup" className={`${btnBase} ${btnSm} ${btnPrimary}`}>
                <UserPlus className="mr-2 h-4 w-4" />
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className={`${btnBase} ${btnIcon} ${btnGhost}`}
              aria-label="Open menu"
              type="button"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="mt-6 flex flex-col gap-4 text-sm">
                {session ? (
                  <>
                    <Link href="/products" className={linkBase}>
                      <ShoppingBag className="h-4 w-4" />
                      Products
                    </Link>

                    <Link href="/orders" className={linkBase}>
                      <Package className="h-4 w-4" />
                      Orders
                    </Link>

                    <Link href="/cart" className={linkBase}>
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </Link>

                    {session.role === "ADMIN" && (
                      <Link href="/admin" className={linkBase}>
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    )}

                    <Separator />

                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link href="/products" className={linkBase}>
                      <ShoppingBag className="h-4 w-4" />
                      Products
                    </Link>

                    <Link href="/contact" className={linkBase}>
                      <Phone className="h-4 w-4" />
                      Contact
                    </Link>

                    <Separator />

                    <Link
                      href="/login"
                      className={`${btnBase} ${btnSm} ${btnOutline}`}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>

                    <Link
                      href="/signup"
                      className={`${btnBase} ${btnSm} ${btnPrimary}`}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}