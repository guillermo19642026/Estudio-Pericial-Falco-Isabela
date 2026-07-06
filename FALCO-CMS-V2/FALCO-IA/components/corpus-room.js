/* =========================
   FALCO IA® - SALA DEL CORPUS
========================= */

const FalcoCorpusRoom = {
  elements: {},

  init() {
    this.elements = {
      nodeList: document.getElementById("corpusNodeList"),
      detail: document.getElementById("corpusDetail"),
      totalNodes: document.getElementById("corpusTotalNodes")
    };
  },

  render(nodes = []) {
    const { nodeList, totalNodes } = this.elements;

    if (!nodeList) return;

    nodeList.innerHTML = "";

    if (totalNodes) {
      totalNodes.textContent = nodes.length;
    }

    nodes.forEach((node, index) => {
      const card = document.createElement("article");
      card.className = "corpus-node-card";

      card.innerHTML = `
        <span>${node.tipo || "Unidad"}</span>
        <h4>${node.titulo || "Sin título"}</h4>
        <p>${node.descripcion || "Sin descripción disponible."}</p>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".corpus-node-card").forEach((item) => {
          item.classList.remove("active");
        });

        card.classList.add("active");
        this.showDetail(node);
      });

      nodeList.appendChild(card);

      if (index === 0) {
        card.classList.add("active");
        this.showDetail(node);
      }
    });
  },

  showDetail(node) {
    const { detail } = this.elements;

    if (!detail) return;

    detail.innerHTML = `
      <span>${node.id || "UCF"}</span>
      <h3>${node.titulo || "Unidad de Conocimiento"}</h3>
      <p>${node.descripcion || "Sin descripción disponible."}</p>

      <div class="corpus-meta">
        <div><strong>Tipo:</strong> ${node.tipo || "-"}</div>
        <div><strong>Categoría:</strong> ${node.categoria || "-"}</div>
        <div><strong>Subcategoría:</strong> ${node.subcategoria || "-"}</div>
        <div><strong>Acceso:</strong> ${node.nivelAcceso || "-"}</div>
        <div><strong>Estado:</strong> ${node.estado || "-"}</div>
        <div><strong>Relaciones:</strong> ${
          node.relaciones && node.relaciones.length
            ? node.relaciones.join(", ")
            : "Sin relaciones registradas"
        }</div>
      </div>
    `;
  }
};