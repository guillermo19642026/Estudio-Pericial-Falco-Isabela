/* =========================================================
   FALCO® COMUNIDAD
   PROGRAMAS — LISTADO GENERAL
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const PROGRAMAS_STORAGE_KEY = "falcoComunidadProgramas";

const ESTADOS_PROGRAMA = {

  preparacion: {
    etiqueta: "En preparación",
    clase: "programa-card__estado--preparacion"
  },

  ejecucion: {
    etiqueta: "En ejecución",
    clase: "programa-card__estado--ejecucion"
  },

  pausado: {
    etiqueta: "Pausado",
    clase: "programa-card__estado--pausado"
  },

  finalizado: {
    etiqueta: "Finalizado",
    clase: "programa-card__estado--finalizado"
  },

  archivado: {
    etiqueta: "Archivado",
    clase: "programa-card__estado--archivado"
  }

};

const TIPOS_PROGRAMA = {

  formacion: "Formación",

  acompanamiento: "Acompañamiento",

  prevencion: "Prevención",

  intervencion: "Intervención",

  comunitario: "Comunitario",

  institucional: "Institucional",

  otro: "Otro"

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const programasState = {

  programas: [],

  programasFiltrados: [],

  busqueda: "",

  estado: "todos",

  tipo: "todos",

  programaPendiente: null,

  accionPendiente: null,

  temporizadorNotificacion: null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const elementos = {

  loader:
    document.getElementById("programasLoader"),

  grid:
    document.getElementById("programasGrid"),

  vacio:
    document.getElementById("programasVacio"),

  sinResultados:
    document.getElementById("programasSinResultados"),

  buscador:
    document.getElementById("buscadorProgramas"),

  filtroEstado:
    document.getElementById("filtroEstadoProgramas"),

  filtroTipo:
    document.getElementById("filtroTipoProgramas"),

  botonLimpiar:
    document.getElementById("botonLimpiarFiltros"),

  botonRestablecer:
    document.getElementById("botonRestablecerBusqueda"),

  botonActualizar:
    document.getElementById("botonActualizarProgramas"),

  indicadorTotal:
    document.getElementById("indicadorTotalProgramas"),

  indicadorActivos:
    document.getElementById("indicadorProgramasActivos"),

  indicadorPreparacion:
    document.getElementById("indicadorProgramasPreparacion"),

  indicadorFinalizados:
    document.getElementById("indicadorProgramasFinalizados"),

  contadorVisibles:
    document.getElementById("contadorProgramasVisibles"),

  notificacion:
    document.getElementById("programasNotificacion"),

  notificacionIcono:
    document.getElementById("programasNotificacionIcono"),

  notificacionTitulo:
    document.getElementById("programasNotificacionTitulo"),

  notificacionMensaje:
    document.getElementById("programasNotificacionMensaje"),

  notificacionCerrar:
    document.getElementById("programasNotificacionCerrar"),

  modal:
    document.getElementById("programasModal"),

  modalTitulo:
    document.getElementById("programasModalTitulo"),

  modalMensaje:
    document.getElementById("programasModalMensaje"),

  modalCancelar:
    document.getElementById("programasModalCancelar"),

  modalConfirmar:
    document.getElementById("programasModalConfirmar")

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarProgramas);


function iniciarProgramas() {

  registrarEventos();

  cargarProgramas();

  ocultarLoader();

  actualizarInterfaz();

  console.info(
    "FALCO Programas Comunidad™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  elementos.buscador?.addEventListener(
    "input",
    manejarBusqueda
  );

  elementos.filtroEstado?.addEventListener(
    "change",
    manejarFiltroEstado
  );

  elementos.filtroTipo?.addEventListener(
    "change",
    manejarFiltroTipo
  );

  elementos.botonLimpiar?.addEventListener(
    "click",
    limpiarFiltros
  );

  elementos.botonRestablecer?.addEventListener(
    "click",
    limpiarFiltros
  );

  elementos.botonActualizar?.addEventListener(
    "click",
    actualizarListado
  );

  elementos.grid?.addEventListener(
    "click",
    manejarAccionesTarjeta
  );

  elementos.notificacionCerrar?.addEventListener(
    "click",
    ocultarNotificacion
  );

  elementos.modalCancelar?.addEventListener(
    "click",
    cerrarModal
  );

  elementos.modalConfirmar?.addEventListener(
    "click",
    confirmarAccionModal
  );

  elementos.modal
    ?.querySelectorAll("[data-cerrar-modal]")
    .forEach((elemento) => {

      elemento.addEventListener(
        "click",
        cerrarModal
      );

    });

  document.addEventListener(
    "keydown",
    manejarTeclado
  );

  window.addEventListener(
    "storage",
    manejarCambioStorage
  );

}


/* =========================================================
   CARGA Y GUARDADO
========================================================= */

