import TutorialsList from "../components/TutorialsList";

export const metadata = {
	title: "ScriptLabs | Tutorials Page",
	description: "Learn how to create and use Minecraft add-ons.",
	keywords: "tutorials, Minecraft, add-ons",
};

export default function Tutorials() {
	return (
		<div className="section">
			<h1 className="gradient-text">Tutoriales</h1>
			<TutorialsList />
		</div>
	);
}
