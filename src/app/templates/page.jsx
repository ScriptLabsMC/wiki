import { getTemplates } from "../lib/database";
import TemplateCard from "../components/Cards/TemplateCard";

export const metadata = {
	title: "ScriptLabs | Templates Page",
	description: "Explore templates and examples for Minecraft.",
	keywords: "templates, examples, Minecraft"
};

export default async function TemplatesPage() {
	const templates = await getTemplates();

	return (
		<div className="section">
			<div style={{ textAlign: "center", marginBottom: "3rem" }}>
				<h1 className="gradient-text">Plantillas y Ejemplos</h1>
				<p
					style={{
						color: "var(--muted)",
						fontSize: "1.1rem",
						maxWidth: "600px",
						margin: "0 auto"
					}}>
					Descubre templates listos para usar en tus proyectos de
					Minecraft Bedrock.
				</p>
			</div>

			{templates.length > 0 ? (
				<div
					className="grid-3"
					style={{ gap: "2rem" }}>
					{templates.map((template) => (
						<TemplateCard
							key={template.slug}
							template={template}
						/>
					))}
				</div>
			) : (
				<div style={{ textAlign: "center", padding: "4rem 2rem" }}>
					<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
						📁
					</div>
					<h2 style={{ color: "var(--text)" }}>
						No hay plantillas aún
					</h2>
					<p
						style={{
							color: "var(--muted)",
							maxWidth: "400px",
							margin: "1rem auto"
						}}>
						Estamos creando templates increíbles para ti. ¡Vuelve
						pronto!
					</p>
				</div>
			)}
		</div>
	);
}
