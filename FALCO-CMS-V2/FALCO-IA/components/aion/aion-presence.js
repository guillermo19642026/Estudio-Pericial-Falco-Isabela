/* =========================================================
   AION PRESENCE™ v5.2
   Sistema FALCO®
   Presencia institucional + voz controlada
========================================================= */

class AionPresence {
  constructor(engine) {
    this.engine = engine;

    this.silenceMode = false;
    this.lastMessageAt = 0;

    this.minimumInterval = 3500;
  }

  speak(title, message, options = {}) {/* =========================================================
   AION PRESENCE™ v5.8
   Sistema FALCO®
   Presencia institucional sin duplicar voz
========================================================= */

class AionPresence {
  constructor(engine) {
    this.engine = engine;
    this.silenceMode = false;
    this.lastMessageAt = 0;
    this.minimumInterval = 3500;
  }

  speak(title, message, options = {}) {
    if (!this.engine) return;

    const now = Date.now();
    const force = options.force === true;

    if (this.silenceMode && !force) return;

    if (!force && now - this.lastMessageAt < this.minimumInterval) {
      return;
    }

    this.engine.setMessage(title, message);
    this.lastMessageAt = now;

    if (options.wave) {
      this.engine.emitEnergyWave();
    }

    if (options.behavior && this.engine.behavior) {
      this.engine.behavior.setMode(options.behavior);
    }

    if (options.state) {
      this.engine.setState(options.state);
    }

    /*
      La voz NO se ejecuta acá.
      Para evitar cortes, la voz queda centralizada en AionSystemEvents.
    */
  }

  silentPulse(options = {}) {
    if (!this.engine) return;

    if (options.wave) {
      this.engine.emitEnergyWave();
    }

    if (options.state) {
      this.engine.setState(options.state);
    }

    if (options.behavior && this.engine.behavior) {
      this.engine.behavior.setMode(options.behavior);
    }
  }

  enterSilence() {
    this.silenceMode = true;
  }

  exitSilence() {
    this.silenceMode = false;
  }

  resetTiming() {
    this.lastMessageAt = 0;
  }
}

window.AionPresence = AionPresence;
    if (!this.engine) return;

    const now = Date.now();
    const force = options.force === true;

    if (this.silenceMode && !force) return;

    if (!force && now - this.lastMessageAt < this.minimumInterval) {
      return;
    }

    this.engine.setMessage(title, message);
    this.lastMessageAt = now;

    if (options.wave) {
      this.engine.emitEnergyWave();
    }

    if (options.behavior && this.engine.behavior) {
      this.engine.behavior.setMode(options.behavior);
    }

    if (options.state) {
      this.engine.setState(options.state);
    }

   if (options.voice === true) {
  window.setTimeout(() => {
    if (this.engine.voice?.enabled) {
      this.engine.voice.speak(message);
    }
  }, 120);
}
  }

  silentPulse(options = {}) {
    if (!this.engine) return;

    if (options.wave) {
      this.engine.emitEnergyWave();
    }

    if (options.state) {
      this.engine.setState(options.state);
    }

    if (options.behavior && this.engine.behavior) {
      this.engine.behavior.setMode(options.behavior);
    }
  }

  enterSilence() {
    this.silenceMode = true;
  }

  exitSilence() {
    this.silenceMode = false;
  }

  resetTiming() {
    this.lastMessageAt = 0;
  }
}

window.AionPresence = AionPresence;