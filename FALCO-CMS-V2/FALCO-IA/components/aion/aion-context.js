/* =========================================================
   AION CONTEXT™ v1.8
   Sistema FALCO®
   Detección contextual automática
========================================================= */

class AionContext {
  constructor() {
    this.contexts = {
      default: {
        state: "gold",
        title: "AION",
        message: "Sistema FALCO® activo."
      },

      corpus: {
        state: "violet",
        title: "Corpus FALCO®",
        message: "Conocimiento institucional disponible."
      },

      pericial: {
        state: "blue",
        title: "Modo pericial",
        message: "Acompañamiento técnico activado."
      },

      biblioteca: {
        state: "green",
        title: "Biblioteca FALCO®",
        message: "Recursos profesionales disponibles."
      },

      escuela: {
        state: "gold",
        title: "Escuela FALCO®",
        message: "Formación activa para familias."
      },

      centro: {
        state: "white",
        title: "Centro FALCO®",
        message: "Centro de Operaciones activo."
      },

      alerta: {
        state: "violet",
        title: "Atención",
        message: "Hay información contextual relevante."
      },

      neutral: {
        state: "white",
        title: "AION",
        message: "Presencia institucional activa."
      }
    };
  }

  detect() {
    const contextElement =
      document.querySelector("[data-aion-context]") ||
      document.body;

    return contextElement.dataset.aionContext || "default";
  }

  get(context = "default") {
    return this.contexts[context] || this.contexts.default;
  }
}

window.AionContext = AionContext;