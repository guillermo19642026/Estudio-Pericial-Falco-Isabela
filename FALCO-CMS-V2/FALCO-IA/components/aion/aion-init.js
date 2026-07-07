/* =========================================================
   AION ENGINE™ INIT v2.1
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
    =========================
    PRUEBAS DESDE CONSOLA
    =========================

    Contextos:
    AION.activateContext("corpus");
    AION.activateContext("pericial");
    AION.activateContext("biblioteca");
    AION.activateContext("escuela");
    AION.activateContext("centro");
    AION.activateContext("default");

    Estados:
    AION.setState("gold");
    AION.setState("blue");
    AION.setState("green");
    AION.setState("violet");
    AION.setState("white");

    Mensajes:
    AION.setMessage("AION", "Mensaje personalizado.");

    Eventos del sistema:
    AION.emit("corpus:loaded");
    AION.emit("search:started");
    AION.emit("search:finished");
    AION.emit("document:opened", { title: "Informe pericial psicológico" });
    AION.emit("warning");
    AION.emit("reset");

    Memoria:
    sessionStorage.getItem("AION_SESSION_MEMORY");
  */
});