/* =========================================================
   PORTAL DE CURSOS FALCO®
   Versión 1.0

   Funciones:
   - Verifica la sesión del alumno.
   - Consulta su inscripción al Curso 1.
   - Muestra todos los cursos publicados.
   - Permite ingresar solamente a cursos habilitados.
   - Permite solicitar información sobre otros cursos.
   - No modifica el panel ni el progreso del Curso 1.
========================================================= */


/* =========================================================
   IMPORTACIONES FIREBASE
========================================================= */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const CONFIG = {

  firebaseModule:
    "./escuela-admin/shared/firebase/firebase-config.js",

  loginUrl:
    "escuela-login.html",

  cursoPrincipalId:
    "escuela-para-padres",

  cursoPrincipalDestino:
    "escuela-panel-v2.html",

  whatsapp:
    "5491132049521",

  adminEmail:
    "estudiopericialpsicologico@gmail.com",

  totalEncuentrosCursoPrincipal:
    8

};


/* =========================================================
   CATÁLOGO BASE

   Este catálogo permite que el portal funcione aunque todavía
   no exista la colección escuela_cursos en Firestore.

   Más adelante los cursos publicados desde administración
   reemplazarán automáticamente esta lista.
========================================================= */

const CURSOS_BASE = [

  {
    id: "escuela-para-padres",

    nombre:
      "Escuela para Padres FALCO®",

    categoria:
      "Programa de orientación familiar",

    descripcion:
      "Un recorrido de ocho encuentros para comprender los desafíos familiares, fortalecer los vínculos y acompañar las distintas etapas del desarrollo.",

    modalidad:
      "Virtual y asincrónica",

    totalEncuentros:
      8,

    estado:
      "activo",

    visible:
  true,

publicado:
  true,

destacado:
  true,

permiteInscripcion:
  false,

cupo:
  null,

orden:
  1,

    destino:
      "escuela-panel-v2.html",

    imagen:
      "",

    consulta:
      "Hola, quisiera recibir información sobre la Escuela para Padres FALCO®."

  },

  {
    id: "formacion-pericial",

    nombre:
      "Formación Pericial FALCO®",

    categoria:
      "Formación profesional",

    descripcion:
      "Programa orientado a psicólogos que desean desarrollar conocimientos técnicos y prácticos para intervenir en el ámbito psicológico forense.",

    modalidad:
      "Virtual",

    totalEncuentros:
      0,

    textoEncuentros:
      "Programa en preparación",

    estado:
      "proximamente",

    visible:
  true,

publicado:
  true,

destacado:
  false,

permiteInscripcion:
  true,

cupo:
  null,

orden:
  2,

    destino:
      "",

    imagen:
      "",

    consulta:
      "Hola, quisiera recibir información sobre la Formación Pericial FALCO®."

  },

  {
    id: "informes-psicologicos-judiciales",

    nombre:
      "Informes Psicológicos Judiciales",

    categoria:
      "Taller profesional",

    descripcion:
      "Propuesta de formación sobre estructura, criterios técnicos, redacción y presentación de informes psicológicos destinados al ámbito judicial.",

    modalidad:
      "Virtual",

    totalEncuentros:
      0,

    textoEncuentros:
      "Próxima apertura",

    estado:
      "proximamente",

   visible:
  true,

publicado:
  true,

destacado:
  false,

permiteInscripcion:
  true,

cupo:
  null,

orden:
  3,

    destino:
      "",

    imagen:
      "",

    consulta:
      "Hola, quisiera recibir información sobre el taller de Informes Psicológicos Judiciales."

  }

];


/* =========================================================
   ESTADO INTERNO
========================================================= */

