import { notFound } from "next/navigation";
import { getTemplateBySlug } from "../../lib/database";
import MarkdownRenderer from "../../components/MarkdownRenderer";

export default async function TemplatePage({ params }) {
	const template = await getTemplateBySlug(params.slug);

	if (!template) {
		notFound();
	}

	return (
		<div className="section template-page">
			<article className="template-detail">
				{/* Header */}
				<header className="template-header">
					<h1 className="gradient-text">{template.title}</h1>
					<p className="template-description">
						{template.description}
					</p>

					<div className="template-meta-grid">
						<div className="meta-item">
							<span className="meta-label">Versión</span>
							<span className="meta-value">
								v{template.version}
							</span>
						</div>
						<div className="meta-item">
							<span className="meta-label">Licencia</span>
							<span className="meta-value">
								{template.license}
							</span>
						</div>
						<div className="meta-item">
							<span className="meta-label">Autor</span>
							<span className="meta-value">
								{template.author}
							</span>
						</div>
						<div className="meta-item">
							<span className="meta-label">Dificultad</span>
							<span
								className={`meta-value difficulty-${template.difficulty}`}>
								{template.difficulty}
							</span>
						</div>
					</div>

					<div className="template-tags">
						{template.tags.map((tag, index) => (
							<span
								key={index}
								className="tag">
								{tag}
							</span>
						))}
					</div>
				</header>

				{/* Contenido Markdown */}
				<section className="template-content-section">
					<MarkdownRenderer content={template.content} />
				</section>

				{/* Archivos incluidos */}
				{template.files && template.files.length > 0 && (
					<section className="files-section">
						<h2>📁 Archivos incluidos</h2>
						<div className="files-grid">
							{template.files.map((file, index) => (
								<div
									key={index}
									className="file-card">
									<div className="file-header">
										<span className="file-icon">📄</span>
										<code className="file-path">
											{file.path}
										</code>
									</div>
									{file.description && (
										<p className="file-description">
											{file.description}
										</p>
									)}
									{file.language && (
										<span className="file-language">
											{file.language}
										</span>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Información adicional */}
				<footer className="template-footer">
					<div className="footer-grid">
						{template.dependencies &&
							template.dependencies.length > 0 && (
								<div className="footer-item">
									<h3>📦 Dependencias</h3>
									<ul>
										{template.dependencies.map(
											(dep, index) => (
												<li key={index}>{dep}</li>
											)
										)}
									</ul>
								</div>
							)}

						<div className="footer-item">
							<h3>📋 Categoría</h3>
							<p>{template.category}</p>
						</div>

						<div className="footer-item">
							<h3>🕐 Actualizado</h3>
							<p>{template.updated || template.created}</p>
						</div>
					</div>
				</footer>
			</article>
		</div>
	);
}
