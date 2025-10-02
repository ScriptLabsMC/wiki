import fs from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(
	process.cwd(),
	"src",
	"app",
	"data",
	"templates"
);

const TOOLS_DIR = path.join(process.cwd(), "src", "app", "data", "tools");

const DOCS_DIR = path.join(process.cwd(), "src", "app", "data", "docs");

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
		return JSON.parse(content);
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
			// Ordenar por orden si existe, si no por título
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
