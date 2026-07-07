/* =========================
   AION RENDERER ENGINE®
========================= */

const AionRenderer = {

  pulse: 0,
  mouseX: 0,
  mouseY: 0,

  init() {
    window.addEventListener("mousemove", (event) => {
      this.mouseX = (event.clientX - window.innerWidth / 2) * 0.018;
      this.mouseY = (event.clientY - window.innerHeight / 2) * 0.018;
    });
  },

  heartbeat() {
    const t = (Date.now() % 2200) / 2200;

    if (t < 0.08) {
      return Math.sin((t / 0.08) * Math.PI) * 0.55;
    }

    if (t > 0.18 && t < 0.27) {
      return Math.sin(((t - 0.18) / 0.09) * Math.PI) * 0.38;
    }

    return 0;
  },

  getExpansion() {
    const heart = this.heartbeat();
    return 1 + heart * 0.18 + this.pulse * 0.35;
  },

  getCoreRadius() {
    const heart = this.heartbeat();
    return 16 + heart * 15 + this.pulse * 12;
  },

  getMouseOffset() {
    return {
      x: this.mouseX,
      y: this.mouseY
    };
  },

  speak(strength = 1) {
    this.pulse = strength;
  },

  update() {
    if (this.pulse > 0) {
      this.pulse *= 0.92;
    }
  }

};