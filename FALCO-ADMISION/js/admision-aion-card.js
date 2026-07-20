/* =========================================================
   FALCO Admisión™ — AION Card v1.0
   Tarjeta contextual propia del recorrido de admisión
========================================================= */

const AdmisionAionCard = {

  card: null,
  float: null,
  messageElement: null,
  titleElement: null,
  isOpen: false,
  observer: null,

  init() {
    this.waitForAion();
  },

  waitForAion(attempt = 0) {
    this.float = document.querySelector(".aion-float");

    if (!this.float) {
      if (attempt < 40) {
        window.setTimeout(() => {
          this.waitForAion(attempt + 1);
        }, 250);
      }

      return;
    }

    this.createCard();
    this.bind();
    this.observeAdmission();
    this.updateFromCurrentQuestion();

    console.log(
      "FALCO Admisión™ AION Card v1.0 Ready"
    );
  },

  createCard() {
    const existing = document.querySelector(
      ".admision-aion-card"
    );

    if (existing) {
      existing.remove();
    }

    this.card = document.createElement("section");

    this.card.className = "admision-aion-card";
    this.card.setAttribute(
      "aria-label",
      "Orientación de AION"
    );

    this.card.setAttribute(
      "aria-hidden",
      "true"
    );

    this.card.innerHTML = `
      <div class="admision-aion-card__header">

        <div>
          <span class="admision-aion-card__eyebrow">
            FALCO Admisión™
          </span>

          <strong class="admision-aion-card__title">
            AION
          </strong>
        </div>

        <button
          type="button"
          class="admision-aion-card__close"
          aria-label="Cerrar orientación de AION"
        >
          ×
        </button>

      </div>

      <div class="admision-aion-card__body">

        <p
          class="admision-aion-card__context"
          data-admision-aion-context
        >
          Recorrido de admisión
        </p>

        <p
          class="admision-aion-card__message"
          data-admision-aion-message
          aria-live="polite"
        >
          Voy a acompañarte durante todo el recorrido.
        </p>

      </div>

      <div class="admision-aion-card__footer">

        <span
          class="admision-aion-card__status-dot"
          aria-hidden="true"
        ></span>

        <span>
          Respondé con tranquilidad. No necesitás utilizar términos técnicos.
        </span>

      </div>
    `;

    document.body.appendChild(this.card);

    this.messageElement =
      this.card.querySelector(
        "[data-admision-aion-message]"
      );

    this.titleElement =
      this.card.querySelector(
        "[data-admision-aion-context]"
      );
  },

  bind() {
    this.float.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();

        this.toggle();
      }
    );

    const closeButton =
      this.card.querySelector(
        ".admision-aion-card__close"
      );

    closeButton.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();

        this.close();
      }
    );

    document.addEventListener(
      "click",
      (event) => {
        if (!this.isOpen) return;

        const clickedCard =
          this.card.contains(event.target);

        const clickedFloat =
          this.float.contains(event.target);

        if (!clickedCard && !clickedFloat) {
          this.close();
        }
      }
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          this.isOpen
        ) {
          this.close();
        }
      }
    );
  },

 open() {

  this.isOpen = true;

  this.card.setAttribute(
    "aria-hidden",
    "false"
  );

  this.card.classList.add("is-open");

  if (
    typeof AionFloat !== "undefined" &&
    typeof AionFloat.setState === "function"
  ) {
    AionFloat.setState("speaking");
  }

  this.speakCurrentMessage();

},





