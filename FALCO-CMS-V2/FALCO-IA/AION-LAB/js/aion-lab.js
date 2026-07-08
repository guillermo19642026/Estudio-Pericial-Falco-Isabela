/* =========================================================
   AION LAB™ v2.2
   Living Presence Project
   Core modular + Identity + Memory
========================================================= */

const AionLab = {
  being: null,
  eyes: null,
  stateName: null,

  presence: null,
  gestures: null,
  eyesEngine: null,
  directorPanel: null,
  animationEngine: null,
  brain: null,
  memory: null,
  identity: null,
  contextEngine: null,
  perception: null,
  demoEngine: null,

  currentState: "idle",

  returnTimer: null,
  blinkTimer: null,
  microLookTimer: null,
  speechTimer: null,
  clickLookTimer: null,

  userActive: false,

  init() {
    this.being = document.getElementById("aionBeing");
    this.eyes = document.getElementById("aionEyes");
    this.stateName = document.getElementById("stateName");

    if (!this.being || !this.eyes) return;

    this.presence = window.PresenceEngine
      ? new PresenceEngine()
      : null;

    this.gestures = window.GestureEngine
      ? new GestureEngine(this.being)
      : null;

    this.eyesEngine = window.EyeEngine
      ? new EyeEngine(this.being, this.presence)
      : null;

    this.memory = window.MemoryEngine
      ? new MemoryEngine()
      : null;

    this.contextEngine = window.ContextEngine
      ? new ContextEngine()
      : null;

    if (this.contextEngine) {
      this.contextEngine.detect();

      if (this.memory) {
        this.memory.write("context", this.contextEngine.context);
        this.memory.write("contextProfile", this.contextEngine.getProfile());
      }
    }

    this.identity = window.IdentityEngine
      ? new IdentityEngine(this.contextEngine)
      : null;

    if (this.memory && this.identity) {
      this.memory.write("identity", this.identity.get());
    }

    this.directorPanel = window.DirectorPanel
      ? new DirectorPanel({
          being: this.being,
          eyesEngine: this.eyesEngine
        })
      : null;

    this.animationEngine = window.AnimationEngine
      ? new AnimationEngine({
          being: this.being,
          presence: this.presence,
          memory: this.memory
        })
      : null;

    this.brain = window.BrainEngine
      ? new BrainEngine({
          presence: this.presence,
          eyesEngine: this.eyesEngine,
          gestures: this.gestures,
          memory: this.memory
        })
      : null;

    this.perception = window.PerceptionEngine && this.brain
      ? new PerceptionEngine(this.brain)
      : null;

    /*
    this.demoEngine = window.DemoEngine
      ? new DemoEngine(this)
      : null;
    */

    this.bindControls();
    this.bindMouseFollow();
    this.bindClickAttention();

    if (this.directorPanel) this.directorPanel.init();
    if (this.animationEngine) this.animationEngine.init();
    if (this.eyesEngine) this.eyesEngine.animate();

    this.startNaturalBlink();
    this.startMicroLook();

    this.setState("idle");
    this.renderIdentity();

    /*
    if (this.demoEngine) {
      this.demoEngine.autoStart(2200);
    }
    */
  },

  bindControls() {
    document.querySelectorAll("[data-state]").forEach((button) => {
      button.addEventListener("click", () => {
        this.setState(button.dataset.state);
      });
    });

    const winkBtn = document.getElementById("winkBtn");
    const blinkBtn = document.getElementById("blinkBtn");
    const doubleBlinkBtn = document.getElementById("doubleBlinkBtn");

    if (winkBtn && this.gestures) {
      winkBtn.addEventListener("click", () => this.gestures.wink());
    }

    if (blinkBtn && this.gestures) {
      blinkBtn.addEventListener("click", () => this.gestures.blink());
    }

    if (doubleBlinkBtn && this.gestures) {
      doubleBlinkBtn.addEventListener("click", () => this.gestures.doubleBlink());
    }

    /*
    const startDemoBtn = document.getElementById("startDemoBtn");
    const stopDemoBtn = document.getElementById("stopDemoBtn");

    if (startDemoBtn && this.demoEngine) {
      startDemoBtn.addEventListener("click", () => this.demoEngine.start());
    }

    if (stopDemoBtn && this.demoEngine) {
      stopDemoBtn.addEventListener("click", () => this.demoEngine.stop());
    }
    */
  },

  bindMouseFollow() {
    window.addEventListener("mousemove", (event) => {
      if (!this.being || !this.eyesEngine) return;

      this.userActive = true;
      this.eyesEngine.followMouse(event);

      if (this.brain) {
        this.brain.handle("user:move");
      }

      if (this.currentState === "idle") {
        this.setState("listening");
      }

      clearTimeout(this.returnTimer);

      this.returnTimer = window.setTimeout(() => {
        this.userActive = false;
        this.eyesEngine.center();

        if (this.presence) {
          this.presence.relax();
        }

        if (this.currentState === "listening") {
          this.setState("idle");
        }
      }, 2600);
    });
  },

  bindClickAttention() {
    window.addEventListener("click", (event) => {
      if (!this.being) return;

      if (this.brain) {
        this.brain.handle("user:click", {
          x: event.clientX,
          y: event.clientY
        });
      }

      clearTimeout(this.clickLookTimer);

      this.clickLookTimer = window.setTimeout(() => {
        if (this.eyesEngine) {
          this.eyesEngine.center();
        }

        if (this.presence) {
          this.presence.relax();
        }
      }, 1200);
    });
  },

  startNaturalBlink() {
    const schedule = () => {
      const delay = this.random(4500, 11000);

      this.blinkTimer = window.setTimeout(() => {
        if (
          this.currentState !== "sleep" &&
          this.currentState !== "thinking" &&
          this.gestures
        ) {
          const double = Math.random() > 0.78;

          if (double) {
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

  startMicroLook() {
    const schedule = () => {
      const delay = this.random(7000, 16000);

      this.microLookTimer = window.setTimeout(() => {
        if (
          !this.userActive &&
          this.currentState === "idle" &&
          this.presence &&
          !this.presence.getMood().sleeping &&
          this.eyesEngine
        ) {
          this.eyesEngine.microLook();

          window.setTimeout(() => {
            if (!this.userActive && this.currentState === "idle" && this.eyesEngine) {
              this.eyesEngine.center();
            }
          }, this.random(900, 1800));
        }

        schedule();
      }, delay);
    };

    schedule();
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

    if (!allowed.includes(state)) {
      state = "idle";
    }

    this.currentState = state;
    this.being.dataset.state = state;

    if (this.brain) {
      this.brain.handle("state:change", { state });
    }

    if (this.stateName) {
      this.stateName.textContent = state.toUpperCase();
    }

    if (state === "speaking") {
      this.startSpeakingPulse();
    } else {
      this.stopSpeakingPulse();
    }

    if (state === "success") {
      if (this.brain) {
        this.brain.handle("task:success");
      }

      window.setTimeout(() => {
        if (this.currentState === "success") {
          this.setState("idle");
        }
      }, 2200);
    }
  },

  startSpeakingPulse() {
    this.stopSpeakingPulse();

    this.speechTimer = window.setInterval(() => {
      if (!this.gestures) return;
      this.gestures.attention();
    }, 360);
  },

  stopSpeakingPulse() {
    clearInterval(this.speechTimer);
  },

  renderIdentity() {
    if (!this.identity) return;

    const identity = this.identity.get();

    const ownerEl = document.getElementById("identityOwner");
    const titleEl = document.getElementById("identityTitle");
    const subtitleEl = document.getElementById("identitySubtitle");

    if (ownerEl) ownerEl.textContent = identity.owner;
    if (titleEl) titleEl.textContent = identity.fullName;

    if (subtitleEl) {
      subtitleEl.textContent =
        `${identity.project} · ${identity.contextProfile?.name || "AION LAB™"} · v${identity.version}`;
    }
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AionLab.init();
});