const state = {

  auth:
    null,

  db:
    null,

  user:
    null,

  participanteCursoPrincipal:
    null,

  cursos:
    [],

  cursosInscripto:
    new Set(),

  progresoPorCurso:
    new Map(),

  cursoModal:
    null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const DOM = {

  nombreAlumno:
    document.getElementById("nombreAlumno"),

  avatarAlumno:
    document.getElementById("avatarAlumno"),

  btnCerrarSesion:
    document.getElementById("btnCerrarSesion"),

  cantidadCursosHabilitados:
    document.getElementById("cantidadCursosHabilitados"),

  progresoGeneral:
    document.getElementById("progresoGeneral"),

  barraProgresoGeneral:
    document.getElementById("barraProgresoGeneral"),

  rellenoProgresoGeneral:
    document.getElementById("rellenoProgresoGeneral"),

  estadoPortal:
    document.getElementById("estadoPortal"),

 seccionMisCursos:
  document.getElementById("seccionMisCursos"),

contenedorMisCursos:
  document.getElementById("contenedorMisCursos"),

seccionOtrosCursos:
  document.getElementById("seccionOtrosCursos"),

contenedorOtrosCursos:
  document.getElementById("contenedorOtrosCursos"),

seccionProximamente:
  document.getElementById("seccionProximamente"),

contenedorProximamente:
  document.getElementById("contenedorProximamente"),

  estadoSinCursos:
    document.getElementById("estadoSinCursos"),

  templateCurso:
    document.getElementById("templateCurso"),

  anioActual:
    document.getElementById("anioActual"),

  modalCurso:
    document.getElementById("modalCurso"),

  btnCerrarModal:
    document.getElementById("btnCerrarModal"),

  modalCursoTitulo:
    document.getElementById("modalCursoTitulo"),

  modalCursoDescripcion:
    document.getElementById("modalCursoDescripcion"),

  modalCursoModalidad:
    document.getElementById("modalCursoModalidad"),

  modalCursoEncuentros:
    document.getElementById("modalCursoEncuentros"),

  modalCursoEstado:
    document.getElementById("modalCursoEstado"),

  modalCursoAccion:
    document.getElementById("modalCursoAccion")

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", init);


/**
 * Inicializa el Portal de Cursos.
 */
async function init() {

  console.info(
    "FALCO Portal de Cursos™ v1.0 Ready"
  );

  configurarInterfaz();

  mostrarEstado(
    "cargando",
    "Cargando tus cursos",
    "Estamos verificando las propuestas disponibles."
  );

  try {

    await conectarFirebase();

    observarSesion();

  } catch (error) {

    console.error(
      "No fue posible iniciar el Portal de Cursos:",
      error
    );

    mostrarEstado(
      "error",
      "No pudimos iniciar el portal",
      "Verificá la configuración de Firebase e intentá nuevamente."
    );

  }

}


/* =========================================================
   FIREBASE
========================================================= */

/**
 * Importa la configuración existente del proyecto.
 */
async function conectarFirebase() {

  const firebaseModule =
    await import(CONFIG.firebaseModule);

  state.auth =
    firebaseModule.auth
    || firebaseModule.firebaseAuth
    || firebaseModule.default?.auth
    || null;

  state.db =
    firebaseModule.db
    || firebaseModule.firestore
    || firebaseModule.firebaseDb
    || firebaseModule.default?.db
    || null;

  if (!state.auth) {

    throw new Error(
      "firebase-config.js no exporta una instancia de Authentication."
    );

  }

  if (!state.db) {

    throw new Error(
      "firebase-config.js no exporta una instancia de Firestore."
    );

  }

  console.info(
    "Portal de Cursos conectado a Firebase mediante:",
    CONFIG.firebaseModule
  );

}


/* =========================================================
   SESIÓN
========================================================= */

/**
 * Observa la sesión autenticada.
 */
function observarSesion() {

  onAuthStateChanged(
    state.auth,
    async user => {

      if (!user) {

        window.location.replace(
          CONFIG.loginUrl
        );

        return;

      }

      state.user =
        user;

      actualizarIdentidadAlumno(user);

      await cargarPortal();

    },
    error => {

      console.error(
        "Error al verificar la sesión:",
        error
      );

      mostrarEstado(
        "error",
        "No pudimos verificar tu sesión",
        "Volvé a ingresar al campus para continuar."
      );

    }
  );

}


/**
 * Completa la identidad visible del alumno.
 */
function actualizarIdentidadAlumno(user) {

  const nombre =
    obtenerNombreUsuario(user);

  if (DOM.nombreAlumno) {

    DOM.nombreAlumno.textContent =
      nombre;

  }

  if (DOM.avatarAlumno) {

    DOM.avatarAlumno.textContent =
      obtenerIniciales(nombre);

  }

}


/**
 * Devuelve el nombre visible del usuario.
 */
function obtenerNombreUsuario(user) {

  const displayName =
    limpiarTexto(user?.displayName);

  if (displayName) {

    return displayName;

  }

  const email =
    limpiarTexto(user?.email);

  if (email) {

    const nombreEmail =
      email.split("@")[0]
        .replace(/[._-]+/g, " ")
        .trim();

    return capitalizarTexto(nombreEmail);

  }

  return "Alumno/a";

}


/**
 * Cierra la sesión.
 */
async function cerrarSesion() {

  if (!state.auth) {
    return;
  }

  if (DOM.btnCerrarSesion) {

    DOM.btnCerrarSesion.disabled =
      true;

  }

  try {

    await signOut(state.auth);

    window.location.replace(
      CONFIG.loginUrl
    );

  } catch (error) {

    console.error(
      "No fue posible cerrar la sesión:",
      error
    );

    mostrarEstado(
      "error",
      "No pudimos cerrar la sesión",
      "Actualizá la página e intentá nuevamente."
    );

    if (DOM.btnCerrarSesion) {

      DOM.btnCerrarSesion.disabled =
        false;

    }

  }

}


/* =========================================================
   CARGA GENERAL DEL PORTAL
========================================================= */

/**
 * Carga inscripciones, catálogo y progreso.
 */
async function cargarPortal() {

  mostrarEstado(
    "cargando",
    "Cargando tus cursos",
    "Estamos verificando tus inscripciones y la oferta académica."
  );

  try {

    await cargarInscripcionCursoPrincipal();

    await cargarInscripcionesMulticurso();

    await cargarCursos();

    renderizarCursos();

    actualizarResumenGeneral();

    mostrarEstado(
      "exito",
      "Portal actualizado",
      "Ya podés ingresar a tus cursos o conocer las demás propuestas."
    );

  } catch (error) {

    console.error(
      "Error general al cargar el portal:",
      error
    );

    /*
     * Aunque falle una consulta secundaria, mantenemos visible
     * el catálogo base para no dejar al alumno sin acceso.
     */

    if (!state.cursos.length) {

      state.cursos =
        normalizarCursos(CURSOS_BASE);

    }

    renderizarCursos();

    actualizarResumenGeneral();

    mostrarEstado(
      "error",
      "El portal se cargó parcialmente",
      "Podés continuar con tus cursos. Algunos datos podrían no estar actualizados."
    );

  }

}


/* =========================================================
   CURSO 1 — COMPATIBILIDAD
========================================================= */

/**
 * Consulta el documento existente de escuela_participantes.
 *
 * No modifica el documento.
 * No modifica el Progress Engine.
 * No modifica el panel del Curso 1.
 */
async function cargarInscripcionCursoPrincipal() {

  state.participanteCursoPrincipal =
    null;

  const userId =
    state.user.uid;

  const participanteRef =
    doc(
      state.db,
      "escuela_participantes",
      userId
    );

  try {

    const participanteSnap =
      await getDoc(participanteRef);

    if (participanteSnap.exists()) {

      const participante = {
        id: participanteSnap.id,
        ...participanteSnap.data()
      };

      state.participanteCursoPrincipal =
        participante;

      const accesoHabilitado =
        determinarAccesoCursoPrincipal(participante);

      if (accesoHabilitado) {

        state.cursosInscripto.add(
          CONFIG.cursoPrincipalId
        );

      }

      const progreso =
        calcularProgresoCursoPrincipal(
          participante
        );

      state.progresoPorCurso.set(
        CONFIG.cursoPrincipalId,
        progreso
      );

      console.info(
        "Inscripción del Curso 1 encontrada:",
        participanteSnap.id
      );

      return;

    }

    /*
     * La cuenta administrativa puede probar el portal aunque
     * no exista como participante.
     */

    if (
      normalizarEmail(state.user.email)
      === normalizarEmail(CONFIG.adminEmail)
    ) {

      state.cursosInscripto.add(
        CONFIG.cursoPrincipalId
      );

      state.progresoPorCurso.set(
        CONFIG.cursoPrincipalId,
        0
      );

      console.info(
        "Portal abierto en modo administrador."
      );

      return;

    }

    console.info(
      "El usuario no figura como participante del Curso 1."
    );

  } catch (error) {

    console.warn(
      "No se pudo consultar escuela_participantes:",
      error
    );

    /*
     * Permitimos que la cuenta administradora continúe
     * aunque la lectura del documento falle.
     */

    if (
      normalizarEmail(state.user.email)
      === normalizarEmail(CONFIG.adminEmail)
    ) {

      state.cursosInscripto.add(
        CONFIG.cursoPrincipalId
      );

      state.progresoPorCurso.set(
        CONFIG.cursoPrincipalId,
        0
      );

    }

  }

}


/**
 * Determina si el participante conserva acceso al Curso 1.
 */
function determinarAccesoCursoPrincipal(participante) {

  if (!participante) {
    return false;
  }

  if (participante.eliminado === true) {
    return false;
  }

  if (participante.accesoHabilitado === false) {
    return false;
  }

  if (participante.activo === false) {
    return false;
  }

  const estado =
    limpiarTexto(participante.estado)
      .toLowerCase();

  if (
    estado === "inactivo"
    || estado === "suspendido"
    || estado === "baja"
    || estado === "finalizado"
  ) {

    return false;

  }

  /*
   * Compatibilidad con documentos actuales:
   * si no existe un campo específico de estado,
   * la existencia del participante habilita el acceso.
   */

  return true;

}


/**
 * Calcula el progreso usando completado1...completado8.
 */
function calcularProgresoCursoPrincipal(participante) {

  if (!participante) {
    return 0;
  }

  const total =
    CONFIG.totalEncuentrosCursoPrincipal;

  let completados =
    0;

  for (
    let numero = 1;
    numero <= total;
    numero++
  ) {

    if (
      participante[`completado${numero}`]
      === true
    ) {

      completados++;

    }

  }

  return limitarPorcentaje(
    Math.round(
      (completados / total) * 100
    )
  );

}


/* =========================================================
   INSCRIPCIONES MULTICURSO
========================================================= */

/**
 * Consulta la futura colección escuela_inscripciones.
 *
 * Si todavía no existe o no tiene reglas, el Curso 1 continúa
 * funcionando mediante escuela_participantes.
 */
async function cargarInscripcionesMulticurso() {

  if (!state.user?.uid) {
    return;
  }

  try {

    const inscripcionesRef =
      collection(
        state.db,
        "escuela_inscripciones"
      );

    const consulta =
      query(
        inscripcionesRef,
        where(
          "usuarioId",
          "==",
          state.user.uid
        )
      );

    const snapshot =
      await getDocs(consulta);

    snapshot.forEach(documento => {

      const inscripcion = {
        id: documento.id,
        ...documento.data()
      };

      const cursoId =
        limpiarTexto(inscripcion.cursoId);

      if (!cursoId) {
        return;
      }

      const tieneAcceso =
        inscripcion.accesoHabilitado !== false
        && inscripcion.activo !== false
        && ![
          "inactivo",
          "suspendido",
          "cancelado",
          "baja"
        ].includes(
          limpiarTexto(inscripcion.estado)
            .toLowerCase()
        );

      if (tieneAcceso) {

        state.cursosInscripto.add(
          cursoId
        );

      }

      const progreso =
        obtenerProgresoInscripcion(
          inscripcion
        );

      state.progresoPorCurso.set(
        cursoId,
        progreso
      );

    });

    if (!snapshot.empty) {

      console.info(
        `${snapshot.size} inscripción/es multicurso encontrada/s.`
      );

    }

  } catch (error) {

    /*
     * Es normal en esta etapa porque la colección y sus reglas
     * todavía pueden no existir.
     */

    console.info(
      "La colección escuela_inscripciones aún no está habilitada."
    );

  }

}


/**
 * Obtiene el progreso de una inscripción multicurso.
 */
function obtenerProgresoInscripcion(inscripcion) {

  const porcentajeDirecto =
    Number(
      inscripcion.porcentaje
      ?? inscripcion.progreso
    );

  if (Number.isFinite(porcentajeDirecto)) {

    return limitarPorcentaje(
      Math.round(porcentajeDirecto)
    );

  }

  if (
    Array.isArray(
      inscripcion.encuentrosCompletados
    )
  ) {

    const total =
      Number(inscripcion.totalEncuentros);

    if (
      Number.isFinite(total)
      && total > 0
    ) {

      return limitarPorcentaje(
        Math.round(
          (
            inscripcion.encuentrosCompletados.length
            / total
          ) * 100
        )
      );

    }

  }

  return 0;

}


/* =========================================================
   CATÁLOGO DE CURSOS
========================================================= */

/**
 * Intenta cargar los cursos desde escuela_cursos.
 *
 * Si la colección aún no existe, utiliza CURSOS_BASE.
 */
async function cargarCursos() {

  let cursosFirestore =
    [];

  try {

    const cursosRef =
      collection(
        state.db,
        "escuela_cursos"
      );

    const snapshot =
      await getDocs(cursosRef);

    snapshot.forEach(documento => {

      cursosFirestore.push({
        id: documento.id,
        ...documento.data()
      });

    });

  } catch (error) {

    console.info(
      "La colección escuela_cursos aún no está habilitada. Se utilizará el catálogo base."
    );

  }

  if (cursosFirestore.length) {

    state.cursos =
      normalizarCursos(
        cursosFirestore
      );

    asegurarCursoPrincipal();

    console.info(
      `${state.cursos.length} curso/s cargado/s desde Firestore.`
    );

    return;

  }

  state.cursos =
    normalizarCursos(
      CURSOS_BASE
    );

  console.info(
    "Catálogo base de cursos cargado."
  );

}


/**
 * Garantiza que el Curso 1 siga visible aunque todavía no haya
 * sido creado en escuela_cursos.
 */
function asegurarCursoPrincipal() {

  const existeCursoPrincipal =
    state.cursos.some(
      curso =>
        curso.id
        === CONFIG.cursoPrincipalId
    );

  if (existeCursoPrincipal) {
    return;
  }

  const cursoPrincipal =
    CURSOS_BASE.find(
      curso =>
        curso.id
        === CONFIG.cursoPrincipalId
    );

  if (cursoPrincipal) {

    state.cursos.push(
      normalizarCurso(
        cursoPrincipal
      )
    );

    state.cursos.sort(
      ordenarCursos
    );

  }

}


/**
 * Normaliza y filtra el catálogo.
 */
function normalizarCursos(cursos) {

  return cursos
    .map(normalizarCurso)
    .filter(curso => {

      return (
        curso.visible !== false &&
        curso.publicado !== false
      );

    })
    .sort(ordenarCursos);

}





/**
 * Normaliza un curso.
 */
function normalizarCurso(curso) {

  const id =
    limpiarTexto(
      curso.id
      || curso.slug
      || curso.cursoId
    );

  return {

    id,

    nombre:
      limpiarTexto(curso.nombre)
      || "Curso FALCO®",

    categoria:
      limpiarTexto(curso.categoria)
      || "Programa FALCO®",

    descripcion:
      limpiarTexto(curso.descripcion)
      || "Propuesta de formación del Sistema FALCO®.",

    modalidad:
      limpiarTexto(curso.modalidad)
      || "Modalidad a confirmar",

    totalEncuentros:
      Math.max(
        0,
        Number(curso.totalEncuentros) || 0
      ),

    textoEncuentros:
      limpiarTexto(curso.textoEncuentros),

    estado:
      normalizarEstadoCurso(
        curso.estado
      ),

    visible:
      curso.visible !== false,

    orden:
      Number(curso.orden) || 999,

    destino:
      limpiarTexto(
        curso.destino
        || curso.url
        || curso.enlace
      ),

    imagen:
      limpiarTexto(
        curso.imagen
        || curso.imagenUrl
        || curso.portada
      ),

    consulta:
      limpiarTexto(
        curso.consulta
        || curso.mensajeWhatsApp
      ),

    inscripcionAbierta:
      curso.inscripcionAbierta !== false,

    publicado:
      curso.publicado !== false,

    destacado:
      curso.destacado === true,

    permiteInscripcion:
      curso.permiteInscripcion === true,

    cupo:
      Number.isFinite(Number(curso.cupo))
        ? Number(curso.cupo)
        : null

  };

}

/**
 * Ordena cursos por orden y nombre.
 */
function ordenarCursos(cursoA, cursoB) {

  if (cursoA.orden !== cursoB.orden) {

    return cursoA.orden - cursoB.orden;

  }

  return cursoA.nombre.localeCompare(
    cursoB.nombre,
    "es",
    {
      sensitivity: "base"
    }
  );

}


/* =========================================================
   RENDERIZADO
========================================================= */

/**
 * Renderiza todas las tarjetas.
 */

function renderizarCursos() {

  if (
    !DOM.templateCurso
  ) {

    console.error(
      "No se encontró la plantilla de cursos."
    );

    return;

  }

  DOM.contenedorMisCursos.innerHTML = "";
  DOM.contenedorOtrosCursos.innerHTML = "";
  DOM.contenedorProximamente.innerHTML = "";

  DOM.seccionMisCursos.hidden = true;
  DOM.seccionOtrosCursos.hidden = true;
  DOM.seccionProximamente.hidden = true;

  const cursosVisibles =
    state.cursos.filter(
      curso => curso.visible !== false
    );

  if (!cursosVisibles.length) {

    DOM.estadoSinCursos.hidden = false;

    return;

  }

  DOM.estadoSinCursos.hidden = true;

  cursosVisibles.forEach(curso => {

    const tarjeta =
      crearTarjetaCurso(curso);

    const estaInscripto =
      state.cursosInscripto.has(
        curso.id
      );

    if (estaInscripto) {

      DOM.seccionMisCursos.hidden = false;

      DOM.contenedorMisCursos.appendChild(
        tarjeta
      );

      return;

    }

    if (curso.estado === "proximamente") {

      DOM.seccionProximamente.hidden = false;

      DOM.contenedorProximamente.appendChild(
        tarjeta
      );

      return;

    }

    DOM.seccionOtrosCursos.hidden = false;

    DOM.contenedorOtrosCursos.appendChild(
      tarjeta);

  });

}


/**
 * Crea una tarjeta desde el template HTML.
 */
function crearTarjetaCurso(curso) {

  const fragmento =
    DOM.templateCurso.content
      .cloneNode(true);

  const tarjeta =
    fragmento.querySelector(
      ".portal-course-card"
    );

  const portada =
    fragmento.querySelector(
      ".portal-course-cover"
    );

  const imagen =
    fragmento.querySelector(
      ".portal-course-image"
    );

  const placeholder =
    fragmento.querySelector(
      ".portal-course-placeholder"
    );

  const estado =
    fragmento.querySelector(
      ".portal-course-status"
    );

  const categoria =
    fragmento.querySelector(
      ".portal-course-category"
    );

  const titulo =
    fragmento.querySelector(
      ".portal-course-title"
    );

  const descripcion =
    fragmento.querySelector(
      ".portal-course-description"
    );

  const encuentros =
    fragmento.querySelector(
      ".portal-course-meetings"
    );

  const modalidad =
    fragmento.querySelector(
      ".portal-course-modality"
    );

  const progresoContenedor =
    fragmento.querySelector(
      ".portal-course-progress"
    );

  const progresoValor =
    fragmento.querySelector(
      ".portal-course-progress-value"
    );

  const progresoTrack =
    progresoContenedor?.querySelector(
      ".portal-progress-track"
    );

  const progresoFill =
    progresoContenedor?.querySelector(
      ".portal-progress-fill"
    );

  const accionPrincipal =
    fragmento.querySelector(
      ".portal-course-main-action"
    );

  const botonDetalles =
    fragmento.querySelector(
      ".portal-course-details-button"
    );

  const estaInscripto =
    state.cursosInscripto.has(
      curso.id
    );

  const porcentaje =
    state.progresoPorCurso.get(
      curso.id
    ) || 0;

  tarjeta.dataset.cursoId =
    curso.id;

  configurarClaseTarjeta(
    tarjeta,
    curso,
    estaInscripto
  );

  categoria.textContent =
    curso.categoria;

  titulo.textContent =
    curso.nombre;

  descripcion.textContent =
    curso.descripcion;

  modalidad.textContent =
    curso.modalidad;

  encuentros.textContent =
    obtenerTextoEncuentros(curso);

  configurarPortadaCurso(
    curso,
    portada,
    imagen,
    placeholder
  );

  configurarEstadoCurso(
    curso,
    estaInscripto,
    estado
  );

  configurarProgresoCurso(
    estaInscripto,
    porcentaje,
    progresoContenedor,
    progresoValor,
    progresoTrack,
    progresoFill
  );

  configurarAccionPrincipal(
    curso,
    estaInscripto,
    accionPrincipal
  );

  botonDetalles.addEventListener(
    "click",
    () => abrirModalCurso(curso)
  );

  return fragmento;

}


/**
 * Aplica la clase visual correspondiente.
 */
function configurarClaseTarjeta(
  tarjeta,
  curso,
  estaInscripto
) {

  if (estaInscripto) {

    tarjeta.classList.add(
      "is-enrolled"
    );

    return;

  }

  if (
    curso.estado
    === "proximamente"
  ) {

    tarjeta.classList.add(
      "is-coming-soon"
    );

    return;

  }

  tarjeta.classList.add(
    "is-available"
  );

}


/**
 * Configura imagen o portada institucional.
 */
function configurarPortadaCurso(
  curso,
  portada,
  imagen,
  placeholder
) {

  if (!curso.imagen) {

    imagen.hidden =
      true;

    placeholder.hidden =
      false;

    const inicial =
      obtenerIniciales(curso.nombre)
        .charAt(0)
        || "F";

    const placeholderTexto =
      placeholder.querySelector("span");

    if (placeholderTexto) {

      placeholderTexto.textContent =
        inicial;

    }

    return;

  }

  imagen.hidden =
    false;

  placeholder.hidden =
    true;

  imagen.src =
    curso.imagen;

  imagen.alt =
    `Portada de ${curso.nombre}`;

  imagen.addEventListener(
    "error",
    () => {

      imagen.hidden =
        true;

      placeholder.hidden =
        false;

    },
    {
      once: true
    }
  );

}


/**
 * Configura el badge de estado.
 */
function configurarEstadoCurso(
  curso,
  estaInscripto,
  elemento
) {

  if (estaInscripto) {

    elemento.textContent =
      "Inscripto";

    return;

  }

  if (
    curso.estado
    === "proximamente"
  ) {

    elemento.textContent =
      "Próximamente";

    return;

  }

  if (
    curso.estado
    === "cerrado"
  ) {

    elemento.textContent =
      "Inscripción cerrada";

    return;

  }

  elemento.textContent =
    "Disponible";

}


/**
 * Configura el progreso del curso habilitado.
 */
function configurarProgresoCurso(
  estaInscripto,
  porcentaje,
  contenedor,
  valor,
  track,
  fill
) {

  if (!estaInscripto) {

    contenedor.hidden =
      true;

    return;

  }

  contenedor.hidden =
    false;

  valor.textContent =
    `${porcentaje}%`;

  track.setAttribute(
    "aria-valuenow",
    String(porcentaje)
  );

  fill.style.width =
    `${porcentaje}%`;

}


/**
 * Configura la acción principal de la tarjeta.
 */
function configurarAccionPrincipal(
  curso,
  estaInscripto,
  elemento
) {

  /*
   * Curso habilitado.
   */

  if (estaInscripto) {

    elemento.textContent =
      curso.id === CONFIG.cursoPrincipalId
        ? "Continuar curso"
        : "Ingresar al curso";

    elemento.href =
      obtenerDestinoCurso(curso);

    elemento.target =
      "_self";

    elemento.removeAttribute(
      "rel"
    );

    return;

  }

  /*
   * Curso sin inscripción.
   */

  elemento.textContent =
    curso.estado === "proximamente"
      ? "Quiero recibir novedades"
      : "Solicitar información";

  elemento.href =
    crearEnlaceWhatsApp(curso);

  elemento.target =
    "_blank";

  elemento.rel =
    "noopener noreferrer";

}


/* =========================================================
   RESUMEN GENERAL
========================================================= */

/**
 * Actualiza cantidad de cursos y progreso general.
 */
function actualizarResumenGeneral() {

  const cursosHabilitados =
    state.cursos.filter(
      curso =>
        state.cursosInscripto.has(
          curso.id
        )
    );

  const cantidad =
    cursosHabilitados.length;

 if (DOM.cantidadCursosHabilitados) {

  if (cantidad === 0) {

    DOM.cantidadCursosHabilitados.textContent =
      "Sin cursos asignados";

  } else if (cantidad === 1) {

    DOM.cantidadCursosHabilitados.textContent =
      "1 curso disponible";

  } else {

    DOM.cantidadCursosHabilitados.textContent =
      `${cantidad} cursos disponibles`;

  }

}


  let progresoGeneral =
    0;

  if (cantidad > 0) {

    const suma =
      cursosHabilitados.reduce(
        (acumulado, curso) => {

          return acumulado
            + (
              state.progresoPorCurso.get(
                curso.id
              ) || 0
            );

        },
        0
      );

    progresoGeneral =
      limitarPorcentaje(
        Math.round(
          suma / cantidad
        )
      );

  }

  if (DOM.progresoGeneral) {

    DOM.progresoGeneral.textContent =
      `${progresoGeneral}%`;

  }

  if (DOM.barraProgresoGeneral) {

    DOM.barraProgresoGeneral.setAttribute(
      "aria-valuenow",
      String(progresoGeneral)
    );

  }

  if (DOM.rellenoProgresoGeneral) {

    DOM.rellenoProgresoGeneral.style.width =
      `${progresoGeneral}%`;

  }

}


/* =========================================================
   MODAL
========================================================= */

/**
 * Abre la información ampliada de un curso.
 */
function abrirModalCurso(curso) {

  if (!DOM.modalCurso) {
    return;
  }

  state.cursoModal =
    curso;

  const estaInscripto =
    state.cursosInscripto.has(
      curso.id
    );

  DOM.modalCursoTitulo.textContent =
    curso.nombre;

  DOM.modalCursoDescripcion.textContent =
    curso.descripcion;

  DOM.modalCursoModalidad.textContent =
    curso.modalidad;

  DOM.modalCursoEncuentros.textContent =
    obtenerTextoEncuentros(curso);

  DOM.modalCursoEstado.textContent =
    obtenerEtiquetaEstado(
      curso,
      estaInscripto
    );

  if (estaInscripto) {

    DOM.modalCursoAccion.textContent =
      curso.id === CONFIG.cursoPrincipalId
        ? "Continuar curso"
        : "Ingresar al curso";

    DOM.modalCursoAccion.href =
      obtenerDestinoCurso(curso);

    DOM.modalCursoAccion.target =
      "_self";

    DOM.modalCursoAccion.removeAttribute(
      "rel"
    );

  } else {

    DOM.modalCursoAccion.textContent =
      curso.estado === "proximamente"
        ? "Quiero recibir novedades"
        : "Solicitar información";

    DOM.modalCursoAccion.href =
      crearEnlaceWhatsApp(curso);

    DOM.modalCursoAccion.target =
      "_blank";

    DOM.modalCursoAccion.rel =
      "noopener noreferrer";

  }

  DOM.modalCurso.hidden =
    false;

  document.body.style.overflow =
    "hidden";

  window.setTimeout(
    () => {

      DOM.btnCerrarModal?.focus();

    },
    40
  );

}


/**
 * Cierra el modal.
 */
function cerrarModalCurso() {

  if (!DOM.modalCurso) {
    return;
  }

  DOM.modalCurso.hidden =
    true;

  document.body.style.overflow =
    "";

  state.cursoModal =
    null;

}


/* =========================================================
   MENSAJES DE ESTADO
========================================================= */

/**
 * Actualiza el mensaje superior.
 */
function mostrarEstado(
  tipo,
  titulo,
  mensaje
) {

  if (!DOM.estadoPortal) {
    return;
  }

  const icono =
    DOM.estadoPortal.querySelector(
      ".portal-status-icon"
    );

  const tituloElemento =
    DOM.estadoPortal.querySelector(
      "strong"
    );

  const mensajeElemento =
    DOM.estadoPortal.querySelector(
      "p"
    );

  DOM.estadoPortal.hidden =
    false;

  DOM.estadoPortal.classList.remove(
    "is-success",
    "is-error"
  );

  if (tipo === "exito") {

    DOM.estadoPortal.classList.add(
      "is-success"
    );

    if (icono) {

      icono.textContent =
        "✓";

    }

  } else if (tipo === "error") {

    DOM.estadoPortal.classList.add(
      "is-error"
    );

    if (icono) {

      icono.textContent =
        "!";

    }

  } else if (icono) {

    icono.textContent =
      "◌";

  }

  if (tituloElemento) {

    tituloElemento.textContent =
      titulo;

  }

  if (mensajeElemento) {

    mensajeElemento.textContent =
      mensaje;

  }

}


/* =========================================================
   EVENTOS
========================================================= */

/**
 * Configura los eventos generales.
 */
function configurarInterfaz() {

  if (DOM.anioActual) {

    DOM.anioActual.textContent =
      new Date().getFullYear();

  }

  DOM.btnCerrarSesion?.addEventListener(
    "click",
    cerrarSesion
  );

  DOM.btnCerrarModal?.addEventListener(
    "click",
    cerrarModalCurso
  );

  DOM.modalCurso
    ?.querySelectorAll("[data-modal-close]")
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        cerrarModalCurso
      );

    });

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
        && DOM.modalCurso
        && !DOM.modalCurso.hidden
      ) {

        cerrarModalCurso();

      }

    }
  );

}


