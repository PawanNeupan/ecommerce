"use client";

import { logoutAction } from "@/app/actions/auth.actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const r = useRouter();

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await logoutAction();
        r.push("/");
        r.refresh();
      }}
    >
      Logout
    </Button>
  );
}