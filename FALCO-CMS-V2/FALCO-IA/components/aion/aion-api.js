/* =========================================================
   AION API™ v6.3
   Sistema FALCO®
   API pública liviana para módulos externos
========================================================= */

(function () {
  const AionAPI = {
    run(workflowName, payload = {}) {
      window.dispatchEvent(new CustomEvent("aion:run", {
        detail: {
          workflowName,
          payload
        }
      }));
    },

    emit(eventName, payload = {}) {
      window.dispatchEvent(new CustomEvent("aion:emit", {
        detail: {
          eventName,
          payload
        }
      }));
    },

    action(actionName, payload = {}) {
      window.dispatchEvent(new CustomEvent("aion:action", {
        detail: {
          actionName,
          payload
        }
      }));
    },

    say(title, message, options = {}) {
      window.dispatchEvent(new CustomEvent("aion:say", {
        detail: {
          title,
          message,
          options
        }
      }));
    },

    pulse(options = {}) {
      window.dispatchEvent(new CustomEvent("aion:pulse", {
        detail: options
      }));
    }
  };

  window.AionAPI = AionAPI;
})();