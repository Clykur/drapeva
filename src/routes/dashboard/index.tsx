import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Package, MapPin, Settings, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "My Account — Maaya Couture" },
      { name: "description", content: "Your Maaya Couture profile, orders, and details." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.navigate({ to: "/auth/login" });
      return;
    }

    api.orders
      .history()
      .then((data) => setOrders(data.slice(0, 3)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!user) return null;

  return (
    <div className="container-luxe py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Navigation Sidebar */}
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
              className="flex items-center gap-3 px-3 py-2 bg-champagne text-foreground"
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
              className="flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors"
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

        {/* Content Area */}
        <main className="space-y-10">
          <div>
            <p className="eyebrow text-gold">Overview</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Atelier Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Review recent orders, manage your custom measurements, and control billing
              credentials.
            </p>
          </div>

          {/* Quick cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border p-6 bg-champagne/10">
              <h2 className="font-display text-xl mb-4">Default Shipping</h2>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Flat 402, Signature Towers
                <br />
                Juhu Tara Road, Juhu
                <br />
                Mumbai, Maharashtra - 400049
                <br />
                India
              </p>
              <Link
                to="/dashboard/addresses"
                className="mt-4 inline-block text-xs uppercase tracking-wider border-b border-foreground pb-0.5"
              >
                Edit address book
              </Link>
            </div>

            <div className="border border-border p-6 bg-champagne/10 flex flex-col justify-between">
              <div>
                <h2 className="font-display text-xl mb-2">Concierge Consultation</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Need style advice or made-to-measure bridal assistance? Book a video consultation
                  session.
                </p>
              </div>
              <Link
                to="/book-appointment"
                className="mt-4 inline-block bg-foreground text-background py-3 text-center text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground"
              >
                Schedule Appointment
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h2 className="font-display text-2xl pb-4 border-b border-border">Recent Orders</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground py-6 animate-pulse">Fetching orders...</p>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-border mt-4">
                <p className="text-sm text-muted-foreground font-display">
                  No couture commissions found.
                </p>
                <Link
                  to="/shop"
                  search={{ category: "all" }}
                  className="mt-4 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest"
                >
                  Shop the collections
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-border border-b border-border">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="py-5 flex flex-wrap justify-between items-center gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Order #{order.id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Placed: {new Date(order.createdAt).toLocaleDateString()} · Status:{" "}
                        <span className="font-semibold text-gold">{order.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatINR(order.total)}</p>
                      <Link
                        to="/dashboard/orders"
                        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground mt-1 inline-block"
                      >
                        Track Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
