
import { crear } from "../shared/firebase/participantes.js";


/* =========================================================
   SISTEMA FALCO®
   ESCUELA PARA PADRES
   ALTA DE PARTICIPANTES

   Archivo:
   escuela-admin/alta/alta-participante.js

   Versión:
   Alta Participante Admin™ v1.0

   ETAPA ACTUAL:
   - Validación del formulario
   - Contraseña temporal
   - Resumen dinámico
   - Borrador local
   - Protección de salida
   - Estados visuales

   FIREBASE:
   Se integrará en el siguiente sprint.
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */


const CONFIG = {

  listadoUrl:
    "../participantes/participantes.html",

  fichaUrl:
    "../ficha/participante.html",

  claveBorrador:
    "falco_escuela_alta_participante_borrador",

  longitudClaveTemporal:
    10,

  estadoInicial:
    "activo",

  encuentroInicial:
    1

};


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

const state = {

  inicializado:
    false,

  cambiosSinGuardar:
    false,

  guardando:
    false,

  borradorRestaurado:
    false,

  salidaConfirmada:
    false,

  accionSalida:
    null

};


/* =========================================================
   UTILIDAD PARA ENCONTRAR ELEMENTOS

   Permite que el módulo funcione aunque algún identificador
   tenga una pequeña diferencia en el HTML.
========================================================= */

