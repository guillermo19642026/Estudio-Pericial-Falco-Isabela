/* =========================================================
   AION ENGINE™ INIT v3.0
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
    AION v3.0 - PRUEBAS CONSOLA
    =========================

    Estado general:
    AION.status();

    Contextos:
    AION.activateContext("corpus");
    AION.activateContext("pericial");
    AION.activateContext("biblioteca");
    AION.activateContext("escuela");
    AION.activateContext("centro");
    AION.activateContext("default");

    Eventos:
    AION.emit("corpus:loaded");
    AION.emit("search:started");
    AION.emit("search:finished");
    AION.emit("document:opened", { title: "Informe pericial psicológico" });
    AION.emit("warning", { message: "Evento crítico de prueba." });
    AION.emit("silent:pulse", { state: "violet", behavior: "thinking" });
    AION.emit("reset");

    Workflows:
    AION.run("corpus");
    AION.run("search", { query: "daño psíquico", delay: 1500 });
    AION.run("document", { title: "Informe pericial psicológico" });
    AION.run("warning", { message: "Advertencia institucional de prueba." });
    AION.run("reset");

    Presencia:
    AION.say("AION Presence™", "Comunicación institucional activa.", {
      wave: true,
      state: "gold",
      behavior: "guiding",
      force: true
    });

    AION.pulse({
      wave: true,
      state: "violet",
      behavior: "thinking"
    });

    Memoria:
    sessionStorage.getItem("AION_SESSION_MEMORY");
    AION.clearMemory();
  */
});