/* =========================================================
   AION DEBUG™ v4.0
   Sistema FALCO®
   Diagnóstico interno del motor + observer
========================================================= */

(function () {
  class AionDebug {
    constructor(engine) {
      this.engine = engine;
    }

    status() {
      if (!this.engine) {
        console.warn("AION Debug: engine no disponible.");
        return null;
      }

      const memory = this.engine.memory ? this.engine.memory.read() : {};

      const report = {
        version: "4.0",
        context: this.engine.currentContext,
        state: this.engine.state,
        title: this.engine.title,
        message: this.engine.message,
        behavior: this.engine.container?.dataset.behavior || null,
        workflow: this.engine.container?.dataset.workflow || "idle",
        activeWorkflow: this.engine.workflow?.activeWorkflow || null,
        observer: !!this.engine.observer,
        lastEvent: memory.lastEvent || null,
        lastDecision: memory.lastDecision || null,
        memory,
        modules: {
          behavior: !!this.engine.behavior,
          context: !!this.engine.context,
          events: !!this.engine.events,
          memory: !!this.engine.memory,
          brain: !!this.engine.brain,
          systemEvents: !!this.engine.systemEvents,
          presence: !!this.engine.presence,
          workflow: !!this.engine.workflow,
          bridge: !!this.engine.bridge,
          observer: !!this.engine.observer,
          api: !!window.AionAPI
        }
      };

      console.table({
        version: report.version,
        context: report.context,
        state: report.state,
        behavior: report.behavior,
        workflow: report.workflow,
        activeWorkflow: report.activeWorkflow,
        observer: report.observer,
        title: report.title,
        message: report.message,
        lastEvent: report.lastEvent
      });

      console.log("AION Debug completo:", report);

      return report;
    }

    memory() {
      if (!this.engine?.memory) {
        console.warn("AION Debug: memoria no disponible.");
        return null;
      }

      const memory = this.engine.memory.read();
      console.log("AION Memory:", memory);
      return memory;
    }

    clearMemory() {
      if (!this.engine?.memory) {
        console.warn("AION Debug: memoria no disponible.");
        return;
      }

      this.engine.memory.clear();
      console.log("AION Memory limpiada.");
    }
  }

  window.AionDebug = AionDebug;
})();