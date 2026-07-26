/* =========================================================
   SISTEMA FALCO®
   ESCUELA PARA PADRES
   ADMINISTRACIÓN DE PARTICIPANTES

   Archivo:
   escuela-admin/participantes/participantes.js

   Versión:
   Participantes Admin™ v1.0

   IMPORTANTE:
   En esta etapa no se conecta con Firebase.
   La fuente de datos temporal está vacía.
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

  participantesPorPagina: 10,

  fichaUrl: "../ficha/participante.html",

  estadosPermitidos: [
    "activo",
    "pendiente",
    "inactivo",
    "finalizado"
  ]

};


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

const state = {

  participantes: [],

  participantesFiltrados: [],

  paginaActual: 1,

  participanteSeleccionado: null,

  accionPendiente: null,

  cargando: false,

  error: null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const dom = {

  /* Resumen */

  totalParticipantes:
    document.getElementById("totalParticipantes"),

  totalActivos:
    document.getElementById("totalActivos"),

  totalEnCurso:
    document.getElementById("totalEnCurso"),

  totalFinalizados:
    document.getElementById("totalFinalizados"),


  /* Filtros */

  buscarParticipante:
    document.getElementById("buscarParticipante"),

  filtroEstado:
    document.getElementById("filtroEstado"),

  filtroProgreso:
    document.getElementById("filtroProgreso"),

  btnLimpiarFiltros:
    document.getElementById("btnLimpiarFiltros"),

  btnRestablecerBusqueda:
    document.getElementById("btnRestablecerBusqueda"),


  /* Tabla */

  tablaContenedor:
    document.getElementById("tablaParticipantesContenedor"),

  tablaBody:
    document.getElementById("participantesTablaBody"),


  /* Estados */

  estadoVacio:
    document.getElementById("estadoVacio"),

  estadoSinResultados:
    document.getElementById("estadoSinResultados"),

  estadoCarga:
    document.getElementById("estadoCarga"),

  estadoError:
    document.getElementById("estadoError"),

  estadoErrorMensaje:
    document.getElementById("estadoErrorMensaje"),

  btnReintentar:
    document.getElementById("btnReintentar"),


  /* Paginación */

  paginacion:
    document.getElementById("participantesPaginacion"),

  btnPaginaAnterior:
    document.getElementById("btnPaginaAnterior"),

  btnPaginaSiguiente:
    document.getElementById("btnPaginaSiguiente"),

  paginacionInformacion:
    document.getElementById("paginacionInformacion"),


  /* Modal */

  modal:
    document.getElementById("modalConfirmacion"),

  modalTitulo:
    document.getElementById("modalConfirmacionTitulo"),

  modalTexto:
    document.getElementById("modalConfirmacionTexto"),

  btnCancelarAccion:
    document.getElementById("btnCancelarAccion"),

  btnConfirmarAccion:
    document.getElementById("btnConfirmarAccion")

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function init() {

  registrarEventos();

  cargarParticipantes();

  console.log(
    "FALCO Participantes Admin™ v1.0 Ready"
  );

}


/* =========================================================
   CARGA DE PARTICIPANTES
========================================================= */

async function cargarParticipantes() {

  mostrarCarga();

  try {

    /*
      ======================================================
      FUENTE TEMPORAL

      En la próxima etapa esta línea será reemplazada por
      la consulta correspondiente a Firebase / Firestore.
      ======================================================
    */

    const participantes = [];


    state.participantes =
      normalizarParticipantes(participantes);

    state.participantesFiltrados =
      [...state.participantes];

    state.paginaActual = 1;

    state.error = null;

    actualizarInterfaz();

  } catch (error) {

    console.error(
      "Error al cargar participantes:",
      error
    );

    mostrarError(
      "No fue posible cargar la información de participantes."
    );

  }

}


/* =========================================================
   NORMALIZACIÓN DE DATOS
========================================================= */