function cargarProgramas() {

  try {

    const datosGuardados =
      localStorage.getItem(PROGRAMAS_STORAGE_KEY);

    if (!datosGuardados) {

      programasState.programas = [];

      return;

    }

    const datosParseados =
      JSON.parse(datosGuardados);

    if (!Array.isArray(datosParseados)) {

      programasState.programas = [];

      return;

    }

    programasState.programas =
      datosParseados
        .map(normalizarPrograma)
        .filter(Boolean)
        .sort(ordenarProgramas);

  } catch (error) {

    console.error(
      "No fue posible cargar los programas:",
      error
    );

    programasState.programas = [];

    mostrarNotificacion({
      tipo: "error",
      titulo: "No pudimos cargar los programas",
      mensaje:
        "Se produjo un inconveniente al leer la información almacenada."
    });

  }

}


function guardarProgramas() {

  try {

    localStorage.setItem(
      PROGRAMAS_STORAGE_KEY,
      JSON.stringify(programasState.programas)
    );

    return true;

  } catch (error) {

    console.error(
      "No fue posible guardar los programas:",
      error
    );

    mostrarNotificacion({
      tipo: "error",
      titulo: "No pudimos guardar los cambios",
      mensaje:
        "La información del programa no pudo actualizarse."
    });

    return false;

  }

}


/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizarPrograma(programa) {

  if (
    !programa ||
    typeof programa !== "object"
  ) {

    return null;

  }

  const id =
    obtenerTexto(
      programa.id ||
      programa.programaId ||
      programa.uid
    );

  if (!id) {

    return null;

  }

  const fechaCreacion =
    programa.fechaCreacion ||
    programa.creadoEn ||
    programa.createdAt ||
    new Date().toISOString();

  const fechaActualizacion =
    programa.fechaActualizacion ||
    programa.actualizadoEn ||
    programa.updatedAt ||
    fechaCreacion;

  return {

    ...programa,

    id,

    nombre:
      obtenerTexto(
        programa.nombre ||
        programa.titulo ||
        programa.denominacion
      ) || "Programa sin nombre",

    descripcion:
      obtenerTexto(
        programa.descripcion ||
        programa.resumen
      ),

    tipo:
      normalizarTipo(programa.tipo),

    estado:
      normalizarEstado(programa.estado),

    responsable:
      obtenerTexto(
        programa.responsable ||
        programa.coordinador ||
        programa.referente
      ) || "Sin responsable asignado",

    institucion:
      obtenerTexto(
        programa.institucion ||
        programa.institucionNombre ||
        programa.organizacion
      ) || "Sin institución asociada",

    fechaInicio:
      programa.fechaInicio ||
      programa.inicio ||
      "",

    fechaFinalizacion:
      programa.fechaFinalizacion ||
      programa.fechaFin ||
      programa.finalizacion ||
      "",

    modalidad:
      obtenerTexto(programa.modalidad),

    alcance:
      obtenerTexto(programa.alcance),

    fechaCreacion,

    fechaActualizacion

  };

}


function normalizarEstado(valor) {

  const estado =
    normalizarTexto(valor);

  const equivalencias = {

    "en preparacion":
      "preparacion",

    "preparacion":
      "preparacion",

    "borrador":
      "preparacion",

    "en ejecucion":
      "ejecucion",

    "ejecucion":
      "ejecucion",

    "activo":
      "ejecucion",

    "activa":
      "ejecucion",

    "pausado":
      "pausado",

    "pausada":
      "pausado",

    "suspendido":
      "pausado",

    "finalizado":
      "finalizado",

    "finalizada":
      "finalizado",

    "completado":
      "finalizado",

    "archivado":
      "archivado",

    "archivada":
      "archivado"

  };

  return equivalencias[estado] || "preparacion";

}


