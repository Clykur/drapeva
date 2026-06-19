import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BK-urxjF.js
var $$splitComponentImporter = () => import("./search-CbRIAmwK.mjs");
var searchSchema = objectType({ q: stringType().catch("") });
var Route = createFileRoute("/search")({
	validateSearch: searchSchema,
	head: (ctx) => ({ meta: [{ title: `Search Results for "${ctx.search?.q || ""}" — Maaya Couture` }, {
		name: "description",
		content: `Browse search results matching keyword query.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
