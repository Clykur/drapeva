import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-LbV94bpC.js
var $$splitComponentImporter = () => import("./verify-DXnSp_Z6.mjs");
var searchSchema = objectType({ token: stringType().catch("") });
var Route = createFileRoute("/auth/verify")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Verify Email — Maaya Couture" }, {
		name: "description",
		content: "Verify your email address."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
