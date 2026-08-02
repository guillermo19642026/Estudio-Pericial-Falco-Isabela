/*
=========================================
FALCO®
Administración de Usuarios y Permisos
Ficha individual de usuario
Versión 1.0
=========================================

Funciones:
- Verifica sesión administrativa.
- Obtiene el UID desde la URL.
- Lee usuarios/{uid}.
- Permite editar nombre, rol y estado.
- Permite asignar permisos personalizados.
- Guarda cambios en Firestore.
- No modifica Firebase Authentication.
=========================================
*/

"use strict";




import {
  auth,
  db
} from "../../firebase-config.js";


import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
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

const RUTA_USUARIOS =
  "./usuarios.html";

  const URL_ACCESO_INSTITUCIONAL =
  "https://periciapsicologicafalco.ar/FALCO-CMS-V2/ecosistema-falco.html#acceso";


/* =========================================================
   PERMISOS DISPONIBLES
========================================================= */

const NOMBRES_PERMISOS = [
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
];


/* =========================================================
   PERMISOS SUGERIDOS SEGÚN ROL
========================================================= */

const PERMISOS_POR_ROL = {

  admin: {
    centroProfesional: true,
    gestionPericiados: true,
    evaluaciones: true,
    documentacionPericiados: true,
    biblioteca: true,
    campus: true,
    escuela: true,
    admision: true,
    comunidad: true,
    administracion: true
  },

  profesional: {
    centroProfesional: true,
    gestionPericiados: true,
    evaluaciones: true,
    documentacionPericiados: true,
    biblioteca: true,
    campus: true,
    escuela: false,
    admision: false,
    comunidad: false,
    administracion: false
  },

  perito: {
    centroProfesional: true,
    gestionPericiados: true,
    evaluaciones: true,
    documentacionPericiados: true,
    biblioteca: true,
    campus: true,
    escuela: false,
    admision: false,
    comunidad: false,
    administracion: false
  },

  periciado: {
    centroProfesional: false,
    gestionPericiados: false,
    evaluaciones: true,
    documentacionPericiados: true,
    biblioteca: false,
    campus: false,
    escuela: false,
    admision: false,
    comunidad: false,
    administracion: false
  },

  alumno: {
    centroProfesional: false,
    gestionPericiados: false,
    evaluaciones: false,
    documentacionPericiados: false,
    biblioteca: true,
    campus: true,
    escuela: true,
    admision: false,
    comunidad: false,
    administracion: false
  },

  biblioteca: {
    centroProfesional: false,
    gestionPericiados: false,
    evaluaciones: false,
    documentacionPericiados: false,
    biblioteca: true,
    campus: false,
    escuela: false,
    admision: false,
    comunidad: false,
    administracion: false
  },

  informe: {
    centroProfesional: false,
    gestionPericiados: false,
    evaluaciones: false,
    documentacionPericiados: false,
    biblioteca: false,
    campus: false,
    escuela: false,
    admision: false,
    comunidad: false,
    administracion: false
  }

};


/* =========================================================
   ELEMENTOS
========================================================= */

const adminNombre =
  document.getElementById("adminNombre");

const adminRol =
  document.getElementById("adminRol");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const mensajeSistema =
  document.getElementById("mensajeSistema");

const panelCarga =
  document.getElementById("panelCarga");

const contenidoUsuario =
  document.getElementById("contenidoUsuario");

const usuarioIniciales =
  document.getElementById("usuarioIniciales");

const usuarioNombre =
  document.getElementById("usuarioNombre");

const usuarioEmail =
  document.getElementById("usuarioEmail");

const usuarioEstadoResumen =
  document.getElementById("usuarioEstadoResumen");

const usuarioRolResumen =
  document.getElementById("usuarioRolResumen");

const campoNombre =
  document.getElementById("campoNombre");

const campoEmail =
  document.getElementById("campoEmail");

const campoUid =
  document.getElementById("campoUid");

const campoRol =
  document.getElementById("campoRol");

const campoActivo =
  document.getElementById("campoActivo");

const datoDocumento =
  document.getElementById("datoDocumento");

const datoCreacion =
  document.getElementById("datoCreacion");

const datoActualizacion =
  document.getElementById("datoActualizacion");

const datoUsado =
  document.getElementById("datoUsado");

