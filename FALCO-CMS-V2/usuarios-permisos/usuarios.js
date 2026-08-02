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
  db
} from "../../firebase-config.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  collection,
  getDocs,
  doc,
  getDoc,
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
      <span class="up-status ${estado.clase}">
        ${estado.texto}
      </span>
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
   EVENTOS
========================================================= */

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