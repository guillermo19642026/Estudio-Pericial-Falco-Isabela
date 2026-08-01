/* =========================================================
   FALCO® COMUNIDAD
   PROGRAMA — FICHA Y ADMINISTRACIÓN
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const PROGRAMA_STORAGE_KEY =
  "falcoComunidadProgramas";

const PROGRAMA_PAGINA_LISTADO =
  "./programas.html";


/* =========================================================
   CATÁLOGOS
========================================================= */

const PROGRAMA_TIPOS = {

  formacion:
    "Formación",

  acompanamiento:
    "Acompañamiento",

  prevencion:
    "Prevención",

  intervencion:
    "Intervención",

  comunitario:
    "Comunitario",

  institucional:
    "Institucional",

  otro:
    "Otro"

};


const PROGRAMA_ESTADOS = {

  preparacion: {

    etiqueta:
      "En preparación",

    clase:
      "programa-estado--preparacion"

  },

  ejecucion: {

    etiqueta:
      "En ejecución",

    clase:
      "programa-estado--ejecucion"

  },

  pausado: {

    etiqueta:
      "Pausado",

    clase:
      "programa-estado--pausado"

  },

  finalizado: {

    etiqueta:
      "Finalizado",

    clase:
      "programa-estado--finalizado"

  },

  archivado: {

    etiqueta:
      "Archivado",

    clase:
      "programa-estado--archivado"

  }

};


/* =========================================================
   CONFIGURACIÓN DE MÓDULOS
========================================================= */

const PROGRAMA_MODULOS = {

  actividad: {

    propiedad:
      "actividades",

    panel:
      "actividades",

    listadoId:
      "actividadesListado",

    vacioId:
      "actividadesVacio",

    titulo:
      "Nueva actividad",

    eyebrow:
      "Planificación",

    descripcion:
      "Registrá una actividad vinculada al programa."

  },

  participante: {

    propiedad:
      "participantes",

    panel:
      "participantes",

    listadoId:
      "participantesListado",

    vacioId:
      "participantesVacio",

    titulo:
      "Agregar participante",

    eyebrow:
      "Vinculación",

    descripcion:
      "Incorporá una persona al recorrido del programa."

  },

  institucion: {

    propiedad:
      "institucionesVinculadas",

    panel:
      "instituciones",

    listadoId:
      "institucionesListado",

    vacioId:
      "institucionesVacio",

    titulo:
      "Vincular institución",

    eyebrow:
      "Articulación institucional",

    descripcion:
      "Registrá una institución vinculada al programa."

  },

  documento: {

    propiedad:
      "documentos",

    panel:
      "documentos",

    listadoId:
      "documentosListado",

    vacioId:
      "documentosVacio",

    titulo:
      "Agregar documento",

    eyebrow:
      "Archivo institucional",

    descripcion:
      "Incorporá un documento o referencia al archivo del programa."

  },

  evento: {

    propiedad:
      "agenda",

    panel:
      "agenda",

    listadoId:
      "agendaListado",

    vacioId:
      "agendaVacio",

    titulo:
      "Nuevo evento",

    eyebrow:
      "Organización temporal",

    descripcion:
      "Registrá una fecha o actividad en la agenda del programa."

  },

  seguimiento: {

    propiedad:
      "seguimientos",

    panel:
      "seguimiento",

    listadoId:
      "seguimientoListado",

    vacioId:
      "seguimientoVacio",

    titulo:
      "Nueva anotación",

    eyebrow:
      "Seguimiento institucional",

    descripcion:
      "Documentá una actualización técnica o administrativa."

  }

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const programaState = {

  programaId:
    null,

  programa:
    null,

  programas:
    [],

  tabActual:
    "resumen",

  tipoElementoActual:
    null,

  accionConfirmacion:
    null,

  elementoPendiente:
    null,

  temporizadorNotificacion:
    null,

  cargando:
    false

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const programaElementos = {

  loader:
    document.getElementById(
      "programaLoader"
    ),

  noEncontrado:
    document.getElementById(
      "programaNoEncontrado"
    ),

  contenido:
    document.getElementById(
      "programaContenido"
    ),


  /* -------------------------------------------------------
     CABECERA
  ------------------------------------------------------- */

  tipo:
    document.getElementById(
      "programaTipo"
    ),

  estado:
    document.getElementById(
      "programaEstado"
    ),

  nombre:
    document.getElementById(
      "programaNombre"
    ),

  descripcion:
    document.getElementById(
      "programaDescripcion"
    ),

  referencia:
    document.getElementById(
      "programaReferencia"
    ),

  responsable:
    document.getElementById(
      "programaResponsable"
    ),

  institucion:
    document.getElementById(
      "programaInstitucion"
    ),

  modalidad:
    document.getElementById(
      "programaModalidad"
    ),

  alcance:
    document.getElementById(
      "programaAlcance"
    ),


  /* -------------------------------------------------------
     INDICADORES
  ------------------------------------------------------- */

  indicadorActividades:
    document.getElementById(
      "indicadorActividades"
    ),

  indicadorParticipantes:
    document.getElementById(
      "indicadorParticipantes"
    ),

  indicadorInstituciones:
    document.getElementById(
      "indicadorInstituciones"
    ),

  indicadorDocumentos:
    document.getElementById(
      "indicadorDocumentos"
    ),


  /* -------------------------------------------------------
     NAVEGACIÓN
  ------------------------------------------------------- */

  tabs:
    Array.from(
      document.querySelectorAll(
        "[data-programa-tab]"
      )
    ),

  paneles:
    Array.from(
      document.querySelectorAll(
        "[data-programa-panel]"
      )
    ),


  /* -------------------------------------------------------
     RESUMEN
  ------------------------------------------------------- */

  resumenTipo:
    document.getElementById(
      "resumenTipo"
    ),

  resumenEstado:
    document.getElementById(
      "resumenEstado"
    ),

  resumenResponsable:
    document.getElementById(
      "resumenResponsable"
    ),

  resumenInstitucion:
    document.getElementById(
      "resumenInstitucion"
    ),

  resumenModalidad:
    document.getElementById(
      "resumenModalidad"
    ),

  resumenAlcance:
    document.getElementById(
      "resumenAlcance"
    ),

  resumenFechaInicio:
    document.getElementById(
      "resumenFechaInicio"
    ),

  resumenFechaFinalizacion:
    document.getElementById(
      "resumenFechaFinalizacion"
    ),

  resumenDescripcion:
    document.getElementById(
      "resumenDescripcion"
    ),

  resumenObjetivoGeneral:
    document.getElementById(
      "resumenObjetivoGeneral"
    ),

  resumenDestinatarios:
    document.getElementById(
      "resumenDestinatarios"
    ),

  resumenObservaciones:
    document.getElementById(
      "resumenObservaciones"
    ),


  /* -------------------------------------------------------
     AVANCE E HISTORIAL
  ------------------------------------------------------- */

  porcentajeAvance:
    document.getElementById(
      "programaPorcentajeAvance"
    ),

  barraAvance:
    document.getElementById(
      "programaBarraAvance"
    ),

  mensajeAvance:
    document.getElementById(
      "programaMensajeAvance"
    ),

  checklist:
    Array.from(
      document.querySelectorAll(
        "[data-checklist]"
      )
    ),

  actividadReciente:
    document.getElementById(
      "programaActividadReciente"
    ),

  fechaCreacion:
    document.getElementById(
      "programaFechaCreacion"
    ),


  /* -------------------------------------------------------
     BOTONES PRINCIPALES
  ------------------------------------------------------- */

  botonEditarPrograma:
    document.getElementById(
      "botonEditarPrograma"
    ),

  botonEditarResumen:
    document.getElementById(
      "botonEditarResumen"
    ),

  botonCambiarEstado:
    document.getElementById(
      "botonCambiarEstado"
    ),

  botonArchivar:
    document.getElementById(
      "botonArchivarPrograma"
    ),

  botonEliminar:
    document.getElementById(
      "botonEliminarPrograma"
    ),

  botonNuevaActividad:
    document.getElementById(
      "botonNuevaActividad"
    ),

  botonNuevoParticipante:
    document.getElementById(
      "botonNuevoParticipante"
    ),

  botonNuevaInstitucion:
    document.getElementById(
      "botonNuevaInstitucion"
    ),

  botonNuevoDocumento:
    document.getElementById(
      "botonNuevoDocumento"
    ),

  botonNuevoEvento:
    document.getElementById(
      "botonNuevoEvento"
    ),

  botonNuevoSeguimiento:
    document.getElementById(
      "botonNuevoSeguimiento"
    ),

  botonesCrearModulo:
    Array.from(
      document.querySelectorAll(
        "[data-crear-modulo]"
      )
    ),


  /* -------------------------------------------------------
     MODAL EDITAR
  ------------------------------------------------------- */

  modalEditar:
    document.getElementById(
      "modalEditarPrograma"
    ),

  formularioEditar:
    document.getElementById(
      "formularioEditarPrograma"
    ),

  botonGuardarEdicion:
    document.getElementById(
      "botonGuardarEdicion"
    ),


  /* -------------------------------------------------------
     MODAL ESTADO
  ------------------------------------------------------- */

  modalEstado:
    document.getElementById(
      "modalCambiarEstado"
    ),

  formularioEstado:
    document.getElementById(
      "formularioCambiarEstado"
    ),


  /* -------------------------------------------------------
     MODAL NUEVO ELEMENTO
  ------------------------------------------------------- */

  modalElemento:
    document.getElementById(
      "modalNuevoElemento"
    ),

  formularioElemento:
    document.getElementById(
      "formularioNuevoElemento"
    ),

  elementoTipo:
    document.getElementById(
      "nuevoElementoTipo"
    ),

  elementoCampos:
    document.getElementById(
      "nuevoElementoCampos"
    ),

  elementoEyebrow:
    document.getElementById(
      "modalNuevoElementoEyebrow"
    ),

  elementoTitulo:
    document.getElementById(
      "modalNuevoElementoTitulo"
    ),

  elementoDescripcion:
    document.getElementById(
      "modalNuevoElementoDescripcion"
    ),

  botonGuardarElemento:
    document.getElementById(
      "botonGuardarNuevoElemento"
    ),


  /* -------------------------------------------------------
     MODAL CONFIRMACIÓN
  ------------------------------------------------------- */

  modalConfirmacion:
    document.getElementById(
      "modalConfirmacionPrograma"
    ),

  confirmacionTitulo:
    document.getElementById(
      "modalConfirmacionTitulo"
    ),

  confirmacionMensaje:
    document.getElementById(
      "modalConfirmacionMensaje"
    ),

  botonCancelarConfirmacion:
    document.getElementById(
      "botonCancelarConfirmacion"
    ),

  botonAceptarConfirmacion:
    document.getElementById(
      "botonAceptarConfirmacion"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "programaNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "programaNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "programaNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "programaNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "programaNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarPrograma
);


function iniciarPrograma() {

  programaState.programaId =
    obtenerProgramaIdDesdeURL();

  registrarEventosPrograma();

  if (!programaState.programaId) {

    mostrarProgramaNoEncontrado();

    return;

  }

  cargarPrograma();

  console.info(
    "FALCO Programa Comunidad™ v1.0 Ready"
  );

}


/* =========================================================
   ID DESDE LA URL
========================================================= */

function obtenerProgramaIdDesdeURL() {

  const parametros =
    new URLSearchParams(
      window.location.search
    );

  return obtenerTextoPrograma(
    parametros.get("id")
  );

}


/* =========================================================
   EVENTOS GENERALES
========================================================= */

function registrarEventosPrograma() {

  programaElementos.tabs.forEach(
    (boton) => {

      boton.addEventListener(
        "click",
        manejarCambioTab
      );

    }
  );


  programaElementos.botonEditarPrograma
    ?.addEventListener(
      "click",
      abrirModalEditarPrograma
    );


  programaElementos.botonEditarResumen
    ?.addEventListener(
      "click",
      abrirModalEditarPrograma
    );


  programaElementos.botonCambiarEstado
    ?.addEventListener(
      "click",
      abrirModalCambiarEstado
    );


  programaElementos.botonArchivar
    ?.addEventListener(
      "click",
      solicitarArchivarPrograma
    );


  programaElementos.botonEliminar
    ?.addEventListener(
      "click",
      solicitarEliminarPrograma
    );


  programaElementos.botonNuevaActividad
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "actividad"
      )
    );


  programaElementos.botonNuevoParticipante
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "participante"
      )
    );


  programaElementos.botonNuevaInstitucion
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "institucion"
      )
    );


  programaElementos.botonNuevoDocumento
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "documento"
      )
    );


  programaElementos.botonNuevoEvento
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "evento"
      )
    );


  programaElementos.botonNuevoSeguimiento
    ?.addEventListener(
      "click",
      () => abrirModalNuevoElemento(
        "seguimiento"
      )
    );


  programaElementos.botonesCrearModulo
    .forEach((boton) => {

      boton.addEventListener(
        "click",
        () => {

          const tipo =
            boton.dataset.crearModulo;

          abrirModalNuevoElemento(
            tipo
          );

        }
      );

    });


  programaElementos.formularioEditar
    ?.addEventListener(
      "submit",
      guardarEdicionPrograma
    );


  programaElementos.formularioEditar
    ?.addEventListener(
      "input",
      manejarCambioCampoEdicion
    );


  programaElementos.formularioEstado
    ?.addEventListener(
      "submit",
      guardarCambioEstado
    );


  programaElementos.formularioElemento
    ?.addEventListener(
      "submit",
      guardarNuevoElemento
    );


  programaElementos.botonCancelarConfirmacion
    ?.addEventListener(
      "click",
      cerrarModalConfirmacion
    );


  programaElementos.botonAceptarConfirmacion
    ?.addEventListener(
      "click",
      ejecutarAccionConfirmada
    );


  programaElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionPrograma
    );


  document
    .querySelectorAll(
      "[data-cerrar-modal]"
    )
    .forEach((elemento) => {

      elemento.addEventListener(
        "click",
        manejarCierreModal
      );

    });


  document.addEventListener(
    "click",
    manejarAccionesElementos
  );


  document.addEventListener(
    "keydown",
    manejarTecladoPrograma
  );


  window.addEventListener(
    "storage",
    manejarCambioProgramasStorage
  );

}


