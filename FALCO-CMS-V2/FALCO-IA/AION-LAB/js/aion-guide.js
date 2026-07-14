/* =========================================================
   AION Guide™ v2.1
   Controlado por Interaction Manager™
   Integrado con AION Evaluation Guide™
========================================================= */

const AIONGuide = {

  container: null,
  messageBox: null,

  knowledge: null,
  interaction: null,

  initAttempts: 0,
  showTimer: null,

  init() {
    this.waitForFloat();
  },

  waitForFloat() {

    this.container =
      document.querySelector(
        ".aion-float"
      );

    if (!this.container) {

      this.initAttempts++;

      if (this.initAttempts < 40) {
        setTimeout(
          () => this.waitForFloat(),
          250
        );
      }

      return;
    }

    this.knowledge =
      window.KnowledgeEngine
        ? new KnowledgeEngine()
        : null;

    this.interaction =
      window.InteractionManager
        ? new InteractionManager({
            minDelay: 5000,
            cooldown: 30000
          })
        : null;

    this.createMessageBox();

    this.container.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        if (
          window.AIONPanel?.isReady()
        ) {
          const willOpen =
            !window.AIONPanel.isOpen();

          window.AIONPanel.toggle();

          if (willOpen) {
            this.speakEvaluationWelcome();
          }

          return;
        }

        this.showContextMessage();
      }
    );

    this.start();
  },

  start() {
    this.loop();
  },

  loop() {

    clearTimeout(
      this.showTimer
    );

    this.showTimer =
      setTimeout(
        () => {

          this.trySpeak();

          this.loop();

        },
        4000
      );
  },

  createMessageBox() {

    this.messageBox =
      document.createElement(
        "div"
      );

    this.messageBox.className =
      "aion-guide-message";

    this.container.appendChild(
      this.messageBox
    );
  },

  async trySpeak() {

    if (!this.interaction) {
      return;
    }

    const page =
      window.location.pathname;

    if (
      !this.interaction.canSpeak(page)
    ) {
      return;
    }

    this.showContextMessage();
  },

  async showContextMessage() {

    let text =
      "Estoy disponible si necesitás orientación.";

    if (this.knowledge) {

      const data =
        await this.knowledge
          .getCurrentPageKnowledge();

      if (data?.greeting) {
        text = data.greeting;
      }
    }

    if (this.messageBox) {
      this.messageBox.textContent =
        text;

      this.messageBox.classList.add(
        "is-visible"
      );
    }

    if (window.AionFloat) {

      AionFloat.setState(
        "speaking"
      );

      setTimeout(
        () => {
          AionFloat.setState(
            "idle"
          );
        },
        2200
      );
    }

    setTimeout(
      () => {
        this.hide();
      },
      7000
    );
  },

  speakEvaluationWelcome() {

    const text =
      "Hola. Estoy para orientarte durante tu evaluación. " +
      "Puedo indicarte cuál es el próximo paso y qué etapas todavía están pendientes.";

    if (this.messageBox) {

      this.messageBox.textContent =
        text;

      this.messageBox.classList.add(
        "is-visible"
      );
    }

    if (
      window.PresenceDirector &&
      typeof window.PresenceDirector.speak ===
        "function"
    ) {

      window.PresenceDirector.speak(
        text
      );

    } else if (
      window.AIONVoice &&
      typeof window.AIONVoice.speak ===
        "function"
    ) {

      window.AIONVoice.speak(
        text
      );

    } else if (
      "speechSynthesis" in window
    ) {

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      utterance.lang = "es-AR";
      utterance.rate = 0.95;
      utterance.pitch = 1;

      window.speechSynthesis.speak(
        utterance
      );
    }

    setTimeout(
      () => {
        this.hide();
      },
      8000
    );
  },

  hide() {

    this.messageBox
      ?.classList.remove(
        "is-visible"
      );
  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    AIONGuide.init();
  }
);