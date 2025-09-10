// Legacy shim: dynamically import the module version so old <script src="renderMarkdown.js"> continues to work
(function () {
  if (typeof document === "undefined") return;
  const modulePath = "/assets/js/utils/renderMarkdown.js";
  const script = document.createElement("script");
  script.type = "module";
  script.src = modulePath;
  script.async = false;
  document.currentScript && document.currentScript.parentNode
    ? document.currentScript.parentNode.insertBefore(
        script,
        document.currentScript.nextSibling,
      )
    : document.head.appendChild(script);
})();
