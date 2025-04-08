"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
	loginWithEmail,
	loginWithGoogle,
	registerWithEmail,
	logout,
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

	// Listen for auth state changes (only for Google users)
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Only handle Google users here
				const isGoogle = user.providerData.some(
					(provider) => provider.providerId === "google.com"
				);

				if (isGoogle) {
					setCurrentUser({
						email: user.email,
						name: user.displayName,
						photoURL: user.photoURL,
						uid: user.uid,
						isGoogle: true,
					});
					setUserLoggedIn(true);
				}
			} else {
				// Only clear state if it was a Google user
				if (currentUser?.isGoogle) {
					setCurrentUser(null);
					setUserLoggedIn(false);
				}
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [currentUser?.isGoogle]);

	// Register with email and password
	const register = async (email, password, name) => {
		setLoading(true);
		setError(null);
		try {
			const data = await registerWithEmail(email, password, name);
			setCurrentUser(data.user);
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
			setCurrentUser(data.user);
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
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
