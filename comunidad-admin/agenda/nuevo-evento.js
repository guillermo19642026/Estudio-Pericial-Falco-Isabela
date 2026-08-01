/* =========================================================
   FALCO® COMUNIDAD
   NUEVO EVENTO
   nuevo-evento.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const NUEVO_EVENTO_STORAGE_KEY =
  "falcoComunidadAgenda";

const NUEVO_EVENTO_BORRADOR_KEY =
  "falcoComunidadAgendaBorrador";

const NUEVO_EVENTO_PROGRAMAS_KEY =
  "falcoComunidadProgramas";

const NUEVO_EVENTO_PROYECTOS_KEYS = [

  "falcoComunidadProyectos",

  "falcoProyectos"

];

const NUEVO_EVENTO_PAGINA_AGENDA =
  "./agenda.html";


/* =========================================================
   CATÁLOGOS
========================================================= */

const NUEVO_EVENTO_TIPOS = {

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


const NUEVO_EVENTO_ESTADOS = {

  pendiente:
    "Pendiente",

  confirmado:
    "Confirmado",

  finalizado:
    "Finalizado",

  cancelado:
    "Cancelado"

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const nuevoEventoState = {

  programas:
    [],

  proyectos:
    [],

  borradorRecuperado:
    false,

  guardando:
    false,

  temporizadorBorrador:
    null,

  temporizadorNotificacion:
    null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const nuevoEventoElementos = {

  formulario:
    document.getElementById(
      "formularioNuevoEvento"
    ),

  botonGuardarBorrador:
    document.getElementById(
      "botonGuardarBorradorEvento"
    ),

  botonRegistrar:
    document.getElementById(
      "botonRegistrarEvento"
    ),

  botonDescartarBorrador:
    document.getElementById(
      "botonDescartarBorrador"
    ),

  avisoBorrador:
    document.getElementById(
      "nuevoEventoBorradorAviso"
    ),


  /* -------------------------------------------------------
     CAMPOS
  ------------------------------------------------------- */

  titulo:
    document.getElementById(
      "eventoTitulo"
    ),

  tipo:
    document.getElementById(
      "eventoTipo"
    ),

  estado:
    document.getElementById(
      "eventoEstado"
    ),

  descripcion:
    document.getElementById(
      "eventoDescripcion"
    ),

  fecha:
    document.getElementById(
      "eventoFecha"
    ),

  hora:
    document.getElementById(
      "eventoHora"
    ),

  duracion:
    document.getElementById(
      "eventoDuracion"
    ),

  modalidad:
    document.getElementById(
      "eventoModalidad"
    ),

  lugar:
    document.getElementById(
      "eventoLugar"
    ),

  responsable:
    document.getElementById(
      "eventoResponsable"
    ),

  institucion:
    document.getElementById(
      "eventoInstitucion"
    ),

  programa:
    document.getElementById(
      "eventoPrograma"
    ),

  proyecto:
    document.getElementById(
      "eventoProyecto"
    ),

  observaciones:
    document.getElementById(
      "eventoObservaciones"
    ),


  /* -------------------------------------------------------
     RESUMEN
  ------------------------------------------------------- */

  resumenTipo:
    document.getElementById(
      "resumenEventoTipo"
    ),

  resumenTitulo:
    document.getElementById(
      "resumenEventoTitulo"
    ),

  resumenDescripcion:
    document.getElementById(
      "resumenEventoDescripcion"
    ),

  resumenFecha:
    document.getElementById(
      "resumenEventoFecha"
    ),

  resumenHora:
    document.getElementById(
      "resumenEventoHora"
    ),

  resumenModalidad:
    document.getElementById(
      "resumenEventoModalidad"
    ),

  resumenResponsable:
    document.getElementById(
      "resumenEventoResponsable"
    ),


  /* -------------------------------------------------------
     ESTADO DEL FORMULARIO
  ------------------------------------------------------- */

  estadoContenedor:
    document.querySelector(
      ".nuevo-evento-estado"
    ),

  estadoIcono:
    document.getElementById(
      "nuevoEventoEstadoIcono"
    ),

  estadoTitulo:
    document.getElementById(
      "nuevoEventoEstadoTitulo"
    ),

  estadoMensaje:
    document.getElementById(
      "nuevoEventoEstadoMensaje"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "nuevoEventoNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "nuevoEventoNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "nuevoEventoNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "nuevoEventoNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "nuevoEventoNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarNuevoEvento
);


function iniciarNuevoEvento() {

  if (
    !nuevoEventoElementos.formulario
  ) {

    console.error(
      "No se encontró el formulario de nuevo evento."
    );

    return;

  }


  registrarEventosNuevoEvento();

  cargarProgramasNuevoEvento();

  cargarProyectosNuevoEvento();

  cargarSelectProgramasNuevoEvento();

  cargarSelectProyectosNuevoEvento();

  establecerFechaInicialNuevoEvento();

  recuperarBorradorNuevoEvento();

  actualizarVistaPreviaNuevoEvento();

  actualizarEstadoFormularioNuevoEvento();


  console.info(
    "FALCO Comunidad Nuevo Evento™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventosNuevoEvento() {

  nuevoEventoElementos.formulario
    ?.addEventListener(
      "submit",
      registrarNuevoEvento
    );


  nuevoEventoElementos.formulario
    ?.addEventListener(
      "input",
      manejarCambioFormularioNuevoEvento
    );


  nuevoEventoElementos.formulario
    ?.addEventListener(
      "change",
      manejarCambioFormularioNuevoEvento
    );


  nuevoEventoElementos.botonGuardarBorrador
    ?.addEventListener(
      "click",
      guardarBorradorNuevoEvento
    );


  nuevoEventoElementos.botonDescartarBorrador
    ?.addEventListener(
      "click",
      descartarBorradorNuevoEvento
    );


  nuevoEventoElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionNuevoEvento
    );


  window.addEventListener(
    "beforeunload",
    guardarBorradorAutomaticoNuevoEvento
  );

}


/* =========================================================
   CAMBIOS DEL FORMULARIO
========================================================= */

function manejarCambioFormularioNuevoEvento(
  evento
) {

  limpiarErrorCampoNuevoEvento(
    evento.target
  );


  actualizarVistaPreviaNuevoEvento();

  actualizarEstadoFormularioNuevoEvento();

  programarGuardadoBorradorNuevoEvento();

}


/* =========================================================
   FECHA INICIAL
========================================================= */

function establecerFechaInicialNuevoEvento() {

  if (
    nuevoEventoElementos.fecha?.value
  ) {

    return;

  }


  const hoy =
    new Date();


  nuevoEventoElementos.fecha.value =
    normalizarFechaInputNuevoEvento(
      hoy
    );

}


/* =========================================================
   CARGA DE PROGRAMAS
========================================================= */

function cargarProgramasNuevoEvento() {

  try {

    const contenido =
      localStorage.getItem(
        NUEVO_EVENTO_PROGRAMAS_KEY
      );


    if (!contenido) {

      nuevoEventoState.programas =
        [];

      return;

    }


    const programas =
      JSON.parse(
        contenido
      );


    nuevoEventoState.programas =
      Array.isArray(programas)
        ? programas
        : [];

  } catch (error) {

    console.error(
      "No fue posible cargar los programas:",
      error
    );


    nuevoEventoState.programas =
      [];

  }

}


/* =========================================================
   CARGA DE PROYECTOS
========================================================= */

function cargarProyectosNuevoEvento() {

  nuevoEventoState.proyectos =
    obtenerPrimeraColeccionNuevoEvento(
      NUEVO_EVENTO_PROYECTOS_KEYS
    );

}


/* =========================================================
   SELECT DE PROGRAMAS
========================================================= */

function cargarSelectProgramasNuevoEvento() {

  const select =
    nuevoEventoElementos.programa;


  if (!select) {

    return;

  }


  const valorActual =
    select.value;


  select.innerHTML = `
    <option value="">
      Sin programa asociado
    </option>
  `;


  nuevoEventoState.programas
    .slice()
    .sort(
      ordenarPorNombreNuevoEvento
    )
    .forEach(
      (programa) => {

        const id =
          obtenerTextoNuevoEvento(
            programa.id
          );


        if (!id) {

          return;

        }


        const nombre =
          obtenerTextoNuevoEvento(
            programa.nombre ||
            programa.titulo
          ) ||
          "Programa sin nombre";


        const opcion =
          document.createElement(
            "option"
          );


        opcion.value =
          id;


        opcion.textContent =
          nombre;


        select.appendChild(
          opcion
        );

      }
    );


  if (
    valorActual &&
    Array.from(
      select.options
    ).some(
      (opcion) =>
        opcion.value ===
        valorActual
    )
  ) {

    select.value =
      valorActual;

  }

}


/* =========================================================
   SELECT DE PROYECTOS
========================================================= */

function cargarSelectProyectosNuevoEvento() {

  const select =
    nuevoEventoElementos.proyecto;


  if (!select) {

    return;

  }


  const valorActual =
    select.value;


  select.innerHTML = `
    <option value="">
      Sin proyecto asociado
    </option>
  `;


  nuevoEventoState.proyectos
    .slice()
    .sort(
      ordenarPorNombreNuevoEvento
    )
    .forEach(
      (proyecto) => {

        const id =
          obtenerTextoNuevoEvento(
            proyecto.id ||
            proyecto.proyectoId
          );


        if (!id) {

          return;

        }


        const nombre =
          obtenerTextoNuevoEvento(
            proyecto.nombre ||
            proyecto.titulo
          ) ||
          "Proyecto sin nombre";


        const opcion =
          document.createElement(
            "option"
          );


        opcion.value =
          id;


        opcion.textContent =
          nombre;


        select.appendChild(
          opcion
        );

      }
    );


  if (
    valorActual &&
    Array.from(
      select.options
    ).some(
      (opcion) =>
        opcion.value ===
        valorActual
    )
  ) {

    select.value =
      valorActual;

  }

}


/* =========================================================
   OBTENER COLECCIÓN DESDE STORAGE
========================================================= */

function obtenerPrimeraColeccionNuevoEvento(
  claves
) {

  for (
    const clave of claves
  ) {

    try {

      const contenido =
        localStorage.getItem(
          clave
        );


      if (!contenido) {

        continue;

      }


      const datos =
        JSON.parse(
          contenido
        );


      if (
        Array.isArray(datos)
      ) {

        return datos;

      }

    } catch (error) {

      console.warn(
        `No fue posible leer ${clave}:`,
        error
      );

    }

  }


  return [];

}


/* =========================================================
   VISTA PREVIA
========================================================= */

function actualizarVistaPreviaNuevoEvento() {

  const datos =
    obtenerDatosFormularioNuevoEvento();


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenTipo,
    NUEVO_EVENTO_TIPOS[
      datos.tipo
    ] ||
    "Evento sin definir"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenTitulo,
    datos.titulo ||
    "Nuevo evento"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenDescripcion,
    datos.descripcion ||
    "La descripción aparecerá aquí."
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenFecha,
    datos.fecha
      ? formatearFechaNuevoEvento(
          datos.fecha
        )
      : "Sin fecha"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenHora,
    datos.hora ||
    "Sin horario"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenModalidad,
    datos.modalidad ||
    "Sin definir"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.resumenResponsable,
    datos.responsable ||
    "Sin responsable"
  );

}


/* =========================================================
   ESTADO DEL FORMULARIO
========================================================= */

function actualizarEstadoFormularioNuevoEvento() {

  const datos =
    obtenerDatosFormularioNuevoEvento();


  const camposObligatoriosCompletos =
    Boolean(
      datos.titulo &&
      datos.tipo &&
      datos.estado &&
      datos.fecha
    );


  nuevoEventoElementos.estadoContenedor
    ?.classList.remove(
      "nuevo-evento-estado--completo",
      "nuevo-evento-estado--error"
    );


  if (
    camposObligatoriosCompletos
  ) {

    nuevoEventoElementos.estadoContenedor
      ?.classList.add(
        "nuevo-evento-estado--completo"
      );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoIcono,
      "✓"
    );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoTitulo,
      "Evento listo para registrar"
    );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoMensaje,
      "Los campos obligatorios están completos."
    );


    return;

  }


  establecerTextoNuevoEvento(
    nuevoEventoElementos.estadoIcono,
    "◌"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.estadoTitulo,
    "Formulario en preparación"
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.estadoMensaje,
    "Completá los campos obligatorios para registrar el evento."
  );

}