function encontrarElemento(...selectores) {

  for (const selector of selectores) {

    const elemento =
      document.querySelector(selector);

    if (elemento) {
      return elemento;
    }

  }

  return null;

}


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const dom = {

  formulario:
    encontrarElemento(
      "#formAltaParticipante",
      "#altaParticipanteForm",
      "form[data-alta-participante]",
      ".alta-formulario"
    ),


  /* Datos personales */

  nombre:
    encontrarElemento(
      "#nombre",
      "#participanteNombre",
      "[name='nombre']"
    ),

  apellido:
    encontrarElemento(
      "#apellido",
      "#participanteApellido",
      "[name='apellido']"
    ),

  dni:
    encontrarElemento(
      "#dni",
      "#participanteDni",
      "[name='dni']"
    ),

  fechaNacimiento:
    encontrarElemento(
      "#fechaNacimiento",
      "#participanteFechaNacimiento",
      "[name='fechaNacimiento']"
    ),

  correo:
    encontrarElemento(
      "#correo",
      "#email",
      "#participanteCorreo",
      "[name='correo']",
      "[name='email']"
    ),

  telefono:
    encontrarElemento(
      "#telefono",
      "#participanteTelefono",
      "[name='telefono']"
    ),


  /* Programa */

  programa:
    encontrarElemento(
      "#programa",
      "#programaAsignado",
      "[name='programa']"
    ),

  cohorte:
    encontrarElemento(
      "#cohorte",
      "#grupo",
      "[name='cohorte']",
      "[name='grupo']"
    ),

  fechaInicio:
    encontrarElemento(
      "#fechaInicio",
      "#participanteFechaInicio",
      "[name='fechaInicio']"
    ),

  encuentroInicial:
    encontrarElemento(
      "#encuentroInicial",
      "#encuentroAsignado",
      "[name='encuentroInicial']"
    ),

  estado:
    encontrarElemento(
      "#estado",
      "#estadoParticipante",
      "[name='estado']"
    ),


  /* Acceso */

  usuario:
    encontrarElemento(
      "#usuario",
      "#correoAcceso",
      "#usuarioAcceso",
      "[name='usuario']",
      "[name='correoAcceso']"
    ),

  claveTemporal:
    encontrarElemento(
      "#claveTemporal",
      "#passwordTemporal",
      "#contrasenaTemporal",
      "[name='claveTemporal']"
    ),

  btnGenerarClave:
    encontrarElemento(
      "#btnGenerarClave",
      "#generarClaveTemporal",
      "[data-generar-clave]"
    ),


  /* Configuración */

  enviarBienvenida:
    encontrarElemento(
      "#enviarBienvenida",
      "[name='enviarBienvenida']"
    ),

  activarAcceso:
    encontrarElemento(
      "#activarAcceso",
      "[name='activarAcceso']"
    ),

  asignarEncuentro:
    encontrarElemento(
      "#asignarEncuentro",
      "[name='asignarEncuentro']"
    ),

  observaciones:
    encontrarElemento(
      "#observaciones",
      "#notas",
      "[name='observaciones']"
    ),


  /* Resumen */

  resumenNombre:
    encontrarElemento(
      "#resumenNombre",
      "[data-resumen='nombre']"
    ),

  resumenCorreo:
    encontrarElemento(
      "#resumenCorreo",
      "[data-resumen='correo']"
    ),

  resumenPrograma:
    encontrarElemento(
      "#resumenPrograma",
      "[data-resumen='programa']"
    ),

  resumenEstado:
    encontrarElemento(
      "#resumenEstado",
      "[data-resumen='estado']"
    ),


  /* Botones */

  btnGuardarBorrador:
    encontrarElemento(
      "#btnGuardarBorrador",
      "[data-accion='guardar-borrador']"
    ),

  btnGuardar:
    encontrarElemento(
      "#btnGuardarParticipante",
      "#btnGuardar",
      "[data-accion='guardar-participante']"
    ),

  btnCancelar:
    encontrarElemento(
      "#btnCancelar",
      "[data-accion='cancelar']"
    ),

  btnVolver:
    encontrarElemento(
      ".alta-acciones-superiores a",
      "[data-accion='volver']"
    ),


  /* Estados */

  estadoFormulario:
    encontrarElemento(
      "#estadoFormulario",
      "#contenidoFormulario",
      ".alta-formulario"
    ),

  estadoCarga:
    encontrarElemento(
      "#estadoCarga",
      "#altaEstadoCarga",
      ".alta-mensaje-carga"
    ),

  estadoExito:
    encontrarElemento(
      "#estadoExito",
      "#altaEstadoExito",
      ".alta-mensaje-exito"
    ),

  estadoError:
    encontrarElemento(
      "#estadoError",
      "#altaEstadoError",
      ".alta-mensaje-error"
    ),

  mensajeError:
    encontrarElemento(
      "#mensajeError",
      "#altaMensajeError",
      ".alta-mensaje-error p"
    ),

  mensajeExito:
    encontrarElemento(
      "#mensajeExito",
      "#altaMensajeExito",
      ".alta-mensaje-exito p"
    ),

  btnNuevoParticipante:
  encontrarElemento(
    "#btnRegistrarOtro",
    "#btnNuevoParticipante",
    "[data-accion='nuevo-participante']"
  ),

  btnVerParticipantes:
    encontrarElemento(
      "#btnVerParticipantes",
      "[data-accion='ver-participantes']"
    ),


  /* Modal */

  modalSalida:
    encontrarElemento(
      "#modalSalida",
      "#modalConfirmacionSalida",
      ".alta-modal"
    ),

  btnPermanecer:
    encontrarElemento(
      "#btnPermanecer",
      "#btnCancelarSalida",
      "[data-modal-accion='permanecer']"
    ),

  btnSalir:
    encontrarElemento(
      "#btnSalir",
      "#btnConfirmarSalida",
      "[data-modal-accion='salir']"
    )

};


/* =========================================================
   CAMPOS ADMINISTRADOS
========================================================= */

