/* =========================================================
   AION SYSTEM EVENTS™ v2.4
   Sistema FALCO®
   Eventos internos delegados al Brain
========================================================= */

(function () {
  class AionSystemEvents {
    constructor(engine) {
      this.engine = engine;
    }

    emit(eventName, payload = {}) {
      if (!this.engine || !eventName) return;

      let decision = null;

      if (this.engine.brain) {
        decision = this.engine.brain.handle(eventName, payload);
      }

      this.rememberEvent(eventName, payload, decision);
    }

    rememberEvent(eventName, payload = {}, decision = null) {
      if (!this.engine.memory) return;

      this.engine.memory.write({
        lastEvent: eventName,
        lastPayload: payload,
        lastDecision: decision
      });
    }
  }

  window.AionSystemEvents = AionSystemEvents;
})();