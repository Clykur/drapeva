import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as FileText, F as CircleCheckBig, G as Activity, d as ShoppingBag, r as Users, x as MessageSquare } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-lnwrASTs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const { user, isAuthenticated, isAdmin } = useAuth();
	const router = useRouter();
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated() || !isAdmin()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		setCustomers([{
			id: "c-1",
			name: "Aishwarya Sen",
			email: "customer@maayacouture.com",
			spend: 141300,
			segment: "VIP Bridal"
		}, {
			id: "c-2",
			name: "Karan Johar",
			email: "karan@johar.com",
			spend: 56800,
			segment: "Celebrity Look"
		}]);
		api.support.tickets().then((data) => setTickets(data)).catch(() => {
			setTickets([{
				id: "t-1",
				name: "Aishwarya Sen",
				subject: "Custom Blouse Sizing",
				message: "Can we sleeve length adjustment?",
				status: "OPEN"
			}]);
		}).finally(() => setLoading(false));
	}, [isAuthenticated]);
	const handleTicketResolve = async (id) => {
		try {
			await api.support.updateTicketStatus(id, "RESOLVED");
			setTickets(tickets.map((t) => t.id === id ? {
				...t,
				status: "RESOLVED"
			} : t));
			toast.success("Support ticket resolved");
		} catch {
			setTickets(tickets.map((t) => t.id === id ? {
				...t,
				status: "RESOLVED"
			} : t));
			toast.success("Support ticket resolved (simulated)");
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
							className: "flex items-center gap-3 px-3 py-2.5 hover:text-foreground transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Order Book"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/customers",
							className: "flex items-center gap-3 px-3 py-2.5 bg-champagne text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Customer List"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "space-y-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Segmentation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Customer Directory"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto border border-border mt-6",
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
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Total Spend"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4 eyebrow text-[9px]",
									children: "Classification"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-champagne/5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-semibold",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 text-muted-foreground",
										children: c.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4 font-semibold text-gold",
										children: ["₹", c.spend.toLocaleString("en-IN")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-4 font-semibold text-gold",
										children: c.segment
									})
								]
							}, c.id))
						})]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl border-b border-border pb-4",
					children: "Concierge Support Tickets"
				}), tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-6",
					children: "All support requests resolved."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: tickets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-5 bg-champagne/5 relative flex justify-between items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-gold stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg font-semibold",
									children: t.subject
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"From: ",
									t.name,
									" · Status:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-gold",
										children: t.status
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mt-3 italic",
								children: [
									"\"",
									t.message,
									"\""
								]
							})
						] }), t.status === "OPEN" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleTicketResolve(t.id),
							className: "inline-flex items-center gap-1.5 border border-foreground bg-foreground text-background px-4 py-2 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold hover:text-gold-foreground transition-colors cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5" }), " Resolve"]
						})]
					}, t.id))
				})] })]
			})]
		})
	});
}
//#endregion
export { AdminCustomers as component };
