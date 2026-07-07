/* =========================================================
   AION SYSTEM EVENTS™ v2.1
   Sistema FALCO®
   Eventos internos del ecosistema
========================================================= */

class AionSystemEvents {
  constructor(engine) {
    this.engine = engine;
  }

  emit(eventName, payload = {}) {
    if (!this.engine || !eventName) return;

    const handlers = {
      "corpus:loaded": () => {
        this.engine.setState("violet");
        this.engine.setMessage(
          "Corpus FALCO®",
          "El conocimiento institucional fue cargado."
        );
        this.engine.emitEnergyWave();
      },

      "search:started": () => {
        if (this.engine.behavior) {
          this.engine.behavior.think();
        }

        this.engine.setState("blue");
        this.engine.emitEnergyWave();
      },

      "search:finished": () => {
        this.engine.setState("green");
        this.engine.setMessage(
          "Búsqueda finalizada",
          "Se encontraron resultados disponibles para revisión."
        );
        this.engine.emitEnergyWave();
      },

      "document:opened": () => {
        this.engine.setState("gold");
        this.engine.setMessage(
          "Documento abierto",
          payload.title || "Recurso institucional en lectura."
        );
      },

      "warning": () => {
        if (this.engine.behavior) {
          this.engine.behavior.warn();
        }

        this.engine.setState("violet");
        this.engine.emitEnergyWave();
      },

      "reset": () => {
        this.engine.applyPageContext();

        if (this.engine.behavior) {
          this.engine.behavior.guide();
        }
      }
    };

    const handler = handlers[eventName];

    if (handler) {
      handler();
      this.rememberEvent(eventName, payload);
    }
  }

  rememberEvent(eventName, payload = {}) {
    if (!this.engine.memory) return;

    this.engine.memory.write({
      lastEvent: eventName,
      lastPayload: payload
    });
  }
}

window.AionSystemEvents = AionSystemEvents;