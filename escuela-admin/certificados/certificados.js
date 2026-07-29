/* ==========================================================
   FALCO®
   Centro Administrativo
   Módulo de Certificados
========================================================== */

import { db } from "../../firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


console.log("FALCO Certificados Admin™ v1.0 Ready");


/* ==========================================================
   ELEMENTOS DEL DOM
========================================================== */

const totalParticipantes =
  document.getElementById("totalParticipantes");

const totalFinalizados =
  document.getElementById("totalFinalizados");

const totalCertificados =
  document.getElementById("totalCertificados");

const totalEncuestas =
  document.getElementById("totalEncuestas");


const estadoCarga =
  document.getElementById("estadoCargaCertificados");

const estadoError =
  document.getElementById("estadoErrorCertificados");

const textoError =
  document.getElementById("textoErrorCertificados");

const estadoVacio =
  document.getElementById("estadoVacioCertificados");

const contenedorTabla =
  document.getElementById("contenedorTablaCertificados");

const tablaBody =
  document.getElementById("tablaCertificadosBody");

const textoResultados =
  document.getElementById("textoResultadosCertificados");


const btnActualizar =
  document.getElementById("btnActualizarCertificados");


  /* ==========================================================
   FILTROS
========================================================== */

const inputBusqueda =
  document.getElementById("buscarParticipante");

const filtroFinalizacion =
  document.getElementById("filtroFinalizacion");

const filtroEncuesta =
  document.getElementById("filtroEncuesta");

const filtroCertificado =
  document.getElementById("filtroCertificado");

const btnLimpiarFiltros =
  document.getElementById("btnLimpiarFiltros");


/* ==========================================================
   ESTADO
========================================================== */

const state = {

  participantes: [],

  encuestas: [],

  participantesProcesados: []

};


/* ==========================================================
   INICIO
========================================================== */

init();


async function init() {

  registrarEventos();

  await cargarModulo();

}


/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

  btnActualizar?.addEventListener(
    "click",
    cargarModulo
  );


  inputBusqueda?.addEventListener(
    "input",
    aplicarFiltros
  );


  filtroFinalizacion?.addEventListener(
    "change",
    aplicarFiltros
  );


  filtroEncuesta?.addEventListener(
    "change",
    aplicarFiltros
  );


  filtroCertificado?.addEventListener(
    "change",
    aplicarFiltros
  );


  btnLimpiarFiltros?.addEventListener(
    "click",
    limpiarFiltros
  );


  tablaBody?.addEventListener(
    "click",
    manejarAccionesTabla
  );


}



/* ==========================================================
   ACCIONES DE LA TABLA
========================================================== */

function manejarAccionesTabla(evento) {

  const botonCertificado =
    evento.target.closest(
      "[data-ver-certificado]"
    );

  if (!botonCertificado) {

    return;

  }

  const participanteId =
    botonCertificado.dataset.participanteId;

  if (!participanteId) {

    console.error(
      "No se encontró el ID del participante."
    );

    return;

  }

  const certificadoUrl =
    `../../certificado.html?id=${encodeURIComponent(
      participanteId
    )}`;

  window.open(
    certificadoUrl,
    "_blank",
    "noopener,noreferrer"
  );

}




/* ==========================================================
   CARGA GENERAL
========================================================== */

async function cargarModulo() {

  try {

    mostrarCarga();

    await cargarParticipantes();

    /*
      Las encuestas quedan temporalmente vacías porque
      la colección encuestas_finales todavía no permite
      su lectura administrativa.
    */

    state.encuestas = [];

    procesarParticipantes();

    actualizarResumen();

    renderizarTabla(
      state.participantesProcesados
    );

    ocultarCarga();

  }

  catch (error) {

    mostrarError(error);

  }

}


/* ==========================================================
   FIRESTORE
========================================================== */

async function cargarParticipantes() {

  const snapshot = await getDocs(
    collection(
      db,
      "escuela_participantes"
    )
  );

  state.participantes = snapshot.docs.map(
    documento => ({

      id: documento.id,

      ...documento.data()

    })
  );

  console.log(
    "Participantes:",
    state.participantes
  );

}


/* ==========================================================
   PROCESAMIENTO
========================================================== */

