// svgx-finder.js: Modern SVG system for <svgx> and JS usage
// Usage: <svgx name="yt" size="40" color="red"></svgx> or svgxFinder('yt', 40, 'red')

import { svgColors as svgxColorMap } from "./svg-colors.js";
import { svgs as svgxSvgs } from "./svgs.js";

export function svgxFinder(name, size = 24, color = null) {
  const svgConfig = svgxSvgs.find((svg) =>
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
    const c = svgxColorMap[color] || color;
    svgElement.setAttribute("fill", c);
  }
  return svgElement.outerHTML;
}

// expose for legacy scripts
if (typeof window !== "undefined" && !window.svgxFinder) {
  window.svgxFinder = svgxFinder;
}

// Custom element for HTML usage: <svg-x name="copy" size="24" color="#fff"></svg-x>
// Note: Custom element names must include a hyphen. Older pages may use <svgx> (invalid)
// so we normalize existing <svgx> nodes to the new <svg-x> tag for compatibility.
function normalizeLegacySvgx() {
  try {
    const legacy = Array.from(document.getElementsByTagName("svgx"));
    for (const node of legacy) {
      const replacement = document.createElement("svg-x");
      // copy attributes
      for (const attr of Array.from(node.attributes || [])) {
        replacement.setAttribute(attr.name, attr.value);
      }
      // move children
      while (node.firstChild) replacement.appendChild(node.firstChild);
      node.parentNode.replaceChild(replacement, node);
    }
  } catch (e) {
    // ignore if DOM not ready or other errors
  }
}

if (!window.customElements.get("svg-x")) {
  class SvgxIcon extends HTMLElement {
    static get observedAttributes() {
      return ["name", "size", "color"];
    }
    connectedCallback() {
      this.render();
    }
    attributeChangedCallback() {
      this.render();
    }
    render() {
      const name = this.getAttribute("name");
      const size = this.getAttribute("size") || 24;
      const color = this.getAttribute("color") || null;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const svg = window.svgxFinder ? window.svgxFinder(name, size, color) : "";
      this.shadowRoot.innerHTML = svg ? svg : "<!-- svgx: icon not found -->";
    }
  }
  window.SvgxIcon = SvgxIcon;
  // Normalize legacy tags before defining the new element, in case markup exists
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", normalizeLegacySvgx);
    } else {
      normalizeLegacySvgx();
    }
  }
  customElements.define("svg-x", SvgxIcon);
}
