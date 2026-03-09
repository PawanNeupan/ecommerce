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
  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

const btnBase =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

const btnSm = "h-9 px-4";
const btnIcon = "h-9 w-9";

const btnPrimary = "bg-primary text-primary-foreground hover:bg-primary/90";
const btnOutline = "border border-border bg-background hover:bg-accent hover:text-accent-foreground";
const btnGhost = "hover:bg-accent hover:text-accent-foreground";

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
            M
          </div>
          <span className="font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            MyShop
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
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
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Separator orientation="vertical" className="mx-2 h-5" />
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
              <Separator orientation="vertical" className="mx-2 h-5" />
              <Link href="/login" className={`${btnBase} ${btnSm} ${btnOutline}`}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className={`${btnBase} ${btnSm} ${btnPrimary} ml-1`}>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
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

            <SheetContent side="right" className="w-72 bg-background p-0">
              {/* Sheet header */}
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                    M
                  </div>
                  <span className="font-semibold tracking-tight">MyShop</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-4 text-sm">
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
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    )}
                    <Separator className="my-2" />
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
                    <Separator className="my-2" />
                    <Link href="/login" className={`${btnBase} ${btnSm} ${btnOutline} justify-start`}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                    <Link href="/signup" className={`${btnBase} ${btnSm} ${btnPrimary} justify-start mt-1`}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
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