/* =========================
   RESEARCH VISUALIZER™
========================= */

window.ResearchVisualizer = {
  container: null,

  init(selector) {
    this.container = document.querySelector(selector);
  },

  reset() {
    if (!this.container) return;
    this.container.innerHTML = "";
  },

  showNode(node, label = "Unidad localizada") {
    if (!this.container || !node) return;

    const item = document.createElement("div");
    item.className = "research-node";

    item.innerHTML = `
      <span>${label}</span>
      <strong>${node.titulo || "Unidad de Conocimiento"}</strong>
      <small>${node.tipo || "unidad"} · ${node.estado || "sin estado"}</small>
    `;

    this.container.appendChild(item);

    setTimeout(() => {
      item.classList.add("active");
    }, 80);
  },

  showSources(nodes = []) {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        this.showNode(node, index === 0 ? "Unidad principal" : "Relación encontrada");
      }, index * 380);
    });
  }
};