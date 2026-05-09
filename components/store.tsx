"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/catalog";

export type CartItem = Pick<CatalogProduct, "slug" | "name" | "price" | "image"> & { quantity: number };

type Store = {
  cart: CartItem[];
  wishlist: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  addToCart: (product: Pick<CatalogProduct, "slug" | "name" | "price" | "image">) => void;
  updateQty: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  toggleWish: (slug: string) => void;
  clear: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCart(readStoredCart());
    setWishlist(readStoredWishlist());
  }, []);

  useEffect(() => localStorage.setItem("velora_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("velora_wishlist", JSON.stringify(wishlist)), [wishlist]);

  const value = useMemo<Store>(() => ({
    cart,
    wishlist,
    open,
    setOpen,
    addToCart(product) {
      setCart((items) => {
        const existing = items.find((item) => item.slug === product.slug);
        if (existing) return items.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item);
        return [...items, { ...product, quantity: 1 }];
      });
      setOpen(true);
    },
    updateQty(slug, quantity) {
      setCart((items) => items.map((item) => item.slug === slug ? { ...item, quantity } : item).filter((item) => item.quantity > 0));
    },
    remove(slug) {
      setCart((items) => items.filter((item) => item.slug !== slug));
    },
    toggleWish(slug) {
      setWishlist((items) => items.includes(slug) ? items.filter((item) => item !== slug) : [...items, slug]);
    },
    clear() {
      setCart([]);
    }
  }), [cart, wishlist, open]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside CartProvider");
  return store;
}

function readStoredCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem("velora_cart") || "[]") as Partial<CartItem>[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        slug: typeof item.slug === "string" ? item.slug : "",
        name: typeof item.name === "string" ? item.name : "",
        image: typeof item.image === "string" ? item.image : "",
        price: Number(item.price),
        quantity: Number(item.quantity)
      }))
      .filter((item): item is CartItem =>
        Boolean(item.slug) &&
        Boolean(item.name) &&
        Boolean(item.image) &&
        Number.isFinite(item.price) &&
        item.price > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
  } catch {
    return [];
  }
}

function readStoredWishlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem("velora_wishlist") || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
  } catch {
    return [];
  }
}
