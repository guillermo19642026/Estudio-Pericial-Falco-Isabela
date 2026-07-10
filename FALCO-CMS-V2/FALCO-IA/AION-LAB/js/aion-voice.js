/* =========================================================
   AION Voice™ v1.1
   Voz institucional independiente
   Perfil: Tomás + presencia digital sutil
========================================================= */

window.AIONVoice = {
  enabled: false,
  speaking: false,
  currentUtterance: null,
  selectedVoice: null,

  init() {
    if (!("speechSynthesis" in window)) {
      console.warn("AION Voice™ no está disponible en este navegador.");
      return;
    }

    this.loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => this.loadVoices()
    );

    console.log("AION Voice™ Ready");
  },

  loadVoices() {
    const voices = window.speechSynthesis.getVoices();

    if (!voices.length) return;

    this.selectedVoice =
      voices.find((voice) =>
        voice.name.includes("Microsoft Tomas Online")
      ) ||
      voices.find((voice) =>
        voice.name.includes("Microsoft Mateo Online")
      ) ||
      voices.find((voice) =>
        voice.lang === "es-AR"
      ) ||
      voices.find((voice) =>
        voice.lang === "es-UY"
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("es")
      ) ||
      voices[0];
  },

  enable() {
    this.enabled = true;
    console.log("AION Voice™ activada");
  },

  disable() {
    this.enabled = false;
    this.stop();
    console.log("AION Voice™ desactivada");
  },

  toggle() {
    this.enabled = !this.enabled;

    if (!this.enabled) {
      this.stop();
    }

    return this.enabled;
  },

  playDigitalPulse() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        185,
        audioContext.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        125,
        audioContext.currentTime + 0.18
      );

      filter.type = "lowpass";
      filter.frequency.value = 900;

      gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.055,
        audioContext.currentTime + 0.025
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.24
      );

      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.25);

      oscillator.onended = () => {
        audioContext.close();
      };

    } catch (error) {
      console.warn("AION Digital Pulse™:", error);
    }
  },

  speak(text) {
    if (!this.enabled) return;
    if (!text || typeof text !== "string") return;
    if (!("speechSynthesis" in window)) return;

    this.stop();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang =
      this.selectedVoice?.lang || "es-AR";

    utterance.voice =
      this.selectedVoice || null;

    /*
     * Personalidad institucional AION™
     * Masculina, pausada, grave y clara.
     */

    utterance.rate = 0.88;
    utterance.pitch = 0.92;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.speaking = true;

      if (window.AionFloat) {
        AionFloat.setState("speaking");
      }
    };

    utterance.onend = () => {
      this.speaking = false;
      this.currentUtterance = null;

      if (window.AionFloat) {
        AionFloat.setState("idle");
      }
    };

    utterance.onerror = (event) => {
      this.speaking = false;
      this.currentUtterance = null;

      console.warn(
        "AION Voice™:",
        event.error
      );

      if (window.PresenceDirector) {
  PresenceDirector.idle();
} else if (window.PresenceDirector) {
  PresenceDirector.idle();
} else if (window.AionFloat) {
  AionFloat.setState("idle");
}
    };

    this.currentUtterance = utterance;

    this.playDigitalPulse();

    setTimeout(() => {
      if (
        this.enabled &&
        this.currentUtterance === utterance
      ) {
        window.speechSynthesis.speak(utterance);
      }
    }, 280);
  },

  stop() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    this.speaking = false;
    this.currentUtterance = null;

    if (window.AionFloat) {
      AionFloat.setState("idle");
    }
  },

  getVoices() {
    return window.speechSynthesis
      ? window.speechSynthesis.getVoices()
      : [];
  },

  setVoiceByName(name) {
    const voices = this.getVoices();

    const voice = voices.find((item) =>
      item.name
        .toLowerCase()
        .includes(
          String(name).toLowerCase()
        )
    );

    if (voice) {
      this.selectedVoice = voice;
      return true;
    }

    return false;
  }
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      AIONVoice.init();
    }
  );
} else {
  AIONVoice.init();
}