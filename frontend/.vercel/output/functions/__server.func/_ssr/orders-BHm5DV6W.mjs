import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Calendar, M as Download, T as LogOut, f as ShieldCheck, i as User, p as Settings, w as MapPin, y as Package } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BHm5DV6W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderHistory() {
	const { user, logout, isAuthenticated } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		api.orders.history().then((data) => setOrders(data)).catch((err) => console.error(err)).finally(() => setLoading(false));
	}, [isAuthenticated]);
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[250px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 pb-6 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-full bg-champagne text-gold font-display text-lg",
						children: user.name.charAt(0)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-sm",
						children: user.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: user.email
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-6 space-y-1 text-xs uppercase tracking-widest font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							className: "flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Account Overview"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/orders",
							className: "flex items-center gap-3 px-3 py-2 bg-champagne text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), " Order History"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/addresses",
							className: "flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), " Address Book"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/profile",
							className: "flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }), " Profile Settings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								logout();
								router.navigate({ to: "/" });
							},
							className: "w-full flex items-center gap-3 px-3 py-2 text-destructive hover:text-destructive/80 text-left cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign Out"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Commissions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Order History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block" })
				] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-10 animate-pulse",
					children: "Loading purchase history..."
				}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center border border-dashed border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-10 w-10 mx-auto text-muted-foreground stroke-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground font-display",
							children: "You have not placed any orders yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { category: "all" },
							className: "mt-6 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest",
							children: "Discover Couture"
						})
					]
				}) : selectedOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border p-6 md:p-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedOrder(null),
							className: "text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border px-4 py-2",
							children: "← Back to History"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-between items-baseline gap-4 border-b border-border pb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-2xl",
								children: ["Order #", selectedOrder.id.substring(0, 8).toUpperCase()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: ["Placed on: ", new Date(selectedOrder.createdAt).toLocaleDateString()]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gold text-gold-foreground px-3 py-1 text-xs uppercase tracking-wider font-semibold",
									children: selectedOrder.status
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-6 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow text-gold mb-6",
								children: "Atelier Progress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wider",
								children: [
									{
										label: "Design Approved",
										done: true
									},
									{
										label: "Weaving & Embroidery",
										done: [
											"PROCESSING",
											"SHIPPED",
											"DELIVERED"
										].includes(selectedOrder.status)
									},
									{
										label: "Atelier Fitting / Dispatched",
										done: ["SHIPPED", "DELIVERED"].includes(selectedOrder.status)
									},
									{
										label: "Delivered",
										done: selectedOrder.status === "DELIVERED"
									}
								].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-6 w-6 rounded-full border grid place-items-center mb-2 font-semibold ${step.done ? "border-gold bg-gold text-gold-foreground" : "border-border text-muted-foreground"}`,
										children: i + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: step.done ? "text-foreground font-medium" : "text-muted-foreground",
										children: step.label
									})]
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mb-4",
							children: "Couture Pieces"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: selectedOrder.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4 py-4 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.variant.product.images?.[0]?.url || "https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=200&q=80",
										alt: "",
										className: "h-16 w-12 object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-sm font-medium",
											children: item.variant.product.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: [
												"Size ",
												item.variant.size,
												" · Qty ",
												item.quantity
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: formatINR(item.price * item.quantity)
									})
								]
							}, item.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center flex-wrap gap-4 border-t border-border pt-6 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Order Total:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl mt-1",
								children: formatINR(selectedOrder.total)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => toast.success("Invoice generated! Downloading PDF..."),
								className: "inline-flex items-center gap-2 border border-foreground bg-foreground text-background px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-gold hover:text-gold-foreground transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download Invoice"]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border border-border divide-y divide-border",
					children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 flex flex-wrap justify-between items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5 text-gold stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-lg",
								children: ["Order #", order.id.substring(0, 8).toUpperCase()]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-6 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }),
									" ",
									new Date(order.createdAt).toLocaleDateString()
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-gold" }),
									" ",
									order.status
								]
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Total Paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium mt-1",
									children: formatINR(order.total)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedOrder(order),
								className: "border border-border px-4 py-2.5 text-xs uppercase tracking-wider font-medium hover:border-foreground",
								children: "Track Order"
							})]
						})]
					}, order.id))
				})]
			})]
		})
	});
}
//#endregion
export { OrderHistory as component };
