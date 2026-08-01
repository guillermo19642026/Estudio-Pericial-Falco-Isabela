/* =========================================================
   FALCO® COMUNIDAD
   EVENTO INSTITUCIONAL
   evento.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const EVENTO_STORAGE_KEY =
  "falcoComunidadAgenda";

const EVENTO_PAGINA_AGENDA =
  "./agenda.html";


/* =========================================================
   CATÁLOGOS
========================================================= */

const EVENTO_TIPOS = {

  reunion:
    "Reunión",

  actividad:
    "Actividad",

  capacitacion:
    "Capacitación",

  programa:
    "Programa",

  proyecto:
    "Proyecto",

  recordatorio:
    "Recordatorio",

  otro:
    "Otro"

};


const EVENTO_ESTADOS = {

  pendiente: {

    etiqueta:
      "Pendiente",

    clase:
      "evento-estado--pendiente",

    icono:
      "◌",

    titulo:
      "Evento pendiente",

    mensaje:
      "El evento todavía no fue confirmado."

  },

  confirmado: {

    etiqueta:
      "Confirmado",

    clase:
      "evento-estado--confirmado",

    icono:
      "✓",

    titulo:
      "Evento confirmado",

    mensaje:
      "El evento se encuentra programado y confirmado."

  },

  finalizado: {

    etiqueta:
      "Finalizado",

    clase:
      "evento-estado--finalizado",

    icono:
      "●",

    titulo:
      "Evento finalizado",

    mensaje:
      "El evento fue realizado y quedó registrado como finalizado."

  },

  cancelado: {

    etiqueta:
      "Cancelado",

    clase:
      "evento-estado--cancelado",

    icono:
      "×",

    titulo:
      "Evento cancelado",

    mensaje:
      "El evento fue suspendido o cancelado."

  }

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const eventoState = {

  eventoId:
    null,

  evento:
    null,

  eventos:
    [],

  accionConfirmacion:
    null,

  temporizadorNotificacion:
    null,

  guardando:
    false

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const eventoElementos = {

  loader:
    document.getElementById(
      "eventoLoader"
    ),

  noEncontrado:
    document.getElementById(
      "eventoNoEncontrado"
    ),

  contenido:
    document.getElementById(
      "eventoContenido"
    ),


  /* -------------------------------------------------------
     CABECERA
  ------------------------------------------------------- */

  tipo:
    document.getElementById(
      "eventoTipo"
    ),

  estado:
    document.getElementById(
      "eventoEstado"
    ),

  titulo:
    document.getElementById(
      "eventoTitulo"
    ),

  descripcion:
    document.getElementById(
      "eventoDescripcion"
    ),

  referencia:
    document.getElementById(
      "eventoReferencia"
    ),


  /* -------------------------------------------------------
     INDICADORES
  ------------------------------------------------------- */

  fechaIndicador:
    document.getElementById(
      "eventoFechaIndicador"
    ),

  horaIndicador:
    document.getElementById(
      "eventoHoraIndicador"
    ),

  modalidadIndicador:
    document.getElementById(
      "eventoModalidadIndicador"
    ),

  responsableIndicador:
    document.getElementById(
      "eventoResponsableIndicador"
    ),


  /* -------------------------------------------------------
     DATOS GENERALES
  ------------------------------------------------------- */

  datoTipo:
    document.getElementById(
      "eventoDatoTipo"
    ),

  datoEstado:
    document.getElementById(
      "eventoDatoEstado"
    ),

  datoFecha:
    document.getElementById(
      "eventoDatoFecha"
    ),

  datoHora:
    document.getElementById(
      "eventoDatoHora"
    ),

  datoDuracion:
    document.getElementById(
      "eventoDatoDuracion"
    ),

  datoModalidad:
    document.getElementById(
      "eventoDatoModalidad"
    ),

  datoLugar:
    document.getElementById(
      "eventoDatoLugar"
    ),

  datoDescripcion:
    document.getElementById(
      "eventoDatoDescripcion"
    ),


  /* -------------------------------------------------------
     VINCULACIONES
  ------------------------------------------------------- */

  datoResponsable:
    document.getElementById(
      "eventoDatoResponsable"
    ),

  datoInstitucion:
    document.getElementById(
      "eventoDatoInstitucion"
    ),

  datoPrograma:
    document.getElementById(
      "eventoDatoPrograma"
    ),

  datoProyecto:
    document.getElementById(
      "eventoDatoProyecto"
    ),

  datoObservaciones:
    document.getElementById(
      "eventoDatoObservaciones"
    ),


  /* -------------------------------------------------------
     SEGUIMIENTO Y REGISTRO
  ------------------------------------------------------- */

  seguimientoIcono:
    document.getElementById(
      "eventoSeguimientoIcono"
    ),

  seguimientoTitulo:
    document.getElementById(
      "eventoSeguimientoTitulo"
    ),

  seguimientoMensaje:
    document.getElementById(
      "eventoSeguimientoMensaje"
    ),

  fechaCreacion:
    document.getElementById(
      "eventoFechaCreacion"
    ),

  fechaActualizacion:
    document.getElementById(
      "eventoFechaActualizacion"
    ),


  /* -------------------------------------------------------
     BOTONES PRINCIPALES
  ------------------------------------------------------- */

  botonEditar:
    document.getElementById(
      "botonEditarEvento"
    ),

  botonEditarResumen:
    document.getElementById(
      "botonEditarResumenEvento"
    ),

  botonCambiarEstado:
    document.getElementById(
      "botonCambiarEstadoEvento"
    ),

  botonDuplicar:
    document.getElementById(
      "botonDuplicarEvento"
    ),

  botonEliminar:
    document.getElementById(
      "botonEliminarEvento"
    ),


  /* -------------------------------------------------------
     MODAL EDITAR
  ------------------------------------------------------- */

  modalEditar:
    document.getElementById(
      "modalEditarEvento"
    ),

  formularioEditar:
    document.getElementById(
      "formularioEditarEvento"
    ),


  /* -------------------------------------------------------
     MODAL ESTADO
  ------------------------------------------------------- */

  modalEstado:
    document.getElementById(
      "modalCambiarEstadoEvento"
    ),

  formularioEstado:
    document.getElementById(
      "formularioCambiarEstadoEvento"
    ),


  /* -------------------------------------------------------
     MODAL CONFIRMACIÓN
  ------------------------------------------------------- */

  modalConfirmacion:
    document.getElementById(
      "modalConfirmacionEvento"
    ),

  confirmacionTitulo:
    document.getElementById(
      "modalConfirmacionEventoTitulo"
    ),

  confirmacionMensaje:
    document.getElementById(
      "modalConfirmacionEventoMensaje"
    ),

  botonCancelarConfirmacion:
    document.getElementById(
      "botonCancelarConfirmacionEvento"
    ),

  botonAceptarConfirmacion:
    document.getElementById(
      "botonAceptarConfirmacionEvento"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "eventoNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "eventoNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "eventoNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "eventoNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "eventoNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarEvento
);


function iniciarEvento() {

  eventoState.eventoId =
    obtenerEventoIdDesdeURL();


  registrarEventosEvento();


  if (
    !eventoState.eventoId
  ) {

    mostrarEventoNoEncontrado();

    return;

  }


  cargarEvento();


  console.info(
    "FALCO Comunidad Evento™ v1.0 Ready"
  );

}


/* =========================================================
   OBTENER ID DESDE LA URL
========================================================= */

function obtenerEventoIdDesdeURL() {

  const parametros =
    new URLSearchParams(
      window.location.search
    );


  return obtenerTextoEvento(
    parametros.get("id")
  );

}


/* =========================================================
   EVENTOS GENERALES
========================================================= */

function registrarEventosEvento() {

  eventoElementos.botonEditar
    ?.addEventListener(
      "click",
      abrirModalEditarEvento
    );


  eventoElementos.botonEditarResumen
    ?.addEventListener(
      "click",
      abrirModalEditarEvento
    );


  eventoElementos.botonCambiarEstado
    ?.addEventListener(
      "click",
      abrirModalCambiarEstadoEvento
    );


  eventoElementos.botonDuplicar
    ?.addEventListener(
      "click",
      solicitarDuplicarEvento
    );


  eventoElementos.botonEliminar
    ?.addEventListener(
      "click",
      solicitarEliminarEvento
    );


  eventoElementos.formularioEditar
    ?.addEventListener(
      "submit",
      guardarEdicionEvento
    );


  eventoElementos.formularioEditar
    ?.addEventListener(
      "input",
      manejarCambioCampoEdicionEvento
    );


  eventoElementos.formularioEstado
    ?.addEventListener(
      "submit",
      guardarCambioEstadoEvento
    );


  eventoElementos.botonCancelarConfirmacion
    ?.addEventListener(
      "click",
      cerrarModalConfirmacionEvento
    );


  eventoElementos.botonAceptarConfirmacion
    ?.addEventListener(
      "click",
      ejecutarAccionConfirmadaEvento
    );


  eventoElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionEvento
    );


  document
    .querySelectorAll(
      "[data-cerrar-modal]"
    )
    .forEach(
      (elemento) => {

        elemento.addEventListener(
          "click",
          manejarCierreModalEvento
        );

      }
    );


  document.addEventListener(
    "keydown",
    manejarTecladoEvento
  );


  window.addEventListener(
    "storage",
    manejarCambioStorageEvento
  );

}


/* =========================================================
   CARGA DEL EVENTO
========================================================= */

function cargarEvento() {

  mostrarLoaderEvento();


  try {

    const contenido =
      localStorage.getItem(
        EVENTO_STORAGE_KEY
      );


    const datos =
      contenido
        ? JSON.parse(contenido)
        : [];


    eventoState.eventos =
      Array.isArray(datos)
        ? datos
        : [];


    const eventoEncontrado =
      eventoState.eventos.find(
        (evento) =>
          obtenerTextoEvento(
            evento.id
          ) ===
          eventoState.eventoId
      );


    if (!eventoEncontrado) {

      mostrarEventoNoEncontrado();

      return;

    }


    eventoState.evento =
      normalizarEventoDetalle(
        eventoEncontrado
      );


    renderizarEventoCompleto();

    mostrarContenidoEvento();

  } catch (error) {

    console.error(
      "No fue posible cargar el evento:",
      error
    );


    mostrarEventoNoEncontrado();

  }

}


/* =========================================================
   NORMALIZACIÓN DEL EVENTO
========================================================= */

function normalizarEventoDetalle(
  evento
) {

  const fechaCreacion =
    evento.fechaCreacion ||
    evento.creadoEn ||
    evento.createdAt ||
    new Date().toISOString();


  const fechaActualizacion =
    evento.fechaActualizacion ||
    evento.actualizadoEn ||
    evento.updatedAt ||
    fechaCreacion;


  return {

    ...evento,

    id:
      obtenerTextoEvento(
        evento.id
      ),

    referencia:
      obtenerTextoEvento(
        evento.referencia
      ) ||
      generarReferenciaEvento(),

    titulo:
      obtenerTextoEvento(
        evento.titulo ||
        evento.nombre ||
        evento.asunto
      ) ||
      "Evento sin título",

    tipo:
      normalizarTipoEvento(
        evento.tipo
      ),

    estado:
      normalizarEstadoEvento(
        evento.estado
      ),

    descripcion:
      obtenerTextoEvento(
        evento.descripcion ||
        evento.detalle
      ),

    fecha:
      obtenerTextoEvento(
        evento.fecha ||
        evento.fechaEvento ||
        evento.fechaInicio
      ),

    hora:
      obtenerTextoEvento(
        evento.hora ||
        evento.horaInicio
      ),

    duracion:
      obtenerTextoEvento(
        evento.duracion
      ),

    modalidad:
      obtenerTextoEvento(
        evento.modalidad
      ) ||
      "Sin definir",

    lugar:
      obtenerTextoEvento(
        evento.lugar ||
        evento.enlace
      ),

    responsable:
      obtenerTextoEvento(
        evento.responsable ||
        evento.coordinador ||
        evento.referente
      ),

    institucion:
      obtenerTextoEvento(
        evento.institucion ||
        evento.institucionNombre
      ),

    programaId:
      obtenerTextoEvento(
        evento.programaId
      ),

    programa:
      obtenerTextoEvento(
        evento.programa ||
        evento.programaNombre
      ),

    proyectoId:
      obtenerTextoEvento(
        evento.proyectoId
      ),

    proyecto:
      obtenerTextoEvento(
        evento.proyecto ||
        evento.proyectoNombre
      ),

    observaciones:
      obtenerTextoEvento(
        evento.observaciones
      ),

    origen:
      obtenerTextoEvento(
        evento.origen
      ) ||
      "agenda",

    editable:
      evento.editable !== false,

    fechaCreacion,

    fechaActualizacion

  };

}


/* =========================================================
   NORMALIZAR TIPO
========================================================= */

function normalizarTipoEvento(
  valor
) {

  const tipo =
    normalizarTextoEvento(
      valor
    );


  const equivalencias = {

    reunion:
      "reunion",

    actividad:
      "actividad",

    capacitacion:
      "capacitacion",

    curso:
      "capacitacion",

    taller:
      "capacitacion",

    programa:
      "programa",

    proyecto:
      "proyecto",

    recordatorio:
      "recordatorio",

    otro:
      "otro"

  };


  return equivalencias[tipo] ||
    "otro";

}


/* =========================================================
   NORMALIZAR ESTADO
========================================================= */

function normalizarEstadoEvento(
  valor
) {

  const estado =
    normalizarTextoEvento(
      valor
    );


  const equivalencias = {

    pendiente:
      "pendiente",

    preparacion:
      "pendiente",

    programado:
      "pendiente",

    programada:
      "pendiente",

    confirmado:
      "confirmado",

    confirmada:
      "confirmado",

    activo:
      "confirmado",

    activa:
      "confirmado",

    finalizado:
      "finalizado",

    finalizada:
      "finalizado",

    realizado:
      "finalizado",

    realizada:
      "finalizado",

    cancelado:
      "cancelado",

    cancelada:
      "cancelado",

    suspendido:
      "cancelado",

    suspendida:
      "cancelado"

  };


  return equivalencias[estado] ||
    "pendiente";

}


/* =========================================================
   RENDERIZADO GENERAL
========================================================= */

function renderizarEventoCompleto() {

  if (
    !eventoState.evento
  ) {

    return;

  }


  actualizarTituloDocumentoEvento();

  renderizarCabeceraEvento();

  renderizarIndicadoresEvento();

  renderizarDatosGeneralesEvento();

  renderizarVinculacionesEvento();

  renderizarSeguimientoEvento();

  renderizarRegistroEvento();

}


/* =========================================================
   TÍTULO DEL DOCUMENTO
========================================================= */

function actualizarTituloDocumentoEvento() {

  document.title =
    `${eventoState.evento.titulo} | FALCO® Comunidad`;

}


/* =========================================================
   CABECERA
========================================================= */

function renderizarCabeceraEvento() {

  const evento =
    eventoState.evento;


  const tipo =
    EVENTO_TIPOS[
      evento.tipo
    ] ||
    EVENTO_TIPOS.otro;


  const estado =
    EVENTO_ESTADOS[
      evento.estado
    ] ||
    EVENTO_ESTADOS.pendiente;


  establecerTextoEvento(
    eventoElementos.tipo,
    tipo
  );


  establecerTextoEvento(
    eventoElementos.titulo,
    evento.titulo
  );


  establecerTextoEvento(
    eventoElementos.descripcion,
    evento.descripcion ||
    "Sin descripción registrada."
  );


  establecerTextoEvento(
    eventoElementos.referencia,
    evento.referencia
  );


  if (
    eventoElementos.estado
  ) {

    eventoElementos.estado.className =
      `evento-estado ${estado.clase}`;


    eventoElementos.estado.textContent =
      estado.etiqueta;

  }

}


/* =========================================================
   INDICADORES
========================================================= */

function renderizarIndicadoresEvento() {

  const evento =
    eventoState.evento;


  establecerTextoEvento(
    eventoElementos.fechaIndicador,
    formatearFechaEvento(
      evento.fecha
    )
  );


  establecerTextoEvento(
    eventoElementos.horaIndicador,
    evento.hora ||
    "Sin horario"
  );


  establecerTextoEvento(
    eventoElementos.modalidadIndicador,
    evento.modalidad ||
    "Sin definir"
  );


  establecerTextoEvento(
    eventoElementos.responsableIndicador,
    evento.responsable ||
    "Sin responsable"
  );

}

/* =========================================================
   DATOS GENERALES
========================================================= */

function renderizarDatosGeneralesEvento() {

  const evento =
    eventoState.evento;


  const tipo =
    EVENTO_TIPOS[
      evento.tipo
    ] ||
    EVENTO_TIPOS.otro;


  const estado =
    EVENTO_ESTADOS[
      evento.estado
    ] ||
    EVENTO_ESTADOS.pendiente;


  establecerTextoEvento(
    eventoElementos.datoTipo,
    tipo
  );


  establecerTextoEvento(
    eventoElementos.datoEstado,
    estado.etiqueta
  );


  establecerTextoEvento(
    eventoElementos.datoFecha,
    formatearFechaEvento(
      evento.fecha
    )
  );


  establecerTextoEvento(
    eventoElementos.datoHora,
    evento.hora ||
    "Sin horario"
  );


  establecerTextoEvento(
    eventoElementos.datoDuracion,
    evento.duracion ||
    "Sin duración definida"
  );


  establecerTextoEvento(
    eventoElementos.datoModalidad,
    evento.modalidad ||
    "Sin definir"
  );


  establecerTextoEvento(
    eventoElementos.datoLugar,
    evento.lugar ||
    "Sin lugar o enlace registrado"
  );


  establecerTextoEvento(
    eventoElementos.datoDescripcion,
    evento.descripcion ||
    "Sin descripción registrada."
  );

}


/* =========================================================
   VINCULACIONES
========================================================= */

function renderizarVinculacionesEvento() {

  const evento =
    eventoState.evento;


  establecerTextoEvento(
    eventoElementos.datoResponsable,
    evento.responsable ||
    "Sin responsable asignado"
  );


  establecerTextoEvento(
    eventoElementos.datoInstitucion,
    evento.institucion ||
    "Sin institución vinculada"
  );


  establecerTextoEvento(
    eventoElementos.datoPrograma,
    evento.programa ||
    "Sin programa asociado"
  );


  establecerTextoEvento(
    eventoElementos.datoProyecto,
    evento.proyecto ||
    "Sin proyecto asociado"
  );


  establecerTextoEvento(
    eventoElementos.datoObservaciones,
    evento.observaciones ||
    "Sin observaciones internas."
  );

}


/* =========================================================
   SEGUIMIENTO
========================================================= */

function renderizarSeguimientoEvento() {

  const estado =
    EVENTO_ESTADOS[
      eventoState.evento.estado
    ] ||
    EVENTO_ESTADOS.pendiente;


  establecerTextoEvento(
    eventoElementos.seguimientoIcono,
    estado.icono
  );


  establecerTextoEvento(
    eventoElementos.seguimientoTitulo,
    estado.titulo
  );


  establecerTextoEvento(
    eventoElementos.seguimientoMensaje,
    estado.mensaje
  );

}


/* =========================================================
   REGISTRO ADMINISTRATIVO
========================================================= */

function renderizarRegistroEvento() {

  establecerTextoEvento(
    eventoElementos.fechaCreacion,
    formatearFechaHoraEvento(
      eventoState.evento.fechaCreacion
    )
  );


  establecerTextoEvento(
    eventoElementos.fechaActualizacion,
    formatearFechaHoraEvento(
      eventoState.evento.fechaActualizacion
    )
  );

}


/* =========================================================
   ABRIR MODAL DE EDICIÓN
========================================================= */

function abrirModalEditarEvento() {

  const evento =
    eventoState.evento;


  if (
    !evento ||
    !eventoElementos.modalEditar ||
    !eventoElementos.formularioEditar
  ) {

    return;

  }


  completarCampoEdicionEvento(
    "titulo",
    evento.titulo
  );


  completarCampoEdicionEvento(
    "tipo",
    evento.tipo
  );


  completarCampoEdicionEvento(
    "fecha",
    normalizarFechaInputEvento(
      evento.fecha
    )
  );


  completarCampoEdicionEvento(
    "hora",
    evento.hora
  );


  completarCampoEdicionEvento(
    "duracion",
    evento.duracion
  );


  completarCampoEdicionEvento(
    "modalidad",
    evento.modalidad ===
      "Sin definir"
      ? ""
      : evento.modalidad
  );


  completarCampoEdicionEvento(
    "lugar",
    evento.lugar
  );


  completarCampoEdicionEvento(
    "descripcion",
    evento.descripcion
  );


  completarCampoEdicionEvento(
    "responsable",
    evento.responsable
  );


  completarCampoEdicionEvento(
    "institucion",
    evento.institucion
  );


  completarCampoEdicionEvento(
    "observaciones",
    evento.observaciones
  );


  limpiarErroresEdicionEvento();


  abrirModalEvento(
    eventoElementos.modalEditar
  );


  window.setTimeout(
    () => {

      obtenerCampoEdicionEvento(
        "titulo"
      )?.focus();

    },
    60
  );

}


/* =========================================================
   CAMPOS DE EDICIÓN
========================================================= */

function completarCampoEdicionEvento(
  nombre,
  valor
) {

  const campo =
    obtenerCampoEdicionEvento(
      nombre
    );


  if (!campo) {

    return;

  }


  campo.value =
    valor ?? "";

}


function obtenerCampoEdicionEvento(
  nombre
) {

  return eventoElementos
    .formularioEditar
    ?.elements
    .namedItem(
      nombre
    );

}


/* =========================================================
   GUARDAR EDICIÓN
========================================================= */

function guardarEdicionEvento(
  eventoSubmit
) {

  eventoSubmit.preventDefault();


  if (
    eventoState.guardando
  ) {

    return;

  }


  if (
    !validarFormularioEdicionEvento()
  ) {

    mostrarNotificacionEvento({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Completá los campos obligatorios antes de guardar."

    });


    enfocarPrimerErrorEdicionEvento();

    return;

  }


  const datos =
    new FormData(
      eventoElementos.formularioEditar
    );


  eventoState.evento = {

    ...eventoState.evento,

    titulo:
      obtenerTextoEvento(
        datos.get("titulo")
      ),

    tipo:
      normalizarTipoEvento(
        datos.get("tipo")
      ),

    fecha:
      obtenerTextoEvento(
        datos.get("fecha")
      ),

    hora:
      obtenerTextoEvento(
        datos.get("hora")
      ),

    duracion:
      obtenerTextoEvento(
        datos.get("duracion")
      ),

    modalidad:
      obtenerTextoEvento(
        datos.get("modalidad")
      ) ||
      "Sin definir",

    lugar:
      obtenerTextoEvento(
        datos.get("lugar")
      ),

    descripcion:
      obtenerTextoEvento(
        datos.get("descripcion")
      ),

    responsable:
      obtenerTextoEvento(
        datos.get("responsable")
      ),

    institucion:
      obtenerTextoEvento(
        datos.get("institucion")
      ),

    observaciones:
      obtenerTextoEvento(
        datos.get("observaciones")
      ),

    fechaActualizacion:
      new Date().toISOString()

  };


  activarGuardadoEvento();


  window.setTimeout(
    () => {

      if (
        !guardarEventoActual()
      ) {

        desactivarGuardadoEvento();

        return;

      }


      cerrarModalEvento(
        eventoElementos.modalEditar
      );


      renderizarEventoCompleto();


      desactivarGuardadoEvento();


      mostrarNotificacionEvento({

        tipo:
          "success",

        titulo:
          "Cambios guardados",

        mensaje:
          "La información del evento fue actualizada correctamente."

      });

    },
    250
  );

}


/* =========================================================
   VALIDACIÓN DE EDICIÓN
========================================================= */

function validarFormularioEdicionEvento() {

  limpiarErroresEdicionEvento();


  let valido =
    true;


  valido =
    validarCampoEdicionEvento(
      "titulo",
      "Ingresá el título del evento."
    ) && valido;


  valido =
    validarCampoEdicionEvento(
      "tipo",
      "Seleccioná el tipo de evento."
    ) && valido;


  valido =
    validarCampoEdicionEvento(
      "fecha",
      "Seleccioná la fecha del evento."
    ) && valido;


  return valido;

}


function validarCampoEdicionEvento(
  nombre,
  mensaje
) {

  const campo =
    obtenerCampoEdicionEvento(
      nombre
    );


  if (!campo) {

    return false;

  }


  if (
    obtenerTextoEvento(
      campo.value
    )
  ) {

    limpiarErrorEdicionEvento(
      campo
    );


    return true;

  }


  mostrarErrorEdicionEvento(
    campo,
    mensaje
  );


  return false;

}


/* =========================================================
   ERRORES DE EDICIÓN
========================================================= */

function mostrarErrorEdicionEvento(
  campo,
  mensaje
) {

  if (!campo) {

    return;

  }


  campo.setAttribute(
    "aria-invalid",
    "true"
  );


  const error =
    eventoElementos
      .formularioEditar
      ?.querySelector(
        `[data-editar-error="${campo.name}"]`
      );


  establecerTextoEvento(
    error,
    mensaje
  );

}


function limpiarErrorEdicionEvento(
  campo
) {

  if (
    !campo ||
    !campo.name
  ) {

    return;

  }


  campo.removeAttribute(
    "aria-invalid"
  );


  const error =
    eventoElementos
      .formularioEditar
      ?.querySelector(
        `[data-editar-error="${campo.name}"]`
      );


  establecerTextoEvento(
    error,
    ""
  );

}


function limpiarErroresEdicionEvento() {

  eventoElementos
    .formularioEditar
    ?.querySelectorAll(
      "input, select, textarea"
    )
    .forEach(
      limpiarErrorEdicionEvento
    );

}


function manejarCambioCampoEdicionEvento(
  evento
) {

  limpiarErrorEdicionEvento(
    evento.target
  );

}


function enfocarPrimerErrorEdicionEvento() {

  eventoElementos
    .formularioEditar
    ?.querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}

/* =========================================================
   CAMBIO DE ESTADO
========================================================= */

function abrirModalCambiarEstadoEvento() {

  if (
    !eventoElementos.modalEstado ||
    !eventoElementos.formularioEstado ||
    !eventoState.evento
  ) {

    return;

  }


  const opcionActual =
    eventoElementos
      .formularioEstado
      .querySelector(
        `input[name="estado"][value="${eventoState.evento.estado}"]`
      );


  if (opcionActual) {

    opcionActual.checked =
      true;

  }


  abrirModalEvento(
    eventoElementos.modalEstado
  );

}


function guardarCambioEstadoEvento(
  eventoSubmit
) {

  eventoSubmit.preventDefault();


  const datos =
    new FormData(
      eventoElementos.formularioEstado
    );


  const nuevoEstado =
    normalizarEstadoEvento(
      datos.get("estado")
    );


  if (
    nuevoEstado ===
    eventoState.evento.estado
  ) {

    cerrarModalEvento(
      eventoElementos.modalEstado
    );

    return;

  }


  eventoState.evento = {

    ...eventoState.evento,

    estado:
      nuevoEstado,

    fechaActualizacion:
      new Date().toISOString()

  };


  if (
    !guardarEventoActual()
  ) {

    return;

  }


  cerrarModalEvento(
    eventoElementos.modalEstado
  );


  renderizarEventoCompleto();


  mostrarNotificacionEvento({

    tipo:
      "success",

    titulo:
      "Estado actualizado",

    mensaje:
      `El evento ahora figura como “${EVENTO_ESTADOS[nuevoEstado].etiqueta}”.`

  });

}


/* =========================================================
   DUPLICAR EVENTO
========================================================= */

function solicitarDuplicarEvento() {

  eventoState.accionConfirmacion =
    "duplicar";


  abrirModalConfirmacionEvento({

    titulo:
      "Duplicar evento",

    mensaje:
      "Se creará una copia del evento con una nueva referencia. Luego podrás modificar la fecha y los demás datos.",

    textoConfirmar:
      "Duplicar"

  });

}


function duplicarEventoActual() {

  const ahora =
    new Date().toISOString();


  const eventoDuplicado = {

    ...eventoState.evento,

    id:
      generarIdEvento(),

    referencia:
      generarReferenciaEvento(),

    titulo:
      `${eventoState.evento.titulo} - Copia`,

    estado:
      "pendiente",

    fechaCreacion:
      ahora,

    fechaActualizacion:
      ahora

  };


  eventoState.eventos.unshift(
    eventoDuplicado
  );


  try {

    localStorage.setItem(
      EVENTO_STORAGE_KEY,
      JSON.stringify(
        eventoState.eventos
      )
    );


    cerrarModalConfirmacionEvento();


    mostrarNotificacionEvento({

      tipo:
        "success",

      titulo:
        "Evento duplicado",

      mensaje:
        "La copia fue creada correctamente y quedó disponible en la Agenda."

    });


    window.setTimeout(
      () => {

        window.location.href =
          `./evento.html?id=${encodeURIComponent(eventoDuplicado.id)}`;

      },
      600
    );

  } catch (error) {

    console.error(
      "No fue posible duplicar el evento:",
      error
    );


    mostrarNotificacionEvento({

      tipo:
        "error",

      titulo:
        "No pudimos duplicar el evento",

      mensaje:
        "Se produjo un inconveniente al guardar la copia."

    });

  }

}


/* =========================================================
   ELIMINAR EVENTO
========================================================= */

function solicitarEliminarEvento() {

  eventoState.accionConfirmacion =
    "eliminar";


  abrirModalConfirmacionEvento({

    titulo:
      "Eliminar evento",

    mensaje:
      "El evento será eliminado definitivamente de la Agenda institucional. Esta acción no puede deshacerse.",

    textoConfirmar:
      "Eliminar evento"

  });

}


function eliminarEventoActual() {

  const eventosRestantes =
    eventoState.eventos.filter(
      (evento) =>
        obtenerTextoEvento(
          evento.id
        ) !==
        eventoState.eventoId
    );


  try {

    localStorage.setItem(
      EVENTO_STORAGE_KEY,
      JSON.stringify(
        eventosRestantes
      )
    );


    window.location.href =
      EVENTO_PAGINA_AGENDA;

  } catch (error) {

    console.error(
      "No fue posible eliminar el evento:",
      error
    );


    mostrarNotificacionEvento({

      tipo:
        "error",

      titulo:
        "No pudimos eliminar el evento",

      mensaje:
        "Se produjo un inconveniente al actualizar la Agenda."

    });

  }

}


/* =========================================================
   CONFIRMACIÓN
========================================================= */

function abrirModalConfirmacionEvento({
  titulo,
  mensaje,
  textoConfirmar
}) {

  establecerTextoEvento(
    eventoElementos.confirmacionTitulo,
    titulo
  );


  establecerTextoEvento(
    eventoElementos.confirmacionMensaje,
    mensaje
  );


  establecerTextoEvento(
    eventoElementos.botonAceptarConfirmacion,
    textoConfirmar
  );


  abrirModalEvento(
    eventoElementos.modalConfirmacion
  );


  window.setTimeout(
    () => {

      eventoElementos
        .botonAceptarConfirmacion
        ?.focus();

    },
    60
  );

}


function cerrarModalConfirmacionEvento() {

  cerrarModalEvento(
    eventoElementos.modalConfirmacion
  );


  eventoState.accionConfirmacion =
    null;

}


function ejecutarAccionConfirmadaEvento() {

  switch (
    eventoState.accionConfirmacion
  ) {

    case "duplicar":

      duplicarEventoActual();

      break;


    case "eliminar":

      eliminarEventoActual();

      break;


    default:

      cerrarModalConfirmacionEvento();

  }

}


/* =========================================================
   PERSISTENCIA
========================================================= */

function guardarEventoActual() {

  if (
    !eventoState.evento
  ) {

    return false;

  }


  const indice =
    eventoState.eventos.findIndex(
      (evento) =>
        obtenerTextoEvento(
          evento.id
        ) ===
        eventoState.eventoId
    );


  if (
    indice === -1
  ) {

    mostrarNotificacionEvento({

      tipo:
        "error",

      titulo:
        "Evento no encontrado",

      mensaje:
        "No fue posible localizar el registro seleccionado."

    });

    return false;

  }


  eventoState.eventos[indice] =
    eventoState.evento;


  try {

    localStorage.setItem(
      EVENTO_STORAGE_KEY,
      JSON.stringify(
        eventoState.eventos
      )
    );


    return true;

  } catch (error) {

    console.error(
      "No fue posible guardar el evento:",
      error
    );


    mostrarNotificacionEvento({

      tipo:
        "error",

      titulo:
        "No pudimos guardar los cambios",

      mensaje:
        "La información no pudo almacenarse correctamente."

    });


    return false;

  }

}

/* =========================================================
   MODALES
========================================================= */

function abrirModalEvento(
  modal
) {

  if (!modal) {

    return;

  }


  modal.hidden =
    false;


  document.body.classList.add(
    "evento-modal-abierto"
  );

}


function cerrarModalEvento(
  modal
) {

  if (!modal) {

    return;

  }


  modal.hidden =
    true;


  const hayModalAbierto = [

    eventoElementos.modalEditar,

    eventoElementos.modalEstado,

    eventoElementos.modalConfirmacion

  ].some(
    (elemento) =>
      elemento &&
      !elemento.hidden
  );


  if (!hayModalAbierto) {

    document.body.classList.remove(
      "evento-modal-abierto"
    );

  }

}


/* =========================================================
   CIERRE DE MODALES
========================================================= */

function manejarCierreModalEvento(
  evento
) {

  const tipo =
    evento.currentTarget.dataset
      .cerrarModal;


  const modales = {

    editar:
      eventoElementos.modalEditar,

    estado:
      eventoElementos.modalEstado,

    confirmacion:
      eventoElementos.modalConfirmacion

  };


  if (
    tipo === "confirmacion"
  ) {

    cerrarModalConfirmacionEvento();

    return;

  }


  cerrarModalEvento(
    modales[tipo]
  );

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTecladoEvento(
  evento
) {

  if (
    evento.key !== "Escape"
  ) {

    return;

  }


  if (
    eventoElementos.modalConfirmacion &&
    !eventoElementos.modalConfirmacion.hidden
  ) {

    cerrarModalConfirmacionEvento();

    return;

  }


  if (
    eventoElementos.modalEstado &&
    !eventoElementos.modalEstado.hidden
  ) {

    cerrarModalEvento(
      eventoElementos.modalEstado
    );

    return;

  }


  if (
    eventoElementos.modalEditar &&
    !eventoElementos.modalEditar.hidden
  ) {

    cerrarModalEvento(
      eventoElementos.modalEditar
    );

  }

}


/* =========================================================
   CAMBIO DE STORAGE
========================================================= */

function manejarCambioStorageEvento(
  evento
) {

  if (
    evento.key !==
    EVENTO_STORAGE_KEY
  ) {

    return;

  }


  cargarEvento();

}


/* =========================================================
   ESTADO DE GUARDADO
========================================================= */

function activarGuardadoEvento() {

  eventoState.guardando =
    true;


  eventoElementos
    .formularioEditar
    ?.querySelectorAll(
      "button, input, select, textarea"
    )
    .forEach(
      (elemento) => {

        elemento.disabled =
          true;

      }
    );

}


function desactivarGuardadoEvento() {

  eventoState.guardando =
    false;


  eventoElementos
    .formularioEditar
    ?.querySelectorAll(
      "button, input, select, textarea"
    )
    .forEach(
      (elemento) => {

        elemento.disabled =
          false;

      }
    );

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionEvento({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !eventoElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    eventoState.temporizadorNotificacion
  );


  const configuraciones = {

    success: {

      icono:
        "✓",

      color:
        "#61c79a",

      borde:
        "rgba(97, 199, 154, 0.28)",

      fondo:
        "rgba(97, 199, 154, 0.10)"

    },

    error: {

      icono:
        "!",

      color:
        "#e47a7a",

      borde:
        "rgba(228, 122, 122, 0.30)",

      fondo:
        "rgba(228, 122, 122, 0.10)"

    },

    info: {

      icono:
        "i",

      color:
        "#78aee8",

      borde:
        "rgba(120, 174, 232, 0.28)",

      fondo:
        "rgba(120, 174, 232, 0.10)"

    }

  };


  const configuracion =
    configuraciones[tipo] ||
    configuraciones.success;


  establecerTextoEvento(
    eventoElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoEvento(
    eventoElementos.notificacionTitulo,
    titulo
  );


  establecerTextoEvento(
    eventoElementos.notificacionMensaje,
    mensaje
  );


  eventoElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  eventoElementos.notificacionIcono
    .style.color =
      configuracion.color;


  eventoElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  eventoElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  eventoElementos.notificacion.hidden =
    false;


  eventoState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionEvento,
      4500
    );

}


function ocultarNotificacionEvento() {

  if (
    !eventoElementos.notificacion
  ) {

    return;

  }


  eventoElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    eventoState.temporizadorNotificacion
  );

}


/* =========================================================
   LOADER Y ESTADOS GENERALES
========================================================= */

function mostrarLoaderEvento() {

  mostrarElementoEvento(
    eventoElementos.loader
  );


  ocultarElementoEvento(
    eventoElementos.noEncontrado
  );


  ocultarElementoEvento(
    eventoElementos.contenido
  );

}


function mostrarContenidoEvento() {

  ocultarElementoEvento(
    eventoElementos.loader
  );


  ocultarElementoEvento(
    eventoElementos.noEncontrado
  );


  mostrarElementoEvento(
    eventoElementos.contenido
  );

}


function mostrarEventoNoEncontrado() {

  ocultarElementoEvento(
    eventoElementos.loader
  );


  ocultarElementoEvento(
    eventoElementos.contenido
  );


  mostrarElementoEvento(
    eventoElementos.noEncontrado
  );

}

/* =========================================================
   GENERACIÓN DE ID
========================================================= */

function generarIdEvento() {

  const fecha =
    Date.now()
      .toString(36)
      .toUpperCase();


  const aleatorio =
    Math.random()
      .toString(36)
      .slice(2, 9)
      .toUpperCase();


  return `EVENTO-${fecha}-${aleatorio}`;

}


/* =========================================================
   GENERACIÓN DE REFERENCIA
========================================================= */

function generarReferenciaEvento() {

  const anio =
    new Date().getFullYear();


  const codigo =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();


  return `FALCO-EVT-${anio}-${codigo}`;

}


/* =========================================================
   FECHAS
========================================================= */

function crearFechaEvento(
  valor
) {

  if (!valor) {

    return null;

  }


  if (
    valor instanceof Date
  ) {

    return valor;

  }


  if (
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      valor
    )
  ) {

    const [
      anio,
      mes,
      dia
    ] =
      valor
        .split("-")
        .map(Number);


    return new Date(
      anio,
      mes - 1,
      dia
    );

  }


  const fecha =
    new Date(
      valor
    );


  return Number.isNaN(
    fecha.getTime()
  )
    ? null
    : fecha;

}


function formatearFechaEvento(
  valor
) {

  const fecha =
    crearFechaEvento(
      valor
    );


  if (!fecha) {

    return "Sin fecha definida";

  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric"
    }
  ).format(
    fecha
  );

}


function formatearFechaHoraEvento(
  valor
) {

  const fecha =
    crearFechaEvento(
      valor
    );


  if (!fecha) {

    return "Sin fecha disponible";

  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit"
    }
  ).format(
    fecha
  );

}


function normalizarFechaInputEvento(
  valor
) {

  const fecha =
    crearFechaEvento(
      valor
    );


  if (!fecha) {

    return "";

  }


  const anio =
    fecha.getFullYear();


  const mes =
    String(
      fecha.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const dia =
    String(
      fecha.getDate()
    ).padStart(
      2,
      "0"
    );


  return `${anio}-${mes}-${dia}`;

}


/* =========================================================
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTextoEvento(
  valor
) {

  if (
    valor === null ||
    valor === undefined
  ) {

    return "";

  }


  return String(
    valor
  ).trim();

}


function normalizarTextoEvento(
  valor
) {

  return obtenerTextoEvento(
    valor
  )
    .toLocaleLowerCase(
      "es"
    )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );

}


function escaparHTMLEvento(
  valor
) {

  return obtenerTextoEvento(
    valor
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTextoEvento(
  elemento,
  valor
) {

  if (!elemento) {

    return;

  }


  elemento.textContent =
    String(
      valor
    );

}


function mostrarElementoEvento(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    false;

}


function ocultarElementoEvento(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    true;

}


/* =========================================================
   FIN DEL ARCHIVO
========================================================= */