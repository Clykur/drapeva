import { i as __toESM } from "../_runtime.mjs";
import { n as PRODUCTS, r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Trash2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-Dx4Shedh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompareProducts() {
	const [selectedIds, setSelectedIds] = (0, import_react.useState)(["noor-crimson", "saira-blush"]);
	const productsToCompare = PRODUCTS.filter((p) => selectedIds.includes(p.id));
	const removeProduct = (id) => {
		setSelectedIds(selectedIds.filter((pId) => pId !== id));
	};
	const addProduct = (id) => {
		if (selectedIds.length >= 3) return;
		if (!selectedIds.includes(id)) setSelectedIds([...selectedIds, id]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Atelier Compare"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-5xl",
					children: "Compare Creations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16",
		children: productsToCompare.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground font-display",
				children: "No items selected to compare."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				search: { category: "all" },
				className: "mt-4 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest",
				children: "Browse shop"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [selectedIds.length < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 border border-border p-4 bg-champagne/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow mb-3",
				children: "Add item to comparison"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: PRODUCTS.filter((p) => !selectedIds.includes(p.id)).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => addProduct(p.id),
					className: "px-3 py-1.5 border border-border bg-background text-xs uppercase tracking-wider hover:border-foreground",
					children: ["+ ", p.name]
				}, p.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border bg-champagne/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-4 font-display text-base border-r border-border",
						children: "Attribute"
					}), productsToCompare.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-4 border-r border-border last:border-r-0 min-w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col h-full justify-between gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.name,
									className: "h-40 w-30 object-cover border border-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base leading-tight",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: p.collection
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => removeProduct(p.id),
									className: "text-xs text-destructive flex items-center gap-1 mt-2 hover:text-destructive/80 self-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
								})
							]
						})
					}, p.id))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 font-semibold border-r border-border bg-champagne/5",
							children: "Price"
						}), productsToCompare.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 border-r border-border last:border-r-0 font-medium text-gold",
							children: formatINR(p.price)
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 font-semibold border-r border-border bg-champagne/5",
							children: "Fabric"
						}), productsToCompare.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 border-r border-border last:border-r-0",
							children: p.fabric
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 font-semibold border-r border-border bg-champagne/5",
							children: "Occasion"
						}), productsToCompare.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 border-r border-border last:border-r-0",
							children: p.occasion
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-4 font-semibold border-r border-border bg-champagne/5",
						children: "Craft Details"
					}), productsToCompare.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-4 border-r border-border last:border-r-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "list-disc pl-4 space-y-1 text-xs text-muted-foreground",
							children: p.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: d }, d))
						})
					}, p.id))] })
				] })]
			})
		})] })
	})] });
}
//#endregion
export { CompareProducts as component };