/* =========================================================
   DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormularioNuevoEvento() {

  const formulario =
    nuevoEventoElementos.formulario;


  const datos =
    new FormData(
      formulario
    );


  const programaId =
    obtenerTextoNuevoEvento(
      datos.get(
        "programaId"
      )
    );


  const proyectoId =
    obtenerTextoNuevoEvento(
      datos.get(
        "proyectoId"
      )
    );


  const programa =
    nuevoEventoState.programas.find(
      (registro) =>
        obtenerTextoNuevoEvento(
          registro.id
        ) ===
        programaId
    );


  const proyecto =
    nuevoEventoState.proyectos.find(
      (registro) =>
        obtenerTextoNuevoEvento(
          registro.id ||
          registro.proyectoId
        ) ===
        proyectoId
    );


  return {

    titulo:
      obtenerTextoNuevoEvento(
        datos.get("titulo")
      ),

    tipo:
      obtenerTextoNuevoEvento(
        datos.get("tipo")
      ),

    estado:
      obtenerTextoNuevoEvento(
        datos.get("estado")
      ) ||
      "pendiente",

    descripcion:
      obtenerTextoNuevoEvento(
        datos.get("descripcion")
      ),

    fecha:
      obtenerTextoNuevoEvento(
        datos.get("fecha")
      ),

    hora:
      obtenerTextoNuevoEvento(
        datos.get("hora")
      ),

    duracion:
      obtenerTextoNuevoEvento(
        datos.get("duracion")
      ),

    modalidad:
      obtenerTextoNuevoEvento(
        datos.get("modalidad")
      ),

    lugar:
      obtenerTextoNuevoEvento(
        datos.get("lugar")
      ),

    responsable:
      obtenerTextoNuevoEvento(
        datos.get("responsable")
      ),

    institucion:
      obtenerTextoNuevoEvento(
        datos.get("institucion")
      ),

    programaId,

    programa:
      obtenerTextoNuevoEvento(
        programa?.nombre ||
        programa?.titulo
      ),

    proyectoId,

    proyecto:
      obtenerTextoNuevoEvento(
        proyecto?.nombre ||
        proyecto?.titulo
      ),

    observaciones:
      obtenerTextoNuevoEvento(
        datos.get("observaciones")
      )

  };

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function validarFormularioNuevoEvento() {

  limpiarErroresNuevoEvento();


  const validaciones = [

    {
      campo:
        nuevoEventoElementos.titulo,

      mensaje:
        "Ingresá el título del evento."
    },

    {
      campo:
        nuevoEventoElementos.tipo,

      mensaje:
        "Seleccioná el tipo de evento."
    },

    {
      campo:
        nuevoEventoElementos.estado,

      mensaje:
        "Seleccioná el estado."
    },

    {
      campo:
        nuevoEventoElementos.fecha,

      mensaje:
        "Seleccioná la fecha."
    }

  ];


  let valido =
    true;


  validaciones.forEach(
    ({
      campo,
      mensaje
    }) => {

      if (
        !campo ||
        !obtenerTextoNuevoEvento(
          campo.value
        )
      ) {

        mostrarErrorCampoNuevoEvento(
          campo,
          mensaje
        );


        valido =
          false;

      }

    }
  );


  if (
    !valido
  ) {

    nuevoEventoElementos.estadoContenedor
      ?.classList.remove(
        "nuevo-evento-estado--completo"
      );


    nuevoEventoElementos.estadoContenedor
      ?.classList.add(
        "nuevo-evento-estado--error"
      );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoIcono,
      "!"
    );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoTitulo,
      "Revisá el formulario"
    );


    establecerTextoNuevoEvento(
      nuevoEventoElementos.estadoMensaje,
      "Hay campos obligatorios que todavía no fueron completados."
    );

  }


  return valido;

}


/* =========================================================
   ERRORES DE CAMPOS
========================================================= */

