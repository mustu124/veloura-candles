import { PrismaClient } from "@prisma/client";
import { generatedProducts } from "../lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const product of generatedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
