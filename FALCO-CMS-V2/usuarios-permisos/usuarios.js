/*
=========================================
FALCO®
Administración de Usuarios y Permisos
Listado general de usuarios
Versión 2.0
=========================================

Funciones:
- Verifica sesión administrativa.
- Lee la colección usuarios.
- Permite administrar cada usuario.
- Permite archivar y restaurar usuarios.
- Protege al administrador principal.
- No elimina cuentas de Firebase Authentication.
=========================================
*/

"use strict";


import {
  auth,
  db,
  firebaseConfig
} from "../../firebase-config.js";


import {
  initializeApp,
  deleteApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";


import {
  onAuthStateChanged,
  signOut,
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ADMIN_EMAIL =
  "estudiopericialpsicologico@gmail.com";

const RUTA_LOGIN =
  "../ecosistema-falco.html";

const RUTA_PORTAL =
  "../centro-operaciones/centro-operaciones.html";


/* =========================================================
   ELEMENTOS
========================================================= */

const adminNombre =
  document.getElementById("adminNombre");

const adminRol =
  document.getElementById("adminRol");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const btnActualizarUsuarios =
  document.getElementById("btnActualizarUsuarios");

const buscarUsuario =
  document.getElementById("buscarUsuario");

const filtroRol =
  document.getElementById("filtroRol");

const filtroEstado =
  document.getElementById("filtroEstado");

const mensajeSistema =
  document.getElementById("mensajeSistema");

const usuariosTabla =
  document.getElementById("usuariosTabla");

const resultadoCantidad =
  document.getElementById("resultadoCantidad");

const totalUsuarios =
  document.getElementById("totalUsuarios");

const totalAdmins =
  document.getElementById("totalAdmins");

const totalProfesionales =
  document.getElementById("totalProfesionales");

const totalOtros =
  document.getElementById("totalOtros");

  const totalArchivados =
  document.getElementById("totalArchivados");

  const tabUsuarios =
  document.getElementById("tabUsuarios");

const tabNuevoUsuario =
  document.getElementById("tabNuevoUsuario");

const panelUsuarios =
  document.getElementById("panelUsuarios");

const panelNuevoUsuario =
  document.getElementById("panelNuevoUsuario");

const btnVolverUsuarios =
  document.getElementById("btnVolverUsuarios");

const btnCancelarNuevoUsuario =
  document.getElementById("btnCancelarNuevoUsuario");

const formNuevoUsuario =
  document.getElementById("formNuevoUsuario");

const nuevoNombre =
  document.getElementById("nuevoNombre");

const nuevoEmail =
  document.getElementById("nuevoEmail");

const nuevoRol =
  document.getElementById("nuevoRol");

const nuevoEstado =
  document.getElementById("nuevoEstado");

const nuevaPassword =
  document.getElementById("nuevaPassword");

const btnGenerarPassword =
  document.getElementById("btnGenerarPassword");

const btnPermisosRol =
  document.getElementById("btnPermisosRol");

const btnLimpiarPermisos =
  document.getElementById("btnLimpiarPermisos");


/* =========================================================
   ESTADO
========================================================= */

let usuariosCargados = [];

let administradorActual = null;


/* =========================================================
   UTILIDADES
========================================================= */

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}


function normalizarRol(valor) {
  return normalizarTexto(valor);
}


function escaparHTML(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatearFechaFirestore(valor) {
  if (!valor) {
    return "Fecha no registrada";
  }

  let fecha = null;

  if (typeof valor.toDate === "function") {
    fecha = valor.toDate();
  } else if (valor instanceof Date) {
    fecha = valor;
  } else if (typeof valor === "string") {
    fecha = new Date(valor);
  } else if (
    typeof valor === "object" &&
    Number.isFinite(valor.seconds)
  ) {
    fecha = new Date(valor.seconds * 1000);
  }

  if (
    !fecha ||
    Number.isNaN(fecha.getTime())
  ) {
    return "Fecha no registrada";
  }

  return fecha.toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


function obtenerNombreUsuario(usuario) {
  return (
    usuario.nombreCompleto ||
    usuario.nombre ||
    usuario.displayName ||
    usuario.email ||
    "Usuario sin nombre"
  );
}


function obtenerIniciales(nombre) {
  const partes = String(nombre || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!partes.length) {
    return "US";
  }

  if (partes.length === 1) {
    return partes[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    partes[0].charAt(0) +
    partes[partes.length - 1].charAt(0)
  ).toUpperCase();
}


function traducirRol(rol) {
  const etiquetas = {
    admin: "Administrador",
    profesional: "Profesional",
    perito: "Perito",
    periciado: "Periciado",
    alumno: "Alumno",
    biblioteca: "Biblioteca",
    informe: "Informe"
  };

  return etiquetas[rol] || "Sin rol";
}


function claseRol(rol) {
  const clases = {
    admin: "up-badge--admin",
    profesional: "up-badge--professional",
    perito: "up-badge--perito",
    periciado: "up-badge--periciado",
    alumno: "up-badge--alumno",
    biblioteca: "up-badge--biblioteca",
    informe: "up-badge--informe"
  };

  return clases[rol] || "";
}


function usuarioEstaArchivado(usuario) {
  return usuario.archivado === true;
}


function usuarioEstaActivo(usuario) {
  if (usuarioEstaArchivado(usuario)) {
    return false;
  }

  if (usuario.activo === false) {
    return false;
  }

  if (usuario.habilitado === false) {
    return false;
  }

  return true;
}


function esAdministradorPrincipal(usuario) {
  return (
    normalizarTexto(usuario?.email) ===
    normalizarTexto(ADMIN_EMAIL)
  );
}


function contarPermisos(usuario) {
  const permisos = usuario.permisos;

  if (
    !permisos ||
    typeof permisos !== "object" ||
    Array.isArray(permisos)
  ) {
    return 0;
  }

  return Object.values(permisos)
    .filter((permiso) => permiso === true)
    .length;
}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(texto, tipo = "") {
  if (!mensajeSistema) {
    return;
  }

  mensajeSistema.hidden = false;
  mensajeSistema.textContent = texto;
  mensajeSistema.className = "up-message";

  if (tipo) {
    mensajeSistema.classList.add(`is-${tipo}`);
  }
}


function ocultarMensaje() {
  if (!mensajeSistema) {
    return;
  }

  mensajeSistema.hidden = true;
  mensajeSistema.textContent = "";
  mensajeSistema.className = "up-message";
}


/* =========================================================
   ESTADOS DE TABLA
========================================================= */

function mostrarCarga(texto = "Cargando usuarios...") {
  if (!usuariosTabla) {
    return;
  }

  usuariosTabla.innerHTML = `
    <tr>
      <td colspan="6" class="up-loading">
        ${escaparHTML(texto)}
      </td>
    </tr>
  `;
}


function mostrarEstadoVacio() {
  if (!usuariosTabla) {
    return;
  }

  usuariosTabla.innerHTML = `
    <tr>
      <td colspan="6" class="up-empty">
        No se encontraron usuarios con los criterios seleccionados.
      </td>
    </tr>
  `;
}


/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadores(usuarios) {
  const usuariosNoArchivados =
    usuarios.filter(
      (usuario) =>
        !usuarioEstaArchivado(usuario)
    );

  const cantidadTotal =
    usuariosNoArchivados.length;


    const cantidadArchivados =
  usuarios.filter(
    (usuario) =>
      usuarioEstaArchivado(usuario)
  ).length;

  const cantidadAdmins =
    usuariosNoArchivados.filter(
      (usuario) =>
        normalizarRol(usuario.rol) === "admin"
    ).length;

  const cantidadProfesionales =
    usuariosNoArchivados.filter(
      (usuario) =>
        normalizarRol(usuario.rol) === "profesional"
    ).length;

  const cantidadOtros =
    cantidadTotal -
    cantidadAdmins -
    cantidadProfesionales;

  if (totalUsuarios) {
    totalUsuarios.textContent =
      cantidadTotal.toLocaleString("es-AR");
  }

  if (totalAdmins) {
    totalAdmins.textContent =
      cantidadAdmins.toLocaleString("es-AR");
  }

  if (totalProfesionales) {
    totalProfesionales.textContent =
      cantidadProfesionales.toLocaleString("es-AR");
  }

  if (totalOtros) {
    totalOtros.textContent =
      cantidadOtros.toLocaleString("es-AR");
  }

  if (totalArchivados) {
  totalArchivados.textContent =
    cantidadArchivados.toLocaleString("es-AR");
}
}


/* =========================================================
   ESTADO VISUAL
========================================================= */

function obtenerEstadoVisual(usuario) {
  if (usuarioEstaArchivado(usuario)) {
    return {
      texto: "Archivado",
      clase: "is-archived"
    };
  }

  if (usuarioEstaActivo(usuario)) {
    return {
      texto: "Activo",
      clase: "is-active"
    };
  }

  return {
    texto: "Inactivo",
    clase: "is-inactive"
  };
}


/* =========================================================
   FILA DE USUARIO
========================================================= */

function crearFilaUsuario(usuario) {
  const fila =
    document.createElement("tr");

  const rol =
    normalizarRol(usuario.rol);

  const nombre =
    obtenerNombreUsuario(usuario);

  const email =
    usuario.email || "Correo no registrado";

  const permisosActivos =
    contarPermisos(usuario);

  const uidSeguro =
    encodeURIComponent(usuario.uid);

  const estado =
    obtenerEstadoVisual(usuario);

  const archivado =
    usuarioEstaArchivado(usuario);

  const principal =
    esAdministradorPrincipal(usuario);

const fechaArchivado =
  archivado
    ? formatearFechaFirestore(
        usuario.fechaArchivado
      )
    : "";

const archivadoPor =
  archivado
    ? (
        usuario.archivadoPor ||
        "Administrador no registrado"
      )
    : "";


  const botonArchivo = principal
    ? `
      <button
        type="button"
        class="up-action-button up-action-button--disabled"
        disabled
        title="El administrador principal no puede archivarse"
      >
        Protegido
      </button>
    `
    : archivado
      ? `
        <button
          type="button"
          class="up-action-button up-action-button--restore"
          data-action="restaurar"
          data-uid="${escaparHTML(usuario.uid)}"
        >
          Restaurar
        </button>
      `
      : `
        <button
          type="button"
          class="up-action-button up-action-button--archive"
          data-action="archivar"
          data-uid="${escaparHTML(usuario.uid)}"
        >
          Archivar
        </button>
      `;

  fila.dataset.uid =
    usuario.uid;

  fila.classList.toggle(
    "is-archived",
    archivado
  );

  fila.innerHTML = `
    <td>
      <div class="up-user-cell">

        <span class="up-user-avatar">
          ${escaparHTML(obtenerIniciales(nombre))}
        </span>

        <span class="up-user-data">

          <strong>
            ${escaparHTML(nombre)}
          </strong>

          <small>
            UID: ${escaparHTML(usuario.uid.slice(0, 12))}…
          </small>

        </span>

      </div>
    </td>

    <td>
      <span
        class="up-email"
        title="${escaparHTML(email)}"
      >
        ${escaparHTML(email)}
      </span>
    </td>

    <td>
      <span class="up-badge ${claseRol(rol)}">
        ${escaparHTML(traducirRol(rol))}
      </span>
    </td>

   <td>
  <div class="up-status-cell">

    <span class="up-status ${estado.clase}">
      ${estado.texto}
    </span>

    ${
      archivado
        ? `
          <span class="up-archive-detail">
            <strong>Archivado:</strong>
            ${escaparHTML(fechaArchivado)}
          </span>

          <span
            class="up-archive-detail"
            title="${escaparHTML(archivadoPor)}"
          >
            <strong>Por:</strong>
            ${escaparHTML(archivadoPor)}
          </span>
        `
        : ""
    }

  </div>
</td>

    <td>
      <span class="up-badge">
        ${
          permisosActivos > 0
            ? `${permisosActivos} ${
                permisosActivos === 1
                  ? "permiso"
                  : "permisos"
              }`
            : "Según rol"
        }
      </span>
    </td>

    <td>
      <div class="up-actions">

        <a
          href="./usuario.html?uid=${uidSeguro}"
          class="up-action-button"
        >
          Administrar
        </a>

        ${botonArchivo}

      </div>
    </td>
  `;

  return fila;
}


/* =========================================================
   FILTROS
========================================================= */

function obtenerUsuariosFiltrados() {
  const texto =
    normalizarTexto(buscarUsuario?.value);

  const rolSeleccionado =
    normalizarRol(filtroRol?.value);

  const estadoSeleccionado =
    normalizarTexto(
      filtroEstado?.value || "activos"
    );

  return usuariosCargados.filter((usuario) => {
    const nombre =
      normalizarTexto(
        obtenerNombreUsuario(usuario)
      );

    const email =
      normalizarTexto(usuario.email);

    const rol =
      normalizarRol(usuario.rol);

    const uid =
      normalizarTexto(usuario.uid);

    const archivado =
      usuarioEstaArchivado(usuario);

    const activo =
      usuarioEstaActivo(usuario);

    const coincideTexto =
      !texto ||
      nombre.includes(texto) ||
      email.includes(texto) ||
      rol.includes(texto) ||
      uid.includes(texto);

    const coincideRol =
      !rolSeleccionado ||
      rol === rolSeleccionado;

    let coincideEstado = true;

    if (estadoSeleccionado === "activos") {
      coincideEstado =
        !archivado && activo;
    }

    if (estadoSeleccionado === "inactivos") {
      coincideEstado =
        !archivado && !activo;
    }

    if (estadoSeleccionado === "archivados") {
      coincideEstado =
        archivado;
    }

    if (estadoSeleccionado === "todos") {
      coincideEstado = true;
    }

    return (
      coincideTexto &&
      coincideRol &&
      coincideEstado
    );
  });
}


/* =========================================================
   RENDER
========================================================= */

function renderizarUsuarios() {
  if (!usuariosTabla) {
    return;
  }

  const usuariosFiltrados =
    obtenerUsuariosFiltrados();

  usuariosTabla.innerHTML = "";

  if (!usuariosFiltrados.length) {
    mostrarEstadoVacio();
  } else {
    const fragmento =
      document.createDocumentFragment();

    usuariosFiltrados.forEach((usuario) => {
      fragmento.appendChild(
        crearFilaUsuario(usuario)
      );
    });

    usuariosTabla.appendChild(fragmento);
  }

  if (resultadoCantidad) {
    resultadoCantidad.textContent =
      `${usuariosFiltrados.length} ${
        usuariosFiltrados.length === 1
          ? "usuario"
          : "usuarios"
      }`;
  }
}


/* =========================================================
   BUSCAR USUARIO LOCAL
========================================================= */

function buscarUsuarioPorUid(uid) {
  return usuariosCargados.find(
    (usuario) =>
      usuario.uid === uid
  );
}


/* =========================================================
   ARCHIVAR USUARIO
========================================================= */

async function archivarUsuario(uid) {
  const usuario =
    buscarUsuarioPorUid(uid);

  if (!usuario) {
    mostrarMensaje(
      "No se encontró el usuario seleccionado.",
      "error"
    );

    return;
  }

  if (esAdministradorPrincipal(usuario)) {
    mostrarMensaje(
      "El administrador principal no puede archivarse.",
      "error"
    );

    return;
  }

  const nombre =
    obtenerNombreUsuario(usuario);

  const confirmado =
    window.confirm(
      `¿Desea archivar a ${nombre}?\n\n` +
      "El usuario conservará su registro y podrá restaurarse posteriormente."
    );

  if (!confirmado) {
    return;
  }

  ocultarMensaje();

  try {
    const referenciaUsuario =
      doc(
        db,
        "usuarios",
        uid
      );

    await updateDoc(
      referenciaUsuario,
      {
        archivado: true,
        activo: false,
        fechaArchivado:
          serverTimestamp(),
        archivadoPor:
          administradorActual?.email ||
          ADMIN_EMAIL,
        fechaActualizacion:
          serverTimestamp()
      }
    );

    usuario.archivado = true;
    usuario.activo = false;
    usuario.archivadoPor =
      administradorActual?.email ||
      ADMIN_EMAIL;

usuario.fechaArchivado =
  new Date();


    actualizarIndicadores(
      usuariosCargados
    );

    renderizarUsuarios();

    mostrarMensaje(
      `${nombre} fue archivado correctamente.`,
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al archivar.",
      error
    );

    mostrarMensaje(
      `No fue posible archivar el usuario: ${
        error?.code ||
        error?.message ||
        "error desconocido"
      }.`,
      "error"
    );
  }
}


/* =========================================================
   RESTAURAR USUARIO
========================================================= */

async function restaurarUsuario(uid) {
  const usuario =
    buscarUsuarioPorUid(uid);

  if (!usuario) {
    mostrarMensaje(
      "No se encontró el usuario seleccionado.",
      "error"
    );

    return;
  }

  const nombre =
    obtenerNombreUsuario(usuario);

  const confirmado =
    window.confirm(
      `¿Desea restaurar a ${nombre}?\n\n` +
      "El usuario volverá a aparecer entre los usuarios activos."
    );

  if (!confirmado) {
    return;
  }

  ocultarMensaje();

  try {
    const referenciaUsuario =
      doc(
        db,
        "usuarios",
        uid
      );

    await updateDoc(
      referenciaUsuario,
      {
        archivado: false,
        activo: true,
        fechaRestaurado:
          serverTimestamp(),
        restauradoPor:
          administradorActual?.email ||
          ADMIN_EMAIL,
        fechaActualizacion:
          serverTimestamp()
      }
    );

    usuario.archivado = false;
    usuario.activo = true;

usuario.fechaArchivado = null;
usuario.archivadoPor = null;

    usuario.restauradoPor =
      administradorActual?.email ||
      ADMIN_EMAIL;

    actualizarIndicadores(
      usuariosCargados
    );

    renderizarUsuarios();

    mostrarMensaje(
      `${nombre} fue restaurado correctamente.`,
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al restaurar.",
      error
    );

    mostrarMensaje(
      `No fue posible restaurar el usuario: ${
        error?.code ||
        error?.message ||
        "error desconocido"
      }.`,
      "error"
    );
  }
}


/* =========================================================
   ACCIONES DE TABLA
========================================================= */

async function procesarAccionTabla(evento) {
  const boton =
    evento.target.closest(
      "[data-action][data-uid]"
    );

  if (!boton) {
    return;
  }

  const accion =
    boton.dataset.action;

  const uid =
    boton.dataset.uid;

  if (!accion || !uid) {
    return;
  }

  boton.disabled = true;

  const textoOriginal =
    boton.textContent;

  boton.textContent =
    accion === "archivar"
      ? "Archivando..."
      : "Restaurando...";

  try {
    if (accion === "archivar") {
      await archivarUsuario(uid);
    }

    if (accion === "restaurar") {
      await restaurarUsuario(uid);
    }

  } finally {
    if (document.body.contains(boton)) {
      boton.disabled = false;
      boton.textContent =
        textoOriginal;
    }
  }
}


/* =========================================================
   CARGA DE USUARIOS
========================================================= */

async function cargarUsuarios() {
  ocultarMensaje();
  mostrarCarga();

  if (btnActualizarUsuarios) {
    btnActualizarUsuarios.disabled = true;
    btnActualizarUsuarios.textContent =
      "Actualizando...";
  }

  try {
    const referenciaUsuarios =
      collection(db, "usuarios");

    const snapshot =
      await getDocs(referenciaUsuarios);

    usuariosCargados =
      snapshot.docs.map((documento) => ({
        uid: documento.id,
        ...(documento.data() || {})
      }));

    usuariosCargados.sort((a, b) => {
      return obtenerNombreUsuario(a)
        .localeCompare(
          obtenerNombreUsuario(b),
          "es",
          {
            sensitivity: "base"
          }
        );
    });

    actualizarIndicadores(
      usuariosCargados
    );

    renderizarUsuarios();

    mostrarMensaje(
      "Listado de usuarios actualizado correctamente.",
      "success"
    );

    window.setTimeout(
      ocultarMensaje,
      3000
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al cargar la colección.",
      error
    );

    usuariosCargados = [];

    actualizarIndicadores([]);

    if (resultadoCantidad) {
      resultadoCantidad.textContent =
        "0 usuarios";
    }

    if (usuariosTabla) {
      usuariosTabla.innerHTML = `
        <tr>
          <td colspan="6" class="up-empty">
            No fue posible cargar los usuarios.
          </td>
        </tr>
      `;
    }

    mostrarMensaje(
      `No fue posible consultar usuarios: ${
        error?.code ||
        error?.message ||
        "error desconocido"
      }.`,
      "error"
    );

  } finally {
    if (btnActualizarUsuarios) {
      btnActualizarUsuarios.disabled = false;
      btnActualizarUsuarios.textContent =
        "Actualizar listado";
    }
  }
}


/* =========================================================
   VALIDACIÓN ADMINISTRATIVA
========================================================= */

async function verificarAdministrador(user) {
  const emailActual =
    normalizarTexto(user.email);

  if (
    emailActual ===
    normalizarTexto(ADMIN_EMAIL)
  ) {
    return {
      autorizado: true,
      datos: {
        uid: user.uid,
        email: user.email,
        nombreCompleto: "Isabela Falco",
        rol: "admin"
      }
    };
  }

  const referenciaUsuario =
    doc(db, "usuarios", user.uid);

  const snapshotUsuario =
    await getDoc(referenciaUsuario);

  const datos =
    snapshotUsuario.exists()
      ? snapshotUsuario.data()
      : {};

  const rol =
    normalizarRol(datos.rol);

  return {
    autorizado: rol === "admin",
    datos: {
      uid: user.uid,
      email: user.email,
      ...datos,
      rol
    }
  };
}


/* =========================================================
   CIERRE DE SESIÓN
========================================================= */

async function cerrarSesion() {
  try {
    await signOut(auth);

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al cerrar sesión.",
      error
    );

  } finally {
    window.location.href =
      RUTA_LOGIN;
  }
}

/* =========================================================
   NAVEGACIÓN POR PESTAÑAS
========================================================= */

function mostrarPanel(nombrePanel) {
  const mostrarUsuarios =
    nombrePanel === "usuarios";

  if (panelUsuarios) {
    panelUsuarios.hidden =
      !mostrarUsuarios;

    panelUsuarios.classList.toggle(
      "is-active",
      mostrarUsuarios
    );
  }

  if (panelNuevoUsuario) {
    panelNuevoUsuario.hidden =
      mostrarUsuarios;

    panelNuevoUsuario.classList.toggle(
      "is-active",
      !mostrarUsuarios
    );
  }

  if (tabUsuarios) {
    tabUsuarios.classList.toggle(
      "is-active",
      mostrarUsuarios
    );

    tabUsuarios.setAttribute(
      "aria-selected",
      String(mostrarUsuarios)
    );
  }

  if (tabNuevoUsuario) {
    tabNuevoUsuario.classList.toggle(
      "is-active",
      !mostrarUsuarios
    );

    tabNuevoUsuario.setAttribute(
      "aria-selected",
      String(!mostrarUsuarios)
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   CONTRASEÑA TEMPORAL
========================================================= */

function generarPasswordTemporal() {
  const mayusculas =
    "ABCDEFGHJKLMNPQRSTUVWXYZ";

  const minusculas =
    "abcdefghijkmnopqrstuvwxyz";

  const numeros =
    "23456789";

  const simbolos =
    "!@#$%";

  const todos =
    mayusculas +
    minusculas +
    numeros +
    simbolos;

  let password =
    mayusculas[
      Math.floor(
        Math.random() *
        mayusculas.length
      )
    ] +
    minusculas[
      Math.floor(
        Math.random() *
        minusculas.length
      )
    ] +
    numeros[
      Math.floor(
        Math.random() *
        numeros.length
      )
    ] +
    simbolos[
      Math.floor(
        Math.random() *
        simbolos.length
      )
    ];

  while (password.length < 12) {
    password +=
      todos[
        Math.floor(
          Math.random() *
          todos.length
        )
      ];
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  if (nuevaPassword) {
    nuevaPassword.value =
      password;

    nuevaPassword.focus();
    nuevaPassword.select();
  }
}


/* =========================================================
   PERMISOS SUGERIDOS POR ROL
========================================================= */

const PERMISOS_POR_ROL = {
  admin: [
    "centroProfesional",
    "gestionPericiados",
    "evaluaciones",
    "documentacionPericiados",
    "biblioteca",
    "campus",
    "escuela",
    "admision",
    "comunidad",
    "administracion"
  ],

  profesional: [
    "centroProfesional",
    "gestionPericiados",
    "evaluaciones",
    "documentacionPericiados",
    "biblioteca",
    "campus"
  ],

  perito: [
    "centroProfesional",
    "gestionPericiados",
    "evaluaciones",
    "documentacionPericiados",
    "biblioteca",
    "campus"
  ],

  periciado: [
    "evaluaciones",
    "documentacionPericiados"
  ],

  alumno: [
    "campus",
    "escuela",
    "biblioteca"
  ],

  biblioteca: [
    "biblioteca"
  ],

  informe: [
    "evaluaciones",
    "documentacionPericiados"
  ]
};


function obtenerChecksPermisos() {
  return [
    ...document.querySelectorAll(
      '#formNuevoUsuario input[name="permisos"]'
    )
  ];
}


function limpiarPermisosSeleccionados() {
  obtenerChecksPermisos()
    .forEach((checkbox) => {
      checkbox.checked = false;
    });
}


function aplicarPermisosSugeridos() {
  const rol =
    normalizarRol(
      nuevoRol?.value
    );

  limpiarPermisosSeleccionados();

  const permisosSugeridos =
    PERMISOS_POR_ROL[rol] || [];

  obtenerChecksPermisos()
    .forEach((checkbox) => {
      checkbox.checked =
        permisosSugeridos.includes(
          checkbox.value
        );
    });
}

/* =========================================================
   DATOS DEL NUEVO USUARIO
========================================================= */

function obtenerPermisosSeleccionados() {
  const permisos = {};

  obtenerChecksPermisos().forEach((checkbox) => {
    permisos[checkbox.value] =
      checkbox.checked;
  });

  return permisos;
}


function validarFormularioNuevoUsuario() {
  const nombre =
    String(nuevoNombre?.value || "")
      .trim();

  const email =
    String(nuevoEmail?.value || "")
      .trim()
      .toLowerCase();

  const rol =
    normalizarRol(nuevoRol?.value);

  const password =
    String(nuevaPassword?.value || "");

  if (!nombre) {
    throw new Error(
      "Ingrese el nombre completo."
    );
  }

  if (!email) {
    throw new Error(
      "Ingrese el correo electrónico."
    );
  }

  if (!nuevoEmail?.checkValidity()) {
    throw new Error(
      "Ingrese un correo electrónico válido."
    );
  }

  if (!rol) {
    throw new Error(
      "Seleccione un rol."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres."
    );
  }

  return {
    nombre,
    email,
    rol,
    password,

    activo:
      nuevoEstado?.value !== "inactivo",

    permisos:
      obtenerPermisosSeleccionados()
  };
}


/* =========================================================
   CREAR USUARIO
========================================================= */

async function crearNuevoUsuario() {
  let appSecundaria = null;
  let authSecundaria = null;

  const btnCrearUsuario =
    document.getElementById(
      "btnCrearUsuario"
    );

  const textoOriginal =
    btnCrearUsuario?.textContent ||
    "Crear usuario";

  try {
    const datos =
      validarFormularioNuevoUsuario();

    if (btnCrearUsuario) {
      btnCrearUsuario.disabled = true;
      btnCrearUsuario.textContent =
        "Creando usuario...";
    }

    ocultarMensaje();

    const nombreInstancia =
      `falco-alta-${Date.now()}`;

    appSecundaria =
      initializeApp(
        firebaseConfig,
        nombreInstancia
      );

    authSecundaria =
      getAuth(appSecundaria);

    const credencial =
      await createUserWithEmailAndPassword(
        authSecundaria,
        datos.email,
        datos.password
      );

    const usuarioCreado =
      credencial.user;

    await setDoc(
      doc(
        db,
        "usuarios",
        usuarioCreado.uid
      ),
      {
        nombreCompleto:
          datos.nombre,

        email:
          datos.email,

        rol:
          datos.rol,

        activo:
          datos.activo,

        habilitado:
          datos.activo,

        archivado:
          false,

        permisos:
          datos.permisos,

        usado:
          false,

        creadoPor:
          administradorActual?.email ||
          ADMIN_EMAIL,

        fechaCreacion:
          serverTimestamp(),

        fechaActualizacion:
          serverTimestamp()
      }
    );

    await signOut(authSecundaria);

    formNuevoUsuario?.reset();

    limpiarPermisosSeleccionados();

    await cargarUsuarios();

    mostrarPanel("usuarios");

    mostrarMensaje(
      `El usuario ${datos.email} fue creado correctamente.`,
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al crear usuario.",
      error
    );

    const mensajes = {
      "auth/email-already-in-use":
        "Ya existe un usuario con ese correo electrónico.",

      "auth/invalid-email":
        "El correo electrónico no es válido.",

      "auth/weak-password":
        "La contraseña es demasiado débil.",

      "auth/operation-not-allowed":
        "La creación mediante correo y contraseña no está habilitada."
    };

    mostrarMensaje(
      mensajes[error?.code] ||
      error?.message ||
      "No fue posible crear el usuario.",
      "error"
    );

  } finally {
    if (
      authSecundaria?.currentUser
    ) {
      try {
        await signOut(
          authSecundaria
        );
      } catch (error) {
        console.warn(
          "No se pudo cerrar la sesión secundaria.",
          error
        );
      }
    }

    if (appSecundaria) {
      try {
        await deleteApp(
          appSecundaria
        );
      } catch (error) {
        console.warn(
          "No se pudo eliminar la instancia secundaria.",
          error
        );
      }
    }

    if (btnCrearUsuario) {
      btnCrearUsuario.disabled = false;
      btnCrearUsuario.textContent =
        textoOriginal;
    }
  }
}



/* =========================================================
   EVENTOS
========================================================= */

tabUsuarios?.addEventListener(
  "click",
  () => {
    mostrarPanel("usuarios");
  }
);


tabNuevoUsuario?.addEventListener(
  "click",
  () => {
    mostrarPanel("nuevo");
  }
);


btnVolverUsuarios?.addEventListener(
  "click",
  () => {
    mostrarPanel("usuarios");
  }
);


btnCancelarNuevoUsuario?.addEventListener(
  "click",
  () => {
    formNuevoUsuario?.reset();
    limpiarPermisosSeleccionados();
    mostrarPanel("usuarios");
  }
);


btnGenerarPassword?.addEventListener(
  "click",
  generarPasswordTemporal
);


btnPermisosRol?.addEventListener(
  "click",
  aplicarPermisosSugeridos
);


btnLimpiarPermisos?.addEventListener(
  "click",
  limpiarPermisosSeleccionados
);


nuevoRol?.addEventListener(
  "change",
  aplicarPermisosSugeridos
);


btnCerrarSesion?.addEventListener(
  "click",
  cerrarSesion
);


btnActualizarUsuarios?.addEventListener(
  "click",
  cargarUsuarios
);


buscarUsuario?.addEventListener(
  "input",
  renderizarUsuarios
);


filtroRol?.addEventListener(
  "change",
  renderizarUsuarios
);


filtroEstado?.addEventListener(
  "change",
  renderizarUsuarios
);


usuariosTabla?.addEventListener(
  "click",
  procesarAccionTabla
);


formNuevoUsuario?.addEventListener(
  "submit",
  async (evento) => {
    evento.preventDefault();

    await crearNuevoUsuario();
  }
);


/* =========================================================
   SESIÓN
========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {
    if (!user) {
      window.location.href =
        RUTA_LOGIN;

      return;
    }

    mostrarCarga(
      "Verificando permisos administrativos..."
    );

    try {
      const validacion =
        await verificarAdministrador(user);

      if (!validacion.autorizado) {
        mostrarMensaje(
          "No tiene autorización para administrar usuarios.",
          "error"
        );

        window.setTimeout(() => {
          window.location.href =
            RUTA_PORTAL;
        }, 1200);

        return;
      }

      administradorActual =
        validacion.datos;

      if (adminNombre) {
        adminNombre.textContent =
          obtenerNombreUsuario(
            administradorActual
          );
      }

      if (adminRol) {
        adminRol.textContent =
          "ADMIN";
      }

      await cargarUsuarios();

    } catch (error) {
      console.error(
        "FALCO® Usuarios: error al verificar la sesión.",
        error
      );

      mostrarMensaje(
        "No fue posible verificar los permisos administrativos.",
        "error"
      );

      if (usuariosTabla) {
        usuariosTabla.innerHTML = `
          <tr>
            <td colspan="6" class="up-empty">
              No fue posible iniciar el módulo.
            </td>
          </tr>
        `;
      }
    }
  }
);