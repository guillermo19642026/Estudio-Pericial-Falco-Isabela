/* =========================================================
   FALCO Admisión™
   Profile Selection Controller v1.0
========================================================= */

(() => {
  "use strict";

  const ProfileController = {
    form: null,
    options: [],
    validation: null,
    continueButton: null,
    aionLabel: null,
    aionMessage: null,
    liveRegion: null,

    selectedProfile: null,

    init() {
      this.cacheElements();
      this.restoreSelection();
      this.bindEvents();
    },

    cacheElements() {
      this.form =
        document.getElementById(
          "profileForm"
        );

      this.options = [
        ...document.querySelectorAll(
          'input[name="profileType"]'
        )
      ];

      this.validation =
        document.getElementById(
          "profileValidation"
        );

      this.continueButton =
        document.getElementById(
          "continueProfileButton"
        );

      this.aionLabel =
        document.getElementById(
          "aionStateLabel"
        );

      this.aionMessage =
        document.getElementById(
          "aionMessage"
        );

      this.liveRegion =
        document.getElementById(
          "profileLiveRegion"
        );
    },

    restoreSelection() {
      const storedProfile =
        localStorage.getItem(
          "falco_admision_tipo_usuario"
        );

      if (
        storedProfile !== "persona" &&
        storedProfile !== "profesional"
      ) {
        return;
      }

      const input =
        this.options.find(
          (option) =>
            option.value ===
            storedProfile
        );

      if (!input) {
        return;
      }

      input.checked = true;
      this.selectedProfile =
        storedProfile;

      this.updateAionMessage(
        storedProfile,
        false
      );
    },

    bindEvents() {
      this.options.forEach(
        (option) => {
          option.addEventListener(
            "change",
            () =>
              this.selectProfile(
                option.value
              )
          );
        }
      );

      this.form?.addEventListener(
        "submit",
        (event) =>
          this.handleSubmit(event)
      );
    },

    selectProfile(profile) {
      this.selectedProfile =
        profile;

      this.hideValidation();

      this.updateAionMessage(
        profile,
        true
      );

      this.announce(
        profile === "profesional"
          ? "Perfil profesional seleccionado."
          : "Perfil persona seleccionado."
      );
    },

    updateAionMessage(
      profile,
      animate = true
    ) {
      const guide =
        this.aionMessage?.closest(
          ".aion-guide"
        );

      if (
        profile === "profesional"
      ) {
        this.setText(
          this.aionLabel,
          "Recorrido profesional"
        );

        this.setText(
          this.aionMessage,
          "Voy a conocer el tipo de asistencia profesional que necesitás."
        );
      } else {
        this.setText(
          this.aionLabel,
          "Consulta personal"
        );

        this.setText(
          this.aionMessage,
          "Voy a realizarte algunas preguntas para comprender tu situación."
        );
      }

      if (
        animate &&
        guide
      ) {
        guide.classList.remove(
          "is-updating"
        );

        requestAnimationFrame(() => {
          guide.classList.add(
            "is-updating"
          );
        });
      }
    },

    handleSubmit(event) {
      event.preventDefault();

      const selected =
        this.form?.querySelector(
          'input[name="profileType"]:checked'
        );

      if (!selected) {
        this.showValidation();
        return;
      }

      const profile =
        selected.value;

      if (
        profile !== "persona" &&
        profile !== "profesional"
      ) {
        this.showValidation();
        return;
      }

      this.prepareNewProfile(
        profile
      );

      this.continueButton.disabled =
        true;

      this.continueButton.textContent =
        "Preparando recorrido…";

      this.setText(
        this.aionLabel,
        "AION está preparando el recorrido"
      );

      this.setText(
        this.aionMessage,
        profile === "profesional"
          ? "Estoy organizando las preguntas para tu consulta profesional."
          : "Estoy organizando las preguntas para conocer tu consulta."
      );

      window.setTimeout(() => {
        window.location.href =
          `admision.html?tipo=${encodeURIComponent(
            profile
          )}`;
      }, 350);
    },

    prepareNewProfile(profile) {
      const previousProfile =
        localStorage.getItem(
          "falco_admision_tipo_usuario"
        );

      localStorage.setItem(
        "falco_admision_tipo_usuario",
        profile
      );

      /*
       * Si se cambia de tipo de perfil, se elimina
       * el cuestionario anterior para evitar mezclar
       * respuestas de personas y profesionales.
       */

      if (
        previousProfile &&
        previousProfile !== profile
      ) {
        this.clearAdmissionProgress();
      }
    },

    clearAdmissionProgress() {
      [
        "falco_admision_state",
        "falcoAdmisionState",
        "falco-admision-state",
        "falco_admision_pending"
      ].forEach((key) => {
        localStorage.removeItem(key);
      });
    },

    showValidation() {
      if (this.validation) {
        this.validation.hidden =
          false;

        this.validation.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      this.setText(
        this.aionLabel,
        "Revisemos esta etapa"
      );

      this.setText(
        this.aionMessage,
        "Antes de continuar, seleccioná si la consulta la realiza una persona o un profesional."
      );

      this.announce(
        "Seleccioná una opción para continuar."
      );

      this.options[0]?.focus();
    },

    hideValidation() {
      if (this.validation) {
        this.validation.hidden =
          true;
      }
    },

    announce(message) {
      if (!this.liveRegion) {
        return;
      }

      this.liveRegion.textContent =
        "";

      window.setTimeout(() => {
        this.liveRegion.textContent =
          message;
      }, 30);
    },

    setText(element, value) {
      if (element) {
        element.textContent =
          value ?? "";
      }
    }
  };

  const boot = () => {
    ProfileController.init();
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {
        once: true
      }
    );
  } else {
    boot();
  }

  window.FalcoAdmisionProfile =
    ProfileController;
})();