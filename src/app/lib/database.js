import fs from "fs";
import path from "path";
import { formatMarkdown } from "./formatMd";

const TEMPLATES_DIR = path.join(process.cwd(), "src", "app", "data", "templates");
const TOOLS_DIR = path.join(process.cwd(), "src", "app", "data", "tools");
const DOCS_DIR = path.join(process.cwd(), "src", "app", "data", "docs");

// helper to resolve markdown fallback for templates
async function loadMarkdownFallbackForTemplate(template, filename) {
  try {
    // 1) If content is a string pointing to a markdown file (e.g. "intro.md")
    if (typeof template.content === "string" && template.content.endsWith(".md")) {
      const mdPath = path.join(TEMPLATES_DIR, template.content);
      try {
        const rawContent = await fs.promises.readFile(mdPath, "utf8");
        template.content = formatMarkdown(rawContent);
        return;
      } catch (err) {
        // ignore and try other fallbacks
      }
    }

    // 2) If content is an object with a route property pointing to a markdown file
    if (
      template.content &&
      typeof template.content === "object" &&
      typeof template.content.route === "string" &&
      template.content.route.endsWith(".md")
    ) {
      const mdPath = path.join(TEMPLATES_DIR, template.content.route);
      try {
        const rawContent = await fs.promises.readFile(mdPath, "utf8");
        template.content = formatMarkdown(rawContent);
        return;
      } catch (err) {
        // ignore and try other fallbacks
      }
    }

    // 3) Fallback: if there's no content, try reading a markdown file with the same slug or filename
    if (!template.content) {
      const slug = template.slug ?? (filename ? filename.replace(".json", "") : null);
      if (slug) {
        const candidates = [`${slug}.md`, `${filename?.replace(".json", "")}.md`].filter(Boolean);
        for (const candidate of candidates) {
          const mdPath = path.join(TEMPLATES_DIR, candidate);
          try {
            const rawContent = await fs.promises.readFile(mdPath, "utf8");
            template.content = formatMarkdown(rawContent);
            return;
          } catch (err) {
            // try next candidate
          }
        }
      }
    }
  } catch (err) {
    // do not throw; just leave template.content as-is
  }
}

// ========== TEMPLATES ==========
export async function getTemplates() {
  try {
    const files = await fs.promises.readdir(TEMPLATES_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const templates = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(TEMPLATES_DIR, file);
        const content = await fs.promises.readFile(filePath, "utf8");
        const template = JSON.parse(content);

        if (!template.slug) {
          template.slug = file.replace(".json", "");
        }

        await loadMarkdownFallbackForTemplate(template, file);
        return template;
      })
    );

    return templates.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error reading templates:", error);
    return [];
  }
}

export async function getTemplateBySlug(slug) {
  try {
    const filePath = path.join(TEMPLATES_DIR, `${slug}.json`);
    const content = await fs.promises.readFile(filePath, "utf8");
    const template = JSON.parse(content);

    if (!template.slug) {
      template.slug = slug;
    }

    await loadMarkdownFallbackForTemplate(template, `${slug}.json`);
    return template;
  } catch (error) {
    console.error(`Template ${slug} not found:`, error);
    return null;
  }
}

// ========== TOOLS ==========
export async function getTools() {
  try {
    const files = await fs.promises.readdir(TOOLS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const tools = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(TOOLS_DIR, file);
        const content = await fs.promises.readFile(filePath, "utf8");
        const tool = JSON.parse(content);

        if (!tool.slug) {
          tool.slug = file.replace(".json", "");
        }

        return tool;
      })
    );

    return tools.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Error reading tools:", error);
    return [];
  }
}

export async function getToolBySlug(slug) {
  try {
    const filePath = path.join(TOOLS_DIR, `${slug}.json`);
    const content = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Tool ${slug} not found:`, error);
    return null;
  }
}

// ========== DOCS ==========
export async function getDocs() {
  try {
    const files = await fs.promises.readdir(DOCS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const docs = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DOCS_DIR, file);
        const content = await fs.promises.readFile(filePath, "utf8");
        const doc = JSON.parse(content);

        if (!doc.slug) {
          doc.slug = file.replace(".json", "");
        }

        return doc;
      })
    );

    return docs.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error("Error reading docs:", error);
    return [];
  }
}

export async function getDocBySlug(slug) {
  try {
    const filePath = path.join(DOCS_DIR, `${slug}.json`);
    const content = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Doc ${slug} not found:`, error);
    return null;
  }
}

export async function getDocsByCategory(category) {
  const allDocs = await getDocs();
  return allDocs.filter((doc) => doc.category === category);
}