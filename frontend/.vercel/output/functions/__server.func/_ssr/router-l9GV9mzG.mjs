import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useLocation, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$29 } from "../_slug-G4yf2k-P.mjs";
import { n as cartTotal, r as useShop, t as cartCount } from "./store-DRpUEMly.mjs";
import { C as Menu, D as Instagram, S as MessageCircle, b as Minus, d as ShoppingBag, h as Search, i as User, k as Heart, t as X, v as Plus } from "../_libs/lucide-react.mjs";
import { t as Route$30 } from "../_slug-iE9yZOss.mjs";
import { t as Route$31 } from "./product._id-CzdqEjBg.mjs";
import { t as Route$32 } from "./reset-password-C9ofaeM2.mjs";
import { t as Route$33 } from "./shop-CByhVwVP.mjs";
import { t as Route$34 } from "./search-BK-urxjF.mjs";
import { t as Route$35 } from "./verify-LbV94bpC.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-l9GV9mzG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BKAZGVUv.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var LEFT_NAV = [
	{
		to: "/",
		label: "Home",
		search: {}
	},
	{
		to: "/shop",
		label: "Shop Sarees",
		search: {}
	},
	{
		to: "/collections",
		label: "Collections",
		search: {}
	},
	{
		to: "/new-arrivals",
		label: "New Arrivals",
		search: {}
	}
];
var RIGHT_NAV = [
	{
		to: "/bestsellers",
		label: "Best Sellers",
		search: {}
	},
	{
		to: "/lookbook",
		label: "Lookbook",
		search: {}
	},
	{
		to: "/about",
		label: "About Us",
		search: {}
	},
	{
		to: "/support",
		label: "Contact",
		search: {}
	}
];
var ALL_NAV = [...LEFT_NAV, ...RIGHT_NAV];
function SiteHeader() {
	const location = useLocation();
	const isHeroPath = location.pathname === "/" || location.pathname === "/about";
	const [hasHero, setHasHero] = (0, import_react.useState)(isHeroPath);
	const [heroVisible, setHeroVisible] = (0, import_react.useState)(isHeroPath);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const cart = useShop((s) => s.cart);
	const wishlist = useShop((s) => s.wishlist);
	const openCart = useShop((s) => s.openCart);
	const count = cartCount(cart);
	(0, import_react.useEffect)(() => {
		let observer = null;
		const checkHero = () => {
			const heroEl = document.querySelector("[data-hero-section]");
			if (heroEl) {
				setHasHero(true);
				observer = new IntersectionObserver(([entry]) => {
					setHeroVisible(entry.isIntersecting);
				}, { threshold: 0 });
				observer.observe(heroEl);
			} else {
				setHasHero(false);
				setHeroVisible(false);
			}
		};
		checkHero();
		const timeoutId = window.setTimeout(checkHero, 100);
		const mutationObserver = new MutationObserver(checkHero);
		mutationObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
		return () => {
			window.clearTimeout(timeoutId);
			mutationObserver.disconnect();
			if (observer) observer.disconnect();
		};
	}, [location.pathname]);
	(0, import_react.useEffect)(() => {
		const on = () => setScrolled(window.scrollY > 20);
		on();
		window.addEventListener("scroll", on, { passive: true });
		return () => window.removeEventListener("scroll", on);
	}, []);
	const isHidden = hasHero && heroVisible;
	const isFloating = hasHero ? !heroVisible : scrolled;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-ink text-background overflow-hidden h-9 flex items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex animate-marquee whitespace-nowrap text-[0.7rem] tracking-[0.32em] uppercase",
				children: Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-12 px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Complimentary shipping across India" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: "◆"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hand-finished, made-to-order" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: "◆"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Concierge on WhatsApp · +91 98 0000 0000" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: "◆"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New arrivals every Friday" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: "◆"
						})
					]
				}, i))
			})
		}),
		!hasHero && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[72px] md:h-[88px]" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: `fixed left-0 right-0 mx-auto z-40 transition-navbar ${isFloating ? "top-4 w-[92vw] md:w-[88vw] max-w-6xl rounded-2xl md:rounded-full border border-border/80 bg-background/85 backdrop-blur-xl shadow-lg" : "top-9 w-full max-w-none border border-transparent border-b-border bg-background"} ${isHidden ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `grid grid-cols-[1fr_auto_1fr] items-center gap-6 transition-navbar ${isFloating ? "w-full py-2.5 md:py-3.5 px-6 md:px-10" : "container-luxe py-4 md:py-5"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg:hidden -ml-2 p-2",
							"aria-label": "Menu",
							onClick: () => setOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-widest font-semibold",
							children: LEFT_NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								search: n.search,
								className: "relative text-foreground/80 hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full",
								children: n.label
							}, n.label))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "justify-self-center text-center select-none",
						"aria-label": "Maaya home",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl md:text-3xl tracking-[0.2em] font-medium",
							children: "MAAYA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block eyebrow mt-0.5 text-[0.55rem]",
							children: "Couture · Est. 1998"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 justify-self-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-widest font-semibold mr-2",
							children: RIGHT_NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								search: n.search,
								className: "relative text-foreground/80 hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full",
								children: n.label
							}, n.label))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 md:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "hidden md:inline-flex p-2 hover:text-gold transition-colors",
									"aria-label": "Search",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-[18px] w-[18px]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/wishlist",
									className: "relative p-2 hover:text-gold transition-colors",
									"aria-label": "Wishlist",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-[18px] w-[18px]" }), wishlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-medium text-gold-foreground",
										children: wishlist.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "hidden md:inline-flex p-2 hover:text-gold transition-colors",
									"aria-label": "Account",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-[18px] w-[18px]" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: openCart,
									className: "relative p-2 hover:text-gold transition-colors",
									"aria-label": "Cart",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-[18px] w-[18px]" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-medium text-gold-foreground",
										children: count
									})]
								})
							]
						})]
					})
				]
			})
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-ink/40",
				onClick: () => setOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-y-0 left-0 w-[82%] max-w-sm bg-background p-6 animate-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl tracking-[0.2em]",
							children: "MAAYA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(false),
							"aria-label": "Close",
							className: "p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mt-10 flex flex-col gap-1",
						children: [ALL_NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							search: n.search,
							onClick: () => setOpen(false),
							className: "border-b border-border/60 py-4 font-display text-2xl",
							children: n.label
						}, n.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/wishlist",
							onClick: () => setOpen(false),
							className: "border-b border-border/60 py-4 font-display text-2xl",
							children: "Wishlist"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://wa.me/919800000000",
						className: "mt-10 inline-flex items-center gap-2 eyebrow text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" }), " Concierge on WhatsApp"]
					})
				]
			})]
		})
	] });
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-32 border-t border-border bg-champagne/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-3xl tracking-[0.2em]",
						children: "MAAYA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground",
						children: "An atelier of heirloom Indian silk sarees — handwoven, hand-finished, and quietly contemporary. Crafted in India since 1998."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-8 flex max-w-sm border-b border-foreground/30 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							placeholder: "Your email for early access",
							className: "flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "eyebrow text-foreground hover:text-gold transition-colors",
							children: "Join →"
						})]
					})
				] }), [
					{
						title: "Shop",
						links: [
							{
								label: "Shop All",
								to: "/shop",
								search: {}
							},
							{
								label: "Kanjivaram Sarees",
								to: "/shop",
								search: { category: "kanjivaram-sarees" }
							},
							{
								label: "Banarasi Sarees",
								to: "/shop",
								search: { category: "banarasi-sarees" }
							},
							{
								label: "Bridal Sarees",
								to: "/shop",
								search: { category: "bridal-sarees" }
							},
							{
								label: "New Arrivals",
								to: "/new-arrivals",
								search: {}
							}
						]
					},
					{
						title: "Atelier",
						links: [
							{
								label: "Our Story",
								to: "/about",
								search: {}
							},
							{
								label: "Craftsmanship",
								to: "/about",
								search: {}
							},
							{
								label: "Lookbook",
								to: "/lookbook",
								search: {}
							},
							{
								label: "Journal",
								to: "/shop",
								search: {}
							}
						]
					},
					{
						title: "Service",
						links: [
							{
								label: "WhatsApp Concierge",
								to: "/book-appointment",
								search: {}
							},
							{
								label: "Shipping & Returns",
								to: "/support",
								search: {}
							},
							{
								label: "Care Guide",
								to: "/support",
								search: {}
							},
							{
								label: "Contact",
								to: "/support",
								search: {}
							}
						]
					}
				].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "eyebrow text-foreground",
					children: col.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-3 text-sm",
					children: col.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: link.to,
						search: link.search,
						className: "text-muted-foreground hover:text-foreground transition-colors",
						children: link.label
					}) }, link.label))
				})] }, col.title))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Maaya Couture. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#",
							className: "hover:text-foreground inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }), " @maaya.couture"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-foreground",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							className: "hover:text-foreground",
							children: "Terms"
						})
					]
				})]
			})]
		})
	});
}
function CartDrawer() {
	const cartOpen = useShop((s) => s.cartOpen);
	const closeCart = useShop((s) => s.closeCart);
	const cart = useShop((s) => s.cart);
	const updateQty = useShop((s) => s.updateQty);
	const removeFromCart = useShop((s) => s.removeFromCart);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = cartOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [cartOpen]);
	if (!cartOpen) return null;
	const total = cartTotal(cart);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-ink/40 animate-rise",
			onClick: closeCart
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl animate-rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-border px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Your bag"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-xl",
						children: [
							cart.length,
							" ",
							cart.length === 1 ? "item" : "items"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: closeCart,
						"aria-label": "Close",
						className: "p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6 py-6",
					children: cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col items-center justify-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-10 w-10 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-display text-xl",
								children: "Your bag is empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Let's find you something beautiful."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								search: { category: "all" },
								onClick: closeCart,
								className: "mt-6 border-b border-foreground pb-1 eyebrow",
								children: "Browse couture"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: cart.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.product.image,
								alt: item.product.name,
								className: "h-28 w-20 shrink-0 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "eyebrow text-[0.6rem]",
												children: item.product.collection
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 font-display text-base leading-tight",
												children: item.product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: ["Size ", item.size]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: formatINR(item.product.price * item.qty)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "grid h-8 w-8 place-items-center hover:text-gold",
												onClick: () => updateQty(item.product.id, item.qty - 1),
												"aria-label": "Decrease",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-7 text-center text-sm",
												children: item.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "grid h-8 w-8 place-items-center hover:text-gold",
												onClick: () => updateQty(item.product.id, item.qty + 1),
												"aria-label": "Increase",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeFromCart(item.product.id),
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
										children: "Remove"
									})]
								})]
							})]
						}, item.product.id + item.size))
					})
				}),
				cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "border-t border-border p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow",
								children: "Subtotal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl",
								children: formatINR(total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Shipping & taxes calculated at checkout."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							onClick: closeCart,
							className: "mt-5 inline-flex w-full items-center justify-center bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground",
							children: "Secure checkout"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: closeCart,
							className: "mt-3 w-full text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
							children: "Continue shopping"
						})
					]
				})
			]
		})]
	});
}
var SIZES = [
	"XS",
	"S",
	"M",
	"L",
	"XL"
];
function QuickView() {
	const quickView = useShop((s) => s.quickView);
	const setQuickView = useShop((s) => s.setQuickView);
	const addToCart = useShop((s) => s.addToCart);
	const wishlist = useShop((s) => s.wishlist);
	const toggleWishlist = useShop((s) => s.toggleWishlist);
	const [size, setSize] = (0, import_react.useState)("M");
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = quickView ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [quickView]);
	if (!quickView) return null;
	const wished = wishlist.includes(quickView.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 grid place-items-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-ink/50 animate-rise",
			onClick: () => setQuickView(null)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative grid w-full max-w-4xl grid-cols-1 overflow-hidden bg-background shadow-2xl animate-rise md:grid-cols-2 max-h-[92vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setQuickView(null),
					"aria-label": "Close",
					className: "absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur hover:bg-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: quickView.image,
					alt: quickView.name,
					className: "h-72 w-full object-cover md:h-full"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col overflow-y-auto p-7 md:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: quickView.collection
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-2xl md:text-3xl",
							children: quickView.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-baseline gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: formatINR(quickView.price)
							}), quickView.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground line-through",
								children: formatINR(quickView.compareAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-sm leading-relaxed text-muted-foreground",
							children: quickView.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow mb-3",
								children: "Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSize(s),
									className: `h-10 min-w-10 border px-3 text-sm transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`,
									children: s
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-8 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									addToCart(quickView, size);
									setQuickView(null);
								},
								className: "flex-1 bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background hover:bg-gold hover:text-gold-foreground transition-colors",
								children: "Add to bag"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleWishlist(quickView.id),
								"aria-label": "Wishlist",
								className: "grid place-items-center border border-border px-5 py-4 hover:border-foreground transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${wished ? "fill-gold text-gold" : ""}` })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/product/$id",
							params: { id: quickView.id },
							onClick: () => setQuickView(null),
							className: "mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
							children: "View full details →"
						})
					]
				})
			]
		})]
	});
}
function WhatsAppButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "https://wa.me/919800000000?text=Hello%20Maaya%2C%20I%27d%20love%20a%20concierge%20appointment.",
		target: "_blank",
		rel: "noreferrer",
		className: "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] hover:scale-105 transition-transform",
		"aria-label": "Chat on WhatsApp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden sm:inline",
			children: "Chat with us"
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-gold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl",
					children: "This piece is not in our atelier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-8 inline-block border-b border-foreground pb-1 eyebrow",
					children: "Return home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "bg-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-background",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em]",
						children: "Home"
					})]
				})
			]
		})
	});
}
var Route$28 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Maaya Couture — Heirloom Indian Silk Sarees" },
			{
				name: "description",
				content: "Discover Maaya — an atelier of heirloom sarees and bridal drapes. Handwoven by Indian master artisans, designed for the modern bride."
			},
			{
				name: "author",
				content: "Maaya Couture"
			},
			{
				property: "og:title",
				content: "Maaya Couture — Heirloom Indian Silk Sarees"
			},
			{
				property: "og:description",
				content: "Handwoven silk sarees and bridal trousseaus, made-to-order in India."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "theme-color",
				content: "#1a1612"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$28.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppButton, {})
		]
	});
}
var $$splitComponentImporter$27 = () => import("./wishlist-BM98u61C.mjs");
var Route$27 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — Maaya Couture" }, {
		name: "description",
		content: "Pieces you've saved from the Maaya atelier."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./virtual-catalog-Ijh9INds.mjs");
