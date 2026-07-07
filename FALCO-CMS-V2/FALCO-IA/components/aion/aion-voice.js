/* =========================================================
   AION VOICE™ v5.1
   Sistema FALCO®
   Voz institucional + movimiento sincronizado
========================================================= */

(function () {
  class AionVoice {
    constructor(engine) {
      this.engine = engine;
      this.enabled = false;
      this.available = "speechSynthesis" in window;
      this.voice = null;

      this.rate = 0.92;
      this.pitch = 0.88;
      this.volume = 0.85;

      this.boundaryPulseTimer = null;
    }

    init() {
      if (!this.available) return;

      this.loadVoice();

      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoice();
      };
    }

    loadVoice() {
      if (!this.available) return;

      const voices = window.speechSynthesis.getVoices();

      this.voice =
        voices.find(v => v.lang.startsWith("es") && v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.lang.startsWith("es")) ||
        voices[0] ||
        null;
    }

    enable() {
      this.enabled = true;
      this.setVoiceState("enabled");
    }

    disable() {
      this.enabled = false;
      this.stop();
      this.setVoiceState("disabled");
    }

    toggle() {
      this.enabled = !this.enabled;

      if (!this.enabled) {
        this.stop();
      }

      this.setVoiceState(this.enabled ? "enabled" : "disabled");

      return this.enabled;
    }

    speak(text = "", options = {}) {
      if (!this.available || !this.enabled || !text) return;

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = options.lang || "es-AR";
      utterance.rate = options.rate || this.rate;
      utterance.pitch = options.pitch || this.pitch;
      utterance.volume = options.volume || this.volume;

      if (this.voice) {
        utterance.voice = this.voice;
      }

      utterance.onstart = () => {
        this.setVoiceState("speaking");

        if (this.engine?.behavior) {
          this.engine.behavior.setMode("speaking");
        }

        if (this.engine?.container) {
          this.engine.container.dataset.voice = "speaking";
        }

        this.engine?.emitEnergyWave?.();
      };

      utterance.onboundary = () => {
        this.pulseWithSpeech();
      };

      utterance.onend = () => {
        this.setVoiceState("enabled");

        if (this.engine?.behavior) {
          this.engine.behavior.guide();
        }

        if (this.engine?.container) {
          this.engine.container.dataset.voice = "enabled";
        }
      };

      utterance.onerror = () => {
        this.setVoiceState("enabled");

        if (this.engine?.container) {
          this.engine.container.dataset.voice = "enabled";
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    pulseWithSpeech() {
      if (!this.engine?.container) return;

      this.engine.container.classList.add("aion-speaking-pulse");

      clearTimeout(this.boundaryPulseTimer);

      this.boundaryPulseTimer = window.setTimeout(() => {
        this.engine.container.classList.remove("aion-speaking-pulse");
      }, 180);
    }

    setVoiceState(state = "enabled") {
      if (!this.engine?.container) return;

      this.engine.container.dataset.voice = state;
    }

    stop() {
      if (!this.available) return;

      window.speechSynthesis.cancel();

      if (this.engine?.container) {
        this.engine.container.dataset.voice = this.enabled ? "enabled" : "disabled";
        this.engine.container.classList.remove("aion-speaking-pulse");
      }
    }
  }

  window.AionVoice = AionVoice;
})();