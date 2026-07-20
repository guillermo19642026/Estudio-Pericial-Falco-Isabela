/* =========================================================
   FALCO Admisión™
   Core System v0.1
   Control general de la portada y presencia de AION
========================================================= */

const FalcoAdmisionCore = {

  /* =======================================================
     ELEMENTOS
  ======================================================= */

  elements: {
    page: null,
    startButton: null,

    aionPresence: null,
    aionMessage: null,
    aionLabel: null,

    restoreNotice: null,
    restoreButton: null,
    restartButton: null
  },

  initialized: false,
  redirectTimer: null,

  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {
    if (this.initialized) {
      return;
    }

    if (!window.FalcoAdmisionConfig) {
      console.error(
        "FALCO Admisión™ Core: no se encontró FalcoAdmisionConfig."
      );

      return;
    }

    if (!window.FalcoAdmisionState) {
      console.error(
        "FALCO Admisión™ Core: no se encontró FalcoAdmisionState."
      );

      return;
    }

    this.cacheElements();
    this.initializeState();
    this.bindEvents();
    this.applyReceptionContent();
    this.evaluatePreviousAdmission();
    this.activateAion();

    this.initialized = true;

    this.log("Core inicializado correctamente");
  },

  /* =======================================================
     BÚSQUEDA DE ELEMENTOS
  ======================================================= */

  cacheElements() {
    this.elements.page =
      document.querySelector(".admision-page");

    
    
     this.elements.startButton =
  document.querySelector(
    [
      "#iniciarAdmision",
      "#startAdmission",
      "[data-action='start-admission']"
    ].join(",")
  );



    this.elements.aionPresence =
      document.querySelector(
        [
          "#aionPresence",
          "[data-aion-presence]",
          ".aion-reception__presence"
        ].join(",")
      );

    this.elements.aionMessage =
      document.querySelector(
        [
          "#aionMessage",
          "[data-aion-message]",
          ".aion-reception__message p"
        ].join(",")
      );

    this.elements.aionLabel =
      document.querySelector(
        [
          "#aionLabel",
          "[data-aion-label]",
          ".aion-reception__label"
        ].join(",")
      );

    this.elements.restoreNotice =
      document.querySelector(
        [
          "#restoreNotice",
          "[data-restore-notice]"
        ].join(",")
      );

    this.elements.restoreButton =
      document.querySelector(
        [
          "#continueAdmission",
          "[data-action='continue-admission']"
        ].join(",")
      );

    this.elements.restartButton =
      document.querySelector(
        [
          "#restartAdmission",
          "[data-action='restart-admission']"
        ].join(",")
      );
  },

  /* =======================================================
     ESTADO
  ======================================================= */

  initializeState() {
    const state =
      window.FalcoAdmisionState.init();

    this.log(
      "Estado disponible",
      state
    );
  },

  evaluatePreviousAdmission() {
    const state =
      window.FalcoAdmisionState.getState();

    if (!window.FalcoAdmisionState.hasStarted()) {
      this.hideRestoreNotice();
      return;
    }

    if (state.submitted) {
      this.handleSubmittedAdmission();
      return;
    }

    this.showRestoreNotice();

    this.setAionMessage(
      window.FalcoAdmisionConfig
        .texts
        .aion
        .restored
    );
  },

  handleSubmittedAdmission() {
    this.hideRestoreNotice();

    this.setAionMessage(
      "La admisión anterior ya fue enviada. Podés iniciar una nueva cuando lo necesites."
    );

    if (this.elements.startButton) {
      const textNode =
        this.elements.startButton.querySelector(
          "[data-button-text]"
        );

      if (textNode) {
        textNode.textContent =
          "Iniciar nueva admisión";
      } else {
        this.setButtonText(
          this.elements.startButton,
          "Iniciar nueva admisión"
        );
      }
    }
  },

  /* =======================================================
     CONTENIDO
  ======================================================= */

  applyReceptionContent() {
    const texts =
      window.FalcoAdmisionConfig
        .texts
        .reception;

    const eyebrow =
      document.querySelector(
        "[data-reception-eyebrow]"
      );

    const title =
      document.querySelector(
        "[data-reception-title]"
      );

    const highlightedTitle =
      document.querySelector(
        "[data-reception-highlight]"
      );

    const description =
      document.querySelector(
        "[data-reception-description]"
      );

    const privacy =
      document.querySelector(
        "[data-reception-privacy]"
      );

    if (eyebrow) {
      eyebrow.textContent =
        texts.eyebrow;
    }

    if (title) {
      title.textContent =
        texts.title;
    }

    if (highlightedTitle) {
      highlightedTitle.textContent =
        texts.highlightedTitle;
    }

    if (description) {
      description.textContent =
        texts.description;
    }

    if (privacy) {
      privacy.textContent =
        texts.privacy;
    }

    if (this.elements.aionLabel) {
      this.elements.aionLabel.textContent =
        window.FalcoAdmisionConfig
          .identity
          .assistant;
    }

    if (
      this.elements.aionMessage &&
      !window.FalcoAdmisionState.hasStarted()
    ) {
      this.setAionMessage(
        window.FalcoAdmisionConfig
          .texts
          .aion
          .reception
      );
    }
  },

  /* =======================================================
     EVENTOS
  ======================================================= */

  bindEvents() {
    this.elements.startButton
      ?.addEventListener(
        "click",
        event => {
          event.preventDefault();
          this.handleStart();
        }
      );

    this.elements.restoreButton
      ?.addEventListener(
        "click",
        event => {
          event.preventDefault();
          this.continueAdmission();
        }
      );

    this.elements.restartButton
      ?.addEventListener(
        "click",
        event => {
          event.preventDefault();
          this.restartAdmission();
        }
      );

    this.elements.aionPresence
      ?.addEventListener(
        "mouseenter",
        () => {
          this.setAionState(
            "attentive"
          );
        }
      );

    this.elements.aionPresence
      ?.addEventListener(
        "mouseleave",
        () => {
          this.setAionState(
            "idle"
          );
        }
      );

    window.addEventListener(
      "falco-admision:state:saved",
      () => {
        this.handleStateSaved();
      }
    );

    window.addEventListener(
      "pageshow",
      event => {
        if (event.persisted) {
          this.evaluatePreviousAdmission();
        }
      }
    );
  },

  /* =======================================================
     INICIO DE ADMISIÓN
  ======================================================= */

  handleStart() {
    const state =
      window.FalcoAdmisionState.getState();

    if (state.submitted) {
      window.FalcoAdmisionState.reset();
    }

    if (
      window.FalcoAdmisionState.hasStarted() &&
      !state.submitted
    ) {
      this.continueAdmission();
      return;
    }

    this.beginNewAdmission();
  },

  beginNewAdmission() {
    this.setButtonLoading(
      this.elements.startButton,
      true
    );

    this.setAionState("thinking");

    this.setAionMessage(
      window.FalcoAdmisionConfig
        .texts
        .aion
        .start
    );

    window.FalcoAdmisionState.set(
      "status",
      window.FalcoAdmisionConfig
        .admissionStatus
        .inProgress
        .id
    );

    window.FalcoAdmisionState.set(
      "startedAt",
      new Date().toISOString()
    );

    this.redirectTimer =
      window.setTimeout(
        () => {
          this.navigateToAdmission();
        },
        650
      );
  },

  continueAdmission() {
    this.setAionState("thinking");

    this.setAionMessage(
      "Retomemos desde el punto en el que quedaste."
    );

    this.setButtonLoading(
      this.elements.restoreButton ||
      this.elements.startButton,
      true
    );

    this.redirectTimer =
      window.setTimeout(
        () => {
          this.navigateToAdmission();
        },
        500
      );
  },

  restartAdmission() {
    const shouldRestart =
      window.confirm(
        "Se eliminará la admisión guardada en este dispositivo. ¿Querés comenzar nuevamente?"
      );

    if (!shouldRestart) {
      return;
    }

    window.FalcoAdmisionState.reset();

    this.hideRestoreNotice();

    this.setAionState("attentive");

    this.setAionMessage(
      window.FalcoAdmisionConfig
        .texts
        .aion
        .reception
    );

    this.setButtonLoading(
      this.elements.startButton,
      false
    );

    window.setTimeout(
      () => {
        this.setAionState("idle");
      },
      1100
    );
  },

  navigateToAdmission() {
    const route =
      window.FalcoAdmisionConfig
        .routes
        .admission;

    if (!route) {
      this.setAionState("idle");

      this.setButtonLoading(
        this.elements.startButton,
        false
      );

      console.error(
        "FALCO Admisión™: no se encontró la ruta de admisión."
      );

      return;
    }

    window.location.href = route;
  },

  /* =======================================================
     AION
  ======================================================= */

  activateAion() {
    if (!this.elements.aionPresence) {
      return;
    }

    this.setAionState("idle");

    window.setTimeout(
      () => {
        this.setAionState("attentive");
      },
      850
    );

    window.setTimeout(
      () => {
        this.setAionState("idle");
      },
      2100
    );
  },

  setAionState(state) {
    const presence =
      this.elements.aionPresence;

    if (!presence) {
      return;
    }

    const validStates = [
      "idle",
      "thinking",
      "speaking",
      "attentive"
    ];

    const nextState =
      validStates.includes(state)
        ? state
        : "idle";

    validStates.forEach(item => {
      presence.classList.remove(
        `is-${item}`
      );
    });

    presence.classList.add(
      `is-${nextState}`
    );

    presence.dataset.state =
      nextState;

    window.dispatchEvent(
      new CustomEvent(
        "falco-admision:aion-state-change",
        {
          detail: {
            state: nextState
          }
        }
      )
    );
  },

  setAionMessage(message) {
    if (
      !this.elements.aionMessage ||
      !message
    ) {
      return;
    }

    this.setAionState("speaking");

    this.elements.aionMessage
      .classList
      .remove("admision-animate-fade");

    void this.elements.aionMessage.offsetWidth;

    this.elements.aionMessage.textContent =
      message;

    this.elements.aionMessage
      .classList
      .add("admision-animate-fade");

    const speakingDuration =
      Math.min(
        3200,
        Math.max(
          1100,
          message.length * 24
        )
      );

    window.setTimeout(
      () => {
        const currentState =
          this.elements.aionPresence
            ?.dataset
            ?.state;

        if (currentState === "speaking") {
          this.setAionState("idle");
        }
      },
      speakingDuration
    );
  },

  /* =======================================================
     AVISO DE RESTAURACIÓN
  ======================================================= */

  showRestoreNotice() {
    if (this.elements.restoreNotice) {
      this.elements.restoreNotice.hidden =
        false;

      this.elements.restoreNotice
        .classList
        .remove("is-hidden");

      this.elements.restoreNotice
        .classList
        .add("admision-animate-up");

      return;
    }

    this.createRestoreNotice();
  },

  hideRestoreNotice() {
    if (!this.elements.restoreNotice) {
      return;
    }

    this.elements.restoreNotice.hidden =
      true;

    this.elements.restoreNotice
      .classList
      .add("is-hidden");
  },

  createRestoreNotice() {
    const actions =
      document.querySelector(
        ".admision-actions"
      );

    if (!actions) {
      return;
    }

    const notice =
      document.createElement("div");

    notice.id = "restoreNotice";
    notice.className =
      "admision-resume admision-card admision-animate-up";

    notice.setAttribute(
      "data-restore-notice",
      ""
    );

    notice.innerHTML = `
      <div class="admision-resume__content">
        <span class="admision-badge">
          <span class="admision-badge__dot"></span>
          Admisión guardada
        </span>

        <strong>
          Encontramos un recorrido anterior
        </strong>

        <p>
          Podés continuarlo desde el punto en el que quedó
          o iniciar uno nuevo.
        </p>
      </div>

      <div class="admision-resume__actions">
        <button
          id="continueAdmission"
          class="admision-button admision-button--secondary"
          type="button"
          data-action="continue-admission"
        >
          Continuar admisión
        </button>

        <button
          id="restartAdmission"
          class="admision-button admision-button--text"
          type="button"
          data-action="restart-admission"
        >
          Comenzar nuevamente
        </button>
      </div>
    `;

    actions.insertAdjacentElement(
      "afterend",
      notice
    );

    this.elements.restoreNotice =
      notice;

    this.elements.restoreButton =
      notice.querySelector(
        "[data-action='continue-admission']"
      );

    this.elements.restartButton =
      notice.querySelector(
        "[data-action='restart-admission']"
      );

    this.elements.restoreButton
      ?.addEventListener(
        "click",
        () => {
          this.continueAdmission();
        }
      );

    this.elements.restartButton
      ?.addEventListener(
        "click",
        () => {
          this.restartAdmission();
        }
      );
  },

  /* =======================================================
     BOTONES
  ======================================================= */

  setButtonLoading(button, loading) {
    if (!button) {
      return;
    }

    if (loading) {
      if (!button.dataset.originalHtml) {
        button.dataset.originalHtml =
          button.innerHTML;
      }

      button.disabled = true;
      button.classList.add("is-loading");

      button.innerHTML = `
        <span class="admision-loader">
          <span class="admision-loader__spinner"></span>
          Iniciando
        </span>
      `;

      return;
    }

    button.disabled = false;
    button.classList.remove("is-loading");

    if (button.dataset.originalHtml) {
      button.innerHTML =
        button.dataset.originalHtml;
    }
  },

  setButtonText(button, text) {
    if (!button || !text) {
      return;
    }

    const svg =
      button.querySelector("svg");

    button.textContent = text;

    if (svg) {
      button.appendChild(svg);
    }
  },

  /* =======================================================
     GUARDADO
  ======================================================= */

  handleStateSaved() {
    const savedIndicator =
      document.querySelector(
        "[data-save-indicator]"
      );

    if (!savedIndicator) {
      return;
    }

    savedIndicator.textContent =
      "Progreso guardado";

    savedIndicator.classList.add(
      "is-visible"
    );

    window.setTimeout(
      () => {
        savedIndicator.classList.remove(
          "is-visible"
        );
      },
      1600
    );
  },

  /* =======================================================
     UTILIDADES
  ======================================================= */

  log(message, data = null) {
    window.FalcoAdmisionConfig.log(
      `Core: ${message}`,
      data
    );
  }
};

/* =========================================================
   EXPORTACIÓN
========================================================= */

window.FalcoAdmisionCore =
  FalcoAdmisionCore;

console.log(
  "FALCO Admisión™ Core System v0.1 Ready"
);