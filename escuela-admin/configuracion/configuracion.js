/* =========================================================
   FALCO® CONFIGURACIÓN ADMIN
   Escuela para Padres
   Versión 1.0
========================================================= */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const COLECCION_CONFIGURACION = "escuela_configuracion";
const DOCUMENTO_CONFIGURACION = "general";

const CLAVE_RESPALDO_LOCAL =
  "falco_escuela_configuracion_general";


/* =========================================================
   VALORES INICIALES
========================================================= */

const CONFIGURACION_INICIAL = {

  institucion: {

    nombre:
      "Escuela para Padres FALCO®",

    programa:
      "Aprendiendo a ser Padres de un Adolescente®",

    coordinacion:
      "Lic. Isabela Falco",

    email:
      "estudiopericialpsicologico@gmail.com",

    whatsapp:
      "1132049521",

    anio:
      2026

  },

  curso: {

    totalEncuentros:
      8,

    modalidad:
      "Virtual y asincrónica",

    plazoRespuesta:
      "48 horas hábiles",

    duracionAcceso:
      "sin-vencimiento",

    habilitacionProgresiva:
      true,

    permitirRevision:
      true,

    registrarProgreso:
      true

  },

  certificacion: {

    modeloActivo:
      "modelo-b",

    firma:
      "Lic. Isabela Falco",

    texto:
      "Se certifica que la persona participante ha completado satisfactoriamente el programa psicoeducativo Aprendiendo a ser Padres de un Adolescente®.",

    requiereCursoCompleto:
      true,

    requiereEncuestaFinal:
      true,

    numeracionAutomatica:
      true

  },

  comunicaciones: {

    bienvenida:
      "Te damos la bienvenida a la Escuela para Padres FALCO®. Desde tu Campus podrás acceder a los encuentros, actividades, materiales y recursos del programa.",

    finalizacion:
      "Felicitaciones por haber completado el programa. Ya podés realizar la encuesta final y acceder a tu certificación.",

    soporte:
      "Las consultas serán respondidas dentro de las 48 horas hábiles."

  },

  plataforma: {

    estadoCampus:
      "activo",

    mantenimiento:
      false

  }

};


/* =========================================================
   ESTADO
========================================================= */

const state = {

  db:
    null,

  firebaseDisponible:
    false,

  cargando:
    false,

  guardando:
    false,

  modificado:
    false,

  configuracion:
    null

};


/* =========================================================
   ELEMENTOS
========================================================= */

