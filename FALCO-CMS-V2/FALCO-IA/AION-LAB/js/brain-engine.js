
/* =========================================================
   AION Brain Engine™ v1.3
   Decisión cognitiva + memoria corta + presencia autónoma
========================================================= */

class BrainEngine {
  constructor({
    presence,
    eyesEngine,
    gestures,
    memory = null
  }) {
    this.presence = presence;
    this.eyesEngine = eyesEngine;
    this.gestures = gestures;
    this.memory = memory;

    this.lastEvent = null;
    this.lastEventAt = Date.now();

    this.autonomousTimer = null;
    this.autonomousCooldown = false;

    this.startAutonomousPresence();
  }

  /* =======================================================
     EVENTOS
  ======================================================= */

  handle(eventName, payload = {}) {
    this.lastEvent = eventName;
    this.lastEventAt = Date.now();

    if (this.memory) {
      this.memory.rememberEvent(
        eventName,
        payload
      );
    }

    const handlers = {
      "user:move": () =>
        this.onUserMove(payload),

      "user:click": () =>
        this.onUserClick(payload),

      "state:change": () =>
        this.onStateChange(payload),

      "task:success": () =>
        this.onSuccess(payload),

      "task:warning": () =>
        this.onWarning(payload),

      "reading:start": () =>
        this.onReading(payload),

      "thinking:start": () =>
        this.onThinking(payload),

      "speaking:start": () =>
        this.onSpeaking(payload),

      "sleep:start": () =>
        this.onSleep(payload)
    };

    const handler = handlers[eventName];

    if (handler) {
      handler();
    }
  }

  /* =======================================================
     AION Cognitive Layer™
     Decide qué comportamiento debe ejecutar AION
  ======================================================= */

  decide(input = {}) {
    const intent =
      input.intent ||
      input.type ||
      "general";

    const text =
      input.answer ||
      input.text ||
      input.response ||
      "";

    const confidence =
      Number.isFinite(input.confidence)
        ? input.confidence
        : 1;

    const voice =
      input.voice !== false;

    const decision = {
      action: "listen",
      intent,
      text,
      confidence,
      voice,
      thinkingTime: 650,
      duration: 1800,
      createdAt: new Date().toISOString()
    };

    /*
     * Advertencia o error
     */
    if (
      intent === "warning" ||
      intent === "error" ||
      input.warning === true
    ) {
      decision.action = "warning";
      decision.thinkingTime = 0;
      decision.duration =
        input.duration ?? 1800;

      return decision;
    }

    /*
     * Resultado satisfactorio
     */
    if (
      intent === "success" ||
      input.success === true
    ) {
      decision.action = "success";
      decision.thinkingTime = 0;
      decision.duration =
        input.duration ?? 2200;

      return decision;
    }

    /*
     * Procesamiento sin respuesta inmediata
     */
    if (
      intent === "thinking" ||
      input.thinking === true
    ) {
      decision.action = "thinking";
      decision.thinkingTime =
        input.thinkingTime ?? 1200;

      return decision;
    }

    /*
     * Existe una respuesta para comunicar
     */
    if (
      typeof text === "string" &&
      text.trim()
    ) {
      decision.action = voice
        ? "respond"
        : "present";

      if (confidence < 0.45) {
        decision.thinkingTime = 1400;
      } else if (confidence < 0.75) {
        decision.thinkingTime = 950;
      } else {
        decision.thinkingTime =
          input.thinkingTime ?? 650;
      }

      return decision;
    }

    /*
     * No existe respuesta:
     * AION permanece receptivo.
     */
    decision.action = "listen";

    return decision;
  }

