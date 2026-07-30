/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Ficha de institución
   Versión 1.0
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG = {

  claveInstitucionesLocales:
    "falco_comunidad_instituciones",

  paginaListado:
    "instituciones.html",

  paginaEdicion:
    "nueva-institucion.html",

  demoraMensaje:
    4200

};


/* =========================================================
   MÓDULO PRINCIPAL
========================================================= */

const FalcoComunidadFichaInstitucion = {

  elementos: {},

  instituciones: [],

  institucion: null,

  institucionId: "",

  procesando: false,

  temporizadorMensaje: null,


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

    this.obtenerElementos();

    this.vincularEventos();

    this.institucionId =
      this.obtenerInstitucionIdDesdeURL();

    this.cargarInstitucion();

    console.info(
      "FALCO Comunidad Ficha Institución™ v1.0 Ready"
    );

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  obtenerElementos() {

    this.elementos = {

      estadoCarga:
        document.getElementById(
          "estadoCargaInstitucion"
        ),

      estadoError:
        document.getElementById(
          "estadoErrorInstitucion"
        ),

      textoError:
        document.getElementById(
          "textoErrorInstitucion"
        ),

      contenido:
        document.getElementById(
          "contenidoInstitucion"
        ),

      avatar:
        document.getElementById(
          "avatarInstitucion"
        ),

      tipo:
        document.getElementById(
          "tipoInstitucion"
        ),

      nombre:
        document.getElementById(
          "nombreInstitucion"
        ),

      ubicacion:
        document.getElementById(
          "ubicacionInstitucion"
        ),

      estado:
        document.getElementById(
          "estadoInstitucion"
        ),

      botonEditar:
        document.getElementById(
          "botonEditarInstitucion"
        ),

      resumenReferente:
        document.getElementById(
          "resumenReferenteInstitucion"
        ),

      resumenCargo:
        document.getElementById(
          "resumenCargoInstitucion"
        ),

      resumenCorreo:
        document.getElementById(
          "resumenCorreoInstitucion"
        ),

      resumenTelefono:
        document.getElementById(
          "resumenTelefonoInstitucion"
        ),

      resumenFechaAlta:
        document.getElementById(
          "resumenFechaAltaInstitucion"
        ),

      resumenId:
        document.getElementById(
          "resumenIdInstitucion"
        ),

      datoNombre:
        document.getElementById(
          "datoNombreInstitucion"
        ),

      datoTipo:
        document.getElementById(
          "datoTipoInstitucion"
        ),

      datoEstado:
        document.getElementById(
          "datoEstadoInstitucion"
        ),

      datoDescripcion:
        document.getElementById(
          "datoDescripcionInstitucion"
        ),

      datoReferente:
        document.getElementById(
          "datoReferenteInstitucion"
        ),

      datoCargo:
        document.getElementById(
          "datoCargoInstitucion"
        ),

      datoCorreo:
        document.getElementById(
          "datoCorreoInstitucion"
        ),

      datoTelefono:
        document.getElementById(
          "datoTelefonoInstitucion"
        ),

      datoDireccion:
        document.getElementById(
          "datoDireccionInstitucion"
        ),

      datoLocalidad:
        document.getElementById(
          "datoLocalidadInstitucion"
        ),

      datoProvincia:
        document.getElementById(
          "datoProvinciaInstitucion"
        ),

      datoObservaciones:
        document.getElementById(
          "datoObservacionesInstitucion"
        ),

      botonCambiarEstado:
        document.getElementById(
          "botonCambiarEstadoInstitucion"
        ),

      botonEliminar:
        document.getElementById(
          "botonEliminarInstitucion"
        ),

      mensaje:
        document.getElementById(
          "mensajeInstitucion"
        )

    };

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    const {
      botonEditar,
      botonCambiarEstado,
      botonEliminar
    } = this.elementos;


    if (botonEditar) {

      botonEditar.addEventListener(
        "click",
        () => {

          this.editarInstitucion();

        }
      );

    }


    if (botonCambiarEstado) {

      botonCambiarEstado.addEventListener(
        "click",
        () => {

          this.abrirModalCambioEstado();

        }
      );

    }


    if (botonEliminar) {

      botonEliminar.addEventListener(
        "click",
        () => {

          this.abrirModalEliminar();

        }
      );

    }


    document.addEventListener(
      "keydown",
      (evento) => {

        if (evento.key === "Escape") {

          this.cerrarModal();

        }

      }
    );

  },


  /* =======================================================
     IDENTIFICADOR
  ======================================================= */

  obtenerInstitucionIdDesdeURL() {

    const parametros =
      new URLSearchParams(
        window.location.search
      );


    return String(
      parametros.get("id") || ""
    ).trim();

  },


  /* =======================================================
     CARGA
  ======================================================= */

  cargarInstitucion() {

    this.mostrarEstadoCarga();


    window.setTimeout(
      () => {

        if (!this.institucionId) {

          this.mostrarError(
            "No se recibió el identificador de la institución."
          );

          return;

        }


        this.instituciones =
          this.obtenerInstitucionesLocales();


        this.institucion =
          this.instituciones.find(
            (institucion) =>
              String(institucion.id) ===
              this.institucionId
          ) || null;


        if (!this.institucion) {

          this.mostrarError(
            "La institución solicitada no existe o fue eliminada."
          );

          return;

        }


        this.renderizarInstitucion();

        this.mostrarContenido();

      },
      250
    );

  },


  obtenerInstitucionesLocales() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
            .claveInstitucionesLocales
        );


      if (!contenido) {

        return [];

      }


      const instituciones =
        JSON.parse(contenido);


      return Array.isArray(instituciones)
        ? instituciones
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
     RENDERIZADO
  ======================================================= */

  renderizarInstitucion() {

    const institucion =
      this.institucion;


    if (!institucion) {

      return;

    }


    const nombre =
      institucion.nombre ||
      "Institución sin nombre";

    const tipo =
      this.formatearTipo(
        institucion.tipo
      );

    const estado =
      institucion.estado ||
      "pendiente";

    const estadoTexto =
      this.formatearEstado(
        estado
      );

    const localidad =
      institucion.localidad ||
      "";

    const provincia =
      institucion.provincia ||
      "";

    const ubicacion =
      this.crearUbicacion(
        localidad,
        provincia
      );


    this.escribirTexto(
      this.elementos.avatar,
      nombre.charAt(0).toUpperCase() || "I"
    );

    this.escribirTexto(
      this.elementos.tipo,
      tipo
    );

    this.escribirTexto(
      this.elementos.nombre,
      nombre
    );

    this.escribirTexto(
      this.elementos.ubicacion,
      ubicacion ||
      "Sin ubicación registrada"
    );


    this.actualizarEstadoVisual(
      estado,
      estadoTexto
    );


    this.escribirTexto(
      this.elementos.resumenReferente,
      institucion.referente ||
      "Sin referente"
    );

    this.escribirTexto(
      this.elementos.resumenCargo,
      institucion.cargo ||
      "Sin cargo informado"
    );

    this.escribirTexto(
      this.elementos.resumenCorreo,
      institucion.correo ||
      "Sin correo registrado"
    );

    this.escribirTexto(
      this.elementos.resumenTelefono,
      institucion.telefono ||
      "Sin teléfono informado"
    );

    this.escribirTexto(
      this.elementos.resumenFechaAlta,
      this.formatearFecha(
        institucion.fechaAlta
      )
    );

    this.escribirTexto(
      this.elementos.resumenId,
      institucion.id ||
      "Sin identificador"
    );


    this.escribirTexto(
      this.elementos.datoNombre,
      nombre
    );

    this.escribirTexto(
      this.elementos.datoTipo,
      tipo
    );

    this.escribirTexto(
      this.elementos.datoEstado,
      estadoTexto
    );

    this.escribirTexto(
      this.elementos.datoDescripcion,
      institucion.descripcion ||
      "Sin descripción registrada."
    );

    this.escribirTexto(
      this.elementos.datoReferente,
      institucion.referente ||
      "Sin referente registrado"
    );

    this.escribirTexto(
      this.elementos.datoCargo,
      institucion.cargo ||
      "Sin cargo informado"
    );


    this.configurarEnlaceCorreo(
      institucion.correo
    );

    this.configurarEnlaceTelefono(
      institucion.telefono
    );


    this.escribirTexto(
      this.elementos.datoDireccion,
      institucion.direccion ||
      "Sin dirección registrada"
    );

    this.escribirTexto(
      this.elementos.datoLocalidad,
      localidad ||
      "Sin localidad registrada"
    );

    this.escribirTexto(
      this.elementos.datoProvincia,
      provincia ||
      "Sin provincia registrada"
    );

    this.escribirTexto(
      this.elementos.datoObservaciones,
      institucion.observaciones ||
      "Sin observaciones registradas."
    );


    document.title =
      `${nombre} | FALCO® Comunidad`;

  },


  actualizarEstadoVisual(
    estado,
    texto
  ) {

    const elemento =
      this.elementos.estado;


    if (!elemento) {

      return;

    }


    elemento.textContent = texto;

    elemento.classList.remove(
      "institucion-estado-activa",
      "institucion-estado-pendiente",
      "institucion-estado-inactiva"
    );

    elemento.classList.add(
      `institucion-estado-${estado}`
    );

  },


  configurarEnlaceCorreo(correo) {

    const elemento =
      this.elementos.datoCorreo;


    if (!elemento) {

      return;

    }


    if (correo) {

      elemento.textContent = correo;

      elemento.href =
        `mailto:${correo}`;

      elemento.removeAttribute(
        "aria-disabled"
      );

      return;

    }


    elemento.textContent =
      "Sin correo registrado";

    elemento.removeAttribute(
      "href"
    );

    elemento.setAttribute(
      "aria-disabled",
      "true"
    );

  },


  configurarEnlaceTelefono(telefono) {

    const elemento =
      this.elementos.datoTelefono;


    if (!elemento) {

      return;

    }


    if (telefono) {

      elemento.textContent = telefono;

      elemento.href =
        `tel:${this.normalizarTelefono(
          telefono
        )}`;

      elemento.removeAttribute(
        "aria-disabled"
      );

      return;

    }


    elemento.textContent =
      "Sin teléfono informado";

    elemento.removeAttribute(
      "href"
    );

    elemento.setAttribute(
      "aria-disabled",
      "true"
    );

  },


  /* =======================================================
     EDICIÓN
  ======================================================= */

  editarInstitucion() {

    if (!this.institucion) {

      return;

    }


    const datosEdicion = {

      ...this.institucion,

      modoEdicion:
        true

    };


    localStorage.setItem(
      "falco_comunidad_editar_institucion",
      JSON.stringify(datosEdicion)
    );


    window.location.href =
      `${
        FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
          .paginaEdicion
      }?editar=${encodeURIComponent(
        this.institucion.id
      )}`;

  },


  /* =======================================================
     CAMBIO DE ESTADO
  ======================================================= */

  abrirModalCambioEstado() {

    if (!this.institucion) {

      return;

    }


    this.cerrarModal();


    const fondo =
      document.createElement("div");

    fondo.className =
      "institucion-modal-fondo";

    fondo.id =
      "modalInstitucionActivo";


    fondo.innerHTML = `
      <div
        class="institucion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalInstitucion"
      >

        <div class="institucion-modal-cabecera">

          <h3 id="tituloModalInstitucion">
            Cambiar estado
          </h3>

        </div>

        <div class="institucion-modal-cuerpo">

          <p>
            Seleccioná el nuevo estado administrativo
            de la institución.
          </p>

          <label for="nuevoEstadoInstitucion">
            Estado
          </label>

          <select id="nuevoEstadoInstitucion">

            <option value="activa">
              Activa
            </option>

            <option value="pendiente">
              Pendiente
            </option>

            <option value="inactiva">
              Inactiva
            </option>

          </select>

        </div>

        <div class="institucion-modal-acciones">

          <button
            id="botonCancelarModalInstitucion"
            class="admin-boton admin-boton-secundario"
            type="button"
          >
            Cancelar
          </button>

          <button
            id="botonConfirmarEstadoInstitucion"
            class="admin-boton admin-boton-primario"
            type="button"
          >
            Guardar estado
          </button>

        </div>

      </div>
    `;


    document.body.appendChild(
      fondo
    );


    const selector =
      document.getElementById(
        "nuevoEstadoInstitucion"
      );

    const botonCancelar =
      document.getElementById(
        "botonCancelarModalInstitucion"
      );

    const botonConfirmar =
      document.getElementById(
        "botonConfirmarEstadoInstitucion"
      );


    if (selector) {

      selector.value =
        this.institucion.estado ||
        "pendiente";

      selector.focus();

    }


    botonCancelar?.addEventListener(
      "click",
      () => {

        this.cerrarModal();

      }
    );


    botonConfirmar?.addEventListener(
      "click",
      () => {

        this.guardarNuevoEstado(
          selector?.value
        );

      }
    );


    fondo.addEventListener(
      "click",
      (evento) => {

        if (evento.target === fondo) {

          this.cerrarModal();

        }

      }
    );

  },


  guardarNuevoEstado(
    nuevoEstado
  ) {

    const estadosPermitidos = [

      "activa",

      "pendiente",

      "inactiva"

    ];


    if (
      !this.institucion ||
      !estadosPermitidos.includes(
        nuevoEstado
      )
    ) {

      return;

    }


    if (
      this.institucion.estado ===
      nuevoEstado
    ) {

      this.cerrarModal();

      this.mostrarMensaje(
        "La institución ya tiene seleccionado ese estado.",
        "advertencia"
      );

      return;

    }


    this.institucion.estado =
      nuevoEstado;

    this.institucion.ultimaActualizacion =
      new Date().toISOString();


    const guardado =
      this.actualizarInstitucionEnAlmacenamiento();


    if (!guardado) {

      this.mostrarMensaje(
        "No fue posible actualizar el estado.",
        "error"
      );

      return;

    }


    this.cerrarModal();

    this.renderizarInstitucion();

    this.mostrarMensaje(
      "El estado institucional fue actualizado correctamente.",
      "exito"
    );

  },


  /* =======================================================
     ELIMINACIÓN
  ======================================================= */

  abrirModalEliminar() {

    if (!this.institucion) {

      return;

    }


    this.cerrarModal();


    const nombre =
      this.escaparHTML(
        this.institucion.nombre ||
        "esta institución"
      );


    const fondo =
      document.createElement("div");

    fondo.className =
      "institucion-modal-fondo";

    fondo.id =
      "modalInstitucionActivo";


    fondo.innerHTML = `
      <div
        class="institucion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalEliminarInstitucion"
      >

        <div class="institucion-modal-cabecera">

          <h3 id="tituloModalEliminarInstitucion">
            Eliminar institución
          </h3>

        </div>

        <div class="institucion-modal-cuerpo">

          <p>
            Se eliminará el registro de
            <strong>${nombre}</strong>.
            Esta acción no puede deshacerse.
          </p>

        </div>

        <div class="institucion-modal-acciones">

          <button
            id="botonCancelarEliminacionInstitucion"
            class="admin-boton admin-boton-secundario"
            type="button"
          >
            Cancelar
          </button>

          <button
            id="botonConfirmarEliminacionInstitucion"
            class="admin-boton institucion-boton-peligro"
            type="button"
          >
            Eliminar definitivamente
          </button>

        </div>

      </div>
    `;


    document.body.appendChild(
      fondo
    );


    document
      .getElementById(
        "botonCancelarEliminacionInstitucion"
      )
      ?.addEventListener(
        "click",
        () => {

          this.cerrarModal();

        }
      );


    document
      .getElementById(
        "botonConfirmarEliminacionInstitucion"
      )
      ?.addEventListener(
        "click",
        () => {

          this.eliminarInstitucion();

        }
      );


    fondo.addEventListener(
      "click",
      (evento) => {

        if (evento.target === fondo) {

          this.cerrarModal();

        }

      }
    );


    document
      .getElementById(
        "botonCancelarEliminacionInstitucion"
      )
      ?.focus();

  },


  eliminarInstitucion() {

    if (
      !this.institucion ||
      this.procesando
    ) {

      return;

    }


    this.procesando = true;


    try {

      const institucionesActualizadas =
        this.instituciones.filter(
          (institucion) =>
            String(institucion.id) !==
            String(this.institucion.id)
        );


      localStorage.setItem(
        FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
          .claveInstitucionesLocales,
        JSON.stringify(
          institucionesActualizadas
        )
      );


      this.cerrarModal();


      window.location.href =
        `${
          FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
            .paginaListado
        }?eliminada=1`;

    } catch (error) {

      console.error(
        "No fue posible eliminar la institución:",
        error
      );


      this.cerrarModal();

      this.mostrarMensaje(
        "No fue posible eliminar la institución.",
        "error"
      );

    } finally {

      this.procesando = false;

    }

  },


  /* =======================================================
     ALMACENAMIENTO
  ======================================================= */

  actualizarInstitucionEnAlmacenamiento() {

    try {

      const indice =
        this.instituciones.findIndex(
          (institucion) =>
            String(institucion.id) ===
            String(this.institucion.id)
        );


      if (indice < 0) {

        return false;

      }


      this.instituciones[indice] = {

        ...this.institucion

      };


      localStorage.setItem(
        FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
          .claveInstitucionesLocales,
        JSON.stringify(
          this.instituciones
        )
      );


      return true;

    } catch (error) {

      console.error(
        "No fue posible actualizar la institución:",
        error
      );

      return false;

    }

  },


  /* =======================================================
     MODAL
  ======================================================= */

  cerrarModal() {

    const modal =
      document.getElementById(
        "modalInstitucionActivo"
      );


    if (modal) {

      modal.remove();

    }

  },


  /* =======================================================
     ESTADOS DE LA PÁGINA
  ======================================================= */

  mostrarEstadoCarga() {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        false;

    }

    if (this.elementos.estadoError) {

      this.elementos.estadoError.hidden =
        true;

    }

    if (this.elementos.contenido) {

      this.elementos.contenido.hidden =
        true;

    }

  },


  mostrarContenido() {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        true;

    }

    if (this.elementos.estadoError) {

      this.elementos.estadoError.hidden =
        true;

    }

    if (this.elementos.contenido) {

      this.elementos.contenido.hidden =
        false;

    }

  },


  mostrarError(texto) {

    if (this.elementos.estadoCarga) {

      this.elementos.estadoCarga.hidden =
        true;

    }

    if (this.elementos.contenido) {

      this.elementos.contenido.hidden =
        true;

    }

    if (this.elementos.estadoError) {

      this.elementos.estadoError.hidden =
        false;

    }

    this.escribirTexto(
      this.elementos.textoError,
      texto
    );

  },


  /* =======================================================
     MENSAJES
  ======================================================= */

  mostrarMensaje(
    texto,
    tipo = "advertencia"
  ) {

    const mensaje =
      this.elementos.mensaje;


    if (!mensaje) {

      return;

    }


    window.clearTimeout(
      this.temporizadorMensaje
    );


    mensaje.textContent = texto;

    mensaje.hidden = false;

    mensaje.classList.remove(
      "mensaje-exito",
      "mensaje-error",
      "mensaje-advertencia"
    );


    const clases = {

      exito:
        "mensaje-exito",

      error:
        "mensaje-error",

      advertencia:
        "mensaje-advertencia"

    };


    mensaje.classList.add(
      clases[tipo] ||
      "mensaje-advertencia"
    );


    this.temporizadorMensaje =
      window.setTimeout(
        () => {

          this.ocultarMensaje();

        },
        FALCO_COMUNIDAD_FICHA_INSTITUCION_CONFIG
          .demoraMensaje
      );

  },


  ocultarMensaje() {

    const mensaje =
      this.elementos.mensaje;


    if (!mensaje) {

      return;

    }


    mensaje.hidden = true;

    mensaje.textContent = "";

    mensaje.classList.remove(
      "mensaje-exito",
      "mensaje-error",
      "mensaje-advertencia"
    );

  },


  /* =======================================================
     FORMATO
  ======================================================= */

  crearUbicacion(
    localidad,
    provincia
  ) {

    return [

      localidad,

      provincia

    ]
      .filter(Boolean)
      .join(", ");

  },


  normalizarTelefono(telefono) {

    return String(telefono || "")
      .replace(
        /[^\d+]/g,
        ""
      );

  },


  formatearFecha(fecha) {

    if (!fecha) {

      return "Sin información";

    }


    const fechaObjeto =
      new Date(fecha);


    if (
      Number.isNaN(
        fechaObjeto.getTime()
      )
    ) {

      return "Sin información";

    }


    return new Intl.DateTimeFormat(
      "es-AR",
      {

        day:
          "2-digit",

        month:
          "long",

        year:
          "numeric"

      }
    ).format(
      fechaObjeto
    );

  },


  formatearTipo(tipo) {

    const tipos = {

      municipalidad:
        "Municipalidad",

      escuela:
        "Escuela",

      hospital:
        "Hospital",

      ong:
        "ONG",

      fundacion:
        "Fundación",

      empresa:
        "Empresa",

      club:
        "Club",

      universidad:
        "Universidad",

      "organismo-publico":
        "Organismo público",

      otro:
        "Otra institución"

    };


    return tipos[tipo] ||
      "Institución";

  },


  formatearEstado(estado) {

    const estados = {

      activa:
        "Activa",

      pendiente:
        "Pendiente",

      inactiva:
        "Inactiva"

    };


    return estados[estado] ||
      "Pendiente";

  },


  escribirTexto(
    elemento,
    valor
  ) {

    if (!elemento) {

      return;

    }


    elemento.textContent =
      String(valor ?? "");

  },


  escaparHTML(valor) {

    return String(valor || "")
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

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadFichaInstitucion.init();

  }
);


/* =========================================================
   ACCESO GLOBAL PARA PRUEBAS
========================================================= */

window.FalcoComunidadFichaInstitucion =
  FalcoComunidadFichaInstitucion;