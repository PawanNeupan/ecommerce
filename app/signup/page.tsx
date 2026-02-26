"use client";

import { useState } from "react";
import { signupAction } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const r = useRouter();
  const [error, setError] = useState("");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Signup</h1>

      <form
        className="mt-6 space-y-3"
        action={async (fd) => {
          setError("");
          try {
            const res = await signupAction(fd);
            if (res.role === "ADMIN") r.push("/admin");
            else r.push("/");
            r.refresh();
          } catch (e: any) {
            setError(e?.message || "Signup failed");
          }
        }}
      >
        <Input name="name" placeholder="Name (optional)" />
        <Input name="email" placeholder="Email" type="email" required />
        <Input name="password" placeholder="Password" type="password" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button className="w-full" type="submit">Create Account</Button>
      </form>
    </main>
  );
}