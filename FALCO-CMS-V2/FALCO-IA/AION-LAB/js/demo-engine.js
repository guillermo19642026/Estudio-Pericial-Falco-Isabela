/* =========================================================
   AION Demo Engine™ v1.1
   Secuencia de presentación + auto intro
========================================================= */

class DemoEngine {
  constructor(lab) {
    this.lab = lab;
    this.running = false;
    this.timers = [];
  }

  autoStart(delay = 1800) {
    const timer = window.setTimeout(() => {
      this.start();
    }, delay);

    this.timers.push(timer);
  }

  start() {
    if (!this.lab || this.running) return;

    this.running = true;
    this.clear();

    const sequence = [
      { time: 0, state: "idle" },
      { time: 1600, state: "listening" },
      { time: 3400, state: "thinking" },
      { time: 5600, state: "reading" },
      { time: 8000, state: "speaking" },
      { time: 10500, state: "success" },
      { time: 12800, state: "sleep" },
      { time: 15000, state: "idle" }
    ];

    sequence.forEach((step) => {
      const timer = window.setTimeout(() => {
        this.lab.setState(step.state);
      }, step.time);

      this.timers.push(timer);
    });

    const endTimer = window.setTimeout(() => {
      this.running = false;
    }, 15600);

    this.timers.push(endTimer);
  }

  stop() {
    this.clear();
    this.running = false;
    this.lab.setState("idle");
  }

  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }
}

window.DemoEngine = DemoEngine;