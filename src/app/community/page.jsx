export const metadata = {
	title: 'ScriptLabs | Community Page',
	description: 'Join the Minecraft community and share your projects.',
	keywords: 'community, Minecraft, projects',
};

export default function Community() {
	return (
		<div className="section narrow">
			<h1 className="gradient-text">Comunidad</h1>
			<p>
				Nos reunimos en Discord para resolver dudas y mostrar avances.
				También anunciamos streams y lanzamientos.
			</p>

			<div className="card glass embed">
				<iframe
					title="Discord"
					src="https://discord.com/widget?id=1389624640271552734&theme=dark"
					width="100%"
					height="400"
					allowTransparency="true"
					frameBorder="0"
					sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
			</div>

			<div className="grid-2">
				<a
					className="btn btn-primary"
					href="https://discord.gg/BFG3T8MBWN"
					target="_blank"
					rel="noopener noreferrer">
					Entrar a Discord
				</a>
				<a
					className="btn btn-ghost"
					href="https://youtube.com/@ScriptLabs"
					target="_blank"
					rel="noopener noreferrer">
					Canal de YouTube
				</a>
			</div>
		</div>
	);
}