function normalizarTipo(valor) {

  const tipo =
    normalizarTexto(valor);

  const equivalencias = {

    "formacion":
      "formacion",

    "capacitacion":
      "formacion",

    "acompanamiento":
      "acompanamiento",

    "prevencion":
      "prevencion",

    "intervencion":
      "intervencion",

    "comunitario":
      "comunitario",

    "comunitaria":
      "comunitario",

    "institucional":
      "institucional",

    "otro":
      "otro"

  };

  return equivalencias[tipo] || "otro";

}


/* =========================================================
   ACTUALIZACIÓN DE INTERFAZ
========================================================= */

function actualizarInterfaz() {

  aplicarFiltros();

  actualizarIndicadores();

  renderizarProgramas();

}


function actualizarListado() {

  mostrarLoader();

  window.setTimeout(() => {

    cargarProgramas();

    ocultarLoader();

    actualizarInterfaz();

    mostrarNotificacion({
      tipo: "success",
      titulo: "Listado actualizado",
      mensaje:
        "La información de los programas fue actualizada."
    });

  }, 350);

}


/* =========================================================
   FILTROS
========================================================= */

function manejarBusqueda(evento) {

  programasState.busqueda =
    evento.target.value.trim();

  actualizarInterfaz();

}


function manejarFiltroEstado(evento) {

  programasState.estado =
    evento.target.value;

  actualizarInterfaz();

}


function manejarFiltroTipo(evento) {

  programasState.tipo =
    evento.target.value;

  actualizarInterfaz();

}


function aplicarFiltros() {

  const busqueda =
    normalizarTexto(programasState.busqueda);

  programasState.programasFiltrados =
    programasState.programas.filter((programa) => {

      const coincideBusqueda =
        !busqueda ||
        crearCadenaBusqueda(programa)
          .includes(busqueda);

      const coincideEstado =
        programasState.estado === "todos" ||
        programa.estado === programasState.estado;

      const coincideTipo =
        programasState.tipo === "todos" ||
        programa.tipo === programasState.tipo;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideTipo
      );

    });

}


function limpiarFiltros() {

  programasState.busqueda = "";

  programasState.estado = "todos";

  programasState.tipo = "todos";

  if (elementos.buscador) {

    elementos.buscador.value = "";

  }

  if (elementos.filtroEstado) {

    elementos.filtroEstado.value = "todos";

  }

  if (elementos.filtroTipo) {

    elementos.filtroTipo.value = "todos";

  }

  actualizarInterfaz();

  elementos.buscador?.focus();

}


function crearCadenaBusqueda(programa) {

  return normalizarTexto([

    programa.nombre,

    programa.descripcion,

    programa.responsable,

    programa.institucion,

    TIPOS_PROGRAMA[programa.tipo],

    ESTADOS_PROGRAMA[programa.estado]?.etiqueta,

    programa.modalidad,

    programa.alcance

  ].join(" "));

}


/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadores() {

  const total =
    programasState.programas.length;

  const activos =
    programasState.programas.filter(
      (programa) =>
        programa.estado === "ejecucion"
    ).length;

  const preparacion =
    programasState.programas.filter(
      (programa) =>
        programa.estado === "preparacion"
    ).length;

  const finalizados =
    programasState.programas.filter(
      (programa) =>
        programa.estado === "finalizado"
    ).length;

  establecerTexto(
    elementos.indicadorTotal,
    total
  );

  establecerTexto(
    elementos.indicadorActivos,
    activos
  );

  establecerTexto(
    elementos.indicadorPreparacion,
    preparacion
  );

  establecerTexto(
    elementos.indicadorFinalizados,
    finalizados
  );

  establecerTexto(
    elementos.contadorVisibles,
    programasState.programasFiltrados.length
  );

}


/* =========================================================
   RENDERIZADO
========================================================= */

