"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyKhaltiPaymentAction } from "@/app/actions/khalti";
import { useCart } from "@/lib/cart-store";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerifyState = "loading" | "success" | "failed" | "error";

export default function KhaltiVerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { clear } = useCart();

  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const pidx = params.get("pidx");
    const statusFromUrl = params.get("status");

    if (!pidx) {
      setState("error");
      setMessage("No payment reference found in the URL.");
      return;
    }

    if (statusFromUrl === "User canceled") {
      setState("failed");
      setMessage("You cancelled the payment. Your order has not been placed.");
      return;
    }

    verifyKhaltiPaymentAction(pidx)
      .then(({ success, status }) => {
        if (success) {
          clear();
          setState("success");
          setMessage("Your payment was successful! Your order is confirmed.");
        } else {
          setState("failed");
          setMessage(
            `Payment not completed (status: ${status}). No charge was made.`
          );
        }
      })
      .catch((err: any) => {
        setState("error");
        setMessage(err.message ?? "Verification failed. Please contact support.");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#5C2D91]" />
            <h1 className="text-xl font-semibold">Verifying your payment…</h1>
            <p className="text-muted-foreground text-sm">Please wait.</p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold text-green-700">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/orders")}>View Orders</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
            </div>
          </>
        )}

        {(state === "failed" || state === "error") && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/checkout")}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
