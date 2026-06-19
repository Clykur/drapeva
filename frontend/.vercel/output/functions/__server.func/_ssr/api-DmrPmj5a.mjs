import { t as useAuth } from "./auth-store-BXSGOZH6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DmrPmj5a.js
var API_BASE = "http://localhost:5001/api";
async function refreshAccessToken() {
	const { refreshToken, updateAccessToken, logout } = useAuth.getState();
	if (!refreshToken) return null;
	try {
		const res = await fetch(`${API_BASE}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken })
		});
		if (!res.ok) {
			logout();
			return null;
		}
		const data = await res.json();
		updateAccessToken(data.accessToken);
		return data.accessToken;
	} catch (err) {
		console.error("Token refresh failed:", err);
		logout();
		return null;
	}
}
async function apiFetch(endpoint, options = {}) {
	const { accessToken } = useAuth.getState();
	const headers = {
		"Content-Type": "application/json",
		...options.headers || {}
	};
	if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
	let response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers
	});
	if ((response.status === 401 || response.status === 403) && accessToken) {
		const newToken = await refreshAccessToken();
		if (newToken) {
			headers["Authorization"] = `Bearer ${newToken}`;
			response = await fetch(`${API_BASE}${endpoint}`, {
				...options,
				headers
			});
		}
	}
	const data = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(data.error || data.message || `API error: ${response.status}`);
	return data;
}
var api = {
	auth: {
		login: (body) => apiFetch("/auth/login", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		register: (body) => apiFetch("/auth/register", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		forgotPassword: (email) => apiFetch("/auth/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email })
		}),
		resetPassword: (body) => apiFetch("/auth/reset-password", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		verifyEmail: (token) => apiFetch("/auth/verify-email", {
			method: "POST",
			body: JSON.stringify({ token })
		}),
		otpVerify: (body) => apiFetch("/auth/otp-verify", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		me: () => apiFetch("/auth/me")
	},
	products: {
		list: (params = "") => apiFetch(`/products${params}`),
		get: (id) => apiFetch(`/products/${id}`),
		categories: () => apiFetch("/products/categories"),
		collections: () => apiFetch("/products/collections"),
		create: (body) => apiFetch("/products", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		update: (id, body) => apiFetch(`/products/${id}`, {
			method: "PUT",
			body: JSON.stringify(body)
		}),
		delete: (id) => apiFetch(`/products/${id}`, { method: "DELETE" }),
		submitReview: (id, body) => apiFetch(`/products/${id}/reviews`, {
			method: "POST",
			body: JSON.stringify(body)
		}),
		getReviews: (id) => apiFetch(`/products/${id}/reviews`)
	},
	orders: {
		create: (body) => apiFetch("/orders", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		verifyPayment: (body) => apiFetch("/orders/verify-payment", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		applyCoupon: (code, cartTotal) => apiFetch("/orders/coupon/apply", {
			method: "POST",
			body: JSON.stringify({
				code,
				cartTotal
			})
		}),
		history: () => apiFetch("/orders"),
		get: (id) => apiFetch(`/orders/${id}`),
		updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, {
			method: "PUT",
			body: JSON.stringify({ status })
		})
	},
	appointments: {
		create: (body) => apiFetch("/appointments", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		list: () => apiFetch("/appointments"),
		updateStatus: (id, status) => apiFetch(`/appointments/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status })
		})
	},
	blog: {
		list: () => apiFetch("/blog"),
		get: (slug) => apiFetch(`/blog/${slug}`),
		create: (body) => apiFetch("/blog", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		update: (id, body) => apiFetch(`/blog/${id}`, {
			method: "PUT",
			body: JSON.stringify(body)
		}),
		delete: (id) => apiFetch(`/blog/${id}`, { method: "DELETE" })
	},
	support: {
		createTicket: (body) => apiFetch("/support", {
			method: "POST",
			body: JSON.stringify(body)
		}),
		subscribeNewsletter: (email) => apiFetch("/support/newsletter", {
			method: "POST",
			body: JSON.stringify({ email })
		}),
		tickets: () => apiFetch("/support/tickets"),
		updateTicketStatus: (id, status) => apiFetch(`/support/tickets/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status })
		})
	}
};
//#endregion
export { api as t };
