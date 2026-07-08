/* =========================================================
   AION Memory Engine™ v1.0
   Memoria corta del laboratorio
========================================================= */

class MemoryEngine {
  constructor() {
    this.data = {
      lastEvent: null,
      lastEventAt: null,
      lastState: "idle",
      lastClick: null,
      lastMood: null
    };
  }

  write(key, value) {
    this.data[key] = value;
  }

  rememberEvent(eventName, payload = {}) {
    this.data.lastEvent = eventName;
    this.data.lastEventAt = new Date().toISOString();

    if (eventName === "user:click") {
      this.data.lastClick = payload;
    }
  }

  rememberState(state) {
    this.data.lastState = state;
  }

  rememberMood(mood) {
    this.data.lastMood = mood;
  }

  read() {
    return structuredClone(this.data);
  }

  clear() {
    this.data = {
      lastEvent: null,
      lastEventAt: null,
      lastState: "idle",
      lastClick: null,
      lastMood: null
    };
  }
}

window.MemoryEngine = MemoryEngine;