function obtenerCampos() {

  return [

    dom.nombre,
    dom.apellido,
    dom.dni,
    dom.fechaNacimiento,
    dom.correo,
    dom.telefono,
    dom.programa,
    dom.cohorte,
    dom.fechaInicio,
    dom.encuentroInicial,
    dom.estado,
    dom.usuario,
    dom.claveTemporal,
    dom.enviarBienvenida,
    dom.activarAcceso,
    dom.asignarEncuentro,
    dom.observaciones

  ].filter(Boolean);

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function init() {

  if (state.inicializado) {
    return;
  }

  state.inicializado = true;

  configurarValoresIniciales();

  registrarEventos();

  restaurarBorrador();

  sincronizarUsuarioConCorreo();

  actualizarResumen();

  ocultarMensajes();

  console.log(
    "FALCO Alta Participante Admin™ v1.0 Ready"
  );

}


/* =========================================================
   VALORES INICIALES
========================================================= */

function configurarValoresIniciales() {

  if (
    dom.estado &&
    !dom.estado.value
  ) {

    dom.estado.value =
      CONFIG.estadoInicial;

  }


  if (
    dom.encuentroInicial &&
    !dom.encuentroInicial.value
  ) {

    dom.encuentroInicial.value =
      String(CONFIG.encuentroInicial);

  }


  if (
    dom.fechaInicio &&
    !dom.fechaInicio.value
  ) {

    dom.fechaInicio.value =
      obtenerFechaActual();

  }


  if (
    dom.activarAcceso &&
    dom.activarAcceso.type === "checkbox"
  ) {

    dom.activarAcceso.checked = true;

  }


  if (
    dom.asignarEncuentro &&
    dom.asignarEncuentro.type === "checkbox"
  ) {

    dom.asignarEncuentro.checked = true;

  }

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  obtenerCampos().forEach(campo => {

    campo.addEventListener(
      "input",
      manejarCambioFormulario
    );

    campo.addEventListener(
      "change",
      manejarCambioFormulario
    );

    campo.addEventListener(
      "blur",
      () => validarCampo(campo)
    );

  });


  dom.correo?.addEventListener(
    "input",
    sincronizarUsuarioConCorreo
  );


  dom.btnGenerarClave?.addEventListener(
    "click",
    generarYAsignarClave
  );


  dom.formulario?.addEventListener(
    "submit",
    manejarEnvioFormulario
  );


  dom.btnGuardar?.addEventListener(
    "click",
    manejarClickGuardar
  );


  dom.btnGuardarBorrador?.addEventListener(
    "click",
    guardarBorrador
  );


  dom.btnCancelar?.addEventListener(
    "click",
    solicitarSalida
  );


  dom.btnVolver?.addEventListener(
    "click",
    manejarClickVolver
  );


  dom.btnPermanecer?.addEventListener(
    "click",
    cerrarModalSalida
  );


  dom.btnSalir?.addEventListener(
    "click",
    confirmarSalida
  );


  dom.modalSalida
    ?.querySelectorAll("[data-modal-cerrar]")
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        cerrarModalSalida
      );

    });


  dom.btnNuevoParticipante?.addEventListener(
    "click",
    reiniciarFormulario
  );


  dom.btnVerParticipantes?.addEventListener(
    "click",
    () => {

      state.salidaConfirmada = true;

      window.location.href =
        CONFIG.listadoUrl;

    }
  );


  document.addEventListener(
    "keydown",
    manejarTeclado
  );


  window.addEventListener(
    "beforeunload",
    protegerSalidaNavegador
  );

}


/* =========================================================
   CAMBIOS DEL FORMULARIO
========================================================= */

function manejarCambioFormulario(event) {

  state.cambiosSinGuardar = true;

  const campo =
    event?.target;

  if (campo) {

    limpiarErrorCampo(campo);

  }

  actualizarResumen();

}


/* =========================================================
   SINCRONIZAR USUARIO Y CORREO
========================================================= */

function sincronizarUsuarioConCorreo() {

  if (
    !dom.correo ||
    !dom.usuario
  ) {
    return;
  }


  const usuarioFueEditado =
    dom.usuario.dataset.editadoManualmente === "true";


  if (!usuarioFueEditado) {

    dom.usuario.value =
      limpiarTexto(dom.correo.value)
        .toLowerCase();

  }

}


/* =========================================================
   CONTRASEÑA TEMPORAL
========================================================= */

function generarYAsignarClave(event) {

  event?.preventDefault();

  const clave =
    generarClaveTemporal(
      CONFIG.longitudClaveTemporal
    );


  if (dom.claveTemporal) {

    dom.claveTemporal.value =
      clave;

    dom.claveTemporal.type =
      "text";

    dom.claveTemporal.dispatchEvent(
      new Event(
        "input",
        {
          bubbles: true
        }
      )
    );

    dom.claveTemporal.focus();

  }

}


function generarClaveTemporal(longitud = 10) {

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


  const caracteres = [

    obtenerCaracterAleatorio(mayusculas),

    obtenerCaracterAleatorio(minusculas),

    obtenerCaracterAleatorio(numeros),

    obtenerCaracterAleatorio(simbolos)

  ];


  while (
    caracteres.length < longitud
  ) {

    caracteres.push(
      obtenerCaracterAleatorio(todos)
    );

  }


  return mezclarArray(caracteres)
    .join("");

}


function obtenerCaracterAleatorio(conjunto) {

  const indice =
    Math.floor(
      Math.random() *
      conjunto.length
    );

  return conjunto.charAt(indice);

}


