import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import KhaltiVerifyClient from "./KhaltiVerifyClient";

export default function KhaltiVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#5C2D91]" />
            <p className="text-muted-foreground text-sm">Verifying payment…</p>
          </div>
        </main>
      }
    >
      <KhaltiVerifyClient />
    </Suspense>
  );
}