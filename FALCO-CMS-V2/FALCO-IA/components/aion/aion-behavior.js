/* =========================================================
   AION BEHAVIOR™ v1.7
   Sistema FALCO®
   Estado interno de comportamiento
========================================================= */

class AionBehavior {
  constructor(engine) {
    this.engine = engine;

    this.mode = "idle";

    this.modes = {
      idle: {
        title: "AION",
        message: "Presencia institucional activa."
      },

      listening: {
        title: "AION escucha",
        message: "Estoy atento a la interacción del usuario."
      },

      thinking: {
        title: "AION procesa",
        message: "Analizando información del Sistema FALCO®."
      },

      guiding: {
        title: "AION guía",
        message: "Orientando la navegación dentro del ecosistema."
      },

      warning: {
        title: "Atención",
        message: "Hay información contextual relevante."
      },

      processing: {
        title: "Procesando",
        message: "Ejecutando una acción dentro del sistema."
      }
    };
  }

  setMode(mode = "idle") {
    if (!this.modes[mode]) {
      mode = "idle";
    }

    this.mode = mode;

    if (!this.engine || !this.engine.container) return;

    this.engine.container.dataset.behavior = mode;

    const selected = this.modes[mode];
    this.engine.setMessage(selected.title, selected.message);
  }

  getMode() {
    return this.mode;
  }

  idle() {
    this.setMode("idle");
  }

  listen() {
    this.setMode("listening");
  }

  think() {
    this.setMode("thinking");
  }

  guide() {
    this.setMode("guiding");
  }

  warn() {
    this.setMode("warning");
  }

  process() {
    this.setMode("processing");
  }
}

window.AionBehavior = AionBehavior;