/* =========================================================
   AION BRAIN™ v2.5
   Sistema FALCO®
   Decisión institucional + control de intervención
========================================================= */

class AionBrain {
  constructor(engine) {
    this.engine = engine;

    this.lastInterventionAt = 0;

    this.cooldowns = {
      low: 2500,
      medium: 3500,
      high: 1000,
      critical: 0
    };

    this.rules = {
      "corpus:loaded": {
        action: "say",
        priority: "medium",
        title: "Corpus FALCO®",
        message: "El conocimiento institucional fue cargado.",
        state: "violet",
        behavior: "guiding",
        wave: true
      },

      "search:started": {
        action: "say",
        priority: "high",
        title: "AION procesa",
        message: "Analizando conocimiento del Corpus FALCO®.",
        state: "blue",
        behavior: "thinking",
        wave: true
      },

      "search:finished": {
        action: "say",
        priority: "high",
        title: "Búsqueda finalizada",
        message: "Se encontraron resultados disponibles para revisión.",
        state: "green",
        behavior: "guiding",
        wave: true
      },

      "document:opened": {
        action: "say",
        priority: "medium",
        title: "Documento abierto",
        message: "Recurso institucional en lectura.",
        state: "gold",
        behavior: "guiding",
        wave: false
      },

      "warning": {
        action: "say",
        priority: "critical",
        title: "Atención",
        message: "Hay información contextual relevante.",
        state: "violet",
        behavior: "warning",
        wave: true
      },

      "silent:pulse": {
        action: "pulse",
        priority: "low",
        state: null,
        behavior: "guiding",
        wave: true
      },

      "reset": {
        action: "reset",
        priority: "medium"
      }
    };
  }

  decide(eventName, payload = {}) {
    const rule = this.rules[eventName];

    if (!rule) {
      return {
        action: "ignore",
        reason: "Evento no registrado",
        eventName,
        payload
      };
    }

    const priority = payload.priority || rule.priority || "medium";
    const canIntervene = this.canIntervene(priority);

    if (!canIntervene && priority !== "critical") {
      return {
        action: "ignore",
        reason: "Intervención omitida para no invadir al usuario",
        eventName,
        payload,
        priority
      };
    }

    return {
      ...rule,
      priority,
      eventName,
      payload
    };
  }

  canIntervene(priority = "medium") {
    const now = Date.now();
    const cooldown = this.cooldowns[priority] ?? this.cooldowns.medium;

    return now - this.lastInterventionAt >= cooldown;
  }

  markIntervention() {
    this.lastInterventionAt = Date.now();
  }

  execute(decision) {
    if (!this.engine || !decision) return;

    if (decision.action === "ignore") {
      return;
    }

    this.markIntervention();

    if (decision.action === "reset") {
      this.engine.applyPageContext();

      if (this.engine.behavior) {
        this.engine.behavior.guide();
      }

      this.engine.pulse({
        wave: true,
        behavior: "guiding"
      });

      return;
    }

    if (decision.action === "pulse") {
      this.engine.pulse({
        state: decision.payload?.state || decision.state || this.engine.state,
        behavior: decision.payload?.behavior || decision.behavior,
        wave: decision.wave
      });

      return;
    }

    if (decision.action === "say") {
      this.engine.say(
        decision.payload?.title || decision.title,
        decision.payload?.message || decision.message,
        {
          state: decision.payload?.state || decision.state,
          behavior: decision.payload?.behavior || decision.behavior,
          wave: decision.wave,
          force: decision.priority === "high" || decision.priority === "critical"
        }
      );
    }
  }

  handle(eventName, payload = {}) {
    const decision = this.decide(eventName, payload);
    this.execute(decision);

    return decision;
  }
}

window.AionBrain = AionBrain;