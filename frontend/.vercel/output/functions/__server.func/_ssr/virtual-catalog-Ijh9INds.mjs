import { i as __toESM } from "../_runtime.mjs";
import { n as EDITORIAL_IMAGES } from "./media-2VLHM--f.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as ChevronRight, L as ChevronLeft, U as ArrowRight, V as BookOpen } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/virtual-catalog-Ijh9INds.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGES = [
	{
		title: "Vivah Couture Cover",
		tagline: "The Bridal Atelier",
		desc: "A celebration of hand-embroidered velvet and gold zardozi motifs.",
		image: EDITORIAL_IMAGES.catalogPage1,
		productId: "noor-crimson"
	},
	{
		title: "Heritage Weaves Cover",
		tagline: "Banarasi & Kanjivaram Rarities",
		desc: "Pure mulberry silk handloom textiles woven in ancient Varanasi lanes.",
		image: EDITORIAL_IMAGES.catalogPage2,
		productId: "meera-emerald"
	},
	{
		title: "Soirée Couture Cover",
		tagline: "Celebration Fluidity",
		desc: "Shimmering crystal-cut borders and flowing pastels for evening receptions.",
		image: EDITORIAL_IMAGES.catalogPage3,
		productId: "ivaana-ivory"
	},
	{
		title: "Varanasi Heritage Weaves",
		tagline: "The Real Gold tested Zari Saree",
		desc: "Blush Banarasi silk woven in 24k tested zari designed with master looms.",
		image: EDITORIAL_IMAGES.catalogPage4,
		productId: "saira-blush"
	}
];
function VirtualCatalog() {
	const [currentPage, setCurrentPage] = (0, import_react.useState)(0);
	const nextPage = () => {
		if (currentPage < PAGES.length - 1) setCurrentPage(currentPage + 1);
	};
	const prevPage = () => {
		if (currentPage > 0) setCurrentPage(currentPage - 1);
	};
	const current = PAGES[currentPage];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-gold" }), " Atelier Journal"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-6xl",
					children: "Virtual Catalog"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed",
					children: "Flip through the seasonal atelier pages to read artisan stories and explore ready-to-measure commissions."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16 flex flex-col items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-4xl border border-border bg-background shadow-soft grid md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[3/4] overflow-hidden bg-champagne/10 border-b md:border-b-0 md:border-r border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: current.image,
					alt: "",
					className: "w-full h-full object-cover transition-all duration-700 animate-rise"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 md:p-12 flex flex-col justify-between h-full min-h-[400px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] uppercase tracking-[0.25em] text-gold",
								children: current.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl md:text-4xl mt-3",
								children: current.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed pt-2",
								children: current.desc
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$id",
							params: { id: current.productId },
							className: "group inline-flex items-center gap-3 bg-foreground px-6 py-4 text-[10px] font-bold tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground",
							children: [
								"Inquire details",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border pt-6 flex justify-between items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Plate ",
							currentPage + 1,
							" of ",
							PAGES.length
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: prevPage,
								disabled: currentPage === 0,
								className: "p-2 border border-border disabled:opacity-30 hover:border-foreground transition-colors",
								"aria-label": "Previous Page",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: nextPage,
								disabled: currentPage === PAGES.length - 1,
								className: "p-2 border border-border disabled:opacity-30 hover:border-foreground transition-colors",
								"aria-label": "Next Page",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})]
						})]
					})
				]
			})]
		})
	})] });
}
//#endregion
export { VirtualCatalog as component };