/* =========================================================
   CARGA DEL PROGRAMA
========================================================= */

function cargarPrograma() {

  mostrarLoaderPrograma();

  try {

    const contenido =
      localStorage.getItem(
        PROGRAMA_STORAGE_KEY
      );

    const datos =
      contenido
        ? JSON.parse(contenido)
        : [];

    programaState.programas =
      Array.isArray(datos)
        ? datos
        : [];

    const programaEncontrado =
      programaState.programas.find(
        (programa) =>
          obtenerTextoPrograma(
            programa.id
          ) ===
          programaState.programaId
      );

    if (!programaEncontrado) {

      mostrarProgramaNoEncontrado();

      return;

    }

    programaState.programa =
      normalizarProgramaDetalle(
        programaEncontrado
      );

    renderizarProgramaCompleto();

    mostrarContenidoPrograma();

  } catch (error) {

    console.error(
      "No fue posible cargar el programa:",
      error
    );

    mostrarProgramaNoEncontrado();

  }

}


/* =========================================================
   NORMALIZACIÓN DEL PROGRAMA
========================================================= */

function normalizarProgramaDetalle(
  programa
) {

  const fechaCreacion =
    programa.fechaCreacion ||
    programa.creadoEn ||
    programa.createdAt ||
    new Date().toISOString();

  const fechaActualizacion =
    programa.fechaActualizacion ||
    programa.actualizadoEn ||
    programa.updatedAt ||
    fechaCreacion;

  return {

    ...programa,

    id:
      obtenerTextoPrograma(
        programa.id
      ),

    referencia:
      obtenerTextoPrograma(
        programa.referencia
      ) ||
      generarReferenciaProgramaDetalle(),

    nombre:
      obtenerTextoPrograma(
        programa.nombre ||
        programa.titulo
      ) ||
      "Programa sin nombre",

    tipo:
      normalizarTipoProgramaDetalle(
        programa.tipo
      ),

    estado:
      normalizarEstadoProgramaDetalle(
        programa.estado
      ),

    descripcion:
      obtenerTextoPrograma(
        programa.descripcion
      ),

    responsable:
      obtenerTextoPrograma(
        programa.responsable
      ) ||
      "Sin responsable asignado",

    institucion:
      obtenerTextoPrograma(
        programa.institucion
      ) ||
      "Sin institución asociada",

    modalidad:
      obtenerTextoPrograma(
        programa.modalidad
      ) ||
      "Sin definir",

    alcance:
      obtenerTextoPrograma(
        programa.alcance
      ) ||
      "Sin definir",

    fechaInicio:
      obtenerTextoPrograma(
        programa.fechaInicio
      ),

    fechaFinalizacion:
      obtenerTextoPrograma(
        programa.fechaFinalizacion
      ),

    objetivoGeneral:
      obtenerTextoPrograma(
        programa.objetivoGeneral
      ),

    destinatarios:
      obtenerTextoPrograma(
        programa.destinatarios
      ),

    observaciones:
      obtenerTextoPrograma(
        programa.observaciones
      ),

    actividades:
      normalizarColeccionPrograma(
        programa.actividades
      ),

    participantes:
      normalizarColeccionPrograma(
        programa.participantes
      ),

    institucionesVinculadas:
      normalizarColeccionPrograma(
        programa.institucionesVinculadas
      ),

    documentos:
      normalizarColeccionPrograma(
        programa.documentos
      ),

    agenda:
      normalizarColeccionPrograma(
        programa.agenda
      ),

    seguimientos:
      normalizarColeccionPrograma(
        programa.seguimientos
      ),

    historial:
      normalizarColeccionPrograma(
        programa.historial
      ),

    fechaCreacion,

    fechaActualizacion

  };

}


function normalizarColeccionPrograma(
  coleccion
) {

  return Array.isArray(coleccion)
    ? coleccion
    : [];

}


function normalizarTipoProgramaDetalle(
  valor
) {

  const tipo =
    normalizarTextoPrograma(
      valor
    );

  const equivalencias = {

    formacion:
      "formacion",

    capacitacion:
      "formacion",

    acompanamiento:
      "acompanamiento",

    prevencion:
      "prevencion",

    intervencion:
      "intervencion",

    comunitario:
      "comunitario",

    comunitaria:
      "comunitario",

    institucional:
      "institucional",

    otro:
      "otro"

  };

  return equivalencias[tipo] ||
    "otro";

}


function normalizarEstadoProgramaDetalle(
  valor
) {

  const estado =
    normalizarTextoPrograma(
      valor
    );

  const equivalencias = {

    preparacion:
      "preparacion",

    "en preparacion":
      "preparacion",

    borrador:
      "preparacion",

    ejecucion:
      "ejecucion",

    "en ejecucion":
      "ejecucion",

    activo:
      "ejecucion",

    activa:
      "ejecucion",

    pausado:
      "pausado",

    pausada:
      "pausado",

    suspendido:
      "pausado",

    finalizado:
      "finalizado",

    finalizada:
      "finalizado",

    completado:
      "finalizado",

    archivado:
      "archivado",

    archivada:
      "archivado"

  };

  return equivalencias[estado] ||
    "preparacion";

}


/* =========================================================
   RENDERIZADO GENERAL
========================================================= */

function renderizarProgramaCompleto() {

  if (!programaState.programa) {

    return;

  }

  actualizarTituloDocumento();

  renderizarCabeceraPrograma();

  renderizarIndicadoresPrograma();

  renderizarResumenPrograma();

  renderizarAvancePrograma();

  renderizarHistorialPrograma();

  renderizarTodosLosModulos();

  cambiarTabPrograma(
    programaState.tabActual
  );

}


/* =========================================================
   TÍTULO DEL DOCUMENTO
========================================================= */

function actualizarTituloDocumento() {

  document.title =
    `${programaState.programa.nombre} | FALCO® Comunidad`;

}


/* =========================================================
   CABECERA
========================================================= */

function renderizarCabeceraPrograma() {

  const programa =
    programaState.programa;

  const tipo =
    PROGRAMA_TIPOS[
      programa.tipo
    ] ||
    PROGRAMA_TIPOS.otro;

  const estado =
    PROGRAMA_ESTADOS[
      programa.estado
    ] ||
    PROGRAMA_ESTADOS.preparacion;


  establecerTextoPrograma(
    programaElementos.tipo,
    tipo
  );


  establecerTextoPrograma(
    programaElementos.nombre,
    programa.nombre
  );


  establecerTextoPrograma(
    programaElementos.descripcion,
    programa.descripcion ||
    "Sin descripción general registrada."
  );


  establecerTextoPrograma(
    programaElementos.referencia,
    programa.referencia
  );


  establecerTextoPrograma(
    programaElementos.responsable,
    programa.responsable
  );


  establecerTextoPrograma(
    programaElementos.institucion,
    programa.institucion
  );


  establecerTextoPrograma(
    programaElementos.modalidad,
    programa.modalidad
  );


  establecerTextoPrograma(
    programaElementos.alcance,
    programa.alcance
  );


  if (
    programaElementos.estado
  ) {

    programaElementos.estado.className =
      `programa-estado ${estado.clase}`;

    programaElementos.estado.textContent =
      estado.etiqueta;

  }

}


/* =========================================================
   INDICADORES
========================================================= */

function renderizarIndicadoresPrograma() {

  const programa =
    programaState.programa;


  establecerTextoPrograma(
    programaElementos.indicadorActividades,
    programa.actividades.length
  );


  establecerTextoPrograma(
    programaElementos.indicadorParticipantes,
    programa.participantes.length
  );


  establecerTextoPrograma(
    programaElementos.indicadorInstituciones,
    programa.institucionesVinculadas.length
  );


  establecerTextoPrograma(
    programaElementos.indicadorDocumentos,
    programa.documentos.length
  );

}


/* =========================================================
   RESUMEN
========================================================= */

function renderizarResumenPrograma() {

  const programa =
    programaState.programa;

  const tipo =
    PROGRAMA_TIPOS[
      programa.tipo
    ] ||
    PROGRAMA_TIPOS.otro;

  const estado =
    PROGRAMA_ESTADOS[
      programa.estado
    ] ||
    PROGRAMA_ESTADOS.preparacion;


  establecerTextoPrograma(
    programaElementos.resumenTipo,
    tipo
  );


  establecerTextoPrograma(
    programaElementos.resumenEstado,
    estado.etiqueta
  );


  establecerTextoPrograma(
    programaElementos.resumenResponsable,
    programa.responsable
  );


  establecerTextoPrograma(
    programaElementos.resumenInstitucion,
    programa.institucion
  );


  establecerTextoPrograma(
    programaElementos.resumenModalidad,
    programa.modalidad
  );


  establecerTextoPrograma(
    programaElementos.resumenAlcance,
    programa.alcance
  );


  establecerTextoPrograma(
    programaElementos.resumenFechaInicio,
    formatearFechaPrograma(
      programa.fechaInicio
    )
  );


  establecerTextoPrograma(
    programaElementos.resumenFechaFinalizacion,
    formatearFechaPrograma(
      programa.fechaFinalizacion
    )
  );


  establecerTextoPrograma(
    programaElementos.resumenDescripcion,
    programa.descripcion ||
    "Sin descripción registrada."
  );


  establecerTextoPrograma(
    programaElementos.resumenObjetivoGeneral,
    programa.objetivoGeneral ||
    "Sin objetivo general registrado."
  );


  establecerTextoPrograma(
    programaElementos.resumenDestinatarios,
    programa.destinatarios ||
    "Sin población destinataria registrada."
  );


  establecerTextoPrograma(
    programaElementos.resumenObservaciones,
    programa.observaciones ||
    "Sin observaciones administrativas."
  );

}


