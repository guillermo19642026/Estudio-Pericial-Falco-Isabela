/* =========================================================
   ESCUELA PARA PADRES FALCO®
   LOGIN ADMINISTRATIVO
   Versión 1.0
========================================================= */

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  getIdTokenResult
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  auth,
  db
} from "../shared/firebase/firebase-config.js";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = Object.freeze({

  dashboardUrl:
    "../dashboard/dashboard.html",

  sitioPrincipalUrl:
    "../../index.html",

  coleccionesUsuarios: [
    "usuarios",
    "profesionales",
    "escuela_administradores"
  ],

  rolesPermitidos: [
    "admin",
    "administrador",
    "administracion",
    "profesional",
    "perito"
  ]

});


/* =========================================================
   ELEMENTOS
========================================================= */

const elementos = {

  formulario:
    document.getElementById("formLoginAdmin"),

  correo:
    document.getElementById("correoAdmin"),

  password:
    document.getElementById("passwordAdmin"),

  recordar:
    document.getElementById("recordarSesion"),

  botonIngresar:
    document.getElementById("btnIngresarAdmin"),

  botonTexto:
    document.getElementById("loginButtonText"),

  botonSpinner:
    document.getElementById("loginSpinner"),

  botonMostrarPassword:
    document.getElementById("btnMostrarPassword"),

  passwordToggleText:
    document.getElementById("passwordToggleText"),

  estado:
    document.getElementById("loginEstado"),

  estadoTexto:
    document.getElementById("loginEstadoTexto"),

  correoError:
    document.getElementById("correoAdminError"),

  passwordError:
    document.getElementById("passwordAdminError"),

  loader:
    document.getElementById("loginLoader"),

  loaderTexto:
    document.getElementById("loginLoaderTexto"),

  anio:
    document.getElementById("anioActual")

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const estado = {

  enviando: false,

  comprobandoSesion: true,

  redireccionando: false

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarLoginAdministrativo
);


function iniciarLoginAdministrativo() {

  completarAnio();

  registrarEventos();

  observarSesion();

  console.info(
    "FALCO Login Administrativo™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  elementos.formulario?.addEventListener(
    "submit",
    procesarInicioSesion
  );

  elementos.botonMostrarPassword?.addEventListener(
    "click",
    alternarVisibilidadPassword
  );

  elementos.correo?.addEventListener(
    "input",
    () => limpiarErrorCampo("correo")
  );

  elementos.password?.addEventListener(
    "input",
    () => limpiarErrorCampo("password")
  );

}


/* =========================================================
   OBSERVAR SESIÓN EXISTENTE
========================================================= */

function observarSesion() {

  onAuthStateChanged(
    auth,
    async usuario => {

      if (estado.redireccionando) return;

      if (!estado.comprobandoSesion) return;

      estado.comprobandoSesion = false;

      if (!usuario) {
        ocultarLoader();
        enfocarCorreo();
        return;
      }

      mostrarLoader(
        "Verificando acceso administrativo…"
      );

      try {

        const acceso =
          await verificarAccesoAdministrativo(
            usuario
          );

        if (!acceso.autorizado) {

          await signOut(auth);

          ocultarLoader();

          mostrarEstado(
            "La sesión existente no posee permisos para acceder al Centro Administrativo.",
            "error"
          );

          enfocarCorreo();

          return;
        }

        guardarSesionAdministrativa(
          usuario,
          acceso
        );

        redirigirAlDashboard();

      } catch (error) {

        console.error(
          "No fue posible verificar la sesión:",
          error
        );

        await cerrarSesionSegura();

        ocultarLoader();

        mostrarEstado(
          "No fue posible verificar el acceso administrativo. Ingresá nuevamente.",
          "error"
        );

        enfocarCorreo();

      }

    }
  );

}


/* =========================================================
   PROCESAR LOGIN
========================================================= */

async function procesarInicioSesion(evento) {

  evento.preventDefault();

  if (estado.enviando) return;

  limpiarMensajes();

  const datos = obtenerDatosFormulario();

  const validacion = validarFormulario(datos);

  if (!validacion.valido) {

    mostrarErrores(validacion.errores);

    enfocarPrimerError(validacion.errores);

    return;

  }

  estado.enviando = true;

  cambiarEstadoBoton(true);

  mostrarEstado(
    "Verificando credenciales…",
    "info"
  );

  try {

    const persistencia =
      datos.recordar
        ? browserLocalPersistence
        : browserSessionPersistence;

    await setPersistence(
      auth,
      persistencia
    );

    const credencial =
      await signInWithEmailAndPassword(
        auth,
        datos.correo,
        datos.password
      );

    mostrarEstado(
      "Credenciales válidas. Verificando permisos administrativos…",
      "info"
    );

    const acceso =
      await verificarAccesoAdministrativo(
        credencial.user
      );

    if (!acceso.autorizado) {

      await signOut(auth);

      throw crearErrorAccesoNoAutorizado();

    }

    guardarSesionAdministrativa(
      credencial.user,
      acceso
    );

    mostrarEstado(
      "Acceso autorizado. Ingresando al Centro Administrativo…",
      "success"
    );

    mostrarLoader(
      "Ingresando al Centro Administrativo…"
    );

    redirigirAlDashboard();

  } catch (error) {

    console.error(
      "Error en login administrativo:",
      error
    );

    await cerrarSesionSiCorresponde(error);

    ocultarLoader();

    mostrarEstado(
      obtenerMensajeError(error),
      "error"
    );

    enfocarCampoSegunError(error);

  } finally {

    if (!estado.redireccionando) {

      estado.enviando = false;

      cambiarEstadoBoton(false);

    }

  }

}


/* =========================================================
   VERIFICAR PERMISOS ADMINISTRATIVOS
========================================================= */

async function verificarAccesoAdministrativo(usuario) {

  if (!usuario) {

    return {
      autorizado: false,
      rol: null,
      origen: null
    };

  }

  /*
   * Primera comprobación:
   * Firebase Custom Claims.
   */

  try {

    const token =
      await getIdTokenResult(
        usuario,
        true
      );

    const claims =
      token?.claims || {};

    const rolClaim =
      normalizarRol(
        claims.rol ||
        claims.role ||
        claims.tipoUsuario
      );

    const claimAdministrativo =
      claims.admin === true ||
      claims.administrador === true ||
      claims.escuelaAdmin === true ||
      CONFIG.rolesPermitidos.includes(
        rolClaim
      );

    if (claimAdministrativo) {

      return {
        autorizado: true,
        rol: rolClaim || "admin",
        origen: "custom-claims"
      };

    }

  } catch (error) {

    console.warn(
      "No se pudieron leer Custom Claims:",
      error
    );

  }

  /*
   * Segunda comprobación:
   * documentos de usuario en Firestore.
   */

  for (
    const coleccion of CONFIG.coleccionesUsuarios
  ) {

    try {

      const referencia =
        doc(
          db,
          coleccion,
          usuario.uid
        );

      const snapshot =
        await getDoc(referencia);

      if (!snapshot.exists()) continue;

      const datos =
        snapshot.data() || {};

      const rol =
        normalizarRol(
          datos.rol ||
          datos.role ||
          datos.tipoUsuario ||
          datos.tipo ||
          datos.perfil
        );

      const estadoUsuario =
        normalizarTexto(
          datos.estado
        );

      const accesoDeshabilitado =
        datos.activo === false ||
        datos.habilitado === false ||
        datos.bloqueado === true ||
        [
          "inactivo",
          "suspendido",
          "bloqueado",
          "deshabilitado"
        ].includes(estadoUsuario);

      if (accesoDeshabilitado) {

        return {
          autorizado: false,
          rol,
          origen: coleccion,
          motivo: "deshabilitado"
        };

      }

      const accesoExplicito =
        datos.admin === true ||
        datos.administrador === true ||
        datos.esAdmin === true ||
        datos.escuelaAdmin === true ||
        datos.accesoEscuelaAdmin === true;

      const rolPermitido =
        CONFIG.rolesPermitidos.includes(
          rol
        );

      if (accesoExplicito || rolPermitido) {

        return {
          autorizado: true,
          rol: rol || "admin",
          origen: coleccion,
          datos
        };

      }

    } catch (error) {

      console.warn(
        `No se pudo verificar ${coleccion}:`,
        error
      );

    }

  }

  return {
    autorizado: false,
    rol: null,
    origen: null
  };

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function obtenerDatosFormulario() {

  return {

    correo:
      normalizarCorreo(
        elementos.correo?.value
      ),

    password:
      elementos.password?.value || "",

    recordar:
      Boolean(
        elementos.recordar?.checked
      )

  };

}


function validarFormulario(datos) {

  const errores = {};

  if (!datos.correo) {

    errores.correo =
      "Ingresá el correo electrónico.";

  } else if (!esCorreoValido(datos.correo)) {

    errores.correo =
      "Ingresá un correo electrónico válido.";

  }

  if (!datos.password) {

    errores.password =
      "Ingresá la contraseña.";

  } else if (datos.password.length < 6) {

    errores.password =
      "La contraseña debe contener al menos 6 caracteres.";

  }

  return {

    valido:
      Object.keys(errores).length === 0,

    errores

  };

}


function esCorreoValido(correo) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo
  );

}