function procesarParticipantes() {

  state.participantesProcesados =
    state.participantes.map(participante => {

      const encuentrosCompletados =
        contarEncuentrosCompletados(participante);

      const porcentaje =
        Math.round(
          (encuentrosCompletados / 8) * 100
        );

      const finalizado =
        encuentrosCompletados === 8;

      const encuesta =
        buscarEncuesta(participante);

      return {

        ...participante,

        encuentrosCompletados,

        porcentaje,

        finalizado,

        certificadoDisponible:
          finalizado,

        encuestaRespondida:
          Boolean(encuesta),

        encuesta:
          encuesta || null

      };

    });

  /*
    Orden alfabético por nombre.
  */

  state.participantesProcesados.sort(
    (participanteA, participanteB) => {

      const nombreA =
        obtenerNombre(participanteA);

      const nombreB =
        obtenerNombre(participanteB);

      return nombreA.localeCompare(
        nombreB,
        "es",
        {
          sensitivity: "base"
        }
      );

    }
  );

  console.table(
  state.participantesProcesados.map(p => ({
    id: p.id,
    nombre: p.nombre,
    apellido: p.apellido,
    nombreCompleto: p.nombreCompleto,
    nombreApellido: p.nombreApellido,
    nombreYApellido: p.nombreYApellido,
    email: p.email,
    correo: p.correo
  }))
);

}


/* ==========================================================
   CÁLCULO DE PROGRESO
========================================================== */

function contarEncuentrosCompletados(participante) {

  let completados = 0;

  for (
    let numero = 1;
    numero <= 8;
    numero++
  ) {

    if (
      participante[`completado${numero}`] === true
    ) {

      completados++;

    }

  }

  return completados;

}


/* ==========================================================
   RELACIÓN CON ENCUESTAS
========================================================== */

function buscarEncuesta(participante) {

  const correoParticipante =
    normalizarTexto(
      obtenerCorreo(participante)
    );

  return state.encuestas.find(encuesta => {

    if (encuesta.id === participante.id) {

      return true;

    }

    const correoEncuesta =
      normalizarTexto(
        encuesta.email ||
        encuesta.correo ||
        ""
      );

    return Boolean(
      correoParticipante &&
      correoEncuesta &&
      correoParticipante === correoEncuesta
    );

  }) || null;

}


/* ==========================================================
   RESUMEN
========================================================== */

function actualizarResumen() {

  const participantes =
    state.participantesProcesados.length;

  const finalizados =
    state.participantesProcesados.filter(
      participante =>
        participante.finalizado
    ).length;

  const certificados =
    state.participantesProcesados.filter(
      participante =>
        participante.certificadoDisponible
    ).length;

  const encuestas =
    state.participantesProcesados.filter(
      participante =>
        participante.encuestaRespondida
    ).length;


  totalParticipantes.textContent =
    participantes;

  totalFinalizados.textContent =
    finalizados;

  totalCertificados.textContent =
    certificados;

  totalEncuestas.textContent =
    encuestas;


  textoResultados.textContent =
    construirTextoResultados(
      participantes,
      finalizados
    );

}


/* ==========================================================
   FILTROS
========================================================== */

function aplicarFiltros() {

  const busqueda =
    normalizarTexto(
      inputBusqueda?.value
    );

  const finalizacion =
    normalizarTexto(
      filtroFinalizacion
        ?.selectedOptions?.[0]
        ?.textContent
    );

  const encuesta =
    normalizarTexto(
      filtroEncuesta
        ?.selectedOptions?.[0]
        ?.textContent
    );

  const certificado =
    normalizarTexto(
      filtroCertificado
        ?.selectedOptions?.[0]
        ?.textContent
    );


  const participantesFiltrados =
    state.participantesProcesados.filter(
      participante => {

        const nombre =
          normalizarTexto(
            obtenerNombre(participante)
          );

        const correo =
          normalizarTexto(
            obtenerCorreo(participante)
          );


        const coincideBusqueda =
          !busqueda ||
          nombre.includes(busqueda) ||
          correo.includes(busqueda);


        const coincideFinalizacion =
          !finalizacion ||
          finalizacion.includes("todos") ||
          (
            finalizacion.includes("finalizado") &&
            participante.finalizado
          ) ||
          (
            finalizacion.includes("curso") &&
            !participante.finalizado
          );


        const coincideEncuesta =
          !encuesta ||
          encuesta.includes("todas") ||
          (
            encuesta.includes("respondida") &&
            participante.encuestaRespondida
          ) ||
          (
            encuesta.includes("pendiente") &&
            !participante.encuestaRespondida
          );


        const coincideCertificado =
          !certificado ||
          certificado.includes("todos") ||
          (
            certificado.includes("disponible") &&
            !certificado.includes("no disponible") &&
            participante.certificadoDisponible
          ) ||
          (
            certificado.includes("no disponible") &&
            !participante.certificadoDisponible
          );


        return (
          coincideBusqueda &&
          coincideFinalizacion &&
          coincideEncuesta &&
          coincideCertificado
        );

      }
    );


  renderizarTabla(
    participantesFiltrados
  );


  actualizarTextoResultadosFiltrados(
    participantesFiltrados.length
  );

}


