import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
	return (
		<>
		
			<section className="hero section">
		<SpeedInsights/>
				<div className="hero-content">
					<div className="sl-icon white"></div>
					<h1 className="gradient-text">
						Innovación en Add-ons de Minecraft Bedrock
					</h1>
					<p className="lead">
						Creamos herramientas, librerías y guías prácticas para
						que desarrolles add-ons con calidad profesional.
					</p>
					<div className="cta">
						<a
							className="btn btn-primary"
							href="https://youtube.com/@ScriptLabs"
							target="_blank"
							rel="noopener noreferrer">
							YouTube
						</a>
						<a
							className="btn btn-ghost"
							href="https://discord.gg/BFG3T8MBWN"
							target="_blank"
							rel="noopener noreferrer">
							Discord
						</a>
					</div>
				</div>
			</section>

			<section className="section features">
				<h2 className="section-title">Qué hacemos</h2>
				<div className="grid-3">
					<div className="feature card glass">
						<div className="icon">⚙️</div>
						<h3>Herramientas</h3>
						<p>
							Utilidades enfocadas a novatos y creadores
							avanzados.
						</p>
					</div>
					<div className="feature card glass">
						<div className="icon">🧩</div>
						<h3>Add-ons</h3>
						<p>
							Proyectos listos para jugar y estudiar como
							referencia.
						</p>
					</div>
					<div className="feature card glass">
						<div className="icon">🎓</div>
						<h3>Tutoriales</h3>
						<p>
							Guías paso a paso y videos integrados desde nuestro
							canal.
						</p>
					</div>
				</div>
			</section>

			<section className="section cta-final">
				<h2 className="section-title gradient-text">
					Únete a la comunidad
				</h2>
				<p>Comparte dudas, recibe feedback y colabora en proyectos.</p>
				<a
					className="btn btn-primary"
					href="https://discord.gg/BFG3T8MBWN"
					target="_blank"
					rel="noopener noreferrer">
					Entrar a Discord
				</a>
			</section>
		</>
	);
}
