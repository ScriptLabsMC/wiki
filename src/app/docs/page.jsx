import { getDocs } from "../lib/database";
import DocCard from "../components/DocCard";

export const metadata = {
	title: "ScriptLabs | Documentation Overview",
	description: "Overview of all documentation available for Minecraft.",
	keywords: "documentation, Minecraft, overview"
};

export default async function DocsPage() {
	const docs = await getDocs();

	// Agrupar documentos por categoría
	const docsByCategory = docs.reduce((acc, doc) => {
		const category = doc.category || "General";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(doc);
		return acc;
	}, {});

	return (
		<div className="section">
			<div style={{ textAlign: "center", marginBottom: "3rem" }}>
				<h1 className="gradient-text">Documentación</h1>
				<p
					style={{
						color: "var(--muted)",
						fontSize: "1.1rem",
						maxWidth: "600px",
						margin: "0 auto"
					}}>
					Aprende a desarrollar addons para Minecraft Bedrock Edition.
				</p>
			</div>

			{docs.length > 0 ? (
				<div>
					{Object.entries(docsByCategory).map(
						([category, categoryDocs]) => (
							<div
								key={category}
								style={{ marginBottom: "3rem" }}>
								<h2
									style={{
										color: "var(--text)",
										marginBottom: "1.5rem"
									}}>
									{category}
								</h2>
								<div
									className="grid-3"
									style={{ gap: "2rem" }}>
									{categoryDocs.map((doc) => (
										<DocCard
											key={doc.slug}
											doc={doc}
										/>
									))}
								</div>
							</div>
						)
					)}
				</div>
			) : (
				<div style={{ textAlign: "center", padding: "4rem 2rem" }}>
					<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
						📚
					</div>
					<h2 style={{ color: "var(--text)" }}>
						No hay documentación aún
					</h2>
					<p
						style={{
							color: "var(--muted)",
							maxWidth: "400px",
							margin: "1rem auto"
						}}>
						Estamos escribiendo guías increíbles para ti. ¡Vuelve
						pronto!
					</p>
				</div>
			)}
		</div>
	);
}
