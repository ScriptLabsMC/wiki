import AddonsList from "../components/AddonsList";

export const metadata = {
	title: "ScriptLabs | Add-ons Page",
	description: "Explore, download, and learn about our add-ons.",
	keywords: "add-ons, Minecraft, projects",
};

export default function Addons() {
	return (
		<div className="section">
			<h1 className="gradient-text">Add-ons</h1>
			<p className="lead">
				Explora, descarga y aprende de nuestros proyectos.
			</p>
			<AddonsList />
		</div>
	);
}
