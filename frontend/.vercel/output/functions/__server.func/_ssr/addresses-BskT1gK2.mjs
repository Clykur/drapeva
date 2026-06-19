import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as LogOut, i as User, o as Trash2, p as Settings, v as Plus, w as MapPin, y as Package } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/addresses-BskT1gK2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AddressBook() {
	const { user, logout, isAuthenticated } = useAuth();
	const router = useRouter();
	const [addresses, setAddresses] = (0, import_react.useState)([{
		id: "addr-1",
		name: "Aishwarya Sen",
		phone: "+91 98765 43211",
		line1: "Flat 402, Signature Towers",
		line2: "Juhu Tara Road, Juhu",
		city: "Mumbai",
		state: "Maharashtra",
		postalCode: "400049",
		country: "India",
		isDefault: true
	}]);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [line1, setLine1] = (0, import_react.useState)("");
	const [line2, setLine2] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("");
	const [pin, setPin] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated()) router.navigate({ to: "/auth/login" });
	}, [isAuthenticated]);
	const handleAdd = (e) => {
		e.preventDefault();
		const newAddr = {
			id: "addr-" + Math.random().toString(36).substring(4),
			name,
			phone,
			line1,
			line2: line2 || void 0,
			city,
			state,
			postalCode: pin,
			country: "India",
			isDefault: addresses.length === 0
		};
		setAddresses([...addresses, newAddr]);
		setShowForm(false);
		toast.success("New address added to book");
		setName("");
		setPhone("");
		setLine1("");
		setLine2("");
		setCity("");
		setState("");
		setPin("");
	};
	const handleDelete = (id) => {
		setAddresses(addresses.filter((a) => a.id !== id));
		toast.success("Address removed");
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
							className: "flex items-center gap-3 px-3 py-2 bg-champagne text-foreground",
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
					className: "flex justify-between items-center flex-wrap gap-4 border-b border-border pb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Addresses"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl",
						children: "Address Registry"
					})] }), !showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowForm(true),
						className: "inline-flex items-center gap-2 border border-foreground px-5 py-3 text-xs uppercase tracking-wider font-medium hover:bg-foreground hover:text-background transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Address"]
					})]
				}), showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleAdd,
					className: "max-w-xl border border-border p-6 bg-champagne/10 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl border-b border-border pb-2",
							children: "New Address Details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow mb-1 block",
									children: "Recipient Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "eyebrow mb-1 block",
									children: "Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									required: true,
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-1 block",
								children: "Line 1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: line1,
								onChange: (e) => setLine1(e.target.value),
								className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-1 block",
								children: "Line 2 (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: line2,
								onChange: (e) => setLine2(e.target.value),
								className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "City"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: city,
										onChange: (e) => setCity(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "State"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: state,
										onChange: (e) => setState(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "eyebrow mb-1 block",
										children: "PIN Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: pin,
										onChange: (e) => setPin(e.target.value),
										className: "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 pt-3 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowForm(false),
								className: "px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border border-transparent hover:border-border transition-colors",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "bg-foreground text-background px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors hover:bg-gold hover:text-gold-foreground",
								children: "Save Location"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-2",
					children: addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border p-6 bg-champagne/10 relative",
						children: [
							a.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-4 right-4 bg-gold text-gold-foreground px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium",
								children: "Default"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mt-2 leading-relaxed",
								children: [
									a.line1,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									a.line2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [a.line2, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {})] }),
									a.city,
									", ",
									a.state,
									" - ",
									a.postalCode,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									a.country
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-2",
								children: ["Phone: ", a.phone]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex gap-3 items-center border-t border-border pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleDelete(a.id),
									className: "text-xs text-destructive hover:text-destructive/80 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
								})
							})
						]
					}, a.id))
				})]
			})]
		})
	});
}
//#endregion
export { AddressBook as component };