function mostrarErrorCampoNuevoEvento(
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


  campo
    .closest(
      ".nuevo-evento-campo"
    )
    ?.classList.add(
      "nuevo-evento-campo--error"
    );


  const error =
    nuevoEventoElementos.formulario
      .querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoNuevoEvento(
    error,
    mensaje
  );

}


function limpiarErrorCampoNuevoEvento(
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


  campo
    .closest(
      ".nuevo-evento-campo"
    )
    ?.classList.remove(
      "nuevo-evento-campo--error"
    );


  const error =
    nuevoEventoElementos.formulario
      .querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoNuevoEvento(
    error,
    ""
  );

}


function limpiarErroresNuevoEvento() {

  nuevoEventoElementos.formulario
    .querySelectorAll(
      "input, select, textarea"
    )
    .forEach(
      limpiarErrorCampoNuevoEvento
    );

}


/* =========================================================
   ENFOCAR PRIMER ERROR
========================================================= */

function enfocarPrimerErrorNuevoEvento() {

  nuevoEventoElementos.formulario
    .querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}

/* =========================================================
   REGISTRAR EVENTO
========================================================= */

function registrarNuevoEvento(
  evento
) {

  evento.preventDefault();


  if (
    nuevoEventoState.guardando
  ) {

    return;

  }


  if (
    !validarFormularioNuevoEvento()
  ) {

    mostrarNotificacionNuevoEvento({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Completá los campos obligatorios antes de registrar el evento."

    });


    enfocarPrimerErrorNuevoEvento();

    return;

  }


  const datos =
    obtenerDatosFormularioNuevoEvento();


  const ahora =
    new Date().toISOString();


  const nuevoEvento = {

    id:
      generarIdNuevoEvento(),

    ...datos,

    origen:
      "agenda",

    editable:
      true,

    fechaCreacion:
      ahora,

    fechaActualizacion:
      ahora

  };


  const eventos =
    cargarEventosGuardadosNuevoEvento();


  eventos.unshift(
    nuevoEvento
  );


  activarEstadoCargaNuevoEvento();


  window.setTimeout(
    () => {

      try {

        localStorage.setItem(
          NUEVO_EVENTO_STORAGE_KEY,
          JSON.stringify(
            eventos
          )
        );


        eliminarBorradorNuevoEvento();


        mostrarNotificacionNuevoEvento({

          tipo:
            "success",

          titulo:
            "Evento registrado",

          mensaje:
            "El evento fue incorporado correctamente a la Agenda institucional."

        });


        window.setTimeout(
          () => {

            window.location.href =
              NUEVO_EVENTO_PAGINA_AGENDA;

          },
          650
        );

      } catch (error) {

        console.error(
          "No fue posible registrar el evento:",
          error
        );


        desactivarEstadoCargaNuevoEvento();


        mostrarNotificacionNuevoEvento({

          tipo:
            "error",

          titulo:
            "No pudimos registrar el evento",

          mensaje:
            "Se produjo un inconveniente al guardar la información."

        });

      }

    },
    350
  );

}