close() {
  this.isOpen = false;

  /*
   * Si algún elemento de la tarjeta conserva el foco,
   * lo devolvemos a AION antes de ocultarla.
   */
  const activeElement = document.activeElement;

  if (
    activeElement &&
    this.card.contains(activeElement)
  ) {
    activeElement.blur();

    if (
      this.float &&
      typeof this.float.focus === "function"
    ) {
      this.float.setAttribute("tabindex", "0");
      this.float.focus({
        preventScroll: true
      });
    }
  }

  this.card.classList.remove("is-open");

  this.card.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    typeof AionFloat !== "undefined" &&
    typeof AionFloat.setState === "function" &&
    !AionFloat.isSpeaking()
  ) {
    AionFloat.setState("idle");
  }
},

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.updateFromCurrentQuestion();
      this.open();
    }
  },

  observeAdmission() {
    const questionContainer =
      document.querySelector(
        "[data-question-container]"
      );

    const validationContainer =
      document.querySelector(
        "[data-validation-message]"
      );

    const reviewContainer =
      document.querySelector(
        "[data-review-container]"
      );

    this.observer = new MutationObserver(
      () => {
        window.requestAnimationFrame(() => {
          this.updateFromCurrentQuestion();
        });
      }
    );

    if (questionContainer) {
      this.observer.observe(
        questionContainer,
        {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true
        }
      );
    }

    if (validationContainer) {
      this.observer.observe(
        validationContainer,
        {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true
        }
      );
    }

    if (reviewContainer) {
      this.observer.observe(
        reviewContainer,
        {
          childList: true,
          subtree: true,
          attributes: true
        }
      );
    }
  },

  updateFromCurrentQuestion() {
    const reviewContainer =
      document.querySelector(
        "[data-review-container]"
      );

    const reviewVisible =
      reviewContainer &&
      !reviewContainer.hidden;

    if (reviewVisible) {
      this.setMessage(
        "Revisión final",
        "Revisá cuidadosamente la información ingresada. Podés volver y modificar cualquier respuesta antes de enviarla."
      );

      return;
    }

    const questionContainer =
      document.querySelector(
        "[data-question-container]"
      );

    if (
      !questionContainer ||
      questionContainer.hidden
    ) {
      return;
    }

    const section =
      document.querySelector(
        "[data-question-section]"
      )?.textContent?.trim();

    const title =
      document.querySelector(
        "[data-question-title]"
      )?.textContent?.trim();

    const description =
      document.querySelector(
        "[data-question-description]"
      )?.textContent?.trim();

    const validation =
      document.querySelector(
        "[data-validation-message]"
      );

    const validationVisible =
      validation &&
      !validation.hidden;

    if (validationVisible) {
      const validationText =
        document.querySelector(
          "[data-validation-text]"
        )?.textContent?.trim();

      this.setMessage(
        section || "Orientación",
        validationText ||
          "Completá la respuesta solicitada para poder continuar."
      );

      this.setVisualState("warning");

      return;
    }

    const message =
      description ||
      this.buildMessageFromTitle(title);

    this.setMessage(
      section || "Recorrido de admisión",
      message
    );

    this.setVisualState("idle");
  },

  buildMessageFromTitle(title = "") {
    if (!title) {
      return "Respondé con tranquilidad. Tu progreso se guarda automáticamente.";
    }

    return `En esta etapa necesitamos conocer: ${title}`;
  },

  setMessage(context, message) {
    if (this.titleElement) {
      this.titleElement.textContent =
        context || "Recorrido de admisión";
    }

    if (this.messageElement) {
      this.messageElement.textContent =
        message ||
        "Voy a acompañarte durante todo el recorrido.";
    }
  },

speakCurrentMessage() {

  const message =
    this.messageElement?.textContent?.trim();

  if (!message) return;

  if (
    window.PresenceDirector &&
    typeof PresenceDirector.speak === "function"
  ) {

    PresenceDirector.speak(message);

    return;

  }

  console.warn(
    "PresenceDirector.speak no disponible"
  );

},



  setVisualState(state = "idle") {
    if (
      typeof AionFloat === "undefined" ||
      typeof AionFloat.setState !== "function"
    ) {
      return;
    }

    if (
      typeof AionFloat.isSpeaking === "function" &&
      AionFloat.isSpeaking()
    ) {
      return;
    }

    AionFloat.setState(state);
  }
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      AdmisionAionCard.init();
    }
  );
} else {
  AdmisionAionCard.init();
}