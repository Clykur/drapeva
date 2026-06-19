import { n as PRODUCTS } from "./products-Ba-nweHn.mjs";
import { M as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-CzdqEjBg.js
var $$splitNotFoundComponentImporter = () => import("./product._id-Ca7xeor-.mjs");
var $$splitComponentImporter = () => import("./product._id-Dpj3TdU3.mjs");
var Route = createFileRoute("/product/$id")({
	loader: ({ params }) => {
		const product = PRODUCTS.find((p) => p.id === params.id);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.product.name ?? "Product"} — Maaya Couture` },
		{
			name: "description",
			content: loaderData?.product.description ?? ""
		},
		{
			property: "og:title",
			content: loaderData?.product.name ?? ""
		},
		{
			property: "og:description",
			content: loaderData?.product.description ?? ""
		},
		{
			property: "og:image",
			content: loaderData?.product.image ?? ""
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
