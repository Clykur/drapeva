import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CByhVwVP.js
var $$splitComponentImporter = () => import("./shop-Bpz1zhwP.mjs");
var searchSchema = objectType({
	category: stringType().optional(),
	fabric: stringType().optional(),
	weave: stringType().optional(),
	collection: stringType().optional(),
	occasion: stringType().optional()
});
var Route = createFileRoute("/shop")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "The Saree Catalog — Maaya Couture" }, {
		name: "description",
		content: "Shop heirloom Indian sarees: Kanjivaram, Banarasi, Organza, Linen, and Designer weaves from the Maaya atelier."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
