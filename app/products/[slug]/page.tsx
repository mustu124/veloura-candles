import Image from "next/image";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductExperience } from "@/components/product-experience";
import { generatedProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";
import { ProductActions } from "./product-actions";

export function generateStaticParams() {
  return generatedProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = generatedProducts.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = generatedProducts.filter((item) => item.slug !== product.slug).slice(0, 8);

  return (
    <main className="bg-cream pt-28">
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2">
        <div className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink">
            <Image src={product.image} alt={product.name} fill priority className="object-cover transition duration-700 hover:scale-110" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.gallery.map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-ink">
                <Image src={image} alt={`${product.name} gallery`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-xs uppercase tracking-[.32em] text-amber">Maison Velora</p>
          <h1 className="mt-5 font-serif text-7xl leading-none">{product.name}</h1>
          <p className="mt-5 text-3xl">{formatMoney(product.price)}</p>
          <p className="mt-7 text-lg leading-8 text-ink/66">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.notes.map((note) => <span key={note} className="rounded-full border border-ink/10 px-4 py-2 text-sm">{note}</span>)}
          </div>
          <ProductActions product={product} />
          <div className="mt-10 grid gap-5 border-y border-ink/10 py-8">
            <Info title="Burn time" value={product.burnTime} />
            <Info title="Ingredients" value={product.ingredients} />
            <Info title="Reviews" value="4.9 average from private clientele. Loved for elegant throw, vessel quality, and gifting presentation." />
          </div>
        </div>
      </section>
      <ProductExperience products={related} />
      <CartDrawer />
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[.28em] text-amber">{title}</p>
      <p className="mt-2 leading-7 text-ink/66">{value}</p>
    </div>
  );
}
