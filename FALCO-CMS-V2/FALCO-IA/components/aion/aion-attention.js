/* =========================================================
   AION ATTENTION™ v6.1
   Sistema FALCO®
   Atención contextual no invasiva
========================================================= */

(function () {
  class AionAttention {
    constructor(engine) {
      this.engine = engine;

      this.lastActivityAt = Date.now();
      this.lastSuggestionAt = 0;

      this.idleDelay = 45000;
      this.suggestionCooldown = 120000;

      this.timer = null;
      this.enabled = true;
    }

    init() {
      this.bindActivity();
      this.start();
    }

    bindActivity() {
      const registerActivity = () => {
        this.lastActivityAt = Date.now();
      };

      window.addEventListener("mousemove", registerActivity);
      window.addEventListener("keydown", registerActivity);
      window.addEventListener("click", registerActivity);
      window.addEventListener("scroll", registerActivity);
    }

    start() {
      clearInterval(this.timer);

      this.timer = window.setInterval(() => {
        this.check();
      }, 5000);
    }

    check() {
      if (!this.enabled || !this.engine) return;

      const now = Date.now();
      const idleFor = now - this.lastActivityAt;
      const sinceSuggestion = now - this.lastSuggestionAt;

      if (idleFor < this.idleDelay) return;
      if (sinceSuggestion < this.suggestionCooldown) return;

      this.suggest();
    }

    suggest() {
      const context = this.engine.currentContext || "default";

      const messages = {
        corpus: {
          title: "AION",
          message: "Puedo ayudarle a explorar recursos relacionados dentro del Corpus FALCO®."
        },
        biblioteca: {
          title: "Biblioteca FALCO®",
          message: "Puedo orientarle para encontrar materiales profesionales relacionados."
        },
        pericial: {
          title: "AION Pericial",
          message: "Puedo acompañar la lectura técnica o sugerir recursos vinculados."
        },
        escuela: {
          title: "AION Tutor",
          message: "Puedo ayudar a continuar el recorrido formativo."
        },
        centro: {
          title: "Centro FALCO®",
          message: "Puedo guiarle dentro de los módulos disponibles."
        },
        default: {
          title: "AION",
          message: "Estoy disponible para acompañar la navegación si lo necesita."
        }
      };

      const selected = messages[context] || messages.default;

      this.engine.say(selected.title, selected.message, {
        state: this.engine.state,
        behavior: "guiding",
        wave: true,
        voice: false,
        force: false
      });

      this.lastSuggestionAt = Date.now();

      this.remember();
    }

    remember() {
      if (!this.engine.memory) return;

      this.engine.memory.write({
        attentionLastSuggestionAt: new Date(this.lastSuggestionAt).toISOString()
      });
    }

    pause() {
      this.enabled = false;
    }

    resume() {
      this.enabled = true;
      this.lastActivityAt = Date.now();
    }

    setIdleDelay(ms = 45000) {
      this.idleDelay = ms;
    }

    setSuggestionCooldown(ms = 120000) {
      this.suggestionCooldown = ms;
    }
  }

  window.AionAttention = AionAttention;
})();