/* =========================================================
   NAVEGACIÓN POR PESTAÑAS
========================================================= */

function manejarCambioTab(
  evento
) {

  const tab =
    evento.currentTarget.dataset
      .programaTab;

  cambiarTabPrograma(
    tab
  );

}


function cambiarTabPrograma(
  tab
) {

  const existeTab =
    programaElementos.paneles
      .some(
        (panel) =>
          panel.dataset.programaPanel ===
          tab
      );

  if (!existeTab) {

    tab =
      "resumen";

  }

  programaState.tabActual =
    tab;


  programaElementos.tabs.forEach(
    (boton) => {

      const activo =
        boton.dataset.programaTab ===
        tab;

      boton.classList.toggle(
        "programa-navegacion__boton--activo",
        activo
      );

      boton.setAttribute(
        "aria-selected",
        String(activo)
      );

    }
  );


  programaElementos.paneles.forEach(
    (panel) => {

      panel.hidden =
        panel.dataset.programaPanel !==
        tab;

    }
  );

}

/* =========================================================
   AVANCE GENERAL
========================================================= */

function renderizarAvancePrograma() {

  const programa =
    programaState.programa;

  const criterios = {

    identidad:
      Boolean(
        programa.nombre &&
        programa.descripcion &&
        programa.responsable &&
        programa.objetivoGeneral
      ),

    actividades:
      programa.actividades.length > 0,

    participantes:
      programa.participantes.length > 0,

    instituciones:
      programa.institucionesVinculadas.length > 0

  };


  const cantidadCompletos =
    Object.values(
      criterios
    ).filter(Boolean).length;


  const totalCriterios =
    Object.keys(
      criterios
    ).length;


  const porcentaje =
    Math.round(
      (
        cantidadCompletos /
        totalCriterios
      ) * 100
    );


  establecerTextoPrograma(
    programaElementos.porcentajeAvance,
    `${porcentaje}%`
  );


  if (
    programaElementos.barraAvance
  ) {

    programaElementos.barraAvance.style.width =
      `${porcentaje}%`;

  }


  establecerTextoPrograma(
    programaElementos.mensajeAvance,
    obtenerMensajeAvancePrograma(
      porcentaje
    )
  );


  programaElementos.checklist
    .forEach((elemento) => {

      const criterio =
        elemento.dataset.checklist;

      elemento.classList.toggle(
        "programa-checklist__item--completo",
        Boolean(
          criterios[criterio]
        )
      );

    });

}


function obtenerMensajeAvancePrograma(
  porcentaje
) {

  if (
    porcentaje === 100
  ) {

    return "La estructura inicial del programa está completa.";

  }


  if (
    porcentaje >= 75
  ) {

    return "El programa presenta un nivel avanzado de organización.";

  }


  if (
    porcentaje >= 50
  ) {

    return "La organización del programa se encuentra en desarrollo.";

  }


  if (
    porcentaje >= 25
  ) {

    return "El programa cuenta con información inicial y módulos pendientes.";

  }


  return "Completá los módulos del programa para avanzar en su organización.";

}


/* =========================================================
   HISTORIAL
========================================================= */

function renderizarHistorialPrograma() {

  if (
    !programaElementos.actividadReciente
  ) {

    return;

  }


  const programa =
    programaState.programa;


  const historial = [

    {

      id:
        "registro-inicial",

      titulo:
        "Programa registrado",

      detalle:
        "Creación del registro institucional.",

      fecha:
        programa.fechaCreacion

    },

    ...programa.historial

  ];


  historial.sort(
    ordenarHistorialPrograma
  );


  programaElementos.actividadReciente
    .innerHTML =
      historial
        .slice(0, 8)
        .map(
          crearHistorialHTML
        )
        .join("");


  establecerTextoPrograma(
    programaElementos.fechaCreacion,
    formatearFechaHoraPrograma(
      programa.fechaCreacion
    )
  );

}


function crearHistorialHTML(
  item
) {

  const titulo =
    obtenerTextoPrograma(
      item.titulo ||
      item.accion
    ) ||
    "Actualización del programa";


  const detalle =
    obtenerTextoPrograma(
      item.detalle ||
      item.descripcion
    );


  const fecha =
    item.fecha ||
    item.fechaCreacion ||
    item.createdAt;


  return `
    <div class="programa-historial__item">

      <span
        class="programa-historial__marca"
        aria-hidden="true"
      ></span>

      <div>

        <strong>
          ${escaparHTMLPrograma(titulo)}
        </strong>

        <span>
          ${escaparHTMLPrograma(
            formatearFechaHoraPrograma(
              fecha
            )
          )}
        </span>

        ${
          detalle
            ? `
              <span class="programa-historial__detalle">
                ${escaparHTMLPrograma(detalle)}
              </span>
            `
            : ""
        }

      </div>

    </div>
  `;

}


function ordenarHistorialPrograma(
  itemA,
  itemB
) {

  const fechaA =
    new Date(
      itemA.fecha ||
      itemA.fechaCreacion ||
      0
    ).getTime();


  const fechaB =
    new Date(
      itemB.fecha ||
      itemB.fechaCreacion ||
      0
    ).getTime();


  return fechaB - fechaA;

}


/* =========================================================
   RENDERIZADO DE TODOS LOS MÓDULOS
========================================================= */

function renderizarTodosLosModulos() {

  renderizarActividadesPrograma();

  renderizarParticipantesPrograma();

  renderizarInstitucionesPrograma();

  renderizarDocumentosPrograma();

  renderizarAgendaPrograma();

  renderizarSeguimientosPrograma();

}


/* =========================================================
   ACTIVIDADES
========================================================= */

function renderizarActividadesPrograma() {

  const actividades =
    programaState.programa
      .actividades
      .slice()
      .sort(
        ordenarPorFechaPrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      actividades,

    listadoId:
      "actividadesListado",

    vacioId:
      "actividadesVacio",

    creador:
      crearActividadHTML

  });

}


function crearActividadHTML(
  actividad
) {

  const id =
    obtenerTextoPrograma(
      actividad.id
    );


  const titulo =
    obtenerTextoPrograma(
      actividad.titulo ||
      actividad.nombre
    ) ||
    "Actividad sin título";


  const descripcion =
    obtenerTextoPrograma(
      actividad.descripcion
    );


  const fecha =
    formatearFechaPrograma(
      actividad.fecha
    );


  const modalidad =
    obtenerTextoPrograma(
      actividad.modalidad
    ) ||
    "Sin modalidad";


  const estado =
    normalizarEstadoActividad(
      actividad.estado
    );


  return `
    <article
      class="programa-tarjeta programa-actividad"
      data-elemento-tipo="actividad"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <div class="programa-tarjeta__cabecera">

        <div class="programa-tarjeta__identidad">

          <span
            class="programa-tarjeta__icono"
            aria-hidden="true"
          >
            ◇
          </span>

          <div class="programa-tarjeta__textos">

            <p class="programa-tarjeta__eyebrow">
              Actividad
            </p>

            <h3 class="programa-tarjeta__titulo">
              ${escaparHTMLPrograma(titulo)}
            </h3>

          </div>

        </div>


        <span
          class="programa-actividad__estado programa-actividad__estado--${escaparAtributoPrograma(estado.clave)}"
        >
          ${escaparHTMLPrograma(estado.etiqueta)}
        </span>

      </div>


      ${
        descripcion
          ? `
            <p class="programa-tarjeta__descripcion">
              ${escaparHTMLPrograma(descripcion)}
            </p>
          `
          : ""
      }


      <div class="programa-tarjeta__meta">

        <span class="programa-tarjeta__meta-item">
          ${escaparHTMLPrograma(fecha)}
        </span>

        <span class="programa-tarjeta__meta-item">
          ${escaparHTMLPrograma(modalidad)}
        </span>

      </div>


      ${crearAccionesElementoHTML(
        "actividad",
        id
      )}

    </article>
  `;

}


function normalizarEstadoActividad(
  valor
) {

  const estado =
    normalizarTextoPrograma(
      valor
    );


  const estados = {

    pendiente: {
      clave:
        "pendiente",
      etiqueta:
        "Pendiente"
    },

    confirmada: {
      clave:
        "confirmada",
      etiqueta:
        "Confirmada"
    },

    realizada: {
      clave:
        "realizada",
      etiqueta:
        "Realizada"
    },

    cancelada: {
      clave:
        "cancelada",
      etiqueta:
        "Cancelada"
    }

  };


  return estados[estado] ||
    estados.pendiente;

}


/* =========================================================
   PARTICIPANTES
========================================================= */

function renderizarParticipantesPrograma() {

  const participantes =
    programaState.programa
      .participantes
      .slice()
      .sort(
        ordenarPorNombrePrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      participantes,

    listadoId:
      "participantesListado",

    vacioId:
      "participantesVacio",

    creador:
      crearParticipanteHTML

  });

}


function crearParticipanteHTML(
  participante
) {

  const id =
    obtenerTextoPrograma(
      participante.id
    );


  const nombre =
    obtenerTextoPrograma(
      participante.nombreCompleto ||
      participante.nombre
    ) ||
    "Participante sin nombre";


  const rol =
    obtenerTextoPrograma(
      participante.rol ||
      participante.tipo
    ) ||
    "Participante";


  const correo =
    obtenerTextoPrograma(
      participante.correo ||
      participante.email
    );


  const telefono =
    obtenerTextoPrograma(
      participante.telefono
    );


  const iniciales =
    obtenerInicialesPrograma(
      nombre
    );


  return `
    <article
      class="programa-tarjeta"
      data-elemento-tipo="participante"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <div class="programa-tarjeta__cabecera">

        <div class="programa-tarjeta__identidad">

          <span
            class="programa-participante__avatar"
            aria-hidden="true"
          >
            ${escaparHTMLPrograma(iniciales)}
          </span>

          <div class="programa-tarjeta__textos">

            <p class="programa-tarjeta__eyebrow">
              ${escaparHTMLPrograma(rol)}
            </p>

            <h3 class="programa-tarjeta__titulo">
              ${escaparHTMLPrograma(nombre)}
            </h3>

          </div>

        </div>


        <span class="programa-participante__estado">
          Vinculado
        </span>

      </div>


      <div class="programa-tarjeta__meta">

        ${
          correo
            ? `
              <span class="programa-tarjeta__meta-item">
                ${escaparHTMLPrograma(correo)}
              </span>
            `
            : ""
        }

        ${
          telefono
            ? `
              <span class="programa-tarjeta__meta-item">
                ${escaparHTMLPrograma(telefono)}
              </span>
            `
            : ""
        }

      </div>


      ${crearAccionesElementoHTML(
        "participante",
        id
      )}

    </article>
  `;

}


/* =========================================================
   INSTITUCIONES
========================================================= */

function renderizarInstitucionesPrograma() {

  const instituciones =
    programaState.programa
      .institucionesVinculadas
      .slice()
      .sort(
        ordenarPorNombrePrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      instituciones,

    listadoId:
      "institucionesListado",

    vacioId:
      "institucionesVacio",

    creador:
      crearInstitucionHTML

  });

}