/* =========================================================
   CARGAR EVENTOS GUARDADOS
========================================================= */

function cargarEventosGuardadosNuevoEvento() {

  try {

    const contenido =
      localStorage.getItem(
        NUEVO_EVENTO_STORAGE_KEY
      );


    if (!contenido) {

      return [];

    }


    const eventos =
      JSON.parse(
        contenido
      );


    return Array.isArray(eventos)
      ? eventos
      : [];

  } catch (error) {

    console.error(
      "No fue posible leer los eventos guardados:",
      error
    );


    return [];

  }

}


/* =========================================================
   GUARDAR BORRADOR
========================================================= */

function guardarBorradorNuevoEvento() {

  const datos =
    obtenerDatosFormularioNuevoEvento();


  const tieneContenido =
    Object.values(
      datos
    ).some(
      (valor) =>
        obtenerTextoNuevoEvento(
          valor
        )
    );


  if (!tieneContenido) {

    mostrarNotificacionNuevoEvento({

      tipo:
        "info",

      titulo:
        "No hay información para guardar",

      mensaje:
        "Completá al menos un campo antes de guardar el borrador."

    });


    return false;

  }


  try {

    localStorage.setItem(
      NUEVO_EVENTO_BORRADOR_KEY,
      JSON.stringify({

        ...datos,

        guardadoEn:
          new Date().toISOString()

      })
    );


    mostrarNotificacionNuevoEvento({

      tipo:
        "success",

      titulo:
        "Borrador guardado",

      mensaje:
        "La información quedó guardada temporalmente en este navegador."

    });


    return true;

  } catch (error) {

    console.error(
      "No fue posible guardar el borrador:",
      error
    );


    mostrarNotificacionNuevoEvento({

      tipo:
        "error",

      titulo:
        "No pudimos guardar el borrador",

      mensaje:
        "Se produjo un inconveniente al almacenar la información."

    });


    return false;

  }

}


