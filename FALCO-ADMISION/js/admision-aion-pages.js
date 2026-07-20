/* =========================================================
   FALCO Admisión™
   AION Pages Card™ v1.0

   Contextos:
   - perfil.html
   - confirmacion.html
========================================================= */

const AdmisionAionPages = {

  float: null,
  card: null,
  closeButton: null,
  messageElement: null,
  contextElement: null,

  isOpen: false,
  context: "general",

  messages: {

    perfil: {
      context: "Antes de comenzar",

      initial:
        "Necesito saber quién realiza la consulta para mostrarle " +
        "el recorrido adecuado. Seleccione si consulta como persona " +
        "o como profesional.",

      persona:
        "Seleccionó la opción Soy una persona. " +
        "El recorrido estará orientado a una situación personal, " +
        "familiar, judicial o pericial.",

      profesional:
        "Seleccionó la opción Soy profesional. " +
        "El recorrido estará orientado a supervisión, asesoramiento, " +
        "revisión técnica o asistencia vinculada con una causa.",

      validation:
        "Para continuar, seleccione la opción que mejor represente " +
        "quién realiza la consulta."
    },

    confirmacion: {
      context: "Admisión completada",

      initial:
        "El recorrido inicial terminó correctamente. " +
        "La información fue registrada y será revisada por el Estudio. " +
        "La admisión no implica la aceptación automática del caso."
    },

    general: {
      context: "FALCO Admisión™",

      initial:
        "Voy a acompañarlo durante el recorrido de admisión."
    }

  },

  init() {

    this.detectContext();
    this.waitForAion();

  },

  detectContext() {

    const body =
      document.body;

    if (
      body.classList.contains(
        "admision-page--profile"
      )
    ) {

      this.context = "perfil";
      return;

    }

    if (
      body.classList.contains(
        "admision-page--confirmation"
      )
    ) {

      this.context = "confirmacion";
      return;

    }

    this.context = "general";

  },

  waitForAion(attempt = 0) {

    this.float =
      document.querySelector(
        ".aion-float"
      );

    if (!this.float) {

      if (attempt < 40) {

        window.setTimeout(
          () => {
            this.waitForAion(
              attempt + 1
            );
          },
          250
        );

      } else {

        console.warn(
          "FALCO Admisión™: no se encontró AION Float"
        );

      }

      return;

    }

    this.prepareFloat();
    this.createCard();
    this.bind();
    this.configureContext();

    console.log(
      `FALCO Admisión™ AION Pages v1.0 Ready · ${this.context}`
    );

  },

  prepareFloat() {

    this.float.setAttribute(
      "role",
      "button"
    );

    this.float.setAttribute(
      "tabindex",
      "0"
    );

    this.float.setAttribute(
      "aria-label",
      "Abrir orientación de AION"
    );

    this.float.setAttribute(
      "aria-expanded",
      "false"
    );

  },

  createCard() {

    const existing =
      document.querySelector(
        ".admision-aion-pages-card"
      );

    if (existing) {
      existing.remove();
    }

    const current =
      this.messages[this.context] ||
      this.messages.general;

    this.card =
      document.createElement(
        "section"
      );

    this.card.className =
      "admision-aion-card admision-aion-pages-card";

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
          data-aion-pages-context
        >
          ${current.context}
        </p>

        <p
          class="admision-aion-card__message"
          data-aion-pages-message
          aria-live="polite"
        >
          ${current.initial}
        </p>

      </div>

      <div class="admision-aion-card__footer">

        <span
          class="admision-aion-card__status-dot"
          aria-hidden="true"
        ></span>

        <span data-aion-pages-footer>
          Puede presionar AION cuando necesite orientación.
        </span>

      </div>
    `;

    document.body.appendChild(
      this.card
    );

    this.closeButton =
      this.card.querySelector(
        ".admision-aion-card__close"
      );

    this.messageElement =
      this.card.querySelector(
        "[data-aion-pages-message]"
      );

    this.contextElement =
      this.card.querySelector(
        "[data-aion-pages-context]"
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

    this.float.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();
          this.toggle();

        }

      }
    );

    this.closeButton.addEventListener(
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
          this.card.contains(
            event.target
          );

        const clickedFloat =
          this.float.contains(
            event.target
          );

        if (
          !clickedCard &&
          !clickedFloat
        ) {

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

  configureContext() {

    if (
      this.context === "perfil"
    ) {

      this.configureProfile();

    }

    if (
      this.context ===
      "confirmacion"
    ) {

      this.configureConfirmation();

    }

  },

  configureProfile() {

    const options =
      document.querySelectorAll(
        'input[name="profileType"]'
      );

    options.forEach((option) => {

      option.addEventListener(
        "change",
        () => {

          if (
            option.value === "persona"
          ) {

            this.setMessage(
              this.messages.perfil.context,
              this.messages.perfil.persona
            );

          }

          if (
            option.value ===
            "profesional"
          ) {

            this.setMessage(
              this.messages.perfil.context,
              this.messages.perfil.profesional
            );

          }

          this.setAionState(
            "attention"
          );

          if (this.isOpen) {
            this.speakCurrentMessage();
          }

        }
      );

    });

    const form =
      document.getElementById(
        "profileForm"
      );

    if (form) {

      form.addEventListener(
        "submit",
        () => {

          const selected =
            form.querySelector(
              'input[name="profileType"]:checked'
            );

          if (!selected) {

            this.setMessage(
              this.messages.perfil.context,
              this.messages.perfil.validation
            );

            this.open();

          }

        }
      );

    }

  },

  configureConfirmation() {

    const footer =
      this.card.querySelector(
        "[data-aion-pages-footer]"
      );

    if (footer) {

      footer.textContent =
        "El Estudio revisará la información antes de comunicarse.";

    }

    this.setAionState(
      "completed"
    );

  },

  setMessage(context, message) {

    if (this.contextElement) {

      this.contextElement.textContent =
        context;

    }

    if (this.messageElement) {

      this.messageElement.textContent =
        message;

    }

  },

  open() {

    this.isOpen = true;

    this.card.setAttribute(
      "aria-hidden",
      "false"
    );

    this.card.classList.add(
      "is-open"
    );

    this.float.setAttribute(
      "aria-expanded",
      "true"
    );

    this.setAionState(
      "speaking"
    );

    this.speakCurrentMessage();

  },

  close() {

    this.isOpen = false;

    const activeElement =
      document.activeElement;

    if (
      activeElement &&
      this.card.contains(
        activeElement
      )
    ) {

      activeElement.blur();

      this.float.focus({
        preventScroll: true
      });

    }

    this.card.classList.remove(
      "is-open"
    );

    this.card.setAttribute(
      "aria-hidden",
      "true"
    );

    this.float.setAttribute(
      "aria-expanded",
      "false"
    );

    this.stopSpeaking();

    if (
      this.context ===
      "confirmacion"
    ) {

      this.setAionState(
        "completed"
      );

    } else {

      this.setAionState(
        "idle"
      );

    }

  },

  toggle() {

    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }

  },

  speakCurrentMessage() {

    const message =
      this.messageElement
        ?.textContent
        ?.trim();

    if (!message) return;

    if (
      window.PresenceDirector &&
      typeof window.PresenceDirector.speak ===
        "function"
    ) {

      window.PresenceDirector.speak(
        message
      );

      return;

    }

    console.warn(
      "FALCO Admisión™: PresenceDirector.speak no está disponible"
    );

  },

  stopSpeaking() {

    if (
      window.speechSynthesis &&
      window.speechSynthesis.speaking
    ) {

      window.speechSynthesis.cancel();

    }

  },

  setAionState(state) {

    if (
      window.AionFloat &&
      typeof window.AionFloat.setState ===
        "function"
    ) {

      window.AionFloat.setState(
        state
      );

      return;

    }

    if (
      window.PresenceDirector &&
      typeof window.PresenceDirector.setState ===
        "function"
    ) {

      window.PresenceDirector.setState(
        state
      );

    }

  }

};

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      AdmisionAionPages.init();

    }
  );

} else {

  AdmisionAionPages.init();

}