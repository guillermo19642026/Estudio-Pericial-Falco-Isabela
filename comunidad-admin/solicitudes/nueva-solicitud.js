/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Nueva solicitud
   Versión 1.0
========================================================= */

"use strict";


const FalcoComunidadNuevaSolicitud = {

  claveBorrador: "falco_comunidad_nueva_solicitud_borrador",

  formulario: null,

  campos: {},

  elementos: {},


  init() {

    this.cache();

    if (!this.formulario) {
      return;
    }

    this.configurarEventos();
    this.restaurarBorrador();
    this.actualizarContador();
    this.actualizarEstadoFormulario();

    console.info(
      "FALCO Comunidad Nueva Solicitud™ v1.0 Ready"
    );

  },


  cache() {

    this.formulario =
      document.getElementById(
        "formularioNuevaSolicitud"
      );


    this.campos = {

      nombreInstitucion:
        document.getElementById(
          "nombreInstitucion"
        ),

      tipoInstitucion:
        document.getElementById(
          "tipoInstitucion"
        ),

      localidad:
        document.getElementById(
          "localidad"
        ),

      provincia:
        document.getElementById(
          "provincia"
        ),

      nombreContacto:
        document.getElementById(
          "nombreContacto"
        ),

      cargoContacto:
        document.getElementById(
          "cargoContacto"
        ),

      correoContacto:
        document.getElementById(
          "correoContacto"
        ),

      telefonoContacto:
        document.getElementById(
          "telefonoContacto"
        ),

      tipoSolicitud:
        document.getElementById(
          "tipoSolicitud"
        ),

      asuntoSolicitud:
        document.getElementById(
          "asuntoSolicitud"
        ),

      descripcionSolicitud:
        document.getElementById(
          "descripcionSolicitud"
        ),

      prioridadSolicitud:
        document.getElementById(
          "prioridadSolicitud"
        ),

      estadoSolicitud:
        document.getElementById(
          "estadoSolicitud"
        ),

      observacionesInternas:
        document.getElementById(
          "observacionesInternas"
        )

    };


    this.elementos = {

      mensaje:
        document.getElementById(
          "mensajeFormulario"
        ),

      contadorDescripcion:
        document.getElementById(
          "contadorDescripcion"
        ),

      estadoBorrador:
        document.getElementById(
          "estadoBorrador"
        ),

      botonGuardarBorrador:
        document.getElementById(
          "botonGuardarBorrador"
        ),

      botonRegistrar:
        document.getElementById(
          "botonRegistrar"
        )

    };

  },


  configurarEventos() {

    this.formulario.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        this.registrarSolicitud();

      }
    );


    this.elementos.botonGuardarBorrador
      ?.addEventListener(
        "click",
        () => {

          this.guardarBorrador();

        }
      );


    this.campos.descripcionSolicitud
      ?.addEventListener(
        "input",
        () => {

          this.actualizarContador();
          this.marcarCambiosPendientes();

        }
      );


    Object.values(this.campos)
      .forEach(campo => {

        if (!campo) {
          return;
        }

        if (
          campo ===
          this.campos.descripcionSolicitud
        ) {
          return;
        }

        campo.addEventListener(
          "input",
          () => {

            this.limpiarErrorCampo(
              campo
            );

            this.marcarCambiosPendientes();

          }
        );

        campo.addEventListener(
          "change",
          () => {

            this.limpiarErrorCampo(
              campo
            );

            this.marcarCambiosPendientes();

          }
        );

      });

  },


  obtenerDatosFormulario() {

    return {

      nombreInstitucion:
        this.campos.nombreInstitucion
          ?.value.trim() || "",

      tipoInstitucion:
        this.campos.tipoInstitucion
          ?.value || "",

      localidad:
        this.campos.localidad
          ?.value.trim() || "",

      provincia:
        this.campos.provincia
          ?.value.trim() || "",

      nombreContacto:
        this.campos.nombreContacto
          ?.value.trim() || "",

      cargoContacto:
        this.campos.cargoContacto
          ?.value.trim() || "",

      correoContacto:
        this.campos.correoContacto
          ?.value.trim() || "",

      telefonoContacto:
        this.campos.telefonoContacto
          ?.value.trim() || "",

      tipoSolicitud:
        this.campos.tipoSolicitud
          ?.value || "",

      asuntoSolicitud:
        this.campos.asuntoSolicitud
          ?.value.trim() || "",

      descripcionSolicitud:
        this.campos.descripcionSolicitud
          ?.value.trim() || "",

      prioridadSolicitud:
        this.campos.prioridadSolicitud
          ?.value || "normal",

      estadoSolicitud:
        this.campos.estadoSolicitud
          ?.value || "nueva",

      observacionesInternas:
        this.campos.observacionesInternas
          ?.value.trim() || "",

      ultimaActualizacion:
        new Date().toISOString()

    };

  },


  completarFormulario(datos = {}) {

    Object.entries(this.campos)
      .forEach(([clave, campo]) => {

        if (!campo) {
          return;
        }

        if (
          Object.prototype.hasOwnProperty.call(
            datos,
            clave
          )
        ) {
          campo.value =
            datos[clave] ?? "";
        }

      });

  },


  validarFormulario() {

    this.limpiarErrores();

    let formularioValido = true;


    formularioValido =
      this.validarCampoObligatorio(
        "nombreInstitucion",
        "Ingresá el nombre de la institución."
      ) && formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "tipoInstitucion",
        "Seleccioná el tipo de institución."
      ) && formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "nombreContacto",
        "Ingresá el nombre de la persona de contacto."
      ) && formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "correoContacto",
        "Ingresá el correo electrónico."
      ) && formularioValido;


    formularioValido =
      this.validarCorreo() &&
      formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "tipoSolicitud",
        "Seleccioná el tipo de solicitud."
      ) && formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "asuntoSolicitud",
        "Ingresá el asunto de la solicitud."
      ) && formularioValido;


    formularioValido =
      this.validarCampoObligatorio(
        "descripcionSolicitud",
        "Describí el motivo de la solicitud."
      ) && formularioValido;


    if (!formularioValido) {

      this.mostrarMensaje(
        "Revisá los campos señalados antes de continuar.",
        "error"
      );

      const primerCampoInvalido =
        this.formulario.querySelector(
          ".campo-invalido"
        );

      primerCampoInvalido?.focus();

    }

    return formularioValido;

  },


  validarCampoObligatorio(
    nombreCampo,
    mensaje
  ) {

    const campo =
      this.campos[nombreCampo];

    if (!campo) {
      return true;
    }

    const valor =
      String(campo.value || "")
        .trim();

    if (valor) {
      return true;
    }

    this.mostrarErrorCampo(
      nombreCampo,
      mensaje
    );

    return false;

  },


  validarCorreo() {

    const campo =
      this.campos.correoContacto;

    if (!campo) {
      return true;
    }

    const correo =
      campo.value.trim();

    if (!correo) {
      return true;
    }

    const expresionCorreo =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      expresionCorreo.test(correo)
    ) {
      return true;
    }

    this.mostrarErrorCampo(
      "correoContacto",
      "Ingresá un correo electrónico válido."
    );

    return false;

  },


  mostrarErrorCampo(
    nombreCampo,
    mensaje
  ) {

    const campo =
      this.campos[nombreCampo];

    const error =
      document.getElementById(
        `error${this.convertirIdError(nombreCampo)}`
      );

    campo?.classList.add(
      "campo-invalido"
    );

    campo?.setAttribute(
      "aria-invalid",
      "true"
    );

    if (error) {
      error.textContent = mensaje;
    }

  },


  limpiarErrorCampo(campo) {

    if (!campo) {
      return;
    }

    campo.classList.remove(
      "campo-invalido"
    );

    campo.removeAttribute(
      "aria-invalid"
    );

    const nombreCampo =
      campo.id;

    const error =
      document.getElementById(
        `error${this.convertirIdError(nombreCampo)}`
      );

    if (error) {
      error.textContent = "";
    }

  },


  limpiarErrores() {

    Object.values(this.campos)
      .forEach(campo => {

        this.limpiarErrorCampo(
          campo
        );

      });

  },


  convertirIdError(texto) {

    if (!texto) {
      return "";
    }

    return (
      texto.charAt(0).toUpperCase() +
      texto.slice(1)
    );

  },


  guardarBorrador() {

    const datos =
      this.obtenerDatosFormulario();

    try {

      localStorage.setItem(
        this.claveBorrador,
        JSON.stringify(datos)
      );

      this.mostrarMensaje(
        "El borrador se guardó correctamente en este navegador.",
        "exito"
      );

      this.actualizarEstadoFormulario(
        "Borrador guardado"
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


  restaurarBorrador() {

    const borrador =
      localStorage.getItem(
        this.claveBorrador
      );

    if (!borrador) {
      return;
    }

    try {

      const datos =
        JSON.parse(borrador);

      this.completarFormulario(
        datos
      );

      this.actualizarContador();

      this.actualizarEstadoFormulario(
        "Borrador restaurado"
      );

      this.mostrarMensaje(
        "Se restauró el último borrador guardado.",
        "info"
      );

    } catch (error) {

      console.error(
        "No fue posible restaurar el borrador:",
        error
      );

      localStorage.removeItem(
        this.claveBorrador
      );

    }

  },


  registrarSolicitud() {

    if (!this.validarFormulario()) {
      return;
    }

    const datos =
      this.obtenerDatosFormulario();

    console.info(
      "Solicitud preparada para registrar:",
      datos
    );

    this.mostrarMensaje(
      "La solicitud fue validada correctamente. La conexión con Firebase se realizará en el próximo paso.",
      "exito"
    );

    this.actualizarEstadoFormulario(
      "Solicitud validada"
    );

  },


  actualizarContador() {

    if (
      !this.campos.descripcionSolicitud ||
      !this.elementos.contadorDescripcion
    ) {
      return;
    }

    const cantidad =
      this.campos.descripcionSolicitud
        .value.length;

    this.elementos.contadorDescripcion
      .textContent =
      `${cantidad} / 2000`;

  },


  marcarCambiosPendientes() {

    this.actualizarEstadoFormulario(
      "Cambios sin guardar"
    );

  },


  actualizarEstadoFormulario(
    texto = "Sin cambios pendientes"
  ) {

    if (!this.elementos.estadoBorrador) {
      return;
    }

    this.elementos.estadoBorrador
      .textContent = texto;

  },


  mostrarMensaje(
    texto,
    tipo = "info"
  ) {

    const mensaje =
      this.elementos.mensaje;

    if (!mensaje) {
      return;
    }

    mensaje.className =
      `admin-mensaje admin-mensaje-${tipo}`;

    mensaje.textContent =
      texto;

    mensaje.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadNuevaSolicitud.init();

  }
);