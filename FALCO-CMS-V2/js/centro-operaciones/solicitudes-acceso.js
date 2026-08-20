import { db } from "../../../firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const contadorTotal =
  document.getElementById("contadorTotal");

const contadorPendientes =
  document.getElementById("contadorPendientes");

const contadorAprobadas =
  document.getElementById("contadorAprobadas");

const contadorRechazadas =
  document.getElementById("contadorRechazadas");

const buscarSolicitud =
  document.getElementById("buscarSolicitud");

const filtroEstado =
  document.getElementById("filtroEstado");

const filtroArea =
  document.getElementById("filtroArea");

const botonActualizar =
  document.getElementById("botonActualizar");

const estadoCarga =
  document.getElementById("estadoCarga");

const tablaSolicitudes =
  document.getElementById("tablaSolicitudes");

const sinResultados =
  document.getElementById("sinResultados");

const modalSolicitud =
  document.getElementById("modalSolicitud");

const cerrarModal =
  document.getElementById("cerrarModal");

const modalTitulo =
  document.getElementById("modalTitulo");

const modalReferencia =
  document.getElementById("modalReferencia");

const modalContenido =
  document.getElementById("modalContenido");

const modalEstado =
  document.getElementById("modalEstado");

const modalObservaciones =
  document.getElementById("modalObservaciones");

const contactarWhatsApp =
  document.getElementById("contactarWhatsApp");

const guardarSolicitud =
  document.getElementById("guardarSolicitud");

const estadoGuardado =
  document.getElementById("estadoGuardado");


/* =========================================================
   ESTADO INTERNO
========================================================= */

let solicitudes = [];

let solicitudActivaId = null;


/* =========================================================
   UTILIDADES
========================================================= */

function escaparHTML(valor = "") {

  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function formatearFecha(valor) {

  if (!valor) {
    return "—";
  }


  try {

    const fecha =
      valor.toDate
        ? valor.toDate()
        : new Date(valor);


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

  } catch (error) {

    return "—";

  }

}


function nombreEstado(estado) {

  const mapa = {
    pendiente: "Pendiente",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    archivada: "Archivada"
  };

  return mapa[estado] || estado || "Pendiente";

}


function claseEstado(estado) {

  if (estado === "aprobada") {
    return "falco-admin-badge--aprobada";
  }

  if (estado === "rechazada") {
    return "falco-admin-badge--rechazada";
  }

  if (estado === "archivada") {
    return "falco-admin-badge--archivada";
  }

  return "falco-admin-badge--pendiente";

}


/* =========================================================
   CARGAR SOLICITUDES
========================================================= */

async function cargarSolicitudes() {

  if (estadoCarga) {
    estadoCarga.textContent =
      "Cargando solicitudes...";
  }


  try {

    const referencia =
      collection(
        db,
        "solicitudes_acceso"
      );


    const consulta =
      query(
        referencia,
        orderBy(
          "creadoEn",
          "desc"
        )
      );


    const snapshot =
      await getDocs(
        consulta
      );


    solicitudes =
      snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data()
        })
      );


    actualizarIndicadores();

    renderizarSolicitudes();


    if (estadoCarga) {

      estadoCarga.textContent =
        `${solicitudes.length} solicitud${
          solicitudes.length === 1
            ? ""
            : "es"
        } registrada${
          solicitudes.length === 1
            ? ""
            : "s"
        }.`;

    }

  } catch (error) {

    console.error(
      "FALCO® · Error al cargar solicitudes:",
      error
    );


    if (estadoCarga) {

      estadoCarga.textContent =
        "No fue posible cargar las solicitudes.";

    }

  }

}


/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadores() {

  const total =
    solicitudes.length;

  const pendientes =
    solicitudes.filter(
      (item) =>
        (item.estado || "pendiente") ===
        "pendiente"
    ).length;

  const aprobadas =
    solicitudes.filter(
      (item) =>
        item.estado ===
        "aprobada"
    ).length;

  const rechazadas =
    solicitudes.filter(
      (item) =>
        item.estado ===
        "rechazada"
    ).length;


  if (contadorTotal) {
    contadorTotal.textContent =
      total;
  }

  if (contadorPendientes) {
    contadorPendientes.textContent =
      pendientes;
  }

  if (contadorAprobadas) {
    contadorAprobadas.textContent =
      aprobadas;
  }

  if (contadorRechazadas) {
    contadorRechazadas.textContent =
      rechazadas;
  }

}


/* =========================================================
   FILTRADO
========================================================= */

