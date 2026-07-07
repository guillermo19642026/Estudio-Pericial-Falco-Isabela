/* =========================================================
   AION ENGINE™ v1.2
   Sistema FALCO®
   Core + estados + panel + mouse follow + interacción
========================================================= */

class AionEngine {
  constructor(config = {}) {
    this.state = config.state || "gold";
    this.title = config.title || "AION";
    this.message = config.message || "Sistema FALCO® activo.";

    this.container = null;
    this.inner = null;

    this.mouse = {
      enabled: config.mouseFollow !== false,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      strength: 0.035,
      max: 22
    };

    this.animationFrame = null;
  }

  init() {
    if (document.querySelector(".aion-engine")) return;

    this.create();
    this.setState(this.state);
    this.setMessage(this.title, this.message);

    if (this.mouse.enabled) {
      this.bindMouseFollow();
      this.animateMouseFollow();
    }

    this.bindInteraction();
  }

  create() {
    this.container = document.createElement("div");
    this.container.className = "aion-engine";
    this.container.dataset.state = this.state;

    this.container.innerHTML = `
      <div class="aion-engine-inner">
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
      </div>
    `;

    document.body.appendChild(this.container);
    this.inner = this.container.querySelector(".aion-engine-inner");
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

  bindInteraction() {
    if (!this.container) return;

    const orb = this.container.querySelector(".aion-orb-wrapper");

    if (!orb) return;

    orb.addEventListener("click", () => {
      const sequence = ["gold", "blue", "green", "violet", "white"];
      const currentIndex = sequence.indexOf(this.state);
      const nextState = sequence[(currentIndex + 1) % sequence.length];

      this.setState(nextState);
      this.setMessage("AION", `Estado ${nextState} activado.`);
    });
  }

  bindMouseFollow() {
    window.addEventListener("mousemove", (event) => {
      if (!this.container) return;

      const rect = this.container.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;

      const nextX = distanceX * this.mouse.strength;
      const nextY = distanceY * this.mouse.strength;

      this.mouse.targetX = this.clamp(nextX, -this.mouse.max, this.mouse.max);
      this.mouse.targetY = this.clamp(nextY, -this.mouse.max, this.mouse.max);
    });
  }

  animateMouseFollow() {
    if (!this.inner) return;

    this.mouse.currentX += (this.mouse.targetX - this.mouse.currentX) * 0.08;
    this.mouse.currentY += (this.mouse.targetY - this.mouse.currentY) * 0.08;

    this.inner.style.setProperty("--aion-follow-x", `${this.mouse.currentX}px`);
    this.inner.style.setProperty("--aion-follow-y", `${this.mouse.currentY}px`);

    this.animationFrame = requestAnimationFrame(() => this.animateMouseFollow());
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

window.AionEngine = AionEngine;