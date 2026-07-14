/* =========================================================
   AION PANEL™
   Control visual de apertura y cierre
   Versión: 1.0.0

   RESPONSABILIDAD:
   - Abrir y cerrar el panel de AION.
   - Administrar atributos de accesibilidad.
   - No leer progreso.
   - No modificar Firebase.
   - No intervenir en la evaluación.
========================================================= */

"use strict";

(() => {
  /* =======================================================
     1. PROTECCIÓN DE CARGA
  ======================================================= */

  if (window.AIONPanel) {
    console.warn(
      "AION Panel™ ya se encuentra inicializado."
    );

    return;
  }

  /* =======================================================
     2. ESTADO INTERNO
  ======================================================= */

  const state = {
    initialized: false,
    isOpen: false,

    elements: {
      root: null,
      toggleButton: null,
      closeButton: null,
      content: null
    }
  };

  /* =======================================================
     3. REFERENCIAS DEL DOM
  ======================================================= */

  function cacheElements() {
    state.elements.root =
      document.getElementById(
        "aionEvaluationGuide"
      );

   state.elements.toggleButton =
  document.querySelector(
    ".aion-float"
  );


      state.elements.closeButton =
  document.getElementById(
    "aionEvaluationClose"
  );

    state.elements.content =
      document.getElementById(
        "aionEvaluationContent"
      );

    return Boolean(
      state.elements.root &&
      state.elements.toggleButton &&
      state.elements.content
    );
  }

  /* =======================================================
     4. ACTUALIZACIÓN DE INTERFAZ
  ======================================================= */

  function render() {
    const {
      root,
      toggleButton,
      content
    } = state.elements;

    if (
      !root ||
      !toggleButton ||
      !content
    ) {
      return false;
    }

   root.hidden =
  !state.isOpen;

content.hidden = false;

    root.classList.toggle(
      "is-open",
      state.isOpen
    );

    toggleButton.setAttribute(
      "aria-expanded",
      String(state.isOpen)
    );

    toggleButton.setAttribute(
      "aria-label",
      state.isOpen
        ? "Cerrar orientación de AION"
        : "Abrir orientación de AION"
    );

    return true;
  }

  /* =======================================================
     5. ABRIR
  ======================================================= */

  function open() {
    if (!state.initialized) {
      return false;
    }

    if (state.isOpen) {
      return true;
    }

    state.isOpen = true;

    render();

    /*
     * Avisamos que el panel se abrió.
     * Evaluation Guide podrá escuchar este evento.
     */
    window.dispatchEvent(
      new CustomEvent(
        "aion:panel:opened"
      )
    );

    window.setTimeout(() => {
      state.elements.content
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
    }, 120);

    return true;
  }

  /* =======================================================
     6. CERRAR
  ======================================================= */

  function close() {
    if (!state.initialized) {
      return false;
    }

    if (!state.isOpen) {
      return true;
    }

    state.isOpen = false;

    render();

    window.dispatchEvent(
      new CustomEvent(
        "aion:panel:closed"
      )
    );

    return true;
  }

  /* =======================================================
     7. ALTERNAR
  ======================================================= */

  function toggle() {
    return state.isOpen
      ? close()
      : open();
  }

  /* =======================================================
     8. EVENTOS
  ======================================================= */

  function bindEvents() {



  state.elements.closeButton
    ?.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        close();

        state.elements.toggleButton
          ?.focus();

      }
    );

  /*
   * Escape cierra únicamente el panel de AION.
   */
  window.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        state.isOpen
      ) {

        close();

        state.elements.toggleButton
          ?.focus();

      }

    }
  );

}

  /* =======================================================
     9. INICIALIZACIÓN
  ======================================================= */

  function initialize() {
    if (state.initialized) {
      return api;
    }

    if (!cacheElements()) {
      console.warn(
        "AION Panel™ no encontró los elementos necesarios."
      );

      return false;
    }

    state.initialized = true;
    state.isOpen = false;

    render();
    bindEvents();

    console.log(
      "AION Panel™ Ready"
    );

    return api;
  }

  /* =======================================================
     10. API PÚBLICA
  ======================================================= */

  const api = Object.freeze({
    initialize,
    open,
    close,
    toggle,

    isOpen() {
      return state.isOpen;
    },

    isReady() {
      return state.initialized;
    }
  });

  Object.defineProperty(
    window,
    "AIONPanel",
    {
      value: api,
      writable: false,
      configurable: false,
      enumerable: true
    }
  );

  /* =======================================================
     11. ARRANQUE PROTEGIDO
  ======================================================= */

  function safeStart() {
    try {
      initialize();
    } catch (error) {
      console.warn(
        "AION Panel™ no pudo iniciarse. El resto de la página continúa funcionando.",
        error
      );
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      safeStart,
      {
        once: true
      }
    );
  } else {
    safeStart();
  }
})();