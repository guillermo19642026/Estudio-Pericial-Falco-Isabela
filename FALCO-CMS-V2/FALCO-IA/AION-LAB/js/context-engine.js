/* =========================================================
   AION Context Engine™ v1.0
   Detecta dónde está AION
========================================================= */

class ContextEngine {
  constructor() {
    this.context = "lab";
  }

  detect() {
    const explicit =
      document.querySelector("[data-aion-context]")?.dataset.aionContext;

    if (explicit) {
      this.context = explicit;
      return this.context;
    }

    const path = window.location.pathname.toLowerCase();

    if (path.includes("corpus")) this.context = "corpus";
    else if (path.includes("biblioteca")) this.context = "biblioteca";
    else if (path.includes("escuela")) this.context = "escuela";
    else if (path.includes("profesional")) this.context = "profesional";
    else if (path.includes("aion-lab")) this.context = "lab";
    else this.context = "default";

    return this.context;
  }

  getProfile() {
    const profiles = {
      lab: {
        name: "AION LAB™",
        mode: "experimental",
        defaultState: "idle"
      },
      corpus: {
        name: "Corpus FALCO®",
        mode: "research",
        defaultState: "reading"
      },
      biblioteca: {
        name: "Biblioteca FALCO®",
        mode: "exploration",
        defaultState: "idle"
      },
      escuela: {
        name: "Escuela FALCO®",
        mode: "tutor",
        defaultState: "listening"
      },
      profesional: {
        name: "Centro Profesional",
        mode: "technical",
        defaultState: "idle"
      },
      default: {
        name: "Sistema FALCO®",
        mode: "institutional",
        defaultState: "idle"
      }
    };

    return profiles[this.context] || profiles.default;
  }
}

window.ContextEngine = ContextEngine;
