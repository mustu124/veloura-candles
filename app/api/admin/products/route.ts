import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.enum(["SOY_CANDLES", "REED_DIFFUSERS", "ROOM_SPRAYS", "GIFT_SETS", "AROMATHERAPY", "FESTIVE_COLLECTION", "LIMITED_EDITION"]),
  description: z.string(),
  notes: z.array(z.string()),
  price: z.number().int(),
  stock: z.number().int(),
  burnTime: z.string(),
  ingredients: z.string(),
  image: z.string(),
  gallery: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const product = await prisma.product.create({ data: parsed.data });
  return NextResponse.json(product);
}