function mostrarErrores(errores) {

  if (errores.correo) {

    elementos.correoError.textContent =
      errores.correo;

    obtenerControlCampo(
      elementos.correo
    )?.classList.add("is-error");

    elementos.correo?.setAttribute(
      "aria-invalid",
      "true"
    );

  }

  if (errores.password) {

    elementos.passwordError.textContent =
      errores.password;

    obtenerControlCampo(
      elementos.password
    )?.classList.add("is-error");

    elementos.password?.setAttribute(
      "aria-invalid",
      "true"
    );

  }

}


function limpiarErrorCampo(campo) {

  if (campo === "correo") {

    elementos.correoError.textContent = "";

    obtenerControlCampo(
      elementos.correo
    )?.classList.remove("is-error");

    elementos.correo?.removeAttribute(
      "aria-invalid"
    );

  }

  if (campo === "password") {

    elementos.passwordError.textContent = "";

    obtenerControlCampo(
      elementos.password
    )?.classList.remove("is-error");

    elementos.password?.removeAttribute(
      "aria-invalid"
    );

  }

}


function obtenerControlCampo(input) {

  return input?.closest(
    ".admin-login-field__control"
  );

}


function enfocarPrimerError(errores) {

  if (errores.correo) {

    elementos.correo?.focus();

    return;

  }

  if (errores.password) {

    elementos.password?.focus();

  }

}


