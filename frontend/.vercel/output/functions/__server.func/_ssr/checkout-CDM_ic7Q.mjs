import { i as __toESM } from "../_runtime.mjs";
import { r as formatINR } from "./products-Ba-nweHn.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cartTotal, r as useShop } from "./store-DRpUEMly.mjs";
import { E as Lock, z as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CDM_ic7Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkout() {
	const cart = useShop((s) => s.cart);
	const clearCart = useShop((s) => s.clearCart);
	const subtotal = cartTotal(cart);
	const total = subtotal + (subtotal > 0 ? 0 : 0);
	const [placed, setPlaced] = (0, import_react.useState)(false);
	if (placed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow mt-6",
				children: "Confirmed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "Thank you, beautifully done."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-md text-sm text-muted-foreground",
				children: "A confirmation is on its way. Our atelier will be in touch within 24 hours to schedule fittings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-10 inline-block border-b border-foreground pb-1 eyebrow",
				children: "Back to the atelier"
			})
		]
	});
	if (cart.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Your bag is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			search: { category: "all" },
			className: "mt-8 inline-block border-b border-foreground pb-1 eyebrow",
			children: "Discover couture"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-12 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Secure checkout"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "Almost yours"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				clearCart();
				setPlaced(true);
			},
			className: "mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Contact",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							label: "Email",
							type: "email",
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							label: "Phone",
							type: "tel",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Shipping address",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "First name",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Last name",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Address",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "City",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "State",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										label: "PIN code",
										required: true
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Payment",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground inline-flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), " All transactions are encrypted."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Card number",
								placeholder: "1234 5678 9012 3456",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Expiry",
									placeholder: "MM / YY",
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "CVV",
									placeholder: "123",
									required: true
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "w-full bg-foreground py-5 text-xs font-medium tracking-[0.3em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground",
						children: ["Place order · ", formatINR(total)]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit border border-border bg-champagne/30 p-7 lg:sticky lg:top-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Order summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 divide-y divide-border",
						children: cart.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.product.image,
									alt: item.product.name,
									className: "h-24 w-18 object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-base leading-tight",
										children: item.product.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [
											"Size ",
											item.size,
											" · Qty ",
											item.qty
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: formatINR(item.product.price * item.qty)
								})
							]
						}, item.product.id + item.size))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: formatINR(subtotal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Shipping",
								value: "Free"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border pt-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow",
									children: "Total"
								}),
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl",
									children: formatINR(total)
								})
							})
						]
					})
				]
			})]
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: title
		}), children]
	});
}
function Input({ label, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "eyebrow mb-2 block",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			...props,
			className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
//#endregion
export { Checkout as component };