function limpiarFiltros() {

  if (inputBusqueda) {

    inputBusqueda.value = "";

  }

  if (filtroFinalizacion) {

    filtroFinalizacion.value = "todos";

  }

  if (filtroEncuesta) {

    filtroEncuesta.value = "todas";

  }

  if (filtroCertificado) {

    filtroCertificado.value = "todos";

  }


  renderizarTabla(
    state.participantesProcesados
  );


  actualizarTextoResultadosFiltrados(
    state.participantesProcesados.length
  );

}


function actualizarTextoResultadosFiltrados(
  cantidadVisible
) {

  const total =
    state.participantesProcesados.length;


  if (cantidadVisible === 0) {

    textoResultados.textContent =
      "No se encontraron participantes con los filtros seleccionados.";

    return;

  }


  if (cantidadVisible === total) {

    const finalizados =
      state.participantesProcesados.filter(
        participante =>
          participante.finalizado
      ).length;

    textoResultados.textContent =
      construirTextoResultados(
        total,
        finalizados
      );

    return;

  }


  const palabra =
    cantidadVisible === 1
      ? "participante encontrado"
      : "participantes encontrados";


  textoResultados.textContent =
    `${cantidadVisible} ${palabra} de ${total}.`;

}


/* ==========================================================
   RENDER DE TABLA
========================================================== */

function renderizarTabla(participantes) {

  tablaBody.innerHTML = "";

  if (!participantes.length) {

    mostrarEstadoVacio();

    return;

  }

  participantes.forEach(participante => {

    const fila =
      crearFilaParticipante(participante);

    tablaBody.appendChild(fila);

  });

  estadoVacio.classList.add(
    "admin-oculto"
  );

  contenedorTabla.classList.remove(
    "admin-oculto"
  );

}


/* ==========================================================
   CREAR FILA
========================================================== */

function crearFilaParticipante(participante) {

  const fila =
    document.createElement("tr");

  const nombre =
    obtenerNombre(participante);

  const correo =
    obtenerCorreo(participante);

  const iniciales =
    obtenerIniciales(nombre);

  const fichaUrl =
    `../ficha/participante.html?id=${encodeURIComponent(
      participante.id
    )}`;


  fila.innerHTML = `

    <td>

      <div class="certificados-participante">

        <div
          class="certificados-avatar"
          aria-hidden="true"
        >
          ${escaparHTML(iniciales)}
        </div>

        <div class="certificados-participante-datos">

          <strong>
            ${escaparHTML(nombre)}
          </strong>

          <span>
            ${escaparHTML(correo)}
          </span>

        </div>

      </div>

    </td>


    <td>

      <div class="certificados-progreso">

        <div
          class="certificados-progreso-barra"
          title="${participante.encuentrosCompletados} de 8 encuentros"
        >

          <span
            style="width: ${participante.porcentaje}%"
          ></span>

        </div>

        <strong>
          ${participante.porcentaje}%
        </strong>

      </div>

    </td>


    <td>

      ${
        participante.finalizado
          ? `
            <span
              class="
                certificados-estado
                certificados-estado-finalizado
              "
            >
              Finalizado
            </span>
          `
          : `
            <span
              class="
                certificados-estado
                certificados-estado-curso
              "
            >
              ${participante.encuentrosCompletados} de 8
            </span>
          `
      }

    </td>


    <td>

      ${
        participante.encuestaRespondida
          ? `
            <span
              class="
                certificados-estado
                certificados-estado-respondida
              "
            >
              Respondida
            </span>
          `
          : `
            <span
              class="
                certificados-estado
                certificados-estado-pendiente
              "
            >
              Pendiente
            </span>
          `
      }

    </td>


    <td>

      ${
        participante.certificadoDisponible
          ? `
            <span
              class="
                certificados-estado
                certificados-estado-disponible
              "
            >
              Disponible
            </span>
          `
          : `
            <span
              class="
                certificados-estado
                certificados-estado-no-disponible
              "
            >
              No disponible
            </span>
          `
      }

    </td>


    <td>

      <div class="certificados-acciones">

        <a
          href="${fichaUrl}"
          class="certificados-accion"
        >
          Ver ficha
        </a>

        ${
          participante.certificadoDisponible
            ? `
              <button
                type="button"
                class="
                  certificados-accion
                  certificados-accion-principal
                "
                data-ver-certificado
                data-participante-id="${escaparHTML(
                  participante.id
                )}"
              >
                Certificado
              </button>
            `
            : `
              <button
                type="button"
                class="
                  certificados-accion
                  deshabilitado
                "
                disabled
              >
                Certificado
              </button>
            `
        }

      </div>

    </td>

  `;

  return fila;

}