/* =========================================================
   CONTRASEÑA
========================================================= */

function alternarVisibilidadPassword() {

  if (!elementos.password) return;

  const mostrando =
    elementos.password.type === "text";

  elementos.password.type =
    mostrando
      ? "password"
      : "text";

  elementos.botonMostrarPassword?.setAttribute(
    "aria-pressed",
    String(!mostrando)
  );

  elementos.botonMostrarPassword?.setAttribute(
    "aria-label",
    mostrando
      ? "Mostrar contraseña"
      : "Ocultar contraseña"
  );

  if (elementos.passwordToggleText) {

    elementos.passwordToggleText.textContent =
      mostrando
        ? "Ver"
        : "Ocultar";

  }

  elementos.password.focus();

}


/* =========================================================
   INTERFAZ
========================================================= */

function mostrarEstado(
  mensaje,
  tipo = "info"
) {

  if (
    !elementos.estado ||
    !elementos.estadoTexto
  ) {
    return;
  }

  elementos.estado.hidden = false;

  elementos.estado.classList.remove(
    "is-error",
    "is-success",
    "is-info"
  );

  elementos.estado.classList.add(
    `is-${tipo}`
  );

  elementos.estadoTexto.textContent =
    mensaje;

}


function ocultarEstado() {

  if (!elementos.estado) return;

  elementos.estado.hidden = true;

  elementos.estado.classList.remove(
    "is-error",
    "is-success",
    "is-info"
  );

  if (elementos.estadoTexto) {

    elementos.estadoTexto.textContent = "";

  }

}


function cambiarEstadoBoton(cargando) {

  if (!elementos.botonIngresar) return;

  elementos.botonIngresar.disabled =
    cargando;

  elementos.botonIngresar.setAttribute(
    "aria-busy",
    String(cargando)
  );

  if (elementos.botonSpinner) {

    elementos.botonSpinner.hidden =
      !cargando;

  }

  if (elementos.botonTexto) {

    elementos.botonTexto.textContent =
      cargando
        ? "Verificando acceso…"
        : "Ingresar al Centro Administrativo";

  }

}


