/* =========================================================
   AION EVENTS™ v3.8
   Sistema FALCO®
   Eventos de usuario + eventos DOM del ecosistema
========================================================= */

class AionEvents {
  constructor(engine) {
    this.engine = engine;
    this.idleTimer = null;
  }

  init() {
    this.bindClick();
    this.bindActivity();
    this.bindSystemDomEvents();
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

  bindSystemDomEvents() {
    window.addEventListener("aion:emit", (event) => {
      const eventName = event.detail?.eventName;
      const payload = event.detail?.payload || {};

      if (!eventName) return;

      this.engine.emit(eventName, payload);
    });




    window.addEventListener("aion:run", (event) => {
      const workflowName = event.detail?.workflowName;
      const payload = event.detail?.payload || {};

      if (!workflowName) return;

      this.engine.run(workflowName, payload);
    });


window.addEventListener("aion:action", (event) => {
  const actionName = event.detail?.actionName;
  const payload = event.detail?.payload || {};

  if (!actionName) return;

  this.engine.action(actionName, payload);
});


    window.addEventListener("aion:say", (event) => {
      const title = event.detail?.title || "AION";
      const message = event.detail?.message || "Sistema FALCO® activo.";
      const options = event.detail?.options || {};

      this.engine.say(title, message, options);
    });

    window.addEventListener("aion:pulse", (event) => {
      const options = event.detail || {};

      this.engine.pulse(options);
    });
  }
}

window.AionEvents = AionEvents;