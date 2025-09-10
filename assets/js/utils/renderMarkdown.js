// --- HTML template loader with highlight.js and copy buttons (modular) ---
import { FilesFinder } from "./files-finder.js";
import { loadComponents } from "./components-loader.js";

export async function loadTemplates(options = {}) {
  const container = document.getElementById("templates-list");
  if (!container) return;

  // Discover templates using FilesFinder. Expect a manifest at /templates/index.json
  const finder = new FilesFinder({
    bases: options.bases || ["/templates"],
    manifestNames: options.manifestNames || ["index.json", "files.json"],
    fallbackList: options.fallbackList || ["/templates/example.json.html"],
    extensions: [".html"],
  });

  const templates = await finder.findFiles();

  // Optionally load components first
  if (options.loadComponents !== false) {
    // try to load components from /components manifest or DOM placeholders
    try {
      await loadComponents(options.components || {});
    } catch (err) {
      /* ignore */
    }
  }

  for (const tplPath of templates) {
    try {
      const res = await fetch(tplPath, { cache: "no-store" });
      if (!res.ok) continue;
      const html = await res.text();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      // Add copy button and highlight each code block
      wrapper.querySelectorAll("pre code").forEach((block) => {
        if (window.hljs) window.hljs.highlightElement(block);
        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.title = "Copiar código";
        // Use svgFinder for the icon if available
        if (window.svgFinder) {
          try {
            btn.innerHTML =
              window.svgFinder("copy", 20, 20) || defaultCopySvg();
          } catch (e) {
            btn.innerHTML = defaultCopySvg();
          }
        } else {
          btn.innerHTML = defaultCopySvg();
        }
        const licenseText = `Estas plantillas están disponibles bajo una licencia que requiere mantener los créditos a ScriptLabs en cualquier uso o distribución.`;
        const showLicenseModal = () => {
          let modal = document.getElementById("license-modal");
          if (!modal) {
            modal = document.createElement("div");
            modal.id = "license-modal";
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100vw";
            modal.style.height = "100vh";
            modal.style.background = "rgba(0,0,0,0.6)";
            modal.style.display = "flex";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            modal.style.zIndex = "9999";
            modal.innerHTML = `<div style="background:#181c1f;color:#fff;padding:2em 1.5em;border-radius:1em;max-width:90vw;max-height:80vh;overflow:auto;text-align:center;box-shadow:0 4px 32px #0008;">
              <h2 style='margin-bottom:0.5em;font-size:1.2em;'>Licencia de uso</h2>
              <p style='font-size:1em;margin-bottom:1.5em;'>${licenseText}</p>
              <button id='accept-license-btn' style='background:#08FFC8;color:#222;font-weight:bold;padding:0.7em 2em;border:none;border-radius:0.5em;cursor:pointer;font-size:1em;'>Aceptar y copiar</button>
              <br><button id='close-license-btn' style='margin-top:1em;background:none;color:#fff;border:none;font-size:0.95em;cursor:pointer;'>Cancelar</button>
            </div>`;
            document.body.appendChild(modal);
          } else {
            modal.style.display = "flex";
          }
          document.getElementById("accept-license-btn").onclick = function () {
            modal.style.display = "none";
            doCopy();
          };
          document.getElementById("close-license-btn").onclick = function () {
            modal.style.display = "none";
          };
        };

        function doCopy() {
          // Try Clipboard API first
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(block.textContent).then(
              () => {
                btn.textContent = "¡Copiado!";
                setTimeout(() => {
                  if (window.svgFinder)
                    btn.innerHTML = window.svgFinder("copy", 20, 20);
                  else btn.innerHTML = defaultCopySvg();
                }, 1200);
              },
              () => fallbackCopy(block, btn),
            );
          } else {
            fallbackCopy(block, btn);
          }
        }

        const copyHandler = function (e) {
          e.preventDefault();
          showLicenseModal();
        };
        btn.addEventListener("click", copyHandler);
        btn.addEventListener("touchend", copyHandler);
        block.parentElement.style.position = "relative";
        btn.style.position = "absolute";
        btn.style.top = "8px";
        btn.style.right = "8px";
        btn.style.zIndex = "2";
        block.parentElement.appendChild(btn);
      });

      // Fallback for older browsers and iOS Safari
      function fallbackCopy(block, btn) {
        try {
          const range = document.createRange();
          range.selectNodeContents(block);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand("copy");
          selection.removeAllRanges();
          btn.textContent = "¡Copiado!";
          setTimeout(() => (btn.innerHTML = defaultCopySvg()), 1200);
        } catch (err) {
          btn.textContent = "Error";
        }
      }
      container.appendChild(wrapper);
    } catch (err) {
      // ignore single template errors
    }
  }
  if (window.hljs) window.hljs.highlightAll();
}

function defaultCopySvg() {
  return '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="8" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1"/></svg>';
}

// Auto-run on DOMContentLoaded when script is included as a module in a page.
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => loadTemplates());
}

export default loadTemplates;