function renderizarProgramas() {

  if (!elementos.grid) {

    return;

  }

  elementos.grid.innerHTML = "";

  const hayProgramas =
    programasState.programas.length > 0;

  const hayResultados =
    programasState.programasFiltrados.length > 0;

  ocultarElemento(elementos.vacio);

  ocultarElemento(elementos.sinResultados);

  if (!hayProgramas) {

    ocultarElemento(elementos.grid);

    mostrarElemento(elementos.vacio);

    return;

  }

  if (!hayResultados) {

    ocultarElemento(elementos.grid);

    mostrarElemento(elementos.sinResultados);

    return;

  }

  mostrarElemento(elementos.grid);

  const fragmento =
    document.createDocumentFragment();

  programasState.programasFiltrados
    .forEach((programa) => {

      fragmento.appendChild(
        crearTarjetaPrograma(programa)
      );

    });

  elementos.grid.appendChild(fragmento);

}


function crearTarjetaPrograma(programa) {

  const articulo =
    document.createElement("article");

  articulo.className =
    "programa-card";

  articulo.dataset.programaId =
    programa.id;

  const estado =
    ESTADOS_PROGRAMA[programa.estado] ||
    ESTADOS_PROGRAMA.preparacion;

  const tipo =
    TIPOS_PROGRAMA[programa.tipo] ||
    TIPOS_PROGRAMA.otro;

  const fechaInicio =
    formatearFecha(programa.fechaInicio);

  const fechaFinalizacion =
    formatearFecha(programa.fechaFinalizacion);

  articulo.innerHTML = `
    <div class="programa-card__cabecera">

      <p class="programa-card__tipo">
        ${escaparHTML(tipo)}
      </p>

      <span class="programa-card__estado ${estado.clase}">
        ${escaparHTML(estado.etiqueta)}
      </span>

    </div>


    <div class="programa-card__contenido">

      <h3 class="programa-card__titulo">
        ${escaparHTML(programa.nombre)}
      </h3>

      <p class="programa-card__descripcion">
        ${
          escaparHTML(
            programa.descripcion ||
            "Sin descripción registrada."
          )
        }
      </p>

    </div>


    <dl class="programa-card__datos">

      <div class="programa-card__dato">

        <dt>
          Institución
        </dt>

        <dd title="${escaparAtributo(programa.institucion)}">
          ${escaparHTML(programa.institucion)}
        </dd>

      </div>


      <div class="programa-card__dato">

        <dt>
          Modalidad
        </dt>

        <dd title="${escaparAtributo(programa.modalidad || "Sin definir")}">
          ${escaparHTML(programa.modalidad || "Sin definir")}
        </dd>

      </div>


      <div class="programa-card__dato">

        <dt>
          Inicio
        </dt>

        <dd>
          ${escaparHTML(fechaInicio)}
        </dd>

      </div>


      <div class="programa-card__dato">

        <dt>
          Finalización
        </dt>

        <dd>
          ${escaparHTML(fechaFinalizacion)}
        </dd>

      </div>

    </dl>


    <div class="programa-card__pie">

      <div class="programa-card__responsable">

        <span>
          Responsable
        </span>

        <span title="${escaparAtributo(programa.responsable)}">
          ${escaparHTML(programa.responsable)}
        </span>

      </div>


      <button
        type="button"
        class="programa-card__enlace"
        data-accion="administrar"
        data-programa-id="${escaparAtributo(programa.id)}"
        aria-label="Administrar programa ${escaparAtributo(programa.nombre)}"
      >
        Administrar

        <span aria-hidden="true">
          →
        </span>
      </button>

    </div>
  `;

  return articulo;

}


/* =========================================================
   ACCIONES DE TARJETA
========================================================= */

function manejarAccionesTarjeta(evento) {

  const boton =
    evento.target.closest(
      "[data-accion][data-programa-id]"
    );

  if (!boton) {

    return;

  }

  const programaId =
    boton.dataset.programaId;

  const accion =
    boton.dataset.accion;

  const programa =
    buscarProgramaPorId(programaId);

  if (!programa) {

    mostrarNotificacion({
      tipo: "error",
      titulo: "Programa no encontrado",
      mensaje:
        "No fue posible localizar la información seleccionada."
    });

    return;

  }

  switch (accion) {

    case "administrar":

      abrirPrograma(programa.id);

      break;

    case "archivar":

      solicitarArchivarPrograma(programa);

      break;

    case "eliminar":

      solicitarEliminarPrograma(programa);

      break;

    default:

      console.warn(
        "Acción de programa no reconocida:",
        accion
      );

  }

}


