/* =========================================================
   SISTEMA FALCO®
   ESCUELA PARA PADRES
   DASHBOARD ADMINISTRATIVO

   Archivo:
   escuela-admin/dashboard/dashboard.js

   Versión:
   Dashboard Admin™ v1.0
========================================================= */

import {
  obtenerTodos
} from "../shared/firebase/participantes.js";


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const dom = {

  totalParticipantes:
    document.getElementById("totalParticipantes"),

  participantesEnCurso:
    document.getElementById("participantesEnCurso"),

  participantesFinalizados:
    document.getElementById("participantesFinalizados"),

  totalCertificados:
    document.getElementById("totalCertificados"),

  actividadReciente:
    document.getElementById("actividadReciente")

};


/* =========================================================
   ESTADO
========================================================= */

const state = {

  participantes: [],

  cargando: false,

  error: null

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

async function init() {

  console.log(
    "FALCO Dashboard Admin™ v1.0 Ready"
  );

  await cargarDashboard();

}


/* =========================================================
   CARGA GENERAL
========================================================= */

async function cargarDashboard() {

  state.cargando = true;

  mostrarEstadoCarga();

  try {

    const participantes =
      await obtenerTodos();

    state.participantes =
      Array.isArray(participantes)
        ? participantes
        : [];

    state.error = null;

    actualizarIndicadores();

    actualizarActividadReciente();

  } catch (error) {

    console.error(
      "Error al cargar el dashboard:",
      error
    );

    state.error = error;

    escribirNumero(
      dom.totalParticipantes,
      0
    );

    escribirNumero(
      dom.participantesEnCurso,
      0
    );

    escribirNumero(
      dom.participantesFinalizados,
      0
    );

    escribirNumero(
      dom.totalCertificados,
      0
    );

    mostrarError();

  } finally {

    state.cargando = false;

  }

}


/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadores() {

  const participantesValidos =
    state.participantes.filter(
      participante =>
        tieneDatosParticipante(participante)
    );


  const total =
    participantesValidos.length;


  const enCurso =
    participantesValidos.filter(
      participante => {

        const estado =
          limpiarTexto(
            participante.estado
          ).toLowerCase();

        const porcentaje =
          obtenerPorcentaje(participante);

        return (
          estado === "activo" &&
          porcentaje < 100
        );

      }
    ).length;


  const finalizados =
    participantesValidos.filter(
      participante => {

        const estado =
          limpiarTexto(
            participante.estado
          ).toLowerCase();

        const porcentaje =
          obtenerPorcentaje(participante);

        return (
          estado === "finalizado" ||
          porcentaje >= 100
        );

      }
    ).length;


  const certificados =
    participantesValidos.filter(
      participante =>
        participante.certificado?.emitido === true
    ).length;


  escribirNumero(
    dom.totalParticipantes,
    total
  );

  escribirNumero(
    dom.participantesEnCurso,
    enCurso
  );

  escribirNumero(
    dom.participantesFinalizados,
    finalizados
  );

  escribirNumero(
    dom.totalCertificados,
    certificados
  );

}


/* =========================================================
   ACTIVIDAD RECIENTE
========================================================= */

function actualizarActividadReciente() {

  if (!dom.actividadReciente) {
    return;
  }


  const participantesValidos =
    state.participantes
      .filter(
        participante =>
          tieneDatosParticipante(participante)
      )
      .sort(
        (a, b) =>
          obtenerMilisegundosFecha(b.creado) -
          obtenerMilisegundosFecha(a.creado)
      );


  if (participantesValidos.length === 0) {

    dom.actividadReciente.innerHTML = `
      <p>
        Todavía no hay actividad registrada.
        Cuando se incorporen participantes,
        sus avances aparecerán en esta sección.
      </p>
    `;

    return;

  }


  const ultimoParticipante =
    participantesValidos[0];


  const nombreCompleto =
    obtenerNombreCompleto(
      ultimoParticipante
    );


  const fecha =
    formatearFecha(
      ultimoParticipante.creado
    );


  const porcentaje =
    obtenerPorcentaje(
      ultimoParticipante
    );


  dom.actividadReciente.innerHTML = `
    <p>
      Último participante registrado:
      <strong>${escapeHTML(nombreCompleto)}</strong>.
      Fecha de alta:
      <strong>${escapeHTML(fecha)}</strong>.
      Progreso actual:
      <strong>${porcentaje}%</strong>.
    </p>
  `;

}


/* =========================================================
   ESTADOS VISUALES
========================================================= */

function mostrarEstadoCarga() {

  if (!dom.actividadReciente) {
    return;
  }

  dom.actividadReciente.innerHTML = `
    <p>
      Cargando información del panel…
    </p>
  `;

}


function mostrarError() {

  if (!dom.actividadReciente) {
    return;
  }

  dom.actividadReciente.innerHTML = `
    <p>
      No fue posible cargar la información del dashboard.
      Revisá la conexión e intentá nuevamente.
    </p>
  `;

}


/* =========================================================
   DATOS DEL PARTICIPANTE
========================================================= */

function tieneDatosParticipante(participante) {

  if (
    !participante ||
    typeof participante !== "object"
  ) {
    return false;
  }

  return Boolean(
    limpiarTexto(participante.nombre) ||
    limpiarTexto(participante.apellido) ||
    limpiarTexto(participante.correo) ||
    limpiarTexto(participante.dni)
  );

}


function obtenerNombreCompleto(participante) {

  const nombre =
    limpiarTexto(
      participante.nombre
    );

  const apellido =
    limpiarTexto(
      participante.apellido
    );

  return (
    `${nombre} ${apellido}`.trim() ||
    "Participante sin identificar"
  );

}


function obtenerPorcentaje(participante) {

  const progreso =
    participante?.progreso;


  if (
    progreso &&
    typeof progreso === "object"
  ) {

    return limitarNumero(
      Number(progreso.porcentaje) || 0,
      0,
      100
    );

  }


  return limitarNumero(
    Number(progreso) || 0,
    0,
    100
  );

}


/* =========================================================
   FECHAS
========================================================= */

function obtenerMilisegundosFecha(valor) {

  if (!valor) {
    return 0;
  }


  if (
    typeof valor === "object" &&
    typeof valor.toDate === "function"
  ) {

    return valor.toDate().getTime();

  }


  const fecha =
    new Date(valor);

  return Number.isNaN(
    fecha.getTime()
  )
    ? 0
    : fecha.getTime();

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

    fecha =
      valor.toDate();

  } else {

    fecha =
      new Date(valor);

  }


  if (
    Number.isNaN(
      fecha.getTime()
    )
  ) {

    return "Sin fecha";

  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(fecha);

}


/* =========================================================
   UTILIDADES
========================================================= */

function escribirNumero(elemento, valor) {

  if (!elemento) {
    return;
  }

  elemento.textContent =
    String(valor);

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