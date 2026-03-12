"use client";

import { Suspense } from "react";
import EsewaSuccessContent from "./success-content";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading payment result...</div>}>
      <EsewaSuccessContent />
    </Suspense>
  );
}