function crearInstitucionHTML(
  institucion
) {

  const id =
    obtenerTextoPrograma(
      institucion.id
    );


  const nombre =
    obtenerTextoPrograma(
      institucion.nombre
    ) ||
    "Institución sin nombre";


  const rol =
    obtenerTextoPrograma(
      institucion.rol ||
      institucion.vinculacion
    ) ||
    "Institución vinculada";


  const referente =
    obtenerTextoPrograma(
      institucion.referente
    );


  const contacto =
    obtenerTextoPrograma(
      institucion.contacto ||
      institucion.correo ||
      institucion.telefono
    );


  return `
    <article
      class="programa-tarjeta"
      data-elemento-tipo="institucion"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <div class="programa-tarjeta__cabecera">

        <div class="programa-tarjeta__identidad">

          <span
            class="programa-tarjeta__icono"
            aria-hidden="true"
          >
            ▣
          </span>

          <div class="programa-tarjeta__textos">

            <p class="programa-tarjeta__eyebrow">
              Institución
            </p>

            <h3 class="programa-tarjeta__titulo">
              ${escaparHTMLPrograma(nombre)}
            </h3>

          </div>

        </div>


        <span class="programa-institucion__rol">
          ${escaparHTMLPrograma(rol)}
        </span>

      </div>


      ${
        referente
          ? `
            <p class="programa-tarjeta__descripcion">
              Referente: ${escaparHTMLPrograma(referente)}
            </p>
          `
          : ""
      }


      ${
        contacto
          ? `
            <div class="programa-institucion__contacto">
              ${escaparHTMLPrograma(contacto)}
            </div>
          `
          : ""
      }


      ${crearAccionesElementoHTML(
        "institucion",
        id
      )}

    </article>
  `;

}


/* =========================================================
   DOCUMENTOS
========================================================= */

function renderizarDocumentosPrograma() {

  const documentos =
    programaState.programa
      .documentos
      .slice()
      .sort(
        ordenarPorFechaPrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      documentos,

    listadoId:
      "documentosListado",

    vacioId:
      "documentosVacio",

    creador:
      crearDocumentoHTML

  });

}


function crearDocumentoHTML(
  documento
) {

  const id =
    obtenerTextoPrograma(
      documento.id
    );


  const titulo =
    obtenerTextoPrograma(
      documento.titulo ||
      documento.nombre
    ) ||
    "Documento sin título";


  const tipo =
    obtenerTextoPrograma(
      documento.tipo
    ) ||
    "Archivo";


  const descripcion =
    obtenerTextoPrograma(
      documento.descripcion
    );


  const enlace =
    obtenerTextoPrograma(
      documento.enlace ||
      documento.url
    );


  const fecha =
    formatearFechaPrograma(
      documento.fecha
    );


  return `
    <article
      class="programa-tarjeta programa-documento"
      data-elemento-tipo="documento"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <div class="programa-tarjeta__cabecera">

        <div class="programa-tarjeta__identidad">

          <span
            class="programa-tarjeta__icono"
            aria-hidden="true"
          >
            □
          </span>

          <div class="programa-tarjeta__textos">

            <p class="programa-tarjeta__eyebrow">
              Documento
            </p>

            <h3 class="programa-tarjeta__titulo">
              ${escaparHTMLPrograma(titulo)}
            </h3>

          </div>

        </div>


        <span class="programa-documento__tipo">
          ${escaparHTMLPrograma(tipo)}
        </span>

      </div>


      ${
        descripcion
          ? `
            <p class="programa-tarjeta__descripcion">
              ${escaparHTMLPrograma(descripcion)}
            </p>
          `
          : ""
      }


      <div class="programa-tarjeta__meta">

        <span class="programa-tarjeta__meta-item">
          ${escaparHTMLPrograma(fecha)}
        </span>

      </div>


      ${
        enlace
          ? `
            <p class="programa-tarjeta__descripcion">

              <a
                class="programa-documento__enlace"
                href="${escaparAtributoPrograma(enlace)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir documento
              </a>

            </p>
          `
          : ""
      }


      ${crearAccionesElementoHTML(
        "documento",
        id
      )}

    </article>
  `;

}


/* =========================================================
   AGENDA
========================================================= */

function renderizarAgendaPrograma() {

  const agenda =
    programaState.programa
      .agenda
      .slice()
      .sort(
        ordenarPorFechaAscendentePrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      agenda,

    listadoId:
      "agendaListado",

    vacioId:
      "agendaVacio",

    creador:
      crearEventoHTML

  });

}


function crearEventoHTML(
  evento
) {

  const id =
    obtenerTextoPrograma(
      evento.id
    );


  const titulo =
    obtenerTextoPrograma(
      evento.titulo ||
      evento.nombre
    ) ||
    "Evento sin título";


  const descripcion =
    obtenerTextoPrograma(
      evento.descripcion
    );


  const fecha =
    crearFechaPrograma(
      evento.fecha
    );


  const dia =
    fecha
      ? String(
          fecha.getDate()
        ).padStart(2, "0")
      : "--";


  const mes =
    fecha
      ? new Intl.DateTimeFormat(
          "es-AR",
          {
            month: "short"
          }
        )
          .format(fecha)
          .replace(".", "")
      : "---";


  const hora =
    obtenerTextoPrograma(
      evento.hora
    ) ||
    "Sin horario";


  const modalidad =
    obtenerTextoPrograma(
      evento.modalidad
    ) ||
    "Sin modalidad";


  return `
    <article
      class="programa-tarjeta"
      data-elemento-tipo="evento"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <div class="programa-tarjeta__cabecera">

        <div class="programa-tarjeta__identidad">

          <div
            class="programa-evento__fecha"
            aria-hidden="true"
          >

            <strong>
              ${escaparHTMLPrograma(dia)}
            </strong>

            <span>
              ${escaparHTMLPrograma(mes)}
            </span>

          </div>

          <div class="programa-tarjeta__textos">

            <p class="programa-tarjeta__eyebrow">
              Agenda
            </p>

            <h3 class="programa-tarjeta__titulo">
              ${escaparHTMLPrograma(titulo)}
            </h3>

            <span class="programa-evento__hora">
              ${escaparHTMLPrograma(hora)}
            </span>

          </div>

        </div>

      </div>


      ${
        descripcion
          ? `
            <p class="programa-tarjeta__descripcion">
              ${escaparHTMLPrograma(descripcion)}
            </p>
          `
          : ""
      }


      <div class="programa-tarjeta__meta">

        <span class="programa-tarjeta__meta-item">
          ${escaparHTMLPrograma(modalidad)}
        </span>

      </div>


      ${crearAccionesElementoHTML(
        "evento",
        id
      )}

    </article>
  `;

}


/* =========================================================
   SEGUIMIENTOS
========================================================= */

function renderizarSeguimientosPrograma() {

  const seguimientos =
    programaState.programa
      .seguimientos
      .slice()
      .sort(
        ordenarPorFechaPrograma
      );


  renderizarColeccionPrograma({

    coleccion:
      seguimientos,

    listadoId:
      "seguimientoListado",

    vacioId:
      "seguimientoVacio",

    creador:
      crearSeguimientoHTML

  });

}


function crearSeguimientoHTML(
  seguimiento
) {

  const id =
    obtenerTextoPrograma(
      seguimiento.id
    );


  const titulo =
    obtenerTextoPrograma(
      seguimiento.titulo
    ) ||
    "Actualización del programa";


  const descripcion =
    obtenerTextoPrograma(
      seguimiento.descripcion ||
      seguimiento.detalle
    );


  const autor =
    obtenerTextoPrograma(
      seguimiento.autor ||
      seguimiento.responsable
    ) ||
    "Administración FALCO®";


  const fecha =
    formatearFechaHoraPrograma(
      seguimiento.fecha ||
      seguimiento.fechaCreacion
    );


  return `
    <article
      class="programa-tarjeta programa-seguimiento"
      data-elemento-tipo="seguimiento"
      data-elemento-id="${escaparAtributoPrograma(id)}"
    >

      <span class="programa-seguimiento__fecha">
        ${escaparHTMLPrograma(fecha)}
      </span>

      <p class="programa-tarjeta__eyebrow">
        ${escaparHTMLPrograma(autor)}
      </p>

      <h3 class="programa-tarjeta__titulo">
        ${escaparHTMLPrograma(titulo)}
      </h3>

      ${
        descripcion
          ? `
            <p class="programa-tarjeta__descripcion">
              ${escaparHTMLPrograma(descripcion)}
            </p>
          `
          : ""
      }


      ${crearAccionesElementoHTML(
        "seguimiento",
        id
      )}

    </article>
  `;

}


/* =========================================================
   RENDERIZADO GENÉRICO DE COLECCIONES
========================================================= */

function renderizarColeccionPrograma({
  coleccion,
  listadoId,
  vacioId,
  creador
}) {

  const listado =
    document.getElementById(
      listadoId
    );


  const vacio =
    document.getElementById(
      vacioId
    );


  if (!listado) {

    return;

  }


  listado.innerHTML =
    coleccion
      .map(creador)
      .join("");


  const hayElementos =
    coleccion.length > 0;


  listado.hidden =
    !hayElementos;


  if (vacio) {

    vacio.hidden =
      hayElementos;

  }

}


/* =========================================================
   ACCIONES DE LAS TARJETAS
========================================================= */

function crearAccionesElementoHTML(
  tipo,
  id
) {

  return `
    <div class="programa-tarjeta__acciones">

      <button
        type="button"
        class="programa-tarjeta__boton"
        data-editar-elemento="${escaparAtributoPrograma(tipo)}"
        data-elemento-id="${escaparAtributoPrograma(id)}"
      >
        Editar
      </button>

      <button
        type="button"
        class="programa-tarjeta__boton programa-tarjeta__boton--eliminar"
        data-eliminar-elemento="${escaparAtributoPrograma(tipo)}"
        data-elemento-id="${escaparAtributoPrograma(id)}"
      >
        Eliminar
      </button>

    </div>
  `;

}


 /* =========================================================
   MODAL DE EDICIÓN GENERAL
========================================================= */

function abrirModalEditarPrograma() {

  const programa =
    programaState.programa;


  if (
    !programa ||
    !programaElementos.modalEditar ||
    !programaElementos.formularioEditar
  ) {

    return;

  }


  completarCampoEdicionPrograma(
    "nombre",
    programa.nombre
  );


  completarCampoEdicionPrograma(
    "tipo",
    programa.tipo
  );


  completarCampoEdicionPrograma(
    "responsable",
    programa.responsable
  );


  completarCampoEdicionPrograma(
    "institucion",
    programa.institucion ===
      "Sin institución asociada"
      ? ""
      : programa.institucion
  );


  completarCampoEdicionPrograma(
    "modalidad",
    programa.modalidad ===
      "Sin definir"
      ? ""
      : programa.modalidad
  );


  completarCampoEdicionPrograma(
    "alcance",
    programa.alcance ===
      "Sin definir"
      ? ""
      : programa.alcance
  );


  completarCampoEdicionPrograma(
    "fechaInicio",
    programa.fechaInicio
  );


  completarCampoEdicionPrograma(
    "fechaFinalizacion",
    programa.fechaFinalizacion
  );


  completarCampoEdicionPrograma(
    "descripcion",
    programa.descripcion
  );


  completarCampoEdicionPrograma(
    "objetivoGeneral",
    programa.objetivoGeneral
  );


  completarCampoEdicionPrograma(
    "destinatarios",
    programa.destinatarios
  );


  completarCampoEdicionPrograma(
    "observaciones",
    programa.observaciones
  );


  limpiarErroresEdicionPrograma();

  abrirModalPrograma(
    programaElementos.modalEditar
  );


  window.setTimeout(() => {

    obtenerCampoEdicionPrograma(
      "nombre"
    )?.focus();

  }, 60);

}


function completarCampoEdicionPrograma(
  nombre,
  valor
) {

  const campo =
    obtenerCampoEdicionPrograma(
      nombre
    );


  if (!campo) {

    return;

  }


  campo.value =
    valor ?? "";

}


