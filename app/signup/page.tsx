"use client";

import { useState } from "react";
import { signupAction } from "@/app/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Mail, Lock, UserPlus, AlertCircle, Loader2, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const r = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
            M
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join MyShop and start shopping today
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          <form
            className="space-y-5"
            action={async (fd) => {
              setError("");
              setLoading(true);
              try {
                const res = await signupAction(fd);
                if (res.role === "ADMIN") r.push("/admin");
                else r.push("/");
                r.refresh();
              } catch (e: any) {
                setError(e?.message || "Signup failed. Please try again.");
                setLoading(false);
              }
            }}
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Name <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="name"
                  placeholder="Your name"
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                  required
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  required
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                relative w-full inline-flex items-center justify-center gap-2
                rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground
                transition-all duration-200
                hover:bg-primary/90 hover:scale-[1.01]
                active:scale-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-muted-foreground">
          🔒 Your information is encrypted and secure
        </p>
      </div>
    </main>
  );
}