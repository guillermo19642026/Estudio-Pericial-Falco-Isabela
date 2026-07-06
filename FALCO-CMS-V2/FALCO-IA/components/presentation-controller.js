/* =========================
   FALCO PRESENTATION CONTROLLER®
========================= */

const FalcoPresentationController = {

  running: true,
  autoPlay: null,

  init() {

    this.start();

  },

  start() {

    this.stop();

    this.autoPlay = setInterval(() => {

      if (this.running) {
        FalcoActController.next();
      }

    }, 9000);

  },

  stop() {

    if (this.autoPlay) {
      clearInterval(this.autoPlay);
      this.autoPlay = null;
    }

  },

  pause() {

    this.running = false;

    this.stop();

  },

  resume() {

    this.running = true;

    this.start();

  }

};