  async executeDecision(decision = {}) {
    const action =
      decision.action || "listen";

    if (this.memory) {
      this.memory.rememberEvent(
        "aion:decision",
        decision
      );
    }

    const director =
      window.PresenceDirector || null;

    if (!director) {
      console.warn(
        "AION Brain Engine™: PresenceDirector no disponible"
      );

      return decision;
    }

    switch (action) {
      case "respond":
        await director.respond(
          decision.text,
          {
            thinkingTime:
              decision.thinkingTime ?? 650
          }
        );
        break;

      case "present":
        director.think(0);

        window.setTimeout(() => {
          if (
            director.getState() === "thinking"
          ) {
            director.idle();
          }
        }, decision.thinkingTime ?? 650);
        break;

      case "thinking":
        director.think(
          decision.thinkingTime ?? 1200
        );
        break;

      case "warning":
        director.warning(
          decision.duration ?? 1800
        );
        break;

      case "success":
        director.setState("success");

        window.setTimeout(() => {
          if (
            director.getState() === "success"
          ) {
            director.idle();
          }
        }, decision.duration ?? 2200);
        break;

      case "listen":
      default:
        director.setState("listening");
        break;
    }

    return decision;
  }

  async process(input = {}) {
    const decision =
      this.decide(input);

    await this.executeDecision(decision);

    return decision;
  }

  /* =======================================================
     PRESENCIA AUTÓNOMA
  ======================================================= */

  startAutonomousPresence() {
    this.autonomousTimer =
      window.setInterval(() => {
        const now = Date.now();

        const inactiveFor =
          now - this.lastEventAt;

        if (this.autonomousCooldown) {
          return;
        }

        if (inactiveFor < 18000) {
          return;
        }

        const currentState =
          this.presence?.currentState ||
          this.presence?.state ||
          "idle";

        if (currentState !== "idle") {
          return;
        }

        this.autonomousIdleThought();
      }, 5000);
  }

  autonomousIdleThought() {
    this.autonomousCooldown = true;

    if (this.memory) {
      this.memory.rememberEvent(
        "aion:autonomous-thought",
        {
          inactive: true,
          at: new Date().toISOString()
        }
      );
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

      const selected =
        glances[
          Math.floor(
            Math.random() *
            glances.length
          )
        ];

      this.eyesEngine.glance(selected);

      window.setTimeout(() => {
        if (this.eyesEngine) {
          this.eyesEngine.center();
        }
      }, 2200 + Math.random() * 1400);
    }

    window.setTimeout(() => {
      if (this.presence) {
        this.presence.relax();
      }

      this.autonomousCooldown = false;
      this.lastEventAt = Date.now();
    }, 4200);
  }

  /* =======================================================
     RESPUESTAS A EVENTOS
  ======================================================= */

  onUserMove() {
    if (!this.presence) {
      return;
    }

    this.presence.curiosity(0.75);
    this.presence.focus(0.8);

    this.presence.nudge({
      presence: 0.006,
      curiosity: 0.004,
      attention: 0.006,
      calm: -0.004
    });
  }

  onUserClick(payload = {}) {
    if (this.presence) {
      this.presence.curiosity(0.9);
      this.presence.focus(1);

      this.presence.nudge({
        presence: 0.025,
        curiosity: 0.018,
        attention: 0.022,
        calm: -0.012
      });
    }

    if (
      this.eyesEngine &&
      payload.x !== undefined &&
      payload.y !== undefined
    ) {
      this.eyesEngine.lookAtPoint(
        payload.x,
        payload.y
      );
    }

    if (this.gestures) {
      this.gestures.attention();
    }
  }

  onStateChange(payload = {}) {
    const state =
      payload.state || "idle";

    if (this.memory) {
      this.memory.rememberState(state);
    }

    if (!this.presence) {
      return;
    }

    this.presence.setState(state);
    this.presence.think(
      state === "thinking"
    );

    this.presence.speak(
      state === "speaking"
    );

    this.presence.warning(
      state === "warning"
    );

    this.presence.sleep(
      state === "sleep"
    );

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

console.log(
  "AION Brain Engine™ v1.3 Ready"
);
