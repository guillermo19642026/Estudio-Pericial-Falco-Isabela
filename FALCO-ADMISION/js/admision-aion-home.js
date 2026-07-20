/* =========================================================
   FALCO Admisión™
   AION Home Card™ v2.0
========================================================= */

const AdmisionAionHome = {

  float: null,
  card: null,
  message: null,

  isOpen: false,

  welcomeText:
    "Bienvenido a FALCO Admisión. " +
    "Voy a acompañarlo durante este recorrido. " +
    "Cuando esté listo, presione Iniciar mi consulta.",

  init() {

    this.waitForFloat();

  },

  waitForFloat(attempt = 0) {

    this.float =
      document.querySelector(".aion-float");

    if (!this.float) {

      if (attempt < 40) {

        setTimeout(() => {

          this.waitForFloat(attempt + 1);

        },250);

      }

      return;

    }

    this.createCard();

    this.bind();

    console.log(
      "FALCO Admisión™ AION Home Card v2.0 Ready"
    );

  },

  createCard() {

    this.card =
      document.createElement("section");

    this.card.className =
      "admision-aion-card";

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

          <strong>

            AION

          </strong>

        </div>

        <button
          class="admision-aion-card__close"
          type="button"
        >
          ×
        </button>

      </div>

      <div class="admision-aion-card__body">

        <p class="admision-aion-card__context">

          Recepción del Estudio

        </p>

        <p
          class="admision-aion-card__message"
        >

          ${this.welcomeText}

        </p>

      </div>

      <div class="admision-aion-card__footer">

        Presione
        <strong>Iniciar mi consulta</strong>
        para comenzar.

      </div>

    `;

    document.body.appendChild(
      this.card
    );

    this.message =
      this.card.querySelector(
        ".admision-aion-card__message"
      );

  },

  bind() {

    this.float.addEventListener(

      "click",

      () => {

        this.toggle();

      }

    );

    this.card
      .querySelector(
        ".admision-aion-card__close"
      )
      .addEventListener(

        "click",

        () => {

          this.close();

        }

      );

  },

  toggle() {

    if (this.isOpen) {

      this.close();

    } else {

      this.open();

    }

  },

  open() {

    this.isOpen = true;

    this.card.classList.add(
      "is-open"
    );

    this.card.setAttribute(
      "aria-hidden",
      "false"
    );

    if (
      window.AionFloat &&
      typeof AionFloat.setState ===
        "function"
    ) {

      AionFloat.setState(
        "speaking"
      );

    }

    if (
      window.PresenceDirector &&
      typeof PresenceDirector.speak ===
        "function"
    ) {

      PresenceDirector.speak(
        this.welcomeText
      );

    }

  },

  close() {

    this.isOpen = false;

    if (
      document.activeElement &&
      this.card.contains(
        document.activeElement
      )
    ) {

      document.activeElement.blur();

      this.float.focus({
        preventScroll:true
      });

    }

    this.card.classList.remove(
      "is-open"
    );

    this.card.setAttribute(
      "aria-hidden",
      "true"
    );

    if (
      window.AionFloat &&
      typeof AionFloat.setState ===
        "function"
    ) {

      AionFloat.setState(
        "idle"
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

      AdmisionAionHome.init();

    }

  );

} else {

  AdmisionAionHome.init();

}