/* =========================================================
   UTILIDADES DE CURSOS
========================================================= */

/**
 * Devuelve el destino interno de un curso habilitado.
 */
function obtenerDestinoCurso(curso) {

  if (
    curso.id
    === CONFIG.cursoPrincipalId
  ) {

    return CONFIG.cursoPrincipalDestino;

  }

  return curso.destino || "#";

}


/**
 * Devuelve el texto correspondiente a los encuentros.
 */
function obtenerTextoEncuentros(curso) {

  if (curso.textoEncuentros) {

    return curso.textoEncuentros;

  }

  if (curso.totalEncuentros === 1) {

    return "1 encuentro";

  }

  if (curso.totalEncuentros > 1) {

    return `${curso.totalEncuentros} encuentros`;

  }

  return "Información disponible";

}


/**
 * Devuelve la etiqueta completa del estado.
 */
function obtenerEtiquetaEstado(
  curso,
  estaInscripto
) {

  if (estaInscripto) {

    return "Inscripción activa";

  }

  if (
    curso.estado
    === "proximamente"
  ) {

    return "Próxima apertura";

  }

  if (
    curso.estado
    === "cerrado"
  ) {

    return "Inscripción cerrada";

  }

  return "Inscripción disponible";

}


/**
 * Construye el enlace de consulta por WhatsApp.
 */
