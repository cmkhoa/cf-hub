import { API_ENDPOINTS, getAuthHeader } from "../config/api";

class ApiService {
	static async request(endpoint, options = {}) {
		const defaultOptions = {
			headers: {
				"Content-Type": "application/json",
				...getAuthHeader(),
			},
		};

		try {
			const response = await fetch(endpoint, {
				...defaultOptions,
				...options,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "API request failed");
			}

			return await response.json();
		} catch (error) {
			console.error("API Error:", error);
			throw error;
		}
	}

	// Auth endpoints
	static async login(credentials) {
		return this.request(API_ENDPOINTS.auth.login, {
			method: "POST",
			body: JSON.stringify(credentials),
		});
	}

	static async register(userData) {
		return this.request(API_ENDPOINTS.auth.register, {
			method: "POST",
			body: JSON.stringify(userData),
		});
	}

	static async logout() {
		return this.request(API_ENDPOINTS.auth.logout, {
			method: "POST",
		});
	}

	// User endpoints
	static async getProfile() {
		return this.request(API_ENDPOINTS.users.getProfile);
	}

	static async updateProfile(profileData) {
		return this.request(API_ENDPOINTS.users.updateProfile, {
			method: "PUT",
			body: JSON.stringify(profileData),
		});
	}

	// Chat endpoint (using Next.js API route)
	static async sendChatMessage(message) {
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [
						{
							role: "user",
							content: message,
						},
					],
				}),
			});

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}

			const data = await response.json();
			return { response: data.content };
		} catch (error) {
			console.error("Error sending chat message:", error);
			throw error;
		}
	}
}

export default ApiService;
