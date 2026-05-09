"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") })
    });
    setLoading(false);
    if (!response.ok) {
      toast.error("Invalid admin credentials");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-cream">
      <form action={login} className="w-full max-w-md rounded-lg border border-cream/10 bg-white/5 p-8 backdrop-blur">
        <p className="text-xs uppercase tracking-[.3em] text-champagne">Secure admin</p>
        <h1 className="mt-4 font-serif text-6xl">Maison control room</h1>
        <input name="email" type="email" required placeholder="Admin email" className="mt-8 w-full rounded-md border border-cream/10 bg-cream px-4 py-3 text-ink outline-none" />
        <input name="password" type="password" required placeholder="Password" className="mt-3 w-full rounded-md border border-cream/10 bg-cream px-4 py-3 text-ink outline-none" />
        <button disabled={loading} className="mt-5 w-full rounded-full bg-champagne px-6 py-4 font-medium text-ink">{loading ? "Opening..." : "Login"}</button>
      </form>
    </main>
  );
}
