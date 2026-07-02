"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Trash2,
  Star,
  Navigation,
  Loader2,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-store";
import { useAddressesStore } from "@/lib/addresses-store";
import { settingsApi } from "@/lib/api";
import type { CustomerAddress } from "@/lib/types";
import { formatINR } from "@/lib/types";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  getStoreOrigin,
  reverseGeocode,
  resolveDistance,
  FREE_DELIVERY_MAX_KM,
} from "@/lib/services/distance";

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
];

interface FormState {
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
  // Distance fields
  distance_km: number | null;
  distance_calculated_at: string | null;
  distance_status: "pending" | "success" | "failed" | null;
  shipping_charge: number | null;
}

const emptyForm: FormState = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
  latitude: null,
  longitude: null,
  distance_km: null,
  distance_calculated_at: null,
  distance_status: null,
  shipping_charge: null,
};

export default function AddressBook() {
  const { user } = useAuth();

  const {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddressesStore();

  // Site settings for store origin + configured shipping cost
  const { data: settings = [] } = useQuery({
    queryKey: ["site-settings"],
    queryFn: settingsApi.getSettings,
  });

  const configuredShippingCost = (() => {
    const item = settings.find((s) => s.key === "shipping_cost");
    return item && item.value !== undefined ? Number(item.value) : 299;
  })();

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [locating, setLocating] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (user) fetchAddresses(user.id);
  }, [user, fetchAddresses]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setShowForm(false);
    setEditId(null);
    setCalculating(false);
  };

  // ── Distance calculation ──────────────────────────────────────────────────

  const runDistanceCalculation = useCallback(
    async (
      lat: number,
      lng: number,
    ): Promise<{
      distance_km: number | null;
      distance_calculated_at: string | null;
      distance_status: "pending" | "success" | "failed";
      shipping_charge: number | null;
    }> => {
      const storeOrigin = getStoreOrigin(settings);
      setCalculating(true);
      try {
        const result = await resolveDistance(
          storeOrigin.lat,
          storeOrigin.lng,
          lat,
          lng,
          configuredShippingCost,
        );
        return {
          distance_km: result.distanceKm,
          distance_calculated_at: result.calculatedAt,
          distance_status: result.status,
          shipping_charge: result.shippingCharge,
        };
      } catch {
        return {
          distance_km: null,
          distance_calculated_at: new Date().toISOString(),
          distance_status: "failed",
          shipping_charge: null,
        };
      } finally {
        setCalculating(false);
      }
    },
    [settings, configuredShippingCost],
  );

  // ── GPS "Use My Location" ─────────────────────────────────────────────────

  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Clear any previous distance result while we recalculate
        setForm((f) => ({
          ...f,
          latitude,
          longitude,
          distance_km: null,
          distance_status: "pending",
          shipping_charge: null,
        }));

        // Run reverse geocoding and distance in parallel
        const [geocodeResult, distanceResult] = await Promise.all([
          reverseGeocode(latitude, longitude),
          runDistanceCalculation(latitude, longitude),
        ]);

        setForm((f) => ({
          ...f,
          latitude,
          longitude,
          ...(geocodeResult
            ? {
                line1: geocodeResult.line1 || f.line1,
                line2: geocodeResult.line2 || f.line2,
                city: geocodeResult.city || f.city,
                state: geocodeResult.state || f.state,
                postal_code: geocodeResult.postalCode || f.postal_code,
                country: geocodeResult.country || f.country || "India",
              }
            : {}),
          ...distanceResult,
        }));

        if (geocodeResult) {
          toast.success("Location detected! Please verify the address fields.");
        } else {
          toast.info("Location coordinates captured. Please fill address fields manually.");
        }

        if (distanceResult.distance_status === "success") {
          toast.success(
            `Shipping distance: ${distanceResult.distance_km} km — ${
              (distanceResult.distance_km ?? 0) <= FREE_DELIVERY_MAX_KM
                ? "Free Delivery ✓"
                : `${formatINR(distanceResult.shipping_charge ?? 0)} shipping`
            }`,
          );
        } else {
          toast.error("Could not calculate shipping distance. Please try again before saving.");
        }

        setLocating(false);
      },
      (err) => {
        setLocating(false);
        const messages: Record<number, string> = {
          1: "Location permission was denied. Please allow location access in your browser settings.",
          2: "Location could not be determined. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        toast.error(messages[err.code] || `Location error: ${err.message}`);
      },
      { timeout: 15000, enableHighAccuracy: true },
    );
  };

  // ── PIN code auto-fill ────────────────────────────────────────────────────

  const lookupPin = async (pin: string) => {
    if (pin.length !== 6) return;
    setPinLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        setForm((f) => ({
          ...f,
          city: po.Division || po.Name || f.city,
          state: po.State || f.state,
        }));
        toast.success(`Auto-filled: ${po.Division || po.Name}, ${po.State}`);
      }
    } catch {
      /* silent */
    } finally {
      setPinLoading(false);
    }
  };

  // ── Edit existing address ─────────────────────────────────────────────────

  const handleEdit = (addr: CustomerAddress) => {
    setForm({
      label: addr.label || "Home",
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_default: addr.is_default,
      latitude: addr.latitude,
      longitude: addr.longitude,
      distance_km: addr.distance_km,
      distance_calculated_at: addr.distance_calculated_at,
      distance_status: addr.distance_status,
      shipping_charge: addr.shipping_charge,
    });
    setEditId(addr.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Submit (add / update) ─────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Block save if no successful distance calculation
    if (form.distance_status !== "success") {
      if (form.latitude && form.longitude) {
        // Coordinates exist but distance calc failed — retry once
        toast.info("Retrying distance calculation before saving…");
        const distanceResult = await runDistanceCalculation(form.latitude, form.longitude);
        setForm((f) => ({ ...f, ...distanceResult }));
        if (distanceResult.distance_status !== "success") {
          toast.error("Distance calculation failed. Please use 'Use My Location' and try again.");
          return;
        }
        // Use the fresh result for saving
        await persistAddress(user.id, { ...form, ...distanceResult });
        return;
      }
      toast.error(
        "Please use 'Use My Location' to detect your coordinates — shipping distance must be calculated before saving.",
      );
      return;
    }

    await persistAddress(user.id, form);
  };

  const persistAddress = async (userId: string, data: FormState) => {
    setSaving(true);
    const addressData = {
      user_id: userId,
      label: data.label,
      name: data.name,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      is_default: data.is_default,
      latitude: data.latitude,
      longitude: data.longitude,
      distance_km: data.distance_km,
      distance_calculated_at: data.distance_calculated_at,
      distance_status: data.distance_status,
      shipping_charge: data.shipping_charge,
    };

    try {
      if (editId) {
        await updateAddress(editId, addressData);
        toast.success("Address updated");
      } else {
        await addAddress(addressData as Omit<CustomerAddress, "id" | "created_at" | "updated_at">);
        toast.success("Address saved successfully");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete / set default ──────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    try {
      await deleteAddress(id);
      toast.success("Address removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove address");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      await setDefaultAddress(id, user.id);
      toast.success("Default address updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update default");
    }
  };

  // ── Distance UI helpers ───────────────────────────────────────────────────

  const isDistanceReady = form.distance_status === "success";
  const isSaveBlocked = !isDistanceReady || calculating || saving;

  const DistanceBadge = ({ addr }: { addr: CustomerAddress }) => {
    if (!addr.distance_status || addr.distance_status === "pending") return null;
    if (addr.distance_status === "failed") {
      return (
        <p className="text-xs text-destructive mt-2 ml-6 flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Distance calculation failed
        </p>
      );
    }
    const isFree = (addr.distance_km ?? 0) <= FREE_DELIVERY_MAX_KM;
    return (
      <p
        className={`text-xs mt-2 ml-6 flex items-center gap-1 ${isFree ? "text-emerald-600" : "text-gold"}`}
      >
        <Truck className="h-3 w-3 shrink-0" />
        {addr.distance_km} km ·{" "}
        {isFree ? "Free Delivery" : formatINR(addr.shipping_charge ?? 0) + " shipping"}
      </p>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout
      title="Address Book"
      subtitle="Saved Addresses"
      headerAction={
        !showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ ...emptyForm });
            }}
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-wider font-medium hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        )
      }
    >
      {/* ── Address Form ─────────────────────────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-border p-6 bg-champagne/10 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-xl">{editId ? "Edit Address" : "New Address"}</h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          {/* Label + Location Detect */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, label: lbl }))}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors ${
                    form.label === lbl
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating || calculating}
              className="inline-flex items-center gap-2 border border-gold/40 text-gold px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-gold/5 transition-colors disabled:opacity-50"
            >
              {locating || calculating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Navigation className="h-3.5 w-3.5" />
              )}
              {locating ? "Detecting…" : calculating ? "Calculating distance…" : "Use My Location"}
            </button>
          </div>

          {/* Distance status banner */}
          {form.latitude && form.longitude && (
            <div
              className={`flex items-center gap-3 px-4 py-3 border text-sm rounded-sm ${
                calculating
                  ? "border-gold/30 bg-gold/5 text-gold"
                  : form.distance_status === "success"
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-700"
                    : form.distance_status === "failed"
                      ? "border-destructive/30 bg-destructive/5 text-destructive"
                      : "border-border bg-champagne/5 text-muted-foreground"
              }`}
            >
              {calculating ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              ) : form.distance_status === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>
                {calculating
                  ? "Calculating road distance from store…"
                  : form.distance_status === "success"
                    ? `${form.distance_km} km from store · ${
                        (form.distance_km ?? 0) <= FREE_DELIVERY_MAX_KM
                          ? "Free Delivery ✓"
                          : `Delivery charge: ${formatINR(form.shipping_charge ?? 0)}`
                      }`
                    : "Distance calculation failed — address cannot be saved. Please try 'Use My Location' again."}
              </span>
            </div>
          )}

          {/* Name + Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow mb-1 block">Recipient Name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">Phone Number</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <label className="block">
            <span className="eyebrow mb-1 block">Address Line 1</span>
            <input
              type="text"
              required
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              placeholder="House/Flat No., Street, Locality"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-1 block">
              Address Line 2 <span className="normal-case text-muted-foreground">(optional)</span>
            </span>
            <input
              type="text"
              value={form.line2}
              onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              placeholder="Landmark, Area"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="eyebrow mb-1 block">
                PIN Code
                {pinLoading && <Loader2 className="h-3 w-3 animate-spin inline ml-1" />}
              </span>
              <input
                type="text"
                required
                value={form.postal_code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setForm((f) => ({ ...f, postal_code: val }));
                  if (val.length === 6) lookupPin(val);
                }}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                placeholder="400001"
                maxLength={6}
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">City</span>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">State</span>
              <select
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                required
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              >
                <option value="">Select State</option>
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
              className="accent-gold h-4 w-4"
            />
            <span className="text-sm text-muted-foreground">Set as default delivery address</span>
          </label>

          {/* Save button + distance guard message */}
          <div className="space-y-2">
            {!form.latitude && !form.longitude && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <Navigation className="h-3 w-3 shrink-0" />
                Click &ldquo;Use My Location&rdquo; to auto-detect coordinates and calculate
                shipping distance. Distance must be calculated before saving.
              </p>
            )}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border border-border hover:border-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaveBlocked}
                title={
                  form.distance_status !== "success"
                    ? "Please calculate shipping distance first using 'Use My Location'"
                    : undefined
                }
                className="bg-foreground text-background px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving…"
                  : calculating
                    ? "Calculating…"
                    : editId
                      ? "Update Address"
                      : "Save Address"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Address List ──────────────────────────────────────────────── */}
      {loading && addresses.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="border border-border p-6 animate-pulse h-40 bg-champagne/10" />
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="py-16 text-center border border-dashed border-border">
          <MapPin className="h-10 w-10 mx-auto text-muted-foreground stroke-1 mb-4" />
          <p className="font-display text-xl">No saved addresses</p>
          <p className="text-sm text-muted-foreground mt-2">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr: CustomerAddress) => (
            <div
              key={addr.id}
              className="border border-border p-5 bg-champagne/10 relative hover:border-gold/30 transition-colors"
            >
              {addr.is_default && (
                <span className="absolute top-4 right-4 bg-gold text-gold-foreground px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Default
                </span>
              )}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold font-medium">
                    {addr.label}
                  </p>
                  <p className="font-medium text-sm mt-0.5">{addr.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed ml-6">
                {addr.line1}
                {addr.line2 && `, ${addr.line2}`}
                <br />
                {addr.city}, {addr.state} — {addr.postal_code}
                <br />
                {addr.country}
              </p>
              <p className="text-xs text-muted-foreground mt-2 ml-6">📞 {addr.phone}</p>

              {/* Distance badge */}
              <DistanceBadge addr={addr} />

              <div className="mt-4 pt-4 border-t border-border flex gap-3 flex-wrap">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border-b border-dashed border-muted-foreground pb-0.5"
                >
                  Edit
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs uppercase tracking-wider text-muted-foreground hover:text-gold border-b border-dashed border-muted-foreground pb-0.5"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs uppercase tracking-wider text-destructive hover:text-destructive/80 flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
