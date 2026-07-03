/* Analytics utility — wraps GA4 gtag() calls so the
   rest of the codebase never touches the raw globals directly. Falls back
   silently when the SDKs haven't loaded (e.g. during SSR or ad-blocking). */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// ─── GA4 ─────────────────────────────────────────────────────────────────────

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function trackPageView(url: string) {
  gtag("event", "page_view", { page_path: url });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  gtag("event", eventName, params);
}

// Ecommerce events
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  gtag("event", "view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  gtag("event", "add_to_cart", {
    currency: "INR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(total: number) {
  gtag("event", "begin_checkout", {
    currency: "INR",
    value: total,
  });
}

export function trackPurchase(
  orderId: string,
  total: number,
  items: Array<{ id: string; name: string; price: number; quantity: number }>,
) {
  gtag("event", "purchase", {
    transaction_id: orderId,
    currency: "INR",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackSearch(query: string) {
  gtag("event", "search", { search_term: query });
}