/* ==========================================================
   DATOS DEL PARTICIPANTE
========================================================== */

function obtenerNombre(participante) {

  const nombreCompleto =
    participante.nombreCompleto ||
    participante.nombreApellido ||
    participante.nombreYApellido;

  if (nombreCompleto) {

    return String(nombreCompleto).trim();

  }


  const partes = [

    participante.nombre,

    participante.apellido

  ]
    .filter(Boolean)
    .map(valor =>
      String(valor).trim()
    );


  if (partes.length) {

    return partes.join(" ");

  }


  return (
    participante.email ||
    participante.correo ||
    "Participante sin nombre"
  );

}


function obtenerCorreo(participante) {

  return (
    participante.email ||
    participante.correo ||
    participante.emailParticipante ||
    "Sin correo registrado"
  );

}


function obtenerIniciales(nombre) {

  const palabras =
    String(nombre || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (!palabras.length) {

    return "PF";

  }

  if (palabras.length === 1) {

    return palabras[0]
      .slice(0, 2)
      .toUpperCase();

  }

  return (
    palabras[0][0] +
    palabras[palabras.length - 1][0]
  ).toUpperCase();

}


/* ==========================================================
   TEXTO DE RESULTADOS
========================================================== */

function construirTextoResultados(
  participantes,
  finalizados
) {

  if (participantes === 0) {

    return "No hay participantes registrados.";

  }

  const palabraParticipante =
    participantes === 1
      ? "participante cargado"
      : "participantes cargados";

  const palabraFinalizado =
    finalizados === 1
      ? "programa finalizado"
      : "programas finalizados";

  return (
    `${participantes} ${palabraParticipante} · ` +
    `${finalizados} ${palabraFinalizado}.`
  );

}


/* ==========================================================
   UTILIDADES
========================================================== */

function normalizarTexto(valor) {

  return String(valor || "")
    .trim()
    .toLowerCase();

}


function escaparHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ==========================================================
   ESTADOS VISUALES
========================================================== */

function mostrarCarga() {

  estadoCarga.classList.remove(
    "admin-oculto"
  );

  estadoError.classList.add(
    "admin-oculto"
  );

  estadoVacio.classList.add(
    "admin-oculto"
  );

  contenedorTabla.classList.add(
    "admin-oculto"
  );

  textoResultados.textContent =
    "Cargando información...";


  if (btnActualizar) {

    btnActualizar.disabled = true;

    btnActualizar.textContent =
      "Actualizando...";

  }

}


function ocultarCarga() {

  estadoCarga.classList.add(
    "admin-oculto"
  );


  if (btnActualizar) {

    btnActualizar.disabled = false;

    btnActualizar.textContent =
      "Actualizar información";

  }

}


function mostrarEstadoVacio() {

  estadoCarga.classList.add(
    "admin-oculto"
  );

  estadoError.classList.add(
    "admin-oculto"
  );

  contenedorTabla.classList.add(
    "admin-oculto"
  );

  estadoVacio.classList.remove(
    "admin-oculto"
  );

}


function mostrarError(error) {

  console.error(
    "Error al cargar certificados:",
    error
  );

  estadoCarga.classList.add(
    "admin-oculto"
  );

  estadoError.classList.remove(
    "admin-oculto"
  );

  estadoVacio.classList.add(
    "admin-oculto"
  );

  contenedorTabla.classList.add(
    "admin-oculto"
  );


  if (textoError) {

    textoError.textContent =
      error?.message ||
      "Revisá la conexión con Firestore e intentá nuevamente.";

  }


  textoResultados.textContent =
    "No fue posible cargar la información.";


  if (btnActualizar) {

    btnActualizar.disabled = false;

    btnActualizar.textContent =
      "Reintentar";

  }

}