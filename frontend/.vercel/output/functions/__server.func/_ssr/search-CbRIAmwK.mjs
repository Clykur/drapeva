import { i as __toESM } from "../_runtime.mjs";
import { n as PRODUCTS } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Search } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
import { t as Route } from "./search-BK-urxjF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CbRIAmwK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q } = Route.useSearch();
	const [results, setResults] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!q) {
			setResults([]);
			return;
		}
		const query = q.toLowerCase();
		setResults(PRODUCTS.filter((p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.fabric.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)));
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-gold" }), " Atelier Query"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-5xl",
					children: q ? `Search: "${q}"` : "Search Catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16",
		children: !q ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground font-display",
				children: "Enter keywords in the header query to search our fabrics."
			})
		}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl text-muted-foreground",
				children: "We found no matches for your search."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				search: { category: "all" },
				className: "mt-4 inline-block border-b border-foreground pb-0.5 eyebrow",
				children: "Browse all items"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs uppercase tracking-wider text-muted-foreground mb-8",
			children: [results.length, " results matching search terms"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
			children: results.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
		})] })
	})] });
}
//#endregion
export { SearchPage as component };
