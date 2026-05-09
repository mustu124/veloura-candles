import { CartDrawer } from "@/components/cart-drawer";
import { Hero } from "@/components/hero";
import { HomeSections } from "@/components/home-sections";
import { ProductExperience } from "@/components/product-experience";
import { generatedProducts } from "@/lib/catalog";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductExperience products={generatedProducts} />
      <HomeSections />
      <CartDrawer />
    </main>
  );
}