function abrirPrograma(programaId) {

  const destino =
    new URL(
      "./programa.html",
      window.location.href
    );

  destino.searchParams.set(
    "id",
    programaId
  );

  window.location.href =
    destino.toString();

}


function buscarProgramaPorId(programaId) {

  return programasState.programas.find(
    (programa) =>
      programa.id === programaId
  ) || null;

}


/* =========================================================
   ARCHIVAR Y ELIMINAR
========================================================= */

function solicitarArchivarPrograma(programa) {

  programasState.programaPendiente =
    programa.id;

  programasState.accionPendiente =
    "archivar";

  abrirModal({

    titulo:
      "Archivar programa",

    mensaje:
      `¿Querés archivar el programa “${programa.nombre}”? Podrá conservarse en el registro institucional.`,

    textoConfirmar:
      "Archivar"

  });

}


function solicitarEliminarPrograma(programa) {

  programasState.programaPendiente =
    programa.id;

  programasState.accionPendiente =
    "eliminar";

  abrirModal({

    titulo:
      "Eliminar programa",

    mensaje:
      `¿Querés eliminar definitivamente el programa “${programa.nombre}”? Esta acción no puede deshacerse.`,

    textoConfirmar:
      "Eliminar"

  });

}


function confirmarAccionModal() {

  const programaId =
    programasState.programaPendiente;

  const accion =
    programasState.accionPendiente;

  if (!programaId || !accion) {

    cerrarModal();

    return;

  }

  if (accion === "archivar") {

    archivarPrograma(programaId);

  }

  if (accion === "eliminar") {

    eliminarPrograma(programaId);

  }

  cerrarModal();

}


function archivarPrograma(programaId) {

  const indice =
    programasState.programas.findIndex(
      (programa) =>
        programa.id === programaId
    );

  if (indice === -1) {

    return;

  }

  programasState.programas[indice] = {

    ...programasState.programas[indice],

    estado:
      "archivado",

    fechaActualizacion:
      new Date().toISOString()

  };

  if (!guardarProgramas()) {

    return;

  }

  actualizarInterfaz();

  mostrarNotificacion({
    tipo: "success",
    titulo: "Programa archivado",
    mensaje:
      "El programa fue archivado correctamente."
  });

}


function eliminarPrograma(programaId) {

  const cantidadAnterior =
    programasState.programas.length;

  programasState.programas =
    programasState.programas.filter(
      (programa) =>
        programa.id !== programaId
    );

  if (
    programasState.programas.length ===
    cantidadAnterior
  ) {

    return;

  }

  if (!guardarProgramas()) {

    cargarProgramas();

    actualizarInterfaz();

    return;

  }

  actualizarInterfaz();

  mostrarNotificacion({
    tipo: "success",
    titulo: "Programa eliminado",
    mensaje:
      "El programa fue eliminado del registro."
  });

}


/* =========================================================
   MODAL
========================================================= */

function abrirModal({
  titulo,
  mensaje,
  textoConfirmar
}) {

  if (!elementos.modal) {

    return;

  }

  establecerTexto(
    elementos.modalTitulo,
    titulo
  );

  establecerTexto(
    elementos.modalMensaje,
    mensaje
  );

  establecerTexto(
    elementos.modalConfirmar,
    textoConfirmar
  );

  elementos.modal.hidden = false;

  document.body.style.overflow =
    "hidden";

  window.setTimeout(() => {

    elementos.modalConfirmar?.focus();

  }, 50);

}


function cerrarModal() {

  if (!elementos.modal) {

    return;

  }

  elementos.modal.hidden = true;

  document.body.style.overflow = "";

  programasState.programaPendiente =
    null;

  programasState.accionPendiente =
    null;

}


