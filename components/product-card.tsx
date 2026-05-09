"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Search, ShoppingBag, Star } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { useStore } from "./store";

export function ProductCard({ product, onPreview }: { product: CatalogProduct; onPreview: (product: CatalogProduct) => void }) {
  const { addToCart, wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.slug);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-porcelain shadow-sm ring-1 ring-ink/5">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
        <button aria-label="Wishlist" onClick={() => toggleWish(product.slug)} className="absolute right-3 top-3 rounded-full bg-cream/90 p-2 text-ink backdrop-blur">
          <Heart size={17} fill={wished ? "currentColor" : "none"} />
        </button>
        <button onClick={() => onPreview(product)} className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-cream/92 px-4 py-2 text-sm font-medium text-ink opacity-0 transition group-hover:opacity-100">
          <Search size={15} /> Preview
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[3.75rem] font-serif text-3xl leading-none">{product.name}</Link>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm text-ink/56">{product.notes.join(" / ")}</p>
          </div>
          <p className="shrink-0 font-medium">{formatMoney(product.price)}</p>
        </div>
        <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-ink/62">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="inline-flex items-center gap-1 text-sm text-ink/62"><Star size={15} fill="#d9b56f" className="text-champagne" /> {product.rating}</span>
          <span className={product.stock ? "text-sm text-moss" : "text-sm text-rosewood"}>{product.stock ? `${product.stock} in stock` : "Waitlist"}</span>
        </div>
        <button disabled={!product.stock} onClick={() => addToCart(product)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition hover:bg-obsidian disabled:cursor-not-allowed disabled:opacity-45">
          <ShoppingBag size={16} /> Add to inquiry
        </button>
      </div>
    </article>
  );
}
