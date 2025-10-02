"use client";

import { useEffect } from "react";
import { svgs } from "../lib/svg-system";
import { svgColors as colorMap } from "../lib/svg-system";

// Función principal para reemplazar etiquetas personalizadas
function replaceCustomTags() {
	const customTags = ["sl", "ico"];

	customTags.forEach((tag) => {
		const elements = document.querySelectorAll(tag);

		elements.forEach((element) => {
			const classes = element.className.split(" ");
			const svgName = classes.find((cls) =>
				svgs.some((svg) =>
					Array.isArray(svg.name)
						? svg.name.includes(cls)
						: svg.name === cls
				)
			);

			if (svgName) {
				const svgConfig = svgs.find((svg) =>
					Array.isArray(svg.name)
						? svg.name.includes(svgName)
						: svg.name === svgName
				);

				if (svgConfig) {
					let fillColor = "#000000";
					const colorClass = classes.find((cls) => colorMap[cls]);
					if (colorClass) fillColor = colorMap[colorClass];

					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = svgConfig.content;
					const svgElement = tempDiv.querySelector("svg");

					if (svgElement) {
						svgElement.setAttribute("fill", fillColor);
						element.parentNode.replaceChild(svgElement, element);
					}
				}
			}
		});
	});
}

// Función para observar cambios en el DOM
function observeDynamicContent() {
	const observer = new MutationObserver((mutations) => {
		let shouldCheck = false;
		mutations.forEach((mutation) => {
			if (mutation.addedNodes.length) {
				shouldCheck = true;
			}
		});

		if (shouldCheck) {
			replaceCustomTags();
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	return observer; // Para poder desconectarlo después
}

export function useSvgReplacement() {
	useEffect(() => {
		let observer = null;

		function initSvgFinder() {
			try {
				replaceCustomTags();
				observer = observeDynamicContent();
			} catch (e) {
				console.warn("svg-finder init error", e);
			}
		}

		// Si el DOM ya está listo, ejecutar inmediatamente
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", initSvgFinder);
		} else {
			initSvgFinder();
		}

		// Cleanup function
		return () => {
			if (observer) {
				observer.disconnect();
			}
			document.removeEventListener("DOMContentLoaded", initSvgFinder);
		};
	}, []);
}

// Exportar svgFinder para uso programático
export function svgFinder(name, size = 24, color = null) {
	const svgConfig = svgs.find((svg) =>
		Array.isArray(svg.name) ? svg.name.includes(name) : svg.name === name
	);
	if (!svgConfig) return "";
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = svgConfig.content;
	const svgElement = tempDiv.querySelector("svg");
	if (!svgElement) return "";
	if (size) {
		svgElement.setAttribute("width", size);
		svgElement.setAttribute("height", size);
	}
	if (color) {
		const colorVal = colorMap[color] || color;
		svgElement.setAttribute("fill", colorVal);
	}
	return svgElement.outerHTML;
}

// Exponer al window para compatibilidad
if (typeof window !== "undefined" && !window.svgFinder) {
	window.svgFinder = svgFinder;
}
