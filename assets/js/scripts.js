// assets/js/scripts.js
(function () {
	const byId = (id) => document.getElementById(id);

	// Escuchar cuando se cargue el nav
	document.querySelector("header.site-header")?.addEventListener("componentLoaded", (e) => {
		if (e.detail.name === "nav") {
			const nav = byId("nav");
			const navToggle = byId("navToggle");

			// Toggle menú
			if (nav && navToggle) {
				navToggle.addEventListener("click", () => nav.classList.toggle("open"));
				document.addEventListener("click", (event) => {
					if (event.target !== navToggle && !navToggle.contains(event.target)) {
						nav.classList.remove("open");
					}
				});
			}

			// Marcar link activo y determinar si estamos en home
			const links = nav.querySelectorAll("a");
			const currentPath = location.pathname.replace(/\/+$/, ""); // quitar slashes finales
			let isHomeActive = currentPath === "" || currentPath === "/" || currentPath.endsWith("index.html");

			links.forEach(link => {
				const href = link.getAttribute("href");
				if (!href) return;

				const linkPath = new URL(href, location.origin).pathname.replace(/\/+$/, "");
				if ((isHomeActive && linkPath.endsWith("index.html")) || currentPath.endsWith(linkPath)) {
					link.classList.add("active");
				}
			});

			// Si NO estamos en home, añadir botón Inicio
			if (!isHomeActive && nav) {
				const homeLink = document.createElement("a");
				homeLink.href = "/index.html";
				homeLink.textContent = "Inicio";
				homeLink.classList.add("nav-home");
				nav.prepend(homeLink);
			}
		}
	});

	// Año en footer si existe
	const yearEl = byId("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	// Filtros de Tutorials
	const list = byId("tutorialList");
	document.querySelectorAll("[data-filter]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const level = btn.dataset.filter;
			if (!list) return;
			Array.from(list.children).forEach((card) => {
				card.style.display = level === "all" || card.getAttribute("data-level") === level ? "" : "none";
			});
		});
	});
})();