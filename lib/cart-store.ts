import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  imageUrl: string; // ✅ store image path here
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
            ),
          });
          return;
        }

        set({ items: [...get().items, { ...item, qty: 1 }] });
      },

      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      setQty: (productId, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, qty } : i
          ),
        }),

      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);