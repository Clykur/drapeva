import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, LogOut, Package, MapPin, Settings, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/dashboard/addresses")({
  head: () => ({
    meta: [
      { title: "Address Book — Maaya Couture" },
      { name: "description", content: "Manage your couture shipping and billing locations." },
    ],
  }),
  component: AddressBook,
});

type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

function AddressBook() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      name: "Aishwarya Sen",
      phone: "+91 98765 43211",
      line1: "Flat 402, Signature Towers",
      line2: "Juhu Tara Road, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400049",
      country: "India",
      isDefault: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: "addr-" + Math.random().toString(36).substring(4),
      name,
      phone,
      line1,
      line2: line2 || undefined,
      city,
      state,
      postalCode: pin,
      country: "India",
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setShowForm(false);
    toast.success("New address added to book");
    // Reset fields
    setName("");
    setPhone("");
    setLine1("");
    setLine2("");
    setCity("");
    setState("");
    setPin("");
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Address removed");
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
              className="flex items-center gap-3 px-3 py-2 bg-champagne text-foreground"
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

        <main className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border pb-5">
            <div>
              <p className="eyebrow text-gold">Addresses</p>
              <h1 className="mt-1 font-display text-3xl">Address Registry</h1>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 border border-foreground px-5 py-3 text-xs uppercase tracking-wider font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Address
              </button>
            )}
          </div>

          {showForm ? (
            <form
              onSubmit={handleAdd}
              className="max-w-xl border border-border p-6 bg-champagne/10 space-y-4"
            >
              <h2 className="font-display text-xl border-b border-border pb-2">
                New Address Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow mb-1 block">Recipient Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-1 block">Phone Number</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
              </div>
              <label className="block">
                <span className="eyebrow mb-1 block">Line 1</span>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="eyebrow mb-1 block">Line 2 (Optional)</span>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="eyebrow mb-1 block">City</span>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-1 block">State</span>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-1 block">PIN Code</span>
                  <input
                    type="text"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex gap-3 pt-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border border-transparent hover:border-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground"
                >
                  Save Location
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {addresses.map((a) => (
                <div key={a.id} className="border border-border p-6 bg-champagne/10 relative">
                  {a.isDefault && (
                    <span className="absolute top-4 right-4 bg-gold text-gold-foreground px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium">
                      Default
                    </span>
                  )}
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {a.line1}
                    <br />
                    {a.line2 && (
                      <>
                        {a.line2}
                        <br />
                      </>
                    )}
                    {a.city}, {a.state} - {a.postalCode}
                    <br />
                    {a.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Phone: {a.phone}</p>
                  <div className="mt-5 flex gap-3 items-center border-t border-border pt-4">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
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
