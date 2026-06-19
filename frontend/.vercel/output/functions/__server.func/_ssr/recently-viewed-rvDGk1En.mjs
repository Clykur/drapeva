import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as History, T as LogOut, i as User, p as Settings, w as MapPin, y as Package } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recently-viewed-rvDGk1En.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecentlyViewed() {
	const { user, logout, isAuthenticated } = useAuth();
	const router = useRouter();
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated()) {
			router.navigate({ to: "/auth/login" });
			return;
		}
		setItems(JSON.parse(localStorage.getItem("maaya-recent-viewed") || "[]"));
	}, [isAuthenticated]);
	const clearHistory = () => {
		localStorage.removeItem("maaya-recent-viewed");
		setItems([]);
	};
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
				className: "space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-baseline flex-wrap gap-4 border-b border-border pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Browse history"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Recently Viewed"
					})] }), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: clearHistory,
						className: "text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground border-b border-foreground pb-0.5",
						children: "Clear History"
					})]
				}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center border border-dashed border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-10 w-10 mx-auto text-muted-foreground stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground font-display",
						children: "No browsing history found."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8",
					children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "group relative block overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/product/$id",
							params: { id: p.id },
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[3/4] overflow-hidden bg-champagne/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.name,
									loading: "lazy",
									className: "h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base group-hover:text-gold transition-colors",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: p.collection
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: formatINR(p.price)
								})]
							})]
						})
					}, p.id))
				})]
			})]
		})
	});
}
//#endregion
export { RecentlyViewed as component };
