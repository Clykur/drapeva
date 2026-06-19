import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-C9ofaeM2.js
var $$splitComponentImporter = () => import("./reset-password-BwPqWcfu.mjs");
var searchSchema = objectType({ token: stringType().catch("") });
var Route = createFileRoute("/auth/reset-password")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Reset Password — Maaya Couture" }, {
		name: "description",
		content: "Reset your Maaya Couture account password."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
