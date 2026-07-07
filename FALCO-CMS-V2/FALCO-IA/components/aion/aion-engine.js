/* =========================================================
   AION ENGINE™ v1.0
   Sistema FALCO®
========================================================= */

class AionEngine {
  constructor(config = {}) {
    this.state = config.state || "gold";
    this.title = config.title || "AION";
    this.message = config.message || "Sistema FALCO® activo.";
    this.container = null;
  }

  init() {
    if (document.querySelector(".aion-engine")) return;

    this.create();
    this.setState(this.state);
    this.setMessage(this.title, this.message);
  }

  create() {
    this.container = document.createElement("div");
    this.container.className = "aion-engine";
    this.container.dataset.state = this.state;

    this.container.innerHTML = `
      <div class="aion-orb-wrapper" aria-label="AION Engine">
        <div class="aion-orbit one"></div>
        <div class="aion-orbit two"></div>
        <div class="aion-orbit three"></div>
        <div class="aion-core"></div>
      </div>

      <div class="aion-panel">
        <strong class="aion-title"></strong>
        <span class="aion-message"></span>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  setState(state = "gold") {
    if (!this.container) return;

    const allowedStates = ["gold", "blue", "green", "violet", "white"];
    this.state = allowedStates.includes(state) ? state : "gold";
    this.container.dataset.state = this.state;
  }

  setMessage(title = "AION", message = "Sistema FALCO® activo.") {
    if (!this.container) return;

    const titleEl = this.container.querySelector(".aion-title");
    const messageEl = this.container.querySelector(".aion-message");

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
  }

  activateContext(context = "default") {
    const contexts = {
      default: {
        state: "gold",
        title: "AION",
        message: "Sistema FALCO® activo."
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

    const selected = contexts[context] || contexts.default;

    this.setState(selected.state);
    this.setMessage(selected.title, selected.message);
  }
}

window.AionEngine = AionEngine;