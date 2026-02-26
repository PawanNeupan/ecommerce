"use client";

import { adminCreateProductAction } from "@/app/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminProductForm() {
  const [error, setError] = useState("");

  return (
    <form
      className="mt-4 grid gap-2 rounded-xl border p-4 md:grid-cols-4"
      action={async (fd) => {
        setError("");
        try {
          await adminCreateProductAction(fd);
        } catch (e: any) {
          setError(e?.message || "Failed");
        }
      }}
    >
      <Input name="title" placeholder="Title" required />
      <Input name="description" placeholder="Description" required />
      <Input name="price" type="number" placeholder="Price (cents)" required />
      <Input name="stock" type="number" placeholder="Stock" defaultValue={10} />

      <Input name="image" type="file" accept="image/*" className="md:col-span-4" required />

      <div className="md:col-span-4 flex items-center gap-3">
        <Button type="submit">Add Product</Button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}