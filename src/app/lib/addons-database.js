const WORKER_URL = "https://getmods.anthonyuribe3456.workers.dev/";

// Cache simple para evitar múltiples requests
let addonsCache = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function getAllAddons() {
	// Usar cache si está fresco
	if (addonsCache && Date.now() - lastFetch < CACHE_DURATION) {
		return addonsCache;
	}

	try {
		const res = await fetch(WORKER_URL, {
			next: { revalidate: 300 } // 5 minutos en producción
		});

		if (!res.ok) throw new Error("Error fetching addons");

		const body = await res.json();
		const addons = body.data || [];

		// Guardar en cache
		addonsCache = addons;
		lastFetch = Date.now();

		return addons;
	} catch (error) {
		console.error("Error loading addons:", error);
		return addonsCache || []; // Devolver cache si hay error
	}
}

export async function getAddonBySlug(slug) {
	const addons = await getAllAddons();

	// Buscar por ID o crear slug desde el nombre
	const addon = addons.find(
		(mod) => mod.id.toString() === slug || createSlug(mod.name) === slug
	);

	return addon || null;
}

export async function getAddonById(id) {
	const addons = await getAllAddons();
	return addons.find((mod) => mod.id.toString() === id) || null;
}

// Función para crear slugs consistentes
function createSlug(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}
