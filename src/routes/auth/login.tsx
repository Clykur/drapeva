import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Login — Maaya Couture" },
      { name: "description", content: "Access your Maaya Couture account." },
    ],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.auth.login({ email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success("Welcome back to the atelier");

      if (data.user.role === "ADMIN") {
        router.navigate({ to: "/admin" });
      } else {
        router.navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75svh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 shadow-soft">
        <div className="text-center">
          <p className="eyebrow text-gold">Welcome Back</p>
          <h1 className="mt-3 font-display text-3xl">Sign in to Maaya</h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block">
            <span className="eyebrow mb-2 block">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              placeholder="e.g. bride@maaya.com"
            />
          </label>

          <label className="block">
            <div className="flex justify-between items-baseline mb-2">
              <span className="eyebrow">Password</span>
              <Link
                to="/auth/forgot-password"
                className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Forgot?
              </Link>
            </div>
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
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          New to the atelier?{" "}
          <Link
            to="/auth/register"
            className="border-b border-muted-foreground pb-0.5 text-foreground hover:border-foreground"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
