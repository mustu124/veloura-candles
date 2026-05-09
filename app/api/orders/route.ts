import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generatedProducts } from "@/lib/catalog";
import { sendOwnerOrderEmail } from "@/lib/email";

export const runtime = "nodejs";

const text = (min = 1) => z.coerce.string().trim().min(min);

const schema = z.object({
  customer: text(2),
  email: z.coerce.string().trim().email(),
  phone: text(6),
  address: text(5),
  city: text(2),
  postalCode: text(2),
  country: text(2),
  message: z.coerce.string().trim().optional().nullable(),
  items: z.array(z.object({ slug: text(1), quantity: z.coerce.number().int().min(1).max(20) })).min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please complete all contact fields and add at least one available product.",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const products = parsed.data.items.map((item) => {
    const product = generatedProducts.find((entry) => entry.slug === item.slug);
    if (!product) return null;
    return { product, quantity: item.quantity };
  }).filter((item): item is { product: (typeof generatedProducts)[number]; quantity: number } => item !== null);

  if (products.length === 0) {
    return NextResponse.json({ error: "Please remove the old cart item and add an available product again." }, { status: 400 });
  }
  const total = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const orderData = {
    customer: parsed.data.customer,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: parsed.data.city,
    postalCode: parsed.data.postalCode,
    country: parsed.data.country,
    message: parsed.data.message || null,
    total
  };

  const order = await createOrderRequest(orderData, products);

  let emailSent = true;
  try {
    await sendOwnerOrderEmail(order);
  } catch (error) {
    emailSent = false;
    console.error("Order inquiry was saved, but owner email delivery failed.", error);
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    message: "Thank you for your request. Our team will contact you shortly to confirm your order."
  });
}

async function createOrderRequest(
  orderData: {
    customer: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    message: string | null;
    total: number;
  },
  products: { product: (typeof generatedProducts)[number]; quantity: number }[]
) {
  try {
    return await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: products.map(({ product, quantity }) => ({
            product: { connectOrCreate: { where: { slug: product.slug }, create: product } },
            quantity,
            price: product.price,
            name: product.name
          }))
        }
      },
      include: { items: true }
    });
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.warn("Database is not configured. Saving inquiry to local dev inbox.", error);
    return saveLocalDevInquiry(orderData, products);
  }
}

async function saveLocalDevInquiry(
  orderData: {
    customer: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    message: string | null;
    total: number;
  },
  products: { product: (typeof generatedProducts)[number]; quantity: number }[]
) {
  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const id = crypto.randomUUID();
  const createdAt = new Date();
  const order = {
    id,
    ...orderData,
    status: "NEW" as const,
    contactedAt: null,
    createdAt,
    items: products.map(({ product, quantity }) => ({
      id: crypto.randomUUID(),
      orderId: id,
      productId: product.slug,
      quantity,
      price: product.price,
      name: product.name
    }))
  };
  const dir = join(process.cwd(), ".data");
  const file = join(dir, "order-inquiries.json");
  await mkdir(dir, { recursive: true });
  const existing = await readFile(file, "utf8").then(JSON.parse).catch(() => []);
  existing.unshift({ ...order, createdAt: createdAt.toISOString() });
  await writeFile(file, JSON.stringify(existing, null, 2));
  return order;
}
