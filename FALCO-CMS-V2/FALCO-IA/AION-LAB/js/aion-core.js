/* =========================================================
   AION Core™ v1.2
   Orquestador central de motores + Observer
========================================================= */

class AIONCore {
  constructor() {
    this.identity = null;
    this.context = null;
    this.memory = null;
    this.presence = null;
    this.brain = null;
    this.actions = null;
    this.eyes = null;
    this.gestures = null;
    this.animation = null;
    this.perception = null;
    this.observer = null;
  }

  initBase() {
    this.memory = window.MemoryEngine ? new MemoryEngine() : null;
    this.context = window.ContextEngine ? new ContextEngine() : null;

    if (this.context) {
      this.context.detect();

      if (this.memory) {
        this.memory.write("context", this.context.context);
        this.memory.write("contextProfile", this.context.getProfile());
      }
    }

    this.identity = window.IdentityEngine
      ? new IdentityEngine(this.context)
      : null;

    if (this.memory && this.identity) {
      this.memory.write("identity", this.identity.get());
    }

    this.presence = window.PresenceEngine
      ? new PresenceEngine()
      : null;
  }

  initObserver() {
    this.observer = window.AIONObserver
      ? new AIONObserver({
          brain: this.brain,
          memory: this.memory,
          presence: this.presence
        })
      : null;

    if (this.observer) {
      this.observer.start();
    }
  }

  initLab(lab) {
    if (!lab) return null;

    this.initBase();



    this.gestures = window.GestureEngine
      ? new GestureEngine(lab.being)
      : null;

    this.eyes = window.EyeEngine
      ? new EyeEngine(lab.being, this.presence)
      : null;

    this.animation = window.AnimationEngine
      ? new AnimationEngine({
          being: lab.being,
          presence: this.presence,
          memory: this.memory
        })
      : null;

    this.brain = window.BrainEngine
      ? new BrainEngine({
          presence: this.presence,
          eyesEngine: this.eyes,
          gestures: this.gestures,
          memory: this.memory
        })
      : null;





    this.perception = window.PerceptionEngine && this.brain
      ? new PerceptionEngine(this.brain)
      : null;

    this.actions = window.ActionEngine
      ? new ActionEngine({
          lab,
          brain: this.brain,
          memory: this.memory
        })
      : null;

    this.initObserver();

this.bindPresenceDirector();


if (window.PresenceDirector) {
  PresenceDirector.register(this);
}



    return this;
  }

  initFloat(float) {
    if (!float) return null;

    this.initBase();

    this.gestures = window.GestureEngine
      ? new GestureEngine(float.being)
      : null;

    this.eyes = window.EyeEngine
      ? new EyeEngine(float.being, this.presence)
      : null;


this.animation = window.AnimationEngine
  ? new AnimationEngine({
      being: float.being,
      presence: this.presence,
      memory: this.memory
    })
  : null;



    this.brain = window.BrainEngine
      ? new BrainEngine({
          presence: this.presence,
          eyesEngine: this.eyes,
          gestures: this.gestures,
          memory: this.memory
        })
      : null;

    this.perception = window.PerceptionEngine && this.brain
      ? new PerceptionEngine(this.brain)
      : null;

   this.initObserver();

this.bindPresenceDirector();

if (window.PresenceDirector) {
    PresenceDirector.register(this);
}

return this;
  }


  bindPresenceDirector() {
    if (this.presenceDirectorBound) return;

    this.presenceDirectorBound = true;

    window.addEventListener("aion:presence", (event) => {
      const state = event.detail?.state || "idle";

      /*
       * Registrar el estado en la memoria
       */
      if (this.memory) {
        this.memory.write("lastPresenceState", state);
        this.memory.write(
          "lastPresenceStateAt",
          new Date().toISOString()
        );
      }

      /*
       * Informar al Presence Engine interno
       */
      if (
        this.presence &&
        typeof this.presence.setState === "function"
      ) {
        this.presence.setState(state);
      }

      /*
       * Informar al Brain Engine mediante un evento,
       * sin depender de métodos internos desconocidos.
       */
      window.dispatchEvent(
        new CustomEvent("aion:brain:presence", {
          detail: {
            state,
            source: "PresenceDirector"
          }
        })
      );

      /*
       * Señal común para ojos, gestos y animaciones.
       */
      window.dispatchEvent(
        new CustomEvent("aion:senses", {
          detail: {
            state,
            speaking: state === "speaking",
            thinking: state === "thinking",
            listening: state === "listening"
          }
        })
      );
    });

    console.log(
      "AION Core™ conectado con Presence Director™"
    );
  }




  readMemory() {
    return this.memory ? this.memory.read() : null;
  }

  getMood() {
    return this.presence ? this.presence.getMood() : null;
  }

  getIdentity() {
    return this.identity ? this.identity.get() : null;
  }

  getContext() {
    return this.context ? this.context.getProfile() : null;
  }

  runDemo() {
    if (this.actions) {
      return this.actions.demoReadThinkSpeak();
    }
  }
}

window.AIONCore = AIONCore;