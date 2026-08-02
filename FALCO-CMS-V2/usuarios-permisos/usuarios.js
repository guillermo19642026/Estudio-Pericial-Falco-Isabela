/*
=========================================
FALCO®
Administración de Usuarios y Permisos
Listado general de usuarios
Versión 1.0
=========================================

Esta pantalla:
- Verifica sesión.
- Permite acceso solo al administrador.
- Lee la colección usuarios.
- No modifica documentos.
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
  getDoc
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


function usuarioEstaActivo(usuario) {
  if (usuario.activo === false) {
    return false;
  }

  if (usuario.habilitado === false) {
    return false;
  }

  return true;
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
  const cantidadTotal =
    usuarios.length;

  const cantidadAdmins =
    usuarios.filter(
      (usuario) =>
        normalizarRol(usuario.rol) === "admin"
    ).length;

  const cantidadProfesionales =
    usuarios.filter(
      (usuario) =>
        normalizarRol(usuario.rol) === "profesional"
    ).length;

  const cantidadOtros =
    cantidadTotal -
    cantidadAdmins -
    cantidadProfesionales;

  totalUsuarios.textContent =
    cantidadTotal.toLocaleString("es-AR");

  totalAdmins.textContent =
    cantidadAdmins.toLocaleString("es-AR");

  totalProfesionales.textContent =
    cantidadProfesionales.toLocaleString("es-AR");

  totalOtros.textContent =
    cantidadOtros.toLocaleString("es-AR");
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

  const activo =
    usuarioEstaActivo(usuario);

  const permisosActivos =
    contarPermisos(usuario);

  const uidSeguro =
    encodeURIComponent(usuario.uid);

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
      <span
        class="up-status ${
          activo
            ? "is-active"
            : "is-inactive"
        }"
      >
        ${
          activo
            ? "Activo"
            : "Inactivo"
        }
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
      <a
        href="./usuario.html?uid=${uidSeguro}"
        class="up-action-button"
      >
        Administrar
      </a>
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

    const coincideTexto =
      !texto ||
      nombre.includes(texto) ||
      email.includes(texto) ||
      rol.includes(texto) ||
      uid.includes(texto);

    const coincideRol =
      !rolSeleccionado ||
      rol === rolSeleccionado;

    return coincideTexto && coincideRol;
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

  resultadoCantidad.textContent =
    `${usuariosFiltrados.length} ${
      usuariosFiltrados.length === 1
        ? "usuario"
        : "usuarios"
    }`;
}


/* =========================================================
   CARGA DE USUARIOS
========================================================= */

async function cargarUsuarios() {
  ocultarMensaje();
  mostrarCarga();

  btnActualizarUsuarios.disabled = true;
  btnActualizarUsuarios.textContent = "Actualizando...";

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
    resultadoCantidad.textContent = "0 usuarios";

    usuariosTabla.innerHTML = `
      <tr>
        <td colspan="6" class="up-empty">
          No fue posible cargar los usuarios.
        </td>
      </tr>
    `;

    mostrarMensaje(
      `No fue posible consultar usuarios: ${
        error?.code || error?.message || "error desconocido"
      }.`,
      "error"
    );

  } finally {
    btnActualizarUsuarios.disabled = false;
    btnActualizarUsuarios.textContent =
      "Actualizar listado";
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
    window.location.href = RUTA_LOGIN;
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


/* =========================================================
   SESIÓN
========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {
    if (!user) {
      window.location.href = RUTA_LOGIN;
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
          window.location.href = RUTA_PORTAL;
        }, 1200);

        return;
      }

      const administrador =
        validacion.datos;

      adminNombre.textContent =
        obtenerNombreUsuario(administrador);

      adminRol.textContent =
        "ADMIN";

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

      usuariosTabla.innerHTML = `
        <tr>
          <td colspan="6" class="up-empty">
            No fue posible iniciar el módulo.
          </td>
        </tr>
      `;
    }
  }
);