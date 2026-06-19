import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-store-BXSGOZH6.js
var useAuth = create()(persist((set, get) => ({
	user: {
		id: "mock-admin-id",
		email: "admin@maayacouture.com",
		name: "Sanjana Roy",
		phone: "+91 98000 00000",
		role: "ADMIN"
	},
	accessToken: "mock-access-token",
	refreshToken: "mock-refresh-token",
	setAuth: (user, accessToken, refreshToken) => {
		set({
			user,
			accessToken,
			refreshToken
		});
	},
	updateAccessToken: (accessToken) => {
		set({ accessToken });
	},
	logout: () => {},
	isAuthenticated: () => {
		return true;
	},
	isAdmin: () => {
		return true;
	}
}), { name: "maaya-auth" }));
//#endregion
export { useAuth as t };