function normalizarParticipantes(participantes) {

  if (!Array.isArray(participantes)) {
    return [];
  }

  return participantes.map((participante, indice) => {

    const nombre =
      limpiarTexto(participante.nombre);

    const apellido =
      limpiarTexto(participante.apellido);

    const estado =
      CONFIG.estadosPermitidos.includes(participante.estado)
        ? participante.estado
        : "pendiente";

    const progreso =
      limitarNumero(
        Number(participante.progreso) || 0,
        0,
        100
      );

    return {

      id:
        participante.id ||
        `participante-${indice + 1}`,

      nombre,

      apellido,

      nombreCompleto:
        `${nombre} ${apellido}`.trim() ||
        "Participante sin identificar",

      dni:
        limpiarTexto(participante.dni),

      correo:
        limpiarTexto(participante.correo),

      telefono:
        limpiarTexto(participante.telefono),

      fechaAlta:
        participante.fechaAlta || null,

      estado,

      progreso,

      recorrido:
        obtenerEstadoProgreso(progreso)

    };

  });

}


/* =========================================================
   ACTUALIZACIÓN GENERAL
========================================================= */

function actualizarInterfaz() {

  state.cargando = false;

  ocultarEstados();

  actualizarResumen();

  aplicarFiltros();

}


/* =========================================================
   RESUMEN
========================================================= */

function actualizarResumen() {

  const total =
    state.participantes.length;

  const activos =
    state.participantes.filter(
      participante =>
        participante.estado === "activo"
    ).length;

  const enCurso =
    state.participantes.filter(
      participante =>
        participante.progreso > 0 &&
        participante.progreso < 100
    ).length;

  const finalizados =
    state.participantes.filter(
      participante =>
        participante.estado === "finalizado" ||
        participante.progreso === 100
    ).length;

  escribirNumero(
    dom.totalParticipantes,
    total
  );

  escribirNumero(
    dom.totalActivos,
    activos
  );

  escribirNumero(
    dom.totalEnCurso,
    enCurso
  );

  escribirNumero(
    dom.totalFinalizados,
    finalizados
  );

}


/* =========================================================
   FILTROS
========================================================= */

function aplicarFiltros() {

  const texto =
    limpiarTexto(
      dom.buscarParticipante?.value
    ).toLowerCase();

  const estado =
    dom.filtroEstado?.value || "todos";

  const progreso =
    dom.filtroProgreso?.value || "todos";


  state.participantesFiltrados =
    state.participantes.filter(
      participante => {

        const coincideTexto =
          !texto ||
          [
            participante.nombreCompleto,
            participante.dni,
            participante.correo,
            participante.telefono
          ]
            .join(" ")
            .toLowerCase()
            .includes(texto);


        const coincideEstado =
          estado === "todos" ||
          participante.estado === estado;


        const coincideProgreso =
          progreso === "todos" ||
          participante.recorrido === progreso;


        return (
          coincideTexto &&
          coincideEstado &&
          coincideProgreso
        );

      }
    );


  state.paginaActual = 1;

  renderizarListado();

}


/* =========================================================
   RENDERIZADO PRINCIPAL
========================================================= */

function renderizarListado() {

  ocultarEstados();

  const totalOriginal =
    state.participantes.length;

  const totalFiltrado =
    state.participantesFiltrados.length;


  if (totalOriginal === 0) {

    mostrarEstadoVacio();

    return;

  }


  if (totalFiltrado === 0) {

    mostrarSinResultados();

    return;

  }


  mostrarTabla();

  renderizarFilas();

  actualizarPaginacion();

}


/* =========================================================
   RENDERIZADO DE FILAS
========================================================= */

function renderizarFilas() {

  if (!dom.tablaBody) {
    return;
  }

  const participantesPagina =
    obtenerParticipantesPagina();

  dom.tablaBody.innerHTML =
    participantesPagina
      .map(crearFilaParticipante)
      .join("");

}


/* =========================================================
   CREACIÓN DE FILA
========================================================= */

