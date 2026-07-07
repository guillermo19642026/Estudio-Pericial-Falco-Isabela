/* =========================================================
   AION ENGINE™ v1.9
   Sistema FALCO®
   Engine + Behavior + Context + Events
========================================================= */

class AionEngine {
  constructor(config = {}) {
    this.state = config.state || "gold";
    this.title = config.title || "AION";
    this.message = config.message || "Sistema FALCO® activo.";

    this.container = null;
    this.inner = null;

    this.behavior = null;
    this.context = null;
    this.events = null;

    this.currentContext = "default";

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

    if (window.AionBehavior) {
      this.behavior = new AionBehavior(this);
    }

    if (window.AionContext) {
      this.context = new AionContext();
    }

    if (window.AionEvents) {
      this.events = new AionEvents(this);
    }

    this.applyPageContext();

    if (this.behavior) {
      this.behavior.guide();
    }

    if (this.mouse.enabled) {
      this.bindMouseFollow();
      this.animateMouseFollow();
    }

    if (this.events) {
      this.events.init();
    }
  }

  create() {
    this.container = document.createElement("div");
    this.container.className = "aion-engine";
    this.container.dataset.state = this.state;
    this.container.dataset.behavior = "idle";
    this.container.dataset.context = "default";

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

  applyPageContext() {
    const detectedContext = this.context ? this.context.detect() : "default";
    this.activateContext(detectedContext);
  }

  activateContext(contextName = "default") {
    const selected = this.context
      ? this.context.get(contextName)
      : {
          state: "gold",
          title: "AION",
          message: "Sistema FALCO® activo."
        };

    this.currentContext = contextName;

    if (this.container) {
      this.container.dataset.context = contextName;
    }

    this.setState(selected.state);
    this.setMessage(selected.title, selected.message);
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

  emitEnergyWave() {
    if (!this.container) return;

    const orb = this.container.querySelector(".aion-orb-wrapper");
    if (!orb) return;

    const wave = document.createElement("span");
    wave.className = "aion-energy-wave";

    orb.appendChild(wave);

    window.setTimeout(() => {
      wave.remove();
    }, 900);
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