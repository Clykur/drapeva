import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Register — Maaya Couture" },
      { name: "description", content: "Create your Maaya Couture account." },
    ],
  }),
  component: Register,
});

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.auth.register({ name, email, phone, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success("Welcome to the Maaya atelier");
      router.navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 shadow-soft">
        <div className="text-center">
          <p className="eyebrow text-gold">The Atelier</p>
          <h1 className="mt-3 font-display text-3xl">Create Account</h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="eyebrow mb-2 block">Full Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="e.g. Aishwarya Sen"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="e.g. aishwarya@example.com"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block">Phone Number (Optional)</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="e.g. +91 98765 43210"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-2 block">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50"
          >
            {loading ? "Creating Atelier profile..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link
            to="/auth/login"
            className="border-b border-muted-foreground pb-0.5 text-foreground hover:border-foreground"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
