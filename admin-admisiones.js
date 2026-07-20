/* =========================================================
   FALCO Admisiones™
   Panel administrativo
========================================================= */

import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const COLECCION_ADMISIONES = "admisiones";

const ROLES_PERMITIDOS = [
  "admin",
  "administrador"
];


/* =========================================================
   ELEMENTOS
========================================================= */

const tablaAdmisiones =
  document.getElementById("tablaAdmisiones");

const buscarAdmision =
  document.getElementById("buscarAdmision");

const filtroEstado =
  document.getElementById("filtroEstado");

const btnActualizarAdmisiones =
  document.getElementById("btnActualizarAdmisiones");

const totalAdmisiones =
  document.getElementById("totalAdmisiones");

const totalNuevas =
  document.getElementById("totalNuevas");

const totalEnProceso =
  document.getElementById("totalEnProceso");

const totalConDocumentos =
  document.getElementById("totalConDocumentos");


/* =========================================================
   ESTADO
========================================================= */

let admisiones = [];
let admisionesFiltradas = [];
let usuarioActual = null;


/* =========================================================
   UTILIDADES GENERALES
========================================================= */

function textoSeguro(valor, reemplazo = "—") {

  const texto = String(valor ?? "").trim();

  return texto || reemplazo;
}


function normalizarTexto(valor) {

  return String(valor ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}


function escaparHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}

function normalizarEstado(valor) {

  const estado = normalizarTexto(valor || "nueva")
    .replaceAll(" ", "_")
    .replaceAll("-", "_");

  const equivalencias = {

    nueva: "nueva",
    nuevo: "nueva",
    completada: "nueva",
    completado: "nueva",
    enviada: "nueva",
    enviado: "nueva",
    finalizada: "nueva",
    finalizado: "nueva",

    revision: "revision",
    en_revision: "revision",

    contactado: "contactado",
    contactada: "contactado",

    cerrado: "cerrado",
    cerrada: "cerrado",

    rechazado: "rechazado",
    rechazada: "rechazado",

    borrador: "borrador",
    en_proceso: "en_proceso",

     archivada: "archivada",
    archivado: "archivada"

  };

  return equivalencias[estado] || estado;
}


/* =========================================================
   FECHA
========================================================= */

function convertirFecha(valor) {

  if (!valor) return null;

  if (typeof valor?.toDate === "function") {
    return valor.toDate();
  }

  if (typeof valor?.seconds === "number") {
    return new Date(valor.seconds * 1000);
  }

  if (valor instanceof Date) {
    return valor;
  }

  const fecha = new Date(valor);

  return Number.isNaN(fecha.getTime())
    ? null
    : fecha;

}


function obtenerFechaAdmision(data) {

  return (
    convertirFecha(data.enviadoEn) ||
    convertirFecha(data.finalizadoEn) ||
    convertirFecha(data.creadoEn) ||
    convertirFecha(data.createdAt) ||
    convertirFecha(data.fechaCreacion) ||
    convertirFecha(data.fecha) ||
    null
  );

}


