const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api";

export const API_ENDPOINTS = {
	auth: {
		login: `${API_BASE_URL}/auth/login`,
		register: `${API_BASE_URL}/auth/register`,
		profile: `${API_BASE_URL}/auth/profile`,
		logout: `${API_BASE_URL}/auth/logout`,
	},
	// Add other endpoints as needed
	users: {
		getProfile: `${API_BASE_URL}/users/profile`,
		updateProfile: `${API_BASE_URL}/users/profile`,
	},
	blog: {
		posts: `${API_BASE_URL}/blog/posts`,
		postBySlug: (slug) => `${API_BASE_URL}/blog/posts/slug/${slug}`,
		categories: `${API_BASE_URL}/blog/categories`,
		tags: `${API_BASE_URL}/blog/tags`,
		publish: (id) => `${API_BASE_URL}/blog/posts/${id}/publish`,
		unpublish: (id) => `${API_BASE_URL}/blog/posts/${id}/unpublish`,
	},
	consultations: {
		submit: `${API_BASE_URL}/consultations`,
		mine: `${API_BASE_URL}/consultations/mine`,
		adminList: ({ page = 1, limit = 20, q = '', status = '' } = {}) => {
			const params = new URLSearchParams();
			params.set('page', page);
			params.set('limit', limit);
			if(q) params.set('q', q);
			if(status) params.set('status', status);
			return `${API_BASE_URL}/consultations?${params.toString()}`;
		},
		adminUpdate: (id) => `${API_BASE_URL}/consultations/${id}`,
	},
	applications: {
		submit: `${API_BASE_URL}/applications`,
		list: ({ page = 1, limit = 20, q = '', status = '' } = {}) => {
			const params = new URLSearchParams();
			params.set('page', page);
			params.set('limit', limit);
			if(q) params.set('q', q);
			if(status) params.set('status', status);
			return `${API_BASE_URL}/applications?${params.toString()}`;
		},
		get: (id) => `${API_BASE_URL}/applications/${id}`,
		resume: (id) => `${API_BASE_URL}/applications/${id}/resume`,
		updateStatus: (id) => `${API_BASE_URL}/applications/${id}/status`,
	},
	mentees: {
		list: `${API_BASE_URL}/mentees`,
		create: `${API_BASE_URL}/mentees`,
		update: (id) => `${API_BASE_URL}/mentees/${id}`,
		remove: (id) => `${API_BASE_URL}/mentees/${id}`,
	}
};

export const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};
