import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink px-5 py-16 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <p className="font-serif text-5xl">Maison Velora</p>
          <p className="mt-5 max-w-md text-cream/65">Luxury home fragrance composed for rooms with memory, warmth, and quiet magnetism.</p>
        </div>
        <div className="space-y-3 text-sm uppercase tracking-[.22em] text-cream/70">
          <Link className="block" href="/#collections">Shop</Link>
          <Link className="block" href="/#story">Sustainability</Link>
          <Link className="block" href="/admin">Admin</Link>
        </div>
        <form className="space-y-3">
          <label className="text-sm uppercase tracking-[.26em] text-champagne">Private list</label>
          <div className="flex rounded-full border border-cream/15 p-1">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none placeholder:text-cream/35" placeholder="Email address" type="email" />
            <button className="rounded-full bg-cream px-5 text-sm font-medium text-ink">Join</button>
          </div>
        </form>
      </div>
    </footer>
  );
}
