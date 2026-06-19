import { i as __toESM } from "../_runtime.mjs";
import { n as PRODUCTS } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as X, u as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
import { t as Route } from "./shop-CByhVwVP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-Bpz1zhwP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FABRICS = [
	"Silk",
	"Kanjivaram",
	"Banarasi",
	"Organza",
	"Chiffon",
	"Linen",
	"Cotton",
	"Designer",
	"Handloom",
	"Contemporary"
];
var WEAVES = [
	"Kanjivaram",
	"Banarasi",
	"Jamdani",
	"Patola",
	"Chanderi",
	"Chikankari",
	"Ikat",
	"Paithani"
];
var OCCASIONS = [
	"Bridal",
	"Festive",
	"Reception",
	"Casual",
	"Formal"
];
var COLORS = [
	"Red",
	"Green",
	"Blue",
	"Yellow",
	"Pink",
	"White",
	"Gold",
	"Violet",
	"Orange",
	"Wine",
	"Teal",
	"Peach"
];
var PRICE_BANDS = [
	{
		label: "Under ₹30,000",
		max: 3e4
	},
	{
		label: "₹30,000 – ₹60,000",
		min: 3e4,
		max: 6e4
	},
	{
		label: "₹60,000 – ₹1,00,000",
		min: 6e4,
		max: 1e5
	},
	{
		label: "Above ₹1,00,000",
		min: 1e5
	}
];
function Shop() {
	const { category, fabric, weave, collection, occasion } = Route.useSearch();
	const [selectedFabrics, setSelectedFabrics] = (0, import_react.useState)(fabric ? [fabric] : []);
	const [selectedWeaves, setSelectedWeaves] = (0, import_react.useState)(weave ? [weave] : []);
	const [selectedOccasions, setSelectedOccasions] = (0, import_react.useState)(occasion ? [occasion] : []);
	const [selectedColors, setSelectedColors] = (0, import_react.useState)([]);
	const [priceBandIndex, setPriceBandIndex] = (0, import_react.useState)(null);
	const [inStockOnly, setInStockOnly] = (0, import_react.useState)(false);
	const [sort, setSort] = (0, import_react.useState)("featured");
	const [open, setOpen] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		let list = [...PRODUCTS];
		if (category && category !== "all") list = list.filter((p) => p.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase());
		if (collection) list = list.filter((p) => p.collection.toLowerCase().replace(/\s+/g, "-") === collection.toLowerCase());
		const activeFabrics = selectedFabrics.length ? selectedFabrics : fabric ? [fabric] : [];
		if (activeFabrics.length) list = list.filter((p) => activeFabrics.some((f) => p.fabric.toLowerCase() === f.toLowerCase()));
		const activeWeaves = selectedWeaves.length ? selectedWeaves : weave ? [weave] : [];
		if (activeWeaves.length) list = list.filter((p) => activeWeaves.some((w) => p.weave.toLowerCase() === w.toLowerCase()));
		const activeOccasions = selectedOccasions.length ? selectedOccasions : occasion ? [occasion] : [];
		if (activeOccasions.length) list = list.filter((p) => activeOccasions.some((o) => p.occasion.toLowerCase() === o.toLowerCase()));
		if (selectedColors.length) list = list.filter((p) => selectedColors.some((c) => p.color.toLowerCase().includes(c.toLowerCase())));
		if (inStockOnly) list = list.filter((p) => p.inStock);
		if (priceBandIndex !== null) {
			const band = PRICE_BANDS[priceBandIndex];
			list = list.filter((p) => (!band.min || p.price >= band.min) && (!band.max || p.price < band.max));
		}
		if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
		if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
		if (sort === "new") list.sort((a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0));
		return list;
	}, [
		category,
		fabric,
		weave,
		collection,
		occasion,
		selectedFabrics,
		selectedWeaves,
		selectedOccasions,
		selectedColors,
		priceBandIndex,
		inStockOnly,
		sort
	]);
	const toggle = (arr, v, set) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
	const clearAll = () => {
		setSelectedFabrics([]);
		setSelectedWeaves([]);
		setSelectedOccasions([]);
		setSelectedColors([]);
		setPriceBandIndex(null);
		setInStockOnly(false);
	};
	const heading = collection ? collection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "All Couture Sarees";
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
					children: heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-xl text-sm text-muted-foreground",
					children: "Each masterwork is hand-finished in our South Mumbai studio and shipped, with concierge care, across the world."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: {},
							className: `pb-1 border-b transition-colors ${!collection ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "All Weaves"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { collection: "heritage-weaves" },
							className: `pb-1 border-b transition-colors ${collection === "heritage-weaves" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Heritage Weaves"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { collection: "vivah-couture" },
							className: `pb-1 border-b transition-colors ${collection === "vivah-couture" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Vivah Couture (Bridal)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { collection: "soiree" },
							className: `pb-1 border-b transition-colors ${collection === "soiree" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Soirée (Festive)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { collection: "modern-minimalist" },
							className: `pb-1 border-b transition-colors ${collection === "modern-minimalist" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Modern Minimalist"
						})
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[260px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `${open ? "fixed inset-0 z-50 overflow-y-auto bg-background p-6" : "hidden"} lg:static lg:block lg:p-0`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between lg:hidden mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: "Filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(false),
							"aria-label": "Close",
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Fabric",
						children: FABRICS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: f,
							checked: selectedFabrics.includes(f),
							onChange: () => toggle(selectedFabrics, f, setSelectedFabrics)
						}, f))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Weave Type",
						children: WEAVES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: w,
							checked: selectedWeaves.includes(w),
							onChange: () => toggle(selectedWeaves, w, setSelectedWeaves)
						}, w))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Color",
						children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: c,
							checked: selectedColors.includes(c),
							onChange: () => toggle(selectedColors, c, setSelectedColors)
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Occasion",
						children: OCCASIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: o,
							checked: selectedOccasions.includes(o),
							onChange: () => toggle(selectedOccasions, o, setSelectedOccasions)
						}, o))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Price Range",
						children: PRICE_BANDS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: b.label,
							checked: priceBandIndex === i,
							onChange: () => setPriceBandIndex(priceBandIndex === i ? null : i)
						}, b.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Availability",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
							label: "In Stock Only",
							checked: inStockOnly,
							onChange: () => setInStockOnly(!inStockOnly)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex gap-3 lg:flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen(false),
							className: "flex-1 bg-foreground py-3 text-xs uppercase tracking-[0.2em] text-background lg:hidden font-medium",
							children: [
								"Show ",
								filtered.length,
								" pieces"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearAll,
							className: "flex-1 border border-border py-3 text-xs uppercase tracking-[0.2em] hover:border-foreground font-medium transition-colors",
							children: "Clear all"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [filtered.length, " masterworks found"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(true),
						className: "inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] lg:hidden font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), " Filter"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-foreground cursor-pointer font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "featured",
								children: "Featured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "new",
								children: "Newest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-asc",
								children: "Price: Low to High"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-desc",
								children: "Price: High to Low"
							})
						]
					})]
				})]
			}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid place-items-center py-24 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "No sarees match your current filters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: clearAll,
					className: "mt-4 border-b border-foreground pb-1 eyebrow text-xs",
					children: "Clear filters"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})] })]
		})
	})] });
}
function FilterGroup({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border py-6 first:pt-0 lg:first:pt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "eyebrow mb-4",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 max-h-48 overflow-y-auto pr-2",
			children
		})]
	});
}
function Check$1({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex cursor-pointer items-center gap-3 text-sm select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			onClick: onChange,
			className: `grid h-4 w-4 shrink-0 place-items-center border transition-colors ${checked ? "border-foreground bg-foreground" : "border-border"}`,
			children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 bg-background" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: checked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
			children: label
		})]
	});
}
//#endregion
export { Shop as component };
