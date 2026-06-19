import { n as PRODUCTS } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-arrivals-BfrXF_K8.js
var import_jsx_runtime = require_jsx_runtime();
function NewArrivals() {
	const list = PRODUCTS.filter((p) => p.badge === "New");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Fresh edits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-6xl",
					children: "New Arrivals"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
			children: list.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
		})
	})] });
}
//#endregion
export { NewArrivals as component };
