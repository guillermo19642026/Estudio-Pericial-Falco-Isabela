console.log("cms-dashboard.js cargado");

export function actualizarDashboard(contenidos) {
  const statTotal = document.getElementById("statTotal");
  const statActivos = document.getElementById("statActivos");
  const statOcultos = document.getElementById("statOcultos");
  const statArchivados = document.getElementById("statArchivados");
  const statDestacados = document.getElementById("statDestacados");

  const resumenModulos = document.getElementById("resumenModulos");
  const resumenTipos = document.getElementById("resumenTipos");
  const resumenFormatos = document.getElementById("resumenFormatos");
  const cmsActividad = document.getElementById("cmsActividad");
  const cmsAlertas = document.getElementById("cmsAlertas");

  if (!statTotal) return;

  const total = contenidos.length;
  const activos = contenidos.filter(item => item.activo === true && !item.archivado).length;
  const ocultos = contenidos.filter(item => item.activo !== true && !item.archivado).length;
  const archivados = contenidos.filter(item => item.archivado === true).length;
  const destacados = contenidos.filter(item => item.destacado === true && !item.archivado).length;

  statTotal.textContent = total;
  statActivos.textContent = activos;
  statOcultos.textContent = ocultos;
  statArchivados.textContent = archivados;
  statDestacados.textContent = destacados;

  renderizarResumenAgrupado(resumenModulos, contenidos, "modulo");
  renderizarResumenAgrupado(resumenTipos, contenidos, "tipoContenido");
  renderizarResumenAgrupado(resumenFormatos, contenidos, "tipo");
  renderizarAlertas(cmsAlertas, contenidos);
  renderizarActividadReciente(cmsActividad, contenidos);
}

function renderizarActividadReciente(cmsActividad, contenidos) {
  if (!cmsActividad) return;

  const recientes = [...contenidos]
    .filter(item => !item.archivado)
    .slice(0, 5);

  if (recientes.length === 0) {
    cmsActividad.innerHTML = `<p>No hay actividad reciente.</p>`;
    return;
  }

  cmsActividad.innerHTML = recientes.map(item => `
    <div class="cms-actividad-item">
      <div>
        <strong>${item.titulo || "Sin título"}</strong>
        <span>
          ${item.modulo || "Sin módulo"} ·
          ${item.tipoContenido || "Sin tipo"}
        </span>
      </div>

      <button onclick="editarContenido('${item.id}')">
        Editar
      </button>
    </div>
  `).join("");
}

function renderizarResumenAgrupado(contenedor, contenidos, campo) {
  if (!contenedor) return;

  const conteo = {};

  contenidos
    .filter(item => !item.archivado)
    .forEach(item => {
      const clave = item[campo] || "Sin dato";
      conteo[clave] = (conteo[clave] || 0) + 1;
    });

  const entradas = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1]);

  if (entradas.length === 0) {
    contenedor.innerHTML = `<p>No hay datos.</p>`;
    return;
  }

  contenedor.innerHTML = entradas.map(([nombre, cantidad]) => `
    <div class="cms-resumen-item">
      <span>${formatearEtiqueta(nombre)}</span>
      <strong>${cantidad}</strong>
    </div>
  `).join("");
}

function formatearEtiqueta(texto) {
  if (!texto) return "Sin dato";

  return String(texto)
    .replace(/_/g, " ")
    .replace(/\b\w/g, letra => letra.toUpperCase());
}

function renderizarAlertas(cmsAlertas, contenidos) {
  if (!cmsAlertas) return;

  const recursosActivos = contenidos.filter(item => !item.archivado);

  const sinArchivo = recursosActivos.filter(item =>
    !item.urlPdf && !item.urlWord && !item.urlVideo
  );

  const sinTags = recursosActivos.filter(item =>
    !item.tags &&
    (!item.palabrasClave || item.palabrasClave.length === 0)
  );

  const sinDescripcion = recursosActivos.filter(item => !item.descripcion);

  const sinFuero = recursosActivos.filter(item =>
    !item.fuero && !item.categoria
  );

  const ocultos = recursosActivos.filter(item => item.activo !== true);

  const destacadosSinArchivo = recursosActivos.filter(item =>
    item.destacado === true &&
    !item.urlPdf &&
    !item.urlWord &&
    !item.urlVideo
  );

  const alertas = [];

  if (sinArchivo.length > 0) {
    alertas.push({
      tipo: "critica",
      texto: `${sinArchivo.length} recurso(s) sin archivo cargado.`
    });
  }

  if (sinTags.length > 0) {
    alertas.push({
      tipo: "media",
      texto: `${sinTags.length} recurso(s) sin palabras clave.`
    });
  }

  if (sinDescripcion.length > 0) {
    alertas.push({
      tipo: "media",
      texto: `${sinDescripcion.length} recurso(s) sin descripción.`
    });
  }

  if (sinFuero.length > 0) {
    alertas.push({
      tipo: "media",
      texto: `${sinFuero.length} recurso(s) sin fuero o categoría.`
    });
  }

  if (ocultos.length > 0) {
    alertas.push({
      tipo: "info",
      texto: `${ocultos.length} recurso(s) oculto(s).`
    });
  }

  if (destacadosSinArchivo.length > 0) {
    alertas.push({
      tipo: "critica",
      texto: `${destacadosSinArchivo.length} recurso(s) destacado(s) sin archivo.`
    });
  }

  cmsAlertas.innerHTML = alertas.map(alerta => `
    <div class="cms-alerta cms-alerta-${alerta.tipo}">
      ${alerta.texto}
    </div>
  `).join("");
}