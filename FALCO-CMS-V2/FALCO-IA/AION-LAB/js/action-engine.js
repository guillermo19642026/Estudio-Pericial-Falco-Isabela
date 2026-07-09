/* =========================================================
   AION Action Engine™ v1.0
   Coordina secuencias de comportamiento
========================================================= */

class ActionEngine {
  constructor({ lab, brain = null, memory = null }) {
    this.lab = lab;
    this.brain = brain;
    this.memory = memory;
    this.running = false;
  }

  async run(sequence = []) {
    if (this.running) return;

    this.running = true;

    for (const step of sequence) {
      await this.execute(step);
    }

    this.running = false;
  }

  async execute(step = {}) {
    const action = step.action || "wait";

    if (this.memory) {
      this.memory.rememberEvent("action:" + action, step);
    }

    if (action === "state") {
      this.lab.setState(step.state || "idle");
      return this.wait(step.duration || 800);
    }

    if (action === "read") {
      this.lab.setState("reading");
      return this.wait(step.duration || 1800);
    }

    if (action === "think") {
      this.lab.setState("thinking");
      return this.wait(step.duration || 2200);
    }

    if (action === "speak") {
      this.lab.setState("speaking");
      return this.wait(step.duration || 2400);
    }

    if (action === "notify") {
      this.lab.setState("success");
      return this.wait(step.duration || 1600);
    }

    if (action === "warning") {
      this.lab.setState("warning");
      return this.wait(step.duration || 1600);
    }

    if (action === "sleep") {
      this.lab.setState("sleep");
      return this.wait(step.duration || 1200);
    }

    return this.wait(step.duration || 800);
  }

  demoReadThinkSpeak() {
    return this.run([
      { action: "read", duration: 1600 },
      { action: "think", duration: 1800 },
      { action: "speak", duration: 2400 },
      { action: "state", state: "idle", duration: 600 }
    ]);
  }

  wait(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.ActionEngine = ActionEngine;