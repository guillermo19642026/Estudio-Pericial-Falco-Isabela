/* =========================
   AION FALCO® GUIDE
========================= */

const AionGuide = {
  overlay: null,
  canvas: null,
  ctx: null,
  particles: [],
  animation: null,
  pulse: 0,
  state: "gold",
  companionCreated: false,

  init() {
    this.overlay = document.getElementById("aionGuide");
    this.canvas = document.getElementById("aionCanvas");

    if (!this.overlay || !this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());

    this.createParticles();
    this.start();
    this.createDevPanel();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    this.particles = [];

    const bodyMap = [];

    for (let i = 0; i < 160; i++) {
      let x = 0;
      let y = 0;

      if (i < 35) {
        const a = Math.random() * Math.PI * 2;
        x = Math.cos(a) * (24 + Math.random() * 12);
        y = -130 + Math.sin(a) * (32 + Math.random() * 8);
      } else if (i < 95) {
        x = (Math.random() - 0.5) * (70 - Math.abs(i - 65) * 0.45);
        y = -75 + Math.random() * 120;
      } else if (i < 125) {
        x = -45 - Math.random() * 45;
        y = -45 + Math.random() * 95;
      } else {
        x = 45 + Math.random() * 45;
        y = -45 + Math.random() * 95;
      }

      bodyMap.push({
        baseX: x,
        baseY: y,
        angle: Math.random() * Math.PI * 2,
        orbit: Math.random() * 18 + 4,
        speed: Math.random() * 0.006 + 0.002,
        size: Math.random() * 1.7 + 0.8,
        pulse: Math.random() * Math.PI * 2
      });
    }

    this.particles = bodyMap;
  },

  speakPulse(strength = 1) {
    this.pulse = strength;
  },

  setState(state = "gold") {
    this.state = state;

    const companion = document.querySelector(".aion-companion");

    if (companion) {
      companion.setAttribute("data-state", state);
    }
  },

  getColors() {
    const colors = {
      gold: {
        core: "rgba(212,175,55,.96)",
        particle: "rgba(212,175,55,.82)",
        glow: "rgba(212,175,55,"
      },
      blue: {
        core: "rgba(90,170,255,.96)",
        particle: "rgba(90,170,255,.82)",
        glow: "rgba(90,170,255,"
      },
      green: {
        core: "rgba(90,255,170,.96)",
        particle: "rgba(90,255,170,.82)",
        glow: "rgba(90,255,170,"
      },
      violet: {
        core: "rgba(190,120,255,.96)",
        particle: "rgba(190,120,255,.82)",
        glow: "rgba(190,120,255,"
      },
      white: {
        core: "rgba(255,250,235,.98)",
        particle: "rgba(255,250,235,.90)",
        glow: "rgba(255,250,235,"
      }
    };

    return colors[this.state] || colors.gold;
  },

  heartbeat() {
    const t = (Date.now() % 2200) / 2200;

    if (t < 0.08) return Math.sin((t / 0.08) * Math.PI) * 0.55;
    if (t > 0.18 && t < 0.27) {
      return Math.sin(((t - 0.18) / 0.09) * Math.PI) * 0.38;
    }

    return 0;
  },

  draw() {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 30;
    const colors = this.getColors();

    ctx.clearRect(0, 0, w, h);

    const heart = this.heartbeat();
    const pulseBoost = this.pulse * 1.15;
    const coreRadius = 16 + heart * 15 + pulseBoost * 12;

    ctx.beginPath();
    ctx.arc(cx, cy - 5, coreRadius * 5.2, 0, Math.PI * 2);
    ctx.fillStyle = `${colors.glow}${0.045 + heart * 0.035})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy - 5, coreRadius * 2.4, 0, Math.PI * 2);
    ctx.fillStyle = `${colors.glow}${0.12 + heart * 0.10})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy - 5, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.core;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy - 5, coreRadius * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,246,210,.95)";
    ctx.fill();

    this.particles.forEach((p) => {
      p.angle += p.speed;
      p.pulse += 0.025;

      const expansion = 1 + heart * 0.10 + pulseBoost * 0.28;

      const x =
        cx +
        p.baseX * expansion +
        Math.cos(p.angle) * p.orbit;

      const y =
        cy +
        p.baseY * expansion +
        Math.sin(p.angle) * p.orbit * 1.2;

      ctx.beginPath();
      ctx.arc(x, y, p.size + Math.sin(p.pulse) * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, p.size * 5.2, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.glow}.045)`;
      ctx.fill();
    });

    if (this.pulse > 0) {
      this.pulse *= 0.91;
    }

    this.animation = requestAnimationFrame(() => this.draw());
  },

  start() {
    this.overlay.classList.add("active");
    this.pulse = 0;

    this.draw();

    setTimeout(() => this.speakPulse(0.8), 900);

    setTimeout(() => {
      this.overlay.classList.add("aion-show-text");
      this.speakPulse(1.15);
    }, 1600);

    setTimeout(() => this.speakPulse(0.7), 2500);

    setTimeout(() => this.stop(), 6500);
  },

  stop() {
    this.overlay.classList.remove("active");
    this.overlay.classList.remove("aion-show-text");

    if (this.animation) {
      cancelAnimationFrame(this.animation);
      this.animation = null;
    }

    this.showCompanion();
  },

  showCompanion() {
    if (this.companionCreated) return;

    const companion = document.createElement("button");
    companion.className = "aion-companion";
    companion.setAttribute("data-state", this.state);

    companion.innerHTML = `
      <span class="aion-companion-core"></span>
      <small>AION</small>
    `;

   companion.addEventListener("click", () => {
  companion.classList.toggle("active");

  this.speakPulse(1.1);

  if (companion.classList.contains("active")) {
    AionVoice.say("Bienvenido.", "speaking");

AionUI.context("ia");
  } else {
    AionUI.hide();
    AionVoice.clear();
  }
});

    document.body.appendChild(companion);
    this.companionCreated = true;
  },

  createDevPanel() {
    if (document.querySelector(".aion-dev-panel")) return;

    const panel = document.createElement("div");
    panel.className = "aion-dev-panel";

    panel.innerHTML = `
      <strong>AION DEV</strong>
      <button data-state="gold">Dorado</button>
      <button data-state="blue">Azul</button>
      <button data-state="green">Verde</button>
      <button data-state="violet">Violeta</button>
      <button data-state="white">Blanco</button>
      <button data-pulse="1">Pulso</button>
    `;

    panel.addEventListener("click", (event) => {
      const state = event.target.dataset.state;
      const pulse = event.target.dataset.pulse;

      if (state) {
        this.setState(state);
        this.speakPulse(0.9);
      }

      if (pulse) {
        this.speakPulse(1.2);
      }
    });

    document.body.appendChild(panel);
  }
};