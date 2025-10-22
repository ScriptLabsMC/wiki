import { getTemplateBySlug } from "../../lib/database";

export async function generateMetadata({ params }) {
  const template = await getTemplateBySlug(params.slug);
  
  return {
    title: template ? `ScriptLabs | ${template.title}` : "ScriptLabs | Template Not Found",
    description: template?.description || "Template details for Minecraft development",
    keywords: template ? `template, ${template.tags?.join(", ")}, minecraft` : "template, minecraft, error"
  };
}

export default function Layout({ children }) {
  return children;
}
