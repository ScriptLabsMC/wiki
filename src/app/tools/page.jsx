import { getTools } from "../lib/database";
import ToolCard from "../components/ToolCard";

export default async function ToolsPage() {
	const tools = await getTools();

	return (
		<div className="section">
			<div style={{ textAlign: "center", marginBottom: "3rem" }}>
				<h1 className="gradient-text">Herramientas</h1>
				<p
					style={{
						color: "var(--muted)",
						fontSize: "1.1rem",
						maxWidth: "600px",
						margin: "0 auto"
					}}>
					Todo lo que necesitas para empezar a construir.
				</p>
			</div>

			{tools.length > 0 ? (
				<div
					className="grid-3 tools"
					style={{ gap: "2rem" }}>
					{tools.map((tool) => (
						<ToolCard
							key={tool.slug}
							tool={tool}
						/>
					))}
				</div>
			) : (
				<div style={{ textAlign: "center", padding: "4rem 2rem" }}>
					<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
						🔧
					</div>
					<h2 style={{ color: "var(--text)" }}>
						No hay herramientas aún
					</h2>
					<p
						style={{
							color: "var(--muted)",
							maxWidth: "400px",
							margin: "1rem auto"
						}}>
						Estamos preparando herramientas increíbles para ti.
						¡Vuelve pronto!
					</p>
				</div>
			)}
		</div>
	);
}
