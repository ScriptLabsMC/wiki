import { notFound } from "next/navigation";
import { getAddonBySlug, getAllAddons } from "../../lib/addons-database";
import AddonViewer from "../../components/AddonViewer";

// Generar metadata dinámica
export async function generateMetadata({ params }) {
	const addon = await getAddonBySlug(params.slug);

	if (!addon) {
		return {
			title: "Add-on No Encontrado - ScriptLabs"
		};
	}

	return {
		title: `${addon.name} - ScriptLabs Add-ons`,
		description:
			addon.summary || `Descarga ${addon.name} para Minecraft Bedrock`,
		openGraph: {
			title: addon.name,
			description: addon.summary || "Add-on para Minecraft Bedrock",
			images: [addon.logo?.url || "/assets/img/logo.png"]
		}
	};
}

// Generar rutas estáticas
export async function generateStaticParams() {
	const addons = await getAllAddons();

	return addons.map((addon) => ({
		slug: addon.id.toString()
	}));
}

export default async function AddonPage({ params }) {
	const addon = await getAddonBySlug(params.slug);

	if (!addon) {
		notFound();
	}

	return <AddonViewer addon={addon} />;
}
