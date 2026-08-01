/* =========================================================
   FALCO® COMUNIDAD
   AGENDA INSTITUCIONAL
   agenda.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const AGENDA_STORAGE_KEY =
  "falcoComunidadAgenda";

const REUNIONES_STORAGE_KEYS = [
  "falcoComunidadReuniones",
  "falcoReuniones"
];

const PROGRAMAS_STORAGE_KEY =
  "falcoComunidadProgramas";


/* =========================================================
   TIPOS Y ESTADOS
========================================================= */

const AGENDA_TIPOS = {

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


const AGENDA_ESTADOS = {

  pendiente: {

    etiqueta:
      "Pendiente",

    clase:
      "agenda-estado--pendiente"

  },

  confirmado: {

    etiqueta:
      "Confirmado",

    clase:
      "agenda-estado--confirmado"

  },

  finalizado: {

    etiqueta:
      "Finalizado",

    clase:
      "agenda-estado--finalizado"

  },

  cancelado: {

    etiqueta:
      "Cancelado",

    clase:
      "agenda-estado--cancelado"

  }

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const agendaState = {

  eventos:
    [],

  eventosFiltrados:
    [],

  busqueda:
    "",

  tipo:
    "todos",

  estado:
    "todos",

  periodo:
    "todos",

  temporizadorNotificacion:
    null

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const agendaElementos = {

  loader:
    document.getElementById(
      "agendaLoader"
    ),

  listado:
    document.getElementById(
      "agendaListado"
    ),

  vacio:
    document.getElementById(
      "agendaVacia"
    ),

  sinResultados:
    document.getElementById(
      "agendaSinResultados"
    ),

  proximos:
    document.getElementById(
      "agendaProximos"
    ),


  /* -------------------------------------------------------
     FILTROS
  ------------------------------------------------------- */

  buscador:
    document.getElementById(
      "buscadorAgenda"
    ),

  filtroTipo:
    document.getElementById(
      "filtroTipoAgenda"
    ),

  filtroEstado:
    document.getElementById(
      "filtroEstadoAgenda"
    ),

  filtroPeriodo:
    document.getElementById(
      "filtroPeriodoAgenda"
    ),

  botonLimpiar:
    document.getElementById(
      "botonLimpiarAgenda"
    ),

  botonRestablecer:
    document.getElementById(
      "botonRestablecerAgenda"
    ),

  botonActualizar:
    document.getElementById(
      "botonActualizarAgenda"
    ),


  /* -------------------------------------------------------
     INDICADORES
  ------------------------------------------------------- */

  indicadorHoy:
    document.getElementById(
      "indicadorEventosHoy"
    ),

  indicadorProximos:
    document.getElementById(
      "indicadorProximosEventos"
    ),

  indicadorPendientes:
    document.getElementById(
      "indicadorEventosPendientes"
    ),

  indicadorFinalizados:
    document.getElementById(
      "indicadorEventosFinalizados"
    ),

  contadorVisibles:
    document.getElementById(
      "contadorEventosVisibles"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "agendaNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "agendaNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "agendaNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "agendaNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "agendaNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarAgenda
);


function iniciarAgenda() {

  registrarEventosAgenda();

  cargarAgenda();

  ocultarLoaderAgenda();

  actualizarAgendaCompleta();

  console.info(
    "FALCO Comunidad Agenda™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventosAgenda() {

  agendaElementos.buscador
    ?.addEventListener(
      "input",
      manejarBusquedaAgenda
    );


  agendaElementos.filtroTipo
    ?.addEventListener(
      "change",
      manejarFiltroTipoAgenda
    );


  agendaElementos.filtroEstado
    ?.addEventListener(
      "change",
      manejarFiltroEstadoAgenda
    );


  agendaElementos.filtroPeriodo
    ?.addEventListener(
      "change",
      manejarFiltroPeriodoAgenda
    );


  agendaElementos.botonLimpiar
    ?.addEventListener(
      "click",
      limpiarFiltrosAgenda
    );


  agendaElementos.botonRestablecer
    ?.addEventListener(
      "click",
      limpiarFiltrosAgenda
    );


  agendaElementos.botonActualizar
    ?.addEventListener(
      "click",
      actualizarAgendaManual
    );


  agendaElementos.listado
    ?.addEventListener(
      "click",
      manejarAccionEventoAgenda
    );


  agendaElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionAgenda
    );


  window.addEventListener(
    "storage",
    manejarCambioStorageAgenda
  );

}


/* =========================================================
   CARGA GENERAL
========================================================= */

function cargarAgenda() {

  const eventosPropios =
    cargarEventosPropiosAgenda();

  const reuniones =
    cargarReunionesAgenda();

  const actividades =
    cargarActividadesProgramasAgenda();


  agendaState.eventos = [

    ...eventosPropios,

    ...reuniones,

    ...actividades

  ]
    .map(
      normalizarEventoAgenda
    )
    .filter(Boolean)
    .sort(
      ordenarEventosAgenda
    );

}


/* =========================================================
   EVENTOS PROPIOS
========================================================= */

function cargarEventosPropiosAgenda() {

  try {

    const contenido =
      localStorage.getItem(
        AGENDA_STORAGE_KEY
      );


    if (!contenido) {

      return [];

    }


    const datos =
      JSON.parse(
        contenido
      );


    if (
      !Array.isArray(datos)
    ) {

      return [];

    }


    return datos.map(
      (evento) => ({

        ...evento,

        origen:
          evento.origen ||
          "agenda",

        editable:
          evento.editable !== false

      })
    );

  } catch (error) {

    console.error(
      "No fue posible cargar los eventos propios:",
      error
    );


    mostrarNotificacionAgenda({

      tipo:
        "error",

      titulo:
        "No pudimos cargar la agenda",

      mensaje:
        "Se produjo un inconveniente al leer los eventos almacenados."

    });


    return [];

  }

}


/* =========================================================
   REUNIONES
========================================================= */

function cargarReunionesAgenda() {

  const reuniones =
    obtenerPrimeraColeccionStorage(
      REUNIONES_STORAGE_KEYS
    );


  return reuniones.map(
    (reunion) => {

      const reunionId =
        obtenerTextoAgenda(
          reunion.id ||
          reunion.reunionId ||
          reunion.uid
        );


      return {

        id:
          `reunion-${reunionId}`,

        origenId:
          reunionId,

        titulo:
          reunion.titulo ||
          reunion.nombre ||
          reunion.asunto ||
          "Reunión institucional",

        descripcion:
          reunion.descripcion ||
          reunion.objetivo ||
          reunion.observaciones ||
          "",

        fecha:
          reunion.fecha ||
          reunion.fechaReunion ||
          reunion.fechaInicio ||
          "",

        hora:
          reunion.hora ||
          reunion.horaInicio ||
          "",

        duracion:
          reunion.duracion ||
          "",

        tipo:
          "reunion",

        estado:
          normalizarEstadoAgenda(
            reunion.estado
          ),

        modalidad:
          reunion.modalidad ||
          "Sin modalidad",

        lugar:
          reunion.lugar ||
          reunion.enlace ||
          "",

        responsable:
          reunion.responsable ||
          reunion.coordinador ||
          reunion.referente ||
          "",

        institucion:
          reunion.institucion ||
          reunion.institucionNombre ||
          "",

        origen:
          "reunion",

        editable:
          false,

        paginaDetalle:
          reunionId
            ? `../reuniones/reunion.html?id=${encodeURIComponent(reunionId)}`
            : "../reuniones/reuniones.html"

      };

    }
  );

}


/* =========================================================
   ACTIVIDADES DE PROGRAMAS
========================================================= */

function cargarActividadesProgramasAgenda() {

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


    if (
      !Array.isArray(programas)
    ) {

      return [];

    }


    const eventos = [];


    programas.forEach(
      (programa) => {

        const programaId =
          obtenerTextoAgenda(
            programa.id
          );


        const actividades =
          Array.isArray(
            programa.actividades
          )
            ? programa.actividades
            : [];


        actividades.forEach(
          (actividad) => {

            const actividadId =
              obtenerTextoAgenda(
                actividad.id
              );


            eventos.push({

              id:
                `actividad-${programaId}-${actividadId}`,

              origenId:
                actividadId,

              titulo:
                actividad.titulo ||
                actividad.nombre ||
                "Actividad de programa",

              descripcion:
                actividad.descripcion ||
                "",

              fecha:
                actividad.fecha ||
                "",

              hora:
                actividad.hora ||
                "",

              tipo:
                "actividad",

              estado:
                convertirEstadoActividadAgenda(
                  actividad.estado
                ),

              modalidad:
                actividad.modalidad ||
                "Sin modalidad",

              lugar:
                actividad.lugar ||
                "",

              responsable:
                programa.responsable ||
                "",

              institucion:
                programa.institucion ||
                "",

              programa:
                programa.nombre ||
                "Programa sin nombre",

              origen:
                "programa",

              editable:
                false,

              paginaDetalle:
                programaId
                  ? `../programas/programa.html?id=${encodeURIComponent(programaId)}`
                  : "../programas/programas.html"

            });

          }
        );

      }
    );


    return eventos;

  } catch (error) {

    console.error(
      "No fue posible cargar las actividades de programas:",
      error
    );


    return [];

  }

}


/* =========================================================
   STORAGE AUXILIAR
========================================================= */

function obtenerPrimeraColeccionStorage(
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
   NORMALIZACIÓN
========================================================= */

function normalizarEventoAgenda(
  evento
) {

  if (
    !evento ||
    typeof evento !== "object"
  ) {

    return null;

  }


  const id =
    obtenerTextoAgenda(
      evento.id ||
      evento.eventoId ||
      evento.uid
    );


  if (!id) {

    return null;

  }


  return {

    ...evento,

    id,

    titulo:
      obtenerTextoAgenda(
        evento.titulo ||
        evento.nombre ||
        evento.asunto
      ) ||
      "Evento sin título",

    descripcion:
      obtenerTextoAgenda(
        evento.descripcion ||
        evento.detalle ||
        evento.observaciones
      ),

    fecha:
      obtenerTextoAgenda(
        evento.fecha ||
        evento.fechaEvento ||
        evento.fechaInicio
      ),

    hora:
      obtenerTextoAgenda(
        evento.hora ||
        evento.horaInicio
      ),

    duracion:
      obtenerTextoAgenda(
        evento.duracion
      ),

    tipo:
      normalizarTipoAgenda(
        evento.tipo
      ),

    estado:
      normalizarEstadoAgenda(
        evento.estado
      ),

    modalidad:
      obtenerTextoAgenda(
        evento.modalidad
      ) ||
      "Sin modalidad",

    lugar:
      obtenerTextoAgenda(
        evento.lugar ||
        evento.enlace
      ),

    responsable:
      obtenerTextoAgenda(
        evento.responsable ||
        evento.coordinador ||
        evento.referente
      ),

    institucion:
      obtenerTextoAgenda(
        evento.institucion ||
        evento.institucionNombre
      ),

    programa:
      obtenerTextoAgenda(
        evento.programa ||
        evento.programaNombre
      ),

    proyecto:
      obtenerTextoAgenda(
        evento.proyecto ||
        evento.proyectoNombre
      ),

    origen:
      obtenerTextoAgenda(
        evento.origen
      ) ||
      "agenda",

    editable:
      evento.editable !== false,

    paginaDetalle:
      obtenerTextoAgenda(
        evento.paginaDetalle
      )

  };

}


/* =========================================================
   NORMALIZAR TIPO
========================================================= */

function normalizarTipoAgenda(
  valor
) {

  const tipo =
    normalizarTextoAgenda(
      valor
    );


  const equivalencias = {

    reunion:
      "reunion",

    reuniones:
      "reunion",

    actividad:
      "actividad",

    actividades:
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

    reminder:
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

function normalizarEstadoAgenda(
  valor
) {

  const estado =
    normalizarTextoAgenda(
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

    ejecucion:
      "confirmado",

    finalizado:
      "finalizado",

    finalizada:
      "finalizado",

    realizado:
      "finalizado",

    realizada:
      "finalizado",

    completado:
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


function convertirEstadoActividadAgenda(
  valor
) {

  const estado =
    normalizarTextoAgenda(
      valor
    );


  const equivalencias = {

    pendiente:
      "pendiente",

    confirmada:
      "confirmado",

    confirmado:
      "confirmado",

    realizada:
      "finalizado",

    realizado:
      "finalizado",

    cancelada:
      "cancelado",

    cancelado:
      "cancelado"

  };


  return equivalencias[estado] ||
    normalizarEstadoAgenda(
      estado
    );

}


/* =========================================================
   ACTUALIZACIÓN GENERAL
========================================================= */

function actualizarAgendaCompleta() {

  aplicarFiltrosAgenda();

  actualizarIndicadoresAgenda();

  renderizarAgenda();

  renderizarProximosEventosAgenda();

}


/* =========================================================
   ACTUALIZACIÓN MANUAL
========================================================= */

function actualizarAgendaManual() {

  mostrarLoaderAgenda();


  window.setTimeout(
    () => {

      cargarAgenda();

      ocultarLoaderAgenda();

      actualizarAgendaCompleta();


      mostrarNotificacionAgenda({

        tipo:
          "success",

        titulo:
          "Agenda actualizada",

        mensaje:
          "Los eventos y compromisos fueron actualizados."

      });

    },
    350
  );

}


/* =========================================================
   FILTROS
========================================================= */

function manejarBusquedaAgenda(
  evento
) {

  agendaState.busqueda =
    evento.target.value.trim();


  actualizarAgendaCompleta();

}


function manejarFiltroTipoAgenda(
  evento
) {

  agendaState.tipo =
    evento.target.value;


  actualizarAgendaCompleta();

}


function manejarFiltroEstadoAgenda(
  evento
) {

  agendaState.estado =
    evento.target.value;


  actualizarAgendaCompleta();

}


function manejarFiltroPeriodoAgenda(
  evento
) {

  agendaState.periodo =
    evento.target.value;


  actualizarAgendaCompleta();

}


function aplicarFiltrosAgenda() {

  const busqueda =
    normalizarTextoAgenda(
      agendaState.busqueda
    );


  agendaState.eventosFiltrados =
    agendaState.eventos.filter(
      (evento) => {

        const coincideBusqueda =
          !busqueda ||
          crearCadenaBusquedaAgenda(
            evento
          ).includes(
            busqueda
          );


        const coincideTipo =
          agendaState.tipo === "todos" ||
          evento.tipo === agendaState.tipo;


        const coincideEstado =
          agendaState.estado === "todos" ||
          evento.estado === agendaState.estado;


        const coincidePeriodo =
          coincidePeriodoAgenda(
            evento,
            agendaState.periodo
          );


        return (
          coincideBusqueda &&
          coincideTipo &&
          coincideEstado &&
          coincidePeriodo
        );

      }
    );

}


function crearCadenaBusquedaAgenda(
  evento
) {

  return normalizarTextoAgenda([

    evento.titulo,

    evento.descripcion,

    evento.responsable,

    evento.institucion,

    evento.programa,

    evento.proyecto,

    evento.modalidad,

    evento.lugar,

    AGENDA_TIPOS[
      evento.tipo
    ],

    AGENDA_ESTADOS[
      evento.estado
    ]?.etiqueta

  ].join(" "));

}


/* =========================================================
   FILTRO POR PERÍODO
========================================================= */

function coincidePeriodoAgenda(
  evento,
  periodo
) {

  if (
    periodo === "todos"
  ) {

    return true;

  }


  const fechaEvento =
    crearFechaAgenda(
      evento.fecha
    );


  if (!fechaEvento) {

    return false;

  }


  const hoy =
    obtenerInicioDiaAgenda(
      new Date()
    );


  const fechaNormalizada =
    obtenerInicioDiaAgenda(
      fechaEvento
    );


  if (
    periodo === "hoy"
  ) {

    return (
      fechaNormalizada.getTime() ===
      hoy.getTime()
    );

  }


  if (
    periodo === "semana"
  ) {

    const fin =
      new Date(
        hoy
      );


    fin.setDate(
      fin.getDate() + 7
    );


    return (
      fechaNormalizada >= hoy &&
      fechaNormalizada <= fin
    );

  }


  if (
    periodo === "mes"
  ) {

    return (
      fechaNormalizada.getMonth() ===
      hoy.getMonth() &&
      fechaNormalizada.getFullYear() ===
      hoy.getFullYear()
    );

  }


  return true;

}


/* =========================================================
   LIMPIAR FILTROS
========================================================= */

function limpiarFiltrosAgenda() {

  agendaState.busqueda =
    "";

  agendaState.tipo =
    "todos";

  agendaState.estado =
    "todos";

  agendaState.periodo =
    "todos";


  if (
    agendaElementos.buscador
  ) {

    agendaElementos.buscador.value =
      "";

  }


  if (
    agendaElementos.filtroTipo
  ) {

    agendaElementos.filtroTipo.value =
      "todos";

  }


  if (
    agendaElementos.filtroEstado
  ) {

    agendaElementos.filtroEstado.value =
      "todos";

  }


  if (
    agendaElementos.filtroPeriodo
  ) {

    agendaElementos.filtroPeriodo.value =
      "todos";

  }


  actualizarAgendaCompleta();


  agendaElementos.buscador
    ?.focus();

}


/* =========================================================
   INDICADORES
========================================================= */

function actualizarIndicadoresAgenda() {

  const hoy =
    obtenerInicioDiaAgenda(
      new Date()
    );


  const finSemana =
    new Date(
      hoy
    );


  finSemana.setDate(
    finSemana.getDate() + 7
  );


  const eventosHoy =
    agendaState.eventos.filter(
      (evento) => {

        const fecha =
          crearFechaAgenda(
            evento.fecha
          );


        if (!fecha) {

          return false;

        }


        return (
          obtenerInicioDiaAgenda(
            fecha
          ).getTime() ===
          hoy.getTime()
        );

      }
    ).length;


  const proximos =
    agendaState.eventos.filter(
      (evento) => {

        const fecha =
          crearFechaAgenda(
            evento.fecha
          );


        if (!fecha) {

          return false;

        }


        const fechaNormalizada =
          obtenerInicioDiaAgenda(
            fecha
          );


        return (
          fechaNormalizada >= hoy &&
          fechaNormalizada <= finSemana
        );

      }
    ).length;


  const pendientes =
    agendaState.eventos.filter(
      (evento) =>
        evento.estado ===
        "pendiente"
    ).length;


  const finalizados =
    agendaState.eventos.filter(
      (evento) =>
        evento.estado ===
        "finalizado"
    ).length;


  establecerTextoAgenda(
    agendaElementos.indicadorHoy,
    eventosHoy
  );


  establecerTextoAgenda(
    agendaElementos.indicadorProximos,
    proximos
  );


  establecerTextoAgenda(
    agendaElementos.indicadorPendientes,
    pendientes
  );


  establecerTextoAgenda(
    agendaElementos.indicadorFinalizados,
    finalizados
  );


  establecerTextoAgenda(
    agendaElementos.contadorVisibles,
    agendaState.eventosFiltrados.length
  );

}

/* =========================================================
   RENDERIZADO GENERAL
========================================================= */

function renderizarAgenda() {

  if (
    !agendaElementos.listado
  ) {

    return;

  }


  agendaElementos.listado.innerHTML =
    "";


  ocultarElementoAgenda(
    agendaElementos.vacio
  );


  ocultarElementoAgenda(
    agendaElementos.sinResultados
  );


  const hayEventos =
    agendaState.eventos.length > 0;


  const hayResultados =
    agendaState.eventosFiltrados.length > 0;


  if (!hayEventos) {

    ocultarElementoAgenda(
      agendaElementos.listado
    );


    mostrarElementoAgenda(
      agendaElementos.vacio
    );


    return;

  }


  if (!hayResultados) {

    ocultarElementoAgenda(
      agendaElementos.listado
    );


    mostrarElementoAgenda(
      agendaElementos.sinResultados
    );


    return;

  }


  mostrarElementoAgenda(
    agendaElementos.listado
  );


  const grupos =
    agruparEventosPorFechaAgenda(
      agendaState.eventosFiltrados
    );


  agendaElementos.listado.innerHTML =
    grupos
      .map(
        crearGrupoAgendaHTML
      )
      .join("");

}


/* =========================================================
   AGRUPACIÓN POR FECHA
========================================================= */

function agruparEventosPorFechaAgenda(
  eventos
) {

  const grupos =
    new Map();


  eventos.forEach(
    (evento) => {

      const fecha =
        crearFechaAgenda(
          evento.fecha
        );


      const clave =
        fecha
          ? normalizarClaveFechaAgenda(
              fecha
            )
          : "sin-fecha";


      if (
        !grupos.has(
          clave
        )
      ) {

        grupos.set(
          clave,
          []
        );

      }


      grupos.get(
        clave
      ).push(
        evento
      );

    }
  );


  return Array.from(
    grupos.entries()
  ).map(
    ([
      clave,
      eventosGrupo
    ]) => ({

      clave,

      fecha:
        clave === "sin-fecha"
          ? null
          : crearFechaAgenda(
              clave
            ),

      eventos:
        eventosGrupo.sort(
          ordenarEventosAgenda
        )

    })
  );

}


/* =========================================================
   GRUPO DE FECHA
========================================================= */

function crearGrupoAgendaHTML(
  grupo
) {

  const tituloFecha =
    grupo.fecha
      ? formatearFechaLargaAgenda(
          grupo.fecha
        )
      : "Sin fecha definida";


  return `
    <section class="agenda-grupo">

      <h3 class="agenda-grupo__fecha">
        ${escaparHTMLAgenda(tituloFecha)}
      </h3>

      <div>

        ${
          grupo.eventos
            .map(
              crearEventoAgendaHTML
            )
            .join("")
        }

      </div>

    </section>
  `;

}


/* =========================================================
   TARJETA DE EVENTO
========================================================= */

function crearEventoAgendaHTML(
  evento
) {

  const tipo =
    AGENDA_TIPOS[
      evento.tipo
    ] ||
    AGENDA_TIPOS.otro;


  const estado =
    AGENDA_ESTADOS[
      evento.estado
    ] ||
    AGENDA_ESTADOS.pendiente;


  const hora =
    obtenerTextoAgenda(
      evento.hora
    ) ||
    "--:--";


  const detalle =
    obtenerDetalleEventoAgenda(
      evento
    );


  const botonTexto =
    evento.origen === "agenda"
      ? "Administrar"
      : "Ver origen";


  return `
    <article
      class="agenda-evento"
      data-evento-id="${escaparAtributoAgenda(evento.id)}"
    >

      <div class="agenda-evento__hora">

        <strong>
          ${escaparHTMLAgenda(hora)}
        </strong>

        <span>
          ${
            evento.duracion
              ? escaparHTMLAgenda(
                  evento.duracion
                )
              : "Horario"
          }
        </span>

      </div>


      <div class="agenda-evento__contenido">

        <p class="agenda-evento__tipo">
          ${escaparHTMLAgenda(tipo)}
        </p>

        <h4 class="agenda-evento__titulo">
          ${escaparHTMLAgenda(evento.titulo)}
        </h4>

        ${
          detalle
            ? `
              <p class="agenda-evento__detalle">
                ${escaparHTMLAgenda(detalle)}
              </p>
            `
            : ""
        }


        <div class="agenda-evento__meta">

          <span
            class="agenda-estado ${estado.clase}"
          >
            ${escaparHTMLAgenda(estado.etiqueta)}
          </span>

          ${
            evento.modalidad
              ? `
                <span>
                  ${escaparHTMLAgenda(evento.modalidad)}
                </span>
              `
              : ""
          }

          ${
            evento.institucion
              ? `
                <span>
                  ${escaparHTMLAgenda(evento.institucion)}
                </span>
              `
              : ""
          }

          ${
            evento.programa
              ? `
                <span>
                  ${escaparHTMLAgenda(evento.programa)}
                </span>
              `
              : ""
          }

        </div>

      </div>


      <div class="agenda-evento__acciones">

        <button
          type="button"
          class="agenda-evento__enlace"
          data-ver-evento="${escaparAtributoAgenda(evento.id)}"
        >
          ${escaparHTMLAgenda(botonTexto)}

          <span aria-hidden="true">
            →
          </span>
        </button>

      </div>

    </article>
  `;

}


/* =========================================================
   DETALLE DEL EVENTO
========================================================= */

function obtenerDetalleEventoAgenda(
  evento
) {

  const partes = [

    evento.descripcion,

    evento.responsable
      ? `Responsable: ${evento.responsable}`
      : "",

    evento.lugar
      ? `Lugar: ${evento.lugar}`
      : ""

  ]
    .map(
      obtenerTextoAgenda
    )
    .filter(Boolean);


  return partes.join(
    " · "
  );

}


/* =========================================================
   PRÓXIMOS EVENTOS
========================================================= */

function renderizarProximosEventosAgenda() {

  if (
    !agendaElementos.proximos
  ) {

    return;

  }


  const hoy =
    obtenerInicioDiaAgenda(
      new Date()
    );


  const proximos =
    agendaState.eventos
      .filter(
        (evento) => {

          const fecha =
            crearFechaAgenda(
              evento.fecha
            );


          if (!fecha) {

            return false;

          }


          const fechaNormalizada =
            obtenerInicioDiaAgenda(
              fecha
            );


          return (
            fechaNormalizada >= hoy &&
            evento.estado !== "cancelado"
          );

        }
      )
      .sort(
        ordenarEventosAgenda
      )
      .slice(
        0,
        6
      );


  if (
    proximos.length === 0
  ) {

    agendaElementos.proximos.innerHTML = `
      <p class="agenda-proximos__vacio">
        No hay próximos eventos registrados.
      </p>
    `;

    return;

  }


  agendaElementos.proximos.innerHTML =
    proximos
      .map(
        crearProximoEventoHTML
      )
      .join("");

}


/* =========================================================
   ITEM PRÓXIMO EVENTO
========================================================= */

function crearProximoEventoHTML(
  evento
) {

  const fecha =
    crearFechaAgenda(
      evento.fecha
    );


  const dia =
    fecha
      ? String(
          fecha.getDate()
        ).padStart(
          2,
          "0"
        )
      : "--";


  const mes =
    fecha
      ? new Intl.DateTimeFormat(
          "es-AR",
          {
            month:
              "short"
          }
        )
          .format(
            fecha
          )
          .replace(
            ".",
            ""
          )
      : "---";


  const hora =
    evento.hora ||
    "Sin horario";


  return `
    <div class="agenda-proximos__item">

      <div class="agenda-proximos__fecha">

        <strong>
          ${escaparHTMLAgenda(dia)}
        </strong>

        <span>
          ${escaparHTMLAgenda(mes)}
        </span>

      </div>


      <div class="agenda-proximos__contenido">

        <strong>
          ${escaparHTMLAgenda(evento.titulo)}
        </strong>

        <span>
          ${escaparHTMLAgenda(hora)}

          ${
            evento.modalidad
              ? ` · ${escaparHTMLAgenda(evento.modalidad)}`
              : ""
          }
        </span>

      </div>

    </div>
  `;

}


/* =========================================================
   ACCIÓN VER EVENTO
========================================================= */

function manejarAccionEventoAgenda(
  evento
) {

  const boton =
    evento.target.closest(
      "[data-ver-evento]"
    );


  if (!boton) {

    return;

  }


  const eventoId =
    boton.dataset.verEvento;


  const eventoEncontrado =
    agendaState.eventos.find(
      (registro) =>
        registro.id ===
        eventoId
    );


  if (!eventoEncontrado) {

    mostrarNotificacionAgenda({

      tipo:
        "error",

      titulo:
        "Evento no encontrado",

      mensaje:
        "No fue posible localizar el registro seleccionado."

    });


    return;

  }


  abrirEventoAgenda(
    eventoEncontrado
  );

}


/* =========================================================
   NAVEGACIÓN SEGÚN ORIGEN
========================================================= */

function abrirEventoAgenda(
  evento
) {

  if (
    evento.paginaDetalle
  ) {

    window.location.href =
      evento.paginaDetalle;

    return;

  }


  if (
    evento.origen === "agenda"
  ) {

    const destino =
      new URL(
        "./evento.html",
        window.location.href
      );


    destino.searchParams.set(
      "id",
      evento.id
    );


    window.location.href =
      destino.toString();

    return;

  }


  window.location.href =
    "./agenda.html";

}


/* =========================================================
   CAMBIO ENTRE PESTAÑAS
========================================================= */

function manejarCambioStorageAgenda(
  evento
) {

  const clavesRelevantes = [

    AGENDA_STORAGE_KEY,

    PROGRAMAS_STORAGE_KEY,

    ...REUNIONES_STORAGE_KEYS

  ];


  if (
    !clavesRelevantes.includes(
      evento.key
    )
  ) {

    return;

  }


  cargarAgenda();

  actualizarAgendaCompleta();

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionAgenda({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !agendaElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    agendaState.temporizadorNotificacion
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


  establecerTextoAgenda(
    agendaElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoAgenda(
    agendaElementos.notificacionTitulo,
    titulo
  );


  establecerTextoAgenda(
    agendaElementos.notificacionMensaje,
    mensaje
  );


  agendaElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  agendaElementos.notificacionIcono
    .style.color =
      configuracion.color;


  agendaElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  agendaElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  agendaElementos.notificacion.hidden =
    false;


  agendaState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionAgenda,
      4500
    );

}


/* =========================================================
   OCULTAR NOTIFICACIÓN
========================================================= */

function ocultarNotificacionAgenda() {

  if (
    !agendaElementos.notificacion
  ) {

    return;

  }


  agendaElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    agendaState.temporizadorNotificacion
  );

}


/* =========================================================
   LOADER
========================================================= */

function mostrarLoaderAgenda() {

  mostrarElementoAgenda(
    agendaElementos.loader
  );


  ocultarElementoAgenda(
    agendaElementos.listado
  );


  ocultarElementoAgenda(
    agendaElementos.vacio
  );


  ocultarElementoAgenda(
    agendaElementos.sinResultados
  );

}


function ocultarLoaderAgenda() {

  ocultarElementoAgenda(
    agendaElementos.loader
  );

}


/* =========================================================
   ORDENAMIENTO
========================================================= */

function ordenarEventosAgenda(
  eventoA,
  eventoB
) {

  const fechaA =
    crearFechaHoraAgenda(
      eventoA.fecha,
      eventoA.hora
    );


  const fechaB =
    crearFechaHoraAgenda(
      eventoB.fecha,
      eventoB.hora
    );


  if (
    fechaA &&
    fechaB
  ) {

    return (
      fechaA.getTime() -
      fechaB.getTime()
    );

  }


  if (
    fechaA &&
    !fechaB
  ) {

    return -1;

  }


  if (
    !fechaA &&
    fechaB
  ) {

    return 1;

  }


  return eventoA.titulo.localeCompare(
    eventoB.titulo,
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

function crearFechaAgenda(
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


function crearFechaHoraAgenda(
  fechaValor,
  horaValor
) {

  const fecha =
    crearFechaAgenda(
      fechaValor
    );


  if (!fecha) {

    return null;

  }


  const resultado =
    new Date(
      fecha
    );


  const hora =
    obtenerTextoAgenda(
      horaValor
    );


  if (
    /^\d{2}:\d{2}$/.test(
      hora
    )
  ) {

    const [
      horas,
      minutos
    ] =
      hora
        .split(":")
        .map(Number);


    resultado.setHours(
      horas,
      minutos,
      0,
      0
    );

  } else {

    resultado.setHours(
      0,
      0,
      0,
      0
    );

  }


  return resultado;

}


function obtenerInicioDiaAgenda(
  fecha
) {

  const resultado =
    new Date(
      fecha
    );


  resultado.setHours(
    0,
    0,
    0,
    0
  );


  return resultado;

}


function normalizarClaveFechaAgenda(
  fecha
) {

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


function formatearFechaLargaAgenda(
  fecha
) {

  const hoy =
    obtenerInicioDiaAgenda(
      new Date()
    );


  const fechaNormalizada =
    obtenerInicioDiaAgenda(
      fecha
    );


  const diferencia =
    Math.round(
      (
        fechaNormalizada -
        hoy
      ) /
      86400000
    );


  if (
    diferencia === 0
  ) {

    return "Hoy";

  }


  if (
    diferencia === 1
  ) {

    return "Mañana";

  }


  if (
    diferencia === -1
  ) {

    return "Ayer";

  }


  const texto =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        weekday:
          "long",

        day:
          "2-digit",

        month:
          "long",

        year:
          "numeric"
      }
    ).format(
      fecha
    );


  return capitalizarTextoAgenda(
    texto
  );

}


/* =========================================================
   UTILIDADES DE TEXTO
========================================================= */

function obtenerTextoAgenda(
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


function normalizarTextoAgenda(
  valor
) {

  return obtenerTextoAgenda(
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


function capitalizarTextoAgenda(
  valor
) {

  const texto =
    obtenerTextoAgenda(
      valor
    );


  if (!texto) {

    return "";

  }


  return (
    texto.charAt(0).toUpperCase() +
    texto.slice(1)
  );

}


function escaparHTMLAgenda(
  valor
) {

  return obtenerTextoAgenda(
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


function escaparAtributoAgenda(
  valor
) {

  return escaparHTMLAgenda(
    valor
  ).replace(
    /`/g,
    "&#096;"
  );

}


/* =========================================================
   UTILIDADES DEL DOM
========================================================= */

function establecerTextoAgenda(
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


function mostrarElementoAgenda(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    false;

}


function ocultarElementoAgenda(
  elemento
) {

  if (!elemento) {

    return;

  }


  elemento.hidden =
    true;

}