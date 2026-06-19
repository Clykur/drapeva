import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as ArrowRight, t as X, v as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lookbook-QStha4XT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOTSPOTS = [{
	id: "h1",
	top: "42%",
	left: "55%",
	product: {
		id: "saree-1-varanasi-heritage",
		name: "Varanasi Heritage Zardozi Saree",
		price: 84500,
		image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?auto=format&fit=crop&w=600&q=80"
	}
}, {
	id: "h2",
	top: "35%",
	left: "38%",
	product: {
		id: "saree-6-mayur",
		name: "Mayur Handwoven Kanjivaram Saree",
		price: 56800,
		image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
	}
}];
function EditorialLookbook() {
	const [activeHotspot, setActiveHotspot] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Interactive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-6xl",
					children: "Editorial Lookbook"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed",
					children: "Click on the atelier markers (+) on the styled model look below to shop the hand-finished sarees."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-2xl aspect-[3/4] bg-champagne/20 border border-border shadow-soft overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1200&q=80",
					alt: "Atelier photoshoot edit",
					className: "w-full h-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/10" }),
				HOTSPOTS.map((hotspot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveHotspot(hotspot),
					style: {
						top: hotspot.top,
						left: hotspot.left
					},
					className: "absolute z-20 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-gold-foreground border-2 border-background animate-pulse transition-transform hover:scale-110 cursor-pointer",
					"aria-label": `View ${hotspot.product.name}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
				}, hotspot.id)),
				activeHotspot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-6 left-6 right-6 z-30 bg-background/95 border border-border p-4 shadow-soft backdrop-blur-md flex items-center gap-4 animate-rise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: activeHotspot.product.image,
							alt: "",
							className: "h-20 w-15 object-cover border border-border"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base leading-tight truncate",
									children: activeHotspot.product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold mt-1 text-gold",
									children: formatINR(activeHotspot.product.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/product/$id",
									params: { id: activeHotspot.product.id },
									className: "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground mt-2 border-b border-muted-foreground",
									children: ["View Details ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveHotspot(null),
							className: "p-1 hover:text-gold transition-colors cursor-pointer",
							"aria-label": "Close details",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})
					]
				})
			]
		})
	})] });
}
//#endregion
export { EditorialLookbook as component };
