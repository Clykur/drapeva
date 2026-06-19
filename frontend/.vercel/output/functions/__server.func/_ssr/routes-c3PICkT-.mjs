import { a as PRODUCT_IMAGES, i as HERO_VIDEO, r as HERO_POSTER } from "./media-2VLHM--f.mjs";
import { n as PRODUCTS, t as COLLECTIONS } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Instagram, U as ArrowRight, a as Truck, f as ShieldCheck, l as Sparkles, s as Star } from "../_libs/lucide-react.mjs";
import { t as ProductCard } from "./product-card-CUxca5AL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-c3PICkT-.js
var import_jsx_runtime = require_jsx_runtime();
var TESTIMONIALS = [
	{
		name: "Ananya M.",
		city: "Mumbai",
		quote: "My Maaya Kanjivaram felt like an heirloom from the very first drape. The real gold zari work is breathtaking.",
		rating: 5
	},
	{
		name: "Priya S.",
		city: "London",
		quote: "The concierge helped me customize my reception Banarasi silk saree from across the world. It arrived perfect.",
		rating: 5
	},
	{
		name: "Ishita R.",
		city: "Delhi",
		quote: "Soft, regal, and unmistakably mine. I will be wearing this silk saree for decades.",
		rating: 5
	}
];
function Home() {
	const bestsellers = PRODUCTS.filter((p) => p.badge === "Bestseller" || p.compareAt).slice(0, 4);
	const newArrivals = PRODUCTS.filter((p) => p.badge === "New").concat(PRODUCTS).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			"data-hero-section": true,
			className: "relative isolate overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-[88svh] min-h-[640px] w-full overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
						autoPlay: true,
						loop: true,
						muted: true,
						playsInline: true,
						className: "absolute inset-0 h-full w-full object-cover animate-fade-in",
						poster: HERO_POSTER,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
							src: HERO_VIDEO,
							type: "video/mp4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: HERO_POSTER,
							alt: "Premium Luxury Sarees",
							className: "absolute inset-0 h-full w-full object-cover"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/55 via-background/10 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container-luxe relative z-10 flex h-full flex-col justify-end pb-20 md:justify-center md:pb-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-xl animate-rise",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "eyebrow flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" }), " The Vivah Edit · AW26"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-5 font-display text-5xl leading-[1.05] md:text-7xl",
									children: [
										"Premium",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shimmer-text",
											children: "Luxury Sarees"
										}),
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 max-w-md text-base leading-relaxed text-foreground/80",
									children: "Experience the finest Indian handloom artistry. Discover masterfully woven Kanjivarams, Banarasis, and designer silk sarees, crafted by hand in our South Mumbai atelier."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-9 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/shop",
										search: {},
										className: "group inline-flex items-center gap-3 bg-foreground px-7 py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground",
										children: ["Shop the edit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/shop",
										search: { occasion: "Bridal" },
										className: "inline-flex items-center gap-3 border border-foreground/60 px-7 py-4 text-xs font-medium tracking-[0.25em] uppercase hover:border-foreground hover:bg-foreground hover:text-background transition-colors",
										children: "Book a bridal consult"
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-6 right-6 hidden md:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-foreground/70",
							children: "Scroll"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-12 w-px bg-foreground/40" })]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-champagne/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-luxe grid grid-cols-2 gap-6 py-8 md:grid-cols-4",
				children: [
					{
						icon: Sparkles,
						t: "Hand-finished",
						s: "by master weavers"
					},
					{
						icon: Truck,
						t: "Complimentary shipping",
						s: "across India"
					},
					{
						icon: ShieldCheck,
						t: "Bespoke finishing",
						s: "in 2–4 weeks"
					},
					{
						icon: Star,
						t: "4.9 / 5 rating",
						s: "from 12,000+ patrons"
					}
				].map(({ icon: Icon, t, s }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 shrink-0 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: s
						})]
					})]
				}, t))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-24 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" }),
							" The Collections ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-4xl md:text-5xl",
						children: "An atelier of stories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground",
						children: "Four worlds, woven by hand. Each collection is a love letter to a heritage Indian weaving style, reinterpreted for today."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-4",
				children: COLLECTIONS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: { collection: c.slug },
					className: `group relative block overflow-hidden ${i % 2 === 1 ? "md:translate-y-6" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[3/4] overflow-hidden bg-champagne/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.image,
							alt: c.name,
							loading: "lazy",
							width: 900,
							height: 1200,
							className: "h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-7 text-background",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow text-background/70 text-[0.6rem]",
								children: c.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-2xl",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold",
								children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})
						]
					})]
				}, c.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe pb-24 md:pb-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Most loved"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-3xl md:text-4xl",
					children: "Bestsellers"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: {},
					className: "eyebrow inline-flex items-center gap-2 hover:text-gold transition-colors",
					children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
				children: bestsellers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden bg-ink text-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: PRODUCT_IMAGES[0].image,
				alt: "Folded silk sarees",
				className: "absolute inset-0 h-full w-full object-cover opacity-40",
				loading: "lazy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-luxe relative grid items-center gap-10 py-24 md:grid-cols-2 md:py-36",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "The Bridal Atelier"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-4xl leading-tight md:text-6xl",
						children: "For the bride who whispers, not shouts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md text-sm leading-relaxed text-background/75",
						children: "A private, by-appointment trousseau experience with our master weavers — in South Mumbai, or via virtual consult. Choose from rare weaves, custom border motifs, and personalized borders for your forever saree."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { occasion: "Bridal" },
						className: "mt-9 inline-flex items-center gap-3 border border-gold px-7 py-4 text-xs tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-gold-foreground transition-colors",
						children: ["Book an appointment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				] })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-24 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Just in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-3xl md:text-4xl",
					children: "New arrivals"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/shop",
					search: {},
					className: "eyebrow inline-flex items-center gap-2 hover:text-gold transition-colors",
					children: ["See more ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8",
				children: newArrivals.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id + "-new"))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-champagne/40 py-24 md:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow flex items-center justify-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" }),
							" Words from our patrons",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-4xl md:text-5xl",
						children: "Worn with love"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-6 md:grid-cols-3",
					children: TESTIMONIALS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "bg-background p-8 shadow-[var(--shadow-card)] hover-lift",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 text-gold",
								children: Array.from({ length: t.rating }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-gold" }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "mt-5 font-display text-xl leading-snug",
								children: [
									"\"",
									t.quote,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-6 eyebrow",
								children: [
									t.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["· ", t.city]
									})
								]
							})
						]
					}, t.name))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-24 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "eyebrow flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-3.5 w-3.5" }), " @maaya.couture"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-4xl md:text-5xl",
					children: "As styled by you"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid grid-cols-2 gap-2 md:grid-cols-6",
				children: PRODUCTS.slice(0, 6).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://instagram.com",
					className: "group relative aspect-square overflow-hidden bg-champagne/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: "",
						loading: "lazy",
						width: 900,
						height: 900,
						className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/30 group-hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-6 w-6 text-background" })
					})]
				}, i))
			})]
		})
	] });
}
//#endregion
export { Home as component };
