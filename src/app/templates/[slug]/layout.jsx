// app/templates/[slug]/layout.jsx
import { getTemplateBySlug } from "../../lib/database";

/** Genera metadata dinámica según el template */
export async function generateMetadata({ params }) {
  const template = await getTemplateBySlug(params.slug);

  if (!template) {
    return {
      title: "ScriptLabs | Template Not Found",
      description: "No se encontró el template solicitado.",
      keywords: "template, minecraft, error",
    };
  }

  return {
    title: `ScriptLabs | ${template.title}`,
    description: template.description || "Detalles del template para Minecraft",
    keywords: `template, ${template.tags?.join(", ") || ""}, minecraft`,
  };
}

/** Layout server component */
export default function TemplateLayout({ children }) {
  // Simple layout que envuelve children; se puede agregar diseño si quieres
  return <>{children}</>;
}
