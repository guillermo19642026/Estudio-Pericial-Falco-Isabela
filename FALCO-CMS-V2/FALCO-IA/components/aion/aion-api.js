/* =========================================================
   AION API™ v3.9
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