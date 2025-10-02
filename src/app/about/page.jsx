import TeamList from "../components/TeamList";

export default function About() {
	return (
		<div className="section narrow">
			<h1 className="gradient-text">Sobre ScriptLabs</h1>
			<p>
				Impulsamos el desarrollo de Add-ons de Minecraft Bedrock
				combinando ingeniería y diseño. Nuestro objetivo es eliminar
				fricción y acelerar el aprendizaje.
			</p>

			<div className="grid-2 team">
				<div className="card glass">
					<h3>Misión</h3>
					<p>
						Crear herramientas y recursos abiertos para que
						cualquiera pueda construir add-ons de calidad.
					</p>
				</div>
				<div className="card glass">
					<h3>Visión</h3>
					<p>
						Ser la referencia hispana en ingeniería de add-ons, con
						comunidad activa y proyectos de impacto.
					</p>
				</div>
			</div>

			<h2 className="section-title">Equipo</h2>
			<TeamList />
		</div>
	);
}
