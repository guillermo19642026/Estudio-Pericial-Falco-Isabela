/* =========================================================
   AION Observer™ v1.0
   Observa navegación básica del usuario
========================================================= */

class AIONObserver {
  constructor({ brain = null, memory = null, presence = null } = {}) {
    this.brain = brain;
    this.memory = memory;
    this.presence = presence;

    this.started = false;
    this.lastScrollY = 0;
    this.maxScrollPercent = 0;
    this.section = "top";

    this.scrollTimer = null;
  }

  start() {
    if (this.started) return;
    this.started = true;

    this.observeScroll();
    this.observeTime();

    this.remember("observer:start", {
      path: window.location.pathname,
      title: document.title
    });

this.detectPageContext();


  }

  observeScroll() {
    window.addEventListener("scroll", () => {
      clearTimeout(this.scrollTimer);

      this.scrollTimer = setTimeout(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const percent = height > 0 ? Math.round((scrollTop / height) * 100) : 0;

        this.maxScrollPercent = Math.max(this.maxScrollPercent, percent);

        let section = "top";
        if (percent > 70) section = "bottom";
        else if (percent > 35) section = "middle";

        if (section !== this.section) {
          this.section = section;

          this.remember("observer:section", {
            section,
            percent
          });

          if (this.presence) {
            this.presence.nudge({
              presence: .01,
              curiosity: .01,
              attention: .015
            });
          }
        }
      }, 180);
    });
  }

  observeTime() {
    setTimeout(() => {
      this.remember("observer:reading", {
        seconds: 18,
        section: this.section
      });

      if (this.brain) {
        this.brain.handle("reading:start", {
          section: this.section
        });
      }
    }, 18000);
  }


detectPageContext() {
  const path = window.location.pathname.toLowerCase();
  const title = document.title || "";

  let topic = "general";

  if (path.includes("pericia-psicologica")) {
    topic = "pericia_psicologica";
  }

  if (path.includes("danio-psiquico") || path.includes("daño-psiquico")) {
    topic = "danio_psiquico";
  }

  if (path.includes("honorarios")) {
    topic = "honorarios";
  }

  this.remember("observer:page-context", {
    topic,
    path,
    title
  });

  if (this.presence) {
    this.presence.nudge({
      presence: .01,
      curiosity: .015,
      attention: .01
    });
  }
}


  remember(eventName, payload = {}) {
    if (this.memory) {
      this.memory.rememberEvent(eventName, payload);
    }
  }
}

window.AIONObserver = AIONObserver;