function manejarTeclado(evento) {

  if (
    evento.key === "Escape" &&
    elementos.modal &&
    !elementos.modal.hidden
  ) {

    cerrarModal();

  }

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacion({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (!elementos.notificacion) {

    return;

  }

  window.clearTimeout(
    programasState.temporizadorNotificacion
  );

  const configuracion =
    obtenerConfiguracionNotificacion(tipo);

  establecerTexto(
    elementos.notificacionIcono,
    configuracion.icono
  );

  establecerTexto(
    elementos.notificacionTitulo,
    titulo
  );

  establecerTexto(
    elementos.notificacionMensaje,
    mensaje
  );

  elementos.notificacion.style.borderColor =
    configuracion.borde;

  elementos.notificacionIcono.style.color =
    configuracion.color;

  elementos.notificacionIcono.style.borderColor =
    configuracion.borde;

  elementos.notificacionIcono.style.background =
    configuracion.fondo;

  elementos.notificacion.hidden =
    false;

  programasState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacion,
      4500
    );

}


function ocultarNotificacion() {

  if (!elementos.notificacion) {

    return;

  }

  elementos.notificacion.hidden =
    true;

  window.clearTimeout(
    programasState.temporizadorNotificacion
  );

}


function obtenerConfiguracionNotificacion(tipo) {

  const configuraciones = {

    success: {
      icono: "✓",
      color: "#7bc7a4",
      borde: "rgba(123, 199, 164, 0.28)",
      fondo: "rgba(123, 199, 164, 0.10)"
    },

    error: {
      icono: "!",
      color: "#d88282",
      borde: "rgba(216, 130, 130, 0.30)",
      fondo: "rgba(216, 130, 130, 0.10)"
    },

    info: {
      icono: "i",
      color: "#78a8e4",
      borde: "rgba(120, 168, 228, 0.28)",
      fondo: "rgba(120, 168, 228, 0.10)"
    }

  };

  return (
    configuraciones[tipo] ||
    configuraciones.success
  );

}


/* =========================================================
   LOADER
========================================================= */

function mostrarLoader() {

  mostrarElemento(elementos.loader);

  ocultarElemento(elementos.grid);

  ocultarElemento(elementos.vacio);

  ocultarElemento(elementos.sinResultados);

}


function ocultarLoader() {

  ocultarElemento(elementos.loader);

}


/* =========================================================
   CAMBIOS ENTRE PESTAÑAS
========================================================= */

function manejarCambioStorage(evento) {

  if (
    evento.key !== PROGRAMAS_STORAGE_KEY
  ) {

    return;

  }

  cargarProgramas();

  actualizarInterfaz();

}


/* =========================================================
   UTILIDADES DE FECHA
========================================================= */

function formatearFecha(valor) {

  if (!valor) {

    return "Sin fecha definida";

  }

  try {

    const fecha =
      crearFechaSegura(valor);

    if (
      !fecha ||
      Number.isNaN(fecha.getTime())
    ) {

      return "Sin fecha definida";

    }

    return new Intl.DateTimeFormat(
      "es-AR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    ).format(fecha);

  } catch {

    return "Sin fecha definida";

  }

}


function crearFechaSegura(valor) {

  if (valor instanceof Date) {

    return valor;

  }

  if (
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(valor)
  ) {

    const [
      anio,
      mes,
      dia
    ] = valor.split("-").map(Number);

    return new Date(
      anio,
      mes - 1,
      dia
    );

  }

  return new Date(valor);

}


/* =========================================================
   ORDENAMIENTO
========================================================= */

function ordenarProgramas(programaA, programaB) {

  const fechaA =
    new Date(
      programaA.fechaActualizacion ||
      programaA.fechaCreacion ||
      0
    ).getTime();

  const fechaB =
    new Date(
      programaB.fechaActualizacion ||
      programaB.fechaCreacion ||
      0
    ).getTime();

  if (
    !Number.isNaN(fechaA) &&
    !Number.isNaN(fechaB) &&
    fechaA !== fechaB
  ) {

    return fechaB - fechaA;

  }

  return programaA.nombre.localeCompare(
    programaB.nombre,
    "es",
    {
      sensitivity: "base"
    }
  );

}


/* =========================================================
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTexto(valor) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return "";

  }

  return String(valor).trim();

}


function normalizarTexto(valor) {

  return obtenerTexto(valor)
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}


function escaparHTML(valor) {

  return obtenerTexto(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escaparAtributo(valor) {

  return escaparHTML(valor)
    .replace(/`/g, "&#096;");

}


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTexto(elemento, valor) {

  if (!elemento) {

    return;

  }

  elemento.textContent =
    String(valor);

}


function mostrarElemento(elemento) {

  if (!elemento) {

    return;

  }

  elemento.hidden = false;

}


function ocultarElemento(elemento) {

  if (!elemento) {

    return;

  }

  elemento.hidden = true;

}