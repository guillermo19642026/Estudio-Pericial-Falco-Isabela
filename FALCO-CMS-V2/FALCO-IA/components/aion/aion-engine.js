/* =========================================================
   AION ENGINE™ v4.0
   Sistema FALCO®
   Engine + Observer
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
    this.memory = null;
    this.brain = null;
    this.systemEvents = null;
    this.presence = null;
    this.debug = null;
    this.workflow = null;
    this.bridge = null;
    this.observer = null;

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

    if (window.AionBehavior) this.behavior = new AionBehavior(this);
    if (window.AionContext) this.context = new AionContext();
    if (window.AionEvents) this.events = new AionEvents(this);
    if (window.AionMemory) this.memory = new AionMemory();
    if (window.AionBrain) this.brain = new AionBrain(this);
    if (window.AionSystemEvents) this.systemEvents = new AionSystemEvents(this);
    if (window.AionPresence) this.presence = new AionPresence(this);
    if (window.AionDebug) this.debug = new AionDebug(this);
    if (window.AionWorkflow) this.workflow = new AionWorkflow(this);
    if (window.AionBridge) this.bridge = new AionBridge(this);
    if (window.AionObserver) this.observer = new AionObserver(this);

    this.applyPageContext();

    if (this.behavior) this.behavior.guide();

    this.remember();

    if (this.mouse.enabled) {
      this.bindMouseFollow();
      this.animateMouseFollow();
    }

    if (this.events) this.events.init();
    if (this.bridge) this.bridge.init();
    if (this.observer) this.observer.init();
  }

  create() {
    this.container = document.createElement("div");
    this.container.className = "aion-engine";
    this.container.dataset.state = this.state;
    this.container.dataset.behavior = "idle";
    this.container.dataset.context = "default";
    this.container.dataset.workflow = "idle";

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

    this.remember();
  }

  emit(eventName, payload = {}) {
    if (!this.systemEvents) return;
    this.systemEvents.emit(eventName, payload);
  }

  run(workflowName, payload = {}) {
    if (!this.workflow) return;
    this.workflow.run(workflowName, payload);
  }

  decide(eventName, payload = {}) {
    if (!this.brain) return null;
    return this.brain.decide(eventName, payload);
  }

  say(title, message, options = {}) {
    if (this.presence) {
      this.presence.speak(title, message, options);
      return;
    }

    this.setMessage(title, message);
  }

  pulse(options = {}) {
    if (this.presence) {
      this.presence.silentPulse(options);
      return;
    }

    if (options.wave) this.emitEnergyWave();
    if (options.state) this.setState(options.state);
  }

  status() {
    if (this.debug) return this.debug.status();

    return {
      context: this.currentContext,
      state: this.state,
      title: this.title,
      message: this.message
    };
  }

  clearMemory() {
    if (this.debug) this.debug.clearMemory();
  }

  setState(state = "gold") {
    if (!this.container) return;

    const allowedStates = ["gold", "blue", "green", "violet", "white"];
    this.state = allowedStates.includes(state) ? state : "gold";
    this.container.dataset.state = this.state;

    this.remember();
  }

  setMessage(title = "AION", message = "Sistema FALCO® activo.") {
    if (!this.container) return;

    this.title = title;
    this.message = message;

    const titleEl = this.container.querySelector(".aion-title");
    const messageEl = this.container.querySelector(".aion-message");

    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;

    this.remember();
  }

  remember() {
    if (!this.memory) return;

    this.memory.write({
      context: this.currentContext,
      state: this.state,
      title: this.title,
      message: this.message,
      behavior: this.container?.dataset.behavior || "idle",
      workflow: this.container?.dataset.workflow || "idle"
    });
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