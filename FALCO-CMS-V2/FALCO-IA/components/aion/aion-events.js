/* =========================================================
   AION EVENTS™ v1.9
   Sistema FALCO®
   Eventos de usuario + inactividad
========================================================= */

class AionEvents {
  constructor(engine) {
    this.engine = engine;
    this.idleTimer = null;
  }

  init() {
    this.bindClick();
    this.bindActivity();
  }

  bindClick() {
    if (!this.engine || !this.engine.container) return;

    const orb = this.engine.container.querySelector(".aion-orb-wrapper");
    if (!orb) return;

    orb.addEventListener("click", () => {
      this.engine.emitEnergyWave();

      if (this.engine.behavior) {
        this.engine.behavior.process();
      }

      const sequence = ["gold", "blue", "green", "violet", "white"];
      const currentIndex = sequence.indexOf(this.engine.state);
      const nextState = sequence[(currentIndex + 1) % sequence.length];

      this.engine.setState(nextState);

      window.setTimeout(() => {
        if (this.engine.behavior) {
          this.engine.behavior.guide();
        }
      }, 1400);
    });
  }

  bindActivity() {
    const activateListening = () => {
      if (this.engine.behavior) {
        this.engine.behavior.listen();
      }

      clearTimeout(this.idleTimer);

      this.idleTimer = window.setTimeout(() => {
        if (this.engine.behavior) {
          this.engine.behavior.idle();
        }
      }, 6000);
    };

    window.addEventListener("mousemove", activateListening);
    window.addEventListener("keydown", activateListening);
  }
}

window.AionEvents = AionEvents;