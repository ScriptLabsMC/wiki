import { getDocBySlug } from "../../lib/database";

export async function generateMetadata({ params }) {
  const doc = await getDocBySlug(params.slug);
  
  return {
    title: doc ? `ScriptLabs | ${doc.title}` : "ScriptLabs | Documentation Not Found",
    description: doc?.description || "Documentation for Minecraft development",
    keywords: doc ? `documentation, ${doc.tags?.join(", ")}, minecraft` : "documentation, minecraft, error"
  };
}

export default function Layout({ children }) {
  return children;
}
