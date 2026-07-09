/* =========================================================
   AION LAB™ v2.3
   Living Presence Project
   AIONCore + Identity + Memory
========================================================= */

const AionLab = {
  core: null,

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
  actionEngine: null,
  demoEngine: null,

  currentState: "idle",

  returnTimer: null,
  blinkTimer: null,
  microLookTimer: null,
  speechTimer: null,
  clickLookTimer: null,
  moodTimer: null,

  userActive: false,

  init() {
    this.being = document.getElementById("aionBeing");
    this.eyes = document.getElementById("aionEyes");
    this.stateName = document.getElementById("stateName");

    if (!this.being || !this.eyes) return;

    this.core = window.AIONCore
      ? new AIONCore().initLab(this)
      : null;

    if (this.core) {
      this.presence = this.core.presence;
      this.gestures = this.core.gestures;
      this.eyesEngine = this.core.eyes;
      this.memory = this.core.memory;
      this.contextEngine = this.core.context;
      this.identity = this.core.identity;
      this.animationEngine = this.core.animation;
      this.brain = this.core.brain;
      this.perception = this.core.perception;
      this.actionEngine = this.core.actions;
    }

    this.directorPanel = window.DirectorPanel
      ? new DirectorPanel({
          being: this.being,
          eyesEngine: this.eyesEngine
        })
      : null;

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
    this.startMoodMonitor();
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
    const startDemoBtn = document.getElementById("startDemoBtn");

    if (winkBtn && this.gestures) {
      winkBtn.addEventListener("click", () => this.gestures.wink());
    }

    if (blinkBtn && this.gestures) {
      blinkBtn.addEventListener("click", () => this.gestures.blink());
    }

    if (doubleBlinkBtn && this.gestures) {
      doubleBlinkBtn.addEventListener("click", () => this.gestures.doubleBlink());
    }

    if (startDemoBtn && this.actionEngine) {
      startDemoBtn.addEventListener("click", () => {
        this.actionEngine.demoReadThinkSpeak();
      });
    }
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

  startMoodMonitor() {
    this.moodTimer = window.setInterval(() => {
      if (!this.presence) return;

      const mood = this.presence.getMood();

      this.syncMoodToVisuals();

      const presenceEl = document.getElementById("moodPresence");
      const calmEl = document.getElementById("moodCalm");
      const curiosityEl = document.getElementById("moodCuriosity");
      const attentionEl = document.getElementById("moodAttention");

      if (presenceEl) presenceEl.textContent = mood.presence.toFixed(2);
      if (calmEl) calmEl.textContent = mood.calm.toFixed(2);
      if (curiosityEl) curiosityEl.textContent = mood.curiosity.toFixed(2);
      if (attentionEl) attentionEl.textContent = mood.attention.toFixed(2);
    }, 250);
  },

  syncMoodToVisuals() {
    if (!this.presence || !this.being) return;

    const mood = this.presence.getMood();

    this.being.style.setProperty("--mood-presence", mood.presence.toFixed(3));
    this.being.style.setProperty("--mood-attention", mood.attention.toFixed(3));
    this.being.style.setProperty("--mood-calm", mood.calm.toFixed(3));
    this.being.style.setProperty("--mood-curiosity", mood.curiosity.toFixed(3));
  },

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AionLab.init();
});