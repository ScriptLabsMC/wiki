import { getTemplateBySlug } from "../../lib/database";

export async function generateMetadata({ params }) {
  const template = await getTemplateBySlug(params.slug);
  
  if (!template) {
    return {
      title: "Template Not Found - ScriptLabs"
    };
  }

  return {
    title: `ScriptLabs | ${template.title}`,
    description: template.description || "Detailed view of a specific Minecraft template.",
    keywords: `template, ${template.tags?.join(", ") || "minecraft, addon"}` 
  };
}

export default function Layout({ children }) {
  return children;
}