function mezclarArray(array) {

  const copia =
    [...array];

  for (
    let indice = copia.length - 1;
    indice > 0;
    indice--
  ) {

    const aleatorio =
      Math.floor(
        Math.random() *
        (indice + 1)
      );

    [
      copia[indice],
      copia[aleatorio]
    ] = [
      copia[aleatorio],
      copia[indice]
    ];

  }

  return copia;

}


/* =========================================================
   VALIDACIÓN GENERAL
========================================================= */

function validarFormulario() {

  const camposObligatorios = [

    dom.nombre,
    dom.apellido,
    dom.dni,
    dom.correo,
    dom.programa,
    dom.fechaInicio,
    dom.estado,
    dom.claveTemporal

  ].filter(Boolean);


  let formularioValido =
    true;

  let primerCampoInvalido =
    null;


  camposObligatorios.forEach(campo => {

    const valido =
      validarCampo(campo, true);

    if (!valido) {

      formularioValido = false;

      if (!primerCampoInvalido) {

        primerCampoInvalido =
          campo;

      }

    }

  });


  if (
    dom.telefono &&
    limpiarTexto(dom.telefono.value)
  ) {

    if (!validarCampo(dom.telefono, true)) {

      formularioValido = false;

      primerCampoInvalido ||=
        dom.telefono;

    }

  }


  if (
    !formularioValido &&
    primerCampoInvalido
  ) {

    primerCampoInvalido.focus();

    primerCampoInvalido.scrollIntoView({

      behavior:
        "smooth",

      block:
        "center"

    });

  }


  return formularioValido;

}


/* =========================================================
   VALIDACIÓN INDIVIDUAL
========================================================= */

function validarCampo(
  campo,
  forzarObligatorio = false
) {

  if (!campo) {
    return true;
  }


  if (
    campo.type === "checkbox"
  ) {

    limpiarErrorCampo(campo);

    return true;

  }


  const valor =
    limpiarTexto(campo.value);

  const obligatorio =
    forzarObligatorio ||
    campo.required;


  if (
    obligatorio &&
    !valor
  ) {

    marcarErrorCampo(
      campo,
      "Este campo es obligatorio."
    );

    return false;

  }


  if (!valor) {

    limpiarErrorCampo(campo);

    return true;

  }


  if (
    campo === dom.nombre ||
    campo === dom.apellido
  ) {

    if (valor.length < 2) {

      marcarErrorCampo(
        campo,
        "Ingresá al menos dos caracteres."
      );

      return false;

    }

  }


  if (campo === dom.dni) {

    const dniNormalizado =
      valor.replace(/\D/g, "");

    if (
      dniNormalizado.length < 7 ||
      dniNormalizado.length > 9
    ) {

      marcarErrorCampo(
        campo,
        "Ingresá un DNI válido."
      );

      return false;

    }

  }


  if (
    campo === dom.correo ||
    campo === dom.usuario
  ) {

    if (!esCorreoValido(valor)) {

      marcarErrorCampo(
        campo,
        "Ingresá un correo electrónico válido."
      );

      return false;

    }

  }


  if (campo === dom.telefono) {

    const numeros =
      valor.replace(/\D/g, "");

    if (numeros.length < 8) {

      marcarErrorCampo(
        campo,
        "Ingresá un número de teléfono válido."
      );

      return false;

    }

  }


  if (campo === dom.claveTemporal) {

    if (valor.length < 8) {

      marcarErrorCampo(
        campo,
        "La contraseña debe tener al menos 8 caracteres."
      );

      return false;

    }


    if (
      !/[A-Z]/.test(valor) ||
      !/[a-z]/.test(valor) ||
      !/[0-9]/.test(valor)
    ) {

      marcarErrorCampo(
        campo,
        "Debe incluir mayúscula, minúscula y número."
      );

      return false;

    }

  }


  limpiarErrorCampo(campo);

  return true;

}


/* =========================================================
   ERRORES EN CAMPOS
========================================================= */

function marcarErrorCampo(
  campo,
  mensaje
) {

  campo.setAttribute(
    "aria-invalid",
    "true"
  );


  const contenedor =
    campo.closest(
      ".alta-campo"
    );


  const error =
    contenedor?.querySelector(
      ".alta-error"
    );


  if (error) {

    error.textContent =
      mensaje;

  }

}


