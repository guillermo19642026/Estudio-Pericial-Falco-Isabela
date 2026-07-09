/* ==========================================================
   AION FLOAT™ v1.3
   Cliente flotante conectado a AION Core™
   + Living Sensors™ + Presence Field™
========================================================== */

const AionFloat = {
  core: null,

  container: null,
  being: null,
  eyes: null,

  presence: null,
  gestures: null,
  eyesEngine: null,
  brain: null,
  memory: null,

  blinkTimer: null,
  returnTimer: null,

init() {

    this.create();
    this.initCore();
    this.bind();
    this.startNaturalBlink();

    if (this.eyesEngine) {
      this.eyesEngine.animate();
    }

    if (this.presence) {
      this.presence.setState("idle");
    }

    console.log("AION FLOAT™ Ready with AION Core™");
  },

  create() {
    this.container = document.createElement("div");
    this.container.className = "aion-float";




 this.container.innerHTML = `
      <div class="aion-float-label">AION Engine™</div>

      <div class="aion-float-being" data-state="idle">
        <div class="aion-float-halo"></div>

        <div class="aion-float-sensors" aria-hidden="true">
          <span class="aion-float-sensor aion-float-sensor-left"></span>
          <span class="aion-float-sensor aion-float-sensor-right"></span>
        </div>

        <div class="aion-float-presence-field" aria-hidden="true"></div>

        <div class="aion-float-sphere">
          <div class="aion-float-eyes">
            <span class="aion-float-eye"></span>
            <span class="aion-float-eye"></span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    this.applyConfig();

    this.being = this.container.querySelector(".aion-float-being");
    this.eyes = this.container.querySelector(".aion-float-eyes");
  },

  applyConfig() {
    const cfg = window.AIONConfig || {};
    const mobile = window.innerWidth < 768;

    const offsetY = mobile
      ? (cfg.mobileOffsetY ?? cfg.offsetY ?? 150)
      : (cfg.offsetY ?? 150);

    const scale = mobile
      ? (cfg.mobileScale ?? cfg.scale ?? 1)
      : (cfg.scale ?? 1);

    this.container.style.right = `${cfg.offsetX ?? 36}px`;
    this.container.style.bottom = `${offsetY}px`;
    this.container.style.zIndex = cfg.zIndex ?? 9998;
    this.container.style.transform = `scale(${scale})`;
  },

  initCore() {
    this.core = window.AIONCore
      ? new AIONCore().initFloat(this)
      : null;

    if (!this.core) return;

    this.presence = this.core.presence;
    this.gestures = this.core.gestures;
    this.eyesEngine = this.core.eyes;
    this.brain = this.core.brain;
    this.memory = this.core.memory;
  },

  bind() {
    document.addEventListener("mousemove", (event) => {
      if (!this.eyesEngine) return;

      this.eyesEngine.followMouse(event);

      if (this.brain) {
        this.brain.handle("user:move");
      }

      this.setState("listening");

      clearTimeout(this.returnTimer);

      this.returnTimer = window.setTimeout(() => {
        if (this.eyesEngine) this.eyesEngine.center();
        if (this.presence) this.presence.relax();

        this.setState("idle");
      }, 2200);
    });

    this.container.addEventListener("mouseenter", () => {
      this.setState("thinking");
    });

    this.container.addEventListener("mouseleave", () => {
      this.setState("idle");
    });

    this.container.addEventListener("click", (event) => {
      event.stopPropagation();

      if (this.brain) {
        this.brain.handle("user:click", {
          x: event.clientX,
          y: event.clientY
        });
      }

      this.setState("speaking");

      window.setTimeout(() => {
        this.setState("idle");
      }, 1800);
    });
  },

  setState(state = "idle") {
    const allowed = [
      "idle",
      "listening",
      "thinking",
      "speaking",
      "reading",
      "warning",
      "success",
      "sleep"
    ];

    if (!allowed.includes(state)) state = "idle";

    if (this.being) {
      this.being.dataset.state = state;
    }

    if (this.brain) {
      this.brain.handle("state:change", { state });
    }
  },

  startNaturalBlink() {
    const schedule = () => {
      const delay = this.random(4200, 9500);

      this.blinkTimer = window.setTimeout(() => {
        if (this.gestures) {
          if (Math.random() > 0.82) {
            this.gestures.doubleBlink();
          } else {
            this.gestures.blink();
          }
        }

        schedule();
      }, delay);
    };

    schedule();
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    AionFloat.init();
  });
} else {
  AionFloat.init();
}