"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Menu, Moon, ShoppingBag, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useStore } from "./store";

export function FloatingNav() {
  const { cart, wishlist, setOpen } = useStore();
  const { theme, setTheme } = useTheme();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-6xl -translate-x-1/2 rounded-full border border-white/15 bg-ink/72 px-4 py-3 text-cream shadow-velvet backdrop-blur-2xl"
    >
      <nav className="flex items-center justify-between gap-3">
        <Link href="/" className="font-serif text-2xl tracking-wide">Maison Velora</Link>
        <div className="hidden items-center gap-7 text-sm uppercase tracking-[.24em] text-cream/75 md:flex">
          <Link href="/#collections">Collections</Link>
          <Link href="/#story">Story</Link>
          <Link href="/#quiz">Fragrance Quiz</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Toggle theme" className="rounded-full border border-white/10 p-2" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link aria-label="Wishlist" href="/#collections" className="relative rounded-full border border-white/10 p-2">
            <Heart size={17} />
            {wishlist.length > 0 && <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-champagne px-1 text-center text-[10px] text-ink">{wishlist.length}</span>}
          </Link>
          <button aria-label="Open cart" className="relative rounded-full bg-cream p-2 text-ink" onClick={() => setOpen(true)}>
            <ShoppingBag size={17} />
            {count > 0 && <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-champagne px-1 text-center text-[10px]">{count}</span>}
          </button>
          <button aria-label="Menu" className="rounded-full border border-white/10 p-2 md:hidden"><Menu size={17} /></button>
        </div>
      </nav>
    </motion.header>
  );
}
