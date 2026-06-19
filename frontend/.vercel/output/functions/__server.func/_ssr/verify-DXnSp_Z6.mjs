import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./verify-LbV94bpC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-DXnSp_Z6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyEmail() {
	const { token } = Route.useSearch();
	const [status, setStatus] = (0, import_react.useState)("verifying");
	(0, import_react.useEffect)(() => {
		if (!token) {
			setStatus("error");
			return;
		}
		api.auth.verifyEmail(token).then(() => {
			setStatus("success");
			toast.success("Email verified successfully");
		}).catch((err) => {
			console.error(err);
			setStatus("error");
			toast.error("Failed to verify email. Token might be invalid or expired.");
		});
	}, [token]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[75svh] items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md border border-border bg-champagne/30 p-8 md:p-10 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-gold",
					children: "Verification"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-3xl",
					children: "Email Verification"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-4",
					children: [
						status === "verifying" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground animate-pulse",
							children: "Verifying your email credentials with our registry..."
						}),
						status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Thank you. Your email address has been successfully verified. You now have full access to our online atelier services."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/login",
							className: "mt-6 inline-block bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background",
							children: "Proceed to Login"
						})] }),
						status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-destructive",
							children: "The verification token is invalid or has expired."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mt-6 inline-block border-b border-foreground pb-0.5 eyebrow",
							children: "Return to home"
						})] })
					]
				})
			]
		})
	});
}
//#endregion
export { VerifyEmail as component };
