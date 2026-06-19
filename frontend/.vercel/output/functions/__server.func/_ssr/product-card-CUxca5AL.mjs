import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useShop } from "./store-DRpUEMly.mjs";
import { j as Eye, k as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CUxca5AL.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, priority }) {
	const wishlist = useShop((s) => s.wishlist);
	const toggleWishlist = useShop((s) => s.toggleWishlist);
	const setQuickView = useShop((s) => s.setQuickView);
	const wished = wishlist.includes(product.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$id",
			params: { id: product.id },
			className: "relative block overflow-hidden bg-champagne/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[3/4] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						loading: priority ? "eager" : "lazy",
						width: 900,
						height: 1200,
						className: "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
					})
				}),
				product.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-4 top-4 bg-background/90 px-2.5 py-1 eyebrow text-[0.6rem] text-foreground backdrop-blur",
					children: product.badge
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						toggleWishlist(product.id);
					},
					"aria-label": "Add to wishlist",
					className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 transition-all ${wished ? "fill-gold text-gold" : "text-foreground"}` })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: (e) => {
						e.preventDefault();
						setQuickView(product);
					},
					className: "absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 bg-foreground py-3 text-xs font-medium tracking-[0.2em] uppercase text-background opacity-0 translate-y-3 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Quick view"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-[0.6rem]",
					children: product.collection
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: product.id },
					className: "mt-1.5 block font-display text-lg leading-tight hover:text-gold transition-colors",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex items-baseline gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(product.price) }), product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground line-through",
						children: formatINR(product.compareAt)
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
