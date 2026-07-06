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

}

};