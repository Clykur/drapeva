import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileText, G as Activity, d as ShoppingBag, r as Users } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-BTnm2imY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminOrders() {
	const { user, isAuthenticated, isAdmin } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated() || !isAdmin()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		api.orders.history().then((data) => setOrders(data)).catch(() => {
			setOrders([{
				id: "order-1",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				status: "PENDING",
				name: "Aishwarya Sen",
				email: "customer@maayacouture.com",
				total: 84500
			}, {
				id: "order-2",
				createdAt: (/* @__PURE__ */ new Date(Date.now() - 1e3 * 60 * 60 * 24)).toISOString(),
				status: "PROCESSING",
				name: "Karan Johar",
				email: "karan@johar.com",
				total: 56800
			}]);
		}).finally(() => setLoading(false));
	}, [isAuthenticated]);
	const handleUpdateStatus = async (id, status) => {
		try {
			await api.orders.updateStatus(id, status);
			setOrders(orders.map((o) => o.id === id ? {
				...o,
				status
			} : o));
			toast.success(`Order status updated to: ${status}`);
		} catch {
			setOrders(orders.map((o) => o.id === id ? {
				...o,
				status
			} : o));
			toast.success(`Order status updated to: ${status} (simulated)`);
		}
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
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Products CRUD"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders",
							className: "flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground",
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Order Registry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Manage Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block" })
				] }), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-10 animate-pulse",
					children: "Loading order book..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-champagne/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px] text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-champagne/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-mono font-medium",
										children: o.id.substring(0, 8).toUpperCase()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: o.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: o.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-muted-foreground",
										children: new Date(o.createdAt).toLocaleDateString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-semibold text-gold",
										children: formatINR(o.total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-full ${o.status === "DELIVERED" ? "bg-green-100 text-green-800" : "bg-gold/20 text-gold"}`,
											children: o.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: o.status,
											onChange: (e) => handleUpdateStatus(o.id, e.target.value),
											className: "border border-border bg-background px-2 py-1 text-xs focus:outline-none",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PENDING",
													children: "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "PROCESSING",
													children: "Processing"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "SHIPPED",
													children: "Shipped"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "DELIVERED",
													children: "Delivered"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "CANCELLED",
													children: "Cancelled"
												})
											]
										})
									})
								]
							}, o.id))
						})]
					})
				})]
			})]
		})
	});
}
//#endregion
export { AdminOrders as component };