function limpiarErrorCampo(campo) {

  campo.removeAttribute(
    "aria-invalid"
  );


  const contenedor =
    campo.closest(
      ".alta-campo"
    );


  const error =
    contenedor?.querySelector(
      ".alta-error"
    );


  if (error) {

    error.textContent =
      "";

  }

}


/* =========================================================
   RESUMEN DINÁMICO
========================================================= */

function actualizarResumen() {

  const nombreCompleto =
    [
      limpiarTexto(
        dom.nombre?.value
      ),
      limpiarTexto(
        dom.apellido?.value
      )
    ]
      .filter(Boolean)
      .join(" ");


  escribirTexto(
    dom.resumenNombre,
    nombreCompleto ||
    "Sin completar"
  );


  escribirTexto(
    dom.resumenCorreo,
    limpiarTexto(
      dom.correo?.value
    ) ||
    "Sin completar"
  );


  escribirTexto(
    dom.resumenPrograma,
    obtenerTextoSelect(
      dom.programa
    ) ||
    limpiarTexto(
      dom.programa?.value
    ) ||
    "Sin asignar"
  );


  escribirTexto(
    dom.resumenEstado,
    capitalizarTexto(
      obtenerTextoSelect(
        dom.estado
      ) ||
      dom.estado?.value ||
      CONFIG.estadoInicial
    )
  );

}


/* =========================================================
   OBTENER DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormulario() {

  const nombre =
    limpiarTexto(
      dom.nombre?.value
    );

  const apellido =
    limpiarTexto(
      dom.apellido?.value
    );

  return {

    nombre,

    apellido,

    nombreCompleto:
      `${nombre} ${apellido}`.trim(),

    dni:
      limpiarTexto(
        dom.dni?.value
      ).replace(/\D/g, ""),

    fechaNacimiento:
      dom.fechaNacimiento?.value || null,

    correo:
      limpiarTexto(
        dom.correo?.value
      ).toLowerCase(),

    telefono:
      limpiarTexto(
        dom.telefono?.value
      ),

    programa:
      dom.programa?.value || "",

    programaNombre:
      obtenerTextoSelect(
        dom.programa
      ),

    cohorte:
      limpiarTexto(
        dom.cohorte?.value
      ),

    fechaInicio:
      dom.fechaInicio?.value || null,

    encuentroActual:
      Number(
        dom.encuentroInicial?.value
      ) || CONFIG.encuentroInicial,

    estado:
      dom.estado?.value ||
      CONFIG.estadoInicial,

    usuario:
      limpiarTexto(
        dom.usuario?.value
      ).toLowerCase(),

    claveTemporal:
      dom.claveTemporal?.value || "",

    configuracion: {

      enviarBienvenida:
        Boolean(
          dom.enviarBienvenida?.checked
        ),

      activarAcceso:
        dom.activarAcceso
          ? Boolean(
              dom.activarAcceso.checked
            )
          : true,

      asignarEncuentro:
        dom.asignarEncuentro
          ? Boolean(
              dom.asignarEncuentro.checked
            )
          : true

    },

    observaciones:
      limpiarTexto(
        dom.observaciones?.value
      ),

    progreso:
      0,

    creadoEn:
      new Date().toISOString(),

    actualizadoEn:
      new Date().toISOString(),

    origen:
      "escuela-admin",

    version:
      "1.0"

  };

}


/* =========================================================
   ENVÍO DEL FORMULARIO
========================================================= */

function manejarEnvioFormulario(event) {

  event.preventDefault();

  guardarParticipante();

}


function manejarClickGuardar(event) {

  /*
    Cuando el botón está dentro del formulario y es submit,
    dejamos que el evento submit gestione el proceso.
  */

  if (
    dom.btnGuardar?.type === "submit" &&
    dom.formulario
  ) {
    return;
  }

  event.preventDefault();

  guardarParticipante();

}


/* =========================================================
   GUARDAR PARTICIPANTE
========================================================= */

