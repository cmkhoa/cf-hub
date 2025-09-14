"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { API_ENDPOINTS, getAuthHeader } from '@/config/api';
import {
	loginWithEmail,
	loginWithGoogle,
	registerWithEmail,
	logout,
	refreshToken,
} from "@/services/auth/authService";

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
	return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Restore session from local JWT on first load (email/password or previously exchanged Google)
	useEffect(() => {
		let cancelled = false;
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (!token) { setLoading(false); return; }
		(async () => {
			try {
				const res = await fetch(API_ENDPOINTS.auth.profile, { headers: { ...getAuthHeader() } });
				if (!res.ok) throw new Error('Profile fetch failed');
				const user = await res.json();
				if (!cancelled) {
					setCurrentUser(user);
					setUserLoggedIn(true);
				}
			} catch (e) {
				if (!cancelled) {
					localStorage.removeItem('token');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, []);

	// Listen for Firebase auth changes (Google sign-in) and always perform backend exchange to retain role
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			// If no Firebase user AND current user marked google, clear it (but keep email/password sessions untouched)
			if (!user) {
				if (currentUser?.isGoogle) {
					setCurrentUser(null);
					setUserLoggedIn(false);
				}
				return;
			}
			const isGoogle = user.providerData.some(p => p.providerId === 'google.com');
			if (!isGoogle) return; // ignore non-google provider events
			try {
				const idToken = await user.getIdToken();
				// Exchange for backend JWT + role
				const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8008';
				const resp = await fetch(`${backendBase}/api/auth/firebase`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ idToken })
				});
				if (!resp.ok) throw new Error('Exchange failed');
				const data = await resp.json();
				if (data.token) localStorage.setItem('token', data.token);
				setCurrentUser({ ...data.user, isGoogle: true });
				setUserLoggedIn(true);
			} catch (e) {
				console.error('Firebase exchange (listener) failed:', e.message);
			}
		});
		return () => unsubscribe();
	}, [currentUser?.isGoogle]);

	// Register with email and password
	const register = async (email, password, name) => {
		setLoading(true);
		setError(null);
		try {
			const data = await registerWithEmail(email, password, name);
			if (data.token) {
				localStorage.setItem("token", data.token);
			}
			setCurrentUser({ ...data.user, role: data.user.role });
			setUserLoggedIn(true);
			return data;
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Login with email and password
	const login = async (email, password) => {
		setLoading(true);
		setError(null);
		try {
			const data = await loginWithEmail(email, password);
			if (data.token) {
				localStorage.setItem("token", data.token);
			}
			setCurrentUser({ ...data.user, role: data.user.role });
			setUserLoggedIn(true);
			return data;
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Login with Google
	const loginWithGoogleAccount = async () => {
		setLoading(true);
		setError(null);
		try {
			const userData = await loginWithGoogle();
			if(userData.token){
				localStorage.setItem('token', userData.token);
			}
			setCurrentUser(userData);
			setUserLoggedIn(true);
			return userData;
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Logout
	const logoutUser = async () => {
		setLoading(true);
		setError(null);
		try {
			await logout();
			localStorage.removeItem("token");
			setCurrentUser(null);
			setUserLoggedIn(false);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// Update user data
	const updateUser = (userData) => {
		setCurrentUser(userData);
		setUserLoggedIn(true);
	};

	// Refresh role/token explicitly (after promotion)
	const refreshRole = async () => {
		try {
			const data = await refreshToken();
			if(data.token){
				localStorage.setItem('token', data.token);
				// Re-fetch profile to ensure all fields updated
				const res = await fetch(API_ENDPOINTS.auth.profile, { headers: { ...getAuthHeader() } });
				if(res.ok){
					const profile = await res.json();
					setCurrentUser(profile);
				}
			}
			return data.role;
		} catch(err){
			console.error('Refresh role failed', err);
			throw err;
		}
	};

	// Context value
	const value = {
		currentUser,
		userLoggedIn,
		loading,
		error,
		register,
		login,
		loginWithGoogle: loginWithGoogleAccount,
		logout: logoutUser,
		updateUser,
		refreshRole,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
