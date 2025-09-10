import { FilesFinder } from "./files-finder.js";

// Simple components loader: looks for elements with data-component="path/to/file.html"
// or automatically loads components listed in a manifest under /components/index.json.
export async function loadComponents(options = {}) {
  const finder = new FilesFinder({
    bases: options.bases || ["/components"],
    manifestNames: options.manifestNames || ["index.json", "files.json"],
    fallbackList: options.fallbackList || null,
  });
  const files = await finder.findFiles();
  // Load components declared in DOM via data-component attribute
  const domComponents = Array.from(
    document.querySelectorAll("[data-component]"),
  ).map((el) => ({ el, path: el.getAttribute("data-component") }));

  // Function to fetch and insert a component into a target element
  async function insertComponent(target, path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${path}`);
      const html = await res.text();
      target.innerHTML = html;
    } catch (err) {
      console.warn("components-loader:", err);
    }
  }

  // Insert DOM-declared components first
  for (const { el, path } of domComponents) {
    await insertComponent(el, path);
  }

  // If manifest provided files, and they look like components, insert them by filename match
  for (const file of files) {
    // determine a simple name key (filename without extension)
    const m = file.match(/\/([^\/]+)\.html$/);
    if (!m) continue;
    const name = m[1];
    // find placeholder elements with data-component-name
    const placeholders = document.querySelectorAll(
      `[data-component-name="${name}"]`,
    );
    for (const ph of placeholders) {
      await insertComponent(ph, file);
    }
  }
}
