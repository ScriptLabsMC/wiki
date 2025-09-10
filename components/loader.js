// components/loader.js
// Cache de componentes
const componentCache = new Map();

async function loadComponent(componentName, targetElement) {
  if (componentCache.has(componentName)) {
    targetElement.innerHTML = componentCache.get(componentName);
    targetElement.dispatchEvent(
      new CustomEvent("componentLoaded", { detail: { name: componentName } }),
    );
    return;
  }
  try {
    const response = await fetch(`/components/${componentName}.html`);
    if (!response.ok)
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    const html = await response.text();

    componentCache.set(componentName, html);
    targetElement.innerHTML = html;

    // Reactivar scripts embebidos
    const scripts = targetElement.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Disparar evento
    targetElement.dispatchEvent(
      new CustomEvent("componentLoaded", { detail: { name: componentName } }),
    );
  } catch (error) {
    console.error(`Error loading component ${componentName}:`, error);
    targetElement.innerHTML = `<p>Error loading ${componentName}</p>`;
  }
}

function initComponents() {
  const headerElement = document.querySelector("header.site-header");
  if (headerElement) loadComponent("nav", headerElement);

  const footerElement = document.querySelector("footer.site-footer");
  if (footerElement) {
    loadComponent("footer", footerElement).then(() => {
      const y = document.getElementById("year");
      if (y) y.textContent = new Date().getFullYear();
    });
  }

  const loaderContainer = document.querySelector("div.loader");

  if (loaderContainer) loadComponent("loader", loaderContainer);

  const notFoundC = document.getElementById("nodFound");

  if (notFoundC) loadComponent("404", notFoundC);
}

// If the modern components-loader module exists and the page opts in, use it.
async function tryModernLoader() {
  if (window.componentsLoaderAuto === false) return false;
  try {
    // dynamic import path must be reachable by the server
    const mod = await import("/assets/js/utils/components-loader.js");
    if (mod && typeof mod.loadComponents === "function") {
      await mod.loadComponents();
      // If the modern loader didn't populate header/footer placeholders,
      // ensure nav and footer still load into the expected slots so pages
      // relying on legacy placeholders keep working.
      try {
        const headerElement = document.querySelector("header.site-header");
        if (headerElement && !headerElement.innerHTML.trim()) {
          await loadComponent("nav", headerElement);
        }
        const footerElement = document.querySelector("footer.site-footer");
        if (footerElement && !footerElement.innerHTML.trim()) {
          await loadComponent("footer", footerElement);
        }

        // If there is a loader placeholder on the page, ensure it's populated
        // when the modern components loader is used but doesn't insert it.
        try {
          const loaderContainer = document.querySelector("div.loader");
          if (loaderContainer && !loaderContainer.innerHTML.trim()) {
            await loadComponent("loader", loaderContainer);
          }
        } catch (e) {
          // ignore loader fallback errors
        }
      } catch (e) {
        // ignore errors from fallback insertion
      }
      return true;
    }
  } catch (e) {
    // ignore and fallback to legacy loader
  }
  return false;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    const used = await tryModernLoader();
    if (!used) initComponents();
  });
} else {
  (async () => {
    if (!(await tryModernLoader())) initComponents();
  })();
}
