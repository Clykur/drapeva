import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ShoppingBag, Users, Activity, FileText, CheckCircle, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [{ title: "Admin Customer Management — Golden Silk Emporium" }],
  }),
  component: AdminCustomers,
});

function AdminCustomers() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.navigate({ to: "/auth/login" });
      return;
    }

    // Load mock lists
    setCustomers([
      {
        id: "c-1",
        name: "Aishwarya Sen",
        email: "customer@maayacouture.com",
        spend: 141300,
        segment: "VIP Bridal",
      },
      {
        id: "c-2",
        name: "Karan Johar",
        email: "karan@johar.com",
        spend: 56800,
        segment: "Celebrity Look",
      },
    ]);

    api.support
      .tickets()
      .then((data) => setTickets(data))
      .catch(() => {
        setTickets([
          {
            id: "t-1",
            name: "Aishwarya Sen",
            subject: "Custom Blouse Sizing",
            message: "Can we sleeve length adjustment?",
            status: "OPEN",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleTicketResolve = async (id: string) => {
    try {
      await api.support.updateTicketStatus(id, "RESOLVED");
      setTickets(tickets.map((t) => (t.id === id ? { ...t, status: "RESOLVED" } : t)));
      toast.success("Support ticket resolved");
    } catch {
      setTickets(tickets.map((t) => (t.id === id ? { ...t, status: "RESOLVED" } : t)));
      toast.success("Support ticket resolved (simulated)");
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="container-luxe py-12">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-border pr-8 space-y-6">
          <div className="pb-6 border-b border-border">
            <span className="font-display text-xl tracking-wider text-gold">ATELIER CMS</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              Atelier Console
            </p>
          </div>

          <nav className="space-y-1 text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors"
            >
              <Activity className="h-4 w-4" /> Analytics Overview
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-4 w-4" /> Products CRUD
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" /> Order Book
            </Link>
            <Link
              to="/admin/customers"
              className="flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground"
            >
              <Users className="h-4 w-4" /> Customer List
            </Link>
          </nav>
        </aside>

        <main className="space-y-10">
          {/* Customers Registry */}
          <div>
            <div className="border-b border-border pb-5">
              <p className="eyebrow text-gold">Segmentation</p>
              <h1 className="mt-1 font-display text-3xl">Customer Directory</h1>
            </div>
            <div className="overflow-x-auto border border-border mt-6">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-champagne/10">
                    <th className="p-4 eyebrow text-[9px]">Name</th>
                    <th className="p-4 eyebrow text-[9px]">Email</th>
                    <th className="p-4 eyebrow text-[9px]">Total Spend</th>
                    <th className="p-4 eyebrow text-[9px]">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-champagne/5">
                      <td className="p-4 font-semibold">{c.name}</td>
                      <td className="p-4 text-muted-foreground">{c.email}</td>
                      <td className="p-4 font-semibold text-gold">
                        ₹{c.spend.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 font-semibold text-gold">{c.segment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Support Tickets Section */}
          <div>
            <h2 className="font-display text-2xl border-b border-border pb-4">
              Concierge Support Tickets
            </h2>
            {tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">All support requests resolved.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="border border-border p-5 bg-champagne/5 relative flex justify-between items-start gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gold stroke-1" />
                        <span className="font-display text-lg font-semibold">{t.subject}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        From: {t.name} · Status:{" "}
                        <span className="font-medium text-gold">{t.status}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-3 italic">"{t.message}"</p>
                    </div>
                    {t.status === "OPEN" && (
                      <button
                        onClick={() => handleTicketResolve(t.id)}
                        className="inline-flex items-center gap-1.5 border border-foreground bg-foreground text-background px-4 py-2 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold hover:text-gold-foreground transition-colors cursor-pointer"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Resolve
                      </button>
                    )}
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
