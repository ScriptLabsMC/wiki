"use client";

import { useEffect, useRef } from "react";

export function useMobileMenu() {
	const navRef = useRef(null);
	const navToggleRef = useRef(null);

	useEffect(() => {
		const nav = navRef.current;
		const navToggle = navToggleRef.current;

		if (!nav || !navToggle) return;

		const handleToggle = () => nav.classList.toggle("open");
		const handleClickOutside = (event) => {
			if (
				event.target !== navToggle &&
				!navToggle.contains(event.target)
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
