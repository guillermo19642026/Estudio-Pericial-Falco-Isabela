/* =========================================================
   AION Presence Director™ v2.0
   Director central de presencia
   Coordina Voice + Eyes + Gestures + Animation
========================================================= */

window.PresenceDirector = {

  state: "idle",

  returnTimer: null,
  voiceWatchTimer: null,

  core: null,
  voice: null,
  eyes: null,
  animation: null,
  gestures: null,
  presence: null,
  brain: null,

  /* =====================================================
     REGISTRO DEL CORE
  ===================================================== */

  register(core) {

    this.core = core;

    this.voice = window.AIONVoice || null;


if (
    this.voice &&
    !this.voice.enabled
) {
    this.voice.enable();
}



    this.eyes = core.eyes || null;

    this.animation = core.animation || null;

    this.gestures = core.gestures || null;

    this.presence = core.presence || null;

    this.brain = core.brain || null;

    console.log("AION Presence Director™ conectado al Core");

  },

  /* =====================================================
     CAMBIO DE ESTADO
  ===================================================== */

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

  /* =====================================================
     IDLE
  ===================================================== */

  idle() {

    clearTimeout(this.returnTimer);

    if (this.animation) {
      this.animation.setMotion(
        "6.4s",
        "26s"
      );
    }

    if (this.eyes) {
      this.eyes.center();
    }

    return this.setState("idle");
  },

  /* =====================================================
     THINKING
  ===================================================== */

  think(duration = 650) {

    clearTimeout(this.returnTimer);

    this.setState("thinking");

    if (this.animation) {
      this.animation.setMotion(
        "4.4s",
        "16s"
      );
    }

    if (this.eyes) {
      this.eyes.center();
    }

    if (this.gestures) {
      this.gestures.attention();
    }

    if (duration > 0) {

      this.returnTimer = setTimeout(() => {

        if (this.state === "thinking") {
          this.idle();
        }

      }, duration);

    }

    return this.state;
  },

  /* =====================================================
     SPEAK
  ===================================================== */

  speak(text = "") {

    clearTimeout(this.returnTimer);
    clearInterval(this.voiceWatchTimer);

    this.setState("speaking");

    if (this.animation) {

      this.animation.setMotion(
        "2.2s",
        "7s"
      );

    }

    if (this.eyes) {
      this.eyes.center();
    }

    if (this.gestures) {
      this.gestures.attention();
    }

    if (
      text &&
      this.voice &&
      this.voice.enabled
    ) {

      this.voice.speak(text);

      this.voiceWatchTimer =
        setInterval(() => {

          if (this.gestures) {

            this.gestures.attention();

            if (Math.random() > 0.72) {
              this.gestures.doubleBlink();
            }

          }

          const finished =
            !this.voice.speaking &&
            !speechSynthesis.speaking &&
            !speechSynthesis.pending;

          if (finished) {

            clearInterval(
              this.voiceWatchTimer
            );

            this.voiceWatchTimer = null;

            this.idle();

          }

        }, 220);

    } else {

      this.returnTimer = setTimeout(() => {

        this.idle();

      }, 1800);

    }

    return this.state;
  },

  /* =====================================================
     WARNING
  ===================================================== */

  warning(duration = 1800) {

    clearTimeout(this.returnTimer);

    this.setState("warning");

    if (this.animation) {

      this.animation.setMotion(
        "1.6s",
        "6s"
      );

    }

    this.returnTimer = setTimeout(() => {

      this.idle();

    }, duration);

    return this.state;
  },

  /* =====================================================
     RESPUESTA COMPLETA
  ===================================================== */

  async respond(
    text,
    options = {}
  ) {

    const thinkingTime =
      options.thinkingTime ?? 650;

    this.think(0);

    await new Promise(resolve =>
      setTimeout(
        resolve,
        thinkingTime
      )
    );

    this.speak(text);

    return text;
  },

  /* =====================================================
     STOP
  ===================================================== */

  stop() {

    clearTimeout(this.returnTimer);
    clearInterval(this.voiceWatchTimer);

    if (
      this.voice &&
      this.voice.stop
    ) {
      this.voice.stop();
    }

    this.idle();
  },

  getState() {
    return this.state;
  }

};

console.log(
  "AION Presence Director™ v2.0 Ready"
);