function crearFilaParticipante(participante) {

  const iniciales =
    obtenerIniciales(
      participante.nombre,
      participante.apellido
    );

  const fechaAlta =
    formatearFecha(
      participante.fechaAlta
    );

  const telefono =
    participante.telefono ||
    "Sin teléfono";

  const correo =
    participante.correo ||
    "Sin correo";

  const dni =
    participante.dni
      ? `DNI ${escapeHTML(participante.dni)}`
      : "DNI no informado";

  const fichaUrl =
    `${CONFIG.fichaUrl}?id=${encodeURIComponent(
      participante.id
    )}`;


  return `
    <tr data-participante-id="${escapeHTML(participante.id)}">

      <td>

        <div class="participante-identidad">

          <div
            class="participante-avatar"
            aria-hidden="true"
          >
            ${escapeHTML(iniciales)}
          </div>

          <div class="participante-identidad-texto">

            <strong>
              ${escapeHTML(participante.nombreCompleto)}
            </strong>

            <span>
              ${dni}
            </span>

          </div>

        </div>

      </td>


      <td>

        <div class="participante-contacto">

          ${
            participante.correo
              ? `
                <a href="mailto:${escapeHTML(participante.correo)}">
                  ${escapeHTML(correo)}
                </a>
              `
              : `
                <span>
                  ${escapeHTML(correo)}
                </span>
              `
          }

          <span>
            ${escapeHTML(telefono)}
          </span>

        </div>

      </td>


      <td>
        ${escapeHTML(fechaAlta)}
      </td>


      <td>

        <span
          class="
            participante-estado
            participante-estado--${escapeHTML(participante.estado)}
          "
        >
          ${escapeHTML(formatearEstado(participante.estado))}
        </span>

      </td>


      <td>

        <div class="participante-progreso">

          <div
            class="participante-progreso-barra"
            aria-hidden="true"
          >

            <span
              class="participante-progreso-valor"
              style="width: ${participante.progreso}%"
            ></span>

          </div>

          <span class="participante-progreso-numero">
            ${participante.progreso}%
          </span>

        </div>

      </td>


      <td>

        <div class="participante-acciones-fila">

          <a
            class="participante-boton-accion"
            href="${fichaUrl}"
          >
            Ver ficha
          </a>

          <button
            class="participante-boton-accion"
            type="button"
            data-accion="editar"
            data-id="${escapeHTML(participante.id)}"
          >
            Editar
          </button>

          <button
            class="
              participante-boton-accion
              participante-boton-accion--peligro
            "
            type="button"
            data-accion="eliminar"
            data-id="${escapeHTML(participante.id)}"
          >
            Eliminar
          </button>

        </div>

      </td>

    </tr>
  `;

}


/* =========================================================
   PAGINACIÓN
========================================================= */

function obtenerParticipantesPagina() {

  const inicio =
    (
      state.paginaActual - 1
    ) * CONFIG.participantesPorPagina;

  const fin =
    inicio + CONFIG.participantesPorPagina;

  return state.participantesFiltrados.slice(
    inicio,
    fin
  );

}


function actualizarPaginacion() {

  if (!dom.paginacion) {
    return;
  }

  const totalPaginas =
    Math.ceil(
      state.participantesFiltrados.length /
      CONFIG.participantesPorPagina
    );


  if (totalPaginas <= 1) {

    dom.paginacion.hidden = true;

    return;

  }


  dom.paginacion.hidden = false;


  if (dom.paginacionInformacion) {

    dom.paginacionInformacion.textContent =
      `Página ${state.paginaActual} de ${totalPaginas}`;

  }


  if (dom.btnPaginaAnterior) {

    dom.btnPaginaAnterior.disabled =
      state.paginaActual <= 1;

  }


  if (dom.btnPaginaSiguiente) {

    dom.btnPaginaSiguiente.disabled =
      state.paginaActual >= totalPaginas;

  }

}


function irPaginaAnterior() {

  if (state.paginaActual <= 1) {
    return;
  }

  state.paginaActual -= 1;

  renderizarListado();

  desplazarHaciaTabla();

}


