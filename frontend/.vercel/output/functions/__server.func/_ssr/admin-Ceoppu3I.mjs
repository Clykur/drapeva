import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileText, G as Activity, N as DollarSign, d as ShoppingBag, r as Users } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Ceoppu3I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SALES_DATA = [
	{
		month: "Jan",
		sales: 12e5,
		orders: 15
	},
	{
		month: "Feb",
		sales: 18e5,
		orders: 22
	},
	{
		month: "Mar",
		sales: 15e5,
		orders: 18
	},
	{
		month: "Apr",
		sales: 24e5,
		orders: 30
	},
	{
		month: "May",
		sales: 32e5,
		orders: 42
	},
	{
		month: "Jun",
		sales: 45e5,
		orders: 55
	}
];
function AdminDashboard() {
	const { user, isAuthenticated, isAdmin } = useAuth();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated() || !isAdmin()) {
			toast.error("Access denied: Admin credentials required");
			router.navigate({ to: "/auth/login" });
		}
	}, [isAuthenticated, user]);
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
							className: "flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), " Analytics Overview"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/products",
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
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
				className: "space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-gold",
							children: "Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl md:text-4xl",
							children: "Revenue & Store Insights"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 md:grid-cols-4",
						children: [
							{
								label: "Total Revenue",
								val: "₹1,46,00,000",
								icon: DollarSign,
								change: "+24% vs last month"
							},
							{
								label: "Total Orders",
								val: "182",
								icon: ShoppingBag,
								change: "+12% this week"
							},
							{
								label: "Active Clients",
								val: "148",
								icon: Users,
								change: "+8 new registered"
							},
							{
								label: "Conversion Rate",
								val: "3.4%",
								icon: Activity,
								change: "+0.6% increase"
							}
						].map((card, i) => {
							const Icon = card.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border p-6 bg-champagne/10 shadow-soft",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "eyebrow text-[9px]",
											children: card.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-gold stroke-1" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl mt-4",
										children: card.val
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-2",
										children: card.change
									})
								]
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-6 bg-champagne/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl mb-6",
							children: "Revenue Growth (Jan - Jun)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-72 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: SALES_DATA,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "colorSales",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "5%",
												stopColor: "#d4af37",
												stopOpacity: .4
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "95%",
												stopColor: "#d4af37",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#e2dcd0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "#8c7853",
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#8c7853",
											fontSize: 11,
											tickFormatter: (v) => `₹${v / 1e5}L`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => [`₹${value.toLocaleString("en-IN")}`, "Sales"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "sales",
											stroke: "#d4af37",
											fillOpacity: 1,
											fill: "url(#colorSales)",
											strokeWidth: 2
										})
									]
								})
							})
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { AdminDashboard as component };