const btnSeleccionarRol =
  document.getElementById("btnSeleccionarRol");

const btnLimpiarPermisos =
  document.getElementById("btnLimpiarPermisos");

const btnGuardarUsuario =
  document.getElementById("btnGuardarUsuario");

const seguridadEmail =
  document.getElementById("seguridadEmail");

const enlaceAccesoUsuario =
  document.getElementById("enlaceAccesoUsuario");

const btnRestablecerPassword =
  document.getElementById("btnRestablecerPassword");

const btnCopiarEnlaceAcceso =
  document.getElementById("btnCopiarEnlaceAcceso");


const camposPermisos =
  document.querySelectorAll("[data-permiso]");


/* =========================================================
   ESTADO
========================================================= */

let usuarioActual = null;

let administradorActual = null;

let uidSeleccionado = null;


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


function usuarioEstaActivo(usuario) {
  if (usuario.activo === false) {
    return false;
  }

  if (usuario.habilitado === false) {
    return false;
  }

  return true;
}


function obtenerUidDesdeURL() {
  const params =
    new URLSearchParams(window.location.search);

  return String(
    params.get("uid") || ""
  ).trim();
}


function formatearFecha(valor) {
  if (!valor) {
    return "No registrada";
  }

  try {
    let fecha = null;

    if (
      valor &&
      typeof valor.toDate === "function"
    ) {
      fecha = valor.toDate();
    } else if (
      valor &&
      typeof valor.seconds === "number"
    ) {
      fecha =
        new Date(valor.seconds * 1000);
    } else {
      fecha = new Date(valor);
    }

    if (
      !fecha ||
      Number.isNaN(fecha.getTime())
    ) {
      return "No registrada";
    }

    return fecha.toLocaleString(
      "es-AR",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  } catch (error) {
    console.warn(
      "FALCO® Usuarios: fecha no válida.",
      error
    );

    return "No registrada";
  }
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
  mensajeSistema.className = "uf-message";

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
  mensajeSistema.className = "uf-message";
}


/* =========================================================
   VISIBILIDAD
========================================================= */

function mostrarCarga() {
  if (panelCarga) {
    panelCarga.hidden = false;
  }

  if (contenidoUsuario) {
    contenidoUsuario.hidden = true;
  }
}


function mostrarContenido() {
  if (panelCarga) {
    panelCarga.hidden = true;
  }

  if (contenidoUsuario) {
    contenidoUsuario.hidden = false;
  }
}


/* =========================================================
   PERMISOS
========================================================= */

function obtenerPermisosFormulario() {
  const permisos = {};

  camposPermisos.forEach((campo) => {
    const nombrePermiso =
      campo.dataset.permiso;

    if (!nombrePermiso) {
      return;
    }

    permisos[nombrePermiso] =
      Boolean(campo.checked);
  });

  return permisos;
}


function cargarPermisosFormulario(permisos = {}) {
  camposPermisos.forEach((campo) => {
    const nombrePermiso =
      campo.dataset.permiso;

    campo.checked =
      permisos?.[nombrePermiso] === true;
  });
}


function limpiarPermisosFormulario() {
  const permisosVacios = {};

  NOMBRES_PERMISOS.forEach((permiso) => {
    permisosVacios[permiso] = false;
  });

  cargarPermisosFormulario(
    permisosVacios
  );
}


function aplicarPermisosPorRol() {
  const rol =
    normalizarRol(campoRol?.value);

  const permisosSugeridos =
    PERMISOS_POR_ROL[rol];

  if (!permisosSugeridos) {
    limpiarPermisosFormulario();

    mostrarMensaje(
      "El rol seleccionado no tiene permisos sugeridos definidos.",
      "error"
    );

    return;
  }

  cargarPermisosFormulario(
    permisosSugeridos
  );

  mostrarMensaje(
    `Se aplicaron los permisos sugeridos para el rol ${traducirRol(rol)}. Todavía debe guardar los cambios.`,
    "success"
  );
}


/* =========================================================
   RESUMEN VISUAL
========================================================= */

function actualizarResumenVisual() {
  const nombre =
    campoNombre?.value.trim() ||
    usuarioActual?.email ||
    "Usuario";

  const email =
    campoEmail?.value ||
    usuarioActual?.email ||
    "Correo no registrado";

  const rol =
    normalizarRol(campoRol?.value);

  const activo =
    Boolean(campoActivo?.checked);

  if (usuarioIniciales) {
    usuarioIniciales.textContent =
      obtenerIniciales(nombre);
  }

  if (usuarioNombre) {
    usuarioNombre.textContent =
      nombre;
  }

  if (usuarioEmail) {
    usuarioEmail.textContent =
      email;
  }

  if (usuarioRolResumen) {
    usuarioRolResumen.textContent =
      traducirRol(rol);
  }

  if (usuarioEstadoResumen) {
    usuarioEstadoResumen.textContent =
      activo
        ? "Activo"
        : "Inactivo";

    usuarioEstadoResumen.classList.toggle(
      "is-active",
      activo
    );

    usuarioEstadoResumen.classList.toggle(
      "is-inactive",
      !activo
    );
  }
}


/* =========================================================
   CARGA DE DATOS EN FORMULARIO
========================================================= */

function cargarUsuarioEnPantalla(usuario) {
  const nombre =
    obtenerNombreUsuario(usuario);

  const email =
    usuario.email || "";

  const rol =
    normalizarRol(usuario.rol);

  const activo =
    usuarioEstaActivo(usuario);

  campoNombre.value =
    nombre === "Usuario sin nombre"
      ? ""
      : nombre;

  campoEmail.value =
    email;

    if (seguridadEmail) {
  seguridadEmail.textContent =
    email || "Correo no registrado";
}

if (enlaceAccesoUsuario) {
  enlaceAccesoUsuario.textContent =
    URL_ACCESO_INSTITUCIONAL;
}

  campoUid.value =
    usuario.uid;

  campoRol.value =
    rol;

  campoActivo.checked =
    activo;

  cargarPermisosFormulario(
    usuario.permisos || {}
  );

  datoDocumento.textContent =
    `usuarios/${usuario.uid}`;

  datoCreacion.textContent =
    formatearFecha(
      usuario.fechaCreacion ||
      usuario.createdAt ||
      usuario.creadoEn
    );

  datoActualizacion.textContent =
    formatearFecha(
      usuario.fechaActualizacion ||
      usuario.updatedAt ||
      usuario.actualizadoEn
    );

  if (usuario.usado === true) {
    datoUsado.textContent =
      "Sí";
  } else if (usuario.usado === false) {
    datoUsado.textContent =
      "No";
  } else {
    datoUsado.textContent =
      "No informado";
  }

  actualizarResumenVisual();
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

  const referenciaAdministrador =
    doc(db, "usuarios", user.uid);

  const snapshotAdministrador =
    await getDoc(
      referenciaAdministrador
    );

  const datos =
    snapshotAdministrador.exists()
      ? snapshotAdministrador.data()
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
   CARGA DEL USUARIO SELECCIONADO
========================================================= */

async function cargarUsuarioSeleccionado() {
  ocultarMensaje();
  mostrarCarga();

  uidSeleccionado =
    obtenerUidDesdeURL();

  if (!uidSeleccionado) {
    mostrarMensaje(
      "No se recibió el identificador del usuario.",
      "error"
    );

    window.setTimeout(() => {
      window.location.href =
        RUTA_USUARIOS;
    }, 1500);

    return;
  }

  try {
    const referenciaUsuario =
      doc(
        db,
        "usuarios",
        uidSeleccionado
      );

    const snapshotUsuario =
      await getDoc(
        referenciaUsuario
      );

    if (!snapshotUsuario.exists()) {
      mostrarMensaje(
        "El usuario seleccionado no existe en Firestore.",
        "error"
      );

      window.setTimeout(() => {
        window.location.href =
          RUTA_USUARIOS;
      }, 1500);

      return;
    }

    usuarioActual = {
      uid: snapshotUsuario.id,
      ...(snapshotUsuario.data() || {})
    };

    cargarUsuarioEnPantalla(
      usuarioActual
    );

    mostrarContenido();

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al cargar el usuario.",
      error
    );

    mostrarMensaje(
      `No fue posible cargar el usuario: ${
        error?.code ||
        error?.message ||
        "error desconocido"
      }.`,
      "error"
    );
  }
}


/* =========================================================
   VALIDACIÓN DEL FORMULARIO
========================================================= */

function validarFormulario() {
  const nombre =
    campoNombre?.value.trim();

  const rol =
    normalizarRol(campoRol?.value);

  if (!nombre) {
    mostrarMensaje(
      "Ingrese el nombre del usuario.",
      "error"
    );

    campoNombre?.focus();
    return false;
  }

  if (!rol) {
    mostrarMensaje(
      "Seleccione un rol principal.",
      "error"
    );

    campoRol?.focus();
    return false;
  }

  return true;
}


/* =========================================================
   PROTECCIÓN DEL ADMINISTRADOR PRINCIPAL
========================================================= */

function esAdministradorPrincipal() {
  const emailUsuario =
    normalizarTexto(
      usuarioActual?.email
    );

  return (
    emailUsuario ===
    normalizarTexto(ADMIN_EMAIL)
  );
}


function validarCambiosAdministradorPrincipal() {
  if (!esAdministradorPrincipal()) {
    return true;
  }

  const rolNuevo =
    normalizarRol(campoRol?.value);

  const activoNuevo =
    Boolean(campoActivo?.checked);

  if (rolNuevo !== "admin") {
    mostrarMensaje(
      "El administrador principal no puede perder el rol de administrador.",
      "error"
    );

    campoRol.value = "admin";
    actualizarResumenVisual();

    return false;
  }

  if (!activoNuevo) {
    mostrarMensaje(
      "El administrador principal no puede quedar inactivo.",
      "error"
    );

    campoActivo.checked = true;
    actualizarResumenVisual();

    return false;
  }

  return true;
}


/* =========================================================
   GUARDAR CAMBIOS
========================================================= */

async function guardarCambios() {
  ocultarMensaje();

  if (!usuarioActual || !uidSeleccionado) {
    mostrarMensaje(
      "No hay un usuario cargado para actualizar.",
      "error"
    );

    return;
  }

  if (!validarFormulario()) {
    return;
  }

  if (
    !validarCambiosAdministradorPrincipal()
  ) {
    return;
  }

  const nombreCompleto =
    campoNombre.value.trim();

  const rol =
    normalizarRol(campoRol.value);

  const activo =
    Boolean(campoActivo.checked);

  const permisos =
    obtenerPermisosFormulario();

  btnGuardarUsuario.disabled = true;
  btnGuardarUsuario.textContent =
    "Guardando...";

  try {
    const referenciaUsuario =
      doc(
        db,
        "usuarios",
        uidSeleccionado
      );

    await updateDoc(
      referenciaUsuario,
      {
        nombreCompleto,
        rol,
        activo,
        permisos,
        fechaActualizacion:
          serverTimestamp(),
        actualizadoPor:
          administradorActual?.email ||
          ADMIN_EMAIL
      }
    );

    usuarioActual = {
      ...usuarioActual,
      nombreCompleto,
      rol,
      activo,
      permisos
    };

    cargarUsuarioEnPantalla(
      usuarioActual
    );

    mostrarMensaje(
      "Los cambios se guardaron correctamente en Firestore.",
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al guardar cambios.",
      error
    );

    mostrarMensaje(
      `No fue posible guardar los cambios: ${
        error?.code ||
        error?.message ||
        "error desconocido"
      }.`,
      "error"
    );

  } finally {
    btnGuardarUsuario.disabled = false;
    btnGuardarUsuario.textContent =
      "Guardar cambios";
  }
}


/* =========================================================
   RESTABLECIMIENTO DE CONTRASEÑA
========================================================= */

async function enviarRestablecimientoPassword() {
  const email =
    normalizarTexto(
      usuarioActual?.email ||
      campoEmail?.value
    );

  if (!email) {
    mostrarMensaje(
      "Este usuario no tiene un correo electrónico registrado.",
      "error"
    );

    return;
  }

  const confirmado =
    window.confirm(
      `Se enviará un correo de restablecimiento a:\n\n${email}\n\n¿Desea continuar?`
    );

  if (!confirmado) {
    return;
  }

  const textoOriginal =
    btnRestablecerPassword?.textContent ||
    "Enviar correo de restablecimiento";

  if (btnRestablecerPassword) {
    btnRestablecerPassword.disabled = true;
    btnRestablecerPassword.textContent =
      "Enviando correo...";
  }

  ocultarMensaje();

  try {
    auth.languageCode = "es";

    await sendPasswordResetEmail(
      auth,
      email
    );

    mostrarMensaje(
      `El correo de restablecimiento fue enviado a ${email}.`,
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al enviar el restablecimiento.",
      error
    );

    const mensajes = {
      "auth/invalid-email":
        "El correo electrónico no es válido.",

      "auth/user-not-found":
        "No existe una cuenta de Authentication asociada a este correo.",

      "auth/too-many-requests":
        "Se realizaron demasiadas solicitudes. Intente nuevamente más tarde.",

      "auth/network-request-failed":
        "No fue posible conectarse con Firebase. Revise la conexión."
    };

    mostrarMensaje(
      mensajes[error?.code] ||
      error?.message ||
      "No fue posible enviar el correo de restablecimiento.",
      "error"
    );

  } finally {
    if (btnRestablecerPassword) {
      btnRestablecerPassword.disabled = false;
      btnRestablecerPassword.textContent =
        textoOriginal;
    }
  }
}


/* =========================================================
   COPIAR ENLACE DE ACCESO
========================================================= */

async function copiarEnlaceAcceso() {
  const enlace =
    URL_ACCESO_INSTITUCIONAL;

  const textoOriginal =
    btnCopiarEnlaceAcceso?.textContent ||
    "Copiar enlace de acceso";

  if (btnCopiarEnlaceAcceso) {
    btnCopiarEnlaceAcceso.disabled = true;
    btnCopiarEnlaceAcceso.textContent =
      "Copiando...";
  }

  ocultarMensaje();

  try {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(
        enlace
      );

    } else {
      const campoTemporal =
        document.createElement("textarea");

      campoTemporal.value =
        enlace;

      campoTemporal.setAttribute(
        "readonly",
        ""
      );

      campoTemporal.style.position =
        "fixed";

      campoTemporal.style.opacity =
        "0";

      document.body.appendChild(
        campoTemporal
      );

      campoTemporal.select();

      const copiado =
        document.execCommand("copy");

      campoTemporal.remove();

      if (!copiado) {
        throw new Error(
          "No fue posible copiar el enlace."
        );
      }
    }

    mostrarMensaje(
      "El enlace institucional fue copiado correctamente.",
      "success"
    );

    if (btnCopiarEnlaceAcceso) {
      btnCopiarEnlaceAcceso.textContent =
        "Enlace copiado";
    }

    window.setTimeout(() => {
      if (btnCopiarEnlaceAcceso) {
        btnCopiarEnlaceAcceso.textContent =
          textoOriginal;
      }
    }, 1800);

  } catch (error) {
    console.error(
      "FALCO® Usuarios: error al copiar el enlace.",
      error
    );

    mostrarMensaje(
      "No fue posible copiar el enlace. Puede seleccionarlo manualmente.",
      "error"
    );

  } finally {
    if (btnCopiarEnlaceAcceso) {
      btnCopiarEnlaceAcceso.disabled = false;
    }
  }
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


btnSeleccionarRol?.addEventListener(
  "click",
  aplicarPermisosPorRol
);


btnLimpiarPermisos?.addEventListener(
  "click",
  () => {
    limpiarPermisosFormulario();

    mostrarMensaje(
      "Los permisos personalizados fueron desmarcados. Para confirmar, guarde los cambios.",
      "success"
    );
  }
);


btnGuardarUsuario?.addEventListener(
  "click",
  guardarCambios
);


campoNombre?.addEventListener(
  "input",
  actualizarResumenVisual
);


campoRol?.addEventListener(
  "change",
  actualizarResumenVisual
);


campoActivo?.addEventListener(
  "change",
  actualizarResumenVisual
);

btnRestablecerPassword?.addEventListener(
  "click",
  enviarRestablecimientoPassword
);


btnCopiarEnlaceAcceso?.addEventListener(
  "click",
  copiarEnlaceAcceso
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

      await cargarUsuarioSeleccionado();

    } catch (error) {
      console.error(
        "FALCO® Usuarios: error al iniciar la ficha.",
        error
      );

      mostrarMensaje(
        "No fue posible verificar los permisos administrativos.",
        "error"
      );
    }
  }
);