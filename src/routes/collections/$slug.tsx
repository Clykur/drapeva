import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, COLLECTIONS } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Maaya Couture` },
        { name: "description", content: `Browse pieces from our seasonal ${name} edit.` },
      ],
    };
  },
  component: CollectionDetail,
});

function CollectionDetail() {
  const { slug } = Route.useParams();

  const collectionInfo = COLLECTIONS.find((c) => c.slug === slug) || {
    name: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    tagline: "Atelier Edit",
    image: COLLECTIONS[0].image,
  };

  // Filter products by collection slug
  const matchedProducts = PRODUCTS.filter(
    (p) => p.collection.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug,
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[40svh] min-h-[300px] w-full overflow-hidden bg-ink text-background flex items-center justify-center">
        <img
          src={collectionInfo.image}
          alt={collectionInfo.name}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-background/25" />
        <div className="relative text-center z-10 px-4">
          <p className="eyebrow text-gold">{collectionInfo.tagline}</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl text-foreground">
            {collectionInfo.name}
          </h1>
          <span className="gold-divider mt-4 block mx-auto" />
        </div>
      </div>

      <div className="container-luxe py-16">
        {matchedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-muted-foreground">
              No pieces in this edit just yet.
            </p>
            <Link
              to="/shop"
              search={{ category: "all" }}
              className="mt-4 inline-block border-b border-foreground pb-0.5 eyebrow"
            >
              Return to shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8">
            {matchedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
