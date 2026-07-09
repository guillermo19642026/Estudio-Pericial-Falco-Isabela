/* =========================================================
   AION Brain Engine™ v1.2
   Decide intención + memoria corta + presencia autónoma
========================================================= */

class BrainEngine {
  constructor({ presence, eyesEngine, gestures, memory = null }) {
    this.presence = presence;
    this.eyesEngine = eyesEngine;
    this.gestures = gestures;
    this.memory = memory;

    this.lastEvent = null;
    this.lastEventAt = 0;

    this.autonomousTimer = null;
    this.autonomousCooldown = false;

    this.startAutonomousPresence();
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

  startAutonomousPresence() {
    this.autonomousTimer = setInterval(() => {
      const now = Date.now();
      const inactiveFor = now - this.lastEventAt;

      if (this.autonomousCooldown) return;
      if (inactiveFor < 18000) return;

      const currentState =
        this.presence?.currentState ||
        this.presence?.state ||
        "idle";

      if (currentState !== "idle") return;

      this.autonomousIdleThought();

    }, 5000);
  }

  autonomousIdleThought() {
    this.autonomousCooldown = true;

    if (this.memory) {
      this.memory.rememberEvent("aion:autonomous-thought", {
        inactive: true,
        at: new Date().toISOString()
      });
    }

    if (this.presence) {
      this.presence.curiosity(0.35);
      this.presence.focus(0.42);
    }



   if (this.eyesEngine) {
  const glances = [
    "up",
    "upperLeft",
    "upperRight",
    "left",
    "right"
  ];

  const selected = glances[Math.floor(Math.random() * glances.length)];

  this.eyesEngine.glance(selected);

  setTimeout(() => {
    this.eyesEngine.center();
  }, 2200 + Math.random() * 1400);
}

    setTimeout(() => {
      if (this.presence) {
        this.presence.relax();
      }

      this.autonomousCooldown = false;
      this.lastEventAt = Date.now();
    }, 4200);
  }

  onUserMove() {
    if (this.presence) {
      this.presence.curiosity(0.75);
      this.presence.focus(0.8);
      this.presence.nudge({
  presence: .006,
  curiosity: .004,
  attention: .006,
  calm: -.004
});
    }
  }

  onUserClick(payload = {}) {
    if (this.presence) {
      this.presence.curiosity(0.9);
      this.presence.focus(1);

      this.presence.nudge({
  presence: .025,
  curiosity: .018,
  attention: .022,
  calm: -.012
});
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