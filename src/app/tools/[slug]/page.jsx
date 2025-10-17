import { notFound } from "next/navigation";
import { getToolBySlug } from "../../lib/database";
import Link from "next/link";

export default async function ToolPage({ params }) {
	const tool = await getToolBySlug(params.slug);

	if (!tool) {
		notFound();
	}

	return (
		<div className="section tool-page">
			<article className="template-detail">
				<header className="template-header">
					<div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
						{tool.icon || "🔧"}
					</div>
					<h1 className="gradient-text">{tool.title}</h1>
					<p className="template-description">{tool.description}</p>

					<div className="template-meta-grid">
						<div className="meta-item">
							<span className="meta-label">Versión</span>
							<span className="meta-value">v{tool.version}</span>
						</div>
						<div className="meta-item">
							<span className="meta-label">Categoría</span>
							<span className="meta-value">{tool.category}</span>
						</div>
						<div className="meta-item">
							<span className="meta-label">Autor</span>
							<span className="meta-value">{tool.author}</span>
						</div>
						{tool.updated && (
							<div className="meta-item">
								<span className="meta-label">Actualizado</span>
								<span className="meta-value">
									{tool.updated}
								</span>
							</div>
						)}
					</div>

					{tool.tags && tool.tags.length > 0 && (
						<div className="template-tags">
							{tool.tags.map((tag, index) => (
								<span
									key={index}
									className="tag">
									{tag}
								</span>
							))}
						</div>
					)}

					<div
						className="actions"
						style={{ marginTop: "2rem", gap: "1rem" }}>
						{tool.url && (
							<a
								className="btn btn-primary"
								href={tool.url}
								target="_blank"
								rel="noopener noreferrer">
								Abrir Herramienta →
							</a>
						)}
						{tool.docsUrl && (
							<Link
								className="btn btn-ghost"
								href={tool.docsUrl}>
								Ver Documentación
							</Link>
						)}
					</div>
				</header>

				{/* Características */}
				{tool.features && tool.features.length > 0 && (
					<section className="template-content-section">
						<h2>✨ Características</h2>
						<ul
							style={{
								color: "var(--muted)",
								lineHeight: "1.8"
							}}>
							{tool.features.map((feature, index) => (
								<li key={index}>{feature}</li>
							))}
						</ul>
					</section>
				)}

				{/* Requisitos */}
				{tool.requirements && tool.requirements.length > 0 && (
					<section className="files-section">
						<h2>📋 Requisitos</h2>
						<div className="files-grid">
							{tool.requirements.map((req, index) => (
								<div
									key={index}
									className="file-card">
									<p>{req}</p>
								</div>
							))}
						</div>
					</section>
				)}

				<footer className="template-footer">
					<div className="footer-grid">
						{tool.license && (
							<div className="footer-item card glass">
								<h3>📜 Licencia</h3>
								<p>{tool.license}</p>
							</div>
						)}

						{tool.repository && (
							<div className="footer-item card glass">
								<h3>💻 Repositorio</h3>
								<a
									href={tool.repository}
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "var(--primary)" }}>
									Ver en GitHub
								</a>
							</div>
						)}
					</div>
				</footer>
			</article>
		</div>
	);
}
