import { n as PRODUCTS, t as COLLECTIONS } from "./_ssr/products-Ba-nweHn.mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./_slug-G4yf2k-P.mjs";
import { t as ProductCard } from "./_ssr/product-card-CUxca5AL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-D_g14mIK.js
var import_jsx_runtime = require_jsx_runtime();
function CollectionDetail() {
	const { slug } = Route.useParams();
	const collectionInfo = COLLECTIONS.find((c) => c.slug === slug) || {
		name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
		tagline: "Atelier Edit",
		image: COLLECTIONS[0].image
	};
	const matchedProducts = PRODUCTS.filter((p) => p.collection.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[40svh] min-h-[300px] w-full overflow-hidden bg-ink text-background flex items-center justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: collectionInfo.image,
				alt: collectionInfo.name,
				className: "absolute inset-0 h-full w-full object-cover opacity-50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background/25" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative text-center z-10 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: collectionInfo.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl md:text-6xl text-foreground",
						children: collectionInfo.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16",
		children: matchedProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl text-muted-foreground",
				children: "No pieces in this edit just yet."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				search: { category: "all" },
				className: "mt-4 inline-block border-b border-foreground pb-0.5 eyebrow",
				children: "Return to shop"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
			children: matchedProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
		})
	})] });
}
//#endregion
export { CollectionDetail as component };
