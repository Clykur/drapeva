import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Calendar, P as Clock, n as Video, z as Check } from "../_libs/lucide-react.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-appointment-C1awAu2_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIME_SLOTS = [
	"11:00 AM - 12:00 PM",
	"12:30 PM - 01:30 PM",
	"03:00 PM - 04:00 PM",
	"04:30 PM - 05:30 PM",
	"06:00 PM - 07:00 PM"
];
function BookAppointment() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [timeSlot, setTimeSlot] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("VIDEO");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!timeSlot) return toast.error("Please select a time slot");
		setLoading(true);
		try {
			await api.appointments.create({
				name,
				email,
				phone,
				date: new Date(date).toISOString(),
				timeSlot,
				type,
				notes
			});
			setConfirmed(true);
			toast.success("Consultation successfully scheduled!");
		} catch (err) {
			toast.error(err.message || "Failed to schedule appointment");
		} finally {
			setLoading(false);
		}
	};
	if (confirmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-luxe py-24 text-center max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-gold",
				children: "Confirmed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Session Booked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-4 leading-relaxed",
				children: [
					"Thank you, ",
					name,
					". A calendar invite has been sent to your email. Our design concierge will reach out to you via WhatsApp to finalize saree customization requirements."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-10 inline-block border-b border-foreground pb-0.5 eyebrow",
				children: "Back to Atelier"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border bg-champagne/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-luxe py-14 md:py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Services"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl md:text-5xl",
					children: "Book Consultation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed",
					children: "Schedule a session with our master drapers. Available via video call or physical studio visit in South Mumbai."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-luxe py-16 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "w-full max-w-xl border border-border p-6 md:p-10 bg-champagne/10 space-y-6 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl border-b border-border pb-3",
					children: "Saree Trousseau Consultation Form"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setType("VIDEO"),
						className: `flex flex-col items-center justify-center p-4 border transition-all ${type === "VIDEO" ? "border-gold bg-gold/10 text-gold" : "border-border bg-background hover:border-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-6 w-6 stroke-1 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow text-[10px]",
							children: "Video Call"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setType("IN_PERSON"),
						className: `flex flex-col items-center justify-center p-4 border transition-all ${type === "IN_PERSON" ? "border-gold bg-gold/10 text-gold" : "border-border bg-background hover:border-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-6 w-6 stroke-1 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow text-[10px]",
							children: "In-Person visit"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Your Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							placeholder: "e.g. Aishwarya Sen"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							placeholder: "e.g. aishwarya@example.com"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "WhatsApp Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							required: true,
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							placeholder: "e.g. +91 98765 43210"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Select Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							required: true,
							value: date,
							onChange: (e) => setDate(e.target.value),
							className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
							min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "eyebrow mb-3 block",
					children: "Available Time Slots"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: TIME_SLOTS.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTimeSlot(slot),
						className: `px-3 py-2 border text-xs tracking-wider transition-colors ${timeSlot === slot ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:border-foreground"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 inline mr-1 stroke-1" }),
							" ",
							slot
						]
					}, slot))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow mb-2 block",
						children: "Style Details & Custom Requests (Optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: "w-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none",
						placeholder: "Let us know if you have specific collections, weaves, color customization, or monogramming requests in mind..."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: loading,
					className: "w-full bg-foreground text-background py-4 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
					children: loading ? "Scheduling slot..." : "Confirm Booking"
				})
			]
		})
	})] });
}
//#endregion
export { BookAppointment as component };
