// FilesFinder - browser-friendly helper to discover files in one or more base paths.
// It first tries to fetch a manifest (JSON array) from each base (e.g. /templates/index.json).
// If no manifest is found it falls back to an optional `fallbackList` provided in options.
// Note: Browsers cannot list arbitrary server directories; a manifest (index.json/files.json)
// is the most reliable approach for discovery. Provide a fallbackList when a manifest is
// not available on the server.
export class FilesFinder {
  constructor(options = {}) {
    this.bases = Array.isArray(options.bases)
      ? options.bases
      : [options.bases || "/"];
    this.manifestNames = options.manifestNames || [
      "index.json",
      "files.json",
      "list.json",
    ];
    this.fallbackList = options.fallbackList || null;
    this.extensions = options.extensions || [".html"];
  }

  // Try to fetch a manifest JSON from a base path. Returns array or null.
  async fetchManifest(base) {
    const baseUrl = base.replace(/\/+$/g, "");
    for (const name of this.manifestNames) {
      const url = `${baseUrl}/${name}`;
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const json = await res.json();
        if (!Array.isArray(json)) continue;
        // Normalize entries to absolute-ish URLs
        return json.map((p) => {
          if (/^https?:\/\//i.test(p)) return p;
          return `${baseUrl}/${p.replace(/^\/+/, "")}`;
        });
      } catch (err) {
        // ignore and try next manifest name
      }
    }
    return null;
  }

  // Public: find files by trying manifests then falling back to the provided list.
  async findFiles() {
    for (const base of this.bases) {
      const manifest = await this.fetchManifest(base);
      if (manifest && manifest.length) return manifest;
    }
    if (this.fallbackList) return this.fallbackList.slice();
    console.warn(
      "FilesFinder: no manifest found and no fallbackList provided for bases:",
      this.bases,
    );
    return [];
  }
}
