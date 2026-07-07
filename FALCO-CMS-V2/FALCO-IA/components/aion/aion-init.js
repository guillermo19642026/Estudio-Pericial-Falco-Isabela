/* =========================================================
   AION ENGINE™ INIT
   Sistema FALCO®
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.AION = new AionEngine({
    state: "gold",
    title: "AION",
    message: "Sistema FALCO® activo."
  });

  window.AION.init();

  /*
    Pruebas rápidas desde consola:

    AION.activateContext("pericial");
    AION.activateContext("biblioteca");
    AION.activateContext("alerta");
    AION.activateContext("neutral");
    AION.activateContext("default");

    AION.setState("blue");
    AION.setMessage("AION", "Mensaje personalizado.");
  */
});