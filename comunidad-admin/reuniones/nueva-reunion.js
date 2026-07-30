"use strict";

/* =========================================================
   FALCO® COMUNIDAD
   NUEVA REUNIÓN
========================================================= */

const FALCO_COMUNIDAD_REUNION = {

  STORAGE_REUNIONES:
    "falco_comunidad_reuniones",

  STORAGE_INSTITUCIONES:
    "falco_comunidad_instituciones",

  STORAGE_BORRADOR:
    "falco_comunidad_reunion_borrador"

};


/* =========================================================
   APLICACIÓN
========================================================= */

const FALCONuevaReunion = {

  formulario: null,

  editando: false,

  reunionId: null,

  reuniones: [],

  instituciones: [],


  /* =====================================================
     INICIO
  ===================================================== */

  init() {

    this.formulario =
      document.getElementById(
        "formularioNuevaReunion"
      );

    this.cargarInstituciones();

    this.cargarReuniones();

    this.detectarModoEdicion();

    this.restaurarBorrador();

    this.vincularEventos();

    console.log(
      "FALCO Nueva Reunión™ v1.0 Ready"
    );

  },


  /* =====================================================
     EVENTOS
  ===================================================== */

  vincularEventos() {

    if (!this.formulario) {

      return;

    }


    this.formulario.addEventListener(
      "submit",
      evento => {

        evento.preventDefault();

        this.guardar();

      }
    );


    const botonBorrador =
      document.getElementById(
        "botonGuardarBorradorReunion"
      );

    if (botonBorrador) {

      botonBorrador.addEventListener(
        "click",
        () => {

          this.guardarBorrador();

        }
      );

    }

  },


  /* =====================================================
     INSTITUCIONES
  ===================================================== */

  cargarInstituciones() {

    try {

      const datos =
        JSON.parse(

          localStorage.getItem(
            FALCO_COMUNIDAD_REUNION.STORAGE_INSTITUCIONES
          ) || "[]"

        );

      this.instituciones =
        Array.isArray(datos)
          ? datos
          : [];

    } catch {

      this.instituciones = [];

    }

    this.renderInstituciones();

  },


  renderInstituciones() {

    const select =
      document.getElementById(
        "institucionReunion"
      );

    if (!select) {

      return;

    }

    this.instituciones.forEach(
      institucion => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          institucion.id;

        option.textContent =
          institucion.nombre;

        select.appendChild(
          option
        );

      }
    );

  },


  /* =====================================================
     REUNIONES
  ===================================================== */

  cargarReuniones() {

    try {

      const datos =
        JSON.parse(

          localStorage.getItem(
            FALCO_COMUNIDAD_REUNION.STORAGE_REUNIONES
          ) || "[]"

        );

      this.reuniones =
        Array.isArray(datos)
          ? datos
          : [];

    } catch {

      this.reuniones = [];

    }

  },


  /* =====================================================
     EDICIÓN
  ===================================================== */

  detectarModoEdicion() {

    const parametros =
      new URLSearchParams(
        window.location.search
      );

    const editar =
      parametros.get(
        "editar"
      );

    if (!editar) {

      return;

    }

    this.editando = true;

    this.reunionId = editar;

    const reunion =
      this.reuniones.find(
        r => r.id === editar
      );

    if (!reunion) {

      return;

    }

    this.cargarFormulario(
      reunion
    );

    document.getElementById(
      "tituloPaginaReunion"
    ).textContent =
      "Editar reunión";

    document.getElementById(
      "tituloFormularioReunion"
    ).textContent =
      "Editar reunión";

    document.getElementById(
      "botonGuardarReunion"
    ).textContent =
      "Guardar cambios";

  },


  cargarFormulario(
    reunion
  ) {

    Object.keys(
      reunion
    ).forEach(
      clave => {

        const campo =
          this.formulario.elements[
            clave
          ];

        if (!campo) {

          return;

        }

        if (
          campo.type ===
          "checkbox"
        ) {

          campo.checked =
            Boolean(
              reunion[clave]
            );

        } else {

          campo.value =
            reunion[clave];

        }

      }
    );

  },

    /* =====================================================
     GUARDAR
  ===================================================== */

  guardar() {

    if (!this.validarFormulario()) {

      return;

    }

    const reunion =
      this.obtenerDatosFormulario();

    if (this.editando) {

      const indice =
        this.reuniones.findIndex(
          r => r.id === this.reunionId
        );

      if (indice >= 0) {

        reunion.id =
          this.reunionId;

        this.reuniones[indice] =
          reunion;

      }

    } else {

    reunion.id =
  this.generarId();

      reunion.fechaCreacion =
        new Date().toISOString();

      this.reuniones.push(
        reunion
      );

    }

    localStorage.setItem(

      FALCO_COMUNIDAD_REUNION.STORAGE_REUNIONES,

      JSON.stringify(
        this.reuniones
      )

    );

    localStorage.removeItem(

      FALCO_COMUNIDAD_REUNION.STORAGE_BORRADOR

    );

    this.mostrarMensaje(
      this.editando
        ? "La reunión fue actualizada correctamente."
        : "La reunión fue registrada correctamente.",
      "exito"
    );

    setTimeout(
      () => {

        window.location.href =
          "reuniones.html";

      },
      800
    );

  },


  /* =====================================================
     BORRADOR
  ===================================================== */

  guardarBorrador() {

    const datos =
      this.obtenerDatosFormulario();

    localStorage.setItem(

      FALCO_COMUNIDAD_REUNION.STORAGE_BORRADOR,

      JSON.stringify(
        datos
      )

    );

    this.mostrarMensaje(
      "Borrador guardado correctamente.",
      "aviso"
    );

  },


  restaurarBorrador() {

    if (this.editando) {

      return;

    }

    const contenido =
      localStorage.getItem(

        FALCO_COMUNIDAD_REUNION.STORAGE_BORRADOR

      );

    if (!contenido) {

      return;

    }

    try {

      const datos =
        JSON.parse(
          contenido
        );

      this.cargarFormulario(
        datos
      );

    } catch {}

  },


  /* =====================================================
     DATOS
  ===================================================== */

  obtenerDatosFormulario() {

    const datos = {};

    Array.from(
      this.formulario.elements
    ).forEach(
      campo => {

        if (!campo.name) {

          return;

        }

        if (
          campo.type ===
          "checkbox"
        ) {

          datos[campo.name] =
            campo.checked;

        } else {

          datos[campo.name] =
            campo.value.trim();

        }

      }
    );

    const institucion =
      this.instituciones.find(
        i =>
          i.id ===
          datos.institucionId
      );

    datos.institucionNombre =
      institucion
        ? institucion.nombre
        : "";

    return datos;

  },


  /* =====================================================
     VALIDACIÓN
  ===================================================== */

  validarFormulario() {

    this.limpiarErrores();

    let valido = true;

    valido &=
      this.validarObligatorio(
        "asuntoReunion",
        "errorAsuntoReunion"
      );

    valido &=
      this.validarObligatorio(
        "institucionReunion",
        "errorInstitucionReunion"
      );

    valido &=
      this.validarObligatorio(
        "fechaReunion",
        "errorFechaReunion"
      );

    valido &=
      this.validarObligatorio(
        "horaReunion",
        "errorHoraReunion"
      );

    valido &=
      this.validarObligatorio(
        "modalidadReunion",
        "errorModalidadReunion"
      );

    return Boolean(
      valido
    );

  },


  validarObligatorio(
    idCampo,
    idError
  ) {

    const campo =
      document.getElementById(
        idCampo
      );

    if (!campo) {

      return true;

    }

    if (
      String(
        campo.value
      ).trim()
    ) {

      return true;

    }

    campo.focus();

    const error =
      document.getElementById(
        idError
      );

    if (error) {

      error.textContent =
        "Este campo es obligatorio.";

    }

    return false;

  },


  limpiarErrores() {

    document
      .querySelectorAll(
        ".nueva-reunion-error"
      )
      .forEach(
        error => {

          error.textContent =
            "";

        }
      );

  },

    /* =====================================================
     MENSAJES
  ===================================================== */

  mostrarMensaje(
    texto,
    tipo = ""
  ) {

    const mensaje =
      document.getElementById(
        "mensajeNuevaReunion"
      );

    if (!mensaje) {

      return;

    }

    mensaje.textContent =
      texto;

    mensaje.classList.remove(
      "es-exito",
      "es-error",
      "es-aviso"
    );

    if (tipo === "exito") {

      mensaje.classList.add(
        "es-exito"
      );

    }

    if (tipo === "error") {

      mensaje.classList.add(
        "es-error"
      );

    }

    if (tipo === "aviso") {

      mensaje.classList.add(
        "es-aviso"
      );

    }

    mensaje.hidden =
      false;

    mensaje.scrollIntoView({
      behavior:
        "smooth",
      block:
        "center"
    });

  },


  /* =====================================================
     ESTADO DEL FORMULARIO
  ===================================================== */

  actualizarEstadoFormulario(
    texto,
    tipo = ""
  ) {

    const estado =
      document.getElementById(
        "estadoFormularioReunion"
      );

    const contenedor =
      document.querySelector(
        ".nueva-reunion-presentacion-estado"
      );

    if (estado) {

      estado.textContent =
        texto;

    }

    if (!contenedor) {

      return;

    }

    contenedor.classList.remove(
      "es-exito",
      "es-error",
      "es-aviso"
    );

    if (tipo) {

      contenedor.classList.add(
        `es-${tipo}`
      );

    }

  },


  /* =====================================================
     UTILIDADES
  ===================================================== */

  generarId() {

    if (
      window.crypto &&
      typeof window.crypto.randomUUID ===
        "function"
    ) {

      return window.crypto.randomUUID();

    }

    return [
      "REU",
      Date.now().toString(36),
      Math.random()
        .toString(36)
        .slice(2, 8)
    ]
      .join("-")
      .toUpperCase();

  },


  guardarReuniones() {

    try {

      localStorage.setItem(

        FALCO_COMUNIDAD_REUNION.STORAGE_REUNIONES,

        JSON.stringify(
          this.reuniones
        )

      );

      return true;

    } catch (error) {

      console.error(
        "No fue posible guardar las reuniones:",
        error
      );

      this.mostrarMensaje(
        "No fue posible guardar la reunión. Verificá el almacenamiento del navegador.",
        "error"
      );

      this.actualizarEstadoFormulario(
        "Error al guardar",
        "error"
      );

      return false;

    }

  },


  obtenerFechaActual() {

    return new Date()
      .toISOString();

  }

};


/* =========================================================
   INICIO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FALCONuevaReunion.init();

  }
);