async function guardarParticipante() {

  if (state.guardando) {
    return;
  }


  ocultarMensajes();


  if (!validarFormulario()) {

    mostrarErrorGeneral(
      "Revisá los campos señalados antes de guardar al participante."
    );

    return;

  }


  const participante =
    obtenerDatosFormulario();


  state.guardando = true;

  mostrarCarga();


  try {

    /*
      ======================================================
      INTEGRACIÓN FIREBASE

      En el siguiente sprint este bloque se reemplazará por:

      1. Creación de usuario en Firebase Authentication.
      2. Creación del documento del participante.
      3. Creación del progreso inicial.
      4. Asignación del programa.
      5. Registro de actividad.
      6. Envío opcional del correo de bienvenida.
      ======================================================
    */


  const documento =
  await crear(participante);

participante.id =
  documento.id;


    localStorage.removeItem(
      CONFIG.claveBorrador
    );


    state.cambiosSinGuardar =
      false;

    state.guardando =
      false;

    state.salidaConfirmada =
      true;


    mostrarExito(
      `El participante ${participante.nombreCompleto} quedó preparado correctamente. La conexión definitiva con Firebase se realizará en el próximo sprint.`
    );


    console.log(
      "Participante preparado:",
      participante
    );

  } catch (error) {

    state.guardando =
      false;

    console.error(
      "Error al guardar participante:",
      error
    );

    mostrarErrorGeneral(
      "No fue posible guardar al participante. Intentá nuevamente."
    );

  }

}


/* =========================================================
   SIMULACIÓN TEMPORAL
========================================================= */

function simularGuardado() {

  return new Promise(resolve => {

    window.setTimeout(
      resolve,
      700
    );

  });

}


function generarIdTemporal() {

  return `PART-${Date.now()
    .toString(36)
    .toUpperCase()}`;

}


/* =========================================================
   BORRADOR LOCAL
========================================================= */

function guardarBorrador(event) {

  event?.preventDefault();


  const datos =
    obtenerDatosFormulario();


  const borrador = {

    datos,

    guardadoEn:
      new Date().toISOString()

  };


  try {

    localStorage.setItem(
      CONFIG.claveBorrador,
      JSON.stringify(borrador)
    );


    state.cambiosSinGuardar =
      false;


    mostrarExito(
      "El borrador fue guardado en este dispositivo."
    );


    window.setTimeout(
      () => {

        if (
          dom.estadoExito &&
          !state.guardando
        ) {

          dom.estadoExito.hidden =
            true;

        }

      },
      2600
    );

  } catch (error) {

    console.error(
      "Error al guardar borrador:",
      error
    );

    mostrarErrorGeneral(
      "No fue posible guardar el borrador en este dispositivo."
    );

  }

}


/* =========================================================
   RESTAURAR BORRADOR
========================================================= */

function restaurarBorrador() {

  const contenido =
    localStorage.getItem(
      CONFIG.claveBorrador
    );


  if (!contenido) {
    return;
  }


  try {

    const borrador =
      JSON.parse(contenido);

    const datos =
      borrador?.datos;


    if (!datos) {
      return;
    }


    asignarValor(
      dom.nombre,
      datos.nombre
    );

    asignarValor(
      dom.apellido,
      datos.apellido
    );

    asignarValor(
      dom.dni,
      datos.dni
    );

    asignarValor(
      dom.fechaNacimiento,
      datos.fechaNacimiento
    );

    asignarValor(
      dom.correo,
      datos.correo
    );

    asignarValor(
      dom.telefono,
      datos.telefono
    );

    asignarValor(
      dom.programa,
      datos.programa
    );

    asignarValor(
      dom.cohorte,
      datos.cohorte
    );

    asignarValor(
      dom.fechaInicio,
      datos.fechaInicio
    );

    asignarValor(
      dom.encuentroInicial,
      datos.encuentroActual
    );

    asignarValor(
      dom.estado,
      datos.estado
    );

    asignarValor(
      dom.usuario,
      datos.usuario
    );

    asignarValor(
      dom.claveTemporal,
      datos.claveTemporal
    );

    asignarValor(
      dom.observaciones,
      datos.observaciones
    );


    asignarCheckbox(
      dom.enviarBienvenida,
      datos.configuracion
        ?.enviarBienvenida
    );

    asignarCheckbox(
      dom.activarAcceso,
      datos.configuracion
        ?.activarAcceso
    );

    asignarCheckbox(
      dom.asignarEncuentro,
      datos.configuracion
        ?.asignarEncuentro
    );


    state.borradorRestaurado =
      true;

    state.cambiosSinGuardar =
      false;


    actualizarResumen();


    console.log(
      "FALCO Escuela™: borrador restaurado"
    );

  } catch (error) {

    console.warn(
      "No se pudo restaurar el borrador:",
      error
    );

    localStorage.removeItem(
      CONFIG.claveBorrador
    );

  }

}


