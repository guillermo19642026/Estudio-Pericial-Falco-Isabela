/* =========================================================
   FALCO® COMUNIDAD
   FICHA DE PROYECTO
   Gestión con localStorage
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_PROYECTO_CONFIG = {

  storageProyectos:
    "falco_comunidad_proyectos",

  paginaListado:
    "./proyectos.html",

  paginaEdicion:
    "./nuevo-proyecto.html",

  demoraCarga:
    250,

  demoraRedireccion:
    500

};


/* =========================================================
   CONTROLADOR PRINCIPAL
========================================================= */

const FalcoComunidadProyecto = {

  elementos: {},

  proyectoId: null,

  proyecto: null,

  temporizadorNotificacion: null,


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.cachearElementos();

    this.proyectoId =
      this.obtenerProyectoIdDesdeUrl();

    this.configurarEventos();

    window.setTimeout(
      () => {

        this.cargarProyecto();

      },
      FALCO_COMUNIDAD_PROYECTO_CONFIG
        .demoraCarga
    );

    console.info(
      "FALCO Comunidad Proyecto™ v1.0 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  cachearElementos() {

    this.elementos = {

      loader:
        document.getElementById(
          "proyectoLoader"
        ),

      pagina:
        document.getElementById(
          "proyectoPagina"
        ),

      noEncontrado:
        document.getElementById(
          "proyectoNoEncontrado"
        ),

      inicial:
        document.getElementById(
          "proyectoInicial"
        ),

      nombre:
        document.getElementById(
          "proyectoNombre"
        ),

      area:
        document.getElementById(
          "proyectoArea"
        ),

      estado:
        document.getElementById(
          "proyectoEstado"
        ),

      descripcionCorta:
        document.getElementById(
          "proyectoDescripcionCorta"
        ),

      responsable:
        document.getElementById(
          "proyectoResponsable"
        ),

      modalidad:
        document.getElementById(
          "proyectoModalidad"
        ),

      fechaInicio:
        document.getElementById(
          "proyectoFechaInicio"
        ),

      fechaFinalizacion:
        document.getElementById(
          "proyectoFechaFinalizacion"
        ),

      fechaActualizacion:
        document.getElementById(
          "proyectoFechaActualizacion"
        ),

      contadorInstituciones:
        document.getElementById(
          "contadorInstitucionesProyecto"
        ),

      contadorParticipantes:
        document.getElementById(
          "contadorParticipantesProyecto"
        ),

      contadorReuniones:
        document.getElementById(
          "contadorReunionesProyecto"
        ),

      porcentajeAvance:
        document.getElementById(
          "porcentajeAvanceProyecto"
        ),

      textoAvance:
        document.getElementById(
          "textoAvanceProyecto"
        ),

      descripcion:
        document.getElementById(
          "proyectoDescripcion"
        ),

      objetivoGeneral:
        document.getElementById(
          "proyectoObjetivoGeneral"
        ),

      objetivosEspecificosBloque:
        document.getElementById(
          "objetivosEspecificosBloque"
        ),

      objetivosEspecificos:
        document.getElementById(
          "proyectoObjetivosEspecificos"
        ),

      poblacion:
        document.getElementById(
          "proyectoPoblacion"
        ),

      observacionesBloque:
        document.getElementById(
          "observacionesProyectoBloque"
        ),

      observaciones:
        document.getElementById(
          "proyectoObservaciones"
        ),

      actividadFechaCreacion:
        document.getElementById(
          "actividadFechaCreacion"
        ),

      tipo:
        document.getElementById(
          "proyectoTipo"
        ),

      alcance:
        document.getElementById(
          "proyectoAlcance"
        ),

      equipo:
        document.getElementById(
          "proyectoEquipo"
        ),

      localidad:
        document.getElementById(
          "proyectoLocalidad"
        ),

      ubicacion:
        document.getElementById(
          "proyectoUbicacion"
        ),

      institucionInicial:
        document.getElementById(
          "institucionProyectoInicial"
        ),

      institucionNombre:
        document.getElementById(
          "proyectoInstitucionNombre"
        ),

      institucionEstado:
        document.getElementById(
          "proyectoInstitucionEstado"
        ),

      contactoBloque:
        document.getElementById(
          "contactoProyectoBloque"
        ),

      correo:
        document.getElementById(
          "proyectoCorreo"
        ),

      telefono:
        document.getElementById(
          "proyectoTelefono"
        ),

      indicadorDestacado:
        document.getElementById(
          "estadoDestacadoProyecto"
        ),

      indicadorParticipantes:
        document.getElementById(
          "estadoParticipantesProyecto"
        ),

      indicadorInstituciones:
        document.getElementById(
          "estadoInstitucionesProyecto"
        ),

      indicadorSeguimiento:
        document.getElementById(
          "estadoSeguimientoProyecto"
        ),

      estadoModuloInstituciones:
        document.getElementById(
          "estadoModuloInstituciones"
        ),

      estadoModuloParticipantes:
        document.getElementById(
          "estadoModuloParticipantes"
        ),

      estadoModuloReuniones:
        document.getElementById(
          "estadoModuloReuniones"
        ),

      estadoModuloSeguimiento:
        document.getElementById(
          "estadoModuloSeguimiento"
        ),

      botonEditar:
        document.getElementById(
          "botonEditarProyecto"
        ),

      botonCambiarEstado:
        document.getElementById(
          "botonCambiarEstadoProyecto"
        ),

      botonAdministrarInstituciones:
        document.getElementById(
          "botonAdministrarInstituciones"
        ),

      botonAdministrarParticipantes:
        document.getElementById(
          "botonAdministrarParticipantes"
        ),

      botonAdministrarReuniones:
        document.getElementById(
          "botonAdministrarReuniones"
        ),

      botonAdministrarSeguimiento:
        document.getElementById(
          "botonAdministrarSeguimiento"
        ),

      botonDuplicar:
        document.getElementById(
          "botonDuplicarProyecto"
        ),

      botonArchivar:
        document.getElementById(
          "botonArchivarProyecto"
        ),

      botonEliminar:
        document.getElementById(
          "botonEliminarProyecto"
        ),

      modalEstado:
        document.getElementById(
          "modalEstadoProyecto"
        ),

      selectorEstado:
        document.getElementById(
          "selectorEstadoProyecto"
        ),

      botonCancelarEstado:
        document.getElementById(
          "botonCancelarEstadoProyecto"
        ),

      botonGuardarEstado:
        document.getElementById(
          "botonGuardarEstadoProyecto"
        ),

      modalEliminar:
        document.getElementById(
          "modalEliminarProyecto"
        ),

      botonCancelarEliminar:
        document.getElementById(
          "botonCancelarEliminarProyecto"
        ),

      botonConfirmarEliminar:
        document.getElementById(
          "botonConfirmarEliminarProyecto"
        ),

      notificacion:
        document.getElementById(
          "notificacionProyecto"
        )

    };

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  configurarEventos() {

    this.elementos.botonCambiarEstado
      ?.addEventListener(
        "click",
        () => {

          this.abrirModalEstado();

        }
      );


    this.elementos.botonCancelarEstado
      ?.addEventListener(
        "click",
        () => {

          this.cerrarModalEstado();

        }
      );


    this.elementos.botonGuardarEstado
      ?.addEventListener(
        "click",
        () => {

          this.guardarNuevoEstado();

        }
      );


    this.elementos.modalEstado
      ?.querySelectorAll(
        "[data-cerrar-modal-estado]"
      )
      .forEach(
        (elemento) => {

          elemento.addEventListener(
            "click",
            () => {

              this.cerrarModalEstado();

            }
          );

        }
      );


    this.elementos.botonEliminar
      ?.addEventListener(
        "click",
        () => {

          this.abrirModalEliminar();

        }
      );


    this.elementos.botonCancelarEliminar
      ?.addEventListener(
        "click",
        () => {

          this.cerrarModalEliminar();

        }
      );


    this.elementos.botonConfirmarEliminar
      ?.addEventListener(
        "click",
        () => {

          this.eliminarProyecto();

        }
      );


    this.elementos.modalEliminar
      ?.querySelectorAll(
        "[data-cerrar-modal-eliminar]"
      )
      .forEach(
        (elemento) => {

          elemento.addEventListener(
            "click",
            () => {

              this.cerrarModalEliminar();

            }
          );

        }
      );


    this.elementos.botonDuplicar
      ?.addEventListener(
        "click",
        () => {

          this.duplicarProyecto();

        }
      );


    this.elementos.botonArchivar
      ?.addEventListener(
        "click",
        () => {

          this.archivarProyecto();

        }
      );


    this.elementos.botonAdministrarInstituciones
      ?.addEventListener(
        "click",
        () => {

          this.mostrarModuloPendiente(
            "La gestión de instituciones vinculadas se integrará en el próximo paso."
          );

        }
      );


    this.elementos.botonAdministrarParticipantes
      ?.addEventListener(
        "click",
        () => {

          if (
            !this.proyecto
              ?.aceptaParticipantes
          ) {

            this.mostrarNotificacion(
              "La gestión de participantes no está habilitada para este proyecto.",
              "info"
            );

            return;

          }

          this.mostrarModuloPendiente(
            "La gestión de participantes se integrará próximamente."
          );

        }
      );


    this.elementos.botonAdministrarReuniones
      ?.addEventListener(
        "click",
        () => {

          this.mostrarModuloPendiente(
            "El registro de reuniones se integrará próximamente."
          );

        }
      );


    this.elementos.botonAdministrarSeguimiento
      ?.addEventListener(
        "click",
        () => {

          if (
            !this.proyecto
              ?.requiereSeguimiento
          ) {

            this.mostrarNotificacion(
              "El seguimiento administrativo no está habilitado para este proyecto.",
              "info"
            );

            return;

          }

          this.mostrarModuloPendiente(
            "El seguimiento del proyecto se integrará próximamente."
          );

        }
      );


    document.addEventListener(
      "keydown",
      (evento) => {

        if (
          evento.key !== "Escape"
        ) {

          return;

        }

        this.cerrarModalEstado();

        this.cerrarModalEliminar();

      }
    );

  },


  /* =======================================================
     CARGA DEL PROYECTO
  ======================================================= */

  cargarProyecto() {

    if (!this.proyectoId) {

      this.mostrarProyectoNoEncontrado();

      return;

    }


    const proyectos =
      this.obtenerProyectos();


    const proyecto =
      proyectos.find(
        (item) => {

          const id =
            String(
              item?.id || ""
            );

          const slug =
            String(
              item?.slug || ""
            );

          return (
            id ===
              String(this.proyectoId) ||
            slug ===
              String(this.proyectoId)
          );

        }
      );


    if (!proyecto) {

      this.mostrarProyectoNoEncontrado();

      return;

    }


    this.proyecto =
      proyecto;


    this.renderizarProyecto();

    this.ocultarLoader();

    this.elementos.pagina.hidden =
      false;

  },


  obtenerProyectoIdDesdeUrl() {

    const parametros =
      new URLSearchParams(
        window.location.search
      );

    const id =
      parametros.get("id");

    return id
      ? decodeURIComponent(
          String(id).trim()
        )
      : null;

  },


  mostrarProyectoNoEncontrado() {

    this.ocultarLoader();

    if (this.elementos.pagina) {

      this.elementos.pagina.hidden =
        true;

    }

    if (this.elementos.noEncontrado) {

      this.elementos.noEncontrado.hidden =
        false;

    }

  },


  ocultarLoader() {

    if (this.elementos.loader) {

      this.elementos.loader.hidden =
        true;

    }

  },


  /* =======================================================
     RENDER GENERAL
  ======================================================= */

  renderizarProyecto() {

    const proyecto =
      this.proyecto;


    document.title =
      `${proyecto.nombre || "Proyecto"} | FALCO® Comunidad`;


    this.asignarTexto(
      this.elementos.inicial,
      this.obtenerIniciales(
        proyecto.nombre
      )
    );


    this.asignarTexto(
      this.elementos.nombre,
      proyecto.nombre ||
      "Proyecto sin nombre"
    );


    this.asignarTexto(
      this.elementos.area,
      this.obtenerEtiquetaArea(
        proyecto.area
      )
    );


    this.renderizarEstado(
      proyecto.estado
    );


    this.asignarTexto(
      this.elementos.descripcionCorta,
      this.crearDescripcionCorta(
        proyecto.descripcion
      )
    );


    this.asignarTexto(
      this.elementos.responsable,
      proyecto.responsable ||
      "Sin definir"
    );


    this.asignarTexto(
      this.elementos.modalidad,
      this.obtenerEtiquetaModalidad(
        proyecto.modalidad
      )
    );


    this.asignarTexto(
      this.elementos.fechaInicio,
      this.formatearFecha(
        proyecto.fechaInicio
      ) ||
      "Sin definir"
    );


    this.asignarTexto(
      this.elementos.fechaFinalizacion,
      this.formatearFecha(
        proyecto.fechaFinalizacion
      ) ||
      "Sin definir"
    );


    this.asignarTexto(
      this.elementos.fechaActualizacion,
      this.formatearFechaHora(
        proyecto.fechaActualizacion ||
        proyecto.fechaCreacion
      )
    );


    this.renderizarIndicadores();

    this.renderizarDescripcion();

    this.renderizarObjetivos();

    this.renderizarPoblacion();

    this.renderizarDatosAdministrativos();

    this.renderizarInstitucion();

    this.renderizarContacto();

    this.renderizarConfiguracion();

    this.renderizarObservaciones();

    this.renderizarActividad();

    this.configurarEnlaceEdicion();

    this.actualizarAcciones();

  },


  /* =======================================================
     INDICADORES
  ======================================================= */

  renderizarIndicadores() {

    const instituciones =
      this.obtenerCantidad(
        this.proyecto.instituciones
      );


    const participantes =
      this.obtenerCantidad(
        this.proyecto.participantes
      );


    const reuniones =
      this.obtenerCantidad(
        this.proyecto.reuniones
      );


    const avance =
      this.calcularAvanceProyecto(
        this.proyecto
      );


    this.asignarTexto(
      this.elementos.contadorInstituciones,
      instituciones
    );


    this.asignarTexto(
      this.elementos.contadorParticipantes,
      participantes
    );


    this.asignarTexto(
      this.elementos.contadorReuniones,
      reuniones
    );


    this.asignarTexto(
      this.elementos.porcentajeAvance,
      `${avance}%`
    );


    this.asignarTexto(
      this.elementos.textoAvance,
      this.obtenerTextoAvance(
        this.proyecto.estado,
        avance
      )
    );

  },


  calcularAvanceProyecto(
    proyecto
  ) {

    const estado =
      String(
        proyecto.estado || ""
      );


    const avancesEstado = {

      planificado:
        20,

      en_ejecucion:
        55,

      pausado:
        45,

      finalizado:
        100,

      archivado:
        100

    };


    return avancesEstado[estado] ??
      0;

  },


  obtenerTextoAvance(
    estado,
    avance
  ) {

    const textos = {

      planificado:
        "Proyecto planificado",

      en_ejecucion:
        "Proyecto en ejecución",

      pausado:
        "Proyecto pausado",

      finalizado:
        "Proyecto finalizado",

      archivado:
        "Proyecto archivado"

    };


    return textos[estado] ||
      `Avance estimado: ${avance}%`;

  },


  /* =======================================================
     DESCRIPCIÓN
  ======================================================= */

  renderizarDescripcion() {

    this.asignarTexto(
      this.elementos.descripcion,
      this.proyecto.descripcion ||
      "Sin descripción registrada."
    );

  },


  crearDescripcionCorta(
    descripcion
  ) {

    const texto =
      String(
        descripcion || ""
      ).trim();


    if (!texto) {

      return "Información general del proyecto institucional.";

    }


    if (texto.length <= 170) {

      return texto;

    }


    return `${texto.slice(
      0,
      167
    ).trim()}...`;

  },


  /* =======================================================
     OBJETIVOS
  ======================================================= */

  renderizarObjetivos() {

    const objetivoGeneral =
      this.proyecto.objetivoGeneral ||
      this.proyecto.objetivo ||
      "";


    this.asignarTexto(
      this.elementos.objetivoGeneral,
      objetivoGeneral ||
      "Sin objetivo general registrado."
    );


    const objetivos =
      this.normalizarObjetivos(
        this.proyecto
          .objetivosEspecificos
      );


    if (!objetivos.length) {

      this.elementos
        .objetivosEspecificosBloque
        .hidden =
          true;

      this.elementos
        .objetivosEspecificos
        .innerHTML =
          "";

      return;

    }


    this.elementos
      .objetivosEspecificosBloque
      .hidden =
        false;


    this.elementos
      .objetivosEspecificos
      .innerHTML =
        "";


    objetivos.forEach(
      (objetivo) => {

        const item =
          document.createElement(
            "li"
          );

        item.textContent =
          objetivo;

        this.elementos
          .objetivosEspecificos
          .appendChild(
            item
          );

      }
    );

  },


  normalizarObjetivos(
    objetivos
  ) {

    if (Array.isArray(objetivos)) {

      return objetivos
        .map(
          (objetivo) =>
            String(
              objetivo || ""
            ).trim()
        )
        .filter(Boolean);

    }


    if (typeof objetivos === "string") {

      return objetivos
        .split(/\n+/)
        .map(
          (objetivo) =>
            objetivo.trim()
        )
        .filter(Boolean);

    }


    return [];

  },


  /* =======================================================
     POBLACIÓN
  ======================================================= */

  renderizarPoblacion() {

    this.asignarTexto(
      this.elementos.poblacion,
      this.proyecto
        .poblacionDestinataria ||
      this.proyecto.poblacion ||
      "Sin población destinataria definida."
    );

  },


  /* =======================================================
     DATOS ADMINISTRATIVOS
  ======================================================= */

  renderizarDatosAdministrativos() {

    this.asignarTexto(
      this.elementos.tipo,
      this.obtenerEtiquetaTipo(
        this.proyecto.tipo
      )
    );


    this.asignarTexto(
      this.elementos.alcance,
      this.obtenerEtiquetaAlcance(
        this.proyecto.alcance
      )
    );


    this.asignarTexto(
      this.elementos.equipo,
      this.proyecto.equipo ||
      "Sin definir"
    );


    this.asignarTexto(
      this.elementos.localidad,
      this.proyecto.localidad ||
      "Sin definir"
    );


    this.asignarTexto(
      this.elementos.ubicacion,
      this.proyecto.ubicacion ||
      "Sin definir"
    );

  },


  /* =======================================================
     INSTITUCIÓN
  ======================================================= */

  renderizarInstitucion() {

    const nombreInstitucion =
      this.proyecto
        .institucionNombre ||
      this.proyecto
        .institucionManual ||
      "";


    if (!nombreInstitucion) {

      this.asignarTexto(
        this.elementos.institucionInicial,
        "IN"
      );

      this.asignarTexto(
        this.elementos.institucionNombre,
        "Sin institución vinculada"
      );

      this.asignarTexto(
        this.elementos.institucionEstado,
        "Vinculación pendiente"
      );

      return;

    }


    this.asignarTexto(
      this.elementos.institucionInicial,
      this.obtenerIniciales(
        nombreInstitucion
      )
    );


    this.asignarTexto(
      this.elementos.institucionNombre,
      nombreInstitucion
    );


    this.asignarTexto(
      this.elementos.institucionEstado,
      "Institución vinculada"
    );

  },


  /* =======================================================
     CONTACTO
  ======================================================= */

  renderizarContacto() {

    const correo =
      String(
        this.proyecto
          .correoContacto || ""
      ).trim();


    const telefono =
      String(
        this.proyecto
          .telefonoContacto || ""
      ).trim();


    if (!correo && !telefono) {

      if (
        this.elementos
          .contactoBloque
      ) {

        this.elementos
          .contactoBloque
          .hidden =
            true;

      }

      return;

    }


    this.elementos
      .contactoBloque
      .hidden =
        false;


    if (correo) {

      this.elementos.correo.textContent =
        correo;

      this.elementos.correo.href =
        `mailto:${correo}`;

    } else {

      this.elementos.correo.textContent =
        "Sin registrar";

      this.elementos.correo.removeAttribute(
        "href"
      );

    }


    if (telefono) {

      this.elementos.telefono.textContent =
        telefono;

      this.elementos.telefono.href =
        `tel:${this.normalizarTelefono(
          telefono
        )}`;

    } else {

      this.elementos.telefono.textContent =
        "Sin registrar";

      this.elementos.telefono.removeAttribute(
        "href"
      );

    }

  },


  normalizarTelefono(
    telefono
  ) {

    return String(telefono)
      .replace(
        /[^\d+]/g,
        ""
      );

  },


  /* =======================================================
     CONFIGURACIÓN
  ======================================================= */

  renderizarConfiguracion() {

    this.configurarIndicador(
      this.elementos.indicadorDestacado,
      Boolean(
        this.proyecto.destacado
      )
    );


    this.configurarIndicador(
      this.elementos.indicadorParticipantes,
      Boolean(
        this.proyecto
          .aceptaParticipantes
      )
    );


    this.configurarIndicador(
      this.elementos.indicadorInstituciones,
      Boolean(
        this.proyecto
          .aceptaInstituciones
      )
    );


    this.configurarIndicador(
      this.elementos.indicadorSeguimiento,
      Boolean(
        this.proyecto
          .requiereSeguimiento
      )
    );


    this.configurarModulo(
      this.elementos
        .estadoModuloInstituciones,
      this.elementos
        .botonAdministrarInstituciones,
      this.proyecto
        .aceptaInstituciones !== false
    );


    this.configurarModulo(
      this.elementos
        .estadoModuloParticipantes,
      this.elementos
        .botonAdministrarParticipantes,
      Boolean(
        this.proyecto
          .aceptaParticipantes
      )
    );


    this.configurarModulo(
      this.elementos
        .estadoModuloReuniones,
      this.elementos
        .botonAdministrarReuniones,
      true
    );


    this.configurarModulo(
      this.elementos
        .estadoModuloSeguimiento,
      this.elementos
        .botonAdministrarSeguimiento,
      this.proyecto
        .requiereSeguimiento !== false
    );

  },


  configurarIndicador(
    elemento,
    activo
  ) {

    if (!elemento) {

      return;

    }


    elemento.classList.toggle(
      "es-activo",
      activo
    );


    elemento.classList.toggle(
      "es-inactivo",
      !activo
    );

  },


  configurarModulo(
    estado,
    boton,
    habilitado
  ) {

    if (estado) {

      estado.textContent =
        habilitado
          ? "Disponible"
          : "Deshabilitado";


      estado.classList.toggle(
        "es-deshabilitado",
        !habilitado
      );

    }


    if (boton) {

      boton.disabled =
        !habilitado;

    }

  },


  /* =======================================================
     OBSERVACIONES
  ======================================================= */

  renderizarObservaciones() {

    const observaciones =
      String(
        this.proyecto
          .observaciones || ""
      ).trim();


    if (!observaciones) {

      this.elementos
        .observacionesBloque
        .hidden =
          true;

      return;

    }


    this.elementos
      .observacionesBloque
      .hidden =
        false;


    this.asignarTexto(
      this.elementos.observaciones,
      observaciones
    );

  },


  /* =======================================================
     ACTIVIDAD
  ======================================================= */

  renderizarActividad() {

    this.asignarTexto(
      this.elementos
        .actividadFechaCreacion,
      this.proyecto.fechaCreacion
        ? `Registrado el ${this.formatearFechaHora(
            this.proyecto.fechaCreacion
          )}`
        : "Fecha de creación no disponible"
    );

  },


  /* =======================================================
     ENLACE DE EDICIÓN
  ======================================================= */

  configurarEnlaceEdicion() {

    if (!this.elementos.botonEditar) {

      return;

    }


    this.elementos.botonEditar.href =
      `${FALCO_COMUNIDAD_PROYECTO_CONFIG.paginaEdicion}?id=${encodeURIComponent(
        this.proyecto.id
      )}`;

  },


  /* =======================================================
     ESTADO DEL PROYECTO
  ======================================================= */

  renderizarEstado(
    estado
  ) {

    const estadoNormalizado =
      String(
        estado ||
        "planificado"
      );


    this.elementos.estado.textContent =
      this.obtenerEtiquetaEstado(
        estadoNormalizado
      );


    this.elementos.estado.className =
      `proyecto-estado proyecto-estado--${estadoNormalizado}`;

  },


  abrirModalEstado() {

    if (
      !this.elementos.modalEstado ||
      !this.proyecto
    ) {

      return;

    }


    this.elementos
      .selectorEstado
      .value =
        this.proyecto.estado ||
        "planificado";


    this.elementos.modalEstado.hidden =
      false;


    document.body.classList.add(
      "modal-abierto"
    );


    window.setTimeout(
      () => {

        this.elementos
          .selectorEstado
          ?.focus();

      },
      50
    );

  },


  cerrarModalEstado() {

    if (
      !this.elementos.modalEstado ||
      this.elementos.modalEstado.hidden
    ) {

      return;

    }


    this.elementos.modalEstado.hidden =
      true;


    document.body.classList.remove(
      "modal-abierto"
    );

  },


  guardarNuevoEstado() {

    const nuevoEstado =
      this.elementos
        .selectorEstado
        ?.value;


    if (!nuevoEstado) {

      return;

    }


    const actualizado =
      this.actualizarProyecto(
        {

          estado:
            nuevoEstado,

          fechaActualizacion:
            new Date().toISOString()

        }
      );


    if (!actualizado) {

      this.mostrarNotificacion(
        "No fue posible actualizar el estado.",
        "error"
      );

      return;

    }


    this.cerrarModalEstado();

    this.renderizarProyecto();


    this.mostrarNotificacion(
      "El estado del proyecto fue actualizado correctamente.",
      "exito"
    );

  },


  archivarProyecto() {

    if (!this.proyecto) {

      return;

    }


    if (
      this.proyecto.estado ===
      "archivado"
    ) {

      this.mostrarNotificacion(
        "El proyecto ya se encuentra archivado.",
        "info"
      );

      return;

    }


    const actualizado =
      this.actualizarProyecto(
        {

          estado:
            "archivado",

          fechaActualizacion:
            new Date().toISOString()

        }
      );


    if (!actualizado) {

      this.mostrarNotificacion(
        "No fue posible archivar el proyecto.",
        "error"
      );

      return;

    }


    this.renderizarProyecto();


    this.mostrarNotificacion(
      "El proyecto fue archivado correctamente.",
      "exito"
    );

  },


  actualizarAcciones() {

    if (!this.elementos.botonArchivar) {

      return;

    }


    const archivado =
      this.proyecto.estado ===
      "archivado";


    this.elementos.botonArchivar.disabled =
      archivado;


    this.elementos.botonArchivar.textContent =
      archivado
        ? "Proyecto archivado"
        : "↓ Archivar proyecto";

  },


  /* =======================================================
     DUPLICAR
  ======================================================= */

  duplicarProyecto() {

    if (!this.proyecto) {

      return;

    }


    const proyectos =
      this.obtenerProyectos();


    const nombreDuplicado =
      `${this.proyecto.nombre} — Copia`;


    const idDuplicado =
      this.crearIdProyecto(
        nombreDuplicado,
        proyectos
      );


    const ahora =
      new Date().toISOString();


    const proyectoDuplicado = {

      ...this.proyecto,

      id:
        idDuplicado,

      slug:
        idDuplicado,

      nombre:
        nombreDuplicado,

      estado:
        "planificado",

      participantes:
        0,

      reuniones:
        0,

      fechaCreacion:
        ahora,

      fechaActualizacion:
        ahora,

      esBorrador:
        false

    };


    proyectos.push(
      proyectoDuplicado
    );


    if (
      !this.guardarProyectos(
        proyectos
      )
    ) {

      this.mostrarNotificacion(
        "No fue posible duplicar el proyecto.",
        "error"
      );

      return;

    }


    this.mostrarNotificacion(
      "El proyecto fue duplicado correctamente.",
      "exito"
    );


    window.setTimeout(
      () => {

        window.location.href =
          `./proyecto.html?id=${encodeURIComponent(
            proyectoDuplicado.id
          )}`;

      },
      FALCO_COMUNIDAD_PROYECTO_CONFIG
        .demoraRedireccion
    );

  },


  /* =======================================================
     ELIMINAR
  ======================================================= */

  abrirModalEliminar() {

    if (!this.elementos.modalEliminar) {

      return;

    }


    this.elementos.modalEliminar.hidden =
      false;


    document.body.classList.add(
      "modal-abierto"
    );


    window.setTimeout(
      () => {

        this.elementos
          .botonCancelarEliminar
          ?.focus();

      },
      50
    );

  },


  cerrarModalEliminar() {

    if (
      !this.elementos.modalEliminar ||
      this.elementos.modalEliminar.hidden
    ) {

      return;

    }


    this.elementos.modalEliminar.hidden =
      true;


    document.body.classList.remove(
      "modal-abierto"
    );

  },


  eliminarProyecto() {

    if (!this.proyecto) {

      return;

    }


    const proyectos =
      this.obtenerProyectos();


    const nuevosProyectos =
      proyectos.filter(
        (item) =>
          String(item.id) !==
          String(this.proyecto.id)
      );


    if (
      nuevosProyectos.length ===
      proyectos.length
    ) {

      this.cerrarModalEliminar();

      this.mostrarNotificacion(
        "No fue posible encontrar el proyecto para eliminarlo.",
        "error"
      );

      return;

    }


    if (
      !this.guardarProyectos(
        nuevosProyectos
      )
    ) {

      this.cerrarModalEliminar();

      this.mostrarNotificacion(
        "No fue posible eliminar el proyecto.",
        "error"
      );

      return;

    }


    this.cerrarModalEliminar();


    this.mostrarNotificacion(
      "El proyecto fue eliminado correctamente.",
      "exito"
    );


    window.setTimeout(
      () => {

        window.location.href =
          FALCO_COMUNIDAD_PROYECTO_CONFIG
            .paginaListado;

      },
      FALCO_COMUNIDAD_PROYECTO_CONFIG
        .demoraRedireccion
    );

  },


  /* =======================================================
     ACTUALIZACIÓN LOCAL
  ======================================================= */

  actualizarProyecto(
    cambios
  ) {

    const proyectos =
      this.obtenerProyectos();


    const indice =
      proyectos.findIndex(
        (item) =>
          String(item.id) ===
          String(this.proyecto.id)
      );


    if (indice === -1) {

      return false;

    }


    const actualizado = {

      ...proyectos[indice],

      ...cambios

    };


    proyectos[indice] =
      actualizado;


    if (
      !this.guardarProyectos(
        proyectos
      )
    ) {

      return false;

    }


    this.proyecto =
      actualizado;


    return true;

  },


  /* =======================================================
     LOCALSTORAGE
  ======================================================= */

  obtenerProyectos() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_PROYECTO_CONFIG
            .storageProyectos
        );


      if (!contenido) {

        return [];

      }


      const proyectos =
        JSON.parse(
          contenido
        );


      return Array.isArray(proyectos)
        ? proyectos
        : [];

    } catch (error) {

      console.error(
        "No fue posible leer los proyectos:",
        error
      );


      return [];

    }

  },


  guardarProyectos(
    proyectos
  ) {

    try {

      localStorage.setItem(
        FALCO_COMUNIDAD_PROYECTO_CONFIG
          .storageProyectos,
        JSON.stringify(
          proyectos
        )
      );


      return true;

    } catch (error) {

      console.error(
        "No fue posible guardar los proyectos:",
        error
      );


      return false;

    }

  },


  /* =======================================================
     CREACIÓN DE ID
  ======================================================= */

  crearIdProyecto(
    nombre,
    proyectos
  ) {

    const base =
      this.crearSlug(nombre) ||
      `proyecto-${Date.now()}`;


    let id =
      base;


    let numero =
      2;


    while (
      proyectos.some(
        (proyecto) =>
          String(proyecto.id) ===
          String(id)
      )
    ) {

      id =
        `${base}-${numero}`;

      numero +=
        1;

    }


    return id;

  },


  crearSlug(
    texto
  ) {

    return String(texto || "")
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  },


  /* =======================================================
     NOTIFICACIONES
  ======================================================= */

  mostrarModuloPendiente(
    mensaje
  ) {

    this.mostrarNotificacion(
      mensaje,
      "info"
    );

  },


  mostrarNotificacion(
    mensaje,
    tipo = "exito"
  ) {

    const notificacion =
      this.elementos.notificacion;


    if (!notificacion) {

      return;

    }


    window.clearTimeout(
      this.temporizadorNotificacion
    );


    notificacion.hidden =
      false;


    notificacion.textContent =
      mensaje;


    notificacion.classList.remove(
      "es-error",
      "es-info"
    );


    if (tipo === "error") {

      notificacion.classList.add(
        "es-error"
      );

    }


    if (tipo === "info") {

      notificacion.classList.add(
        "es-info"
      );

    }


    this.temporizadorNotificacion =
      window.setTimeout(
        () => {

          notificacion.hidden =
            true;

        },
        3600
      );

  },


  /* =======================================================
     ETIQUETAS
  ======================================================= */

  obtenerEtiquetaEstado(
    estado
  ) {

    const etiquetas = {

      planificado:
        "Planificado",

      en_ejecucion:
        "En ejecución",

      pausado:
        "Pausado",

      finalizado:
        "Finalizado",

      archivado:
        "Archivado"

    };


    return etiquetas[estado] ||
      "Planificado";

  },


  obtenerEtiquetaArea(
    area
  ) {

    const etiquetas = {

      comunidad:
        "Comunidad",

      adolescencia:
        "Adolescencia",

      familia:
        "Familia",

      educacion:
        "Educación",

      salud_mental:
        "Salud mental",

      institucional:
        "Institucional",

      capacitacion:
        "Capacitación",

      otro:
        "Otra área"

    };


    return etiquetas[area] ||
      this.formatearEtiqueta(area) ||
      "Área sin definir";

  },


  obtenerEtiquetaModalidad(
    modalidad
  ) {

    const etiquetas = {

      presencial:
        "Presencial",

      virtual:
        "Virtual",

      hibrida:
        "Híbrida"

    };


    return etiquetas[modalidad] ||
      this.formatearEtiqueta(
        modalidad
      ) ||
      "Sin definir";

  },


  obtenerEtiquetaTipo(
    tipo
  ) {

    const etiquetas = {

      programa:
        "Programa",

      proyecto:
        "Proyecto",

      intervencion:
        "Intervención",

      capacitacion:
        "Capacitación",

      campana:
        "Campaña",

      investigacion:
        "Investigación",

      otro:
        "Otro"

    };


    return etiquetas[tipo] ||
      this.formatearEtiqueta(tipo) ||
      "Sin definir";

  },


  obtenerEtiquetaAlcance(
    alcance
  ) {

    const etiquetas = {

      local:
        "Local",

      municipal:
        "Municipal",

      regional:
        "Regional",

      provincial:
        "Provincial",

      nacional:
        "Nacional",

      virtual:
        "Virtual"

    };


    return etiquetas[alcance] ||
      this.formatearEtiqueta(
        alcance
      ) ||
      "Sin definir";

  },


  formatearEtiqueta(
    valor
  ) {

    const texto =
      String(
        valor || ""
      )
        .replace(
          /[_-]+/g,
          " "
        )
        .trim();


    if (!texto) {

      return "";

    }


    return texto
      .charAt(0)
      .toUpperCase() +
      texto.slice(1);

  },


  /* =======================================================
     FECHAS
  ======================================================= */

  formatearFecha(
    fecha
  ) {

    if (!fecha) {

      return "";

    }


    const partes =
      String(fecha).split("-");


    if (partes.length !== 3) {

      return fecha;

    }


    const [
      anio,
      mes,
      dia
    ] = partes;


    return `${dia}/${mes}/${anio}`;

  },


  formatearFechaHora(
    fecha
  ) {

    if (!fecha) {

      return "Sin datos";

    }


    const objetoFecha =
      new Date(fecha);


    if (
      Number.isNaN(
        objetoFecha.getTime()
      )
    ) {

      return "Sin datos";

    }


    return objetoFecha.toLocaleString(
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
     UTILIDADES
  ======================================================= */

  asignarTexto(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }


    elemento.textContent =
      valor !== undefined &&
      valor !== null
        ? String(valor)
        : "";

  },


  obtenerIniciales(
    texto
  ) {

    const palabras =
      String(texto || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);


    if (!palabras.length) {

      return "PR";

    }


    if (palabras.length === 1) {

      return palabras[0]
        .slice(0, 2)
        .toUpperCase();

    }


    return (
      palabras[0][0] +
      palabras[1][0]
    ).toUpperCase();

  },


  obtenerCantidad(
    valor
  ) {

    const numero =
      Number(valor);


    return Number.isFinite(numero)
      ? Math.max(
          0,
          numero
        )
      : 0;

  }

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadProyecto.init();

  }
);