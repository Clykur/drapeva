import { n as EDITORIAL_IMAGES } from "./media-2VLHM--f.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/celebrity-looks-DuKIiqfc.js
var import_jsx_runtime = require_jsx_runtime();
var CELEBRITY_EDITS = [{
	name: "Alia Bhatt",
	event: "Met Gala Afterparty",
	quote: "Wearing Maaya's ivory Banarasi silk saree felt like carrying a piece of home. The pearl thread details and gold borders are breathtaking.",
	image: EDITORIAL_IMAGES.celebAlia,
	productId: "saree-6-mayur"
}, {
	name: "Deepika Padukone",
	event: "Royal Heritage Reception",
	quote: "The Crimson Silk Saree is a masterclass in zardozi embroidery. Extremely regal yet fluid to wear.",
	image: EDITORIAL_IMAGES.celebDeepika,
	productId: "saree-1-varanasi"
}];
function CelebrityLooks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Red Carpet Edits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-5xl",
					children: "Celebrity Looks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16 space-y-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-8 md:grid-cols-2",
			children: CELEBRITY_EDITS.map((celeb) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border p-6 bg-champagne/5 flex flex-col justify-between hover-lift",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: celeb.image,
						alt: celeb.name,
						className: "w-full aspect-[4/3] object-cover border border-border"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow text-gold",
								children: celeb.event
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl mt-1",
								children: celeb.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "mt-3 text-sm italic text-muted-foreground leading-relaxed",
								children: [
									"\"",
									celeb.quote,
									"\""
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-6 border-t border-border mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$id",
						params: { id: celeb.productId },
						className: "inline-block bg-foreground text-background px-5 py-3 text-[10px] uppercase tracking-wider font-semibold hover:bg-gold hover:text-gold-foreground transition-colors",
						children: "Shop the look"
					})
				})]
			}, celeb.name))
		})
	})] });
}
//#endregion
export { CelebrityLooks as component };
