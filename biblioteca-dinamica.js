import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("🔥 JS biblioteca cargado");

setTimeout(async () => {

  const container = document.getElementById("biblioteca-container");
  const buscador = document.getElementById("buscadorBiblioteca");
  const moduloActual = document.body.dataset.modulo || "biblioteca";

  if (!container) {
    console.log("❌ ERROR: container no encontrado");
    return;
  }

  try {
    const snap = await getDocs(collection(db, "contenidos"));
    const datos = snap.docs.map(doc => doc.data());

    function render(lista) {
      container.innerHTML = "";

      lista.forEach(item => {
        if (item.modulo === moduloActual && item.activo !== false) {
          const card = document.createElement("div");
          card.className = "recurso-card";



card.innerHTML = `
  <div class="recurso-ficha-top">
    <span class="recurso-clase">
      ${item.categoria || "RECURSO PROFESIONAL"}
    </span>

    <span class="recurso-formato">
      ${item.icono || "📄"} ${item.tipo?.toUpperCase() || "PDF"}
    </span>
  </div>

  <h3 class="recurso-titulo">
    ${item.titulo}
  </h3>

  <p class="recurso-descripcion">
    ${item.descripcion || "Recurso profesional disponible para consulta."}
  </p>

  <div class="recurso-separador"></div>

  <div class="recurso-info-grid">
    <div>
      <small>Fuero</small>
      <strong>${item.fuero || "General"}</strong>
    </div>

    <div>
      <small>Subcategoría</small>
      <strong>${item.subcategoria || "-"}</strong>
    </div>

    <div>
      <small>Autor</small>
      <strong>${item.autor || "Centro Profesional Falco®"}</strong>
    </div>

    <div>
      <small>Actualización</small>
      <strong>${item.fechaActualizacion || "-"}</strong>
    </div>
  </div>

  <div class="recurso-tags">
    ${(item.tags || "")
      .split(",")
      .map(tag => `<span>${tag.trim()}</span>`)
      .join("")}
  </div>

  <div class="recurso-accion">
    <a href="${item.url}" target="_blank" class="btn-acceso-mini">
      Abrir documento
    </a>
  </div>
`;

          container.appendChild(card);
        }
      });
    }

    render(datos);

    buscador?.addEventListener("input", () => {
      const texto = buscador.value.toLowerCase();

      const filtrados = datos.filter(item => {
        const contenido = `
          ${item.titulo || ""}
          ${item.categoria || ""}
          ${item.subcategoria || ""}
          ${item.fuero || ""}
          ${item.tags || ""}
        `.toLowerCase();

        return contenido.includes(texto);
      });

      render(filtrados);
    });

  } catch (error) {
    console.error("❌ ERROR FIRESTORE:", error);
  }

}, 500);