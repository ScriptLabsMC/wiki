import Link from "next/link";

export default function ToolCard({ tool }) {
	return (
		<article className="card glass">
			<div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
				{tool.icon || "🔧"}
			</div>
			<h3>{tool.title}</h3>
			<p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
				{tool.description}
			</p>

			{tool.tags && tool.tags.length > 0 && (
				<div
					className="template-tags"
					style={{ marginBottom: "1rem" }}>
					{tool.tags.slice(0, 3).map((tag, index) => (
						<span key={index} className="tag">
							{tag}
						</span>
					))}
				</div>
			)}

			<div className="actions">
				{tool.url && (
					<a
						className="btn btn-primary"
						href={tool.url}
						target="_blank"
						rel="noopener noreferrer">
						Abrir
					</a>
				)}
				<Link 
					className="btn btn-ghost" 
					href={`/tools/${tool.slug}`}>
					Ver más
				</Link>
				{tool.docsUrl && (
					<Link className="btn btn-ghost" href={tool.docsUrl}>
						Docs
					</Link>
				)}
			</div>
		</article>
	);
}