/* =========================================================
   ESTADOS VISUALES
========================================================= */

function ocultarMensajes() {

  cambiarHidden(
    dom.estadoCarga,
    true
  );

  cambiarHidden(
    dom.estadoExito,
    true
  );

  cambiarHidden(
    dom.estadoError,
    true
  );

}


function mostrarCarga() {

  ocultarMensajes();

  cambiarHidden(
    dom.estadoFormulario,
    true
  );

  cambiarHidden(
    dom.estadoCarga,
    false
  );


  cambiarEstadoBotones(true);

}


function mostrarExito(mensaje) {

  ocultarMensajes();

  cambiarHidden(
    dom.estadoCarga,
    true
  );

  cambiarHidden(
    dom.estadoFormulario,
    true
  );


  escribirTexto(
    dom.mensajeExito,
    mensaje
  );


  cambiarHidden(
    dom.estadoExito,
    false
  );


  cambiarEstadoBotones(false);


  dom.estadoExito?.scrollIntoView({

    behavior:
      "smooth",

    block:
      "center"

  });

}


function mostrarErrorGeneral(mensaje) {

  ocultarMensajes();


  escribirTexto(
    dom.mensajeError,
    mensaje
  );


  cambiarHidden(
    dom.estadoError,
    false
  );


  cambiarEstadoBotones(false);


  dom.estadoError?.scrollIntoView({

    behavior:
      "smooth",

    block:
      "center"

  });

}


function cambiarEstadoBotones(deshabilitados) {

  [

    dom.btnGuardar,
    dom.btnGuardarBorrador,
    dom.btnGenerarClave

  ]
    .filter(Boolean)
    .forEach(boton => {

      boton.disabled =
        deshabilitados;

    });

}

/* =========================================================
   REINICIAR FORMULARIO
========================================================= */

function reiniciarFormulario(event) {

  event?.preventDefault();

  /*
    Eliminamos primero el borrador para impedir
    cualquier restauración posterior.
  */

  localStorage.removeItem(
    CONFIG.claveBorrador
  );


  /*
    Reinicio nativo del formulario.
  */

  dom.formulario?.reset();


  /*
    Limpieza explícita de los campos personales.
    Esto evita que el navegador conserve valores
    anteriores mediante reset o autocompletado.
  */

  [
    dom.nombre,
    dom.apellido,
    dom.dni,
    dom.fechaNacimiento,
    dom.correo,
    dom.telefono,
    dom.programa,
    dom.cohorte,
    dom.fechaInicio,
    dom.encuentroInicial,
    dom.estado,
    dom.usuario,
    dom.claveTemporal,
    dom.observaciones
  ]
    .filter(Boolean)
    .forEach(campo => {

      campo.value = "";

      campo.defaultValue = "";

      campo.removeAttribute(
        "aria-invalid"
      );

    });


  /*
    Permitimos que el correo vuelva a sincronizarse
    automáticamente con el usuario de acceso.
  */

  if (dom.usuario) {

    delete dom.usuario.dataset
      .editadoManualmente;

  }


  /*
    Reiniciamos las opciones administrativas.
  */

  if (dom.enviarBienvenida) {

    dom.enviarBienvenida.checked =
      false;

  }


  if (dom.activarAcceso) {

    dom.activarAcceso.checked =
      true;

  }


  if (dom.asignarEncuentro) {

    dom.asignarEncuentro.checked =
      true;

  }


  /*
    Reiniciamos el estado interno.
  */

  state.cambiosSinGuardar =
    false;

  state.guardando =
    false;

  state.salidaConfirmada =
    false;

  state.borradorRestaurado =
    false;

  state.accionSalida =
    null;


  /*
    Volvemos a colocar únicamente los valores
    iniciales definidos por el Sistema FALCO®.
  */

  configurarValoresIniciales();


  /*
    Limpiamos todos los mensajes de validación.
  */

  obtenerCampos().forEach(
    limpiarErrorCampo
  );


  ocultarMensajes();


  cambiarHidden(
    dom.estadoFormulario,
    false
  );


  actualizarResumen();


  dom.nombre?.focus();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });


  console.log(
    "FALCO Escuela™: formulario reiniciado"
  );

}