function formatearFecha(fecha) {

  if (!fecha) return "Sin fecha";

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
   DATOS DE LA PERSONA
========================================================= */

function obtenerNombre(data) {

  const contacto =
    data.contacto ||
    data.datosContacto ||
    data.datosPersonales ||
    {};

  const nombreCompleto =
    data.nombreCompleto ||
    data.nombreYApellido ||
    contacto.nombreCompleto ||
    contacto.nombreYApellido;

  if (nombreCompleto) {
    return textoSeguro(nombreCompleto);
  }

  const nombre =
    data.nombre ||
    contacto.nombre ||
    data.nombres ||
    contacto.nombres ||
    "";

  const apellido =
    data.apellido ||
    contacto.apellido ||
    data.apellidos ||
    contacto.apellidos ||
    "";

  const combinado =
    `${nombre} ${apellido}`.trim();

  return textoSeguro(
    combinado,
    "Sin identificar"
  );

}


function obtenerEmail(data) {

  const contacto =
    data.contacto ||
    data.datosContacto ||
    data.datosPersonales ||
    {};

  return textoSeguro(
    data.email ||
    data.correo ||
    contacto.email ||
    contacto.correo ||
    contacto.mail,
    ""
  );

}


function obtenerTelefono(data) {

  const contacto =
    data.contacto ||
    data.datosContacto ||
    data.datosPersonales ||
    {};

  return textoSeguro(
    data.telefono ||
    data.whatsapp ||
    contacto.telefono ||
    contacto.whatsapp ||
    contacto.celular,
    ""
  );

}


function obtenerReferencia(id, data) {

  return textoSeguro(
    data.admisionId ||
    data.referencia ||
    data.codigo ||
    data.sessionId ||
    id
  );

}


function obtenerPerfil(data) {

  const perfil =
    data.perfil ||
    data.tipoPerfil ||
    data.tipoUsuario ||
    data.tipoConsulta ||
    data.tipo ||
    data.categoria ||
    "";

  if (typeof perfil === "object" && perfil !== null) {

    return textoSeguro(
      perfil.nombre ||
      perfil.label ||
      perfil.valor ||
      perfil.tipo
    );

  }

  return textoSeguro(perfil);

}


/* =========================================================
   DOCUMENTOS
========================================================= */

function obtenerDocumentos(data) {

  const posiblesColecciones = [
    data.documentos,
    data.archivos,
    data.adjuntos,
    data.documentacion,
    data.documentosAdjuntos,
    data.uploads
  ];

  for (const valor of posiblesColecciones) {

    if (Array.isArray(valor)) {
      return valor;
    }

    if (
      valor &&
      typeof valor === "object"
    ) {
      return Object.values(valor);
    }

  }

  return [];

}


/* =========================================================
   ESTADO DE LA ADMISIÓN
========================================================= */

function obtenerEstado(data) {

  return normalizarEstado(
    data.estado ||
    data.status ||
    data.estadoAdmision ||
    data.estadoProceso ||
    "nueva"
  );

}


function obtenerTextoEstado(estado) {

  const nombres = {
    nueva: "Nueva",
    completada: "Nueva",
    borrador: "Borrador",
    en_proceso: "En proceso",
    enviada: "Nueva",
    finalizada: "Nueva",
    revision: "En revisión",
    en_revision: "En revisión",
    contactado: "Contactado",
    contactada: "Contactada",
    cerrado: "Cerrado",
    cerrada: "Cerrada",
    rechazado: "Rechazado",
    rechazada: "Rechazada",
    archivada: "Archivada",
    desconocido: "Sin estado"
  };

  return nombres[estado] || textoSeguro(estado);
}

function obtenerClaseEstado(estado) {

  const estadoCSS =
    estado
      .replaceAll("_", "-")
      .replaceAll(" ", "-");

  return `estado-${estadoCSS}`;
}


/* =========================================================
   AUTENTICACIÓN Y ROL
========================================================= */

async function verificarAdministrador(user) {

  if (!user) return false;

  const referencia =
    doc(db, "usuarios", user.uid);

  const snapshot =
    await getDoc(referencia);

  if (!snapshot.exists()) {
    return false;
  }

  const data =
    snapshot.data();

  const rol =
    normalizarTexto(data.rol);

  return ROLES_PERMITIDOS.includes(rol);

}


function bloquearAcceso() {

  document.body.innerHTML = `
    <main style="
      max-width:720px;
      margin:80px auto;
      padding:32px;
      font-family:Arial,sans-serif;
      text-align:center;
    ">
      <h1>Acceso restringido</h1>

      <p>
        Este módulo está disponible únicamente
        para la administración del Estudio.
      </p>

      <a
        href="dashboard.html"
        style="
          display:inline-block;
          margin-top:18px;
          padding:12px 18px;
          border-radius:10px;
          background:#d4af37;
          color:#211d13;
          text-decoration:none;
          font-weight:700;
        ">
        Volver al Dashboard
      </a>
    </main>
  `;

}


/* =========================================================
   NORMALIZACIÓN DE DOCUMENTOS
========================================================= */

function normalizarAdmision(snapshot) {

  const data =
    snapshot.data() || {};

  const fecha =
    obtenerFechaAdmision(data);

  const documentos =
    obtenerDocumentos(data);

  return {
    id: snapshot.id,
    data,

    fecha,
    fechaTexto: formatearFecha(fecha),

    referencia:
      obtenerReferencia(snapshot.id, data),

    nombre:
      obtenerNombre(data),

    email:
      obtenerEmail(data),

    telefono:
      obtenerTelefono(data),

    perfil:
      obtenerPerfil(data),

    estado:
  obtenerEstado(data),

estadoAnterior:
  normalizarEstado(
    data.estadoAnterior || "nueva"
  ),

archivada:
  obtenerEstado(data) === "archivada" ||
  data.archivada === true,

documentos,
    cantidadDocumentos:
      documentos.length
  };

}


/* =========================================================
   CARGA
========================================================= */

function mostrarCargando() {

  tablaAdmisiones.innerHTML = `
    <tr>
      <td
        colspan="7"
        class="adm-mensaje-tabla adm-cargando">
        Cargando admisiones
      </td>
    </tr>
  `;

}


async function cargarAdmisiones() {

  mostrarCargando();

  try {

    let snapshot;

    try {

      const consultaOrdenada =
        query(
          collection(db, COLECCION_ADMISIONES),
          orderBy("creadoEn", "desc")
        );

      snapshot =
        await getDocs(consultaOrdenada);

    } catch (errorOrden) {

      console.warn(
        "No se pudo ordenar por creadoEn. Se cargará la colección sin orden.",
        errorOrden
      );

      snapshot =
        await getDocs(
          collection(db, COLECCION_ADMISIONES)
        );

    }

    admisiones =
      snapshot.docs
        .map(normalizarAdmision)
        .sort((a, b) => {

          const fechaA =
            a.fecha?.getTime?.() || 0;

          const fechaB =
            b.fecha?.getTime?.() || 0;

          return fechaB - fechaA;

        });

    actualizarResumen();
    aplicarFiltros();

    console.log(
      "FALCO Admisiones™ cargadas:",
      admisiones.length
    );

  } catch (error) {

    console.error(
      "Error al cargar admisiones:",
      error
    );

    tablaAdmisiones.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="adm-mensaje-tabla adm-error">

          <strong>
            No se pudieron cargar las admisiones.
          </strong>

          Revisá la consola para conocer el detalle.

        </td>
      </tr>
    `;

  }

}


/* =========================================================
   RESUMEN
========================================================= */


function esEstadoNuevo(estado) {

  return [
    "nueva",
    "completada",
    "enviada",
    "finalizada"
  ].includes(estado);

}


function esEstadoEnProceso(estado) {

  return [
    "borrador",
    "en_proceso",
    "revision",
    "en_revision",
    "contactado",
    "contactada"
  ].includes(estado);

}


function actualizarResumen() {

  const nuevas =
    admisiones.filter(
      admision =>
        esEstadoNuevo(admision.estado)
    ).length;

  const enProceso =
    admisiones.filter(
      admision =>
        esEstadoEnProceso(admision.estado)
    ).length;

  const conDocumentos =
    admisiones.filter(
      admision =>
        admision.cantidadDocumentos > 0
    ).length;

  if (totalAdmisiones) {
    totalAdmisiones.textContent =
      admisiones.length;
  }

  if (totalNuevas) {
    totalNuevas.textContent =
      nuevas;
  }

  if (totalEnProceso) {
    totalEnProceso.textContent =
      enProceso;
  }

  if (totalConDocumentos) {
    totalConDocumentos.textContent =
      conDocumentos;
  }

}


/* =========================================================
   FILTROS
========================================================= */

function admisionCoincideConBusqueda(
  admision,
  busqueda
) {

  if (!busqueda) return true;

  const contenido = [
    admision.referencia,
    admision.nombre,
    admision.email,
    admision.telefono,
    admision.perfil,
    admision.estado,
    obtenerTextoEstado(admision.estado)
  ]
    .map(normalizarTexto)
    .join(" ");

  return contenido.includes(busqueda);

}


function aplicarFiltros() {

  const busqueda =
    normalizarTexto(
      buscarAdmision?.value
    );

  const valorFiltro =
    filtroEstado?.value || "";

  const estadoSeleccionado =
    valorFiltro
      ? normalizarEstado(valorFiltro)
      : "";

  admisionesFiltradas =
    admisiones.filter(admision => {

      const coincideBusqueda =
        admisionCoincideConBusqueda(
          admision,
          busqueda
        );

      let coincideEstado = true;

      if (!estadoSeleccionado) {

        coincideEstado =
          admision.estado !== "archivada";

      } else {

        coincideEstado =
          admision.estado === estadoSeleccionado;

      }

      return (
        coincideBusqueda &&
        coincideEstado
      );

    });

  renderizarTabla();
}

/* =========================================================
   TABLA
========================================================= */

function renderizarTabla() {

  if (!admisionesFiltradas.length) {

    tablaAdmisiones.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="adm-mensaje-tabla">

          <strong>
            No hay admisiones para mostrar.
          </strong>

          Probá modificar la búsqueda
          o el filtro seleccionado.

        </td>
      </tr>
    `;

    return;

  }

  tablaAdmisiones.innerHTML =
    admisionesFiltradas
      .map(crearFilaAdmision)
      .join("");

}


function crearFilaAdmision(admision) {

  const contacto =
    admision.email ||
    admision.telefono ||
    "Sin datos visibles";

  const claseEstado =
    obtenerClaseEstado(admision.estado);

  const textoEstado =
    obtenerTextoEstado(admision.estado);

  const botonArchivo =
    admision.estado === "archivada"
      ? `
        <button
          type="button"
          class="btn-restaurar-admision"
          data-admision-id="${escaparHTML(admision.id)}">
          Restaurar
        </button>
      `
      : `
        <button
          type="button"
          class="btn-archivar-admision"
          data-admision-id="${escaparHTML(admision.id)}">
          Archivar
        </button>
      `;

  return `
    <tr>

      <td class="adm-fecha">
        ${escaparHTML(admision.fechaTexto)}
      </td>

      <td class="adm-referencia">
        ${escaparHTML(admision.referencia)}
      </td>

      <td class="adm-persona">

        <strong>
          ${escaparHTML(admision.nombre)}
        </strong>

        <small title="${escaparHTML(contacto)}">
          ${escaparHTML(contacto)}
        </small>

      </td>

      <td class="adm-perfil">
        ${escaparHTML(admision.perfil)}
      </td>

      <td>

        <span
          class="adm-estado ${escaparHTML(claseEstado)}">

          ${escaparHTML(textoEstado)}

        </span>

      </td>

      <td class="adm-documentos">
        ${admision.cantidadDocumentos}
      </td>

      <td class="adm-acciones">

        <button
          type="button"
          class="btn-abrir-admision"
          data-admision-id="${escaparHTML(admision.id)}">
          Abrir
        </button>

        ${botonArchivo}

      </td>

    </tr>
  `;
}



/* =========================================================
   ARCHIVAR Y RESTAURAR
========================================================= */

async function archivarAdmision(id) {

  const admision =
    admisiones.find(
      item => item.id === id
    );

  if (!admision) return;

  const confirmar =
    window.confirm(
      `¿Querés archivar la admisión de ${admision.nombre}?\n\nLa información no se eliminará y podrá restaurarse.`
    );

  if (!confirmar) return;

  try {

    const referencia =
      doc(
        db,
        COLECCION_ADMISIONES,
        id
      );

    await updateDoc(referencia, {

      estadoAnterior:
        admision.estado === "archivada"
          ? "nueva"
          : admision.estado,

      estado: "archivada",

      archivada: true,

      archivadaEn:
        serverTimestamp(),

      archivadaPorUID:
        usuarioActual?.uid || "",

      archivadaPorEmail:
        usuarioActual?.email || ""

    });

    await cargarAdmisiones();

  } catch (error) {

    console.error(
      "Error al archivar admisión:",
      error
    );

    window.alert(
      "No se pudo archivar la admisión."
    );

  }

}


async function restaurarAdmision(id) {

  const admision =
    admisiones.find(
      item => item.id === id
    );

  if (!admision) return;

  const confirmar =
    window.confirm(
      `¿Querés restaurar la admisión de ${admision.nombre}?`
    );

  if (!confirmar) return;

  try {

    const referencia =
      doc(
        db,
        COLECCION_ADMISIONES,
        id
      );

    const estadoRestaurado =
      admision.estadoAnterior &&
      admision.estadoAnterior !== "archivada"
        ? admision.estadoAnterior
        : "nueva";

    await updateDoc(referencia, {

      estado:
        estadoRestaurado,

      archivada:
        false,

      restauradaEn:
        serverTimestamp(),

      restauradaPorUID:
        usuarioActual?.uid || "",

      restauradaPorEmail:
        usuarioActual?.email || ""

    });

    await cargarAdmisiones();

  } catch (error) {

    console.error(
      "Error al restaurar admisión:",
      error
    );

    window.alert(
      "No se pudo restaurar la admisión."
    );

  }

}



/* =========================================================
   APERTURA
========================================================= */

function abrirAdmision(id) {

  const identificador =
    encodeURIComponent(id);

  window.location.href =
    `admision-detalle.html?id=${identificador}`;

}


tablaAdmisiones.addEventListener(
  "click",
  async event => {

    const botonAbrir =
      event.target.closest(
        ".btn-abrir-admision"
      );

    if (botonAbrir) {

      const id =
        botonAbrir.dataset.admisionId;

      if (id) {
        abrirAdmision(id);
      }

      return;
    }


    const botonArchivar =
      event.target.closest(
        ".btn-archivar-admision"
      );

    if (botonArchivar) {

      const id =
        botonArchivar.dataset.admisionId;

      if (id) {
        await archivarAdmision(id);
      }

      return;
    }


    const botonRestaurar =
      event.target.closest(
        ".btn-restaurar-admision"
      );

    if (botonRestaurar) {

      const id =
        botonRestaurar.dataset.admisionId;

      if (id) {
        await restaurarAdmision(id);
      }

    }

  }
);


/* =========================================================
   EVENTOS
========================================================= */

buscarAdmision?.addEventListener(
  "input",
  aplicarFiltros
);


filtroEstado?.addEventListener(
  "change",
  aplicarFiltros
);


btnActualizarAdmisiones?.addEventListener(
  "click",
  cargarAdmisiones
);


/* =========================================================
   INICIO
========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }

    try {

      const autorizado =
        await verificarAdministrador(user);

      if (!autorizado) {

        bloquearAcceso();
        return;

      }

      usuarioActual = user;

      await cargarAdmisiones();

    } catch (error) {

      console.error(
        "Error al verificar acceso:",
        error
      );

      bloquearAcceso();

    }

  }
);