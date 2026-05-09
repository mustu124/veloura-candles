import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { AdminMarkContacted, ProductManager } from "./ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAdmin())) redirect("/admin");
  const [orders, products] = await Promise.all([
    prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } })
  ]);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "NEW").length;

  return (
    <main className="min-h-screen bg-cream px-5 pb-20 pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[.32em] text-amber">Admin dashboard</p>
        <h1 className="mt-4 font-serif text-7xl">Orders, inventory, and atelier rhythm.</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Metric label="Inquiry value" value={formatMoney(revenue)} />
          <Metric label="New requests" value={String(newOrders)} />
          <Metric label="Products" value={String(products.length)} />
        </div>
        <section className="mt-12">
          <h2 className="font-serif text-5xl">Order management</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-ink/10 bg-porcelain">
            {orders.map((order) => (
              <div key={order.id} className="grid gap-4 border-b border-ink/10 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-serif text-3xl">{order.customer}</p>
                    <span className="rounded-full bg-ink px-3 py-1 text-xs uppercase tracking-[.18em] text-cream">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/62">{order.email} / {order.phone}</p>
                  <p className="mt-1 text-sm text-ink/62">{order.address}, {order.city}, {order.postalCode}, {order.country}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item) => <span key={item.id} className="rounded-full border border-ink/10 px-3 py-1 text-sm">{item.name} x {item.quantity}</span>)}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-medium">{formatMoney(order.total)}</p>
                  <AdminMarkContacted id={order.id} disabled={order.status === "CONTACTED"} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <ProductManager products={products} />
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-porcelain p-6">
      <p className="text-xs uppercase tracking-[.28em] text-amber">{label}</p>
      <p className="mt-4 font-serif text-5xl">{value}</p>
    </div>
  );
}
