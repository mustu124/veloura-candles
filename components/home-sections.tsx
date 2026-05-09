"use client";

import Image from "next/image";
import { Reveal } from "./motion";

const testimonials = [
  ["The packaging felt like a private club. The scent was even better.", "Amara S."],
  ["Finally, a candle brand that looks as expensive as it smells.", "Julian R."],
  ["Our hotel lobby changed character in one evening.", "Elyse M."]
];

export function HomeSections() {
  return (
    <>
      <section id="story" className="grid bg-ink text-cream md:grid-cols-2">
        <div className="relative min-h-[520px]">
          <Image src="/assets/hero-candle.png" alt="Maison Velora ritual" fill className="object-cover opacity-70" />
        </div>
        <div className="flex items-center px-6 py-20 md:px-14">
          <Reveal>
            <p className="text-xs uppercase tracking-[.32em] text-champagne">Brand story</p>
            <h2 className="mt-5 font-serif text-6xl leading-none">Made for the hour when a room becomes a memory.</h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-cream/68">Maison Velora blends slow perfumery with object design: recyclable vessels, coconut-soy wax, cotton wicks, and fragrance compositions built to move through a home gracefully.</p>
          </Reveal>
        </div>
      </section>
      <section className="bg-porcelain px-5 py-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {["Signature Collection", "Luxury Gifting", "Sustainability"].map((title, index) => (
            <Reveal key={title} delay={index * .08}>
              <div className="min-h-72 rounded-lg border border-ink/10 p-7">
                <p className="text-xs uppercase tracking-[.3em] text-amber">0{index + 1}</p>
                <h3 className="mt-20 font-serif text-5xl leading-none">{title}</h3>
                <p className="mt-5 leading-7 text-ink/62">{index === 0 ? "Layered accords with elegant throw and collectible vessels." : index === 1 ? "Gift sets, handwritten notes, and concierge-style follow up." : "Cleaner waxes, refill thinking, and reusable objects."}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section id="quiz" className="bg-cream px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="rounded-lg bg-ink p-8 text-cream md:p-12">
              <p className="text-xs uppercase tracking-[.32em] text-champagne">AI fragrance finder</p>
              <div className="mt-8 grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-end">
                <h2 className="font-serif text-6xl leading-none">Tell us the mood. We will suggest the flame.</h2>
                <div className="grid gap-3">
                  {["Quiet hotel suite", "Rainy morning", "Black tie dinner", "Deep work ritual"].map((mood) => (
                    <button key={mood} className="rounded-full border border-cream/15 px-5 py-4 text-left transition hover:border-champagne hover:text-champagne">{mood}</button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="overflow-hidden bg-ink py-16 text-cream">
        <div className="flex w-max animate-marquee gap-5">
          {[...testimonials, ...testimonials].map(([quote, name], index) => (
            <figure key={index} className="w-[340px] rounded-lg border border-cream/10 p-7">
              <blockquote className="font-serif text-3xl leading-tight">"{quote}"</blockquote>
              <figcaption className="mt-5 text-sm uppercase tracking-[.25em] text-champagne">{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="grid bg-porcelain md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="relative aspect-square overflow-hidden">
            <Image src={index % 2 ? "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=80" : "/assets/hero-candle.png"} alt="Instagram showcase" fill className="object-cover transition duration-700 hover:scale-105" />
          </div>
        ))}
      </section>
    </>
  );
}
