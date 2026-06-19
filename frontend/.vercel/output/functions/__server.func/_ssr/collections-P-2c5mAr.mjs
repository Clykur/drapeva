import { t as COLLECTION_IMAGES } from "./media-2VLHM--f.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections-P-2c5mAr.js
var import_jsx_runtime = require_jsx_runtime();
var COLLECTION_EDITS = [
	{
		slug: "heritage-weaves",
		name: "Heritage Weaves",
		tagline: "Handloom masterworks",
		desc: "A tribute to Katan silk, real gold zari, and heirloom weaves direct from Varanasi and Kanchipuram master weavers.",
		image: COLLECTION_IMAGES.heritageWeaves
	},
	{
		slug: "vivah-couture",
		name: "Vivah Couture",
		tagline: "The bridal trousseau",
		desc: "Intricately detailed bridal silk sarees hand-finished with gold thread zardozi and real pearls for the luxury bride.",
		image: COLLECTION_IMAGES.vivahCouture
	},
	{
		slug: "soiree",
		name: "Soirée",
		tagline: "For the celebration",
		desc: "Fluid chiffons, designer organzas and shimmering crystal cut borders for modern evening receptions and festive ceremonies.",
		image: COLLECTION_IMAGES.soiree
	},
	{
		slug: "modern-minimalist",
		name: "Modern Minimalist",
		tagline: "Contemporary drapes",
		desc: "Contemporary hand-block linens and breathable mulmul cottons designed for everyday elegance and effortless grace.",
		image: COLLECTION_IMAGES.modernMinimalist
	}
];
function CollectionsIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "The Atelier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-6xl",
					children: "Seasonal Edits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed",
					children: "Discover curations designed in our Mumbai studio, capturing centuries-old artisan traditions for the modern silhouette."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16 space-y-16",
		children: COLLECTION_EDITS.map((col, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `grid gap-8 items-center md:grid-cols-2`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `overflow-hidden bg-champagne/40 ${index % 2 === 1 ? "md:order-2" : ""}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: col.image,
					alt: col.name,
					loading: "lazy",
					className: "w-full aspect-[4/3] object-cover transition-transform duration-1000 hover:scale-105"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `space-y-4 md:px-8 ${index % 2 === 1 ? "md:order-1" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: col.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl md:text-4xl",
						children: col.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground leading-relaxed",
						children: col.desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { collection: col.slug },
						className: "inline-flex items-center gap-3 border border-foreground/60 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase hover:border-foreground hover:bg-foreground hover:text-background transition-all",
						children: ["Browse the edit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			})]
		}, col.slug))
	})] });
}
//#endregion
export { CollectionsIndex as component };