function crearEnlaceWhatsApp(curso) {

  const mensaje =
    curso.consulta
    || `Hola, quisiera recibir información sobre el curso ${curso.nombre}.`;

  return (
    `https://wa.me/${CONFIG.whatsapp}`
    + `?text=${encodeURIComponent(mensaje)}`
  );

}


/**
 * Normaliza los posibles estados del curso.
 */
function normalizarEstadoCurso(estado) {

  const valor =
    limpiarTexto(estado)
      .toLowerCase();

  if (
    [
      "proximamente",
      "próximamente",
      "proxima apertura",
      "próxima apertura"
    ].includes(valor)
  ) {

    return "proximamente";

  }

  if (
    [
      "cerrado",
      "inactivo",
      "finalizado",
      "inscripcion cerrada",
      "inscripción cerrada"
    ].includes(valor)
  ) {

    return "cerrado";

  }

  return "activo";

}


/* =========================================================
   UTILIDADES GENERALES
========================================================= */

function limpiarTexto(valor) {

  return String(
    valor ?? ""
  ).trim();

}


function normalizarEmail(email) {

  return limpiarTexto(email)
    .toLowerCase();

}


function capitalizarTexto(texto) {

  return limpiarTexto(texto)
    .split(/\s+/)
    .filter(Boolean)
    .map(palabra => {

      return palabra.charAt(0).toUpperCase()
        + palabra.slice(1).toLowerCase();

    })
    .join(" ");

}


