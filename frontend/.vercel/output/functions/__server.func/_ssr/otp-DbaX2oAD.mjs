import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./api-DmrPmj5a.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/otp-DbaX2oAD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OtpVerification() {
	const [phone, setPhone] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)(1);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const router = useRouter();
	const handleSendOtp = (e) => {
		e.preventDefault();
		if (!phone) return toast.error("Phone number is required");
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setStep(2);
			toast.success("OTP sent to your phone number (Use 123456 to test)");
		}, 1e3);
	};
	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await api.auth.otpVerify({
				phone,
				code
			});
			toast.success("Phone verified successfully");
			router.navigate({ to: "/dashboard" });
		} catch (err) {
			toast.error(err.message || "Invalid OTP code");
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
						children: "Verification"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-3xl",
						children: "OTP Verification"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 block mx-auto" })
				]
			}), step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSendOtp,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: "Verify your mobile number to receive shipping status SMS logs or finalize consultation schedules."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "Phone Number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							required: true,
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							className: "w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none",
							placeholder: "e.g. +91 98765 43210"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
						children: loading ? "Sending..." : "Send OTP"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleVerifyOtp,
				className: "mt-8 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground leading-relaxed",
						children: [
							"A 6-digit code has been dispatched to +",
							phone.replace(/[^0-9]/g, ""),
							". Enter the pin to finalize setup."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow mb-2 block",
							children: "6-Digit Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							maxLength: 6,
							required: true,
							value: code,
							onChange: (e) => setCode(e.target.value),
							className: "w-full border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.5em] focus:border-foreground focus:outline-none",
							placeholder: "000000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: loading,
						className: "w-full bg-foreground py-4 text-xs font-medium tracking-[0.25em] uppercase text-background transition-colors hover:bg-gold hover:text-gold-foreground disabled:opacity-50",
						children: loading ? "Verifying..." : "Verify Code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStep(1),
							className: "text-xs text-muted-foreground hover:text-foreground border-b border-dashed border-muted-foreground pb-0.5",
							children: "Change Phone Number"
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { OtpVerification as component };
