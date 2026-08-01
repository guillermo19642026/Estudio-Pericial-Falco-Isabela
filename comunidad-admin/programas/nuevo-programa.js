/* =========================================================
   FALCO® COMUNIDAD
   NUEVO PROGRAMA
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const PROGRAMAS_STORAGE_KEY =
  "falcoComunidadProgramas";

const BORRADOR_PROGRAMA_STORAGE_KEY =
  "falcoComunidadNuevoProgramaBorrador";

const TOTAL_PASOS =
  3;


/* =========================================================
   CATÁLOGOS
========================================================= */

const TIPOS_PROGRAMA = {

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

const ESTADOS_PROGRAMA = {

  preparacion:
    "En preparación",

  ejecucion:
    "En ejecución",

  pausado:
    "Pausado",

  finalizado:
    "Finalizado",

  archivado:
    "Archivado"

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const nuevoProgramaState = {

  pasoActual:
    1,

  formularioModificado:
    false,

  formularioEnviado:
    false,

  programaRegistradoId:
    null,

  temporizadorNotificacion:
    null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const elementos = {

  formulario:
    document.getElementById(
      "formularioNuevoPrograma"
    ),

  secciones:
    Array.from(
      document.querySelectorAll(
        "[data-paso]"
      )
    ),

  indicadoresPaso:
    Array.from(
      document.querySelectorAll(
        "[data-paso-indicador]"
      )
    ),

  botonesSiguiente:
    Array.from(
      document.querySelectorAll(
        "[data-siguiente-paso]"
      )
    ),

  botonesAnterior:
    Array.from(
      document.querySelectorAll(
        "[data-anterior-paso]"
      )
    ),

  botonesEditar:
    Array.from(
      document.querySelectorAll(
        "[data-editar-paso]"
      )
    ),

  estadoFormulario:
    document.getElementById(
      "estadoFormulario"
    ),

  porcentajeFormulario:
    document.getElementById(
      "porcentajeFormulario"
    ),

  barraProgreso:
    document.getElementById(
      "barraProgresoFormulario"
    ),

  contadorDescripcion:
    document.getElementById(
      "contadorDescripcion"
    ),

  contadorObjetivoGeneral:
    document.getElementById(
      "contadorObjetivoGeneral"
    ),

  contadorDestinatarios:
    document.getElementById(
      "contadorDestinatarios"
    ),

  contadorObservaciones:
    document.getElementById(
      "contadorObservaciones"
    ),

  botonGuardarBorrador:
    document.getElementById(
      "botonGuardarBorrador"
    ),

  botonEliminarBorrador:
    document.getElementById(
      "botonEliminarBorrador"
    ),

  botonRegistrar:
    document.getElementById(
      "botonRegistrarPrograma"
    ),

  botonRegistrarIcono:
    document.getElementById(
      "botonRegistrarProgramaIcono"
    ),

  botonRegistrarTexto:
    document.getElementById(
      "botonRegistrarProgramaTexto"
    ),

  modalRegistrado:
    document.getElementById(
      "modalProgramaRegistrado"
    ),

  referenciaRegistrada:
    document.getElementById(
      "referenciaProgramaRegistrado"
    ),

  botonAdministrarRegistrado:
    document.getElementById(
      "botonAdministrarProgramaRegistrado"
    ),

  modalConfirmacion:
    document.getElementById(
      "modalConfirmacionPrograma"
    ),

  modalConfirmacionTitulo:
    document.getElementById(
      "modalConfirmacionTitulo"
    ),

  modalConfirmacionMensaje:
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

  notificacion:
    document.getElementById(
      "nuevoProgramaNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "nuevoProgramaNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "nuevoProgramaNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "nuevoProgramaNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "nuevoProgramaNotificacionCerrar"
    ),

  revision: {

    nombre:
      document.getElementById(
        "revisionNombre"
      ),

    tipo:
      document.getElementById(
        "revisionTipo"
      ),

    estado:
      document.getElementById(
        "revisionEstado"
      ),

    descripcion:
      document.getElementById(
        "revisionDescripcion"
      ),

    responsable:
      document.getElementById(
        "revisionResponsable"
      ),

    institucion:
      document.getElementById(
        "revisionInstitucion"
      ),

    modalidad:
      document.getElementById(
        "revisionModalidad"
      ),

    alcance:
      document.getElementById(
        "revisionAlcance"
      ),

    fechaInicio:
      document.getElementById(
        "revisionFechaInicio"
      ),

    fechaFinalizacion:
      document.getElementById(
        "revisionFechaFinalizacion"
      ),

    objetivoGeneral:
      document.getElementById(
        "revisionObjetivoGeneral"
      ),

    destinatarios:
      document.getElementById(
        "revisionDestinatarios"
      ),

    observaciones:
      document.getElementById(
        "revisionObservaciones"
      )

  }

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarNuevoPrograma
);


function iniciarNuevoPrograma() {

  if (!elementos.formulario) {

    console.error(
      "No se encontró el formulario de nuevo programa."
    );

    return;

  }

  registrarEventos();

  restaurarBorrador();

  actualizarContadores();

  actualizarProgreso();

  mostrarPaso(1);

  console.info(
    "FALCO Nuevo Programa Comunidad™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventos() {

  elementos.formulario.addEventListener(
    "input",
    manejarCambioFormulario
  );

  elementos.formulario.addEventListener(
    "change",
    manejarCambioFormulario
  );

  elementos.formulario.addEventListener(
    "submit",
    registrarPrograma
  );

  elementos.botonesSiguiente.forEach(
    (boton) => {

      boton.addEventListener(
        "click",
        manejarSiguientePaso
      );

    }
  );

  elementos.botonesAnterior.forEach(
    (boton) => {

      boton.addEventListener(
        "click",
        manejarPasoAnterior
      );

    }
  );

  elementos.botonesEditar.forEach(
    (boton) => {

      boton.addEventListener(
        "click",
        manejarEditarPaso
      );

    }
  );

  elementos.botonGuardarBorrador
    ?.addEventListener(
      "click",
      guardarBorrador
    );

  elementos.botonEliminarBorrador
    ?.addEventListener(
      "click",
      solicitarEliminarBorrador
    );

  elementos.botonCancelarConfirmacion
    ?.addEventListener(
      "click",
      cerrarModalConfirmacion
    );

  elementos.botonAceptarConfirmacion
    ?.addEventListener(
      "click",
      eliminarBorrador
    );

  elementos.modalConfirmacion
    ?.querySelectorAll(
      "[data-cerrar-confirmacion]"
    )
    .forEach((elemento) => {

      elemento.addEventListener(
        "click",
        cerrarModalConfirmacion
      );

    });

  elementos.botonAdministrarRegistrado
    ?.addEventListener(
      "click",
      abrirProgramaRegistrado
    );

  elementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacion
    );

  document.addEventListener(
    "keydown",
    manejarTeclado
  );

  window.addEventListener(
    "beforeunload",
    advertirSalida
  );

}


/* =========================================================
   CAMBIOS DEL FORMULARIO
========================================================= */

function manejarCambioFormulario(evento) {

  nuevoProgramaState.formularioModificado =
    true;

  actualizarEstadoFormulario(
    "Cambios sin guardar"
  );

  limpiarErrorCampo(
    evento.target
  );

  actualizarContadores();

  actualizarProgreso();

}


/* =========================================================
   NAVEGACIÓN ENTRE PASOS
========================================================= */

function manejarSiguientePaso(evento) {

  const pasoDestino =
    Number(
      evento.currentTarget.dataset
        .siguientePaso
    );

  const pasoActual =
    pasoDestino - 1;

  if (
    !validarPaso(pasoActual)
  ) {

    mostrarNotificacion({
      tipo: "error",
      titulo:
        "Revisá la información",
      mensaje:
        "Completá los campos obligatorios antes de continuar."
    });

    enfocarPrimerError();

    return;

  }

  if (
    pasoDestino === 3
  ) {

    actualizarRevision();

  }

  mostrarPaso(
    pasoDestino
  );

}


function manejarPasoAnterior(evento) {

  const pasoDestino =
    Number(
      evento.currentTarget.dataset
        .anteriorPaso
    );

  mostrarPaso(
    pasoDestino
  );

}


function manejarEditarPaso(evento) {

  const pasoDestino =
    Number(
      evento.currentTarget.dataset
        .editarPaso
    );

  mostrarPaso(
    pasoDestino
  );

}


function mostrarPaso(numeroPaso) {

  if (
    numeroPaso < 1 ||
    numeroPaso > TOTAL_PASOS
  ) {

    return;

  }

  nuevoProgramaState.pasoActual =
    numeroPaso;

  elementos.secciones.forEach(
    (seccion) => {

      const pasoSeccion =
        Number(
          seccion.dataset.paso
        );

      seccion.hidden =
        pasoSeccion !== numeroPaso;

    }
  );

  actualizarIndicadoresPaso();

  actualizarProgreso();

  const seccionVisible =
    elementos.secciones.find(
      (seccion) =>
        Number(
          seccion.dataset.paso
        ) === numeroPaso
    );

  seccionVisible?.scrollIntoView({
    behavior:
      "smooth",
    block:
      "start"
  });

}


/* =========================================================
   INDICADORES DE PASO
========================================================= */

function actualizarIndicadoresPaso() {

  elementos.indicadoresPaso.forEach(
    (indicador) => {

      const pasoIndicador =
        Number(
          indicador.dataset
            .pasoIndicador
        );

      indicador.classList.remove(
        "nuevo-programa-paso--activo",
        "nuevo-programa-paso--completo"
      );

      if (
        pasoIndicador ===
        nuevoProgramaState.pasoActual
      ) {

        indicador.classList.add(
          "nuevo-programa-paso--activo"
        );

      }

      if (
        pasoIndicador <
        nuevoProgramaState.pasoActual
      ) {

        indicador.classList.add(
          "nuevo-programa-paso--completo"
        );

      }

    }
  );

}


/* =========================================================
   PROGRESO
========================================================= */

function actualizarProgreso() {

  const camposEvaluados = [

    "nombre",

    "tipo",

    "estado",

    "descripcion",

    "responsable",

    "modalidad",

    "objetivoGeneral",

    "institucion",

    "alcance",

    "fechaInicio",

    "fechaFinalizacion",

    "destinatarios",

    "observaciones"

  ];

  const datos =
    obtenerDatosFormulario();

  const cantidadCompletos =
    camposEvaluados.filter(
      (campo) =>
        obtenerTexto(
          datos[campo]
        ) !== ""
    ).length;

  const porcentaje =
    Math.round(
      (
        cantidadCompletos /
        camposEvaluados.length
      ) * 100
    );

  establecerTexto(
    elementos.porcentajeFormulario,
    `${porcentaje}%`
  );

  if (
    elementos.barraProgreso
  ) {

    elementos.barraProgreso.style.width =
      `${porcentaje}%`;

  }

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function validarPaso(numeroPaso) {

  limpiarErroresPaso(
    numeroPaso
  );

  let valido =
    true;

  if (
    numeroPaso === 1
  ) {

    valido =
      validarCampoObligatorio(
        "nombre",
        "Ingresá el nombre del programa."
      ) && valido;

    valido =
      validarCampoObligatorio(
        "tipo",
        "Seleccioná el tipo de programa."
      ) && valido;

    valido =
      validarCampoObligatorio(
        "estado",
        "Seleccioná el estado inicial."
      ) && valido;

    valido =
      validarCampoObligatorio(
        "descripcion",
        "Ingresá una descripción general."
      ) && valido;

  }

  if (
    numeroPaso === 2
  ) {

    valido =
      validarCampoObligatorio(
        "responsable",
        "Ingresá el responsable o coordinador."
      ) && valido;

    valido =
      validarCampoObligatorio(
        "modalidad",
        "Seleccioná la modalidad."
      ) && valido;

    valido =
      validarCampoObligatorio(
        "objetivoGeneral",
        "Ingresá el objetivo general."
      ) && valido;

    valido =
      validarFechas() && valido;

  }

  return valido;

}


function validarFormularioCompleto() {

  const pasoUnoValido =
    validarPaso(1);

  const pasoDosValido =
    validarPaso(2);

  return (
    pasoUnoValido &&
    pasoDosValido
  );

}


function validarCampoObligatorio(
  nombreCampo,
  mensaje
) {

  const campo =
    obtenerCampo(
      nombreCampo
    );

  if (!campo) {

    return false;

  }

  const valor =
    obtenerTexto(
      campo.value
    );

  if (valor) {

    limpiarErrorCampo(
      campo
    );

    return true;

  }

  mostrarErrorCampo(
    campo,
    mensaje
  );

  return false;

}


function validarFechas() {

  const campoInicio =
    obtenerCampo(
      "fechaInicio"
    );

  const campoFinalizacion =
    obtenerCampo(
      "fechaFinalizacion"
    );

  if (
    !campoInicio ||
    !campoFinalizacion
  ) {

    return true;

  }

  limpiarErrorCampo(
    campoInicio
  );

  limpiarErrorCampo(
    campoFinalizacion
  );

  if (
    !campoInicio.value ||
    !campoFinalizacion.value
  ) {

    return true;

  }

  const fechaInicio =
    crearFechaLocal(
      campoInicio.value
    );

  const fechaFinalizacion =
    crearFechaLocal(
      campoFinalizacion.value
    );

  if (
    fechaFinalizacion <
    fechaInicio
  ) {

    mostrarErrorCampo(
      campoFinalizacion,
      "La fecha de finalización no puede ser anterior al inicio."
    );

    return false;

  }

  return true;

}


function mostrarErrorCampo(
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

  campo.classList.add(
    "nuevo-programa-campo__control--error"
  );

  const error =
    document.querySelector(
      `[data-error="${campo.name}"]`
    );

  establecerTexto(
    error,
    mensaje
  );

}


function limpiarErrorCampo(campo) {

  if (
    !campo ||
    !campo.name
  ) {

    return;

  }

  campo.removeAttribute(
    "aria-invalid"
  );

  campo.classList.remove(
    "nuevo-programa-campo__control--error"
  );

  const error =
    document.querySelector(
      `[data-error="${campo.name}"]`
    );

  establecerTexto(
    error,
    ""
  );

}


function limpiarErroresPaso(numeroPaso) {

  const seccion =
    elementos.secciones.find(
      (elemento) =>
        Number(
          elemento.dataset.paso
        ) === numeroPaso
    );

  seccion
    ?.querySelectorAll(
      ".nuevo-programa-campo__control"
    )
    .forEach(
      limpiarErrorCampo
    );

}


function enfocarPrimerError() {

  const campoError =
    elementos.formulario.querySelector(
      '[aria-invalid="true"]'
    );

  campoError?.focus();

  campoError?.scrollIntoView({
    behavior:
      "smooth",
    block:
      "center"
  });

}


/* =========================================================
   DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormulario() {

  const formData =
    new FormData(
      elementos.formulario
    );

  return {

    nombre:
      obtenerTexto(
        formData.get("nombre")
      ),

    tipo:
      obtenerTexto(
        formData.get("tipo")
      ),

    estado:
      obtenerTexto(
        formData.get("estado")
      ) || "preparacion",

    descripcion:
      obtenerTexto(
        formData.get("descripcion")
      ),

    responsable:
      obtenerTexto(
        formData.get("responsable")
      ),

    institucion:
      obtenerTexto(
        formData.get("institucion")
      ),

    modalidad:
      obtenerTexto(
        formData.get("modalidad")
      ),

    alcance:
      obtenerTexto(
        formData.get("alcance")
      ),

    fechaInicio:
      obtenerTexto(
        formData.get("fechaInicio")
      ),

    fechaFinalizacion:
      obtenerTexto(
        formData.get(
          "fechaFinalizacion"
        )
      ),

    objetivoGeneral:
      obtenerTexto(
        formData.get(
          "objetivoGeneral"
        )
      ),

    destinatarios:
      obtenerTexto(
        formData.get(
          "destinatarios"
        )
      ),

    observaciones:
      obtenerTexto(
        formData.get(
          "observaciones"
        )
      )

  };

}


function completarFormulario(datos) {

  Object.entries(
    datos
  ).forEach(
    ([nombre, valor]) => {

      const campo =
        obtenerCampo(
          nombre
        );

      if (!campo) {

        return;

      }

      campo.value =
        valor ?? "";

    }
  );

}


/* =========================================================
   REVISIÓN FINAL
========================================================= */

function actualizarRevision() {

  const datos =
    obtenerDatosFormulario();

  establecerTexto(
    elementos.revision.nombre,
    datos.nombre || "—"
  );

  establecerTexto(
    elementos.revision.tipo,
    TIPOS_PROGRAMA[
      datos.tipo
    ] || "—"
  );

  establecerTexto(
    elementos.revision.estado,
    ESTADOS_PROGRAMA[
      datos.estado
    ] || "—"
  );

  establecerTexto(
    elementos.revision.descripcion,
    datos.descripcion || "—"
  );

  establecerTexto(
    elementos.revision.responsable,
    datos.responsable || "—"
  );

  establecerTexto(
    elementos.revision.institucion,
    datos.institucion ||
    "Sin institución vinculada"
  );

  establecerTexto(
    elementos.revision.modalidad,
    datos.modalidad || "—"
  );

  establecerTexto(
    elementos.revision.alcance,
    datos.alcance ||
    "Sin definir"
  );

  establecerTexto(
    elementos.revision.fechaInicio,
    formatearFecha(
      datos.fechaInicio
    )
  );

  establecerTexto(
    elementos.revision.fechaFinalizacion,
    formatearFecha(
      datos.fechaFinalizacion
    )
  );

  establecerTexto(
    elementos.revision.objetivoGeneral,
    datos.objetivoGeneral || "—"
  );

  establecerTexto(
    elementos.revision.destinatarios,
    datos.destinatarios ||
    "Sin información registrada"
  );

  establecerTexto(
    elementos.revision.observaciones,
    datos.observaciones ||
    "Sin observaciones"
  );

}


/* =========================================================
   CONTADORES
========================================================= */

function actualizarContadores() {

  actualizarContadorCampo(
    "descripcion",
    elementos.contadorDescripcion,
    800
  );

  actualizarContadorCampo(
    "objetivoGeneral",
    elementos.contadorObjetivoGeneral,
    600
  );

  actualizarContadorCampo(
    "destinatarios",
    elementos.contadorDestinatarios,
    500
  );

  actualizarContadorCampo(
    "observaciones",
    elementos.contadorObservaciones,
    800
  );

}


function actualizarContadorCampo(
  nombreCampo,
  elementoContador,
  limite
) {

  const campo =
    obtenerCampo(
      nombreCampo
    );

  if (
    !campo ||
    !elementoContador
  ) {

    return;

  }

  establecerTexto(
    elementoContador,
    `${campo.value.length} / ${limite}`
  );

}


/* =========================================================
   BORRADOR
========================================================= */

function guardarBorrador() {

  try {

    const borrador = {

      datos:
        obtenerDatosFormulario(),

      pasoActual:
        nuevoProgramaState.pasoActual,

      fechaGuardado:
        new Date().toISOString()

    };

    localStorage.setItem(
      BORRADOR_PROGRAMA_STORAGE_KEY,
      JSON.stringify(
        borrador
      )
    );

    nuevoProgramaState.formularioModificado =
      false;

    actualizarEstadoFormulario(
      "Borrador guardado"
    );

    mostrarNotificacion({
      tipo:
        "success",
      titulo:
        "Borrador guardado",
      mensaje:
        "La información quedó almacenada en este dispositivo."
    });

  } catch (error) {

    console.error(
      "No fue posible guardar el borrador:",
      error
    );

    mostrarNotificacion({
      tipo:
        "error",
      titulo:
        "No pudimos guardar el borrador",
      mensaje:
        "La información temporal no pudo almacenarse."
    });

  }

}


function restaurarBorrador() {

  try {

    const contenido =
      localStorage.getItem(
        BORRADOR_PROGRAMA_STORAGE_KEY
      );

    if (!contenido) {

      return;

    }

    const borrador =
      JSON.parse(
        contenido
      );

    if (
      !borrador ||
      typeof borrador !== "object" ||
      !borrador.datos
    ) {

      return;

    }

    completarFormulario(
      borrador.datos
    );

    nuevoProgramaState.formularioModificado =
      false;

    actualizarEstadoFormulario(
      "Borrador restaurado"
    );

    mostrarNotificacion({
      tipo:
        "info",
      titulo:
        "Borrador restaurado",
      mensaje:
        "Recuperamos la información guardada anteriormente."
    });

  } catch (error) {

    console.error(
      "No fue posible restaurar el borrador:",
      error
    );

  }

}


function solicitarEliminarBorrador() {

  const existeBorrador =
    Boolean(
      localStorage.getItem(
        BORRADOR_PROGRAMA_STORAGE_KEY
      )
    );

  const hayContenido =
    formularioTieneContenido();

  if (
    !existeBorrador &&
    !hayContenido
  ) {

    mostrarNotificacion({
      tipo:
        "info",
      titulo:
        "No hay borrador",
      mensaje:
        "No encontramos información temporal para eliminar."
    });

    return;

  }

  abrirModalConfirmacion();

}


function eliminarBorrador() {

  try {

    localStorage.removeItem(
      BORRADOR_PROGRAMA_STORAGE_KEY
    );

    elementos.formulario.reset();

    limpiarTodosLosErrores();

    nuevoProgramaState.formularioModificado =
      false;

    mostrarPaso(1);

    actualizarContadores();

    actualizarProgreso();

    actualizarEstadoFormulario(
      "Sin guardar"
    );

    cerrarModalConfirmacion();

    mostrarNotificacion({
      tipo:
        "success",
      titulo:
        "Borrador eliminado",
      mensaje:
        "El formulario quedó vacío y listo para un nuevo registro."
    });

    obtenerCampo(
      "nombre"
    )?.focus();

  } catch (error) {

    console.error(
      "No fue posible eliminar el borrador:",
      error
    );

  }

}


function formularioTieneContenido() {

  const datos =
    obtenerDatosFormulario();

  return Object.values(
    datos
  ).some(
    (valor) =>
      obtenerTexto(
        valor
      ) !== "" &&
      valor !== "preparacion"
  );

}


/* =========================================================
   REGISTRO DEL PROGRAMA
========================================================= */

function registrarPrograma(evento) {

  evento.preventDefault();

  if (
    !validarFormularioCompleto()
  ) {

    const pasoConError =
      obtenerPrimerPasoConError();

    mostrarPaso(
      pasoConError
    );

    mostrarNotificacion({
      tipo:
        "error",
      titulo:
        "No fue posible registrar",
      mensaje:
        "Revisá los campos obligatorios antes de continuar."
    });

    window.setTimeout(
      enfocarPrimerError,
      100
    );

    return;

  }

  establecerEstadoRegistro(
    true
  );

  window.setTimeout(() => {

    try {

      const datos =
        obtenerDatosFormulario();

      const programas =
        cargarProgramasGuardados();

      const ahora =
        new Date().toISOString();

      const id =
        generarProgramaId();

      const referencia =
        generarReferenciaPrograma();

      const nuevoPrograma = {

        id,

        referencia,

        nombre:
          datos.nombre,

        tipo:
          datos.tipo,

        estado:
          datos.estado,

        descripcion:
          datos.descripcion,

        responsable:
          datos.responsable,

        institucion:
          datos.institucion ||
          "Sin institución asociada",

        modalidad:
          datos.modalidad,

        alcance:
          datos.alcance,

        fechaInicio:
          datos.fechaInicio,

        fechaFinalizacion:
          datos.fechaFinalizacion,

        objetivoGeneral:
          datos.objetivoGeneral,

        destinatarios:
          datos.destinatarios,

        observaciones:
          datos.observaciones,

        actividades:
          [],

        institucionesVinculadas:
          [],

        participantes:
          [],

        documentos:
          [],

        agenda:
          [],

        seguimientos:
          [],

        fechaCreacion:
          ahora,

        fechaActualizacion:
          ahora

      };

      programas.unshift(
        nuevoPrograma
      );

      localStorage.setItem(
        PROGRAMAS_STORAGE_KEY,
        JSON.stringify(
          programas
        )
      );

      localStorage.removeItem(
        BORRADOR_PROGRAMA_STORAGE_KEY
      );

      nuevoProgramaState.formularioModificado =
        false;

      nuevoProgramaState.formularioEnviado =
        true;

      nuevoProgramaState.programaRegistradoId =
        id;

      establecerTexto(
        elementos.referenciaRegistrada,
        referencia
      );

      establecerEstadoRegistro(
        false
      );

      abrirModalRegistrado();

    } catch (error) {

      console.error(
        "No fue posible registrar el programa:",
        error
      );

      establecerEstadoRegistro(
        false
      );

      mostrarNotificacion({
        tipo:
          "error",
        titulo:
          "No pudimos registrar el programa",
        mensaje:
          "Se produjo un inconveniente al guardar la información."
      });

    }

  }, 550);

}


function cargarProgramasGuardados() {

  try {

    const contenido =
      localStorage.getItem(
        PROGRAMAS_STORAGE_KEY
      );

    if (!contenido) {

      return [];

    }

    const programas =
      JSON.parse(
        contenido
      );

    return Array.isArray(
      programas
    )
      ? programas
      : [];

  } catch {

    return [];

  }

}


function establecerEstadoRegistro(
  cargando
) {

  if (
    !elementos.botonRegistrar
  ) {

    return;

  }

  elementos.botonRegistrar.disabled =
    cargando;

  elementos.botonRegistrar.classList.toggle(
    "nuevo-programa-boton--cargando",
    cargando
  );

  establecerTexto(
    elementos.botonRegistrarIcono,
    cargando
      ? ""
      : "✓"
  );

  establecerTexto(
    elementos.botonRegistrarTexto,
    cargando
      ? "Registrando…"
      : "Registrar programa"
  );

}


/* =========================================================
   MODAL DE REGISTRO
========================================================= */

function abrirModalRegistrado() {

  if (
    !elementos.modalRegistrado
  ) {

    return;

  }

  elementos.modalRegistrado.hidden =
    false;

  document.body.style.overflow =
    "hidden";

  window.setTimeout(() => {

    elementos.botonAdministrarRegistrado
      ?.focus();

  }, 50);

}


function abrirProgramaRegistrado() {

  const id =
    nuevoProgramaState
      .programaRegistradoId;

  if (!id) {

    window.location.href =
      "./programas.html";

    return;

  }

  const destino =
    new URL(
      "./programa.html",
      window.location.href
    );

  destino.searchParams.set(
    "id",
    id
  );

  window.location.href =
    destino.toString();

}


/* =========================================================
   MODAL DE CONFIRMACIÓN
========================================================= */

function abrirModalConfirmacion() {

  if (
    !elementos.modalConfirmacion
  ) {

    return;

  }

  establecerTexto(
    elementos.modalConfirmacionTitulo,
    "Eliminar borrador"
  );

  establecerTexto(
    elementos.modalConfirmacionMensaje,
    "Se eliminarán los datos guardados temporalmente y se vaciará el formulario."
  );

  elementos.modalConfirmacion.hidden =
    false;

  document.body.style.overflow =
    "hidden";

  window.setTimeout(() => {

    elementos.botonAceptarConfirmacion
      ?.focus();

  }, 50);

}


function cerrarModalConfirmacion() {

  if (
    !elementos.modalConfirmacion
  ) {

    return;

  }

  elementos.modalConfirmacion.hidden =
    true;

  document.body.style.overflow =
    "";

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacion({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !elementos.notificacion
  ) {

    return;

  }

  window.clearTimeout(
    nuevoProgramaState
      .temporizadorNotificacion
  );

  const configuracion =
    obtenerConfiguracionNotificacion(
      tipo
    );

  establecerTexto(
    elementos.notificacionIcono,
    configuracion.icono
  );

  establecerTexto(
    elementos.notificacionTitulo,
    titulo
  );

  establecerTexto(
    elementos.notificacionMensaje,
    mensaje
  );

  elementos.notificacion.style.borderColor =
    configuracion.borde;

  elementos.notificacionIcono.style.color =
    configuracion.color;

  elementos.notificacionIcono.style.borderColor =
    configuracion.borde;

  elementos.notificacionIcono.style.background =
    configuracion.fondo;

  elementos.notificacion.hidden =
    false;

  nuevoProgramaState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacion,
      4500
    );

}


function ocultarNotificacion() {

  if (
    !elementos.notificacion
  ) {

    return;

  }

  elementos.notificacion.hidden =
    true;

  window.clearTimeout(
    nuevoProgramaState
      .temporizadorNotificacion
  );

}


function obtenerConfiguracionNotificacion(
  tipo
) {

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

  return (
    configuraciones[tipo] ||
    configuraciones.success
  );

}


/* =========================================================
   ESTADO DEL FORMULARIO
========================================================= */

function actualizarEstadoFormulario(
  texto
) {

  establecerTexto(
    elementos.estadoFormulario,
    texto
  );

}


/* =========================================================
   ERRORES GENERALES
========================================================= */

function limpiarTodosLosErrores() {

  elementos.formulario
    .querySelectorAll(
      ".nuevo-programa-campo__control"
    )
    .forEach(
      limpiarErrorCampo
    );

}


function obtenerPrimerPasoConError() {

  const primerError =
    elementos.formulario.querySelector(
      '[aria-invalid="true"]'
    );

  const seccion =
    primerError?.closest(
      "[data-paso]"
    );

  return Number(
    seccion?.dataset.paso
  ) || 1;

}


/* =========================================================
   TECLADO Y SALIDA
========================================================= */

function manejarTeclado(evento) {

  if (
    evento.key !== "Escape"
  ) {

    return;

  }

  if (
    elementos.modalConfirmacion &&
    !elementos.modalConfirmacion.hidden
  ) {

    cerrarModalConfirmacion();

  }

}


function advertirSalida(evento) {

  if (
    !nuevoProgramaState
      .formularioModificado ||
    nuevoProgramaState
      .formularioEnviado
  ) {

    return;

  }

  evento.preventDefault();

  evento.returnValue =
    "";

}


/* =========================================================
   GENERADORES
========================================================= */

function generarProgramaId() {

  const fecha =
    Date.now()
      .toString(36)
      .toUpperCase();

  const aleatorio =
    Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase();

  return `PROG-${fecha}-${aleatorio}`;

}


function generarReferenciaPrograma() {

  const fecha =
    new Date();

  const anio =
    fecha.getFullYear();

  const codigo =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

  return `FALCO-PROG-${anio}-${codigo}`;

}


/* =========================================================
   FECHAS
========================================================= */

function formatearFecha(valor) {

  if (!valor) {

    return "Sin fecha definida";

  }

  try {

    const fecha =
      crearFechaLocal(
        valor
      );

    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {

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

  } catch {

    return "Sin fecha definida";

  }

}


function crearFechaLocal(valor) {

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

  return new Date(
    valor
  );

}


/* =========================================================
   UTILIDADES
========================================================= */

function obtenerCampo(nombre) {

  return elementos.formulario
    .elements
    .namedItem(
      nombre
    );

}


function obtenerTexto(valor) {

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


function establecerTexto(
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