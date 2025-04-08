import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Login with Google using Firebase
 * @returns {Promise<Object>} - User data from Firebase
 */
export const loginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		// Force account selection every time
		provider.setCustomParameters({
			prompt: "select_account",
		});
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		return {
			email: user.email,
			name: user.displayName,
			photoURL: user.photoURL,
			uid: user.uid,
			isGoogle: true,
		};
	} catch (error) {
		console.error("Google login error:", error);
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
		const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
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
		const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
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
		await fetch(`${BACKEND_URL}/api/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
	} catch (error) {
		console.error("Logout error:", error);
		throw error;
	}
};