function mostrarLoader(mensaje) {

  if (!elementos.loader) return;

  if (
    mensaje &&
    elementos.loaderTexto
  ) {

    elementos.loaderTexto.textContent =
      mensaje;

  }

  elementos.loader.hidden = false;

  elementos.loader.setAttribute(
    "aria-hidden",
    "false"
  );

}


function ocultarLoader() {

  if (!elementos.loader) return;

  elementos.loader.hidden = true;

  elementos.loader.setAttribute(
    "aria-hidden",
    "true"
  );

}


function limpiarMensajes() {

  ocultarEstado();

  limpiarErrorCampo("correo");

  limpiarErrorCampo("password");

}


function completarAnio() {

  if (!elementos.anio) return;

  elementos.anio.textContent =
    String(
      new Date().getFullYear()
    );

}


/* =========================================================
   SESIÓN ADMINISTRATIVA
========================================================= */

function guardarSesionAdministrativa(
  usuario,
  acceso
) {

  const sesion = {

    uid:
      usuario.uid,

    correo:
      usuario.email || "",

    rol:
      acceso.rol || "admin",

    origen:
      acceso.origen || null,

    verificado:
      true,

    fechaVerificacion:
      new Date().toISOString()

  };

  sessionStorage.setItem(
    "falcoEscuelaAdminSession",
    JSON.stringify(sesion)
  );

}


function redirigirAlDashboard() {

  if (estado.redireccionando) return;

  estado.redireccionando = true;

  window.location.replace(
    CONFIG.dashboardUrl
  );

}


/* =========================================================
   ERRORES FIREBASE
========================================================= */

function obtenerMensajeError(error) {

  const codigo =
    String(
      error?.code || ""
    );

  const mensajes = {

    "auth/invalid-email":
      "El correo electrónico ingresado no es válido.",

    "auth/missing-password":
      "Ingresá la contraseña.",

    "auth/invalid-credential":
      "El correo o la contraseña no son correctos.",

    "auth/user-not-found":
      "El correo o la contraseña no son correctos.",

    "auth/wrong-password":
      "El correo o la contraseña no son correctos.",

    "auth/user-disabled":
      "Este usuario se encuentra deshabilitado.",

    "auth/too-many-requests":
      "El acceso fue bloqueado temporalmente por varios intentos. Intentá nuevamente más tarde.",

    "auth/network-request-failed":
      "No fue posible conectar con el servidor. Revisá la conexión a internet.",

    "auth/operation-not-allowed":
      "El acceso mediante correo y contraseña no se encuentra habilitado.",

    "falco/admin-access-denied":
      "La cuenta ingresada no posee permisos para acceder al Centro Administrativo."

  };

  return (
    mensajes[codigo] ||
    "No fue posible iniciar sesión. Revisá los datos e intentá nuevamente."
  );

}


function crearErrorAccesoNoAutorizado() {

  const error =
    new Error(
      "Acceso administrativo no autorizado."
    );

  error.code =
    "falco/admin-access-denied";

  return error;

}


async function cerrarSesionSiCorresponde(error) {

  const codigo =
    String(
      error?.code || ""
    );

  if (
    codigo === "falco/admin-access-denied"
  ) {

    await cerrarSesionSegura();

  }

}


async function cerrarSesionSegura() {

  try {

    if (auth.currentUser) {

      await signOut(auth);

    }

  } catch (error) {

    console.warn(
      "No fue posible cerrar la sesión:",
      error
    );

  }

  sessionStorage.removeItem(
    "falcoEscuelaAdminSession"
  );

}


function enfocarCampoSegunError(error) {

  const codigo =
    String(
      error?.code || ""
    );

  const erroresCorreo = [
    "auth/invalid-email",
    "auth/user-not-found"
  ];

  if (erroresCorreo.includes(codigo)) {

    elementos.correo?.focus();

    return;

  }

  if (
    codigo === "falco/admin-access-denied"
  ) {

    elementos.correo?.focus();

    return;

  }

  elementos.password?.focus();

}


/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizarCorreo(valor) {

  return String(valor || "")
    .trim()
    .toLowerCase();

}


function normalizarTexto(valor) {

  return String(valor || "")
    .trim()
    .toLowerCase();

}


function normalizarRol(valor) {

  return normalizarTexto(valor)
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    );

}


function enfocarCorreo() {

  window.setTimeout(
    () => elementos.correo?.focus(),
    80
  );

}