function obtenerSolicitudesFiltradas() {

  const texto =
    buscarSolicitud
      ?.value
      .trim()
      .toLowerCase() || "";

  const estado =
    filtroEstado
      ?.value || "";

  const area =
    filtroArea
      ?.value || "";


  return solicitudes.filter(
    (item) => {

      const coincideTexto =
        !texto ||
        item.nombre
          ?.toLowerCase()
          .includes(texto) ||
        item.email
          ?.toLowerCase()
          .includes(texto) ||
        item.whatsapp
          ?.toLowerCase()
          .includes(texto);


      const coincideEstado =
        !estado ||
        (item.estado || "pendiente") ===
          estado;


      const coincideArea =
        !area ||
        item.area ===
          area;


      return (
        coincideTexto &&
        coincideEstado &&
        coincideArea
      );

    }
  );

}


/* =========================================================
   RENDER TABLA
========================================================= */

function renderizarSolicitudes() {

  if (!tablaSolicitudes) {
    return;
  }


  const filtradas =
    obtenerSolicitudesFiltradas();


  tablaSolicitudes.innerHTML =
    "";


  if (sinResultados) {

    sinResultados.hidden =
      filtradas.length !== 0;

  }


  filtradas.forEach(
    (item) => {

      const fila =
        document.createElement(
          "tr"
        );


      const estado =
        item.estado ||
        "pendiente";


      fila.innerHTML = `
        <td>
          ${escaparHTML(
            formatearFecha(
              item.creadoEn
            )
          )}
        </td>

        <td>
          <strong>
            ${escaparHTML(
              item.nombre ||
              "—"
            )}
          </strong>

          <div>
            ${escaparHTML(
              item.email ||
              "—"
            )}
          </div>
        </td>

        <td>
          ${escaparHTML(
            item.whatsapp ||
            "—"
          )}
        </td>

        <td>
          ${escaparHTML(
            item.areaNombre ||
            item.area ||
            "—"
          )}
        </td>

        <td>
          <span
            class="
              falco-admin-badge
              ${claseEstado(
                estado
              )}
            "
          >
            ${escaparHTML(
              nombreEstado(
                estado
              )
            )}
          </span>
        </td>

        <td>
          <button
            type="button"
            class="falco-admin-ver"
            data-id="${escaparHTML(
              item.id
            )}"
          >
            Abrir
          </button>
        </td>
      `;


      tablaSolicitudes.appendChild(
        fila
      );

    }
  );

}


/* =========================================================
   ABRIR FICHA
========================================================= */

function abrirFicha(id) {

  const item =
    solicitudes.find(
      (solicitud) =>
        solicitud.id === id
    );


  if (!item) {
    return;
  }


  solicitudActivaId =
    id;


  if (modalTitulo) {

    modalTitulo.textContent =
      item.nombre ||
      "Solicitud de acceso";

  }


  if (modalReferencia) {

    modalReferencia.textContent =
      `ID: ${item.id}`;

  }


  if (modalContenido) {

    modalContenido.innerHTML = `
      <div class="falco-admin-ficha">

        <div class="falco-admin-ficha-item">
          <span>Nombre</span>
          <strong>
            ${escaparHTML(
              item.nombre ||
              "—"
            )}
          </strong>
        </div>

        <div class="falco-admin-ficha-item">
          <span>Fecha</span>
          <strong>
            ${escaparHTML(
              formatearFecha(
                item.creadoEn
              )
            )}
          </strong>
        </div>

        <div class="falco-admin-ficha-item">
          <span>Email</span>
          <strong>
            ${escaparHTML(
              item.email ||
              "—"
            )}
          </strong>
        </div>

        <div class="falco-admin-ficha-item">
          <span>WhatsApp</span>
          <strong>
            ${escaparHTML(
              item.whatsapp ||
              "—"
            )}
          </strong>
        </div>

        <div class="falco-admin-ficha-item falco-admin-ficha-item--wide">
          <span>Acceso solicitado</span>
          <strong>
            ${escaparHTML(
              item.areaNombre ||
              item.area ||
              "—"
            )}
          </strong>
        </div>

        <div class="falco-admin-ficha-item falco-admin-ficha-item--wide">
          <span>Mensaje</span>
          <strong>
            ${escaparHTML(
              item.mensaje ||
              "Sin mensaje"
            )}
          </strong>
        </div>

      </div>
    `;

  }


  if (modalEstado) {

    modalEstado.value =
      item.estado ||
      "pendiente";

  }


  if (modalObservaciones) {

    modalObservaciones.value =
      item.observacionesInternas ||
      "";

  }


  /* =======================================================
     WHATSAPP
  ======================================================= */

  if (contactarWhatsApp) {

    const numero =
      String(
        item.whatsapp ||
        ""
      ).replace(
        /\D/g,
        ""
      );


    if (numero) {

      const texto =
        encodeURIComponent(
          "Hola, nos comunicamos desde el Estudio Pericial Psicológico FALCO® en relación con su solicitud de acceso al Sistema FALCO®."
        );


      contactarWhatsApp.href =
        `https://wa.me/${numero}?text=${texto}`;

      contactarWhatsApp.style.display =
        "flex";

    } else {

      contactarWhatsApp.removeAttribute(
        "href"
      );

      contactarWhatsApp.style.display =
        "none";

    }

  }


  if (estadoGuardado) {

    estadoGuardado.textContent =
      "";

    estadoGuardado.classList.remove(
      "is-success",
      "is-error"
    );

  }


  if (modalSolicitud) {

    modalSolicitud.classList.add(
      "is-open"
    );

    modalSolicitud.setAttribute(
      "aria-hidden",
      "false"
    );

  }

}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarFicha() {

  if (!modalSolicitud) {
    return;
  }


  modalSolicitud.classList.remove(
    "is-open"
  );


  modalSolicitud.setAttribute(
    "aria-hidden",
    "true"
  );


  solicitudActivaId =
    null;

}


