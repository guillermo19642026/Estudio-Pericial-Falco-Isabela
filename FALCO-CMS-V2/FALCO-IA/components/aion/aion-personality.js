/* =========================================================
   AION PERSONALITY™ v5.6
   Sistema FALCO®
   Identidad institucional de intervención
========================================================= */

(function () {
  class AionPersonality {
    constructor(engine) {
      this.engine = engine;

      this.profile = "institutional";

      this.profiles = {
        institutional: {
          name: "Institucional",
          voiceAllowed: true,
          speakOnlyHighPriority: true,
          defaultTone: "sereno",
          interventionStyle: "sobrio"
        },

        professional: {
          name: "Profesional",
          voiceAllowed: true,
          speakOnlyHighPriority: true,
          defaultTone: "técnico",
          interventionStyle: "preciso"
        },

        tutor: {
          name: "Tutor",
          voiceAllowed: true,
          speakOnlyHighPriority: false,
          defaultTone: "cálido",
          interventionStyle: "acompañante"
        },

        pericial: {
          name: "Pericial",
          voiceAllowed: true,
          speakOnlyHighPriority: true,
          defaultTone: "formal",
          interventionStyle: "científico"
        }
      };
    }

    setProfile(profile = "institutional") {
      if (!this.profiles[profile]) {
        profile = "institutional";
      }

      this.profile = profile;

      if (this.engine?.container) {
        this.engine.container.dataset.personality = profile;
      }

      this.remember();
    }

    getProfile() {
      return this.profiles[this.profile] || this.profiles.institutional;
    }

    shapeDecision(decision = {}) {
      const profile = this.getProfile();

      const priority = decision.priority || "medium";

      const shouldSpeak =
        decision.voice === true &&
        profile.voiceAllowed &&
        (
          profile.speakOnlyHighPriority === false ||
          priority === "high" ||
          priority === "critical"
        );

      return {
        ...decision,
        voice: shouldSpeak,
        tone: profile.defaultTone,
        style: profile.interventionStyle,
        personality: this.profile
      };
    }

    remember() {
      if (!this.engine?.memory) return;

      this.engine.memory.write({
        personality: this.profile,
        personalityName: this.getProfile().name
      });
    }
  }

  window.AionPersonality = AionPersonality;
})();