function obtenerIniciales(nombre) {

  const palabras =
    limpiarTexto(nombre)
      .split(/\s+/)
      .filter(Boolean);

  if (!palabras.length) {

    return "A";

  }

  if (palabras.length === 1) {

    return palabras[0]
      .charAt(0)
      .toUpperCase();

  }

  return (
    palabras[0].charAt(0)
    + palabras[palabras.length - 1].charAt(0)
  ).toUpperCase();

}


function limitarPorcentaje(valor) {

  const numero =
    Number(valor);

  if (!Number.isFinite(numero)) {

    return 0;

  }

  return Math.min(
    100,
    Math.max(
      0,
      numero
    )
  );

}


/* =========================================================
   API PÚBLICA PARA PRUEBAS
========================================================= */

window.FalcoPortalCursos = {

  getState() {

    return {

      usuarioId:
        state.user?.uid || null,

      email:
        state.user?.email || null,

      cursos:
        state.cursos.map(
          curso => ({
            ...curso
          })
        ),

      cursosInscripto:
        Array.from(
          state.cursosInscripto
        ),

      progresoPorCurso:
        Object.fromEntries(
          state.progresoPorCurso
        ),

      participanteCursoPrincipal:
        state.participanteCursoPrincipal
          ? {
              ...state.participanteCursoPrincipal
            }
          : null

    };

  },

  recargar() {

    return cargarPortal();

  },

  abrirCurso(cursoId) {

    const curso =
      state.cursos.find(
        item =>
          item.id === cursoId
      );

    if (!curso) {

      console.warn(
        "Curso no encontrado:",
        cursoId
      );

      return false;

    }

    abrirModalCurso(curso);

    return true;

  }

};