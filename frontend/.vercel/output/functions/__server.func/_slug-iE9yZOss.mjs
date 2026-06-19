import { m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-iE9yZOss.js
var $$splitComponentImporter = () => import("./_slug-ZJqyIKya.mjs");
var Route = createFileRoute("/blog/$slug")({
	head: ({ params }) => {
		const title = params.slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
		return { meta: [{ title: `${title} — Maaya Couture` }, {
			name: "description",
			content: `Read the article ${title} on the Maaya Couture blog.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
