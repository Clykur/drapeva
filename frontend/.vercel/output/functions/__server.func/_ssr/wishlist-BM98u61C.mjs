import { n as PRODUCTS } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useShop } from "./store-DRpUEMly.mjs";
import { k as Heart } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-BM98u61C.js
var import_jsx_runtime = require_jsx_runtime();
function Wishlist() {
	const wishlist = useShop((s) => s.wishlist);
	const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Saved"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "Your wishlist"
			})]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-20 max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-display text-2xl",
					children: "Nothing saved just yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Tap the heart on any piece to keep it close."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					search: { category: "all" },
					className: "mt-8 inline-block border-b border-foreground pb-1 eyebrow",
					children: "Discover couture"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		})]
	});
}
//#endregion
export { Wishlist as component };
