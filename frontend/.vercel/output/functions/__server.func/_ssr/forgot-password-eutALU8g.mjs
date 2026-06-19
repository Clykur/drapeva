import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-eutALU8g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPassword() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.auth.forgotPassword(email);
			setSubmitted(true);
			toast.success("Recovery instructions sent if account exists");
		} catch (err) {
			toast.error(err.message || "Failed to submit recovery request");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[75svh] items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-gold",
						children: "Security"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-3xl",
						children: "Recover Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
				]
			}), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Please check your inbox. If the email is registered, we have sent instructions to reset your password."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth/login",
					className: "inline-block bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background",
					children: "Return to Login"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: "Enter your email address and we'll send you an link to reset your account password."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none",
							placeholder: "e.g. customer@example.com"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
						children: loading ? "Sending..." : "Send Reset Link"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/login",
							className: "text-xs text-muted-foreground hover:text-foreground",
							children: "Cancel"
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { ForgotPassword as component };
