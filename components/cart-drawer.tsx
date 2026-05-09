"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import { useStore } from "./store";

export function CartDrawer() {
  const { cart, open, setOpen, updateQty, remove, clear } = useStore();
  const [sending, setSending] = useState(false);
  const validCart = cart.filter((item) => item.slug && Number.isInteger(item.quantity) && item.quantity > 0);
  const total = validCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (validCart.length === 0) {
      toast.error("Please add an available product to your inquiry bag.");
      return;
    }

    const payload = {
      customer: readFormText(formData, "customer"),
      email: readFormText(formData, "email"),
      phone: readFormText(formData, "phone"),
      address: readFormText(formData, "address"),
      city: readFormText(formData, "city"),
      postalCode: readFormText(formData, "postalCode"),
      country: readFormText(formData, "country"),
      message: readFormText(formData, "message"),
      items: validCart.map(({ slug, quantity }) => ({ slug, quantity: Number(quantity) }))
    };

    if (!payload.customer || !payload.email || !payload.phone || !payload.address || !payload.city || !payload.postalCode || !payload.country) {
      toast.error("Please complete every contact field before sending your request.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => null) as { error?: string; message?: string } | null;
      if (!response.ok) {
        toast.error(result?.error || "We could not send the request. Please check your details.");
        return;
      }
      clear();
      setOpen(false);
      toast.success(result?.message || "Thank you for your request. Our team will contact you shortly to confirm your order.");
    } catch {
      toast.error("The order service is not reachable. Please refresh the page and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ ease: [0.22, 1, 0.36, 1], duration: .55 }} className="fixed right-0 top-0 z-[80] h-dvh w-full max-w-xl overflow-y-auto bg-porcelain p-5 shadow-velvet">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-5xl">Inquiry Bag</h2>
            <button type="button" className="rounded-full border border-ink/10 p-2" onClick={() => setOpen(false)}><X /></button>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/58">No payment is taken online. Your request is sent to the owner for personal confirmation.</p>
          <div className="mt-8 space-y-4">
            {cart.map((item) => (
              <div key={item.slug} className="grid grid-cols-[84px_1fr_auto] gap-4 border-b border-ink/10 pb-4">
                <div className="relative h-24 overflow-hidden rounded-md bg-ink">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif text-2xl">{item.name}</p>
                  <p className="text-sm text-ink/58">{formatMoney(item.price)}</p>
                  <div className="mt-3 inline-flex items-center rounded-full border border-ink/10">
                    <button type="button" className="p-2" onClick={() => updateQty(item.slug, item.quantity - 1)}><Minus size={14} /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button type="button" className="p-2" onClick={() => updateQty(item.slug, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <button type="button" className="text-sm text-ink/45" onClick={() => remove(item.slug)}>Remove</button>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="mt-8 grid gap-3">
            <p className="font-serif text-3xl">Total {formatMoney(total)}</p>
            <input name="customer" autoComplete="name" required minLength={2} placeholder="Full name" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="email" type="text" inputMode="email" autoComplete="email" required placeholder="Email address" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="phone" type="tel" autoComplete="tel" required minLength={6} placeholder="Phone number" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="address" autoComplete="street-address" required minLength={5} placeholder="Street address" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="city" autoComplete="address-level2" required minLength={2} placeholder="City" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="postalCode" autoComplete="postal-code" required minLength={2} placeholder="Postal code" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <input name="country" autoComplete="country-name" required minLength={2} placeholder="Country" className="rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <textarea name="message" placeholder="Occasion, gift note, or preferred contact time" className="min-h-28 rounded-md border border-ink/10 bg-white px-4 py-3 outline-none focus:border-champagne" />
            <button type="submit" disabled={sending || validCart.length === 0} className="rounded-full bg-ink px-6 py-4 font-medium text-cream disabled:opacity-50">
              {sending ? "Sending request..." : "Send order request"}
            </button>
          </form>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function readFormText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
