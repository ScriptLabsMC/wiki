import Link from "next/link";

export default function DocCard({ doc }) {
	return (
		<Link
			href={`/docs/${doc.slug}`}
			className="card glass doc-card"
			style={{ textDecoration: "none" }}>
			<div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
				{doc.icon || "📄"}
			</div>
			<h3 style={{ color: "var(--text)" }}>{doc.title}</h3>
			<p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
				{doc.description}
			</p>

			{doc.category && (
				<span
					className="tag"
					style={{ marginBottom: "0.5rem", display: "inline-block" }}>
					{doc.category}
				</span>
			)}

			{doc.difficulty && (
				<div style={{ marginTop: "0.5rem" }}>
					<span className={`meta-value difficulty-${doc.difficulty}`}>
						{doc.difficulty}
					</span>
				</div>
			)}
		</Link>
	);
}
