"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, type CatalogProduct } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { useStore } from "./store";

export function ProductExperience({ products }: { products: CatalogProduct[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [preview, setPreview] = useState<CatalogProduct | null>(null);
  const { addToCart } = useStore();

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category.replaceAll(" ", "_").toUpperCase();
      const searchMatch = [product.name, product.description, product.notes.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase());
      return categoryMatch && searchMatch;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, category, query, sort]);

  return (
    <section id="collections" className="bg-cream px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[.32em] text-amber">The collection</p>
            <h2 className="mt-4 max-w-2xl font-serif text-6xl leading-none md:text-7xl">Fifty signatures, each with a private atmosphere.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 rounded-full border border-ink/10 bg-porcelain px-4 py-3">
              <Search size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes" className="w-full bg-transparent outline-none" />
            </label>
            <label className="flex items-center gap-2 rounded-full border border-ink/10 bg-porcelain px-4 py-3">
              <SlidersHorizontal size={17} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none">
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price low</option>
                <option value="price-desc">Price high</option>
              </select>
            </label>
          </div>
        </div>
        <div className="hide-scrollbar mt-10 flex gap-3 overflow-x-auto">
          {["All", ...categories].map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm transition ${category === item ? "border-ink bg-ink text-cream" : "border-ink/10 bg-porcelain text-ink/70"}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.slug} product={product} onPreview={setPreview} />)}
        </div>
      </div>
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-ink/70 p-4 backdrop-blur-xl" onClick={() => setPreview(null)}>
            <motion.div initial={{ y: 40, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .98 }} className="grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-porcelain md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
              <div className="relative min-h-[420px]">
                <Image src={preview.image} alt={preview.name} fill className="object-cover" />
              </div>
              <div className="overflow-y-auto p-8">
                <button className="float-right rounded-full border border-ink/10 p-2" onClick={() => setPreview(null)}><X size={18} /></button>
                <p className="text-xs uppercase tracking-[.3em] text-amber">Quick preview</p>
                <h3 className="mt-5 font-serif text-6xl leading-none">{preview.name}</h3>
                <p className="mt-4 text-2xl">{formatMoney(preview.price)}</p>
                <p className="mt-6 leading-7 text-ink/66">{preview.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {preview.notes.map((note) => <span key={note} className="rounded-full border border-ink/10 px-3 py-1 text-sm">{note}</span>)}
                </div>
                <button onClick={() => addToCart(preview)} className="mt-8 w-full rounded-full bg-ink px-6 py-4 text-cream">Add to inquiry</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
