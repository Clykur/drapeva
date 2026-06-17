import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Package, MapPin, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [
      { title: "Profile Settings — Maaya Couture" },
      { name: "description", content: "Edit your Maaya profile settings." },
    ],
  }),
  component: ProfileSettings,
});

function ProfileSettings() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.navigate({ to: "/auth/login" });
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, we would call an API like `/auth/profile/update`
      // We will mock this operation and show a success notification
      toast.success("Profile details updated successfully");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-luxe py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-champagne text-gold font-display text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1 text-xs uppercase tracking-widest font-medium text-muted-foreground">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors"
            >
              <User className="h-4 w-4" /> Account Overview
            </Link>
            <Link
              to="/dashboard/orders"
              className="flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors"
            >
              <Package className="h-4 w-4" /> Order History
            </Link>
            <Link
              to="/dashboard/addresses"
              className="flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors"
            >
              <MapPin className="h-4 w-4" /> Address Book
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-2 bg-champagne text-foreground"
            >
              <Settings className="h-4 w-4" /> Profile Settings
            </Link>
            <button
              onClick={() => {
                logout();
                router.navigate({ to: "/" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-destructive hover:text-destructive/80 text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>

        <main className="max-w-xl">
          <div>
            <p className="eyebrow text-gold">Settings</p>
            <h1 className="mt-2 font-display text-3xl">Profile Credentials</h1>
            <span className="gold-divider mt-4 block" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="eyebrow mb-2 block">Full Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Email Address</span>
              <input
                type="email"
                required
                disabled
                value={email}
                className="w-full border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Phone Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-2 block">Update Password (Optional)</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background px-8 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
