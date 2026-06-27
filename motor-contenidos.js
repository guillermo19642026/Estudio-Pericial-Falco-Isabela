import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("Motor de Contenidos Falco cargado");

const btnGuardar = document.getElementById("btnGuardarRecurso");
const mensaje = document.getElementById("mensajeRecurso");

const listaRecursosCMS = document.getElementById("listaRecursosCMS");
const buscarRecurso = document.getElementById("buscarRecurso");
const filtroModulo = document.getElementById("filtroModulo");

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

let contenidos = [];

let recursoEditandoId = null;

btnGuardar?.addEventListener("click", guardarRecurso);
buscarRecurso?.addEventListener("input", renderizarContenidos);
filtroModulo?.addEventListener("change", renderizarContenidos);

const camposFormularioRecurso = [
  "recursoTitulo",
  "recursoDescripcion",
  "recursoModulo",
  "recursoTipoContenido",
  "recursoFuero",
  "recursoTipoEscrito",
  "recursoUrlPdf",
  "recursoUrlWord",
  "recursoUrlVideo",
  "recursoTags",
  "recursoNivelAcceso"
];

camposFormularioRecurso.forEach(id => {
  document.getElementById(id)?.addEventListener("input", actualizarEstadoBotonGuardar);
  document.getElementById(id)?.addEventListener("change", actualizarEstadoBotonGuardar);
});

actualizarEstadoBotonGuardar();


cargarContenidos();


function actualizarEstadoBotonGuardar() {
  if (!btnGuardar) return;

  const titulo = document.getElementById("recursoTitulo")?.value.trim();
  const descripcion = document.getElementById("recursoDescripcion")?.value.trim();
  const modulo = document.getElementById("recursoModulo")?.value;
  const tipoContenido = document.getElementById("recursoTipoContenido")?.value;
  const fuero = document.getElementById("recursoFuero")?.value.trim();

  const urlPdf = document.getElementById("recursoUrlPdf")?.value.trim();
  const urlWord = document.getElementById("recursoUrlWord")?.value.trim();
  const urlVideo = document.getElementById("recursoUrlVideo")?.value.trim();

  const tags = document.getElementById("recursoTags")?.value.trim();
  const nivelAcceso = document.getElementById("recursoNivelAcceso")?.value;

  const archivoOk = Boolean(urlPdf || urlWord || urlVideo);

  const formularioCompleto =
    Boolean(titulo) &&
    Boolean(descripcion) &&
    Boolean(modulo) &&
    Boolean(tipoContenido) &&
    Boolean(fuero) &&
    archivoOk &&
    Boolean(tags) &&
    Boolean(nivelAcceso);

 btnGuardar.disabled = !formularioCompleto;

 actualizarVistaPreviaRecurso();
 }


async function guardarRecurso() {
  try {
    const recurso = {
      titulo: document.getElementById("recursoTitulo").value.trim(),
      descripcion: document.getElementById("recursoDescripcion").value.trim(),
      modulo: document.getElementById("recursoModulo").value,
      tipoContenido: document.getElementById("recursoTipoContenido").value,
      fuero: document.getElementById("recursoFuero").value.trim(),
      tipoEscrito: document.getElementById("recursoTipoEscrito").value.trim(),

      categoria: document.getElementById("recursoFuero").value.trim(),
      subcategoria: document.getElementById("recursoTipoEscrito").value.trim(),
      autor: "Lic. Isabela Falco",

      tipo: document.getElementById("recursoTipo")?.value || "pdf",
      icono: document.getElementById("recursoIcono")?.value || "documento",

      fechaActualizacion: "Junio 2026",

      nivelAcceso:
        document.getElementById("recursoNivelAcceso")?.value || "biblioteca",

      destacado:
        document.getElementById("recursoDestacado")?.value === "true",

      activo:
        document.getElementById("recursoActivo")?.value === "true",

      urlPdf: document.getElementById("recursoUrlPdf").value.trim(),
      urlWord: document.getElementById("recursoUrlWord").value.trim(),
      urlVideo: document.getElementById("recursoUrlVideo").value.trim(),

      tags: document.getElementById("recursoTags").value.trim(),

      palabrasClave: document
        .getElementById("recursoTags")
        .value
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),

      rolesPermitidos: ["biblioteca", "profesional", "perito", "admin"],

      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp()
    };







const validacion = validarFormularioRecurso(recurso);

if (!validacion.ok) {
  mensaje.textContent = validacion.mensaje;

  document.getElementById("nuevo-recurso")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (validacion.campo) {
    validacion.campo.focus();
    validacion.campo.classList.add("input-error");

    setTimeout(() => {
      validacion.campo.classList.remove("input-error");
    }, 1800);
  }

  return;
}


    if (recursoEditandoId) {

  await updateDoc(doc(db, "contenidos", recursoEditandoId), {
    ...recurso,
    actualizadoEn: serverTimestamp()
  });

  mensaje.textContent = "Recurso actualizado correctamente.";

  recursoEditandoId = null;

  btnGuardar.textContent = "Guardar recurso";

} else {

  await addDoc(collection(db, "contenidos"), recurso);

  mensaje.textContent = "Recurso guardado correctamente.";

}

limpiarFormulario();

await cargarContenidos();



  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al guardar el recurso.";
  }
}

