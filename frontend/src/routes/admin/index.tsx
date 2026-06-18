import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";
import { ShoppingBag, Users, DollarSign, Activity, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Maaya Couture" },
      { name: "description", content: "Management console for Golden Silk Emporium." },
    ],
  }),
  component: AdminDashboard,
});

const SALES_DATA = [
  { month: "Jan", sales: 1200000, orders: 15 },
  { month: "Feb", sales: 1800000, orders: 22 },
  { month: "Mar", sales: 1500000, orders: 18 },
  { month: "Apr", sales: 2400000, orders: 30 },
  { month: "May", sales: 3200000, orders: 42 },
  { month: "Jun", sales: 4500000, orders: 55 },
];

function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      toast.error("Access denied: Admin credentials required");
      router.navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, user]);

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="container-luxe py-12">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Navigation Sidebar */}
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
              className="flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground"
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
              className="flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" /> Customer List
            </Link>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="space-y-10">
          <div>
            <p className="eyebrow text-gold">Dashboard</p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Revenue & Store Insights</h1>
            <span className="gold-divider mt-4 block" />
          </div>

          {/* Cards metrics */}
          <div className="grid gap-5 md:grid-cols-4">
            {[
              {
                label: "Total Revenue",
                val: "₹1,46,00,000",
                icon: DollarSign,
                change: "+24% vs last month",
              },
              { label: "Total Orders", val: "182", icon: ShoppingBag, change: "+12% this week" },
              { label: "Active Clients", val: "148", icon: Users, change: "+8 new registered" },
              { label: "Conversion Rate", val: "3.4%", icon: Activity, change: "+0.6% increase" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="border border-border p-6 bg-champagne/10 shadow-soft">
                  <div className="flex justify-between items-start text-muted-foreground">
                    <span className="eyebrow text-[9px]">{card.label}</span>
                    <Icon className="h-4 w-4 text-gold stroke-1" />
                  </div>
                  <p className="font-display text-2xl mt-4">{card.val}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">{card.change}</p>
                </div>
              );
            })}
          </div>

          {/* Sales Chart */}
          <div className="border border-border p-6 bg-champagne/5">
            <h2 className="font-display text-xl mb-6">Revenue Growth (Jan - Jun)</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2dcd0" />
                  <XAxis dataKey="month" stroke="#8c7853" fontSize={11} />
                  <YAxis stroke="#8c7853" fontSize={11} tickFormatter={(v) => `₹${v / 100000}L`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${value.toLocaleString("en-IN")}`, "Sales"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#d4af37"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
