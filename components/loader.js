// components/loader.js 
// Cache de componentes
const componentCache = new Map();

async function loadComponent(componentName, targetElement) {
	if (componentCache.has(componentName)) {
		targetElement.innerHTML = componentCache.get(componentName);
		targetElement.dispatchEvent(new CustomEvent("componentLoaded", { detail: { name: componentName } }));
		return;
	}
	try {
		const response = await fetch(`/components/${componentName}.html`);
		if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
		const html = await response.text();

		componentCache.set(componentName, html);
		targetElement.innerHTML = html;

		// Reactivar scripts embebidos
		const scripts = targetElement.querySelectorAll("script");
		scripts.forEach((oldScript) => {
			const newScript = document.createElement("script");
			Array.from(oldScript.attributes).forEach((attr) => {
				newScript.setAttribute(attr.name, attr.value);
			});
			newScript.textContent = oldScript.textContent;
			oldScript.parentNode.replaceChild(newScript, oldScript);
		});

		// Disparar evento
		targetElement.dispatchEvent(new CustomEvent("componentLoaded", { detail: { name: componentName } }));
	} catch (error) {
		console.error(`Error loading component ${componentName}:`, error);
		targetElement.innerHTML = `<p>Error loading ${componentName}</p>`;
	}
}

function initComponents() {
	const headerElement = document.querySelector("header.site-header");
	if (headerElement) loadComponent("nav", headerElement);

	const footerElement = document.querySelector("footer.site-footer");
	if (footerElement) {
		loadComponent("footer", footerElement).then(() => {
			const y = document.getElementById("year");
			if (y) y.textContent = new Date().getFullYear();
		});
	}
	
	const loaderContainer = document.querySelector('div.loader');
	
	if(loaderContainer) loadComponent("loader", loaderContainer);
	
	const notFoundC = document.getElementById('nodFound');
	
	if(notFoundC) loadComponent("404", notFoundC);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initComponents);
} else {
	initComponents();
}