/* =========================================================
   GUARDADO AUTOMÁTICO
========================================================= */

function programarGuardadoBorradorNuevoEvento() {

  window.clearTimeout(
    nuevoEventoState.temporizadorBorrador
  );


  nuevoEventoState.temporizadorBorrador =
    window.setTimeout(
      () => {

        const datos =
          obtenerDatosFormularioNuevoEvento();


        const tieneContenido =
          Boolean(
            datos.titulo ||
            datos.descripcion ||
            datos.responsable ||
            datos.institucion
          );


        if (!tieneContenido) {

          return;

        }


        try {

          localStorage.setItem(
            NUEVO_EVENTO_BORRADOR_KEY,
            JSON.stringify({

              ...datos,

              guardadoEn:
                new Date().toISOString(),

              automatico:
                true

            })
          );

        } catch (error) {

          console.warn(
            "No fue posible guardar automáticamente el borrador:",
            error
          );

        }

      },
      700
    );

}


function guardarBorradorAutomaticoNuevoEvento() {

  if (
    nuevoEventoState.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosFormularioNuevoEvento();


  const tieneContenido =
    Boolean(
      datos.titulo ||
      datos.descripcion ||
      datos.responsable ||
      datos.institucion
    );


  if (!tieneContenido) {

    return;

  }


  try {

    localStorage.setItem(
      NUEVO_EVENTO_BORRADOR_KEY,
      JSON.stringify({

        ...datos,

        guardadoEn:
          new Date().toISOString(),

        automatico:
          true

      })
    );

  } catch {

    /* Sin interrupción al cerrar la página. */

  }

}


/* =========================================================
   RECUPERAR BORRADOR
========================================================= */

function recuperarBorradorNuevoEvento() {

  try {

    const contenido =
      localStorage.getItem(
        NUEVO_EVENTO_BORRADOR_KEY
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
      typeof borrador !== "object"
    ) {

      return;

    }


    completarCampoNuevoEvento(
      "titulo",
      borrador.titulo
    );


    completarCampoNuevoEvento(
      "tipo",
      borrador.tipo
    );


    completarCampoNuevoEvento(
      "estado",
      borrador.estado ||
      "pendiente"
    );


    completarCampoNuevoEvento(
      "descripcion",
      borrador.descripcion
    );


    completarCampoNuevoEvento(
      "fecha",
      borrador.fecha
    );


    completarCampoNuevoEvento(
      "hora",
      borrador.hora
    );


    completarCampoNuevoEvento(
      "duracion",
      borrador.duracion
    );


    completarCampoNuevoEvento(
      "modalidad",
      borrador.modalidad
    );


    completarCampoNuevoEvento(
      "lugar",
      borrador.lugar
    );


    completarCampoNuevoEvento(
      "responsable",
      borrador.responsable
    );


    completarCampoNuevoEvento(
      "institucion",
      borrador.institucion
    );


    completarCampoNuevoEvento(
      "programaId",
      borrador.programaId
    );


    completarCampoNuevoEvento(
      "proyectoId",
      borrador.proyectoId
    );


    completarCampoNuevoEvento(
      "observaciones",
      borrador.observaciones
    );


    nuevoEventoState.borradorRecuperado =
      true;


    mostrarElementoNuevoEvento(
      nuevoEventoElementos.avisoBorrador
    );


    actualizarVistaPreviaNuevoEvento();

    actualizarEstadoFormularioNuevoEvento();

  } catch (error) {

    console.warn(
      "No fue posible recuperar el borrador:",
      error
    );

  }

}


/* =========================================================
   COMPLETAR CAMPO
========================================================= */

function completarCampoNuevoEvento(
  nombre,
  valor
) {

  const campo =
    nuevoEventoElementos.formulario
      .elements
      .namedItem(
        nombre
      );


  if (!campo) {

    return;

  }


  campo.value =
    valor ?? "";

}


/* =========================================================
   DESCARTAR BORRADOR
========================================================= */

function descartarBorradorNuevoEvento() {

  eliminarBorradorNuevoEvento();


  nuevoEventoElementos.formulario.reset();


  establecerFechaInicialNuevoEvento();


  nuevoEventoState.borradorRecuperado =
    false;


  ocultarElementoNuevoEvento(
    nuevoEventoElementos.avisoBorrador
  );


  limpiarErroresNuevoEvento();

  actualizarVistaPreviaNuevoEvento();

  actualizarEstadoFormularioNuevoEvento();


  nuevoEventoElementos.titulo
    ?.focus();


  mostrarNotificacionNuevoEvento({

    tipo:
      "info",

    titulo:
      "Borrador descartado",

    mensaje:
      "El formulario quedó listo para comenzar un nuevo registro."

  });

}


/* =========================================================
   ELIMINAR BORRADOR
========================================================= */

function eliminarBorradorNuevoEvento() {

  try {

    localStorage.removeItem(
      NUEVO_EVENTO_BORRADOR_KEY
    );

  } catch (error) {

    console.warn(
      "No fue posible eliminar el borrador:",
      error
    );

  }

}


/* =========================================================
   ESTADO DE CARGA
========================================================= */

function activarEstadoCargaNuevoEvento() {

  nuevoEventoState.guardando =
    true;


  nuevoEventoElementos.botonRegistrar
    ?.classList.add(
      "nuevo-evento-boton--cargando"
    );


  if (
    nuevoEventoElementos.botonRegistrar
  ) {

    nuevoEventoElementos.botonRegistrar.disabled =
      true;


    nuevoEventoElementos.botonRegistrar.textContent =
      "Registrando evento...";

  }


  if (
    nuevoEventoElementos.botonGuardarBorrador
  ) {

    nuevoEventoElementos.botonGuardarBorrador.disabled =
      true;

  }

}


function desactivarEstadoCargaNuevoEvento() {

  nuevoEventoState.guardando =
    false;


  nuevoEventoElementos.botonRegistrar
    ?.classList.remove(
      "nuevo-evento-boton--cargando"
    );


  if (
    nuevoEventoElementos.botonRegistrar
  ) {

    nuevoEventoElementos.botonRegistrar.disabled =
      false;


    nuevoEventoElementos.botonRegistrar.textContent =
      "Registrar evento";

  }


  if (
    nuevoEventoElementos.botonGuardarBorrador
  ) {

    nuevoEventoElementos.botonGuardarBorrador.disabled =
      false;

  }

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionNuevoEvento({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !nuevoEventoElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    nuevoEventoState.temporizadorNotificacion
  );


  const configuraciones = {

    success: {

      icono:
        "✓",

      color:
        "#61c79a",

      borde:
        "rgba(97,199,154,.28)",

      fondo:
        "rgba(97,199,154,.10)"

    },

    error: {

      icono:
        "!",

      color:
        "#e47a7a",

      borde:
        "rgba(228,122,122,.30)",

      fondo:
        "rgba(228,122,122,.10)"

    },

    info: {

      icono:
        "i",

      color:
        "#78aee8",

      borde:
        "rgba(120,174,232,.28)",

      fondo:
        "rgba(120,174,232,.10)"

    }

  };


  const configuracion =
    configuraciones[tipo] ||
    configuraciones.success;


  establecerTextoNuevoEvento(
    nuevoEventoElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.notificacionTitulo,
    titulo
  );


  establecerTextoNuevoEvento(
    nuevoEventoElementos.notificacionMensaje,
    mensaje
  );


  nuevoEventoElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  nuevoEventoElementos.notificacionIcono
    .style.color =
      configuracion.color;


  nuevoEventoElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  nuevoEventoElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  nuevoEventoElementos.notificacion.hidden =
    false;


  nuevoEventoState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionNuevoEvento,
      4500
    );

}


function ocultarNotificacionNuevoEvento() {

  if (
    !nuevoEventoElementos.notificacion
  ) {

    return;

  }


  nuevoEventoElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    nuevoEventoState.temporizadorNotificacion
  );

}


/* =========================================================
   GENERACIÓN DE ID
========================================================= */

function generarIdNuevoEvento() {

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
   FECHAS
========================================================= */

function crearFechaNuevoEvento(
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


function formatearFechaNuevoEvento(
  valor
) {

  const fecha =
    crearFechaNuevoEvento(
      valor
    );


  if (!fecha) {

    return "Sin fecha";

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


function normalizarFechaInputNuevoEvento(
  valor
) {

  const fecha =
    crearFechaNuevoEvento(
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
   ORDENAMIENTO
========================================================= */

function ordenarPorNombreNuevoEvento(
  elementoA,
  elementoB
) {

  const nombreA =
    obtenerTextoNuevoEvento(
      elementoA.nombre ||
      elementoA.titulo
    );


  const nombreB =
    obtenerTextoNuevoEvento(
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
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTextoNuevoEvento(
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


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTextoNuevoEvento(
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


function mostrarElementoNuevoEvento(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    false;

}


function ocultarElementoNuevoEvento(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    true;

}