import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-champagne/40" />
      <div className="mt-3 h-3 w-3/4 bg-champagne/60 rounded" />
      <div className="mt-2 h-3 w-1/2 bg-champagne/40 rounded" />
      <div className="mt-2 h-3 w-1/3 bg-champagne/30 rounded" />
    </div>
  );
}

export function ProductCarousel({ products, loading }: { products: Product[]; loading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 0);
    setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products, loading]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="group/carousel relative mt-10">
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-[35%] z-10 -translate-y-1/2 rounded-full bg-background/95 p-3 shadow-lg opacity-0 transition-all hover:scale-110 group-hover/carousel:opacity-100 hidden md:block border border-border"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 md:gap-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[75%] min-w-[75%] shrink-0 snap-start md:w-[calc(25%-1.5rem)] md:min-w-[calc(25%-1.5rem)]"
              >
                <ProductSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div
                key={p.id}
                className="w-[75%] min-w-[75%] shrink-0 snap-start md:w-[calc(25%-1.5rem)] md:min-w-[calc(25%-1.5rem)]"
              >
                <ProductCard product={p} />
              </div>
            ))}
      </div>

      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-[35%] z-10 -translate-y-1/2 rounded-full bg-background/95 p-3 shadow-lg opacity-0 transition-all hover:scale-110 group-hover/carousel:opacity-100 hidden md:block border border-border"
          aria-label="Next products"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
