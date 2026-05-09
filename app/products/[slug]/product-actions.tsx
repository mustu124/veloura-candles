"use client";

import { Heart, ShoppingBag } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { useStore } from "@/components/store";

export function ProductActions({ product }: { product: CatalogProduct }) {
  const { addToCart, toggleWish, wishlist } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <div className="mt-8 flex gap-3">
      <button onClick={() => addToCart(product)} className="magnetic flex flex-1 items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-medium text-cream">
        <ShoppingBag size={18} /> Add to inquiry
      </button>
      <button aria-label="Wishlist" onClick={() => toggleWish(product.slug)} className="rounded-full border border-ink/10 px-5">
        <Heart fill={wished ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
