import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DRpUEMly.js
var useShop = create()(persist((set) => ({
	cart: [],
	wishlist: [],
	cartOpen: false,
	quickView: null,
	addToCart: (product, size = "M", qty = 1) => set((s) => {
		const existing = s.cart.find((c) => c.product.id === product.id && c.size === size);
		return {
			cart: existing ? s.cart.map((c) => c === existing ? {
				...c,
				qty: c.qty + qty
			} : c) : [...s.cart, {
				product,
				size,
				qty
			}],
			cartOpen: true
		};
	}),
	removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((c) => c.product.id !== id) })),
	updateQty: (id, qty) => set((s) => ({ cart: s.cart.map((c) => c.product.id === id ? {
		...c,
		qty
	} : c).filter((c) => c.qty > 0) })),
	toggleWishlist: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
	openCart: () => set({ cartOpen: true }),
	closeCart: () => set({ cartOpen: false }),
	setQuickView: (p) => set({ quickView: p }),
	clearCart: () => set({ cart: [] })
}), { name: "maaya-shop" }));
var cartTotal = (cart) => cart.reduce((s, c) => s + c.product.price * c.qty, 0);
var cartCount = (cart) => cart.reduce((s, c) => s + c.qty, 0);
//#endregion
export { cartTotal as n, useShop as r, cartCount as t };
