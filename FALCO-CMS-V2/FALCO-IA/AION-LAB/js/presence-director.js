/* =========================================================
   AION Presence Director™ v1.0
   Coordinador de estados y presencia
   No reemplaza motores existentes
========================================================= */

window.PresenceDirector = {
  state: "idle",
  returnTimer: null,
  voiceWatchTimer: null,

  setState(state = "idle") {
    const allowed = [
      "idle",
      "thinking",
      "speaking",
      "listening",
      "success",
      "warning"
    ];

    if (!allowed.includes(state)) {
      state = "idle";
    }

    this.state = state;

    if (window.AionFloat) {
      AionFloat.setState(state);
    }

    window.dispatchEvent(
      new CustomEvent("aion:presence", {
        detail: { state }
      })
    );

    return state;
  },

  idle() {
    clearTimeout(this.returnTimer);
    return this.setState("idle");
  },

  think(duration = 650) {
    clearTimeout(this.returnTimer);

    this.setState("thinking");

    if (duration > 0) {
      this.returnTimer = setTimeout(() => {
        if (this.state === "thinking") {
          this.idle();
        }
      }, duration);
    }

    return this.state;
  },






speak(text = "") {
  clearTimeout(this.returnTimer);
  clearInterval(this.voiceWatchTimer);

  this.setState("speaking");

  if (
    text &&
    window.AIONVoice &&
    AIONVoice.enabled
  ) {
    AIONVoice.speak(text);

    this.voiceWatchTimer = setInterval(() => {
      const voiceFinished =
        !AIONVoice.speaking &&
        !window.speechSynthesis.speaking &&
        !window.speechSynthesis.pending;

      if (voiceFinished) {
        clearInterval(this.voiceWatchTimer);
        this.voiceWatchTimer = null;
        this.idle();
      }
    }, 150);

  } else {
    this.returnTimer = setTimeout(() => {
      this.idle();
    }, 1800);
  }

  return this.state;
},

  warning(duration = 1800) {
    clearTimeout(this.returnTimer);

    this.setState("warning");

    this.returnTimer = setTimeout(() => {
      this.idle();
    }, duration);

    return this.state;
  },

  async respond(text, options = {}) {
    const thinkingTime =
      options.thinkingTime ?? 650;

    this.think(0);

    await new Promise((resolve) => {
      setTimeout(resolve, thinkingTime);
    });

    this.speak(text);

    return text;
  },

  stop() {
    clearTimeout(this.returnTimer);

    if (window.AIONVoice) {
      AIONVoice.stop();
    }

    this.idle();
  },

  getState() {
    return this.state;
  }
};

console.log("AION Presence Director™ Ready");