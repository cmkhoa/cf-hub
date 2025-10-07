"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import en from "@/app/locales/en.json";
import vi from "@/app/locales/vi.json";

const LangContext = createContext();

export function LangProvider({ children }) {
	// Initialize to 'en' on both server and first client render to avoid hydration mismatch
	const [lang, setLang] = useState("en");

	// After mount, read the saved language and apply it
	useEffect(() => {
		try {
			const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
			if (stored && stored !== lang) setLang(stored);
		} catch (_) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		try { localStorage.setItem("lang", lang); } catch (_) {}
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", lang);
		}
	}, [lang]);

	const dict = { en, vi };
	const t = (key, fallback) => {
		const parts = key.split(".");
		let cur = dict[lang];
		for (const p of parts) cur = cur?.[p];
		return cur ?? fallback ?? key;
	};

	return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
	const ctx = useContext(LangContext);
	if (!ctx) throw new Error("useLang must be used within LangProvider");
	return ctx;
}