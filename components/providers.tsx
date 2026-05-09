"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
