/* =========================
   CORPUS GRAPH ENGINE™
========================= */

window.CorpusGraph = {
  canvas: null,
  ctx: null,
  nodes: [],
  activeIndex: 0,
  zoom: 0.15,
  targetZoom: 1,
  animationId: null,

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());

    this.draw();
  },

  resize() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  setNodes(nodes = []) {
    this.nodes = nodes.map((node, index) => ({
      ...node,
      angle: (Math.PI * 2 / Math.max(nodes.length, 1)) * index,
      radius: 120 + index * 12,
      pulse: Math.random() * Math.PI * 2
    }));

    this.activeIndex = 0;
    this.zoom = 0.15;
    this.targetZoom = 1;
  },

  activateNext() {
    if (!this.nodes.length) return;

    this.activeIndex++;

    if (this.activeIndex >= this.nodes.length) {
      this.activeIndex = this.nodes.length - 1;
    }

    this.targetZoom += 0.08;
  },

  draw() {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    this.zoom += (this.targetZoom - this.zoom) * 0.04;

    ctx.save();

    ctx.translate(cx, cy);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-cx, -cy);

    const pulse = 18 + Math.sin(Date.now() * 0.003) * 2.5;

    ctx.beginPath();
    ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(212,175,55,.95)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, pulse * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(212,175,55,.08)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, pulse * 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(212,175,55,.03)";
    ctx.fill();

    this.nodes.forEach((node, index) => {
      node.pulse += 0.025;

      const isActive = index <= this.activeIndex;

      const x = cx + Math.cos(node.angle) * node.radius;
      const y = cy + Math.sin(node.angle) * node.radius;

      if (isActive) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);

        const alpha = 0.18 + Math.sin(Date.now() * 0.002 + index) * 0.08;

        ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const glow = Math.sin(node.pulse) * 2;
      const size = isActive ? 7 + glow : 3;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = isActive
        ? "rgba(212,175,55,.95)"
        : "rgba(212,175,55,.22)";
      ctx.fill();

      if (isActive) {
        ctx.beginPath();
        ctx.arc(x, y, size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,175,55,.05)";
        ctx.fill();

        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(248,236,209,.72)";
        ctx.fillText(node.titulo || "Unidad", x + 12, y + 4);
      }
    });

    ctx.restore();

    this.animationId = requestAnimationFrame(() => this.draw());
  }
};