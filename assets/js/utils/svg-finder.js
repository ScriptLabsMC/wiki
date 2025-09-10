// Use the shared SVG icon array from ES module
import { svgs } from "./svgs.js";
import { svgColors as colorMap } from "./svg-colors.js";

// Función principal para reemplazar etiquetas personalizadas
function replaceCustomTags() {
  const customTags = ["sl", "ico"];

  customTags.forEach((tag) => {
    const elements = document.querySelectorAll(tag);

    elements.forEach((element) => {
      const classes = element.className.split(" ");
      const svgName = classes.find((cls) =>
        svgs.some((svg) =>
          Array.isArray(svg.name) ? svg.name.includes(cls) : svg.name === cls,
        ),
      );

      if (svgName) {
        const svgConfig = svgs.find((svg) =>
          Array.isArray(svg.name)
            ? svg.name.includes(svgName)
            : svg.name === svgName,
        );

        if (svgConfig) {
          // Determinar el color
          let fillColor = "#000000";
          const colorClass = classes.find((cls) => colorMap[cls]);
          if (colorClass) fillColor = colorMap[colorClass];

          // Crear el SVG con el color aplicado
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = svgConfig.content;
          const svgElement = tempDiv.querySelector("svg");

          if (svgElement) {
            svgElement.setAttribute("fill", fillColor);
            element.parentNode.replaceChild(svgElement, element);
          }
        }
      }
    });
  });
}
// Lightweight programmatic finder for compatibility with non-module scripts
export function svgFinder(name, size = 24, color = null) {
  const svgConfig = svgs.find((svg) =>
    Array.isArray(svg.name) ? svg.name.includes(name) : svg.name === name,
  );
  if (!svgConfig) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = svgConfig.content;
  const svgElement = tempDiv.querySelector("svg");
  if (!svgElement) return "";
  if (size) {
    svgElement.setAttribute("width", size);
    svgElement.setAttribute("height", size);
  }
  if (color) {
    const colorVal = colorMap[color] || color;
    svgElement.setAttribute("fill", colorVal);
  }
  return svgElement.outerHTML;
}

// Expose to window for legacy scripts that expect window.svgFinder
if (typeof window !== "undefined" && !window.svgFinder) {
  window.svgFinder = svgFinder;
}
// Función para observar cambios en el DOM
function observeDynamicContent() {
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        shouldCheck = true;
      }
    });

    if (shouldCheck) {
      replaceCustomTags();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Ejecutar ambos
function initSvgFinder() {
  try {
    replaceCustomTags();
    observeDynamicContent();
  } catch (e) {
    console.warn("svg-finder init error", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSvgFinder);
} else {
  // If module is loaded after DOMContentLoaded, run immediately
  initSvgFinder();
}