const elementos = {

  formulario:
    document.getElementById("formConfiguracion"),

  mensaje:
    document.getElementById("configuracionMensaje"),

  estadoContenedor:
    document.querySelector(".configuracion-estado"),

  estadoTexto:
    document.getElementById("estadoGuardado"),

  botonGuardar:
    document.getElementById("btnGuardarConfiguracion"),

  botonRestaurar:
    document.getElementById("btnRestaurar")

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", iniciar);


async function iniciar() {

  console.info(
    "FALCO Configuración Admin™ v1.0 Ready"
  );

  if (!elementos.formulario) {

    console.error(
      "No se encontró el formulario de configuración."
    );

    return;

  }

  registrarEventos();

  establecerEstado(
    "cargando",
    "Cargando configuración…"
  );

  elementos.formulario.classList.add("cargando");

  try {

    await conectarFirebase();

    await cargarConfiguracion();

  } catch (error) {

    console.error(
      "No fue posible iniciar Configuración:",
      error
    );

    cargarDesdeRespaldoLocal();

    mostrarMensaje(
      "No fue posible conectar con Firebase. Se cargó el respaldo disponible en este navegador.",
      "alerta"
    );

  } finally {

    elementos.formulario.classList.remove("cargando");

  }

}


/* =========================================================
   CONEXIÓN FIREBASE
========================================================= */

async function conectarFirebase() {

  const rutasPosibles = [

    "../shared/firebase/firebase-config.js",
    "../shared/firebase/firebase.js",
    "../shared/firebase/config.js",
    "../shared/firebase/firebase-init.js"

  ];

  let ultimoError = null;

  for (const ruta of rutasPosibles) {

    try {

      const modulo = await import(ruta);

      const dbEncontrada =
        modulo.db ||
        modulo.firestore ||
        modulo.default?.db ||
        modulo.default?.firestore ||
        window.db ||
        window.firebaseDB;

      if (dbEncontrada) {

        state.db = dbEncontrada;
        state.firebaseDisponible = true;

        console.info(
          `Configuración conectada a Firebase mediante: ${ruta}`
        );

        return;

      }

    } catch (error) {

      ultimoError = error;

    }

  }

  if (window.db) {

    state.db = window.db;
    state.firebaseDisponible = true;

    console.info(
      "Configuración conectada a Firebase mediante window.db"
    );

    return;

  }

  throw new Error(
    ultimoError?.message ||
    "No se encontró una instancia válida de Firestore."
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  elementos.formulario.addEventListener(
    "submit",
    guardarConfiguracion
  );

  elementos.formulario.addEventListener(
    "input",
    registrarModificacion
  );

  elementos.formulario.addEventListener(
    "change",
    registrarModificacion
  );

  elementos.botonRestaurar?.addEventListener(
    "click",
    restaurarValoresIniciales
  );

  window.addEventListener(
    "beforeunload",
    advertirCambiosSinGuardar
  );

}


/* =========================================================
   CARGAR CONFIGURACIÓN
========================================================= */

async function cargarConfiguracion() {

  state.cargando = true;

  try {

    if (!state.firebaseDisponible || !state.db) {

      cargarDesdeRespaldoLocal();

      return;

    }

    const referencia = doc(
      state.db,
      COLECCION_CONFIGURACION,
      DOCUMENTO_CONFIGURACION
    );

    const resultado = await getDoc(referencia);

    if (resultado.exists()) {

      const datosFirestore = resultado.data();

      state.configuracion = combinarConfiguracion(
        CONFIGURACION_INICIAL,
        datosFirestore
      );

      completarFormulario(state.configuracion);

      guardarRespaldoLocal(state.configuracion);

      establecerEstado(
        "guardado",
        "Todos los cambios guardados"
      );

      console.info(
        "Configuración general cargada desde Firestore."
      );

      return;

    }

    state.configuracion =
      clonarObjeto(CONFIGURACION_INICIAL);

    completarFormulario(state.configuracion);

    await crearConfiguracionInicial();

    establecerEstado(
      "guardado",
      "Configuración inicial creada"
    );

  } catch (error) {

    console.error(
      "Error al cargar configuración:",
      error
    );

    cargarDesdeRespaldoLocal();

    mostrarMensaje(
      "La configuración no pudo cargarse desde Firestore. Se utilizaron los datos guardados en este navegador.",
      "alerta"
    );

  } finally {

    state.cargando = false;

  }

}


/* =========================================================
   CREAR DOCUMENTO INICIAL
========================================================= */

async function crearConfiguracionInicial() {

  if (!state.firebaseDisponible || !state.db) {

    guardarRespaldoLocal(CONFIGURACION_INICIAL);

    return;

  }

  const referencia = doc(
    state.db,
    COLECCION_CONFIGURACION,
    DOCUMENTO_CONFIGURACION
  );

  const datosIniciales = {

    ...clonarObjeto(CONFIGURACION_INICIAL),

    sistema: {

      creadoEn:
        serverTimestamp(),

      actualizadoEn:
        serverTimestamp(),

      version:
        "1.0"

    }

  };

  await setDoc(
    referencia,
    datosIniciales,
    { merge: true }
  );

  guardarRespaldoLocal(CONFIGURACION_INICIAL);

  console.info(
    "Documento escuela_configuracion/general creado."
  );

}


/* =========================================================
   GUARDAR CONFIGURACIÓN
========================================================= */

async function guardarConfiguracion(evento) {

  evento.preventDefault();

  if (state.guardando) {

    return;

  }

  ocultarMensaje();

  if (!elementos.formulario.checkValidity()) {

    elementos.formulario.reportValidity();

    mostrarMensaje(
      "Revisá los campos obligatorios antes de guardar.",
      "error"
    );

    establecerEstado(
      "error",
      "Hay campos pendientes"
    );

    return;

  }

  const configuracion = obtenerConfiguracionFormulario();

  state.guardando = true;

  actualizarBotonGuardado(true);

  establecerEstado(
    "guardando",
    "Guardando cambios…"
  );

  try {

    guardarRespaldoLocal(configuracion);

    if (!state.firebaseDisponible || !state.db) {

      throw new Error(
        "Firestore no está disponible."
      );

    }

    const referencia = doc(
      state.db,
      COLECCION_CONFIGURACION,
      DOCUMENTO_CONFIGURACION
    );

    const datosFirestore = {

      ...configuracion,

      sistema: {

        actualizadoEn:
          serverTimestamp(),

        version:
          "1.0"

      }

    };

    await setDoc(
      referencia,
      datosFirestore,
      { merge: true }
    );

    state.configuracion = configuracion;
    state.modificado = false;

    establecerEstado(
      "guardado",
      "Todos los cambios guardados"
    );

    mostrarMensaje(
      "La configuración general de la Escuela fue guardada correctamente.",
      "exito"
    );

    console.info(
      "Configuración general guardada:",
      configuracion
    );

  } catch (error) {

    console.error(
      "Error al guardar configuración:",
      error
    );

    state.configuracion = configuracion;

    establecerEstado(
      "error",
      "Guardado local únicamente"
    );

    mostrarMensaje(
      "No fue posible guardar en Firestore. Los cambios quedaron respaldados temporalmente en este navegador.",
      "alerta"
    );

  } finally {

    state.guardando = false;

    actualizarBotonGuardado(false);

  }

}


/* =========================================================
   LEER FORMULARIO
========================================================= */

function obtenerConfiguracionFormulario() {

  return {

    institucion: {

      nombre:
        leerTexto("institucionNombre"),

      programa:
        leerTexto("programaNombre"),

      coordinacion:
        leerTexto("coordinacionNombre"),

      email:
        leerTexto("emailContacto"),

      whatsapp:
        leerTexto("whatsappContacto"),

      anio:
        leerNumero("anioVigente", 2026)

    },

    curso: {

      totalEncuentros:
        leerNumero("totalEncuentros", 8),

      modalidad:
        leerTexto("modalidadCurso"),

      plazoRespuesta:
        leerTexto("plazoRespuesta"),

      duracionAcceso:
        leerTexto("duracionAcceso"),

      habilitacionProgresiva:
        leerCheckbox("habilitacionProgresiva"),

      permitirRevision:
        leerCheckbox("permitirRevision"),

      registrarProgreso:
        leerCheckbox("registrarProgreso")

    },

    certificacion: {

      modeloActivo:
        leerTexto("modeloCertificado"),

      firma:
        leerTexto("firmaCertificado"),

      texto:
        leerTexto("textoCertificado"),

      requiereCursoCompleto:
        leerCheckbox("requiereCursoCompleto"),

      requiereEncuestaFinal:
        leerCheckbox("requiereEncuesta"),

      numeracionAutomatica:
        leerCheckbox("numeracionAutomatica")

    },

    comunicaciones: {

      bienvenida:
        leerTexto("mensajeBienvenida"),

      finalizacion:
        leerTexto("mensajeFinalizacion"),

      soporte:
        leerTexto("mensajeSoporte")

    },

    plataforma: {

      estadoCampus:
        state.configuracion?.plataforma?.estadoCampus ||
        "activo",

      mantenimiento:
        state.configuracion?.plataforma?.mantenimiento ||
        false

    }

  };

}


/* =========================================================
   COMPLETAR FORMULARIO
========================================================= */

function completarFormulario(configuracion) {

  const datos = combinarConfiguracion(
    CONFIGURACION_INICIAL,
    configuracion
  );

  asignarValor(
    "institucionNombre",
    datos.institucion.nombre
  );

  asignarValor(
    "programaNombre",
    datos.institucion.programa
  );

  asignarValor(
    "coordinacionNombre",
    datos.institucion.coordinacion
  );

  asignarValor(
    "anioVigente",
    datos.institucion.anio
  );

  asignarValor(
    "emailContacto",
    datos.institucion.email
  );

  asignarValor(
    "whatsappContacto",
    datos.institucion.whatsapp
  );


  asignarValor(
    "totalEncuentros",
    datos.curso.totalEncuentros
  );

  asignarValor(
    "modalidadCurso",
    datos.curso.modalidad
  );

  asignarValor(
    "plazoRespuesta",
    datos.curso.plazoRespuesta
  );

  asignarValor(
    "duracionAcceso",
    datos.curso.duracionAcceso
  );

  asignarCheckbox(
    "habilitacionProgresiva",
    datos.curso.habilitacionProgresiva
  );

  asignarCheckbox(
    "permitirRevision",
    datos.curso.permitirRevision
  );

  asignarCheckbox(
    "registrarProgreso",
    datos.curso.registrarProgreso
  );


  asignarValor(
    "modeloCertificado",
    datos.certificacion.modeloActivo
  );

  asignarValor(
    "firmaCertificado",
    datos.certificacion.firma
  );

  asignarValor(
    "textoCertificado",
    datos.certificacion.texto
  );

  asignarCheckbox(
    "requiereCursoCompleto",
    datos.certificacion.requiereCursoCompleto
  );

  asignarCheckbox(
    "requiereEncuesta",
    datos.certificacion.requiereEncuestaFinal
  );

  asignarCheckbox(
    "numeracionAutomatica",
    datos.certificacion.numeracionAutomatica
  );


  asignarValor(
    "mensajeBienvenida",
    datos.comunicaciones.bienvenida
  );

  asignarValor(
    "mensajeFinalizacion",
    datos.comunicaciones.finalizacion
  );

  asignarValor(
    "mensajeSoporte",
    datos.comunicaciones.soporte
  );

  state.configuracion = datos;
  state.modificado = false;

}


/* =========================================================
   CAMBIOS SIN GUARDAR
========================================================= */

function registrarModificacion() {

  if (
    state.cargando ||
    state.guardando
  ) {

    return;

  }

  state.modificado = true;

  establecerEstado(
    "modificado",
    "Cambios sin guardar"
  );

}


function advertirCambiosSinGuardar(evento) {

  if (!state.modificado) {

    return;

  }

  evento.preventDefault();

  evento.returnValue = "";

}


/* =========================================================
   RESTAURAR VALORES
========================================================= */

function restaurarValoresIniciales() {

  const confirmar = window.confirm(
    "¿Querés restaurar los valores iniciales del formulario? Los cambios no se guardarán hasta que presiones “Guardar configuración”."
  );

  if (!confirmar) {

    return;

  }

  completarFormulario(
    clonarObjeto(CONFIGURACION_INICIAL)
  );

  state.modificado = true;

  establecerEstado(
    "modificado",
    "Valores restaurados sin guardar"
  );

  mostrarMensaje(
    "Se restauraron los valores iniciales. Presioná “Guardar configuración” para confirmar los cambios.",
    "alerta"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   RESPALDO LOCAL
========================================================= */

function guardarRespaldoLocal(configuracion) {

  try {

    localStorage.setItem(
      CLAVE_RESPALDO_LOCAL,
      JSON.stringify(configuracion)
    );

  } catch (error) {

    console.warn(
      "No fue posible crear el respaldo local:",
      error
    );

  }

}


function cargarDesdeRespaldoLocal() {

  try {

    const respaldo = localStorage.getItem(
      CLAVE_RESPALDO_LOCAL
    );

    if (respaldo) {

      const datos = JSON.parse(respaldo);

      state.configuracion = combinarConfiguracion(
        CONFIGURACION_INICIAL,
        datos
      );

      completarFormulario(state.configuracion);

      establecerEstado(
        "guardado",
        "Configuración recuperada"
      );

      return;

    }

  } catch (error) {

    console.warn(
      "El respaldo local no pudo recuperarse:",
      error
    );

  }

  state.configuracion =
    clonarObjeto(CONFIGURACION_INICIAL);

  completarFormulario(state.configuracion);

  establecerEstado(
    "modificado",
    "Configuración inicial sin guardar"
  );

}


/* =========================================================
   ESTADOS VISUALES
========================================================= */

function establecerEstado(tipo, texto) {

  if (!elementos.estadoContenedor) {

    return;

  }

  elementos.estadoContenedor.classList.remove(
    "modificado",
    "guardando",
    "error"
  );

  if (tipo === "modificado") {

    elementos.estadoContenedor.classList.add(
      "modificado"
    );

  }

  if (tipo === "guardando" || tipo === "cargando") {

    elementos.estadoContenedor.classList.add(
      "guardando"
    );

  }

  if (tipo === "error") {

    elementos.estadoContenedor.classList.add(
      "error"
    );

  }

  if (elementos.estadoTexto) {

    elementos.estadoTexto.textContent = texto;

  }

}


function actualizarBotonGuardado(cargando) {

  if (!elementos.botonGuardar) {

    return;

  }

  elementos.botonGuardar.disabled = cargando;

  elementos.botonGuardar.classList.toggle(
    "cargando",
    cargando
  );

  const texto = elementos.botonGuardar.querySelector(
    ".configuracion-btn-texto"
  );

  if (texto) {

    texto.textContent = cargando
      ? "Guardando…"
      : "Guardar configuración";

  }

}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(texto, tipo = "exito") {

  if (!elementos.mensaje) {

    return;

  }

  elementos.mensaje.textContent = texto;

  elementos.mensaje.className =
    `configuracion-mensaje ${tipo}`;

  elementos.mensaje.hidden = false;

}


function ocultarMensaje() {

  if (!elementos.mensaje) {

    return;

  }

  elementos.mensaje.hidden = true;

  elementos.mensaje.textContent = "";

  elementos.mensaje.className =
    "configuracion-mensaje";

}


/* =========================================================
   UTILIDADES DEL FORMULARIO
========================================================= */

function leerTexto(id) {

  const elemento = document.getElementById(id);

  return elemento
    ? String(elemento.value || "").trim()
    : "";

}


function leerNumero(id, valorInicial = 0) {

  const valor = Number(
    document.getElementById(id)?.value
  );

  return Number.isFinite(valor)
    ? valor
    : valorInicial;

}


function leerCheckbox(id) {

  return Boolean(
    document.getElementById(id)?.checked
  );

}


function asignarValor(id, valor) {

  const elemento = document.getElementById(id);

  if (!elemento) {

    return;

  }

  elemento.value =
    valor === undefined ||
    valor === null
      ? ""
      : valor;

}


function asignarCheckbox(id, valor) {

  const elemento = document.getElementById(id);

  if (!elemento) {

    return;

  }

  elemento.checked = Boolean(valor);

}


/* =========================================================
   UTILIDADES DE OBJETOS
========================================================= */

function combinarConfiguracion(base, nueva) {

  return {

    institucion: {

      ...base.institucion,
      ...(nueva?.institucion || {})

    },

    curso: {

      ...base.curso,
      ...(nueva?.curso || {})

    },

    certificacion: {

      ...base.certificacion,
      ...(nueva?.certificacion || {})

    },

    comunicaciones: {

      ...base.comunicaciones,
      ...(nueva?.comunicaciones || {})

    },

    plataforma: {

      ...base.plataforma,
      ...(nueva?.plataforma || {})

    }

  };

}


function clonarObjeto(objeto) {

  return JSON.parse(
    JSON.stringify(objeto)
  );

}


/* =========================================================
   API PARA PRUEBAS EN CONSOLA
========================================================= */

window.FalcoConfiguracionAdmin = {

  getState() {

    return {

      firebaseDisponible:
        state.firebaseDisponible,

      cargando:
        state.cargando,

      guardando:
        state.guardando,

      modificado:
        state.modificado,

      configuracion:
        clonarObjeto(
          state.configuracion ||
          CONFIGURACION_INICIAL
        )

    };

  },


  obtenerConfiguracion() {

    return obtenerConfiguracionFormulario();

  },


  restaurar() {

    restaurarValoresIniciales();

  },


  async guardar() {

    elementos.formulario?.requestSubmit();

  }

};