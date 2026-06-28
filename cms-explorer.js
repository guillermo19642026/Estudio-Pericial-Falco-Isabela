console.log("cms-explorer.js cargado");

export function renderizarContenidos({
  contenidos,
  listaRecursosCMS,
  buscarRecurso,
  filtroModulo
}) {
  if (!listaRecursosCMS) return;

  const texto = normalizarTexto(buscarRecurso?.value || "").trim();
  const modulo = filtroModulo?.value || "";

  let filtrados = [...contenidos];

  const exploradorVacio = document.getElementById("exploradorVacio");

  if (!texto && !modulo) {
    listaRecursosCMS.classList.remove("cms-listado-visible");
    listaRecursosCMS.classList.add("cms-listado-oculto");

    if (exploradorVacio) {
      exploradorVacio.style.display = "grid";
    }

    return;
  }

  filtrados = filtrados.filter(item => !item.archivado);

  if (texto) {
    filtrados = filtrados.filter((item) =>
      normalizarTexto(item.titulo).includes(texto) ||
      normalizarTexto(item.descripcion).includes(texto) ||
      normalizarTexto(item.tags).includes(texto) ||
      normalizarTexto(item.palabrasClave).includes(texto) ||
      normalizarTexto(item.categoria).includes(texto) ||
      normalizarTexto(item.subcategoria).includes(texto) ||
      normalizarTexto(item.tipoEscrito).includes(texto)
    );
  }

  if (modulo) {
    filtrados = filtrados.filter((item) => item.modulo === modulo);
  }

  if (filtrados.length === 0) {
    listaRecursosCMS.classList.remove("cms-listado-visible");
    listaRecursosCMS.classList.add("cms-listado-oculto");

    if (exploradorVacio) {
      exploradorVacio.style.display = "grid";
    }

    return;
  }

  if (exploradorVacio) {
    exploradorVacio.style.display = "none";
  }

  listaRecursosCMS.classList.remove("cms-listado-oculto");
  listaRecursosCMS.classList.add("cms-listado-visible");

  listaRecursosCMS.innerHTML = `
    <div class="cms-table-wrap">
      <table class="cms-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Módulo</th>
            <th>Tipo</th>
            <th>Fuero</th>
            <th>Estado</th>
            <th>Dest.</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          ${filtrados.map((item) => {
            const url = item.urlPdf || item.urlWord || item.urlVideo || "";
            const activo = item.activo === true;

            return `
              <tr>
                <td>
                  <strong>${item.titulo || "Sin título"}</strong>
                  <small>${item.descripcion || ""}</small>
                </td>

                <td>${item.modulo || "-"}</td>
                <td>${item.tipoContenido || "-"}</td>
                <td>${item.fuero || "-"}</td>

                <td>
                  <span class="cms-badge ${item.archivado ? "gris" : activo ? "verde" : "naranja"}">
                    ${
                      item.archivado
                        ? "Archivado"
                        : activo
                          ? "Activo"
                          : "Oculto"
                    }
                  </span>
                </td>

                <td>
                  ${item.destacado ? `<span class="cms-badge dorado">Sí</span>` : "-"}
                </td>

                <td>
                  <div class="cms-table-actions">
                    <button onclick="verRecurso('${url}')">Ver</button>
                    <button onclick="editarContenido('${item.id}')">Editar</button>
                    <button onclick="toggleActivo('${item.id}', ${activo})">
                      ${activo ? "Ocultar" : "Publicar"}
                    </button>

                    ${!activo ? `
                      <button onclick="archivarContenido('${item.id}')">
                        Archivar
                      </button>
                    ` : ""}
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function normalizarTexto(valor) {
  if (!valor) return "";

  let texto = "";

  if (Array.isArray(valor)) {
    texto = valor.join(" ");
  } else {
    texto = String(valor);
  }

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}