/* =========================================================
   GUARDAR CAMBIOS
========================================================= */

async function guardarCambios() {

  if (!solicitudActivaId) {
    return;
  }


  const nuevoEstado =
    modalEstado
      ?.value ||
      "pendiente";


  const observaciones =
    modalObservaciones
      ?.value
      .trim() || "";


  if (guardarSolicitud) {

    guardarSolicitud.disabled =
      true;

    guardarSolicitud.textContent =
      "Guardando...";

  }


  try {

    const referencia =
      doc(
        db,
        "solicitudes_acceso",
        solicitudActivaId
      );


    await updateDoc(
      referencia,
      {
        estado:
          nuevoEstado,

        observacionesInternas:
          observaciones,

        actualizadoEn:
          serverTimestamp()
      }
    );


    const item =
      solicitudes.find(
        (solicitud) =>
          solicitud.id ===
          solicitudActivaId
      );


    if (item) {

      item.estado =
        nuevoEstado;

      item.observacionesInternas =
        observaciones;

    }


    actualizarIndicadores();

    renderizarSolicitudes();


    if (estadoGuardado) {

      estadoGuardado.textContent =
        "Cambios guardados correctamente.";

      estadoGuardado.classList.remove(
        "is-error"
      );

      estadoGuardado.classList.add(
        "is-success"
      );

    }

  } catch (error) {

    console.error(
      "FALCO® · Error al guardar cambios:",
      error
    );


    if (estadoGuardado) {

      estadoGuardado.textContent =
        "No fue posible guardar los cambios.";

      estadoGuardado.classList.remove(
        "is-success"
      );

      estadoGuardado.classList.add(
        "is-error"
      );

    }

  } finally {

    if (guardarSolicitud) {

      guardarSolicitud.disabled =
        false;

      guardarSolicitud.textContent =
        "Guardar cambios";

    }

  }

}


/* =========================================================
   EVENTOS
========================================================= */

buscarSolicitud?.addEventListener(
  "input",
  renderizarSolicitudes
);


filtroEstado?.addEventListener(
  "change",
  renderizarSolicitudes
);


filtroArea?.addEventListener(
  "change",
  renderizarSolicitudes
);


botonActualizar?.addEventListener(
  "click",
  cargarSolicitudes
);


tablaSolicitudes?.addEventListener(
  "click",
  (event) => {

    const boton =
      event.target.closest(
        "[data-id]"
      );


    if (!boton) {
      return;
    }


    abrirFicha(
      boton.dataset.id
    );

  }
);


cerrarModal?.addEventListener(
  "click",
  cerrarFicha
);


modalSolicitud?.addEventListener(
  "click",
  (event) => {

    if (
      event.target.matches(
        "[data-cerrar-modal]"
      )
    ) {

      cerrarFicha();

    }

  }
);


guardarSolicitud?.addEventListener(
  "click",
  guardarCambios
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      cerrarFicha();

    }

  }
);


/* =========================================================
   INICIO
========================================================= */

cargarSolicitudes();