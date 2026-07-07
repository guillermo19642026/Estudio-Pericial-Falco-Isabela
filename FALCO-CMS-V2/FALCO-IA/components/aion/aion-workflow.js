/* =========================================================
   AION WORKFLOW™ v3.6
   Sistema FALCO®
   Flujos institucionales + visual workflow states
========================================================= */

(function () {
  class AionWorkflow {
    constructor(engine) {
      this.engine = engine;
      this.activeWorkflow = null;
      this.workflowTimer = null;
    }

    run(workflowName, payload = {}) {
      if (!this.engine || !workflowName) return;

      const workflows = {
        corpus: () => this.runCorpus(payload),
        search: () => this.runSearch(payload),
        document: () => this.runDocument(payload),
        warning: () => this.runWarning(payload),
        reset: () => this.runReset(payload)
      };

      const workflow = workflows[workflowName];

      if (!workflow) {
        console.warn(`AION Workflow: flujo no registrado: ${workflowName}`);
        return;
      }

      this.setActive(workflowName);
      this.remember(workflowName, payload, "started");

      workflow();
    }

    setActive(workflowName) {
      this.activeWorkflow = workflowName;

      if (this.engine.container) {
        this.engine.container.dataset.workflow = workflowName;
      }

      clearTimeout(this.workflowTimer);
    }

    complete(workflowName, payload = {}) {
      this.remember(workflowName, payload, "completed");

      clearTimeout(this.workflowTimer);

      this.workflowTimer = window.setTimeout(() => {
        if (this.engine.container) {
          this.engine.container.dataset.workflow = "idle";
        }

        this.activeWorkflow = null;
      }, 1800);
    }

    runCorpus(payload = {}) {
      this.engine.emit("corpus:loaded");
      this.complete("corpus", payload);
    }

    runSearch(payload = {}) {
      const query = payload.query || "consulta institucional";

      this.engine.emit("search:started", {
        message: `Analizando: ${query}`
      });

      window.setTimeout(() => {
        this.engine.emit("search:finished", {
          message: payload.resultMessage || "La búsqueda finalizó correctamente."
        });

        this.complete("search", payload);
      }, payload.delay || 1200);
    }

    runDocument(payload = {}) {
      this.engine.emit("document:opened", {
        title: payload.title || "Documento institucional abierto"
      });

      this.complete("document", payload);
    }

    runWarning(payload = {}) {
      this.engine.emit("warning", {
        message: payload.message || "Hay información contextual relevante."
      });

      this.complete("warning", payload);
    }

    runReset(payload = {}) {
      this.engine.emit("reset");
      this.complete("reset", payload);
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