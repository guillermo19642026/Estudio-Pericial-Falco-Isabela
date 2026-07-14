/* =========================================================
   AION EVALUATION GUIDE™
   Orientación contextual para dashboard-periciado
   Versión: 1.0.0

   IMPORTANTE:
   - Solo lee el progreso existente.
   - No modifica avanceEvaluacionFalco.
   - No interviene en Firebase ni Cloudinary.
   - No altera las respuestas del periciado.
========================================================= */

"use strict";

(() => {
  /* =======================================================
     1. PROTECCIÓN DE CARGA
  ======================================================= */

  if (window.AIONEvaluationGuide) {
    console.warn(
      "AION Evaluation Guide™ ya se encuentra inicializado."
    );

    return;
  }

  /* =======================================================
     2. CONFIGURACIÓN
  ======================================================= */

  const CONFIG = Object.freeze({
    storageKey: "avanceEvaluacionFalco",
    totalStages: 8,
    refreshInterval: 1200,

    support: {
      phone: "5491132049521",
      message:
        "Hola. Necesito asistencia técnica para completar mi evaluación psicológica en la plataforma FALCO."
    }
  });

  /*
   * Las ocho etapas actuales son:
   *
   * 1. SCL-90 / BSI
   * 2. BDI
   * 3. BAI
   * 4. Desesperanza
   * 5. Consentimiento informado
   * 6. Constancia de tratamiento
   * 7. Ficha integral
   * 8. Documentación adicional
   *
   * Los aliases permiten reconocer distintas denominaciones
   * que puedan estar guardadas actualmente en localStorage.
   */
  const STAGES = Object.freeze([
    {
      id: "scl90",
      label: "Completar SCL-90 / BSI",
      shortLabel: "SCL-90 / BSI",
      page: "periciado-scl90.html",
      selector:
        "button[onclick=\"ir('periciado-scl90.html')\"]",
      aliases: [
        "scl90",
        "scl-90",
        "bsi",
        "periciado-scl90"
      ]
    },

    {
      id: "bdi",
      label: "Completar Inventario de Depresión BDI",
      shortLabel: "Depresión BDI",
      page: "periciado-bdi.html",
      selector:
        "button[onclick=\"ir('periciado-bdi.html')\"]",
      aliases: [
        "bdi",
        "depresion",
        "depresion-bdi",
        "periciado-bdi"
      ]
    },

    {
      id: "bai",
      label: "Completar Inventario de Ansiedad BAI",
      shortLabel: "Ansiedad BAI",
      page: "periciado-bai.html",
      selector:
        "button[onclick=\"ir('periciado-bai.html')\"]",
      aliases: [
        "bai",
        "ansiedad",
        "ansiedad-bai",
        "periciado-bai"
      ]
    },

    {
      id: "desesperanza",
      label: "Completar Escala de Desesperanza",
      shortLabel: "Desesperanza",
      page: "periciado-desesperanza.html",
      selector:
        "button[onclick=\"ir('periciado-desesperanza.html')\"]",
      aliases: [
        "desesperanza",
        "beck-desesperanza",
        "periciado-desesperanza"
      ]
    },

    {
      id: "consentimiento",
      label: "Completar el consentimiento informado",
      shortLabel: "Consentimiento informado",
      page: "consentimiento-informado.html",
      selector:
        "button[onclick=\"ir('consentimiento-informado.html')\"]",
      aliases: [
        "consentimiento",
        "consentimiento-informado",
        "consentimiento_informado"
      ]
    },

    {
      id: "constancia",
      label: "Completar la constancia de tratamiento",
      shortLabel: "Constancia de tratamiento",
      page: "constancia-tratamiento.html",
      selector:
        "button[onclick=\"ir('constancia-tratamiento.html')\"]",
      aliases: [
        "constancia",
        "constancia-tratamiento",
        "constancia_tratamiento",
        "tratamiento"
      ]
    },

    {
      id: "ficha",
      label: "Completar la ficha integral del periciado",
      shortLabel: "Ficha integral",
      page: "ficha-periciado.html",
      selector:
        "button[onclick=\"ir('ficha-periciado.html')\"]",
      aliases: [
        "ficha",
        "ficha-periciado",
        "ficha_integral",
        "ficha-integral",
        "ficha integral"
      ]
    },

    {
      id: "documentacion",
      label: "Adjuntar frente y dorso del DNI",
      shortLabel: "Documentación adicional",
      page: null,
      selector: ".documentacion-extra",
      aliases: [
        "documentacion",
        "documentación",
        "documentacion-extra",
        "documentación-extra",
        "adjuntos",
        "dni"
      ]
    }
  ]);

  /* =======================================================
     3. ESTADO INTERNO
  ======================================================= */

const state = {
  initialized: false,
  lastSignature: "",
  intervalId: null,
  currentNextStage: null,

  elements: {
    root: null,

    toggleButton: null,
    content: null,

    badge: null,
    progressText: null,
    nextStep: null,
    progressBar: null,
    progressFill: null,
    continueButton: null,
    guidanceButton: null,
    guidancePanel: null,
    response: null,
    optionButtons: []
  }
};


  /* =======================================================
     4. UTILIDADES
  ======================================================= */

  function normalizeValue(value = "") {
    return value
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  }

  function safelyReadProgress() {
    try {
      const storedValue =
        localStorage.getItem(CONFIG.storageKey);

      if (!storedValue) {
        return [];
      }

      const parsedValue =
        JSON.parse(storedValue);

      return Array.isArray(parsedValue)
        ? parsedValue
        : [];
    } catch (error) {
      console.warn(
        "AION no pudo leer el progreso de la evaluación.",
        error
      );

      return [];
    }
  }

  function getNormalizedProgress() {
    return safelyReadProgress()
      .map(normalizeValue)
      .filter(Boolean);
  }

  function isStageCompleted(stage, progress) {
    return stage.aliases.some((alias) =>
      progress.includes(
        normalizeValue(alias)
      )
    );
  }

  function getEvaluationState() {
    const progress =
      getNormalizedProgress();

    const stages = STAGES.map((stage) => ({
      ...stage,
      completed:
        isStageCompleted(
          stage,
          progress
        )
    }));

    const completedStages =
      stages.filter(
        (stage) => stage.completed
      );

    const pendingStages =
      stages.filter(
        (stage) => !stage.completed
      );

    /*
     * Si existiera algún identificador histórico que no
     * coincide con los aliases, respetamos igualmente la
     * cantidad informada por el sistema, sin superar ocho.
     */
    const recordedCount =
      Math.min(
        safelyReadProgress().length,
        CONFIG.totalStages
      );

    const recognizedCount =
      completedStages.length;

    const completedCount =
      Math.max(
        recognizedCount,
        recordedCount
      );

    const percentage =
      Math.min(
        100,
        Math.round(
          (
            completedCount /
            CONFIG.totalStages
          ) * 100
        )
      );

    return {
      progress,
      stages,
      completedStages,
      pendingStages,
      completedCount,
      percentage,
      complete:
        completedCount >=
        CONFIG.totalStages,
      nextStage:
        pendingStages[0] || null
    };
  }

  function createSignature(evaluationState) {
    return JSON.stringify({
      completedCount:
        evaluationState.completedCount,
      percentage:
        evaluationState.percentage,
      nextStage:
        evaluationState.nextStage?.id ||
        null
    });
  }

  /* =======================================================
     5. REFERENCIAS DOM
  ======================================================= */

  function cacheElements() {
    state.elements.root =
      document.getElementById(
        "aionEvaluationGuide"
      );

    state.elements.badge =
      state.elements.root?.querySelector(
        ".aion-evaluation-guide__badge"
      );

    state.elements.progressText =
      document.getElementById(
        "aionEvaluationProgress"
      );

    state.elements.nextStep =
      document.getElementById(
        "aionEvaluationNextStep"
      );

    state.elements.progressBar =
      document.getElementById(
        "aionEvaluationProgressBar"
      );

    state.elements.progressFill =
      document.getElementById(
        "aionEvaluationProgressFill"
      );

    state.elements.continueButton =
      document.getElementById(
        "aionContinueEvaluation"
      );

    state.elements.guidanceButton =
      document.getElementById(
        "aionOpenGuidance"
      );

    state.elements.guidancePanel =
      document.getElementById(
        "aionGuidancePanel"
      );

    state.elements.response =
      document.getElementById(
        "aionGuidanceResponse"
      );

    state.elements.optionButtons =
      Array.from(
        document.querySelectorAll(
          "[data-aion-guidance]"
        )
      );

    return Boolean(
      state.elements.root
    );
  }

  /* =======================================================
     6. ACTUALIZACIÓN VISUAL
  ======================================================= */

  function updateView(force = false) {
    if (!state.initialized) {
      return false;
    }

    const evaluationState =
      getEvaluationState();

    const signature =
      createSignature(
        evaluationState
      );

    if (
      !force &&
      signature === state.lastSignature
    ) {
      return evaluationState;
    }

    state.lastSignature = signature;
    state.currentNextStage =
      evaluationState.nextStage;

    const {
      completedCount,
      percentage,
      complete,
      nextStage
    } = evaluationState;

    if (
      state.elements.progressText
    ) {
      state.elements.progressText.textContent =
        complete
          ? "8 de 8 etapas completadas"
          : `${completedCount} de 8 etapas completadas`;
    }

    if (state.elements.nextStep) {
      state.elements.nextStep.textContent =
        complete
          ? "Revisar la información y finalizar la evaluación"
          : (
              nextStage?.label ||
              "Continuar con la próxima etapa pendiente"
            );
    }

    if (
      state.elements.progressFill
    ) {
      state.elements.progressFill.style.width =
        `${percentage}%`;
    }

    if (state.elements.progressBar) {
      state.elements.progressBar.setAttribute(
        "aria-valuenow",
        String(completedCount)
      );

      state.elements.progressBar.setAttribute(
        "aria-valuetext",
        `${completedCount} de 8 etapas completadas`
      );
    }

    if (state.elements.badge) {
      state.elements.badge.textContent =
        complete
          ? "Evaluación completa"
          : completedCount > 0
            ? "Evaluación en proceso"
            : "Evaluación iniciada";
    }

    if (
      state.elements.continueButton
    ) {
      state.elements.continueButton.textContent =
        complete
          ? "Revisar y finalizar"
          : "Continuar evaluación";
    }

    return evaluationState;
  }

  /* =======================================================
     7. NAVEGACIÓN SEGURA
  ======================================================= */

  function scrollToElement(
    element,
    options = {}
  ) {
    if (!element) {
      return false;
    }

    element.scrollIntoView({
      behavior:
        options.behavior || "smooth",
      block:
        options.block || "center"
    });

    if (
      typeof element.focus ===
      "function"
    ) {
      window.setTimeout(() => {
        element.focus({
          preventScroll: true
        });
      }, 500);
    }

    return true;
  }

  function continueEvaluation() {
    const evaluationState =
      updateView(true);

    if (!evaluationState) {
      return;
    }

    if (evaluationState.complete) {
      const finalizeButton =
        document.querySelector(
          "button[onclick=\"finalizarEvaluacion()\"]"
        );

      if (finalizeButton) {
        scrollToElement(
          finalizeButton
        );

        showResponse(
          "Completaste las ocho etapas. Revisá la información cargada y utilizá “Finalizar evaluación” cuando estés seguro de que todo está correcto."
        );
      }

      return;
    }

    const nextStage =
      evaluationState.nextStage;

    if (!nextStage) {
      return;
    }

    /*
     * En lugar de redirigir inmediatamente, llevamos al
     * periciado hasta la tarjeta correspondiente. De esta
     * forma conserva el control sobre la navegación.
     */
    const target =
      nextStage.selector
        ? document.querySelector(
            nextStage.selector
          )
        : null;

    if (target) {
      scrollToElement(target);

      showResponse(
        `La próxima etapa sugerida es: ${nextStage.shortLabel}. Encontrarás la opción resaltada en la sección correspondiente.`
      );

      target.classList.add(
        "aion-evaluation-target"
      );

      window.setTimeout(() => {
        target.classList.remove(
          "aion-evaluation-target"
        );
      }, 2200);

      return;
    }

    if (nextStage.page) {
      window.location.href =
        nextStage.page;
    }
  }

  /* =======================================================
     8. PANEL DE ORIENTACIÓN
  ======================================================= */

  function openGuidancePanel() {
    const panel =
      state.elements.guidancePanel;

    const button =
      state.elements.guidanceButton;

    if (!panel || !button) {
      return;
    }

    const willOpen =
      panel.hidden;

    panel.hidden = !willOpen;

    button.setAttribute(
      "aria-expanded",
      String(willOpen)
    );

    if (willOpen) {
      panel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }



 function showResponse(message) {

  if (!state.elements.response) {
    return;
  }

  state.elements.response.textContent =
    message;

  // AION cambia al estado de habla
  if (window.AionFloat) {

    AionFloat.setState("speaking");

    setTimeout(() => {

      AionFloat.setState("idle");

    }, 2200);

  }

  // Utilizar el motor de voz disponible
  if (
    window.PresenceDirector &&
    typeof PresenceDirector.speak === "function"
  ) {

    PresenceDirector.speak(message);

  } else if (
    window.AIONVoice &&
    typeof AIONVoice.speak === "function"
  ) {

    AIONVoice.speak(message);

  } else if (
    "speechSynthesis" in window
  ) {

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);

    utterance.lang = "es-AR";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);

  }

}



  function getPendingLabels(
    evaluationState
  ) {
    return evaluationState.pendingStages
      .map(
        (stage) =>
          stage.shortLabel
      )
      .join(", ");
  }

  function answerGuidance(type) {
    const evaluationState =
      updateView(true);

    if (!evaluationState) {
      return;
    }

    const {
      complete,
      completedCount,
      nextStage,
      pendingStages
    } = evaluationState;

    switch (type) {
      case "next-step": {
        if (complete) {
          showResponse(
            "Las ocho etapas figuran como completadas. Revisá la información y la documentación antes de finalizar el proceso."
          );

          return;
        }

        showResponse(
          `Tu próxima etapa sugerida es “${nextStage?.shortLabel || "la próxima etapa pendiente"}”. Presioná “Continuar evaluación” para localizarla en esta página.`
        );

        return;
      }

      case "field-help": {
        showResponse(
          "Leé con atención el título y la explicación de cada sección. Completá únicamente información que conozcas y que refleje tu experiencia personal. AION puede explicar el funcionamiento de la plataforma, pero no puede indicarte qué responder."
        );

        return;
      }

      case "documents": {
        const documentationPending =
          pendingStages.some(
            (stage) =>
              stage.id ===
              "documentacion"
          );

        showResponse(
          documentationPending
            ? "Todavía figura pendiente la documentación adicional. Debés adjuntar imágenes legibles del frente y dorso del DNI. Los certificados, estudios o informes complementarios son opcionales."
            : "La carga de documentación adicional figura como completada. Antes de finalizar, verificá que las imágenes del DNI sean legibles."
        );

        const documentationSection =
          document.querySelector(
            ".documentacion-extra"
          );

        if (
          documentationPending &&
          documentationSection
        ) {
          scrollToElement(
            documentationSection,
            {
              block: "start"
            }
          );
        }

        return;
      }

      case "progress": {
        if (complete) {
          showResponse(
            "El sistema registra 8 de 8 etapas completadas. Revisá todo antes de finalizar la evaluación."
          );

          return;
        }

        const pendingLabels =
          getPendingLabels(
            evaluationState
          );

        showResponse(
          `Llevás ${completedCount} de 8 etapas completadas. Pendientes: ${pendingLabels || "el sistema no pudo identificar el detalle; revisá la barra general de progreso"}.`
        );

        return;
      }

      case "technical": {
        const whatsappUrl =
          createWhatsAppUrl();

        showResponse(
          "Para problemas técnicos podés comunicarte con el soporte exclusivo por WhatsApp. Se abrirá una conversación con un mensaje preparado."
        );

        window.setTimeout(() => {
          window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }, 300);

        return;
      }

      default: {
        showResponse(
          "Elegí una de las opciones disponibles para recibir orientación sobre el uso de la plataforma."
        );
      }
    }
  }

  function createWhatsAppUrl() {
    return [
      "https://wa.me/",
      CONFIG.support.phone,
      "?text=",
      encodeURIComponent(
        CONFIG.support.message
      )
    ].join("");
  }

  /* =======================================================
     9. EVENTOS
  ======================================================= */

  function bindEvents() {


window.addEventListener(
  "aion:panel:opened",
  () => {
    updateView(true);
  }
);

window.addEventListener(
  "aion:panel:closed",
  () => {
    if (
      state.elements.guidancePanel
    ) {
      state.elements.guidancePanel.hidden =
        true;
    }

    state.elements.guidanceButton
      ?.setAttribute(
        "aria-expanded",
        "false"
      );

    if (
      state.elements.response
    ) {
      state.elements.response.textContent =
        "Elegí una opción para recibir orientación.";
    }
  }
);




    state.elements.continueButton
      ?.addEventListener(
        "click",
        continueEvaluation
      );

    state.elements.guidanceButton
      ?.addEventListener(
        "click",
        openGuidancePanel
      );

    state.elements.optionButtons
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            answerGuidance(
              button.dataset
                .aionGuidance
            );
          }
        );
      });

    /*
     * Este evento funciona cuando el progreso se modifica
     * desde otra pestaña o ventana.
     */
    window.addEventListener(
      "storage",
      (event) => {
        if (
          event.key ===
          CONFIG.storageKey
        ) {
          updateView(true);
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          updateView(true);
        }
      }
    );

    window.addEventListener(
      "focus",
      () => {
        updateView(true);
      }
    );
  }

  /* =======================================================
     10. INICIALIZACIÓN
  ======================================================= */

  function initialize() {
    if (state.initialized) {
      return api;
    }

    if (!cacheElements()) {
      console.warn(
        "AION Evaluation Guide™ no encontró su tarjeta en el dashboard."
      );

      return false;
    }

    state.initialized = true;

    bindEvents();
    updateView(true);

    /*
     * La comprobación periódica solo lee localStorage.
     * Esto permite reflejar inmediatamente una carga de
     * documentación sin intervenir en actualizarProgreso().
     */
    state.intervalId =
      window.setInterval(
        () => {
          updateView();
        },
        CONFIG.refreshInterval
      );

    console.log(
      "AION Evaluation Guide™ Ready"
    );

    return api;
  }

  function destroy() {
    if (state.intervalId) {
      window.clearInterval(
        state.intervalId
      );

      state.intervalId = null;
    }

    state.initialized = false;
  }

  /* =======================================================
     11. API PÚBLICA
  ======================================================= */

  const api = Object.freeze({
    initialize,
    update: () =>
      updateView(true),
    getState:
      getEvaluationState,
    continue:
      continueEvaluation,
    destroy,

    isReady() {
      return state.initialized;
    }
  });

  Object.defineProperty(
    window,
    "AIONEvaluationGuide",
    {
      value: api,
      writable: false,
      configurable: false,
      enumerable: true
    }
  );

  /* =======================================================
     12. ARRANQUE PROTEGIDO
  ======================================================= */

  function safeStart() {
    try {
      initialize();
    } catch (error) {
      console.warn(
        "AION Evaluation Guide™ no pudo iniciarse. La evaluación continúa funcionando normalmente.",
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