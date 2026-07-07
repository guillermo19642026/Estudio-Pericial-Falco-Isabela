/* =========================================================
   AION ACTIONS™ v6.7
   Sistema FALCO®
   Acciones conectadas al Action Catalog
========================================================= */

(function () {
  class AionActions {
    constructor(engine) {
      this.engine = engine;
    }

    run(actionName, payload = {}) {
      if (!this.engine || !actionName) return;

      const config = window.AionActionCatalog?.get(actionName);

      if (!config) {
        console.warn(`AION Actions: acción no registrada: ${actionName}`);
        return;
      }

      if (config.workflow) {
        this.runWorkflow(config.workflow, payload);
      } else {
        this.runSimpleAction(actionName, config, payload);
      }

      this.remember(actionName, payload, config);
    }

    runWorkflow(workflowName, payload = {}) {
      if (!this.engine.workflow) return;

      this.engine.run(workflowName, {
        ...payload,
        delay: payload.delay || 3000,
        hold: payload.hold || 5000
      });
    }

    runSimpleAction(actionName, config, payload = {}) {
      const title = payload.title || config.title;
      const message = this.buildMessage(actionName, config, payload);

      this.engine.say(title, message, {
        state: payload.state || config.state,
        behavior: payload.behavior || config.behavior,
        wave: payload.wave ?? config.wave,
        voice: payload.voice ?? config.voice,
        force: true
      });

      if (this.engine.memory) {
        this.engine.memory.write({
          lastEvent: actionName,
          lastAction: actionName,
          lastActionTitle: title,
          lastActionMessage: message
        });
      }
    }

    buildMessage(actionName, config, payload = {}) {
      if (payload.message) return payload.message;

      const dynamicMessages = {
        "open-document": () =>
          payload.title || config.message,

        "open-resource": () =>
          payload.title || config.message,

        "open-model": () =>
          payload.title || config.message,

        "open-report": () =>
          payload.title || config.message,

        "open-library": () =>
          payload.category
            ? `Accediendo a recursos de ${payload.category}.`
            : config.message,

        "open-category": () =>
          payload.category
            ? `Categoría seleccionada: ${payload.category}.`
            : config.message,

        "open-bibliography": () =>
          payload.topic
            ? `Bibliografía relacionada con ${payload.topic}.`
            : config.message,

        "open-course": () =>
          payload.module
            ? `Ingresando al módulo: ${payload.module}.`
            : config.message,

        "open-module": () =>
          payload.module
            ? `Módulo abierto: ${payload.module}.`
            : config.message,

        "complete-module": () =>
          payload.module
            ? `Módulo completado: ${payload.module}.`
            : config.message,

        "login-success": () =>
          payload.role
            ? `Ingreso autorizado como ${payload.role}.`
            : config.message,

        "role-detected": () =>
          payload.role
            ? `Perfil reconocido: ${payload.role}.`
            : config.message,

        "open-professional-area": () =>
          payload.area
            ? `Área profesional activa: ${payload.area}.`
            : config.message,

        "open-tool": () =>
          payload.tool
            ? `Herramienta seleccionada: ${payload.tool}.`
            : config.message,

        "open-test": () =>
          payload.test
            ? `Instrumento seleccionado: ${payload.test}.`
            : config.message,

        "open-template": () =>
          payload.template
            ? `Plantilla seleccionada: ${payload.template}.`
            : config.message
      };

      return dynamicMessages[actionName]?.() || config.message;
    }

    remember(actionName, payload = {}, config = {}) {
      if (!this.engine.memory) return;

      this.engine.memory.write({
        lastAction: actionName,
        lastActionPayload: payload,
        lastActionConfig: config
      });
    }
  }

  window.AionActions = AionActions;
})();