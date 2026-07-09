/* =========================================================
   AION Loader™ v1.2
   Cargador portable + diagnóstico de carga
========================================================= */

(function () {
  const currentScript = document.currentScript;
  const loaderSrc = currentScript ? currentScript.src : "";

  const AION_ROOT = loaderSrc.substring(0, loaderSrc.lastIndexOf("/js/") + 1);

  const cssFiles = [
    "css/aion-float.css"
  ];

  const jsFiles = [
    "js/presence-engine.js",
    "js/gesture-engine.js",
    "js/eye-engine.js",
    "js/context-engine.js",
    "js/identity-engine.js",
    "js/memory-engine.js",
    "js/brain-engine.js",
    "js/perception-engine.js",
    "js/action-engine.js",
    "js/aion-observer.js",
    "js/knowledge-engine.js",
    "js/interaction-manager.js",
    "js/aion-core.js",
    "js/aion-config.js",
    "js/aion-float.js",
    "js/aion-guide.js",
    "js/corpus-engine.js",
    "js/response-engine.js",
    "js/conversation-engine.js",
  ];

  function loadCSS(file) {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = AION_ROOT + file;
      link.onload = resolve;
      document.head.appendChild(link);
    });
  }

  function loadJS(file) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = AION_ROOT + file;
      script.onload = resolve;
      script.onerror = () => reject(new Error("No se pudo cargar " + file));
      document.body.appendChild(script);
    });
  }

  async function init() {
    try {
      console.log("AION ROOT >", AION_ROOT);

      for (const css of cssFiles) {
        console.log("CSS >", css);
        await loadCSS(css);
        console.log("OK CSS >", css);
      }

      for (const js of jsFiles) {
        console.log("JS >", js);
        await loadJS(js);
        console.log("OK JS >", js);
      }

      console.log("AION Loader™ iniciado correctamente", AION_ROOT);
    } catch (error) {
      console.error("AION Loader™ error:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();