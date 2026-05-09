"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 120]);
  const opacity = useTransform(scrollY, [0, 520], [1, .42]);

  return (
    <section className="ambient-bg relative min-h-screen overflow-hidden px-5 pb-20 pt-32 text-cream">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <Image src="/assets/hero-candle.png" alt="Luxury candle arrangement" fill priority className="object-cover opacity-65 mix-blend-screen" sizes="100vw" />
      </motion.div>
      <div className="absolute left-[62%] top-[28%] h-24 w-12 rounded-full bg-amber/50 blur-2xl animate-flame" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/5 px-4 py-2 text-xs uppercase tracking-[.32em] text-champagne backdrop-blur">
            <Sparkles size={14} /> Private fragrance rituals
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="font-serif text-[clamp(4rem,10vw,9.5rem)] leading-[.82] tracking-normal">
            Candles with a cinematic soul.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="mt-8 max-w-xl text-lg leading-8 text-cream/76">
            Matte vessels, rare accords, and warm light designed for rooms that deserve a signature.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .36 }} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="#collections" className="magnetic inline-flex items-center justify-center gap-3 rounded-full bg-cream px-7 py-4 font-medium text-ink">
              Explore collection <ArrowRight size={18} />
            </Link>
            <Link href="#quiz" className="magnetic inline-flex items-center justify-center rounded-full border border-cream/25 px-7 py-4 text-cream">
              Find your fragrance
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 w-[min(90vw,780px)] -translate-x-1/2 overflow-hidden border-y border-cream/12 py-3 text-xs uppercase tracking-[.35em] text-cream/55">
        <div className="flex w-max animate-marquee gap-10">
          {Array.from({ length: 2 }).map((_, i) => <span key={i}>Coconut soy wax / rare fragrance oils / hand finished vessels / inquiry ordering</span>)}
        </div>
      </div>
    </section>
  );
}