async function cargarContenidos() {
  if (!listaRecursosCMS) return;

  listaRecursosCMS.innerHTML = `
    <p class="bloque-tests-nota">Cargando recursos...</p>
  `;

  try {
    const q = query(
      collection(db, "contenidos"),
      orderBy("creadoEn", "desc")
    );

    const snapshot = await getDocs(q);

    contenidos = [];

    snapshot.forEach((documento) => {
      contenidos.push({
        id: documento.id,
        ...documento.data()
      });
    });


    actualizarDashboard();

    renderizarContenidos();

  } catch (error) {
    console.error("Error al cargar contenidos:", error);

    listaRecursosCMS.innerHTML = `
      <p class="bloque-tests-nota">
        No se pudieron cargar los recursos.
      </p>
    `;
  }
}

function actualizarDashboard() {
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

renderizarResumenAgrupado(resumenModulos, "modulo");
renderizarResumenAgrupado(resumenTipos, "tipoContenido");
renderizarResumenAgrupado(resumenFormatos, "tipo");
renderizarAlertas();

function renderizarActividadReciente() {
  if (!cmsActividad) return;

  const recientes = [...contenidos]
    .filter(item => !item.archivado)
    .slice(0, 5);

  if (recientes.length === 0) {
    cmsActividad.innerHTML = `
      <p>No hay actividad reciente.</p>
    `;
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


renderizarActividadReciente();

}


function renderizarResumenAgrupado(contenedor, campo) {
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


function renderizarAlertas() {
  if (!cmsAlertas) return;

  const recursosActivos = contenidos.filter(item => !item.archivado);

  const sinArchivo = recursosActivos.filter(item =>
    !item.urlPdf &&
    !item.urlWord &&
    !item.urlVideo
  );

  const sinTags = recursosActivos.filter(item =>
    !item.tags &&
    (!item.palabrasClave || item.palabrasClave.length === 0)
  );

  const sinDescripcion = recursosActivos.filter(item =>
    !item.descripcion
  );

  const sinFuero = recursosActivos.filter(item =>
    !item.fuero &&
    !item.categoria
  );

  const ocultos = recursosActivos.filter(item =>
    item.activo !== true
  );

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
  <div class="cms-alerta-kpi cms-alerta-${alerta.tipo}">
    <span>${alerta.texto}</span>
  </div>
`).join("");

  cmsAlertas.innerHTML = alertas.map(alerta => `
    <div class="cms-alerta cms-alerta-${alerta.tipo}">
      ${alerta.texto}
    </div>
  `).join("");
}



function renderizarContenidos() {
  if (!listaRecursosCMS) return;

  const texto = normalizarTexto(buscarRecurso?.value || "").trim();
  const modulo = filtroModulo?.value || "";

  let filtrados = [...contenidos];


const exploradorVacio =
  document.getElementById("exploradorVacio");

/* Si no hay búsqueda ni filtros,
   no mostrar resultados */

if (!texto && !modulo) {

  listaRecursosCMS.classList.remove("cms-listado-visible");
  listaRecursosCMS.classList.add("cms-listado-oculto");

  exploradorVacio.style.display = "grid";

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

  exploradorVacio.style.display = "grid";

  return;
}

exploradorVacio.style.display = "none";

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


window.editarContenido = function(id) {
  const recurso = contenidos.find(item => item.id === id);

  if (!recurso) {
    alert("No se encontró el recurso.");
    return;
  }

  recursoEditandoId = id;

const inputTitulo = document.querySelector('input[id="recursoTitulo"]');
const inputDescripcion = document.querySelector('textarea[id="recursoDescripcion"]');

if (!inputTitulo || !inputDescripcion) {
  alert("No se encontraron los campos del formulario.");
  return;
}

inputTitulo.value = recurso.titulo || "";
inputDescripcion.value = recurso.descripcion || "";

console.log("EDITANDO RECURSO:", recurso);
console.log("TÍTULO CARGADO:", inputTitulo.value);
console.log("DESCRIPCIÓN CARGADA:", inputDescripcion.value);


  document.getElementById("recursoModulo").value =
  recurso.modulo || "escritos";

document.getElementById("recursoTipoContenido").value =
  recurso.tipoContenido || "escrito";




  document.getElementById("recursoFuero").value = recurso.fuero || "";
  document.getElementById("recursoTipoEscrito").value = recurso.tipoEscrito || "";

  document.getElementById("recursoUrlPdf").value = recurso.urlPdf || "";
  document.getElementById("recursoUrlWord").value = recurso.urlWord || "";
  document.getElementById("recursoUrlVideo").value = recurso.urlVideo || "";

  document.getElementById("recursoTags").value =
    Array.isArray(recurso.palabrasClave)
      ? recurso.palabrasClave.join(", ")
      : recurso.tags || "";

  document.getElementById("recursoActivo").value =
    recurso.activo ? "true" : "false";

  document.getElementById("recursoDestacado").value =
    recurso.destacado ? "true" : "false";

  document.getElementById("recursoNivelAcceso").value =
    recurso.nivelAcceso || "biblioteca";

  btnGuardar.textContent = "Guardar cambios";

  mensaje.textContent = "Editando recurso existente.";

  actualizarEstadoBotonGuardar();


  document.getElementById("recursoTitulo").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};


window.verRecurso = function(url) {
  if (!url || url === "undefined" || url === "null") {
    alert("Este recurso no tiene URL cargada.");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    alert("La URL cargada no es válida. Debe comenzar con https://");
    return;
  }

  window.location.href = url;
};

window.toggleActivo = async function(id, estadoActual) {
  try {
    await updateDoc(doc(db, "contenidos", id), {
      activo: !estadoActual,
      actualizadoEn: serverTimestamp()
    });

    await cargarContenidos();

  } catch (error) {
    console.error(error);
    alert("No se pudo cambiar el estado del recurso.");
  }
};

window.archivarContenido = async function(id) {
  const confirmar = confirm(
    "¿Seguro que querés archivar este recurso? No se eliminará de Firestore."
  );

  if (!confirmar) return;

  try {
    await updateDoc(doc(db, "contenidos", id), {
      archivado: true,
      activo: false,
      actualizadoEn: serverTimestamp()
    });

    await cargarContenidos();

  } catch (error) {
    console.error(error);
    alert("No se pudo archivar el recurso.");
  }
};



function abrirTabFormulario(nombreTab) {
  document.querySelectorAll(".cms-tab").forEach(btn => {
    btn.classList.remove("activo");
  });

  document.querySelectorAll(".cms-tab-panel").forEach(panel => {
    panel.classList.remove("activo");
  });

  document.querySelector(`.cms-tab[data-tab="${nombreTab}"]`)?.classList.add("activo");
  document.getElementById("tab-" + nombreTab)?.classList.add("activo");
}



function validarFormularioRecurso(recurso) {

  const campoTitulo = document.getElementById("recursoTitulo");
  const campoDescripcion = document.getElementById("recursoDescripcion");
  const campoModulo = document.getElementById("recursoModulo");
  const campoTipoContenido = document.getElementById("recursoTipoContenido");
  const campoFuero = document.getElementById("recursoFuero");
  const campoTipoEscrito = document.getElementById("recursoTipoEscrito");
  const campoNivelAcceso = document.getElementById("recursoNivelAcceso");
  const campoUrlPdf = document.getElementById("recursoUrlPdf");
  const campoUrlWord = document.getElementById("recursoUrlWord");
  const campoUrlVideo = document.getElementById("recursoUrlVideo");
  const campoTags = document.getElementById("recursoTags");

if (!recurso.titulo) {
  abrirTabFormulario("info");
  return {
    ok: false,
    mensaje: "Debe ingresar el título del recurso.",
    campo: campoTitulo
  };
}

if (!recurso.descripcion) {
  abrirTabFormulario("info");
  return {
    ok: false,
    mensaje: "Debe ingresar la descripción del recurso.",
    campo: campoDescripcion
  };
}

if (!recurso.modulo) {
  abrirTabFormulario("info");
  return {
    ok: false,
    mensaje: "Debe seleccionar el módulo del recurso.",
    campo: campoModulo
  };
}

if (!recurso.tipoContenido) {
  abrirTabFormulario("info");
  return {
    ok: false,
    mensaje: "Debe seleccionar el tipo de contenido.",
    campo: campoTipoContenido
  };
}

if (!recurso.fuero) {
  abrirTabFormulario("clasificacion");
  return {
    ok: false,
    mensaje: "Debe seleccionar el fuero o categoría principal.",
    campo: campoFuero
  };
}

if (recurso.tipoContenido === "escrito" && !recurso.tipoEscrito) {
  abrirTabFormulario("clasificacion");
  return {
    ok: false,
    mensaje: "Debe seleccionar el tipo de escrito judicial.",
    campo: campoTipoEscrito
  };
}

if (!recurso.nivelAcceso) {
  abrirTabFormulario("publicacion");
  return {
    ok: false,
    mensaje: "Debe seleccionar el nivel de acceso.",
    campo: campoNivelAcceso
  };
}

if (!recurso.urlPdf && !recurso.urlWord && !recurso.urlVideo) {
  abrirTabFormulario("archivos");
  return {
    ok: false,
    mensaje: "Debe ingresar al menos una URL: PDF, Word o Video.",
    campo: campoUrlPdf
  };
}

if (recurso.urlPdf && !urlValida(recurso.urlPdf)) {
  abrirTabFormulario("archivos");
  return {
    ok: false,
    mensaje: "La URL del PDF no es válida. Debe comenzar con http:// o https://.",
    campo: campoUrlPdf
  };
}

if (recurso.urlWord && !urlValida(recurso.urlWord)) {
  abrirTabFormulario("archivos");
  return {
    ok: false,
    mensaje: "La URL alternativa no es válida. Debe comenzar con http:// o https://.",
    campo: campoUrlWord
  };
}

if (recurso.urlVideo && !urlValida(recurso.urlVideo)) {
  abrirTabFormulario("archivos");
  return {
    ok: false,
    mensaje: "La URL del video no es válida. Debe comenzar con http:// o https://.",
    campo: campoUrlVideo
  };
}

if (!recurso.tags) {
  abrirTabFormulario("clasificacion");
  return {
    ok: false,
    mensaje: "Debe ingresar palabras clave para facilitar la búsqueda.",
    campo: campoTags
  };
}


return {
  ok: true
};
}



function urlValida(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}


function limpiarFormulario() {

  document.getElementById("recursoTitulo").value = "";
  document.getElementById("recursoDescripcion").value = "";
  document.getElementById("recursoModulo").value = "";
  document.getElementById("recursoTipoContenido").value = "";
  document.getElementById("recursoFuero").value = "";
  document.getElementById("recursoTipoEscrito").value = "";
  document.getElementById("recursoUrlPdf").value = "";
  document.getElementById("recursoUrlWord").value = "";
  document.getElementById("recursoUrlVideo").value = "";
  document.getElementById("recursoTags").value = "";

  // Restaurar valores por defecto
  document.getElementById("recursoActivo").value = "true";
  document.getElementById("recursoDestacado").value = "false";
  document.getElementById("recursoNivelAcceso").value = "biblioteca";

  // Salir del modo edición
  recursoEditandoId = null;

  // Restaurar botón
  btnGuardar.textContent = "Guardar recurso";

  // Limpiar mensaje
  mensaje.textContent = "";

  // Recalcular estado del botón y progreso
  actualizarEstadoBotonGuardar();
}
