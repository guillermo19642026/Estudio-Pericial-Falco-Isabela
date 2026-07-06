/* =========================
   CORPUS AWAKENING™
========================= */

const FalcoAwakening = {
  elements: {},
  ctx: null,
  nodes: [],
  animation: null,
  phase: 0,



 init() {

    this.elements = {
        container: document.getElementById("corpusAwakening"),
        canvas: document.getElementById("awakeningCanvas"),
        step: document.getElementById("awakeningStep"),
        message: document.getElementById("awakeningMessage")
    };

    this.resize();

    window.addEventListener("resize", () => this.resize());

},

resize() {

    const { canvas } = this.elements;

    if (!canvas) return;

    this.ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

},

createNodes(total = 1) {

    const { canvas } = this.elements;

    if (!canvas) return;

    this.nodes = [];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < total; i++) {

        this.nodes.push({
            x: cx + (Math.random() - 0.5) * canvas.width * 0.62,
            y: cy + (Math.random() - 0.5) * canvas.height * 0.48,
            r: Math.random() * 2.4 + 1.8,
            pulse: Math.random() * Math.PI * 2,
            label: null
        });

    }

    if (this.nodes[0]) {
        this.nodes[0].x = cx;
        this.nodes[0].y = cy;
        this.nodes[0].r = 7;
        this.nodes[0].label = "Corpus FALCO®";
    }

},

draw() {
  const { canvas } = this.elements;

  if (!this.ctx || !canvas) return;

  const ctx = this.ctx;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  this.nodes.forEach((node, index) => {
    node.pulse += 0.035;

    const active = index <= this.phase * 30;

    if (active && this.phase >= 2) {
      this.nodes.forEach((other, j) => {
        if (j <= index || j > this.phase * 30) return;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(212,175,55,${0.10 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }

    if (active) {
      const size = node.r + Math.sin(node.pulse) * 1.4;

      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55,.95)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, size * 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212,175,55,.06)";
      ctx.fill();

      if (this.phase >= 4 && node.label) {
        ctx.font = "13px Arial";
        ctx.fillStyle = "rgba(248,236,209,.75)";
        ctx.fillText(node.label, node.x + 14, node.y + 4);
      }
    }
  });

  this.animation = requestAnimationFrame(() => this.draw());
},

async run() {

  const { container, step, message } = this.elements;

  if (!container) return;

  container.classList.add("active");

  this.resize();
  this.createNodes(130);
  this.phase = 0;

  if (this.animation) {
    cancelAnimationFrame(this.animation);
  }

  this.draw();

  const steps = [
    ["Inicializando Corpus FALCO®", "Todo comienza con una idea."],
    ["Atrayendo conocimiento", "Las primeras unidades comienzan a encenderse."],
    ["Relacionando unidades", "El conocimiento empieza a organizarse."],
    ["Validando criterios", "La estructura toma forma institucional."],
    ["Integrando metodología", "El Corpus FALCO® está listo."]
  ];

  for (let i = 0; i < steps.length; i++) {
    this.phase = i + 1;

    if (step) step.textContent = steps[i][0];
    if (message) message.textContent = steps[i][1];

    await new Promise(resolve => setTimeout(resolve, 900));
  }

  container.classList.remove("active");

  if (this.animation) {
    cancelAnimationFrame(this.animation);
    this.animation = null;
  }

}

};