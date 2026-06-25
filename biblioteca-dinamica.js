import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("🔥 JS biblioteca cargado");

window.addEventListener("centroRecursosListo", async (event) => {


  const container = document.getElementById("biblioteca-container");
  const buscador = document.getElementById("buscadorBiblioteca");

  const contadorCategorias = document.getElementById("contadorCategorias");

  const moduloActual = document.body.dataset.modulo || "biblioteca";

  if (!container) {
    console.log("❌ ERROR: container no encontrado");
    return;
  }

  try {
    const snap = await getDocs(collection(db, "contenidos"));
    const datos = snap.docs.map(doc => doc.data());



    function render(lista) {if (contadorCategorias) {
  const activos = datos.filter(item =>
    item.modulo === moduloActual && item.activo !== false
  );

  const conteo = {};

  activos.forEach(item => {
    const categoria = item.categoria || "General";
    conteo[categoria] = (conteo[categoria] || 0) + 1;
  });

  contadorCategorias.innerHTML = Object.entries(conteo)
    .map(([categoria, total]) => `
      <div class="resumen-item">
        <strong>${total}</strong>
        <span>${categoria}</span>
      </div>
    `)
    .join("");
}
      container.innerHTML = "";


     const puedeAbrir = window.centroRecursosPuedeAbrir === true;


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

  <div class="recurso-accion recurso-botones">

  ${
  item.urlPdf
    ? `<a
        href="${puedeAbrir ? item.urlPdf : "login.html?destino=biblioteca"}"
        target="${puedeAbrir ? "_blank" : "_self"}"
        class="btn-acceso-mini"
      >
        ${puedeAbrir ? "📄 PDF" : "🔒 Acceder para abrir"}
      </a>`
    : ""
}

 ${
  item.urlWord
    ? `<a
       href="${puedeAbrir ? item.urlWord : "login.html?destino=biblioteca"}"
        target="${puedeAbrir ? "_blank" : "_self"}"
        class="btn-acceso-mini"
      >
        ${puedeAbrir ? "📝 Word" : "🔒 Acceder para abrir"}
      </a>`
    : ""
}

${
  item.urlVideo
    ? `<a
       href="${puedeAbrir ? item.urlVideo : "login.html?destino=biblioteca"}"
        target="${puedeAbrir ? "_blank" : "_self"}"
        class="btn-acceso-mini"
      >
        ${puedeAbrir ? "🎥 Video" : "🔒 Acceder para abrir"}
      </a>`
    : ""
}

  ${
    !item.urlPdf && !item.urlWord && !item.urlVideo
      ? `<span class="badge-bloqueado">Disponible próximamente</span>`
      : ""
  }

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

});