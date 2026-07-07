/* =========================================================
   AION WORKFLOW™ v5.7
   Sistema FALCO®
   Flujos institucionales + permanencia visual
========================================================= */

(function () {
  class AionWorkflow {
    constructor(engine) {
      this.engine = engine;
      this.activeWorkflow = null;
      this.workflowTimer = null;
    }

    run(workflowName, payload = {}) {
      const workflows = {
        corpus: () => this.runCorpus(payload),
        search: () => this.runSearch(payload),
        document: () => this.runDocument(payload),
        warning: () => this.runWarning(payload),
        reset: () => this.runReset(payload)
      };

      if (!workflows[workflowName]) return;

      this.setActive(workflowName);
      this.remember(workflowName, payload, "started");

      workflows[workflowName]();
    }

    setActive(workflowName) {
      this.activeWorkflow = workflowName;

      if (this.engine.container) {
        this.engine.container.dataset.workflow = workflowName;
      }

      clearTimeout(this.workflowTimer);
    }

    complete(workflowName, payload = {}, options = {}) {
      this.remember(workflowName, payload, "completed");

      clearTimeout(this.workflowTimer);

      const hold = options.hold ?? 2800;

      this.workflowTimer = window.setTimeout(() => {
        if (this.engine.container) {
          this.engine.container.dataset.workflow = "idle";
        }

        this.activeWorkflow = null;

        if (options.returnToGuide !== false && this.engine.behavior) {
          this.engine.behavior.guide();
        }
      }, hold);
    }

    runCorpus(payload = {}) {
      this.engine.emit("corpus:loaded", {
        voice: false
      });

      this.complete("corpus", payload, {
        hold: 2200
      });
    }

    runSearch(payload = {}) {
      const query = payload.query || "consulta institucional";

      this.engine.emit("search:started", {
        message: `Analizando: ${query}`,
        voice: false,
        priority: "high"
      });

      window.setTimeout(() => {
        
  
  const resultMessage =
  payload.resultMessage ||
  payload.resultsMessage ||
  this.engine.language?.searchResult({
    query,
    count: payload.count,
    resultsCount: payload.resultsCount,
    area: payload.area,
    context: payload.context
  }) ||
  `Encontré recursos relacionados con ${query} para revisar.`;

this.engine.emit("search:finished", {
  message: resultMessage,
  voice: true,
  priority: "high"
});

        this.complete("search", payload, {
          hold: payload.hold || 4200
        });
      }, payload.delay || 3000);
    }

    runDocument(payload = {}) {
      this.engine.emit("document:opened", {
        title: payload.title || "Documento institucional abierto",
        voice: false
      });

      this.complete("document", payload, {
        hold: 3000
      });
    }

    runWarning(payload = {}) {
      this.engine.emit("warning", {
        message: payload.message || "Hay información contextual relevante.",
        voice: true,
        priority: "critical"
      });

      this.complete("warning", payload, {
        hold: 5000
      });
    }

    runReset(payload = {}) {
      this.engine.emit("reset", {
        voice: false
      });

      this.complete("reset", payload, {
        hold: 1200
      });
    }

    remember(workflowName, payload = {}, status = "active") {
      if (!this.engine.memory) return;

      this.engine.memory.write({
        activeWorkflow: workflowName,
        workflowStatus: status,
        workflowPayload: payload
      });
    }
  }

  window.AionWorkflow = AionWorkflow;
})();