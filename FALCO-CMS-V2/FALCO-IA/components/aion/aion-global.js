/* =========================================================
   AION GLOBAL INSTALLER™ v4.1
   Sistema FALCO®
   Instalador global para páginas importantes
========================================================= */

(function () {
  const AION_GLOBAL_VERSION = "4.1";

  function initAionGlobal() {
    if (window.AION) return;

    if (!window.AionEngine) {
      console.warn("AION Global: AionEngine no está cargado.");
      return;
    }

    window.AION = new AionEngine({
      state: "gold",
      title: "AION",
      message: "Sistema FALCO® activo."
    });

    window.AION.init();

    console.info(`AION Global Installer™ v${AION_GLOBAL_VERSION} activo.`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAionGlobal);
  } else {
    initAionGlobal();
  }
})();