/* =========================================================
   FALCO® COMUNIDAD
   NUEVO PROYECTO
   Gestión con localStorage
========================================================= */


const FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG = {

  storageProyectos:
    "falco_comunidad_proyectos",

  storageBorrador:
    "falco_comunidad_nuevo_proyecto_borrador",

  storageInstituciones:
    "falco_comunidad_instituciones",

  paginaListado:
    "./proyectos.html",

  paginaDetalle:
    "./proyecto.html"

};


/* =========================================================
   CONTROLADOR PRINCIPAL
========================================================= */

const FalcoComunidadNuevoProyecto = {

  elementos: {},

  proyectoIdEdicion: null,

  proyectoOriginal: null,

  formularioModificado: false,

  guardando: false,


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.cachearElementos();

    if (!this.elementos.formulario) {

      console.warn(
        "FALCO Comunidad Nuevo Proyecto™: formulario no encontrado."
      );

      return;

    }

    this.detectarModoEdicion();

    this.cargarInstituciones();

    this.configurarEventos();

    this.configurarContadores();

    this.cargarDatosIniciales();

    this.actualizarVistaPreliminar();

    this.actualizarEstadoFormulario(
      this.proyectoIdEdicion
        ? "Proyecto cargado"
        : "Sin guardar",
      this.proyectoIdEdicion
        ? "guardado"
        : "pendiente"
    );

    console.info(
      "FALCO Comunidad Nuevo Proyecto™ v1.0 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  cachearElementos() {

    this.elementos = {

      formulario:
        document.getElementById(
          "formularioProyecto"
        ),

      tituloPagina:
        document.getElementById(
          "tituloPaginaProyecto"
        ),

      estadoFormulario:
        document.getElementById(
          "estadoFormularioProyecto"
        ),

      mensajeFormulario:
        document.getElementById(
          "mensajeFormularioProyecto"
        ),

      botonGuardarBorrador:
        document.getElementById(
          "botonGuardarBorradorProyecto"
        ),

      botonReiniciar:
        document.getElementById(
          "botonReiniciarProyecto"
        ),

      botonRegistrar:
        document.getElementById(
          "botonRegistrarProyecto"
        ),

      textoBotonRegistrar:
        document.getElementById(
          "textoBotonRegistrarProyecto"
        ),

      spinnerRegistrar:
        document.getElementById(
          "spinnerRegistrarProyecto"
        ),

      modalReiniciar:
        document.getElementById(
          "modalReiniciarProyecto"
        ),

      botonCancelarReinicio:
        document.getElementById(
          "botonCancelarReinicioProyecto"
        ),

      botonConfirmarReinicio:
        document.getElementById(
          "botonConfirmarReinicioProyecto"
        ),

      nombre:
        document.getElementById(
          "nombreProyecto"
        ),

      area:
        document.getElementById(
          "areaProyecto"
        ),

      estado:
        document.getElementById(
          "estadoProyecto"
        ),

      tipo:
        document.getElementById(
          "tipoProyecto"
        ),

      alcance:
        document.getElementById(
          "alcanceProyecto"
        ),

      descripcion:
        document.getElementById(
          "descripcionProyecto"
        ),

      objetivo:
        document.getElementById(
          "objetivoGeneralProyecto"
        ),

      objetivosEspecificos:
        document.getElementById(
          "objetivosEspecificosProyecto"
        ),

      poblacion:
        document.getElementById(
          "poblacionProyecto"
        ),

      responsable:
        document.getElementById(
          "responsableProyecto"
        ),

      equipo:
        document.getElementById(
          "equipoProyecto"
        ),

      institucion:
        document.getElementById(
          "institucionProyecto"
        ),

      institucionManualContenedor:
        document.getElementById(
          "institucionManualContenedor"
        ),

      institucionManual:
        document.getElementById(
          "institucionManualProyecto"
        ),

      correoContacto:
        document.getElementById(
          "correoContactoProyecto"
        ),

      telefonoContacto:
        document.getElementById(
          "telefonoContactoProyecto"
        ),

      fechaInicio:
        document.getElementById(
          "fechaInicioProyecto"
        ),

      fechaFinalizacion:
        document.getElementById(
          "fechaFinalizacionProyecto"
        ),

      modalidad:
        document.getElementById(
          "modalidadProyecto"
        ),

      localidad:
        document.getElementById(
          "localidadProyecto"
        ),

      ubicacion:
        document.getElementById(
          "ubicacionProyecto"
        ),

      destacado:
        document.getElementById(
          "proyectoDestacado"
        ),

      aceptaParticipantes:
        document.getElementById(
          "proyectoAceptaParticipantes"
        ),

      aceptaInstituciones:
        document.getElementById(
          "proyectoAceptaInstituciones"
        ),

      requiereSeguimiento:
        document.getElementById(
          "proyectoRequiereSeguimiento"
        ),

      observaciones:
        document.getElementById(
          "observacionesProyecto"
        ),

      contadorDescripcion:
        document.getElementById(
          "contadorDescripcionProyecto"
        ),

      contadorObjetivo:
        document.getElementById(
          "contadorObjetivoProyecto"
        ),

      contadorObjetivosEspecificos:
        document.getElementById(
          "contadorObjetivosEspecificos"
        ),

      contadorPoblacion:
        document.getElementById(
          "contadorPoblacionProyecto"
        ),

      contadorObservaciones:
        document.getElementById(
          "contadorObservacionesProyecto"
        ),

      inicialResumen:
        document.getElementById(
          "inicialProyectoResumen"
        ),

      nombreResumen:
        document.getElementById(
          "nombreProyectoResumen"
        ),

      areaResumen:
        document.getElementById(
          "areaProyectoResumen"
        ),

      estadoResumen:
        document.getElementById(
          "estadoResumenProyecto"
        ),

      responsableResumen:
        document.getElementById(
          "responsableProyectoResumen"
        ),

      modalidadResumen:
        document.getElementById(
          "modalidadProyectoResumen"
        ),

      fechaResumen:
        document.getElementById(
          "fechaProyectoResumen"
        )

    };

  },


  /* =======================================================
     MODO EDICIÓN
  ======================================================= */

  detectarModoEdicion() {

    const parametros =
      new URLSearchParams(
        window.location.search
      );

    const id =
      parametros.get("id");

    if (!id) {

      return;

    }

    this.proyectoIdEdicion =
      String(id).trim();

    if (this.elementos.tituloPagina) {

      this.elementos.tituloPagina.textContent =
        "Editar proyecto";

    }

    if (this.elementos.textoBotonRegistrar) {

      this.elementos.textoBotonRegistrar.textContent =
        "Guardar cambios";

    }

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

configurarEventos() {

  const {
    formulario,
    botonGuardarBorrador,
    botonReiniciar,
    botonCancelarReinicio,
    botonConfirmarReinicio,
    modalReiniciar,
    institucion
  } = this.elementos;


  formulario.addEventListener(
    "submit",
    (evento) => {

      evento.preventDefault();

      this.guardarProyecto();

    }
  );


  formulario.addEventListener(
    "input",
    () => {

      this.formularioModificado =
        true;

      this.actualizarVistaPreliminar();

      this.actualizarEstadoFormulario(
        "Cambios sin guardar",
        "pendiente"
      );

    }
  );


  formulario.addEventListener(
    "change",
    () => {

      this.formularioModificado =
        true;

      this.actualizarVistaPreliminar();

      this.actualizarEstadoFormulario(
        "Cambios sin guardar",
        "pendiente"
      );

    }
  );


  if (botonGuardarBorrador) {

    botonGuardarBorrador.addEventListener(
      "click",
      (evento) => {

        evento.preventDefault();

        evento.stopPropagation();

        this.guardarBorrador();

      }
    );

  } else {

    console.error(
      "No se encontró el botón Guardar borrador."
    );

  }


  if (botonReiniciar) {

    botonReiniciar.addEventListener(
      "click",
      (evento) => {

        evento.preventDefault();

        this.abrirModalReinicio();

      }
    );

  }


  if (botonCancelarReinicio) {

    botonCancelarReinicio.addEventListener(
      "click",
      () => {

        this.cerrarModalReinicio();

      }
    );

  }


  if (botonConfirmarReinicio) {

    botonConfirmarReinicio.addEventListener(
      "click",
      () => {

        this.reiniciarFormulario();

      }
    );

  }


  if (modalReiniciar) {

    modalReiniciar
      .querySelectorAll(
        "[data-cerrar-modal]"
      )
      .forEach(
        (elemento) => {

          elemento.addEventListener(
            "click",
            () => {

              this.cerrarModalReinicio();

            }
          );

        }
      );

  }


  document.addEventListener(
    "keydown",
    (evento) => {

      if (
        evento.key === "Escape" &&
        modalReiniciar &&
        !modalReiniciar.hidden
      ) {

        this.cerrarModalReinicio();

      }

    }
  );


  if (institucion) {

    institucion.addEventListener(
      "change",
      () => {

        this.controlarInstitucionManual();

      }
    );

  }


  window.addEventListener(
    "beforeunload",
    (evento) => {

      if (
        this.formularioModificado &&
        !this.guardando
      ) {

        evento.preventDefault();

        evento.returnValue =
          "";

      }

    }
  );

},


  /* =======================================================
     CARGA INICIAL
  ======================================================= */

  cargarDatosIniciales() {

    if (this.proyectoIdEdicion) {

      this.cargarProyectoParaEdicion();

      return;

    }

    this.cargarBorrador();

  },


  cargarProyectoParaEdicion() {

    const proyectos =
      this.obtenerProyectos();

    const proyecto =
      proyectos.find(
        (item) =>
          String(item.id) ===
          String(this.proyectoIdEdicion)
      );

    if (!proyecto) {

      this.mostrarMensaje(
        "No se encontró el proyecto solicitado.",
        "error"
      );

      this.actualizarEstadoFormulario(
        "Proyecto no encontrado",
        "error"
      );

      return;

    }

    this.proyectoOriginal =
      proyecto;

    this.cargarDatosEnFormulario(
      proyecto
    );

    this.formularioModificado =
      false;

  },


  cargarBorrador() {

    try {

      const borradorGuardado =
        localStorage.getItem(
          FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
            .storageBorrador
        );

      if (!borradorGuardado) {

        return;

      }

      const borrador =
        JSON.parse(
          borradorGuardado
        );

      if (
        !borrador ||
        typeof borrador !== "object"
      ) {

        return;

      }

      this.cargarDatosEnFormulario(
        borrador
      );

      this.actualizarEstadoFormulario(
        "Borrador restaurado",
        "guardado"
      );

      this.mostrarMensaje(
        "Se restauró el borrador guardado en este dispositivo.",
        "info"
      );

      this.formularioModificado =
        false;

    } catch (error) {

      console.error(
        "No fue posible restaurar el borrador:",
        error
      );

    }

  },


  cargarDatosEnFormulario(
    datos
  ) {

    this.asignarValor(
      this.elementos.nombre,
      datos.nombre
    );

    this.asignarValor(
      this.elementos.area,
      datos.area
    );

    this.asignarValor(
      this.elementos.estado,
      datos.estado || "planificado"
    );

    this.asignarValor(
      this.elementos.tipo,
      datos.tipo
    );

    this.asignarValor(
      this.elementos.alcance,
      datos.alcance
    );

    this.asignarValor(
      this.elementos.descripcion,
      datos.descripcion
    );

    this.asignarValor(
      this.elementos.objetivo,
      datos.objetivo ||
      datos.objetivoGeneral
    );

    this.asignarValor(
      this.elementos.objetivosEspecificos,
      this.normalizarObjetivosParaFormulario(
        datos.objetivosEspecificos
      )
    );

    this.asignarValor(
      this.elementos.poblacion,
      datos.poblacionDestinataria ||
      datos.poblacion
    );

    this.asignarValor(
      this.elementos.responsable,
      datos.responsable ||
      "Lic. Isabela Falco"
    );

    this.asignarValor(
      this.elementos.equipo,
      datos.equipo
    );

    this.asignarValor(
      this.elementos.institucion,
      datos.institucionId
    );

    this.asignarValor(
      this.elementos.institucionManual,
      datos.institucionManual
    );

    this.asignarValor(
      this.elementos.correoContacto,
      datos.correoContacto
    );

    this.asignarValor(
      this.elementos.telefonoContacto,
      datos.telefonoContacto
    );

    this.asignarValor(
      this.elementos.fechaInicio,
      datos.fechaInicio
    );

    this.asignarValor(
      this.elementos.fechaFinalizacion,
      datos.fechaFinalizacion
    );

    this.asignarValor(
      this.elementos.modalidad,
      datos.modalidad
    );

    this.asignarValor(
      this.elementos.localidad,
      datos.localidad
    );

    this.asignarValor(
      this.elementos.ubicacion,
      datos.ubicacion
    );

    this.asignarCheckbox(
      this.elementos.destacado,
      datos.destacado
    );

    this.asignarCheckbox(
      this.elementos.aceptaParticipantes,
      datos.aceptaParticipantes
    );

    this.asignarCheckbox(
      this.elementos.aceptaInstituciones,
      datos.aceptaInstituciones !== false
    );

    this.asignarCheckbox(
      this.elementos.requiereSeguimiento,
      datos.requiereSeguimiento !== false
    );

    this.asignarValor(
      this.elementos.observaciones,
      datos.observaciones
    );

    this.controlarInstitucionManual();

    this.actualizarTodosLosContadores();

    this.actualizarVistaPreliminar();

  },


  asignarValor(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }

    elemento.value =
      valor !== undefined &&
      valor !== null
        ? String(valor)
        : "";

  },


  asignarCheckbox(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }

    elemento.checked =
      Boolean(valor);

  },


  /* =======================================================
     INSTITUCIONES
  ======================================================= */

  cargarInstituciones() {

    const selector =
      this.elementos.institucion;

    if (!selector) {

      return;

    }

    const valorActual =
      selector.value;

    selector.innerHTML =
      `
        <option value="">
          Sin institución vinculada
        </option>
      `;


    const instituciones =
      this.obtenerInstituciones();


    instituciones
      .filter(
        (institucion) =>
          institucion &&
          institucion.nombre
      )
      .sort(
        (a, b) =>
          String(a.nombre)
            .localeCompare(
              String(b.nombre),
              "es",
              {
                sensitivity:
                  "base"
              }
            )
      )
      .forEach(
        (institucion) => {

          const opcion =
            document.createElement(
              "option"
            );

          opcion.value =
            institucion.id ||
            this.crearSlug(
              institucion.nombre
            );

          opcion.textContent =
            institucion.nombre;

          selector.appendChild(
            opcion
          );

        }
      );


    const opcionManual =
      document.createElement(
        "option"
      );

    opcionManual.value =
      "__manual__";

    opcionManual.textContent =
      "Otra institución";

    selector.appendChild(
      opcionManual
    );


    if (valorActual) {

      selector.value =
        valorActual;

    }

  },


  controlarInstitucionManual() {

    const valor =
      this.elementos.institucion
        ?.value;

    const mostrar =
      valor === "__manual__";

    if (
      this.elementos
        .institucionManualContenedor
    ) {

      this.elementos
        .institucionManualContenedor
        .hidden =
          !mostrar;

    }

    if (
      !mostrar &&
      this.elementos.institucionManual
    ) {

      this.elementos
        .institucionManual
        .value =
          "";

    }

  },


  obtenerInstituciones() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
            .storageInstituciones
        );

      if (!contenido) {

        return [];

      }

      const datos =
        JSON.parse(
          contenido
        );

      return Array.isArray(datos)
        ? datos
        : [];

    } catch (error) {

      console.error(
        "No fue posible leer las instituciones:",
        error
      );

      return [];

    }

  },


  /* =======================================================
     CONTADORES
  ======================================================= */

  configurarContadores() {

    const configuraciones = [

      {
        campo:
          this.elementos.descripcion,
        contador:
          this.elementos.contadorDescripcion,
        maximo:
          1200
      },

      {
        campo:
          this.elementos.objetivo,
        contador:
          this.elementos.contadorObjetivo,
        maximo:
          700
      },

      {
        campo:
          this.elementos.objetivosEspecificos,
        contador:
          this.elementos.contadorObjetivosEspecificos,
        maximo:
          1200
      },

      {
        campo:
          this.elementos.poblacion,
        contador:
          this.elementos.contadorPoblacion,
        maximo:
          500
      },

      {
        campo:
          this.elementos.observaciones,
        contador:
          this.elementos.contadorObservaciones,
        maximo:
          1000
      }

    ];


    configuraciones.forEach(
      (configuracion) => {

        configuracion.campo
          ?.addEventListener(
            "input",
            () => {

              this.actualizarContador(
                configuracion.campo,
                configuracion.contador,
                configuracion.maximo
              );

            }
          );

      }
    );


    this.actualizarTodosLosContadores();

  },


  actualizarTodosLosContadores() {

    this.actualizarContador(
      this.elementos.descripcion,
      this.elementos.contadorDescripcion,
      1200
    );

    this.actualizarContador(
      this.elementos.objetivo,
      this.elementos.contadorObjetivo,
      700
    );

    this.actualizarContador(
      this.elementos.objetivosEspecificos,
      this.elementos.contadorObjetivosEspecificos,
      1200
    );

    this.actualizarContador(
      this.elementos.poblacion,
      this.elementos.contadorPoblacion,
      500
    );

    this.actualizarContador(
      this.elementos.observaciones,
      this.elementos.contadorObservaciones,
      1000
    );

  },


  actualizarContador(
    campo,
    contador,
    maximo
  ) {

    if (
      !campo ||
      !contador
    ) {

      return;

    }

    contador.textContent =
      `${campo.value.length} / ${maximo}`;

  },


  /* =======================================================
     VISTA PRELIMINAR
  ======================================================= */

  actualizarVistaPreliminar() {

    const nombre =
      this.limpiarTexto(
        this.elementos.nombre?.value
      ) ||
      "Nuevo proyecto";

    const area =
      this.obtenerTextoSeleccionado(
        this.elementos.area
      ) ||
      "Área sin definir";

    const estado =
      this.obtenerTextoSeleccionado(
        this.elementos.estado
      ) ||
      "Borrador";

    const responsable =
      this.limpiarTexto(
        this.elementos.responsable?.value
      ) ||
      "Sin definir";

    const modalidad =
      this.obtenerTextoSeleccionado(
        this.elementos.modalidad
      ) ||
      "Sin definir";

    const fecha =
      this.formatearFecha(
        this.elementos.fechaInicio?.value
      ) ||
      "Sin definir";


    if (this.elementos.nombreResumen) {

      this.elementos.nombreResumen
        .textContent =
          nombre;

    }


    if (this.elementos.areaResumen) {

      this.elementos.areaResumen
        .textContent =
          area;

    }


    if (this.elementos.estadoResumen) {

      this.elementos.estadoResumen
        .textContent =
          estado;

    }


    if (this.elementos.responsableResumen) {

      this.elementos.responsableResumen
        .textContent =
          responsable;

    }


    if (this.elementos.modalidadResumen) {

      this.elementos.modalidadResumen
        .textContent =
          modalidad;

    }


    if (this.elementos.fechaResumen) {

      this.elementos.fechaResumen
        .textContent =
          fecha;

    }


    if (this.elementos.inicialResumen) {

      this.elementos.inicialResumen
        .textContent =
          this.obtenerIniciales(
            nombre
          );

    }

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

      return "NP";

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


  obtenerTextoSeleccionado(
    selector
  ) {

    if (
      !selector ||
      !selector.value
    ) {

      return "";

    }

    const opcion =
      selector.options[
        selector.selectedIndex
      ];

    return opcion
      ? opcion.textContent.trim()
      : "";

  },


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


  /* =======================================================
     BORRADOR
  ======================================================= */

  guardarBorrador() {

    const datos =
      this.obtenerDatosFormulario();

    datos.esBorrador =
      true;

    datos.fechaBorrador =
      new Date().toISOString();

    try {

      localStorage.setItem(
        FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
          .storageBorrador,
        JSON.stringify(datos)
      );

      this.formularioModificado =
        false;

      this.actualizarEstadoFormulario(
        "Borrador guardado",
        "guardado"
      );

      this.mostrarMensaje(
        "El borrador fue guardado correctamente en este dispositivo.",
        "exito"
      );

    } catch (error) {

      console.error(
        "No fue posible guardar el borrador:",
        error
      );

      this.mostrarMensaje(
        "No fue posible guardar el borrador.",
        "error"
      );

    }

  },


  eliminarBorrador() {

    localStorage.removeItem(
      FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
        .storageBorrador
    );

  },


  /* =======================================================
     GUARDADO PRINCIPAL
  ======================================================= */

  guardarProyecto() {

    if (this.guardando) {

      return;

    }

    this.limpiarErrores();

    const datos =
      this.obtenerDatosFormulario();

    const validacion =
      this.validarFormulario(
        datos
      );

    if (!validacion.valido) {

      this.mostrarMensaje(
        "Revisá los campos señalados antes de registrar el proyecto.",
        "error"
      );

      this.actualizarEstadoFormulario(
        "Formulario incompleto",
        "error"
      );

      validacion.primerCampo
        ?.focus();

      validacion.primerCampo
        ?.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center"
        });

      return;

    }


    this.guardando =
      true;

    this.mostrarEstadoCarga(
      true
    );


    try {

      const proyectos =
        this.obtenerProyectos();

      const ahora =
        new Date().toISOString();


      if (this.proyectoIdEdicion) {

        const indice =
          proyectos.findIndex(
            (proyecto) =>
              String(proyecto.id) ===
              String(this.proyectoIdEdicion)
          );

        if (indice === -1) {

          throw new Error(
            "No se encontró el proyecto para actualizar."
          );

        }

        const proyectoActualizado = {

          ...proyectos[indice],

          ...datos,

          id:
            proyectos[indice].id,

          slug:
            proyectos[indice].slug ||
            this.crearSlug(
              datos.nombre
            ),

          fechaCreacion:
            proyectos[indice]
              .fechaCreacion ||
            ahora,

          fechaActualizacion:
            ahora,

          esBorrador:
            false

        };

        proyectos[indice] =
          proyectoActualizado;

        this.guardarProyectos(
          proyectos
        );

        this.eliminarBorrador();

        this.formularioModificado =
          false;

        this.actualizarEstadoFormulario(
          "Cambios guardados",
          "guardado"
        );

        this.mostrarMensaje(
          "Los cambios del proyecto fueron guardados correctamente.",
          "exito"
        );

        window.setTimeout(
          () => {

            window.location.href =
              `${FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG.paginaDetalle}?id=${encodeURIComponent(
                proyectoActualizado.id
              )}`;

          },
          600
        );

        return;

      }


      const id =
        this.crearIdProyecto(
          datos.nombre,
          proyectos
        );


      const nuevoProyecto = {

        id,

        slug:
          id,

        ...datos,

        participantes:
          0,

        reuniones:
          0,

        instituciones:
          datos.institucionId ||
          datos.institucionManual
            ? 1
            : 0,

        fechaCreacion:
          ahora,

        fechaActualizacion:
          ahora,

        esBorrador:
          false

      };


      proyectos.push(
        nuevoProyecto
      );


      this.guardarProyectos(
        proyectos
      );

      this.eliminarBorrador();

      this.formularioModificado =
        false;

      this.actualizarEstadoFormulario(
        "Proyecto registrado",
        "guardado"
      );

      this.mostrarMensaje(
        "El proyecto fue registrado correctamente.",
        "exito"
      );


      window.setTimeout(
        () => {

          window.location.href =
            `${FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG.paginaDetalle}?id=${encodeURIComponent(
              nuevoProyecto.id
            )}`;

        },
        600
      );

    } catch (error) {

      console.error(
        "No fue posible registrar el proyecto:",
        error
      );

      this.mostrarMensaje(
        "No fue posible registrar el proyecto. Intentá nuevamente.",
        "error"
      );

      this.actualizarEstadoFormulario(
        "Error al guardar",
        "error"
      );

    } finally {

      window.setTimeout(
        () => {

          this.guardando =
            false;

          this.mostrarEstadoCarga(
            false
          );

        },
        300
      );

    }

  },


  obtenerDatosFormulario() {

    const institucionSeleccionada =
      this.elementos.institucion?.value ||
      "";

    const institucionManual =
      institucionSeleccionada === "__manual__"
        ? this.limpiarTexto(
            this.elementos
              .institucionManual
              ?.value
          )
        : "";


    const institucionId =
      institucionSeleccionada === "__manual__"
        ? ""
        : institucionSeleccionada;


    return {

      nombre:
        this.limpiarTexto(
          this.elementos.nombre?.value
        ),

      area:
        this.elementos.area?.value ||
        "",

      estado:
        this.elementos.estado?.value ||
        "planificado",

      tipo:
        this.elementos.tipo?.value ||
        "",

      alcance:
        this.elementos.alcance?.value ||
        "",

      descripcion:
        this.limpiarTextoLargo(
          this.elementos.descripcion?.value
        ),

      objetivo:
        this.limpiarTextoLargo(
          this.elementos.objetivo?.value
        ),

      objetivoGeneral:
        this.limpiarTextoLargo(
          this.elementos.objetivo?.value
        ),

      objetivosEspecificos:
        this.convertirObjetivosEnLista(
          this.elementos
            .objetivosEspecificos
            ?.value
        ),

      poblacionDestinataria:
        this.limpiarTextoLargo(
          this.elementos.poblacion?.value
        ),

      responsable:
        this.limpiarTexto(
          this.elementos.responsable?.value
        ),

      equipo:
        this.limpiarTexto(
          this.elementos.equipo?.value
        ),

      institucionId,

      institucionManual,

      institucionNombre:
        this.obtenerNombreInstitucion(
          institucionId,
          institucionManual
        ),

      correoContacto:
        this.limpiarTexto(
          this.elementos
            .correoContacto
            ?.value
        ),

      telefonoContacto:
        this.limpiarTexto(
          this.elementos
            .telefonoContacto
            ?.value
        ),

      fechaInicio:
        this.elementos.fechaInicio?.value ||
        "",

      fechaFinalizacion:
        this.elementos
          .fechaFinalizacion
          ?.value ||
        "",

      modalidad:
        this.elementos.modalidad?.value ||
        "",

      localidad:
        this.limpiarTexto(
          this.elementos.localidad?.value
        ),

      ubicacion:
        this.limpiarTexto(
          this.elementos.ubicacion?.value
        ),

      destacado:
        Boolean(
          this.elementos.destacado?.checked
        ),

      aceptaParticipantes:
        Boolean(
          this.elementos
            .aceptaParticipantes
            ?.checked
        ),

      aceptaInstituciones:
        Boolean(
          this.elementos
            .aceptaInstituciones
            ?.checked
        ),

      requiereSeguimiento:
        Boolean(
          this.elementos
            .requiereSeguimiento
            ?.checked
        ),

      observaciones:
        this.limpiarTextoLargo(
          this.elementos.observaciones?.value
        )

    };

  },


  obtenerNombreInstitucion(
    institucionId,
    institucionManual
  ) {

    if (institucionManual) {

      return institucionManual;

    }

    if (!institucionId) {

      return "";

    }

    const instituciones =
      this.obtenerInstituciones();

    const institucion =
      instituciones.find(
        (item) =>
          String(item.id) ===
          String(institucionId)
      );

    return institucion?.nombre ||
      "";

  },


  /* =======================================================
     VALIDACIÓN
  ======================================================= */

  validarFormulario(
    datos
  ) {

    let valido =
      true;

    let primerCampo =
      null;


    const registrarError = (
      campo,
      idError,
      mensaje
    ) => {

      valido =
        false;

      if (!primerCampo) {

        primerCampo =
          campo;

      }

      this.mostrarErrorCampo(
        campo,
        idError,
        mensaje
      );

    };


    if (!datos.nombre) {

      registrarError(
        this.elementos.nombre,
        "errorNombreProyecto",
        "Ingresá el nombre del proyecto."
      );

    }


    if (!datos.area) {

      registrarError(
        this.elementos.area,
        "errorAreaProyecto",
        "Seleccioná el área principal."
      );

    }


    if (!datos.estado) {

      registrarError(
        this.elementos.estado,
        "errorEstadoProyecto",
        "Seleccioná el estado inicial."
      );

    }


    if (!datos.descripcion) {

      registrarError(
        this.elementos.descripcion,
        "errorDescripcionProyecto",
        "Ingresá una descripción general."
      );

    }


    if (!datos.objetivo) {

      registrarError(
        this.elementos.objetivo,
        "errorObjetivoProyecto",
        "Ingresá el objetivo general."
      );

    }


    if (!datos.responsable) {

      registrarError(
        this.elementos.responsable,
        "errorResponsableProyecto",
        "Ingresá el responsable principal."
      );

    }


    if (
      datos.correoContacto &&
      !this.esCorreoValido(
        datos.correoContacto
      )
    ) {

      registrarError(
        this.elementos.correoContacto,
        "errorCorreoProyecto",
        "Ingresá un correo electrónico válido."
      );

    }


    if (
      datos.fechaInicio &&
      datos.fechaFinalizacion &&
      datos.fechaFinalizacion <
        datos.fechaInicio
    ) {

      registrarError(
        this.elementos.fechaFinalizacion,
        "errorFechaFinalizacionProyecto",
        "La fecha de finalización no puede ser anterior al inicio."
      );

    }


    if (
      this.elementos.institucion
        ?.value === "__manual__" &&
      !datos.institucionManual
    ) {

      registrarError(
        this.elementos.institucionManual,
        null,
        "Ingresá el nombre de la institución."
      );

    }


    return {

      valido,

      primerCampo

    };

  },


  mostrarErrorCampo(
    campo,
    idError,
    mensaje
  ) {

    if (campo) {

      campo.setAttribute(
        "aria-invalid",
        "true"
      );

    }

    if (!idError) {

      return;

    }

    const elementoError =
      document.getElementById(
        idError
      );

    if (elementoError) {

      elementoError.textContent =
        mensaje;

    }

  },


  limpiarErrores() {

    this.elementos.formulario
      .querySelectorAll(
        '[aria-invalid="true"]'
      )
      .forEach(
        (campo) => {

          campo.removeAttribute(
            "aria-invalid"
          );

        }
      );


    this.elementos.formulario
      .querySelectorAll(
        ".proyecto-campo__error"
      )
      .forEach(
        (error) => {

          error.textContent =
            "";

        }
      );

  },


  esCorreoValido(
    correo
  ) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        String(correo).trim()
      );

  },


  /* =======================================================
     PROYECTOS
  ======================================================= */

  obtenerProyectos() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
            .storageProyectos
        );

      if (!contenido) {

        return [];

      }

      const datos =
        JSON.parse(
          contenido
        );

      return Array.isArray(datos)
        ? datos
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

    localStorage.setItem(
      FALCO_COMUNIDAD_NUEVO_PROYECTO_CONFIG
        .storageProyectos,
      JSON.stringify(proyectos)
    );

  },


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
     REINICIO
  ======================================================= */

  abrirModalReinicio() {

    if (!this.elementos.modalReiniciar) {

      return;

    }

    this.elementos.modalReiniciar.hidden =
      false;

    document.body.classList.add(
      "modal-abierto"
    );

    this.elementos
      .botonCancelarReinicio
      ?.focus();

  },


  cerrarModalReinicio() {

    if (!this.elementos.modalReiniciar) {

      return;

    }

    this.elementos.modalReiniciar.hidden =
      true;

    document.body.classList.remove(
      "modal-abierto"
    );

    this.elementos.botonReiniciar
      ?.focus();

  },


  reiniciarFormulario() {

    this.elementos.formulario.reset();

    this.eliminarBorrador();

    this.limpiarErrores();

    this.ocultarMensaje();

    this.cerrarModalReinicio();

    this.formularioModificado =
      false;


    if (this.elementos.responsable) {

      this.elementos.responsable.value =
        "Lic. Isabela Falco";

    }


    if (this.elementos.estado) {

      this.elementos.estado.value =
        "planificado";

    }


    if (
      this.elementos.aceptaInstituciones
    ) {

      this.elementos
        .aceptaInstituciones
        .checked =
          true;

    }


    if (
      this.elementos.requiereSeguimiento
    ) {

      this.elementos
        .requiereSeguimiento
        .checked =
          true;

    }


    this.controlarInstitucionManual();

    this.actualizarTodosLosContadores();

    this.actualizarVistaPreliminar();

    this.actualizarEstadoFormulario(
      "Sin guardar",
      "pendiente"
    );


    window.scrollTo({

      top:
        0,

      behavior:
        "smooth"

    });


    window.setTimeout(
      () => {

        this.elementos.nombre
          ?.focus();

      },
      350
    );

  },


  /* =======================================================
     ESTADOS Y MENSAJES
  ======================================================= */

  actualizarEstadoFormulario(
    texto,
    tipo
  ) {

    if (!this.elementos.estadoFormulario) {

      return;

    }

    this.elementos.estadoFormulario
      .textContent =
        texto;


    const contenedor =
      this.elementos.estadoFormulario
        .closest(
          ".proyecto-form-header__estado"
        );

    const indicador =
      contenedor?.querySelector(
        ".proyecto-form-header__estado-indicador"
      );


    if (!indicador) {

      return;

    }


    const colores = {

      guardado:
        "var(--falco-success)",

      pendiente:
        "var(--falco-warning)",

      error:
        "var(--falco-danger)"

    };


    indicador.style.background =
      colores[tipo] ||
      colores.pendiente;

    indicador.style.boxShadow =
      tipo === "guardado"
        ? "0 0 0 5px rgba(105, 195, 157, 0.10)"
        : tipo === "error"
          ? "0 0 0 5px rgba(220, 127, 134, 0.10)"
          : "0 0 0 5px rgba(228, 185, 107, 0.10)";

  },


  mostrarMensaje(
    texto,
    tipo = "info"
  ) {

    const mensaje =
      this.elementos.mensajeFormulario;

    if (!mensaje) {

      return;

    }

    mensaje.hidden =
      false;

    mensaje.textContent =
      texto;

    mensaje.classList.remove(
      "es-exito",
      "es-error",
      "es-info"
    );

    mensaje.classList.add(
      tipo === "exito"
        ? "es-exito"
        : tipo === "error"
          ? "es-error"
          : "es-info"
    );

  },


  ocultarMensaje() {

    const mensaje =
      this.elementos.mensajeFormulario;

    if (!mensaje) {

      return;

    }

    mensaje.hidden =
      true;

    mensaje.textContent =
      "";

    mensaje.classList.remove(
      "es-exito",
      "es-error",
      "es-info"
    );

  },


  mostrarEstadoCarga(
    activo
  ) {

    if (this.elementos.botonRegistrar) {

      this.elementos.botonRegistrar
        .disabled =
          activo;

    }

    if (this.elementos.spinnerRegistrar) {

      this.elementos.spinnerRegistrar
        .hidden =
          !activo;

    }

    if (this.elementos.textoBotonRegistrar) {

      this.elementos.textoBotonRegistrar
        .textContent =
          activo
            ? "Guardando..."
            : this.proyectoIdEdicion
              ? "Guardar cambios"
              : "Registrar proyecto";

    }

  },


  /* =======================================================
     NORMALIZACIÓN
  ======================================================= */

  limpiarTexto(
    valor
  ) {

    return String(valor || "")
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  },


  limpiarTextoLargo(
    valor
  ) {

    return String(valor || "")
      .replace(
        /\r\n/g,
        "\n"
      )
      .replace(
        /[ \t]+/g,
        " "
      )
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

  },


  convertirObjetivosEnLista(
    valor
  ) {

    return String(valor || "")
      .split(/\n+/)
      .map(
        (objetivo) =>
          objetivo
            .replace(
              /^[•\-–—\d.)\s]+/,
              ""
            )
            .trim()
      )
      .filter(Boolean);

  },


  normalizarObjetivosParaFormulario(
    objetivos
  ) {

    if (Array.isArray(objetivos)) {

      return objetivos.join(
        "\n"
      );

    }

    return String(
      objetivos || ""
    );

  }

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadNuevoProyecto.init();

  }
);