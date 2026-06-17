import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Package, MapPin, Settings, Bell, CheckSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Maaya Couture" },
      { name: "description", content: "Review alerts and transactional message logs." },
    ],
  }),
  component: NotificationsCenter,
});

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

function NotificationsCenter() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Notification[]>([
    {
      id: "alert-1",
      title: "Appointment Confirmed",
      message:
        "Your video bridal consultation with our master stylist has been scheduled for Friday at 4 PM IST.",
      createdAt: new Date().toLocaleDateString(),
      isRead: false,
    },
    {
      id: "alert-2",
      title: "Atelier Welcome",
      message:
        "Thank you for registering at Maaya Couture. Explore our handwoven collections in the Shop edit.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleDateString(),
      isRead: true,
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated]);

  const markAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
  };

  if (!user) return null;

  return (
    <div className="container-luxe py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Sidebar */}
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

        {/* Content */}
        <main className="space-y-8">
          <div className="flex justify-between items-baseline flex-wrap gap-4 border-b border-border pb-5">
            <div>
              <p className="eyebrow text-gold">Notifications</p>
              <h1 className="mt-1 font-display text-3xl">Inbox Alerts</h1>
            </div>
            {alerts.some((a) => !a.isRead) && (
              <button
                onClick={markAllRead}
                className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border-b border-foreground pb-0.5"
              >
                Mark all as read
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground stroke-1" />
              <p className="mt-4 text-sm text-muted-foreground font-display">
                Inbox is currently empty.
              </p>
            </div>
          ) : (
            <div className="border border-border divide-y divide-border">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-6 flex items-start gap-4 transition-colors ${a.isRead ? "bg-background" : "bg-champagne/10"}`}
                >
                  <div
                    className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full border ${a.isRead ? "border-border text-muted-foreground" : "border-gold text-gold bg-gold/10"}`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${a.isRead ? "text-foreground/80" : "text-foreground font-semibold"}`}
                    >
                      {a.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {a.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">{a.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
