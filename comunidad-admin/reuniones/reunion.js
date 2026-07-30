"use strict";


/* =========================================================
   FALCO® COMUNIDAD
   FICHA INDIVIDUAL DE REUNIÓN
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_REUNION_CONFIG = {

  claveReunionesLocales:
    "falco_comunidad_reuniones",

  paginaListado:
    "reuniones.html",

  paginaEdicion:
    "nueva-reunion.html"

};


/* =========================================================
   APLICACIÓN
========================================================= */

const FALCOComunidadReunion = {

  elementos: {},

  reuniones: [],

  reunion: null,

  reunionId: null,


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.obtenerElementos();

    this.obtenerReunionId();

    this.cargarReuniones();

    this.buscarReunion();

    this.vincularEventos();

    if (!this.reunion) {

      this.mostrarReunionNoEncontrada();

      console.warn(
        "FALCO Comunidad Reunión™: reunión no encontrada."
      );

      return;

    }

    this.renderizarReunion();

    console.log(
      "FALCO Comunidad Reunión™ v1.0 Ready",
      this.reunion
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  obtenerElementos() {

    this.elementos = {

      contenido:
        document.getElementById(
          "contenidoReunion"
        ) ||
        document.getElementById(
          "detalleReunion"
        ) ||
        document.querySelector(
          ".reunion-detalle"
        ),

      estadoCarga:
        document.getElementById(
          "estadoCargaReunion"
        ),

      estadoNoEncontrada:
        document.getElementById(
          "estadoReunionNoEncontrada"
        ),

      mensaje:
        document.getElementById(
          "mensajeReunion"
        ),

      tituloPagina:
        document.getElementById(
          "tituloPaginaReunion"
        ),

      asunto:
        document.getElementById(
          "asuntoReunion"
        ),

      institucion:
  document.getElementById(
    "institucionReunion"
  ),

institucionDetalle:
  document.getElementById(
    "institucionReunionDetalle"
  ),

      estado:
        document.getElementById(
          "estadoReunion"
        ),

      fecha:
        document.getElementById(
          "fechaReunion"
        ),

      hora:
        document.getElementById(
          "horaReunion"
        ),

      duracion:
        document.getElementById(
          "duracionReunion"
        ),

      modalidad:
        document.getElementById(
          "modalidadReunion"
        ),

      tipo:
        document.getElementById(
          "tipoReunion"
        ),

      objetivo:
        document.getElementById(
          "objetivoReunion"
        ),

      referente:
        document.getElementById(
          "referenteReunion"
        ),

      responsable:
        document.getElementById(
          "responsableReunion"
        ),

      participantes:
        document.getElementById(
          "participantesReunion"
        ),

      ubicacion:
        document.getElementById(
          "ubicacionReunion"
        ),

      seguimiento:
        document.getElementById(
          "seguimientoReunion"
        ),

      observaciones:
        document.getElementById(
          "observacionesReunion"
        ),

      fechaCreacion:
        document.getElementById(
          "fechaCreacionReunion"
        ),

      botonEditar:
        document.getElementById(
          "botonEditarReunion"
        ),

      botonEliminar:
        document.getElementById(
          "botonEliminarReunion"
        ),

      botonVolver:
        document.getElementById(
          "botonVolverReuniones"
        ),

      modalEliminar:
        document.getElementById(
          "modalEliminarReunion"
        ),

      botonConfirmarEliminar:
        document.getElementById(
          "botonConfirmarEliminarReunion"
        ),

      botonCancelarEliminar:
        document.getElementById(
          "botonCancelarEliminarReunion"
        )

    };

  },


  /* =======================================================
     IDENTIFICADOR
  ======================================================= */

  obtenerReunionId() {

    const parametros =
      new URLSearchParams(
        window.location.search
      );

    this.reunionId =
      parametros.get(
        "id"
      );

  },


  /* =======================================================
     CARGA DE REUNIONES
  ======================================================= */

  cargarReuniones() {

    const clave =
      FALCO_COMUNIDAD_REUNION_CONFIG
        .claveReunionesLocales;

    const contenido =
      localStorage.getItem(
        clave
      );

    if (!contenido) {

      this.reuniones = [];

      return;

    }

    try {

      const datos =
        JSON.parse(
          contenido
        );

      this.reuniones =
        Array.isArray(datos)
          ? datos
          : [];

    } catch (error) {

      console.error(
        "No fue posible cargar las reuniones:",
        error
      );

      this.reuniones = [];

      this.mostrarMensaje(
        "No fue posible cargar la información de la reunión.",
        "error"
      );

    }

  },


  /* =======================================================
     BÚSQUEDA
  ======================================================= */

  buscarReunion() {

    if (!this.reunionId) {

      this.reunion =
        null;

      return;

    }

    this.reunion =
      this.reuniones.find(
        reunion =>
          String(reunion.id) ===
          String(this.reunionId)
      ) || null;

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    if (this.elementos.botonEditar) {

      this.elementos.botonEditar.addEventListener(
        "click",
        evento => {

          evento.preventDefault();

          this.editarReunion();

        }
      );

    }

    if (this.elementos.botonEliminar) {

      this.elementos.botonEliminar.addEventListener(
        "click",
        evento => {

          evento.preventDefault();

          this.abrirConfirmacionEliminar();

        }
      );

    }

    if (this.elementos.botonConfirmarEliminar) {

      this.elementos.botonConfirmarEliminar.addEventListener(
        "click",
        () => {

          this.eliminarReunion();

        }
      );

    }

    if (this.elementos.botonCancelarEliminar) {

      this.elementos.botonCancelarEliminar.addEventListener(
        "click",
        () => {

          this.cerrarConfirmacionEliminar();

        }
      );

    }

    if (this.elementos.modalEliminar) {

      this.elementos.modalEliminar.addEventListener(
        "click",
        evento => {

          if (
            evento.target ===
            this.elementos.modalEliminar
          ) {

            this.cerrarConfirmacionEliminar();

          }

        }
      );

    }

    document.addEventListener(
      "keydown",
      evento => {

        if (evento.key === "Escape") {

          this.cerrarConfirmacionEliminar();

        }

      }
    );

  },

    /* =======================================================
     RENDERIZADO PRINCIPAL
  ======================================================= */

  renderizarReunion() {

    const reunion =
      this.reunion;

    if (!reunion) {

      return;

    }

    const asunto =
      reunion.asunto ||
      reunion.titulo ||
      "Reunión institucional";

    const institucion =
      reunion.institucionNombre ||
      reunion.institucion ||
      "Institución sin especificar";

    const estado =
      reunion.estado ||
      "programada";

    const fecha =
      this.obtenerFechaReunion(
        reunion
      );

    const requiereSeguimiento =
      Boolean(
        reunion.requiereSeguimiento
      );

    this.asignarTexto(
      this.elementos.tituloPagina,
      asunto
    );

    this.asignarTexto(
      this.elementos.asunto,
      asunto
    );

    this.asignarTexto(
      this.elementos.institucion,
      institucion
    );

    this.asignarTexto(
  this.elementos.institucionDetalle,
  institucion
);

    this.asignarTexto(
      this.elementos.fecha,
      this.formatearFechaCompleta(
        fecha
      )
    );

    this.asignarTexto(
      this.elementos.hora,
      reunion.hora ||
      reunion.horario ||
      "Sin horario informado"
    );

    this.asignarTexto(
      this.elementos.duracion,
      this.obtenerEtiquetaDuracion(
        reunion.duracion
      )
    );

    this.asignarTexto(
      this.elementos.modalidad,
      this.obtenerEtiquetaModalidad(
        reunion.modalidad
      )
    );

    this.asignarTexto(
      this.elementos.tipo,
      this.obtenerEtiquetaTipo(
        reunion.tipo
      )
    );

    this.asignarTexto(
      this.elementos.objetivo,
      reunion.objetivo ||
      "Sin objetivo informado"
    );

    this.asignarTexto(
      this.elementos.referente,
      reunion.referente ||
      "Sin referente informado"
    );

    this.asignarTexto(
      this.elementos.responsable,
      reunion.responsable ||
      "Sin responsable informado"
    );

    this.asignarTexto(
      this.elementos.participantes,
      this.obtenerCantidadParticipantes(
        reunion.participantes
      )
    );

    this.asignarTexto(
      this.elementos.ubicacion,
      reunion.ubicacion ||
      reunion.enlace ||
      reunion.localidad ||
      "Sin ubicación o enlace informado"
    );

    this.asignarTexto(
      this.elementos.seguimiento,
      requiereSeguimiento
        ? "Requiere seguimiento posterior"
        : "Sin seguimiento pendiente"
    );

    this.asignarTexto(
      this.elementos.observaciones,
      reunion.observaciones ||
      "Sin observaciones registradas"
    );

    this.asignarTexto(
      this.elementos.fechaCreacion,
      this.formatearFechaCreacion(
        reunion.fechaCreacion
      )
    );

    this.renderizarEstado(
      estado
    );

    this.renderizarSeguimiento(
      reunion
    );

    this.mostrarContenido();

  },


  /* =======================================================
     ESTADO
  ======================================================= */

  renderizarEstado(
    estado
  ) {

    const elemento =
      this.elementos.estado;

    if (!elemento) {

      return;

    }

    const estadoNormalizado =
      String(
        estado || "programada"
      )
        .toLowerCase()
        .trim();

    elemento.textContent =
      this.obtenerEtiquetaEstado(
        estadoNormalizado
      );

    elemento.classList.remove(
      "estado-programada",
      "estado-confirmada",
      "estado-completada",
      "estado-cancelada",
      "estado-reprogramada"
    );

    elemento.classList.add(
      `estado-${estadoNormalizado}`
    );

  },


  /* =======================================================
     SEGUIMIENTO
  ======================================================= */

  renderizarSeguimiento(
    reunion
  ) {

    const elemento =
      this.elementos.seguimiento;

    if (!elemento) {

      return;

    }

    const estadoSeguimiento =
      String(
        reunion.seguimientoEstado || ""
      )
        .toLowerCase()
        .trim();

    elemento.classList.remove(
      "es-pendiente",
      "es-completo",
      "es-sin-seguimiento"
    );

    if (
      estadoSeguimiento === "completo" ||
      estadoSeguimiento === "completado"
    ) {

      elemento.textContent =
        "Seguimiento completado";

      elemento.classList.add(
        "es-completo"
      );

      return;

    }

    if (
      reunion.requiereSeguimiento ||
      estadoSeguimiento === "pendiente"
    ) {

      elemento.textContent =
        "Requiere seguimiento posterior";

      elemento.classList.add(
        "es-pendiente"
      );

      return;

    }

    elemento.textContent =
      "Sin seguimiento pendiente";

    elemento.classList.add(
      "es-sin-seguimiento"
    );

  },


  /* =======================================================
     VISIBILIDAD
  ======================================================= */

  mostrarContenido() {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        true;

    }

    if (this.elementos.estadoNoEncontrada) {

      this.elementos.estadoNoEncontrada.hidden =
        true;

    }

    if (this.elementos.contenido) {

      this.elementos.contenido.hidden =
        false;

    }

  },


  mostrarReunionNoEncontrada() {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        true;

    }

    if (this.elementos.contenido) {

      this.elementos.contenido.hidden =
        true;

    }

    if (this.elementos.estadoNoEncontrada) {

      this.elementos.estadoNoEncontrada.hidden =
        false;

    }

    this.mostrarMensaje(
      "No encontramos la reunión solicitada. Es posible que haya sido eliminada o que el enlace no sea válido.",
      "error"
    );

  },


  /* =======================================================
     EDICIÓN
  ======================================================= */

  editarReunion() {

    if (!this.reunionId) {

      return;

    }

    const pagina =
      FALCO_COMUNIDAD_REUNION_CONFIG
        .paginaEdicion;

    window.location.href =
      `${pagina}?editar=${encodeURIComponent(this.reunionId)}`;

  },


  /* =======================================================
     CONFIRMACIÓN DE ELIMINACIÓN
  ======================================================= */

  abrirConfirmacionEliminar() {

    if (!this.elementos.modalEliminar) {

      const confirmar =
        window.confirm(
          "¿Querés eliminar esta reunión? Esta acción no se puede deshacer."
        );

      if (confirmar) {

        this.eliminarReunion();

      }

      return;

    }

    this.elementos.modalEliminar.hidden =
      false;

    document.body.classList.add(
      "modal-abierto"
    );

    if (this.elementos.botonCancelarEliminar) {

      this.elementos.botonCancelarEliminar.focus();

    }

  },


  cerrarConfirmacionEliminar() {

    if (!this.elementos.modalEliminar) {

      return;

    }

    this.elementos.modalEliminar.hidden =
      true;

    document.body.classList.remove(
      "modal-abierto"
    );

  },


  /* =======================================================
     ELIMINACIÓN
  ======================================================= */

  eliminarReunion() {

    if (!this.reunionId) {

      return;

    }

    const reunionesActualizadas =
      this.reuniones.filter(
        reunion =>
          String(reunion.id) !==
          String(this.reunionId)
      );

    try {

      localStorage.setItem(
        FALCO_COMUNIDAD_REUNION_CONFIG
          .claveReunionesLocales,
        JSON.stringify(
          reunionesActualizadas
        )
      );

      this.cerrarConfirmacionEliminar();

      this.mostrarMensaje(
        "La reunión fue eliminada correctamente.",
        "exito"
      );

      setTimeout(
        () => {

          window.location.href =
            FALCO_COMUNIDAD_REUNION_CONFIG
              .paginaListado;

        },
        700
      );

    } catch (error) {

      console.error(
        "No fue posible eliminar la reunión:",
        error
      );

      this.mostrarMensaje(
        "No fue posible eliminar la reunión.",
        "error"
      );

    }

  },

    /* =======================================================
     FECHAS
  ======================================================= */

  obtenerFechaReunion(
    reunion
  ) {

    const valor =
      reunion.fecha ||
      reunion.fechaReunion ||
      reunion.inicio ||
      "";

    if (!valor) {

      return null;

    }

    if (valor instanceof Date) {

      return Number.isNaN(
        valor.getTime()
      )
        ? null
        : valor;

    }

    if (
      typeof valor === "object" &&
      typeof valor.toDate === "function"
    ) {

      const fecha =
        valor.toDate();

      return Number.isNaN(
        fecha.getTime()
      )
        ? null
        : fecha;

    }

    const texto =
      String(
        valor
      ).trim();

    if (!texto) {

      return null;

    }

    const partesFecha =
      texto.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );

    if (partesFecha) {

      const fechaLocal =
        new Date(
          Number(partesFecha[1]),
          Number(partesFecha[2]) - 1,
          Number(partesFecha[3])
        );

      return Number.isNaN(
        fechaLocal.getTime()
      )
        ? null
        : fechaLocal;

    }

    const fecha =
      new Date(
        texto
      );

    return Number.isNaN(
      fecha.getTime()
    )
      ? null
      : fecha;

  },


  formatearFechaCompleta(
    fecha
  ) {

    if (!fecha) {

      return "Sin fecha informada";

    }

    return fecha.toLocaleDateString(
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
    );

  },


  formatearFechaCreacion(
    valor
  ) {

    if (!valor) {

      return "Sin fecha de registro";

    }

    const fecha =
      new Date(
        valor
      );

    if (
      Number.isNaN(
        fecha.getTime()
      )
    ) {

      return "Sin fecha de registro";

    }

    return fecha.toLocaleDateString(
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
    );

  },


  /* =======================================================
     ETIQUETAS
  ======================================================= */

  obtenerEtiquetaEstado(
    estado
  ) {

    const etiquetas = {

      programada:
        "Programada",

      confirmada:
        "Confirmada",

      completada:
        "Completada",

      cancelada:
        "Cancelada",

      reprogramada:
        "Reprogramada"

    };

    return (
      etiquetas[estado] ||
      this.capitalizarTexto(
        estado
      ) ||
      "Programada"
    );

  },


  obtenerEtiquetaModalidad(
    modalidad
  ) {

    const etiquetas = {

      virtual:
        "Virtual",

      presencial:
        "Presencial",

      telefonica:
        "Telefónica",

      mixta:
        "Mixta"

    };

    return (
      etiquetas[modalidad] ||
      this.capitalizarTexto(
        modalidad
      ) ||
      "Sin modalidad informada"
    );

  },


  obtenerEtiquetaTipo(
    tipo
  ) {

    const etiquetas = {

      inicial:
        "Reunión inicial",

      seguimiento:
        "Seguimiento",

      presentacion:
        "Presentación institucional",

      propuesta:
        "Presentación de propuesta",

      coordinacion:
        "Coordinación",

      cierre:
        "Cierre",

      otro:
        "Otro tipo"

    };

    return (
      etiquetas[tipo] ||
      this.capitalizarTexto(
        tipo
      ) ||
      "Sin tipo informado"
    );

  },


  obtenerEtiquetaDuracion(
    duracion
  ) {

    const etiquetas = {

      "15":
        "15 minutos",

      "30":
        "30 minutos",

      "45":
        "45 minutos",

      "60":
        "1 hora",

      "90":
        "1 hora y 30 minutos",

      "120":
        "2 horas"

    };

    const valor =
      String(
        duracion || ""
      ).trim();

    return (
      etiquetas[valor] ||
      this.capitalizarTexto(
        valor
      ) ||
      "Sin duración estimada"
    );

  },


  obtenerCantidadParticipantes(
    cantidad
  ) {

    const valor =
      Number(
        cantidad
      );

    if (
      !Number.isFinite(valor) ||
      valor <= 0
    ) {

      return "Sin cantidad informada";

    }

    if (valor === 1) {

      return "1 participante";

    }

    return `${valor} participantes`;

  },


  /* =======================================================
     MENSAJES
  ======================================================= */

  mostrarMensaje(
    texto,
    tipo = ""
  ) {

    const elemento =
      this.elementos.mensaje;

    if (!elemento) {

      return;

    }

    elemento.textContent =
      texto;

    elemento.classList.remove(
      "es-exito",
      "es-error",
      "es-aviso"
    );

    if (tipo === "exito") {

      elemento.classList.add(
        "es-exito"
      );

    }

    if (tipo === "error") {

      elemento.classList.add(
        "es-error"
      );

    }

    if (tipo === "aviso") {

      elemento.classList.add(
        "es-aviso"
      );

    }

    elemento.hidden =
      false;

  },


  /* =======================================================
     UTILIDADES
  ======================================================= */

  asignarTexto(
    elemento,
    texto
  ) {

    if (!elemento) {

      return;

    }

    elemento.textContent =
      String(
        texto ?? ""
      );

  },


  capitalizarTexto(
    valor
  ) {

    const texto =
      String(
        valor || ""
      )
        .replace(
          /[-_]+/g,
          " "
        )
        .trim();

    if (!texto) {

      return "";

    }

    return (
      texto.charAt(0).toUpperCase() +
      texto.slice(1)
    );

  }

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FALCOComunidadReunion.init();

  }
);