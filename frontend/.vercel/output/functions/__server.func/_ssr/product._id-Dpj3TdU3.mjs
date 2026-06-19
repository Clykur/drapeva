import { i as __toESM } from "../_runtime.mjs";
import { n as PRODUCTS, r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useShop } from "./store-DRpUEMly.mjs";
import { R as ChevronDown, U as ArrowRight, _ as RotateCw, a as Truck, d as ShoppingBag, g as Ruler, k as Heart, l as Sparkles } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
import { t as Route } from "./product._id-CzdqEjBg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-Dpj3TdU3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductZoom({ src, alt }) {
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const containerRef = (0, import_react.useRef)(null);
	const handleMouseMove = (e) => {
		if (!containerRef.current) return;
		const { left, top, width, height } = containerRef.current.getBoundingClientRect();
		setPosition({
			x: (e.clientX - left) / width * 100,
			y: (e.clientY - top) / height * 100
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onMouseEnter: () => setZoom(true),
		onMouseLeave: () => setZoom(false),
		onMouseMove: handleMouseMove,
		className: "relative aspect-[3/4] w-full overflow-hidden bg-champagne/40 cursor-zoom-in border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			className: `h-full w-full object-cover transition-transform duration-200 ${zoom ? "scale-150" : "scale-100"}`,
			style: zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute bottom-4 right-4 bg-ink/75 text-background px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold",
			children: "Hover to Zoom"
		})]
	});
}
function Product360Viewer({ images }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const isDragging = (0, import_react.useRef)(false);
	const startX = (0, import_react.useRef)(0);
	const handleMouseDown = (e) => {
		isDragging.current = true;
		startX.current = e.clientX;
	};
	const handleMouseMove = (e) => {
		if (!isDragging.current || images.length === 0) return;
		const deltaX = e.clientX - startX.current;
		if (Math.abs(deltaX) > 15) {
			const step = deltaX > 0 ? 1 : -1;
			setIndex((prev) => (prev + step + images.length) % images.length);
			startX.current = e.clientX;
		}
	};
	const handleMouseUp = () => {
		isDragging.current = false;
	};
	if (!images || images.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onMouseDown: handleMouseDown,
		onMouseMove: handleMouseMove,
		onMouseUp: handleMouseUp,
		onMouseLeave: handleMouseUp,
		className: "relative aspect-[3/4] w-full select-none overflow-hidden bg-champagne/40 cursor-grab active:cursor-grabbing border border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: images[index],
				alt: "Product 360 view",
				className: "h-full w-full object-cover pointer-events-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-4 left-4 flex items-center gap-2 bg-ink/75 text-background px-3 py-1.5 text-[9px] uppercase tracking-wider font-semibold rounded-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-3.5 w-3.5 animate-spin-slow" }), " 360° View"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-4 inset-x-4 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground uppercase tracking-widest bg-background/80 py-1.5 inline-block px-4",
					children: "Drag horizontally to rotate"
				})
			})
		]
	});
}
var SIZES = [
	"XS",
	"S",
	"M",
	"L",
	"XL"
];
function ProductPage() {
	const { product } = Route.useLoaderData();
	const addToCart = useShop((s) => s.addToCart);
	const wishlist = useShop((s) => s.wishlist);
	const toggleWishlist = useShop((s) => s.toggleWishlist);
	const [size, setSize] = (0, import_react.useState)("M");
	const [active, setActive] = (0, import_react.useState)(0);
	const [openSection, setOpenSection] = (0, import_react.useState)("details");
	const [view360, setView360] = (0, import_react.useState)(false);
	const wished = wishlist.includes(product.id);
	(0, import_react.useEffect)(() => {
		if (product) {
			const filtered = JSON.parse(localStorage.getItem("maaya-recent-viewed") || "[]").filter((p) => p.id !== product.id);
			localStorage.setItem("maaya-recent-viewed", JSON.stringify([product, ...filtered].slice(0, 6)));
		}
	}, [product]);
	const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org/",
				"@type": "Product",
				name: product.name,
				image: product.gallery,
				description: product.description,
				sku: product.id.toUpperCase(),
				offers: {
					"@type": "Offer",
					url: `http://localhost:3000/product/${product.id}`,
					priceCurrency: "INR",
					price: product.price,
					availability: "https://schema.org/InStock",
					itemCondition: "https://schema.org/NewCondition"
				}
			}) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: "http://localhost:3000"
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Shop",
						item: "http://localhost:3000/shop"
					},
					{
						"@type": "ListItem",
						position: 3,
						name: product.name,
						item: `http://localhost:3000/product/${product.id}`
					}
				]
			}) }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-luxe pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						search: { category: "all" },
						className: "hover:text-foreground",
						children: "Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: product.name
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe grid gap-10 py-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[80px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "order-2 flex gap-3 md:order-1 md:flex-col",
					children: [product.gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setActive(i);
							setView360(false);
						},
						className: `aspect-[3/4] w-20 overflow-hidden border transition-colors ${active === i && !view360 ? "border-foreground" : "border-transparent"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: "",
							className: "h-full w-full object-cover"
						})
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setView360(true),
						className: `aspect-[3/4] w-20 flex flex-col items-center justify-center border text-[9px] uppercase tracking-wider transition-colors ${view360 ? "border-gold bg-gold/10 text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4 mb-1" }), "360°"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "order-1 aspect-[3/4] md:order-2",
					children: view360 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Product360Viewer, { images: product.gallery }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductZoom, {
						src: product.gallery[active],
						alt: product.name
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:sticky lg:top-32 lg:self-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: product.collection
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-3xl leading-tight md:text-5xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-baseline gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xl",
								children: formatINR(product.price)
							}),
							product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground line-through",
								children: formatINR(product.compareAt)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "incl. taxes"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "h-3.5 w-3.5" }), " Size guide"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSize(s),
								className: `h-11 min-w-11 border px-4 text-sm transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`,
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => addToCart(product, size),
							className: "inline-flex flex-1 items-center justify-center gap-2 bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Add to bag"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggleWishlist(product.id),
							"aria-label": "Wishlist",
							className: "grid place-items-center border border-border px-6 py-4 hover:border-foreground transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${wished ? "fill-gold text-gold" : ""}` })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `https://wa.me/919800000000?text=${encodeURIComponent(`Hi Maaya, I'd love to know more about the ${product.name}.`)}`,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-4 inline-flex w-full items-center justify-center border border-[#25D366] py-3 text-xs uppercase tracking-[0.25em] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors",
						children: "Enquire on WhatsApp"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-3 border-y border-border py-6 text-xs text-muted-foreground sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-gold" }), " Free shipping in India"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-gold" }), " Hand-finished, made-to-order"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 divide-y divide-border border-y border-border",
						children: [
							{
								id: "details",
								title: "Details",
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 text-sm text-muted-foreground",
									children: product.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["— ", d] }, d))
								})
							},
							{
								id: "shipping",
								title: "Shipping & Returns",
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Made-to-order pieces ship in 3–6 weeks. Complimentary shipping across India; international from ₹2,500. Exchanges accepted within 7 days of delivery on ready-to-wear pieces."
								})
							},
							{
								id: "care",
								title: "Care",
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Dry clean only. Store flat, wrapped in muslin, away from direct sunlight."
								})
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
							open: openSection === s.id,
							onToggle: (e) => e.currentTarget.open && setOpenSection(s.id),
							className: "group py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
								className: "flex cursor-pointer list-none items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow text-foreground",
									children: s.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 transition-transform group-open:rotate-180" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: s.content
							})]
						}, s.id))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							formatINR(product.price),
							" · Size ",
							size
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => addToCart(product, size),
					className: "ml-auto inline-flex items-center gap-2 bg-foreground px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-background",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Add"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe pb-24 pt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "You may also love"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: { category: "all" },
					className: "eyebrow inline-flex items-center gap-2 hover:text-gold",
					children: ["All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
				children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})]
		})
	] });
}
//#endregion
export { ProductPage as component };