function obtenerCampoEdicionPrograma(
  nombre
) {

  return programaElementos
    .formularioEditar
    ?.elements
    .namedItem(
      nombre
    );

}


/* =========================================================
   GUARDAR EDICIÓN GENERAL
========================================================= */

function guardarEdicionPrograma(
  evento
) {

  evento.preventDefault();


  if (
    !validarFormularioEdicionPrograma()
  ) {

    mostrarNotificacionPrograma({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Completá los campos obligatorios antes de guardar."

    });


    enfocarPrimerErrorEdicionPrograma();

    return;

  }


  const datos =
    new FormData(
      programaElementos.formularioEditar
    );


  const fechaInicio =
    obtenerTextoPrograma(
      datos.get("fechaInicio")
    );


  const fechaFinalizacion =
    obtenerTextoPrograma(
      datos.get("fechaFinalizacion")
    );


  programaState.programa = {

    ...programaState.programa,

    nombre:
      obtenerTextoPrograma(
        datos.get("nombre")
      ),

    tipo:
      normalizarTipoProgramaDetalle(
        datos.get("tipo")
      ),

    responsable:
      obtenerTextoPrograma(
        datos.get("responsable")
      ),

    institucion:
      obtenerTextoPrograma(
        datos.get("institucion")
      ) ||
      "Sin institución asociada",

    modalidad:
      obtenerTextoPrograma(
        datos.get("modalidad")
      ) ||
      "Sin definir",

    alcance:
      obtenerTextoPrograma(
        datos.get("alcance")
      ) ||
      "Sin definir",

    fechaInicio,

    fechaFinalizacion,

    descripcion:
      obtenerTextoPrograma(
        datos.get("descripcion")
      ),

    objetivoGeneral:
      obtenerTextoPrograma(
        datos.get("objetivoGeneral")
      ),

    destinatarios:
      obtenerTextoPrograma(
        datos.get("destinatarios")
      ),

    observaciones:
      obtenerTextoPrograma(
        datos.get("observaciones")
      ),

    fechaActualizacion:
      new Date().toISOString()

  };


  agregarHistorialPrograma({

    titulo:
      "Información actualizada",

    detalle:
      "Se modificaron los datos generales del programa."

  });


  if (
    !guardarProgramaActual()
  ) {

    return;

  }


  cerrarModalPrograma(
    programaElementos.modalEditar
  );


  renderizarProgramaCompleto();


  mostrarNotificacionPrograma({

    tipo:
      "success",

    titulo:
      "Cambios guardados",

    mensaje:
      "La información del programa fue actualizada correctamente."

  });

}


/* =========================================================
   VALIDACIÓN DE EDICIÓN GENERAL
========================================================= */

function validarFormularioEdicionPrograma() {

  limpiarErroresEdicionPrograma();


  let valido =
    true;


  valido =
    validarCampoEdicionPrograma(
      "nombre",
      "Ingresá el nombre del programa."
    ) && valido;


  valido =
    validarCampoEdicionPrograma(
      "tipo",
      "Seleccioná el tipo de programa."
    ) && valido;


  valido =
    validarCampoEdicionPrograma(
      "responsable",
      "Ingresá el responsable del programa."
    ) && valido;


  valido =
    validarCampoEdicionPrograma(
      "modalidad",
      "Seleccioná la modalidad."
    ) && valido;


  valido =
    validarCampoEdicionPrograma(
      "descripcion",
      "Ingresá una descripción general."
    ) && valido;


  valido =
    validarCampoEdicionPrograma(
      "objetivoGeneral",
      "Ingresá el objetivo general."
    ) && valido;


  valido =
    validarFechasEdicionPrograma() &&
    valido;


  return valido;

}


function validarCampoEdicionPrograma(
  nombre,
  mensaje
) {

  const campo =
    obtenerCampoEdicionPrograma(
      nombre
    );


  if (!campo) {

    return false;

  }


  if (
    obtenerTextoPrograma(
      campo.value
    )
  ) {

    limpiarErrorEdicionPrograma(
      campo
    );

    return true;

  }


  mostrarErrorEdicionPrograma(
    campo,
    mensaje
  );


  return false;

}


function validarFechasEdicionPrograma() {

  const campoInicio =
    obtenerCampoEdicionPrograma(
      "fechaInicio"
    );


  const campoFinalizacion =
    obtenerCampoEdicionPrograma(
      "fechaFinalizacion"
    );


  if (
    !campoInicio ||
    !campoFinalizacion
  ) {

    return true;

  }


  if (
    !campoInicio.value ||
    !campoFinalizacion.value
  ) {

    return true;

  }


  const fechaInicio =
    crearFechaPrograma(
      campoInicio.value
    );


  const fechaFinalizacion =
    crearFechaPrograma(
      campoFinalizacion.value
    );


  if (
    fechaInicio &&
    fechaFinalizacion &&
    fechaFinalizacion < fechaInicio
  ) {

    mostrarErrorEdicionPrograma(
      campoFinalizacion,
      "La fecha de finalización no puede ser anterior al inicio."
    );

    return false;

  }


  return true;

}


function mostrarErrorEdicionPrograma(
  campo,
  mensaje
) {

  campo.classList.add(
    "programa-campo__control--error"
  );


  campo.setAttribute(
    "aria-invalid",
    "true"
  );


  const error =
    programaElementos
      .formularioEditar
      ?.querySelector(
        `[data-editar-error="${campo.name}"]`
      );


  establecerTextoPrograma(
    error,
    mensaje
  );

}


function limpiarErrorEdicionPrograma(
  campo
) {

  if (!campo) {

    return;

  }


  campo.classList.remove(
    "programa-campo__control--error"
  );


  campo.removeAttribute(
    "aria-invalid"
  );


  const error =
    programaElementos
      .formularioEditar
      ?.querySelector(
        `[data-editar-error="${campo.name}"]`
      );


  establecerTextoPrograma(
    error,
    ""
  );

}


function limpiarErroresEdicionPrograma() {

  programaElementos
    .formularioEditar
    ?.querySelectorAll(
      ".programa-campo__control"
    )
    .forEach(
      limpiarErrorEdicionPrograma
    );

}


function manejarCambioCampoEdicion(
  evento
) {

  limpiarErrorEdicionPrograma(
    evento.target
  );

}


function enfocarPrimerErrorEdicionPrograma() {

  programaElementos
    .formularioEditar
    ?.querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}


/* =========================================================
   CAMBIO DE ESTADO
========================================================= */

function abrirModalCambiarEstado() {

  if (
    !programaElementos.modalEstado ||
    !programaElementos.formularioEstado ||
    !programaState.programa
  ) {

    return;

  }


  const opcionActual =
    programaElementos
      .formularioEstado
      .querySelector(
        `input[name="estado"][value="${programaState.programa.estado}"]`
      );


  if (opcionActual) {

    opcionActual.checked =
      true;

  }


  abrirModalPrograma(
    programaElementos.modalEstado
  );

}


function guardarCambioEstado(
  evento
) {

  evento.preventDefault();


  const datos =
    new FormData(
      programaElementos.formularioEstado
    );


  const nuevoEstado =
    normalizarEstadoProgramaDetalle(
      datos.get("estado")
    );


  if (
    nuevoEstado ===
    programaState.programa.estado
  ) {

    cerrarModalPrograma(
      programaElementos.modalEstado
    );

    return;

  }


  const estadoAnterior =
    PROGRAMA_ESTADOS[
      programaState.programa.estado
    ]?.etiqueta ||
    programaState.programa.estado;


  const estadoNuevo =
    PROGRAMA_ESTADOS[
      nuevoEstado
    ]?.etiqueta ||
    nuevoEstado;


  programaState.programa = {

    ...programaState.programa,

    estado:
      nuevoEstado,

    fechaActualizacion:
      new Date().toISOString()

  };


  agregarHistorialPrograma({

    titulo:
      "Estado actualizado",

    detalle:
      `El programa cambió de “${estadoAnterior}” a “${estadoNuevo}”.`

  });


  if (
    !guardarProgramaActual()
  ) {

    return;

  }


  cerrarModalPrograma(
    programaElementos.modalEstado
  );


  renderizarProgramaCompleto();


  mostrarNotificacionPrograma({

    tipo:
      "success",

    titulo:
      "Estado actualizado",

    mensaje:
      `El programa ahora figura como “${estadoNuevo}”.`

  });

}


/* =========================================================
   MODAL DE NUEVO ELEMENTO
========================================================= */

function abrirModalNuevoElemento(
  tipo,
  elementoExistente = null
) {

  const configuracion =
    PROGRAMA_MODULOS[
      tipo
    ];


  if (
    !configuracion ||
    !programaElementos.modalElemento ||
    !programaElementos.formularioElemento ||
    !programaElementos.elementoCampos
  ) {

    return;

  }


  programaState.tipoElementoActual =
    tipo;


  programaState.elementoPendiente =
    elementoExistente
      ? obtenerTextoPrograma(
          elementoExistente.id
        )
      : null;


  establecerTextoPrograma(
    programaElementos.elementoEyebrow,
    configuracion.eyebrow
  );


  establecerTextoPrograma(
    programaElementos.elementoTitulo,
    elementoExistente
      ? `Editar ${obtenerNombreSingularModulo(tipo)}`
      : configuracion.titulo
  );


  establecerTextoPrograma(
    programaElementos.elementoDescripcion,
    elementoExistente
      ? "Actualizá la información del registro seleccionado."
      : configuracion.descripcion
  );


  programaElementos.elementoTipo.value =
    tipo;


  programaElementos.elementoCampos.innerHTML =
    crearCamposModuloHTML(
      tipo,
      elementoExistente
    );


  establecerTextoPrograma(
    programaElementos.botonGuardarElemento,
    elementoExistente
      ? "Guardar cambios"
      : "Guardar"
  );


  abrirModalPrograma(
    programaElementos.modalElemento
  );


  window.setTimeout(() => {

    programaElementos
      .elementoCampos
      .querySelector(
        "input, select, textarea"
      )
      ?.focus();

  }, 60);

}


/* =========================================================
   CAMPOS DINÁMICOS
========================================================= */

function crearCamposModuloHTML(
  tipo,
  datos = {}
) {

  switch (tipo) {

    case "actividad":

      return crearCamposActividadHTML(
        datos
      );


    case "participante":

      return crearCamposParticipanteHTML(
        datos
      );


    case "institucion":

      return crearCamposInstitucionHTML(
        datos
      );


    case "documento":

      return crearCamposDocumentoHTML(
        datos
      );


    case "evento":

      return crearCamposEventoHTML(
        datos
      );


    case "seguimiento":

      return crearCamposSeguimientoHTML(
        datos
      );


    default:

      return "";

  }

}


/* =========================================================
   CAMPOS: ACTIVIDAD
========================================================= */

function crearCamposActividadHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "titulo",
      etiqueta: "Título de la actividad",
      valor: datos.titulo || datos.nombre,
      requerido: true,
      completo: true,
      placeholder: "Ej.: Taller para familias"
    })}

    ${crearCampoFechaHTML({
      nombre: "fecha",
      etiqueta: "Fecha",
      valor: datos.fecha
    })}

    ${crearCampoHoraHTML({
      nombre: "hora",
      etiqueta: "Horario",
      valor: datos.hora
    })}

    ${crearCampoSelectHTML({
      nombre: "modalidad",
      etiqueta: "Modalidad",
      valor: datos.modalidad,
      opciones: [
        "Presencial",
        "Virtual",
        "Híbrida",
        "Territorial",
        "A definir"
      ]
    })}

    ${crearCampoSelectHTML({
      nombre: "estado",
      etiqueta: "Estado",
      valor: datos.estado || "pendiente",
      requerido: true,
      opciones: [
        {
          valor: "pendiente",
          etiqueta: "Pendiente"
        },
        {
          valor: "confirmada",
          etiqueta: "Confirmada"
        },
        {
          valor: "realizada",
          etiqueta: "Realizada"
        },
        {
          valor: "cancelada",
          etiqueta: "Cancelada"
        }
      ]
    })}

    ${crearCampoTextareaHTML({
      nombre: "descripcion",
      etiqueta: "Descripción",
      valor: datos.descripcion,
      completo: true,
      placeholder: "Describí el propósito y desarrollo previsto."
    })}
  `;

}


/* =========================================================
   CAMPOS: PARTICIPANTE
========================================================= */

function crearCamposParticipanteHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "nombreCompleto",
      etiqueta: "Nombre completo",
      valor: datos.nombreCompleto || datos.nombre,
      requerido: true,
      completo: true,
      placeholder: "Nombre y apellido"
    })}

    ${crearCampoTextoHTML({
      nombre: "rol",
      etiqueta: "Rol dentro del programa",
      valor: datos.rol || datos.tipo,
      requerido: true,
      placeholder: "Ej.: Participante, referente, profesional"
    })}

    ${crearCampoEmailHTML({
      nombre: "correo",
      etiqueta: "Correo electrónico",
      valor: datos.correo || datos.email,
      placeholder: "correo@ejemplo.com"
    })}

    ${crearCampoTextoHTML({
      nombre: "telefono",
      etiqueta: "Teléfono",
      valor: datos.telefono,
      placeholder: "Número de contacto"
    })}

    ${crearCampoTextareaHTML({
      nombre: "observaciones",
      etiqueta: "Observaciones",
      valor: datos.observaciones,
      completo: true,
      placeholder: "Información administrativa o de seguimiento."
    })}
  `;

}


/* =========================================================
   CAMPOS: INSTITUCIÓN
========================================================= */

function crearCamposInstitucionHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "nombre",
      etiqueta: "Nombre de la institución",
      valor: datos.nombre,
      requerido: true,
      completo: true,
      placeholder: "Nombre institucional"
    })}

    ${crearCampoTextoHTML({
      nombre: "rol",
      etiqueta: "Tipo de vinculación",
      valor: datos.rol || datos.vinculacion,
      requerido: true,
      placeholder: "Ej.: Sede, aliada, derivante"
    })}

    ${crearCampoTextoHTML({
      nombre: "referente",
      etiqueta: "Persona referente",
      valor: datos.referente,
      placeholder: "Nombre y apellido"
    })}

    ${crearCampoTextoHTML({
      nombre: "contacto",
      etiqueta: "Datos de contacto",
      valor: datos.contacto || datos.correo || datos.telefono,
      placeholder: "Correo o teléfono"
    })}

    ${crearCampoTextareaHTML({
      nombre: "observaciones",
      etiqueta: "Observaciones",
      valor: datos.observaciones,
      completo: true,
      placeholder: "Detalles del vínculo institucional."
    })}
  `;

}


/* =========================================================
   CAMPOS: DOCUMENTO
========================================================= */

function crearCamposDocumentoHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "titulo",
      etiqueta: "Título del documento",
      valor: datos.titulo || datos.nombre,
      requerido: true,
      completo: true,
      placeholder: "Ej.: Acta de reunión"
    })}

    ${crearCampoTextoHTML({
      nombre: "tipo",
      etiqueta: "Tipo de documento",
      valor: datos.tipo,
      requerido: true,
      placeholder: "Ej.: Acta, informe, convenio"
    })}

    ${crearCampoFechaHTML({
      nombre: "fecha",
      etiqueta: "Fecha del documento",
      valor: datos.fecha
    })}

    ${crearCampoURLHTML({
      nombre: "enlace",
      etiqueta: "Enlace al documento",
      valor: datos.enlace || datos.url,
      completo: true,
      placeholder: "https://..."
    })}

    ${crearCampoTextareaHTML({
      nombre: "descripcion",
      etiqueta: "Descripción",
      valor: datos.descripcion,
      completo: true,
      placeholder: "Información relevante sobre el documento."
    })}
  `;

}


/* =========================================================
   CAMPOS: EVENTO
========================================================= */

function crearCamposEventoHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "titulo",
      etiqueta: "Título del evento",
      valor: datos.titulo || datos.nombre,
      requerido: true,
      completo: true,
      placeholder: "Ej.: Reunión de coordinación"
    })}

    ${crearCampoFechaHTML({
      nombre: "fecha",
      etiqueta: "Fecha",
      valor: datos.fecha,
      requerido: true
    })}

    ${crearCampoHoraHTML({
      nombre: "hora",
      etiqueta: "Horario",
      valor: datos.hora
    })}

    ${crearCampoSelectHTML({
      nombre: "modalidad",
      etiqueta: "Modalidad",
      valor: datos.modalidad,
      opciones: [
        "Presencial",
        "Virtual",
        "Híbrida",
        "Territorial",
        "A definir"
      ]
    })}

    ${crearCampoTextoHTML({
      nombre: "lugar",
      etiqueta: "Lugar o enlace",
      valor: datos.lugar,
      completo: true,
      placeholder: "Dirección, sede o enlace virtual"
    })}

    ${crearCampoTextareaHTML({
      nombre: "descripcion",
      etiqueta: "Descripción",
      valor: datos.descripcion,
      completo: true,
      placeholder: "Agregá información relevante del evento."
    })}
  `;

}


/* =========================================================
   CAMPOS: SEGUIMIENTO
========================================================= */

function crearCamposSeguimientoHTML(
  datos
) {

  return `
    ${crearCampoTextoHTML({
      nombre: "titulo",
      etiqueta: "Título de la actualización",
      valor: datos.titulo,
      requerido: true,
      completo: true,
      placeholder: "Ej.: Avance de implementación"
    })}

    ${crearCampoTextoHTML({
      nombre: "autor",
      etiqueta: "Autor o responsable",
      valor: datos.autor || datos.responsable,
      requerido: true,
      placeholder: "Nombre del responsable"
    })}

    ${crearCampoFechaHTML({
      nombre: "fecha",
      etiqueta: "Fecha",
      valor: normalizarFechaInputPrograma(
        datos.fecha ||
        datos.fechaCreacion
      ),
      requerido: true
    })}

    ${crearCampoTextareaHTML({
      nombre: "descripcion",
      etiqueta: "Detalle",
      valor: datos.descripcion || datos.detalle,
      requerido: true,
      completo: true,
      placeholder: "Describí avances, dificultades o decisiones."
    })}
  `;

}


/* =========================================================
   GENERADORES DE CAMPOS HTML
========================================================= */

function crearCampoTextoHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false,
  placeholder = ""
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <input
        type="text"
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        value="${escaparAtributoPrograma(valor || "")}"
        placeholder="${escaparAtributoPrograma(placeholder)}"
        ${requerido ? "required" : ""}
      >
    `

  });

}


function crearCampoEmailHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false,
  placeholder = ""
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <input
        type="email"
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        value="${escaparAtributoPrograma(valor || "")}"
        placeholder="${escaparAtributoPrograma(placeholder)}"
        ${requerido ? "required" : ""}
      >
    `

  });

}


function crearCampoURLHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false,
  placeholder = ""
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <input
        type="url"
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        value="${escaparAtributoPrograma(valor || "")}"
        placeholder="${escaparAtributoPrograma(placeholder)}"
        ${requerido ? "required" : ""}
      >
    `

  });

}


function crearCampoFechaHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <input
        type="date"
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        value="${escaparAtributoPrograma(
          normalizarFechaInputPrograma(valor)
        )}"
        ${requerido ? "required" : ""}
      >
    `

  });

}


function crearCampoHoraHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <input
        type="time"
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        value="${escaparAtributoPrograma(valor || "")}"
        ${requerido ? "required" : ""}
      >
    `

  });

}


