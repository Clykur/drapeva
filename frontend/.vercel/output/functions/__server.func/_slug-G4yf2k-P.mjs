import { m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-G4yf2k-P.js
var $$splitComponentImporter = () => import("./_slug-D_g14mIK.mjs");
var Route = createFileRoute("/collections/$slug")({
	head: ({ params }) => {
		const name = params.slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
		return { meta: [{ title: `${name} — Maaya Couture` }, {
			name: "description",
			content: `Browse pieces from our seasonal ${name} edit.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
