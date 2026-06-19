import { i as __toESM } from "../_runtime.mjs";
import { n as PRODUCTS, r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileText, G as Activity, c as SquarePen, d as ShoppingBag, o as Trash2, r as Users, v as Plus } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-DVHfN14W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const { user, isAuthenticated, isAdmin } = useAuth();
	const router = useRouter();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("");
	const [fabric, setFabric] = (0, import_react.useState)("Silk");
	const [occasion, setOccasion] = (0, import_react.useState)("Bridal");
	const [description, setDescription] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated() || !isAdmin()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		api.products.list().then((data) => setItems(data)).catch(() => {
			setItems(PRODUCTS);
		}).finally(() => setLoading(false));
	}, [isAuthenticated]);
	const handleDelete = async (id) => {
		try {
			await api.products.delete(id);
			setItems(items.filter((p) => p.id !== id));
			toast.success("Product deleted successfully");
		} catch {
			setItems(items.filter((p) => p.id !== id));
			toast.success("Product removed (simulated)");
		}
	};
	const handleSave = (e) => {
		e.preventDefault();
		if (selectedProduct) {
			setItems(items.map((p) => p.id === selectedProduct.id ? {
				...p,
				name,
				price: parseFloat(price),
				fabric,
				occasion,
				description
			} : p));
			toast.success("Product updated successfully");
		} else {
			setItems([{
				id: "prod-" + Math.random().toString(36).substring(4),
				name,
				price: parseFloat(price),
				fabric,
				occasion,
				description,
				collection: "Vivah Couture",
				image: "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=600&q=80",
				images: ["https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=600&q=80"],
				details: ["Hand finished", "Silk fabric"],
				variants: [{
					size: "M",
					stock: 10
				}]
			}, ...items]);
			toast.success("New product registered");
		}
		setShowForm(false);
		setSelectedProduct(null);
		setName("");
		setPrice("");
		setDescription("");
	};
	const startEdit = (p) => {
		setSelectedProduct(p);
		setName(p.name);
		setPrice(p.price.toString());
		setFabric(p.fabric);
		setOccasion(p.occasion);
		setDescription(p.description);
		setShowForm(true);
	};
	if (!user || user.role !== "ADMIN") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border-r border-border pr-8 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pb-6 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-wider text-gold",
						children: "ATELIER CMS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground uppercase tracking-widest mt-1",
						children: "Atelier Console"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "space-y-1 text-xs uppercase tracking-widest font-semibold text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), " Analytics Overview"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/products",
							className: "flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Products CRUD"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders",
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Order Book"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/customers",
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Customer List"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center flex-wrap gap-4 border-b border-border pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Registry"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Manage Products"
					})] }), !showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setShowForm(true);
							setSelectedProduct(null);
						},
						className: "inline-flex items-center gap-2 border border-foreground px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-foreground hover:text-background transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Product"]
					})]
				}), showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "max-w-xl border border-border p-6 bg-champagne/10 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl border-b border-border pb-2",
							children: selectedProduct ? "Edit Product Details" : "Register New Couture Sizing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-1 block",
								children: "Product Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "Price (INR)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										required: true,
										value: price,
										onChange: (e) => setPrice(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "Fabric Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: fabric,
										onChange: (e) => setFabric(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Silk",
												children: "Silk"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Kanjivaram",
												children: "Kanjivaram"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Banarasi",
												children: "Banarasi"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Organza",
												children: "Organza"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Chiffon",
												children: "Chiffon"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Linen",
												children: "Linen"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Cotton",
												children: "Cotton"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Designer",
												children: "Designer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Handloom",
												children: "Handloom"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Contemporary",
												children: "Contemporary"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "Occasion"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: occasion,
										onChange: (e) => setOccasion(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Bridal",
												children: "Bridal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Festive",
												children: "Festive"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Reception",
												children: "Reception"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Casual",
												children: "Casual"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Formal",
												children: "Formal"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-1 block",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								required: true,
								rows: 4,
								value: description,
								onChange: (e) => setDescription(e.target.value),
								className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 pt-3 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowForm(false),
								className: "px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border border-transparent hover:border-border transition-colors",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground",
								children: "Save Product"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-champagne/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Category/Fabric"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Occasion"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px] text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-champagne/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4 font-medium flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											className: "h-10 w-8 object-cover border border-border"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4 text-muted-foreground",
										children: [
											p.collection,
											" · ",
											p.fabric
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4",
										children: p.occasion
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-semibold text-gold",
										children: formatINR(p.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4 text-right space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => startEdit(p),
											className: "p-1 hover:text-gold transition-colors inline-block",
											"aria-label": "Edit product",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDelete(p.id),
											className: "p-1 hover:text-destructive transition-colors inline-block",
											"aria-label": "Delete product",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							}, p.id))
						})]
					})
				})]
			})]
		})
	});
}
//#endregion
export { AdminProducts as component };
