import TeamList from "../components/Workers/TeamList";

export const metadata = {
  title: "ScriptLabs | About ScriptLabs",
  description: "Learn about ScriptLabs and our mission.",
  keywords: "about, ScriptLabs, mission"
};

export default function About() {
  return (
    <div className="section narrow">
      <h1 className="gradient-text">Sobre ScriptLabsMC</h1>
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