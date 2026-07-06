/* =========================
   FALCO CANVAS ENGINE®
========================= */

const FalcoCanvasEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  particles: [],
  connections: [],
  knowledgeNodes: [],

  init() {
    this.canvas = document.getElementById("falcoIaCanvas");

    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");

    this.resize();

    window.addEventListener("resize", () => {
      this.resize();
      this.createParticlesForAct(1);
    });
  },

  setKnowledgeNodes(nodes = []) {
    this.knowledgeNodes = nodes;
  },

  resize() {
    if (!this.canvas) return;

    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  },

  createParticlesForAct(act = 1) {
    this.particles = [];
    this.connections = [];

    const total =
      act === 1
        ? 1
        : Math.min(110, Math.floor((this.width * this.height) / 9000));

    for (let i = 0; i < total; i++) {
      const isKnowledgeNode = i < this.knowledgeNodes.length;

      this.particles.push({
        x:
          total === 1
            ? this.width / 2
            : this.width / 2 + (Math.random() - 0.5) * this.width * 0.72,

        y:
          total === 1
            ? this.height / 2
            : this.height / 2 + (Math.random() - 0.5) * this.height * 0.62,

        radius:
          total === 1
            ? 7
            : isKnowledgeNode
            ? Math.random() * 2.6 + 2.2
            : Math.random() * 1.7 + 0.4,

        vx: total === 1 ? 0 : (Math.random() - 0.5) * 0.22,
        vy: total === 1 ? 0 : (Math.random() - 0.5) * 0.22,

        alpha:
          total === 1
            ? 0.95
            : isKnowledgeNode
            ? 0.95
            : Math.random() * 0.5 + 0.18,

        label: isKnowledgeNode ? this.knowledgeNodes[i] : null,
        pulse: Math.random() * Math.PI * 2
      });
    }

    if (total > 1) {
      this.buildConnections();
    }
  },

  buildConnections() {
    this.connections = [];

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && Math.random() > 0.55) {
          this.connections.push([i, j]);
        }
      }
    }
  },

  drawCorpusGlow() {
    if (!this.ctx) return;

    const gradient = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      20,
      this.width / 2,
      this.height / 2,
      Math.min(this.width, this.height) * 0.45
    );

    gradient.addColorStop(0, "rgba(212,175,55,0.16)");
    gradient.addColorStop(0.45, "rgba(212,175,55,0.06)");
    gradient.addColorStop(1, "rgba(212,175,55,0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  },

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += 0.025;

      const marginX = this.width * 0.12;
      const marginY = this.height * 0.16;

      if (particle.x < marginX || particle.x > this.width - marginX) {
        particle.vx *= -1;
      }

      if (particle.y < marginY || particle.y > this.height - marginY) {
        particle.vy *= -1;
      }
    });
  },

  drawConnections() {
    this.connections.forEach(([a, b]) => {
      const p1 = this.particles[a];
      const p2 = this.particles[b];

      if (!p1 || !p2) return;

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const opacity = Math.max(0, 0.13 - distance / 1500);

      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = `rgba(212,175,55,${opacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  },

  drawParticles() {
    this.particles.forEach((particle) => {
      const pulseSize = Math.sin(particle.pulse) * 0.8;
      const radius = Math.max(0.5, particle.radius + pulseSize);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212,175,55,${particle.alpha})`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, radius * 4.8, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(212,175,55,${particle.alpha * 0.06})`;
      this.ctx.fill();
    });
  }
};