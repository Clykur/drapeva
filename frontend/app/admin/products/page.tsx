"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Pagination } from "@/components/pagination";
import { productsApi, categoriesApi, collectionsApi } from "@/lib/api";
import { formatINR } from "@/lib/types";
import type { Product, ProductFormData, Category, Collection } from "@/lib/types";
import { Combobox } from "@/components/combobox";
import { Plus, Search, Edit, Trash2, Copy, Package } from "lucide-react";

// ── Fabric constants ──────────────────────────────────────────────────────────
const FABRICS = [
  { label: "Kanjivaram Silk", value: "Kanjivaram Silk" },
  { label: "Mysore Crepe Silk", value: "Mysore Crepe Silk" },
  { label: "Khadi Cotton Silk", value: "Khadi Cotton Silk" },
  { label: "Banarasi Silk", value: "Banarasi Silk" },
  { label: "Organza", value: "Organza" },
  { label: "Chiffon", value: "Chiffon" },
  { label: "Cotton", value: "Cotton" },
  { label: "Linen", value: "Linen" },
  { label: "Designer Silk", value: "Designer Silk" },
  { label: "Chanderi Silk", value: "Chanderi Silk" },
];

// ── Empty form factory ────────────────────────────────────────────────────────
const emptyForm = (): ProductFormData => ({
  name: "",
  slug: "",
  description: "",
  price: 0,
  sale_price: null,
  category_id: "",
  collection_id: "",
  fabric: "",
  color: "",
  stock_quantity: 0,
  is_featured: false,
  is_bestseller: false,
  is_new_arrival: false,
  seo_title: "",
  seo_description: "",
  images: [],
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Main component ────────────────────────────────────────────────────────────
function AdminProductsContent() {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1") || 1;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string>("");
  const [form, setForm] = useState<ProductFormData>(emptyForm());
  const [search, setSearch] = useState("");

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: productsApi.adminList,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.adminList,
  });
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: collectionsApi.adminList,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: (data: ProductFormData) => productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product created");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message || "Failed to create product"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated");
      resetForm();
    },
    onError: (e: any) => toast.error(e.message || "Failed to update product"),
  });

  const deleteMut = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: (e: any) => toast.error(e.message || "Failed to delete"),
  });

  const duplicateMut = useMutation({
    mutationFn: productsApi.duplicate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product duplicated");
    },
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setEditingCode("");
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      sale_price: p.sale_price,
      category_id: p.category_id || "",
      collection_id: p.collection_id || "",
      fabric: p.fabric || "",
      color: p.color || "",
      stock_quantity: p.stock_quantity,
      is_featured: p.is_featured,
      is_bestseller: p.is_bestseller,
      is_new_arrival: p.is_new_arrival,
      seo_title: p.seo_title || "",
      seo_description: p.seo_description || "",
      images: p.images.map((i) => ({
        url: i.url,
        alt_text: i.alt_text || "",
        is_featured: i.is_featured,
        sort_order: i.sort_order,
        uploading: false,
      })),
    });
    setEditingId(p.id);
    setEditingCode(p.product_code || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setField = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Product name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.price <= 0) return toast.error("Price must be greater than 0");
    if (form.images.some((i) => i.uploading))
      return toast.error("Please wait for images to finish uploading");
    if (form.images.length === 0) return toast.error("At least one product image is required");
    const data = { ...form, slug: form.slug || slugify(form.name) };
    if (editingId) updateMut.mutate({ id: editingId, data });
    else createMut.mutate(data);
  };

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = (products || []).filter((p: Product) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.product_code || "").toLowerCase().includes(q) ||
      (p.fabric || "").toLowerCase().includes(q) ||
      (p.color || "").toLowerCase().includes(q)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentPage = Math.min(page, totalPages || 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(pageNumber));
    router.push(`${pathname}?${params.toString()}`);
  };

  // ── Form Actions bar ───────────────────────────────────────────────────────
  const formActions = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={resetForm}
        className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-muted transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={createMut.isPending || updateMut.isPending}
        className="bg-foreground text-background px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-50"
      >
        {createMut.isPending || updateMut.isPending
          ? "Saving..."
          : editingId
            ? "Update Product"
            : "Save Product"}
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout
      title={showForm ? (editingId ? "Edit Product" : "New Product") : "Products"}
      subtitle={
        showForm
          ? editingCode
            ? `Product ID: ${editingCode}`
            : "Product ID will be generated automatically"
          : `${products.length} total products`
      }
      actions={
        showForm ? (
          formActions
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 border text-black px-5 py-2.5 text-xs uppercase tracking-widest transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        )
      }
    >
      {showForm ? (
        /* ══════════════════════════════════════════════
           PRODUCT FORM
           ══════════════════════════════════════════════ */
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-5xl">
          {/* ── Product Information ── */}
          <Section title="Product Information">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Name */}
              <div className="md:col-span-2">
                <Field label="Product Name *">
                  <input
                    value={form.name}
                    onChange={(e) => {
                      setField("name", e.target.value);
                      if (!editingId) setField("slug", slugify(e.target.value));
                    }}
                    className={inputCls}
                    placeholder="Varanasi Heritage Katan Silk Saree"
                    required
                  />
                </Field>
              </div>

              {/* Product ID — read-only */}
              <Field label="Product ID (Auto Generated)">
                <input
                  value={editingCode || "Will be generated on save"}
                  readOnly
                  disabled
                  className={inputCls + " cursor-not-allowed opacity-60 font-mono text-xs"}
                />
                {!editingCode && (
                  <p className="text-[10px] text-muted-foreground mt-1.5">
                    Format: DE-&#123;FABRIC&#125;-&#123;COLOR&#125;-&#123;0001&#125; e.g.
                    DE-KCS-RED-0001
                  </p>
                )}
              </Field>

              {/* Slug */}
              <Field label="Slug (Auto-generated, editable)">
                <input
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                  className={inputCls}
                  placeholder="auto-generated-from-name"
                />
              </Field>

              {/* Description */}
              <div className="md:col-span-2">
                <Field label="Description *">
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={5}
                    className={inputCls + " resize-y"}
                    placeholder="An exquisite saree handwoven by master artisans..."
                    required
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* ── Images ── */}
          <Section title="Images *">
            <ImageUploader
              images={form.images}
              onChange={(imgs) => setField("images", imgs as any)}
              productId={editingId || "new"}
              maxImages={10}
            />
            {form.images.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Upload at least one image. The first image marked as featured will be the primary
                display image.
              </p>
            )}
          </Section>

          {/* ── Pricing & Inventory ── */}
          <Section title="Pricing & Inventory">
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Price (₹) *">
                <input
                  type="number"
                  value={form.price || ""}
                  onChange={(e) => setField("price", parseFloat(e.target.value) || 0)}
                  className={inputCls}
                  placeholder="45000"
                  required
                  min={0}
                />
              </Field>
              <Field label="Sale Price (₹)">
                <input
                  type="number"
                  value={form.sale_price ?? ""}
                  onChange={(e) =>
                    setField("sale_price", e.target.value ? parseFloat(e.target.value) : null)
                  }
                  className={inputCls}
                  placeholder="38000 (optional)"
                  min={0}
                />
              </Field>
              <Field label="Stock Quantity">
                <input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setField("stock_quantity", parseInt(e.target.value) || 0)}
                  className={inputCls}
                  placeholder="10"
                  min={0}
                />
              </Field>
            </div>
          </Section>

          {/* ── Classification ── */}
          <Section title="Classification">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Category">
                <Combobox
                  value={form.category_id}
                  onChange={(val) => setField("category_id", val)}
                  options={categories.map((c: Category) => ({ label: c.name, value: c.id }))}
                  placeholder="Select category..."
                  className="w-full"
                />
              </Field>
              <Field label="Collection">
                <Combobox
                  value={form.collection_id}
                  onChange={(val) => setField("collection_id", val)}
                  options={collections.map((c: Collection) => ({ label: c.name, value: c.id }))}
                  placeholder="Select collection..."
                  className="w-full"
                />
              </Field>
              <Field label="Fabric">
                <Combobox
                  value={form.fabric}
                  onChange={(val) => setField("fabric", val)}
                  options={FABRICS}
                  placeholder="Select fabric..."
                  className="w-full"
                />
              </Field>
              <Field label="Color">
                <input
                  value={form.color}
                  onChange={(e) => setField("color", e.target.value)}
                  className={inputCls}
                  placeholder="Crimson Red"
                />
              </Field>
            </div>
          </Section>

          {/* ── Product Flags ── */}
          <Section title="Product Flags">
            <div className="flex flex-wrap gap-8">
              {(
                [
                  ["is_featured", "Featured on Homepage"],
                  ["is_bestseller", "Bestseller"],
                  ["is_new_arrival", "New Arrival"],
                ] as [keyof ProductFormData, string][]
              ).map(([k, label]) => (
                <label key={k} className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setField(k, !form[k] as any)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${form[k] ? "bg-gold" : "bg-border"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[k] ? "translate-x-4" : "translate-x-0.5"
                        }`}
                    />
                  </div>
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* ── SEO & Meta ── */}
          <Section title="SEO & Meta">
            <div className="grid gap-5">
              <Field label="SEO Title">
                <input
                  value={form.seo_title}
                  onChange={(e) => setField("seo_title", e.target.value)}
                  className={inputCls}
                  placeholder="Defaults to product name"
                  maxLength={60}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {form.seo_title.length}/60 characters
                </p>
              </Field>
              <Field label="SEO Description">
                <textarea
                  value={form.seo_description}
                  onChange={(e) => setField("seo_description", e.target.value)}
                  rows={2}
                  className={inputCls + " resize-y"}
                  placeholder="Product meta description..."
                  maxLength={160}
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {form.seo_description.length}/160 characters
                </p>
              </Field>
            </div>
          </Section>

          {/* Bottom submit */}
          <div className="flex justify-end pb-10">{formActions}</div>
        </form>
      ) : (
        /* ══════════════════════════════════════════════
           PRODUCT LIST
           ══════════════════════════════════════════════ */
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, code, fabric, or color..."
              className="w-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-border">
              <Package className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="font-display text-xl">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {search ? "Try a different search term." : "Add your first product to get started."}
              </p>
              {!search && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Count row */}
              <p className="text-xs text-muted-foreground">
                Showing {paginatedProducts.length} of {filtered.length} products
              </p>

              <div className="overflow-x-auto border border-border hide-scrollbar">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-champagne/10">
                      <th className="p-4 eyebrow text-[11px]">Product</th>
                      <th className="p-4 eyebrow text-[11px]">Fabric / Color</th>
                      <th className="p-4 eyebrow text-[11px]">Price</th>
                      <th className="p-4 eyebrow text-[11px]">Stock</th>
                      <th className="p-4 eyebrow text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedProducts.map((p: Product) => (
                      <tr key={p.id} className="hover:bg-champagne/5 group">
                        {/* Product cell */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 bg-muted overflow-hidden rounded-sm border border-border">
                              {p.images?.[0]?.url ? (
                                <img
                                  src={p.images[0].url}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p
                                className="font-semibold text-sm max-w-[220px] truncate"
                                title={p.name}
                              >
                                {p.name}
                              </p>
                              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                {p.product_code || p.id.slice(0, 8)}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {p.is_featured && (
                                  <span className="text-[9px] bg-gold/10 text-gold px-1 py-0.5 rounded">
                                    Featured
                                  </span>
                                )}
                                {p.is_bestseller && (
                                  <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded">
                                    Bestseller
                                  </span>
                                )}
                                {p.is_new_arrival && (
                                  <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded">
                                    New
                                  </span>
                                )}
                                {p.sale_price && (
                                  <span className="text-[9px] bg-red-50 text-red-600 px-1 py-0.5 rounded">
                                    Sale
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Fabric / Color */}
                        <td className="p-4 text-muted-foreground text-xs">
                          <p>{p.fabric || "—"}</p>
                          <p className="mt-0.5">{p.color || "—"}</p>
                        </td>

                        {/* Price */}
                        <td className="p-4">
                          <p className="font-semibold text-gold">
                            {formatINR(p.sale_price || p.price)}
                          </p>
                          {p.sale_price && (
                            <p className="text-[10px] text-muted-foreground line-through mt-0.5">
                              {formatINR(p.price)}
                            </p>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="p-4">
                          <span
                            className={`text-xs font-medium ${p.stock_quantity === 0
                              ? "text-destructive"
                              : p.stock_quantity <= 3
                                ? "text-amber-600"
                                : "text-foreground"
                              }`}
                          >
                            {p.stock_quantity === 0 ? "Out of stock" : `${p.stock_quantity} units`}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(p)}
                              className="p-1.5 hover:text-gold transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${p.name}"? This cannot be undone.`))
                                  deleteMut.mutate(p.id);
                              }}
                              className="p-1.5 hover:text-destructive transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-6"
              />
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function AdminProducts() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-background">
      <div className="border-b border-border bg-champagne/10 px-6 py-3">
        <h3 className="eyebrow text-[10px]">{title}</h3>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-[10px] mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors";
