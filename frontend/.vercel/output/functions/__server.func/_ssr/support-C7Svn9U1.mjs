import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { R as ChevronDown, m as Send } from "../_libs/lucide-react.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-C7Svn9U1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FAQS = [
	{
		q: "How long does a made-to-order bridal piece take?",
		a: "Our heavily embroidered bridal sarees and zardozi trousseaus take between 4 to 6 weeks to weave and hand-finish. Handloom and contemporary sarees ship within 3 to 5 business days."
	},
	{
		q: "Do you offer international shipping?",
		a: "Yes, we ship across the globe. Complimentary shipping is provided within India; international shipping starts from ₹2,500 depending on weight and location."
	},
	{
		q: "How do I submit my custom measurements?",
		a: "Once an order is confirmed, our fitting concierge will reach out to you via email or WhatsApp to schedule a video fitting call and guide you through our step-by-step measurement layout."
	},
	{
		q: "What is your return policy?",
		a: "Since made-to-order couture items are custom stitched to your size, they are non-returnable. For ready-to-wear pieces, we accept returns/exchanges within 7 days of delivery."
	}
];
function SupportCenter() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("faq");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [openFaq, setOpenFaq] = (0, import_react.useState)(null);
	const handleContactSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.support.createTicket({
				name,
				email,
				subject,
				message
			});
			toast.success("Support ticket created. Our concierge will email you shortly.");
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		} catch (err) {
			toast.error(err.message || "Failed to submit request");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Customer Care"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-6xl",
					children: "Support Hub"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-8 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.2em] font-semibold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("faq"),
							className: `pb-1 border-b transition-colors cursor-pointer ${activeTab === "faq" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "FAQs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("contact"),
							className: `pb-1 border-b transition-colors cursor-pointer ${activeTab === "contact" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Contact Us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("policy"),
							className: `pb-1 border-b transition-colors cursor-pointer ${activeTab === "policy" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: "Atelier Policies"
						})
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-16 max-w-3xl",
		children: [
			activeTab === "faq" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4 divide-y divide-border",
				children: FAQS.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-4 first:pt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpenFaq(openFaq === index ? null : index),
						className: "flex w-full justify-between items-center text-left font-display text-lg py-2 cursor-pointer group hover:text-gold transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: faq.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-5 w-5 text-muted-foreground transition-transform duration-300 ${openFaq === index ? "rotate-180 text-gold" : ""}` })]
					}), openFaq === index && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground animate-rise",
						children: faq.a
					})]
				}, index))
			}),
			activeTab === "contact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleContactSubmit,
				className: "space-y-5 border border-border p-6 bg-champagne/10 md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl mb-4",
						children: "Submit Query"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-2 block",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-2 block",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: subject,
							onChange: (e) => setSubject(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							placeholder: "e.g. Blouse fitting request"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Message Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							rows: 5,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							placeholder: "Write details here..."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: loading,
						className: "inline-flex items-center gap-2 bg-foreground text-background px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }),
							" ",
							loading ? "Submitting..." : "Submit Inquiry"
						]
					})
				]
			}),
			activeTab === "policy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8 text-sm leading-relaxed text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-foreground mb-3",
						children: "Shipping Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We provide worldwide shipping. Custom handloom or bridal drapes require 4 to 6 weeks. In-stock sarees ship in 3 to 5 business days. Once your item is dispatched, you will receive tracking numbers via SMS and email." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-foreground mb-3",
						children: "Returns & Refunds"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Because custom items are crafted to your exact specifications, we do not issue refunds or accept returns on made-to-order couture. If you receive a fitting size that deviates from your order details, we offer complimentary adjustments within our studio." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-foreground mb-3",
						children: "Privacy & Terms"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "All client profiles, measurement files, and card details are encrypted. We will never share your sizing or contact details with third-party logistics. By placing an order, you agree to our standard terms of artisan craftsmanship and fitting timelines." })] })
				]
			})
		]
	})] });
}
//#endregion
export { SupportCenter as component };
