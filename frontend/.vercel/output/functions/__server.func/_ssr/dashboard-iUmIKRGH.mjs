import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as LogOut, i as User, p as Settings, w as MapPin, y as Package } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-iUmIKRGH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user, logout, isAuthenticated } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		api.orders.history().then((data) => setOrders(data.slice(0, 3))).catch((err) => console.error(err)).finally(() => setLoading(false));
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
							className: "flex items-center gap-3 px-3 py-2 bg-champagne text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), " Account Overview"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard/orders",
							className: "flex items-center gap-3 px-3 py-2 hover:text-foreground transition-colors",
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
				className: "space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-gold",
							children: "Overview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl md:text-4xl",
							children: "Atelier Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-2",
							children: "Review recent orders, manage your custom measurements, and control billing credentials."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border p-6 bg-champagne/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl mb-4",
									children: "Default Shipping"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: user.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: [
										"Flat 402, Signature Towers",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Juhu Tara Road, Juhu",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Mumbai, Maharashtra - 400049",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"India"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/addresses",
									className: "mt-4 inline-block text-xs uppercase tracking-wider border-b border-foreground pb-0.5",
									children: "Edit address book"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border p-6 bg-champagne/10 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl mb-2",
								children: "Concierge Consultation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed",
								children: "Need style advice or made-to-measure bridal assistance? Book a video consultation session."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/book-appointment",
								className: "mt-4 inline-block bg-foreground text-background py-3 text-center text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground",
								children: "Schedule Appointment"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl pb-4 border-b border-border",
						children: "Recent Orders"
					}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground py-6 animate-pulse",
						children: "Fetching orders..."
					}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-10 text-center border border-dashed border-border mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground font-display",
							children: "No couture commissions found."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							search: { category: "all" },
							className: "mt-4 inline-block bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest",
							children: "Shop the collections"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 divide-y divide-border border-b border-border",
						children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-5 flex flex-wrap justify-between items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: ["Order #", order.id.substring(0, 8).toUpperCase()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"Placed: ",
									new Date(order.createdAt).toLocaleDateString(),
									" · Status:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-gold",
										children: order.status
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: formatINR(order.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/orders",
									className: "text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground mt-1 inline-block",
									children: "Track Details →"
								})]
							})]
						}, order.id))
					})] })
				]
			})]
		})
	});
}
//#endregion
export { Dashboard as component };
