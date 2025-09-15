import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Prefer NEXT_PUBLIC_API_URL (should include /api). Fallback to NEXT_PUBLIC_BACKEND_URL + /api or localhost.
const API_BASE =
	process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8008"}/api`;

/**
 * Login with Google using Firebase
 * @returns {Promise<Object>} - User data from Firebase
 */
export const loginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: 'select_account' });
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		const idToken = await user.getIdToken();
		// Exchange with backend for role-bearing JWT
	const res = await fetch(`${API_BASE}/auth/firebase`, {
			method:'POST',
			headers:{ 'Content-Type':'application/json' },
			body: JSON.stringify({ idToken })
		});
		if(!res.ok){
			const err = await res.json().catch(()=>({}));
			throw new Error(err.message || 'Backend exchange failed');
		}
		const data = await res.json();
		return { ...data.user, token: data.token, isGoogle:true };
	} catch(error){
		console.error('Google login error:', error);
		throw error;
	}
};

/**
 * Register with email and password using backend
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's name
 * @returns {Promise<Object>} - User data from backend
 */
export const registerWithEmail = async (email, password, name) => {
	try {
	const response = await fetch(`${API_BASE}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, name }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Registration failed");
		}

		return await response.json();
	} catch (error) {
		console.error("Registration error:", error);
		throw error;
	}
};

/**
 * Login with email and password using backend
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data from backend
 */
export const loginWithEmail = async (email, password) => {
	try {
	const response = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Login failed");
		}

		return await response.json();
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
};

/**
 * Logout from Firebase (for Google users) and clear backend session
 * @returns {Promise<void>}
 */
export const logout = async () => {
	try {
		// Only sign out from Firebase if there's a current user
		if (auth.currentUser) {
			await signOut(auth);
		}

		// Clear backend session
	await fetch(`${API_BASE}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
	} catch (error) {
		console.error("Logout error:", error);
		throw error;
	}
};

// Refresh backend JWT to pick up updated role (e.g., after promotion)
export const refreshToken = async () => {
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
	if(!token) throw new Error('No existing token');
	const res = await fetch(`${API_BASE}/auth/refresh-token`, {
		method:'POST',
		headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }
	});
	if(!res.ok) throw new Error('Refresh failed');
	return res.json();
};
