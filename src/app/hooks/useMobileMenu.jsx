"use client";

import { useEffect, useRef } from "react";

export function useMobileMenu() {
	const navRef = useRef(null);
	const navToggleRef = useRef(null);

	useEffect(() => {
		const nav = navRef.current;
		const navToggle = navToggleRef.current;

		if (!nav || !navToggle) return;

		const handleToggle = (e) => {
			e.stopPropagation(); // ← Esto evita que el click se propague
			nav.classList.toggle("open");
		};

		const handleClickOutside = (event) => {
			// Si el click NO fue en el navToggle Y NO está dentro del nav
			if (
				event.target !== navToggle &&
				!navToggle.contains(event.target) &&
				!nav.contains(event.target) // ← Importante: verificar también el nav
			) {
				nav.classList.remove("open");
			}
		};

		navToggle.addEventListener("click", handleToggle);
		document.addEventListener("click", handleClickOutside);

		return () => {
			navToggle.removeEventListener("click", handleToggle);
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return { navRef, navToggleRef };
}