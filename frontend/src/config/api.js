const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
};

export const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};
