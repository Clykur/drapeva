import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DdraCRxg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Register() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const router = useRouter();
	const setAuth = useAuth((s) => s.setAuth);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const data = await api.auth.register({
				name,
				email,
				phone,
				password
			});
			setAuth(data.user, data.accessToken, data.refreshToken);
			toast.success("Welcome to the Maaya atelier");
			router.navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[75svh] items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-gold",
							children: "The Atelier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl",
							children: "Create Account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-2 block",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none",
								placeholder: "e.g. Aishwarya Sen"
							})]
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
								placeholder: "e.g. aishwarya@example.com"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-2 block",
								children: "Phone Number (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "tel",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none",
								placeholder: "e.g. +91 98765 43210"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow mb-2 block",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none",
								placeholder: "••••••••"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
							children: loading ? "Creating Atelier profile..." : "Create Account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-8 text-center text-xs text-muted-foreground",
					children: [
						"Already registered?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/login",
							className: "border-b border-muted-foreground pb-0.5 text-foreground hover:border-foreground",
							children: "Sign in"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Register as component };
