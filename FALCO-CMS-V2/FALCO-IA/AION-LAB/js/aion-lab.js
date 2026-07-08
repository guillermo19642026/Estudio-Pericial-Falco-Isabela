/* =========================================================
   AION LAB™ v2.0
   Living Presence Project
   Refactor modular: Presence + Gesture + Eye
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

  currentState: "idle",

  returnTimer: null,
  moodTimer: null,
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




this.directorPanel = window.DirectorPanel
  ? new DirectorPanel({
      being: this.being,
      eyesEngine: this.eyesEngine
    })
  : null;


  this.animationEngine = window.AnimationEngine
  ? new AnimationEngine({
      being: this.being,
      presence: this.presence
    })
  : null;



   this.bindControls();

if (this.directorPanel) {
    this.directorPanel.init();
}

if (this.animationEngine) {
    this.animationEngine.init();
}

this.bindMouseFollow();



    this.bindClickAttention();

    this.startPresenceLoop();
    this.startNaturalBlink();
    this.startMicroLook();

    if (this.eyesEngine) {
      this.eyesEngine.animate();
    }

    this.setState("idle");
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
  },

  bindDirectorPanel() {
    const breathRange = document.getElementById("breathRange");
    const glowRange = document.getElementById("glowRange");
    const eyeRange = document.getElementById("eyeRange");
    const haloRange = document.getElementById("haloRange");

    const breathValue = document.getElementById("breathValue");
    const glowValue = document.getElementById("glowValue");
    const eyeValue = document.getElementById("eyeValue");
    const haloValue = document.getElementById("haloValue");

    if (breathRange) {
      breathRange.addEventListener("input", () => {
        const value = breathRange.value;
        this.being.style.setProperty("--breath-speed", `${value}s`);
        if (breathValue) breathValue.textContent = `${value}s`;
      });
    }

    if (glowRange) {
      glowRange.addEventListener("input", () => {
        const value = glowRange.value;
        this.being.style.setProperty("--glow-strength", value);
        if (glowValue) glowValue.textContent = Number(value).toFixed(2);
      });
    }

    if (eyeRange && this.eyesEngine) {
      eyeRange.addEventListener("input", () => {
        const value = Number(eyeRange.value);
        this.eyesEngine.setSensitivity(value);
        if (eyeValue) eyeValue.textContent = value.toFixed(2);
      });
    }

    if (haloRange) {
      haloRange.addEventListener("input", () => {
        const value = haloRange.value;
        this.being.style.setProperty("--halo-speed", `${value}s`);
        if (haloValue) haloValue.textContent = `${value}s`;
      });
    }
  },

  bindMouseFollow() {
    window.addEventListener("mousemove", (event) => {
      if (!this.being || !this.eyesEngine) return;

      this.userActive = true;

      this.eyesEngine.followMouse(event);

      if (this.presence) {
        this.presence.curiosity(0.75);
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

      if (this.gestures) {
        this.gestures.attention();
      }

      if (this.presence) {
        this.presence.focus(1);
        this.presence.curiosity(0.9);
      }

      if (this.eyesEngine) {
        this.eyesEngine.lookAtPoint(event.clientX, event.clientY);
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

  startPresenceLoop() {
    clearInterval(this.moodTimer);

    this.moodTimer = window.setInterval(() => {
      if (!this.presence || !this.being) return;

      const mood = this.presence.getMood();
      const glow = 1 + mood.attention * 0.18 + mood.curiosity * 0.08;

      this.being.style.setProperty("--glow-strength", glow.toFixed(2));

      if (mood.thinking) {
        this.being.style.setProperty("--breath-speed", "6.4s");
        this.being.style.setProperty("--halo-speed", "26s");
      } else if (mood.speaking) {
        this.being.style.setProperty("--breath-speed", "2.7s");
        this.being.style.setProperty("--halo-speed", "10s");
      } else if (mood.warning) {
        this.being.style.setProperty("--breath-speed", "1.8s");
        this.being.style.setProperty("--halo-speed", "7s");
      } else if (mood.sleeping) {
        this.being.style.setProperty("--breath-speed", "7.6s");
        this.being.style.setProperty("--halo-speed", "34s");
      }
    }, 120);
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

    if (this.presence) {
      this.presence.setState(state);
      this.presence.think(state === "thinking");
      this.presence.speak(state === "speaking");
      this.presence.warning(state === "warning");
      this.presence.sleep(state === "sleep");

      if (state === "idle") {
        this.presence.relax();
      }

      if (state === "listening") {
        this.presence.focus(0.8);
      }

      if (state === "reading") {
        this.presence.focus(0.45);

        if (this.eyesEngine) {
          this.eyesEngine.center();
          this.eyesEngine.targetY = 4;
        }
      }
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
      if (this.gestures) {
        this.gestures.success();
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

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AionLab.init();
});