import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS, formatINR } from "@/lib/products";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Couture — Maaya Couture" },
      {
        name: "description",
        content: "Compare fabrics, embroidery, sizes, and pricing options side-by-side.",
      },
    ],
  }),
  component: CompareProducts,
});

function CompareProducts() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["noor-crimson", "saira-blush"]);

  const productsToCompare = PRODUCTS.filter((p) => selectedIds.includes(p.id));

  const removeProduct = (id: string) => {
    setSelectedIds(selectedIds.filter((pId) => pId !== id));
  };

  const addProduct = (id: string) => {
    if (selectedIds.length >= 3) return; // Limit to 3 items
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <div className="border-b border-border bg-champagne/30">
        <div className="container-luxe py-14 md:py-20 text-center">
          <p className="eyebrow">Atelier Compare</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Compare Creations</h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>
      </div>

      <div className="container-luxe py-16">
        {productsToCompare.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground font-display">
              No items selected to compare.
            </p>
            <Link
              to="/shop"
              search={{ category: "all" }}
              className="mt-4 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest"
            >
              Browse shop
            </Link>
          </div>
        ) : (
          <div>
            {/* Quick picker if < 3 */}
            {selectedIds.length < 3 && (
              <div className="mb-8 border border-border p-4 bg-champagne/10">
                <p className="eyebrow mb-3">Add item to comparison</p>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTS.filter((p) => !selectedIds.includes(p.id)).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addProduct(p.id)}
                      className="px-3 py-1.5 border border-border bg-background text-xs uppercase tracking-wider hover:border-foreground"
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="overflow-x-auto border border-border">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-champagne/10">
                    <th className="p-4 font-display text-base border-r border-border">Attribute</th>
                    {productsToCompare.map((p) => (
                      <th
                        key={p.id}
                        className="p-4 border-r border-border last:border-r-0 min-w-[200px]"
                      >
                        <div className="flex flex-col h-full justify-between gap-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-40 w-30 object-cover border border-border"
                          />
                          <div>
                            <p className="font-display text-base leading-tight">{p.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{p.collection}</p>
                          </div>
                          <button
                            onClick={() => removeProduct(p.id)}
                            className="text-xs text-destructive flex items-center gap-1 mt-2 hover:text-destructive/80 self-start"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold border-r border-border bg-champagne/5">
                      Price
                    </td>
                    {productsToCompare.map((p) => (
                      <td
                        key={p.id}
                        className="p-4 border-r border-border last:border-r-0 font-medium text-gold"
                      >
                        {formatINR(p.price)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold border-r border-border bg-champagne/5">
                      Fabric
                    </td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-4 border-r border-border last:border-r-0">
                        {p.fabric}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4 font-semibold border-r border-border bg-champagne/5">
                      Occasion
                    </td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-4 border-r border-border last:border-r-0">
                        {p.occasion}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold border-r border-border bg-champagne/5">
                      Craft Details
                    </td>
                    {productsToCompare.map((p) => (
                      <td key={p.id} className="p-4 border-r border-border last:border-r-0">
                        <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                          {p.details.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
