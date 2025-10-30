import Link from "next/link";

export default function TemplateCard({ template }) {
	const getDifficultyColor = (difficulty) => {
		const colors = {
			principiante: "var(--primary)",
			intermedio: "var(--accent1)",
			avanzado: "var(--accent2)"
		};
		return colors[difficulty] || "var(--muted)";
	};

	return (
		<Link
			href={`/templates/${template.slug}`}
			className="template-card card glass"
			style={{
				textDecoration: "none",
				color: "inherit",
				display: "block",
				height: "100%"
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					marginBottom: "1rem"
				}}>
				<h3 style={{ margin: 0, flex: 1 }}>{template.title}</h3>
				<span
					style={{
						background: getDifficultyColor(template.difficulty),
						color:
							template.difficulty === "principiante"
								? "#000"
								: "#fff",
						padding: "0.3rem 0.8rem",
						borderRadius: "20px",
						fontSize: "0.8rem",
						fontWeight: "600",
						textTransform: "uppercase"
					}}>
					{template.difficulty}
				</span>
			</div>

			<p
				style={{
					color: "var(--muted)",
					margin: "1rem 0",
					lineHeight: "1.5"
				}}>
				{template.description}
			</p>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: "0.8rem",
					color: "var(--muted)",
					marginTop: "auto",
					paddingTop: "1rem"
				}}>
				<span>v{template.version}</span>
				<span className="template-category">{template.category}</span>
			</div>
		</Link>
	);
}