/* =========================================================
   PROTECCIÓN DE SALIDA
========================================================= */

function manejarClickVolver(event) {

  if (
    !state.cambiosSinGuardar ||
    state.salidaConfirmada
  ) {

    return;

  }


  event.preventDefault();


  state.accionSalida =
    () => {

      window.location.href =
        dom.btnVolver?.href ||
        CONFIG.listadoUrl;

    };


  abrirModalSalida();

}


function solicitarSalida(event) {

  event?.preventDefault();


  if (!state.cambiosSinGuardar) {

    state.salidaConfirmada =
      true;

    window.location.href =
      CONFIG.listadoUrl;

    return;

  }


  state.accionSalida =
    () => {

      window.location.href =
        CONFIG.listadoUrl;

    };


  abrirModalSalida();

}


function abrirModalSalida() {

  if (!dom.modalSalida) {

    const salir =
      window.confirm(
        "Hay cambios sin guardar. ¿Deseás salir igualmente?"
      );


    if (salir) {

      confirmarSalida();

    }

    return;

  }


  dom.modalSalida.hidden =
    false;

  dom.modalSalida.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  dom.btnPermanecer?.focus();

}


function cerrarModalSalida() {

  if (!dom.modalSalida) {
    return;
  }


  dom.modalSalida.hidden =
    true;

  dom.modalSalida.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "";


  state.accionSalida =
    null;

}


function confirmarSalida() {

  const accion =
    state.accionSalida;


  state.salidaConfirmada =
    true;

  state.cambiosSinGuardar =
    false;


  cerrarModalSalida();


  if (
    typeof accion === "function"
  ) {

    accion();

  } else {

    window.location.href =
      CONFIG.listadoUrl;

  }

}


function protegerSalidaNavegador(event) {

  if (
    !state.cambiosSinGuardar ||
    state.salidaConfirmada
  ) {

    return;

  }


  event.preventDefault();

  event.returnValue =
    "";

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTeclado(event) {

  if (
    event.key === "Escape" &&
    dom.modalSalida &&
    !dom.modalSalida.hidden
  ) {

    cerrarModalSalida();

  }


  if (
    event.ctrlKey &&
    event.key.toLowerCase() === "s"
  ) {

    event.preventDefault();

    guardarBorrador();

  }

}


/* =========================================================
   UTILIDADES
========================================================= */

function asignarValor(
  elemento,
  valor
) {

  if (
    !elemento ||
    valor === undefined ||
    valor === null
  ) {

    return;

  }

  elemento.value =
    String(valor);

}


function asignarCheckbox(
  elemento,
  valor
) {

  if (
    !elemento ||
    typeof valor !== "boolean"
  ) {

    return;

  }

  elemento.checked =
    valor;

}


function obtenerTextoSelect(select) {

  if (
    !select ||
    select.tagName !== "SELECT"
  ) {

    return "";

  }


  const opcion =
    select.options[
      select.selectedIndex
    ];


  if (
    !opcion ||
    !opcion.value
  ) {

    return "";

  }


  return limpiarTexto(
    opcion.textContent
  );

}


function obtenerFechaActual() {

  const fecha =
    new Date();

  const anio =
    fecha.getFullYear();

  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

  const dia =
    String(
      fecha.getDate()
    ).padStart(2, "0");


  return `${anio}-${mes}-${dia}`;

}


function esCorreoValido(correo) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(correo);

}


function limpiarTexto(valor) {

  return String(valor ?? "")
    .trim()
    .replace(/\s+/g, " ");

}


function capitalizarTexto(valor) {

  const texto =
    limpiarTexto(valor);

  if (!texto) {
    return "";
  }


  return texto
    .charAt(0)
    .toUpperCase() +
    texto.slice(1);

}


function escribirTexto(
  elemento,
  texto
) {

  if (!elemento) {
    return;
  }

  elemento.textContent =
    texto;

}


function cambiarHidden(
  elemento,
  oculto
) {

  if (!elemento) {
    return;
  }

  elemento.hidden =
    oculto;

}


/* =========================================================
   INICIO
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

} else {

  init();

}