function irPaginaSiguiente() {

  const totalPaginas =
    Math.ceil(
      state.participantesFiltrados.length /
      CONFIG.participantesPorPagina
    );

  if (state.paginaActual >= totalPaginas) {
    return;
  }

  state.paginaActual += 1;

  renderizarListado();

  desplazarHaciaTabla();

}


/* =========================================================
   ESTADOS VISUALES
========================================================= */

function ocultarEstados() {

  cambiarHidden(dom.tablaContenedor, true);

  cambiarHidden(dom.estadoVacio, true);

  cambiarHidden(dom.estadoSinResultados, true);

  cambiarHidden(dom.estadoCarga, true);

  cambiarHidden(dom.estadoError, true);

  cambiarHidden(dom.paginacion, true);

}


function mostrarCarga() {

  state.cargando = true;

  ocultarEstados();

  cambiarHidden(dom.estadoCarga, false);

}


function mostrarEstadoVacio() {

  cambiarHidden(dom.estadoVacio, false);

}


function mostrarSinResultados() {

  cambiarHidden(dom.estadoSinResultados, false);

}


function mostrarTabla() {

  cambiarHidden(dom.tablaContenedor, false);

}


function mostrarError(mensaje) {

  state.cargando = false;

  state.error = mensaje;

  ocultarEstados();

  if (dom.estadoErrorMensaje) {
    dom.estadoErrorMensaje.textContent = mensaje;
  }

  cambiarHidden(dom.estadoError, false);

}


/* =========================================================
   ACCIONES DE TABLA
========================================================= */

function manejarClickTabla(event) {

  const boton =
    event.target.closest("[data-accion]");

  if (!boton) {
    return;
  }

  const accion =
    boton.dataset.accion;

  const id =
    boton.dataset.id;

  const participante =
    buscarParticipantePorId(id);

  if (!participante) {
    return;
  }


  if (accion === "editar") {

    abrirFicha(participante.id);

    return;

  }


  if (accion === "eliminar") {

    solicitarEliminacion(participante);

  }

}


/* =========================================================
   FICHA
========================================================= */

function abrirFicha(id) {

  const url =
    `${CONFIG.fichaUrl}?id=${encodeURIComponent(id)}&modo=editar`;

  window.location.href = url;

}


/* =========================================================
   ELIMINACIÓN
========================================================= */

function solicitarEliminacion(participante) {

  state.participanteSeleccionado =
    participante;

  state.accionPendiente =
    "eliminar";

  abrirModal({

    titulo:
      "Eliminar participante",

    texto:
      `¿Deseás eliminar a ${participante.nombreCompleto}? Esta acción deberá confirmarse antes de continuar.`,

    textoBoton:
      "Eliminar"

  });

}


function confirmarAccion() {

  if (
    state.accionPendiente !== "eliminar" ||
    !state.participanteSeleccionado
  ) {

    cerrarModal();

    return;

  }

  /*
    ========================================================
    ETAPA TEMPORAL

    Cuando se conecte Firebase, aquí se realizará la baja
    correspondiente en Firestore y Authentication.
    ========================================================
  */

  const id =
    state.participanteSeleccionado.id;

  state.participantes =
    state.participantes.filter(
      participante =>
        participante.id !== id
    );

  cerrarModal();

  actualizarResumen();

  aplicarFiltros();

}


/* =========================================================
   MODAL
========================================================= */

function abrirModal({

  titulo = "Confirmar acción",

  texto = "¿Deseás continuar?",

  textoBoton = "Confirmar"

} = {}) {

  if (!dom.modal) {
    return;
  }

  if (dom.modalTitulo) {
    dom.modalTitulo.textContent = titulo;
  }

  if (dom.modalTexto) {
    dom.modalTexto.textContent = texto;
  }

  if (dom.btnConfirmarAccion) {
    dom.btnConfirmarAccion.textContent = textoBoton;
  }

  dom.modal.hidden = false;

  dom.modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  dom.btnCancelarAccion?.focus();

}


