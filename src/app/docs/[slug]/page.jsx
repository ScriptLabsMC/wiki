import { notFound } from "next/navigation";
import { getDocBySlug, getDocs } from "../../lib/database";
import MarkdownRenderer from "../../components/Utils/MarkdownRenderer";
import Link from "next/link";

export default async function DocPage({ params }) {
	const doc = await getDocBySlug(params.slug);

	if (!doc) {
		notFound();
	}

	// Obtener documentos relacionados de la misma categoría
	const allDocs = await getDocs();
	const relatedDocs = allDocs
		.filter((d) => d.category === doc.category && d.slug !== doc.slug)
		.slice(0, 3);

	return (
		<div className="section doc-page">
			<article className="template-detail">
				<header className="template-header">
					<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
						{doc.icon || "📄"}
					</div>
					<h1 className="gradient-text">{doc.title}</h1>
					<p className="template-description">{doc.description}</p>

					<div className="template-meta-grid">
						<div className="meta-item">
							<span className="meta-label">Categoría</span>
							<span className="meta-value">{doc.category}</span>
						</div>
						{doc.difficulty && (
							<div className="meta-item">
								<span className="meta-label">Dificultad</span>
								<span
									className={`meta-value difficulty-${doc.difficulty}`}>
									{doc.difficulty}
								</span>
							</div>
						)}
						{doc.author && (
							<div className="meta-item">
								<span className="meta-label">Autor</span>
								<span className="meta-value">{doc.author}</span>
							</div>
						)}
						{doc.updated && (
							<div className="meta-item">
								<span className="meta-label">Actualizado</span>
								<span className="meta-value">
									{doc.updated}
								</span>
							</div>
						)}
					</div>

					{doc.tags && doc.tags.length > 0 && (
						<div className="template-tags">
							{doc.tags.map((tag, index) => (
								<span
									key={index}
									className="tag">
									{tag}
								</span>
							))}
						</div>
					)}
				</header>

				{/* Contenido Markdown */}
				<section className="template-content-section">
					<MarkdownRenderer content={doc.content} />
				</section>

				{/* Recursos adicionales */}
				{doc.resources && doc.resources.length > 0 && (
					<section className="files-section">
						<h2>🔗 Recursos adicionales</h2>
						<div className="files-grid">
							{doc.resources.map((resource, index) => (
								<div
									key={index}
									className="file-card">
									<div className="file-header">
										<span className="file-icon">🔗</span>
										<a
											href={resource.url}
											target="_blank"
											rel="noopener noreferrer"
											style={{ color: "var(--primary)" }}>
											{resource.title}
										</a>
									</div>
									{resource.description && (
										<p className="file-description">
											{resource.description}
										</p>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Documentos relacionados */}
				{relatedDocs.length > 0 && (
					<section className="files-section">
						<h2>📚 Documentos relacionados</h2>
						<div className="files-grid">
							{relatedDocs.map((relDoc) => (
								<Link
									key={relDoc.slug}
									href={`/docs/${relDoc.slug}`}
									className="file-card"
									style={{ textDecoration: "none" }}>
									<div className="file-header">
										<span className="file-icon">
											{relDoc.icon || "📄"}
										</span>
										<span
											style={{
												color: "var(--text)",
												fontWeight: "500"
											}}>
											{relDoc.title}
										</span>
									</div>
									{relDoc.description && (
										<p className="file-description">
											{relDoc.description}
										</p>
									)}
								</Link>
							))}
						</div>
					</section>
				)}

				<footer className="template-footer">
					<div className="footer-grid">
						<div className="footer-item">
							<Link
								href="/docs"
								className="btn btn-ghost">
								← Volver a Documentación
							</Link>
						</div>
					</div>
				</footer>
			</article>
		</div>
	);
}
