/* =========================================================
   AION Brain Engine™ v1.1
   Decide intención + registra memoria corta
========================================================= */

class BrainEngine {
  constructor({ presence, eyesEngine, gestures, memory = null }) {
    this.presence = presence;
    this.eyesEngine = eyesEngine;
    this.gestures = gestures;
    this.memory = memory;

    this.lastEvent = null;
    this.lastEventAt = 0;
  }

  handle(eventName, payload = {}) {
    this.lastEvent = eventName;
    this.lastEventAt = Date.now();

    if (this.memory) {
      this.memory.rememberEvent(eventName, payload);
    }

    const handlers = {
      "user:move": () => this.onUserMove(payload),
      "user:click": () => this.onUserClick(payload),
      "state:change": () => this.onStateChange(payload),
      "task:success": () => this.onSuccess(payload),
      "task:warning": () => this.onWarning(payload),
      "reading:start": () => this.onReading(payload),
      "thinking:start": () => this.onThinking(payload),
      "speaking:start": () => this.onSpeaking(payload),
      "sleep:start": () => this.onSleep(payload)
    };

    const handler = handlers[eventName];
    if (handler) handler();
  }

  onUserMove() {
    if (this.presence) {
      this.presence.curiosity(0.75);
      this.presence.focus(0.8);
    }
  }

  onUserClick(payload = {}) {
    if (this.presence) {
      this.presence.curiosity(0.9);
      this.presence.focus(1);
    }

    if (this.eyesEngine && payload.x !== undefined && payload.y !== undefined) {
      this.eyesEngine.lookAtPoint(payload.x, payload.y);
    }

    if (this.gestures) {
      this.gestures.attention();
    }
  }

  onStateChange(payload = {}) {
    const state = payload.state || "idle";

    if (this.memory) {
      this.memory.rememberState(state);
    }

    if (!this.presence) return;

    this.presence.setState(state);
    this.presence.think(state === "thinking");
    this.presence.speak(state === "speaking");
    this.presence.warning(state === "warning");
    this.presence.sleep(state === "sleep");

    if (state === "idle") this.presence.relax();
    if (state === "listening") this.presence.focus(0.8);

    if (state === "reading") {
      this.presence.focus(0.45);

      if (this.eyesEngine) {
        this.eyesEngine.center();
        this.eyesEngine.targetY = 4;
      }
    }
  }

  onSuccess() {
    if (this.presence) {
      this.presence.focus(0.9);
      this.presence.curiosity(0.2);
    }

    if (this.gestures) {
      this.gestures.success();
    }
  }

  onWarning() {
    if (this.presence) {
      this.presence.warning(true);
      this.presence.focus(1);
    }
  }

  onReading() {
    if (this.presence) {
      this.presence.focus(0.45);
    }

    if (this.eyesEngine) {
      this.eyesEngine.center();
      this.eyesEngine.targetY = 4;
    }
  }

  onThinking() {
    if (this.presence) {
      this.presence.think(true);
      this.presence.focus(0.7);
    }
  }

  onSpeaking() {
    if (this.presence) {
      this.presence.speak(true);
      this.presence.focus(0.9);
    }
  }

  onSleep() {
    if (this.presence) {
      this.presence.sleep(true);
      this.presence.relax();
    }

    if (this.eyesEngine) {
      this.eyesEngine.center();
    }
  }
}

window.BrainEngine = BrainEngine;