function cerrarModal() {

  if (!dom.modal) {
    return;
  }

  dom.modal.hidden = true;

  dom.modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  state.participanteSeleccionado =
    null;

  state.accionPendiente =
    null;

}


/* =========================================================
   LIMPIEZA DE FILTROS
========================================================= */

function limpiarFiltros() {

  if (dom.buscarParticipante) {
    dom.buscarParticipante.value = "";
  }

  if (dom.filtroEstado) {
    dom.filtroEstado.value = "todos";
  }

  if (dom.filtroProgreso) {
    dom.filtroProgreso.value = "todos";
  }

  aplicarFiltros();

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  dom.buscarParticipante?.addEventListener(
    "input",
    aplicarFiltros
  );

  dom.filtroEstado?.addEventListener(
    "change",
    aplicarFiltros
  );

  dom.filtroProgreso?.addEventListener(
    "change",
    aplicarFiltros
  );

  dom.btnLimpiarFiltros?.addEventListener(
    "click",
    limpiarFiltros
  );

  dom.btnRestablecerBusqueda?.addEventListener(
    "click",
    limpiarFiltros
  );

  dom.btnReintentar?.addEventListener(
    "click",
    cargarParticipantes
  );

  dom.btnPaginaAnterior?.addEventListener(
    "click",
    irPaginaAnterior
  );

  dom.btnPaginaSiguiente?.addEventListener(
    "click",
    irPaginaSiguiente
  );

  dom.tablaBody?.addEventListener(
    "click",
    manejarClickTabla
  );

  dom.btnCancelarAccion?.addEventListener(
    "click",
    cerrarModal
  );

  dom.btnConfirmarAccion?.addEventListener(
    "click",
    confirmarAccion
  );

  dom.modal
    ?.querySelectorAll("[data-modal-cerrar]")
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        cerrarModal
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        dom.modal &&
        !dom.modal.hidden
      ) {

        cerrarModal();

      }

    }
  );

}


/* =========================================================
   UTILIDADES
========================================================= */

function buscarParticipantePorId(id) {

  return state.participantes.find(
    participante =>
      participante.id === id
  ) || null;

}


function obtenerEstadoProgreso(progreso) {

  if (progreso <= 0) {
    return "sin-iniciar";
  }

  if (progreso >= 100) {
    return "completo";
  }

  return "en-curso";

}


function formatearEstado(estado) {

  const etiquetas = {

    activo:
      "Activo",

    pendiente:
      "Pendiente",

    inactivo:
      "Inactivo",

    finalizado:
      "Finalizado"

  };

  return etiquetas[estado] || "Pendiente";

}


function formatearFecha(valor) {

  if (!valor) {
    return "Sin fecha";
  }

  let fecha;


  if (
    typeof valor === "object" &&
    typeof valor.toDate === "function"
  ) {

    fecha = valor.toDate();

  } else {

    fecha = new Date(valor);

  }


  if (
    Number.isNaN(fecha.getTime())
  ) {

    return "Sin fecha";

  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(fecha);

}


function obtenerIniciales(nombre, apellido) {

  const primera =
    limpiarTexto(nombre)
      .charAt(0);

  const segunda =
    limpiarTexto(apellido)
      .charAt(0);

  return (
    `${primera}${segunda}`.toUpperCase() ||
    "PF"
  );

}


function escribirNumero(elemento, valor) {

  if (!elemento) {
    return;
  }

  elemento.textContent =
    String(valor);

}


function cambiarHidden(elemento, oculto) {

  if (!elemento) {
    return;
  }

  elemento.hidden = oculto;

}


function limpiarTexto(valor) {

  return String(valor ?? "")
    .trim()
    .replace(/\s+/g, " ");

}


function limitarNumero(
  valor,
  minimo,
  maximo
) {

  return Math.min(
    Math.max(valor, minimo),
    maximo
  );

}


function escapeHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function desplazarHaciaTabla() {

  dom.tablaContenedor?.scrollIntoView({

    behavior:
      "smooth",

    block:
      "start"

  });

}


/* =========================================================
   INICIO
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}