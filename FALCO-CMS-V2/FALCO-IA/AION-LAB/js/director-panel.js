/* =========================================================
   AION Director Panel™ v1.0
   Controles del laboratorio
========================================================= */

class DirectorPanel {
  constructor({ being, eyesEngine }) {
    this.being = being;
    this.eyesEngine = eyesEngine;
  }

  init() {
    this.bindBreath();
    this.bindGlow();
    this.bindEyes();
    this.bindHalo();
  }

  bindBreath() {
    const input = document.getElementById("breathRange");
    const value = document.getElementById("breathValue");

    if (!input || !this.being) return;

    input.addEventListener("input", () => {
      this.being.style.setProperty("--breath-speed", `${input.value}s`);
      if (value) value.textContent = `${input.value}s`;
    });
  }

  bindGlow() {
    const input = document.getElementById("glowRange");
    const value = document.getElementById("glowValue");

    if (!input || !this.being) return;

    input.addEventListener("input", () => {
      this.being.style.setProperty("--glow-strength", input.value);
      if (value) value.textContent = Number(input.value).toFixed(2);
    });
  }

  bindEyes() {
    const input = document.getElementById("eyeRange");
    const value = document.getElementById("eyeValue");

    if (!input || !this.eyesEngine) return;

    input.addEventListener("input", () => {
      const sensitivity = Number(input.value);
      this.eyesEngine.setSensitivity(sensitivity);
      if (value) value.textContent = sensitivity.toFixed(2);
    });
  }

  bindHalo() {
    const input = document.getElementById("haloRange");
    const value = document.getElementById("haloValue");

    if (!input || !this.being) return;

    input.addEventListener("input", () => {
      this.being.style.setProperty("--halo-speed", `${input.value}s`);
      if (value) value.textContent = `${input.value}s`;
    });
  }
}

window.DirectorPanel = DirectorPanel;