var Route$26 = createFileRoute("/virtual-catalog")({
	head: () => ({ meta: [{ title: "Virtual Catalog — Maaya Couture" }, {
		name: "description",
		content: "Flip through our digital catalog and explore master designs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./new-arrivals-BfrXF_K8.mjs");
var Route$25 = createFileRoute("/new-arrivals")({
	head: () => ({ meta: [{ title: "New Arrivals — Maaya Couture" }, {
		name: "description",
		content: "Shop our newest edits, freshly crafted in our Mumbai studio."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./lookbook-QStha4XT.mjs");
var Route$24 = createFileRoute("/lookbook")({
	head: () => ({ meta: [{ title: "Interactive Lookbook — Maaya Couture" }, {
		name: "description",
		content: "Explore our interactive lookbook styling heritage handwoven sarees."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./compare-Dx4Shedh.mjs");
var Route$23 = createFileRoute("/compare")({
	head: () => ({ meta: [{ title: "Compare Couture — Maaya Couture" }, {
		name: "description",
		content: "Compare fabrics, embroidery, sizes, and pricing options side-by-side."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./checkout-CDM_ic7Q.mjs");
var Route$22 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — Maaya Couture" }, {
		name: "description",
		content: "Secure checkout for your Maaya order."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./celebrity-looks-DuKIiqfc.mjs");
var Route$21 = createFileRoute("/celebrity-looks")({
	head: () => ({ meta: [{ title: "Celebrity Looks — Maaya Couture" }, {
		name: "description",
		content: "Explore handwoven sarees worn and styled by celebrities and icons."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./book-appointment-C1awAu2_.mjs");
var Route$20 = createFileRoute("/book-appointment")({
	head: () => ({ meta: [{ title: "Schedule Saree Styling & Consultation — Maaya Couture" }, {
		name: "description",
		content: "Book a video bridal saree consultation or personal atelier visit with our master stylists."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./bestsellers-BkCPPrBt.mjs");
var Route$19 = createFileRoute("/bestsellers")({
	head: () => ({ meta: [{ title: "Bestsellers — Maaya Couture" }, {
		name: "description",
		content: "Shop our most celebrated and highly rated silk sarees and handloom weaves."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./about-D92ylQWo.mjs");
var Route$18 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "Our Story — Maaya Couture" }, {
		name: "description",
		content: "Learn about the heritage of Maaya Couture: handwoven silk sarees, master weavers, and artisanal zardozi work."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./routes-c3PICkT-.mjs");
var Route$17 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Maaya Couture — Heirloom Indian Silk Sarees" },
		{
			name: "description",
			content: "An atelier of heirloom Indian sarees — handwoven Kanjivarams, Banarasis, and designer chiffons, made-to-order for the modern patron."
		},
		{
			property: "og:title",
			content: "Maaya Couture — Heirloom Indian Silk Sarees"
		},
		{
			property: "og:description",
			content: "Handwoven sarees, made-to-order in India with authentic craftsmanship."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./support-C7Svn9U1.mjs");
var Route$16 = createFileRoute("/support/")({
	head: () => ({ meta: [{ title: "Support Center & FAQ — Maaya Couture" }, {
		name: "description",
		content: "Contact the Maaya concierge or browse policies on shipping, returns, and fits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard-iUmIKRGH.mjs");
var Route$15 = createFileRoute("/dashboard/")({
	head: () => ({ meta: [{ title: "My Account — Maaya Couture" }, {
		name: "description",
		content: "Your Maaya Couture profile, orders, and details."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./collections-P-2c5mAr.mjs");
var Route$14 = createFileRoute("/collections/")({
	head: () => ({ meta: [{ title: "Atelier Collections — Maaya Couture" }, {
		name: "description",
		content: "Explore our curated edits of Banarasi, Kanjivaram, and designer silk sarees."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./blog-qfSCvyTF.mjs");
var Route$13 = createFileRoute("/blog/")({
	head: () => ({ meta: [{ title: "The Journal — Maaya Couture" }, {
		name: "description",
		content: "Artisan stories, saree drape guides, styling tips, and bridal fashion insights from the Maaya studio."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-Ceoppu3I.mjs");
var Route$12 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Admin Overview — Maaya Couture" }, {
		name: "description",
		content: "Management console for Golden Silk Emporium."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./recently-viewed-rvDGk1En.mjs");
var Route$11 = createFileRoute("/dashboard/recently-viewed")({
	head: () => ({ meta: [{ title: "Recently Viewed — Maaya Couture" }, {
		name: "description",
		content: "Review items you recently browsed in the atelier."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./profile-BaxbTjTu.mjs");
var Route$10 = createFileRoute("/dashboard/profile")({
	head: () => ({ meta: [{ title: "Profile Settings — Maaya Couture" }, {
		name: "description",
		content: "Edit your Maaya profile settings."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./orders-BHm5DV6W.mjs");
var Route$9 = createFileRoute("/dashboard/orders")({
	head: () => ({ meta: [{ title: "Order History — Maaya Couture" }, {
		name: "description",
		content: "Review and track your couture commissions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./notifications-CK_u9ri0.mjs");
var Route$8 = createFileRoute("/dashboard/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Maaya Couture" }, {
		name: "description",
		content: "Review alerts and transactional message logs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./addresses-BskT1gK2.mjs");
var Route$7 = createFileRoute("/dashboard/addresses")({
	head: () => ({ meta: [{ title: "Address Book — Maaya Couture" }, {
		name: "description",
		content: "Manage your couture shipping and billing locations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./register-DdraCRxg.mjs");
var Route$6 = createFileRoute("/auth/register")({
	head: () => ({ meta: [{ title: "Register — Maaya Couture" }, {
		name: "description",
		content: "Create your Maaya Couture account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./otp-DbaX2oAD.mjs");
var Route$5 = createFileRoute("/auth/otp")({
	head: () => ({ meta: [{ title: "OTP Verification — Maaya Couture" }, {
		name: "description",
		content: "Verify your phone number with a one-time passcode."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./login-Bstgh6to.mjs");
var Route$4 = createFileRoute("/auth/login")({
	head: () => ({ meta: [{ title: "Login — Maaya Couture" }, {
		name: "description",
		content: "Access your Maaya Couture account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./forgot-password-eutALU8g.mjs");
var Route$3 = createFileRoute("/auth/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot Password — Maaya Couture" }, {
		name: "description",
		content: "Recover your Maaya Couture account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./products-DVHfN14W.mjs");
var Route$2 = createFileRoute("/admin/products")({
	head: () => ({ meta: [{ title: "Admin Product Management — Maaya Couture" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./orders-BTnm2imY.mjs");
var Route$1 = createFileRoute("/admin/orders")({
	head: () => ({ meta: [{ title: "Admin Order Management — Maaya Couture" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./customers-lnwrASTs.mjs");
var Route = createFileRoute("/admin/customers")({
	head: () => ({ meta: [{ title: "Admin Customer Management — Golden Silk Emporium" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var WishlistRoute = Route$27.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$28
});
var VirtualCatalogRoute = Route$26.update({
	id: "/virtual-catalog",
	path: "/virtual-catalog",
	getParentRoute: () => Route$28
});
var ShopRoute = Route$33.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$28
});
var SearchRoute = Route$34.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$28
});
var NewArrivalsRoute = Route$25.update({
	id: "/new-arrivals",
	path: "/new-arrivals",
	getParentRoute: () => Route$28
});
var LookbookRoute = Route$24.update({
	id: "/lookbook",
	path: "/lookbook",
	getParentRoute: () => Route$28
});
var CompareRoute = Route$23.update({
	id: "/compare",
	path: "/compare",
	getParentRoute: () => Route$28
});
var CheckoutRoute = Route$22.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$28
});
var CelebrityLooksRoute = Route$21.update({
	id: "/celebrity-looks",
	path: "/celebrity-looks",
	getParentRoute: () => Route$28
});
var BookAppointmentRoute = Route$20.update({
	id: "/book-appointment",
	path: "/book-appointment",
	getParentRoute: () => Route$28
});
var BestsellersRoute = Route$19.update({
	id: "/bestsellers",
	path: "/bestsellers",
	getParentRoute: () => Route$28
});
var AboutRoute = Route$18.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$28
});
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$28
});
var SupportIndexRoute = Route$16.update({
	id: "/support/",
	path: "/support/",
	getParentRoute: () => Route$28
});
var DashboardIndexRoute = Route$15.update({
	id: "/dashboard/",
	path: "/dashboard/",
	getParentRoute: () => Route$28
});
var CollectionsIndexRoute = Route$14.update({
	id: "/collections/",
	path: "/collections/",
	getParentRoute: () => Route$28
});
var BlogIndexRoute = Route$13.update({
	id: "/blog/",
	path: "/blog/",
	getParentRoute: () => Route$28
});
var AdminIndexRoute = Route$12.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$28
});
var ProductIdRoute = Route$31.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$28
});
var DashboardRecentlyViewedRoute = Route$11.update({
	id: "/dashboard/recently-viewed",
	path: "/dashboard/recently-viewed",
	getParentRoute: () => Route$28
});
var DashboardProfileRoute = Route$10.update({
	id: "/dashboard/profile",
	path: "/dashboard/profile",
	getParentRoute: () => Route$28
});
var DashboardOrdersRoute = Route$9.update({
	id: "/dashboard/orders",
	path: "/dashboard/orders",
	getParentRoute: () => Route$28
});
var DashboardNotificationsRoute = Route$8.update({
	id: "/dashboard/notifications",
	path: "/dashboard/notifications",
	getParentRoute: () => Route$28
});
var DashboardAddressesRoute = Route$7.update({
	id: "/dashboard/addresses",
	path: "/dashboard/addresses",
	getParentRoute: () => Route$28
});
var CollectionsSlugRoute = Route$29.update({
	id: "/collections/$slug",
	path: "/collections/$slug",
	getParentRoute: () => Route$28
});
var BlogSlugRoute = Route$30.update({
	id: "/blog/$slug",
	path: "/blog/$slug",
	getParentRoute: () => Route$28
});
var AuthVerifyRoute = Route$35.update({
	id: "/auth/verify",
	path: "/auth/verify",
	getParentRoute: () => Route$28
});
var AuthResetPasswordRoute = Route$32.update({
	id: "/auth/reset-password",
	path: "/auth/reset-password",
	getParentRoute: () => Route$28
});
var AuthRegisterRoute = Route$6.update({
	id: "/auth/register",
	path: "/auth/register",
	getParentRoute: () => Route$28
});
var AuthOtpRoute = Route$5.update({
	id: "/auth/otp",
	path: "/auth/otp",
	getParentRoute: () => Route$28
});
var AuthLoginRoute = Route$4.update({
	id: "/auth/login",
	path: "/auth/login",
	getParentRoute: () => Route$28
});
var AuthForgotPasswordRoute = Route$3.update({
	id: "/auth/forgot-password",
	path: "/auth/forgot-password",
	getParentRoute: () => Route$28
});
var AdminProductsRoute = Route$2.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => Route$28
});
var AdminOrdersRoute = Route$1.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => Route$28
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	BestsellersRoute,
	BookAppointmentRoute,
	CelebrityLooksRoute,
	CheckoutRoute,
	CompareRoute,
	LookbookRoute,
	NewArrivalsRoute,
	SearchRoute,
	ShopRoute,
	VirtualCatalogRoute,
	WishlistRoute,
	AdminCustomersRoute: Route.update({
		id: "/admin/customers",
		path: "/admin/customers",
		getParentRoute: () => Route$28
	}),
	AdminOrdersRoute,
	AdminProductsRoute,
	AuthForgotPasswordRoute,
	AuthLoginRoute,
	AuthOtpRoute,
	AuthRegisterRoute,
	AuthResetPasswordRoute,
	AuthVerifyRoute,
	BlogSlugRoute,
	CollectionsSlugRoute,
	DashboardAddressesRoute,
	DashboardNotificationsRoute,
	DashboardOrdersRoute,
	DashboardProfileRoute,
	DashboardRecentlyViewedRoute,
	ProductIdRoute,
	AdminIndexRoute,
	BlogIndexRoute,
	CollectionsIndexRoute,
	DashboardIndexRoute,
	SupportIndexRoute
};
var routeTree = Route$28._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
