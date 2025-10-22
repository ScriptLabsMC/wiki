export const metadata = {
	title: "ScriptLabs | Form Page",
	description: "Submit your Minecraft add-on or feedback.",
	keywords: "form, Minecraft, feedback"
};

export default function Form() {
	return (
		<div className="section">
			<h1 className="section-title">Formulario</h1>
			<p className="section-description">
				Completa el formulario para enviarnos tu información.
			</p>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}>
				<iframe
					width="640px"
					height="480px"
					src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAFCeYsJUOEZFUkZNVUpUTllBVFhYUDc2TEhEOFFYSy4u&embed=true"
					frameBorder="0"
					style={{
						border: "none",
						maxWidth: "100%",
						maxHeight: "100vh",
						borderRadius: "12px",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
					}}
					allowFullScreen
				/>
			</div>
		</div>
	);
}
