import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/bestsellers")({
  head: () => ({
    meta: [
      { title: "Bestsellers — Maaya Couture" },
      {
        name: "description",
        content: "Shop our most celebrated and highly rated silk sarees and handloom weaves.",
      },
    ],
  }),
  component: Bestsellers,
});

function Bestsellers() {
  const list = PRODUCTS.filter((p) => p.badge === "Bestseller");

  return (
    <div>
      <div className="border-b border-border bg-champagne/30">
        <div className="container-luxe py-14 md:py-20 text-center">
          <p className="eyebrow">Atelier Favorites</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Bestsellers</h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>
      </div>

      <div className="container-luxe py-16">
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