function crearCampoTextareaHTML({
  nombre,
  etiqueta,
  valor = "",
  requerido = false,
  completo = false,
  placeholder = ""
}) {

  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <textarea
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control programa-campo__control--textarea"
        rows="4"
        placeholder="${escaparAtributoPrograma(placeholder)}"
        ${requerido ? "required" : ""}
      >${escaparHTMLPrograma(valor || "")}</textarea>
    `

  });

}


function crearCampoSelectHTML({
  nombre,
  etiqueta,
  valor = "",
  opciones = [],
  requerido = false,
  completo = false
}) {

  const opcionesHTML =
    opciones.map((opcion) => {

      const valorOpcion =
        typeof opcion === "string"
          ? opcion
          : opcion.valor;


      const etiquetaOpcion =
        typeof opcion === "string"
          ? opcion
          : opcion.etiqueta;


      const seleccionado =
        obtenerTextoPrograma(valor) ===
        obtenerTextoPrograma(valorOpcion);


      return `
        <option
          value="${escaparAtributoPrograma(valorOpcion)}"
          ${seleccionado ? "selected" : ""}
        >
          ${escaparHTMLPrograma(etiquetaOpcion)}
        </option>
      `;

    }).join("");


  return crearCampoBaseHTML({

    nombre,
    etiqueta,
    requerido,
    completo,

    control: `
      <select
        id="elemento-${escaparAtributoPrograma(nombre)}"
        name="${escaparAtributoPrograma(nombre)}"
        class="programa-campo__control"
        ${requerido ? "required" : ""}
      >

        <option value="">
          Seleccionar
        </option>

        ${opcionesHTML}

      </select>
    `

  });

}


function crearCampoBaseHTML({
  nombre,
  etiqueta,
  requerido,
  completo,
  control
}) {

  return `
    <div
      class="programa-campo ${
        completo
          ? "programa-campo--completo"
          : ""
      }"
    >

      <label
        for="elemento-${escaparAtributoPrograma(nombre)}"
        class="programa-campo__label"
      >
        ${escaparHTMLPrograma(etiqueta)}

        ${
          requerido
            ? '<span aria-hidden="true">*</span>'
            : ""
        }
      </label>

      ${control}

      <span
        class="programa-campo__error"
        data-elemento-error="${escaparAtributoPrograma(nombre)}"
        aria-live="polite"
      ></span>

    </div>
  `;

}

/* =========================================================
   GUARDAR NUEVO ELEMENTO
========================================================= */

function guardarNuevoElemento(
  evento
) {

  evento.preventDefault();


  const tipo =
    programaState.tipoElementoActual;


  const configuracion =
    PROGRAMA_MODULOS[
      tipo
    ];


  if (
    !tipo ||
    !configuracion ||
    !programaElementos.formularioElemento
  ) {

    return;

  }


  if (
    !validarFormularioElementoPrograma()
  ) {

    mostrarNotificacionPrograma({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Completá los campos obligatorios antes de guardar."

    });


    enfocarPrimerErrorElementoPrograma();

    return;

  }


  const datos =
    new FormData(
      programaElementos.formularioElemento
    );


  const coleccion =
    programaState.programa[
      configuracion.propiedad
    ];


  const idExistente =
    programaState.elementoPendiente;


  const ahora =
    new Date().toISOString();


  const registroBase =
    construirRegistroModuloPrograma(
      tipo,
      datos
    );


  if (idExistente) {

    const indice =
      coleccion.findIndex(
        (elemento) =>
          obtenerTextoPrograma(
            elemento.id
          ) ===
          idExistente
      );


    if (
      indice === -1
    ) {

      mostrarNotificacionPrograma({

        tipo:
          "error",

        titulo:
          "Registro no encontrado",

        mensaje:
          "No fue posible localizar el elemento seleccionado."

      });

      return;

    }


    coleccion[indice] = {

      ...coleccion[indice],

      ...registroBase,

      id:
        idExistente,

      fechaActualizacion:
        ahora

    };


    agregarHistorialPrograma({

      titulo:
        `${capitalizarTextoPrograma(
          obtenerNombreSingularModulo(
            tipo
          )
        )} actualizada`,

      detalle:
        `Se modificó un registro del módulo ${configuracion.panel}.`

    });

  } else {

    const nuevoRegistro = {

      id:
        generarElementoIdPrograma(
          tipo
        ),

      ...registroBase,

      fechaCreacion:
        ahora,

      fechaActualizacion:
        ahora

    };


    coleccion.unshift(
      nuevoRegistro
    );


    agregarHistorialPrograma({

      titulo:
        `${capitalizarTextoPrograma(
          obtenerNombreSingularModulo(
            tipo
          )
        )} registrada`,

      detalle:
        `Se incorporó un nuevo registro al módulo ${configuracion.panel}.`

    });

  }


  programaState.programa = {

    ...programaState.programa,

    [configuracion.propiedad]:
      coleccion,

    fechaActualizacion:
      ahora

  };


  if (
    !guardarProgramaActual()
  ) {

    return;

  }


  cerrarModalPrograma(
    programaElementos.modalElemento
  );


  programaState.tipoElementoActual =
    null;


  programaState.elementoPendiente =
    null;


  renderizarProgramaCompleto();


  cambiarTabPrograma(
    configuracion.panel
  );


  mostrarNotificacionPrograma({

    tipo:
      "success",

    titulo:
      idExistente
        ? "Cambios guardados"
        : "Registro agregado",

    mensaje:
      idExistente
        ? "La información fue actualizada correctamente."
        : "El nuevo registro fue incorporado al programa."

  });

}


/* =========================================================
   CONSTRUIR REGISTROS POR MÓDULO
========================================================= */

function construirRegistroModuloPrograma(
  tipo,
  datos
) {

  const obtener =
    (nombre) =>
      obtenerTextoPrograma(
        datos.get(nombre)
      );


  switch (tipo) {

    case "actividad":

      return {

        titulo:
          obtener("titulo"),

        fecha:
          obtener("fecha"),

        hora:
          obtener("hora"),

        modalidad:
          obtener("modalidad"),

        estado:
          obtener("estado") ||
          "pendiente",

        descripcion:
          obtener("descripcion")

      };


    case "participante":

      return {

        nombreCompleto:
          obtener("nombreCompleto"),

        rol:
          obtener("rol"),

        correo:
          obtener("correo"),

        telefono:
          obtener("telefono"),

        observaciones:
          obtener("observaciones")

      };


    case "institucion":

      return {

        nombre:
          obtener("nombre"),

        rol:
          obtener("rol"),

        referente:
          obtener("referente"),

        contacto:
          obtener("contacto"),

        observaciones:
          obtener("observaciones")

      };


    case "documento":

      return {

        titulo:
          obtener("titulo"),

        tipo:
          obtener("tipo"),

        fecha:
          obtener("fecha"),

        enlace:
          obtener("enlace"),

        descripcion:
          obtener("descripcion")

      };


    case "evento":

      return {

        titulo:
          obtener("titulo"),

        fecha:
          obtener("fecha"),

        hora:
          obtener("hora"),

        modalidad:
          obtener("modalidad"),

        lugar:
          obtener("lugar"),

        descripcion:
          obtener("descripcion")

      };


    case "seguimiento":

      return {

        titulo:
          obtener("titulo"),

        autor:
          obtener("autor"),

        fecha:
          obtener("fecha"),

        descripcion:
          obtener("descripcion")

      };


    default:

      return {};

  }

}


/* =========================================================
   VALIDACIÓN DE ELEMENTOS
========================================================= */

function validarFormularioElementoPrograma() {

  const campos =
    Array.from(
      programaElementos
        .formularioElemento
        .querySelectorAll(
          "[required]"
        )
    );


  let valido =
    true;


  programaElementos
    .formularioElemento
    .querySelectorAll(
      ".programa-campo__control"
    )
    .forEach(
      limpiarErrorElementoPrograma
    );


  campos.forEach(
    (campo) => {

      const valor =
        obtenerTextoPrograma(
          campo.value
        );


      if (!valor) {

        mostrarErrorElementoPrograma(
          campo,
          "Este campo es obligatorio."
        );

        valido =
          false;

        return;

      }


      if (
        campo.type === "email" &&
        !campo.checkValidity()
      ) {

        mostrarErrorElementoPrograma(
          campo,
          "Ingresá un correo electrónico válido."
        );

        valido =
          false;

      }


      if (
        campo.type === "url" &&
        !campo.checkValidity()
      ) {

        mostrarErrorElementoPrograma(
          campo,
          "Ingresá un enlace válido."
        );

        valido =
          false;

      }

    });


  return valido;

}


function mostrarErrorElementoPrograma(
  campo,
  mensaje
) {

  campo.classList.add(
    "programa-campo__control--error"
  );


  campo.setAttribute(
    "aria-invalid",
    "true"
  );


  const error =
    programaElementos
      .formularioElemento
      .querySelector(
        `[data-elemento-error="${campo.name}"]`
      );


  establecerTextoPrograma(
    error,
    mensaje
  );

}


function limpiarErrorElementoPrograma(
  campo
) {

  if (!campo) {

    return;

  }


  campo.classList.remove(
    "programa-campo__control--error"
  );


  campo.removeAttribute(
    "aria-invalid"
  );


  const error =
    programaElementos
      .formularioElemento
      ?.querySelector(
        `[data-elemento-error="${campo.name}"]`
      );


  establecerTextoPrograma(
    error,
    ""
  );

}


function enfocarPrimerErrorElementoPrograma() {

  programaElementos
    .formularioElemento
    ?.querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}


/* =========================================================
   ACCIONES DE TARJETAS
========================================================= */

function manejarAccionesElementos(
  evento
) {

  const botonEditar =
    evento.target.closest(
      "[data-editar-elemento][data-elemento-id]"
    );


  if (botonEditar) {

    const tipo =
      botonEditar.dataset
        .editarElemento;


    const id =
      botonEditar.dataset
        .elementoId;


    editarElementoPrograma(
      tipo,
      id
    );


    return;

  }


  const botonEliminar =
    evento.target.closest(
      "[data-eliminar-elemento][data-elemento-id]"
    );


  if (botonEliminar) {

    const tipo =
      botonEliminar.dataset
        .eliminarElemento;


    const id =
      botonEliminar.dataset
        .elementoId;


    solicitarEliminarElementoPrograma(
      tipo,
      id
    );

  }

}


/* =========================================================
   EDITAR ELEMENTO
========================================================= */

function editarElementoPrograma(
  tipo,
  id
) {

  const configuracion =
    PROGRAMA_MODULOS[
      tipo
    ];


  if (!configuracion) {

    return;

  }


  const elemento =
    programaState.programa[
      configuracion.propiedad
    ].find(
      (registro) =>
        obtenerTextoPrograma(
          registro.id
        ) ===
        obtenerTextoPrograma(
          id
        )
    );


  if (!elemento) {

    mostrarNotificacionPrograma({

      tipo:
        "error",

      titulo:
        "Registro no encontrado",

      mensaje:
        "No fue posible localizar el elemento seleccionado."

    });

    return;

  }


  abrirModalNuevoElemento(
    tipo,
    elemento
  );

}


/* =========================================================
   ELIMINAR ELEMENTO
========================================================= */

function solicitarEliminarElementoPrograma(
  tipo,
  id
) {

  const configuracion =
    PROGRAMA_MODULOS[
      tipo
    ];


  if (!configuracion) {

    return;

  }


  const elemento =
    programaState.programa[
      configuracion.propiedad
    ].find(
      (registro) =>
        obtenerTextoPrograma(
          registro.id
        ) ===
        obtenerTextoPrograma(
          id
        )
    );


  if (!elemento) {

    return;

  }


  programaState.accionConfirmacion =
    "eliminar-elemento";


  programaState.tipoElementoActual =
    tipo;


  programaState.elementoPendiente =
    id;


  abrirModalConfirmacionPrograma({

    titulo:
      `Eliminar ${obtenerNombreSingularModulo(tipo)}`,

    mensaje:
      "El registro será eliminado del programa. Esta acción no puede deshacerse.",

    textoConfirmar:
      "Eliminar"

  });

}


function eliminarElementoPrograma() {

  const tipo =
    programaState.tipoElementoActual;


  const configuracion =
    PROGRAMA_MODULOS[
      tipo
    ];


  const id =
    programaState.elementoPendiente;


  if (
    !configuracion ||
    !id
  ) {

    cerrarModalConfirmacion();

    return;

  }


  const coleccion =
    programaState.programa[
      configuracion.propiedad
    ];


  const cantidadAnterior =
    coleccion.length;


  const nuevaColeccion =
    coleccion.filter(
      (elemento) =>
        obtenerTextoPrograma(
          elemento.id
        ) !==
        obtenerTextoPrograma(
          id
        )
    );


  if (
    nuevaColeccion.length ===
    cantidadAnterior
  ) {

    cerrarModalConfirmacion();

    return;

  }


  programaState.programa = {

    ...programaState.programa,

    [configuracion.propiedad]:
      nuevaColeccion,

    fechaActualizacion:
      new Date().toISOString()

  };


  agregarHistorialPrograma({

    titulo:
      `${capitalizarTextoPrograma(
        obtenerNombreSingularModulo(
          tipo
        )
      )} eliminada`,

    detalle:
      `Se eliminó un registro del módulo ${configuracion.panel}.`

  });


  if (
    !guardarProgramaActual()
  ) {

    return;

  }


  cerrarModalConfirmacion();


  programaState.tipoElementoActual =
    null;


  programaState.elementoPendiente =
    null;


  renderizarProgramaCompleto();


  cambiarTabPrograma(
    configuracion.panel
  );


  mostrarNotificacionPrograma({

    tipo:
      "success",

    titulo:
      "Registro eliminado",

    mensaje:
      "El elemento fue eliminado correctamente."

  });

}


/* =========================================================
   ARCHIVAR PROGRAMA
========================================================= */

function solicitarArchivarPrograma() {

  programaState.accionConfirmacion =
    "archivar-programa";


  abrirModalConfirmacionPrograma({

    titulo:
      "Archivar programa",

    mensaje:
      "El programa se conservará en el registro, pero quedará marcado como archivado.",

    textoConfirmar:
      "Archivar"

  });

}


function archivarProgramaActual() {

  programaState.programa = {

    ...programaState.programa,

    estado:
      "archivado",

    fechaActualizacion:
      new Date().toISOString()

  };


  agregarHistorialPrograma({

    titulo:
      "Programa archivado",

    detalle:
      "El registro fue marcado como archivado."

  });


  if (
    !guardarProgramaActual()
  ) {

    return;

  }


  cerrarModalConfirmacion();


  renderizarProgramaCompleto();


  mostrarNotificacionPrograma({

    tipo:
      "success",

    titulo:
      "Programa archivado",

    mensaje:
      "El programa fue archivado correctamente."

  });

}


/* =========================================================
   ELIMINAR PROGRAMA
========================================================= */

function solicitarEliminarPrograma() {

  programaState.accionConfirmacion =
    "eliminar-programa";


  abrirModalConfirmacionPrograma({

    titulo:
      "Eliminar programa",

    mensaje:
      "El programa y todos sus registros internos serán eliminados definitivamente.",

    textoConfirmar:
      "Eliminar programa"

  });

}


function eliminarProgramaActual() {

  const programasRestantes =
    programaState.programas.filter(
      (programa) =>
        obtenerTextoPrograma(
          programa.id
        ) !==
        programaState.programaId
    );


  try {

    localStorage.setItem(
      PROGRAMA_STORAGE_KEY,
      JSON.stringify(
        programasRestantes
      )
    );


    window.location.href =
      PROGRAMA_PAGINA_LISTADO;

  } catch (error) {

    console.error(
      "No fue posible eliminar el programa:",
      error
    );


    mostrarNotificacionPrograma({

      tipo:
        "error",

      titulo:
        "No pudimos eliminar el programa",

      mensaje:
        "Se produjo un inconveniente al actualizar el registro."

    });

  }

}


/* =========================================================
   EJECUTAR CONFIRMACIÓN
========================================================= */

function ejecutarAccionConfirmada() {

  switch (
    programaState.accionConfirmacion
  ) {

    case "eliminar-elemento":

      eliminarElementoPrograma();

      break;


    case "archivar-programa":

      archivarProgramaActual();

      break;


    case "eliminar-programa":

      eliminarProgramaActual();

      break;


    default:

      cerrarModalConfirmacion();

  }

}


/* =========================================================
   PERSISTENCIA
========================================================= */

function guardarProgramaActual() {

  if (
    !programaState.programa
  ) {

    return false;

  }


  const indice =
    programaState.programas.findIndex(
      (programa) =>
        obtenerTextoPrograma(
          programa.id
        ) ===
        programaState.programaId
    );


  if (
    indice === -1
  ) {

    mostrarNotificacionPrograma({

      tipo:
        "error",

      titulo:
        "Programa no encontrado",

      mensaje:
        "No fue posible actualizar el registro seleccionado."

    });

    return false;

  }


  programaState.programas[indice] =
    programaState.programa;


  try {

    localStorage.setItem(
      PROGRAMA_STORAGE_KEY,
      JSON.stringify(
        programaState.programas
      )
    );


    return true;

  } catch (error) {

    console.error(
      "No fue posible guardar el programa:",
      error
    );


    mostrarNotificacionPrograma({

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
   HISTORIAL
========================================================= */

function agregarHistorialPrograma({
  titulo,
  detalle
}) {

  const historial =
    normalizarColeccionPrograma(
      programaState.programa
        .historial
    );


  historial.unshift({

    id:
      generarElementoIdPrograma(
        "historial"
      ),

    titulo:
      obtenerTextoPrograma(
        titulo
      ),

    detalle:
      obtenerTextoPrograma(
        detalle
      ),

    fecha:
      new Date().toISOString()

  });


  programaState.programa = {

    ...programaState.programa,

    historial

  };

}


/* =========================================================
   MODALES
========================================================= */

function abrirModalPrograma(
  modal
) {

  if (!modal) {

    return;

  }


  modal.hidden =
    false;


  document.body.classList.add(
    "programa-modal-abierto"
  );

}


function cerrarModalPrograma(
  modal
) {

  if (!modal) {

    return;

  }


  modal.hidden =
    true;


  const hayModalAbierto =
    [
      programaElementos.modalEditar,
      programaElementos.modalEstado,
      programaElementos.modalElemento,
      programaElementos.modalConfirmacion
    ].some(
      (elemento) =>
        elemento &&
        !elemento.hidden
    );


  if (!hayModalAbierto) {

    document.body.classList.remove(
      "programa-modal-abierto"
    );

  }

}


function manejarCierreModal(
  evento
) {

  const tipo =
    evento.currentTarget.dataset
      .cerrarModal;


  const modales = {

    editar:
      programaElementos.modalEditar,

    estado:
      programaElementos.modalEstado,

    elemento:
      programaElementos.modalElemento,

    confirmacion:
      programaElementos.modalConfirmacion

  };


  cerrarModalPrograma(
    modales[tipo]
  );


  if (
    tipo === "elemento"
  ) {

    programaState.tipoElementoActual =
      null;


    programaState.elementoPendiente =
      null;

  }

}


/* =========================================================
   MODAL DE CONFIRMACIÓN
========================================================= */

function abrirModalConfirmacionPrograma({
  titulo,
  mensaje,
  textoConfirmar
}) {

  establecerTextoPrograma(
    programaElementos.confirmacionTitulo,
    titulo
  );


  establecerTextoPrograma(
    programaElementos.confirmacionMensaje,
    mensaje
  );


  establecerTextoPrograma(
    programaElementos.botonAceptarConfirmacion,
    textoConfirmar
  );


  abrirModalPrograma(
    programaElementos.modalConfirmacion
  );


  window.setTimeout(() => {

    programaElementos
      .botonAceptarConfirmacion
      ?.focus();

  }, 60);

}


function cerrarModalConfirmacion() {

  cerrarModalPrograma(
    programaElementos.modalConfirmacion
  );


  programaState.accionConfirmacion =
    null;


  programaState.elementoPendiente =
    null;

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionPrograma({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !programaElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    programaState
      .temporizadorNotificacion
  );


  const configuraciones = {

    success: {

      icono:
        "✓",

      color:
        "#7bc7a4",

      borde:
        "rgba(123, 199, 164, 0.28)",

      fondo:
        "rgba(123, 199, 164, 0.10)"

    },

    error: {

      icono:
        "!",

      color:
        "#d88282",

      borde:
        "rgba(216, 130, 130, 0.30)",

      fondo:
        "rgba(216, 130, 130, 0.10)"

    },

    info: {

      icono:
        "i",

      color:
        "#78a8e4",

      borde:
        "rgba(120, 168, 228, 0.28)",

      fondo:
        "rgba(120, 168, 228, 0.10)"

    }

  };


  const configuracion =
    configuraciones[tipo] ||
    configuraciones.success;


  establecerTextoPrograma(
    programaElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoPrograma(
    programaElementos.notificacionTitulo,
    titulo
  );


  establecerTextoPrograma(
    programaElementos.notificacionMensaje,
    mensaje
  );


  programaElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  programaElementos.notificacionIcono
    .style.color =
      configuracion.color;


  programaElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  programaElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  programaElementos.notificacion.hidden =
    false;


  programaState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionPrograma,
      4500
    );

}


function ocultarNotificacionPrograma() {

  if (
    !programaElementos.notificacion
  ) {

    return;

  }


  programaElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    programaState
      .temporizadorNotificacion
  );

}


/* =========================================================
   LOADER Y ESTADOS GENERALES
========================================================= */

function mostrarLoaderPrograma() {

  mostrarElementoPrograma(
    programaElementos.loader
  );


  ocultarElementoPrograma(
    programaElementos.noEncontrado
  );


  ocultarElementoPrograma(
    programaElementos.contenido
  );

}


function mostrarContenidoPrograma() {

  ocultarElementoPrograma(
    programaElementos.loader
  );


  ocultarElementoPrograma(
    programaElementos.noEncontrado
  );


  mostrarElementoPrograma(
    programaElementos.contenido
  );

}


function mostrarProgramaNoEncontrado() {

  ocultarElementoPrograma(
    programaElementos.loader
  );


  ocultarElementoPrograma(
    programaElementos.contenido
  );


  mostrarElementoPrograma(
    programaElementos.noEncontrado
  );

}


/* =========================================================
   CAMBIOS DE STORAGE
========================================================= */

function manejarCambioProgramasStorage(
  evento
) {

  if (
    evento.key !==
    PROGRAMA_STORAGE_KEY
  ) {

    return;

  }


  cargarPrograma();

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTecladoPrograma(
  evento
) {

  if (
    evento.key !== "Escape"
  ) {

    return;

  }


  if (
    programaElementos.modalConfirmacion &&
    !programaElementos.modalConfirmacion.hidden
  ) {

    cerrarModalConfirmacion();

    return;

  }


  if (
    programaElementos.modalElemento &&
    !programaElementos.modalElemento.hidden
  ) {

    cerrarModalPrograma(
      programaElementos.modalElemento
    );

    programaState.tipoElementoActual =
      null;

    programaState.elementoPendiente =
      null;

    return;

  }


  if (
    programaElementos.modalEstado &&
    !programaElementos.modalEstado.hidden
  ) {

    cerrarModalPrograma(
      programaElementos.modalEstado
    );

    return;

  }


  if (
    programaElementos.modalEditar &&
    !programaElementos.modalEditar.hidden
  ) {

    cerrarModalPrograma(
      programaElementos.modalEditar
    );

  }

}


/* =========================================================
   ORDENAMIENTO
========================================================= */

function ordenarPorFechaPrograma(
  elementoA,
  elementoB
) {

  const fechaA =
    new Date(
      elementoA.fecha ||
      elementoA.fechaCreacion ||
      0
    ).getTime();


  const fechaB =
    new Date(
      elementoB.fecha ||
      elementoB.fechaCreacion ||
      0
    ).getTime();


  return fechaB - fechaA;

}


function ordenarPorFechaAscendentePrograma(
  elementoA,
  elementoB
) {

  const fechaA =
    new Date(
      elementoA.fecha ||
      0
    ).getTime();


  const fechaB =
    new Date(
      elementoB.fecha ||
      0
    ).getTime();


  return fechaA - fechaB;

}


function ordenarPorNombrePrograma(
  elementoA,
  elementoB
) {

  const nombreA =
    obtenerTextoPrograma(
      elementoA.nombreCompleto ||
      elementoA.nombre ||
      elementoA.titulo
    );


  const nombreB =
    obtenerTextoPrograma(
      elementoB.nombreCompleto ||
      elementoB.nombre ||
      elementoB.titulo
    );


  return nombreA.localeCompare(
    nombreB,
    "es",
    {
      sensitivity:
        "base"
    }
  );

}


/* =========================================================
   FECHAS
========================================================= */

function crearFechaPrograma(
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


function formatearFechaPrograma(
  valor
) {

  const fecha =
    crearFechaPrograma(
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


function formatearFechaHoraPrograma(
  valor
) {

  const fecha =
    crearFechaPrograma(
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


function normalizarFechaInputPrograma(
  valor
) {

  const fecha =
    crearFechaPrograma(
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
   GENERADORES
========================================================= */

function generarElementoIdPrograma(
  prefijo = "item"
) {

  const fecha =
    Date.now()
      .toString(36)
      .toUpperCase();


  const aleatorio =
    Math.random()
      .toString(36)
      .slice(2, 9)
      .toUpperCase();


  return `${prefijo.toUpperCase()}-${fecha}-${aleatorio}`;

}


function generarReferenciaProgramaDetalle() {

  const anio =
    new Date().getFullYear();


  const codigo =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();


  return `FALCO-PROG-${anio}-${codigo}`;

}


/* =========================================================
   UTILIDADES DE MÓDULOS
========================================================= */

function obtenerNombreSingularModulo(
  tipo
) {

  const nombres = {

    actividad:
      "actividad",

    participante:
      "participante",

    institucion:
      "institución",

    documento:
      "documento",

    evento:
      "evento",

    seguimiento:
      "anotación"

  };


  return nombres[tipo] ||
    "registro";

}


/* =========================================================
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTextoPrograma(
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


function normalizarTextoPrograma(
  valor
) {

  return obtenerTextoPrograma(
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


function capitalizarTextoPrograma(
  valor
) {

  const texto =
    obtenerTextoPrograma(
      valor
    );


  if (!texto) {

    return "";

  }


  return texto
    .charAt(0)
    .toUpperCase() +
    texto.slice(1);

}


function obtenerInicialesPrograma(
  nombre
) {

  const partes =
    obtenerTextoPrograma(
      nombre
    )
      .split(/\s+/)
      .filter(Boolean);


  if (
    partes.length === 0
  ) {

    return "—";

  }


  if (
    partes.length === 1
  ) {

    return partes[0]
      .slice(0, 2)
      .toUpperCase();

  }


  return (
    partes[0].charAt(0) +
    partes[
      partes.length - 1
    ].charAt(0)
  ).toUpperCase();

}


function escaparHTMLPrograma(
  valor
) {

  return obtenerTextoPrograma(
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


function escaparAtributoPrograma(
  valor
) {

  return escaparHTMLPrograma(
    valor
  ).replace(
    /`/g,
    "&#096;"
  );

}


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTextoPrograma(
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


function mostrarElementoPrograma(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    false;

}


function ocultarElementoPrograma(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    true;

}