"use client";

import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";

export function AdminMarkContacted({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  async function mark() {
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH" });
    if (!response.ok) {
      toast.error("Could not update order");
      return;
    }
    toast.success("Order marked as contacted");
    router.refresh();
  }
  return <button disabled={disabled} onClick={mark} className="mt-4 rounded-full bg-ink px-5 py-2 text-sm text-cream disabled:opacity-35">Mark contacted</button>;
}

export function ProductManager({ products }: { products: Product[] }) {
  return (
    <section className="mt-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-serif text-5xl">Product manager</h2>
          <p className="mt-2 text-ink/62">Seeded inventory is editable through Prisma Studio or by extending the admin API. Image upload storage should use Vercel Blob, S3, or Cloudinary in production.</p>
        </div>
        <button className="rounded-full bg-ink px-6 py-3 text-cream">Add product</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {products.slice(0, 12).map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg border border-ink/10 bg-porcelain p-4">
            <div>
              <p className="font-serif text-2xl">{product.name}</p>
              <p className="text-sm text-ink/55">{product.category} / stock {product.stock}</p>
            </div>
            <p>{formatMoney(product.price)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
