/* =========================================================
   FALCO® COMUNIDAD ADMIN
   Nueva institución
   Versión 1.0
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const FALCO_COMUNIDAD_INSTITUCION_CONFIG = {

  claveBorrador:
    "falco_comunidad_borrador_institucion",

  claveInstitucionesLocales:
    "falco_comunidad_instituciones",

  demoraMensaje:
    4500

};


/* =========================================================
   MÓDULO PRINCIPAL
========================================================= */

const FalcoComunidadNuevaInstitucion = {

 elementos: {},

guardando: false,

borradorRestaurado: false,

modoEdicion: false,

institucionEditando: null,


  /* =======================================================
     INICIALIZACIÓN
  ======================================================= */

  init() {

  this.obtenerElementos();

if (!this.elementos.formulario) {

  console.warn(
    "FALCO Comunidad Nueva Institución: formulario no encontrado."
  );

  return;

}

this.detectarModoEdicion();

this.vincularEventos();

if (!this.modoEdicion) {

  this.restaurarBorrador();

}

console.info(
  "FALCO Comunidad Nueva Institución™ v1.1 Ready"
);

  },


  /* =======================================================
     ELEMENTOS
  ======================================================= */

  obtenerElementos() {

    this.elementos = {

      formulario:
        document.getElementById(
          "formularioNuevaInstitucion"
        ),

      nombre:
        document.getElementById(
          "nombreInstitucion"
        ),

      tipo:
        document.getElementById(
          "tipoInstitucion"
        ),

      estado:
        document.getElementById(
          "estadoInstitucion"
        ),

      descripcion:
        document.getElementById(
          "descripcionInstitucion"
        ),

      referente:
        document.getElementById(
          "nombreReferente"
        ),

      cargo:
        document.getElementById(
          "cargoReferente"
        ),

      correo:
        document.getElementById(
          "correoInstitucion"
        ),

      telefono:
        document.getElementById(
          "telefonoInstitucion"
        ),

      direccion:
        document.getElementById(
          "direccionInstitucion"
        ),

      localidad:
        document.getElementById(
          "localidadInstitucion"
        ),

      provincia:
        document.getElementById(
          "provinciaInstitucion"
        ),

      observaciones:
        document.getElementById(
          "observacionesInstitucion"
        ),

      botonReiniciar:
        document.getElementById(
          "botonReiniciarInstitucion"
        ),

      botonGuardarBorrador:
        document.getElementById(
          "botonGuardarBorradorInstitucion"
        ),

      botonRegistrar:
        document.getElementById(
          "botonRegistrarInstitucion"
        ),

      mensaje:
        document.getElementById(
          "mensajeFormularioInstitucion"
        ),

tituloFormulario:
  document.getElementById(
    "tituloFormulario"
  ),

tituloPresentacion:
  document.getElementById(
    "tituloPresentacion"
  ),

tituloPresentacionResaltado:
  document.getElementById(
    "tituloPresentacionResaltado"
  ),

descripcionPresentacion:
  document.getElementById(
    "descripcionPresentacion"
  ),

tituloPanelFormulario:
  document.getElementById(
    "tituloPanelFormulario"
  ),


      errorNombre:
        document.getElementById(
          "errorNombreInstitucion"
        ),

      errorTipo:
        document.getElementById(
          "errorTipoInstitucion"
        ),

      errorEstado:
        document.getElementById(
          "errorEstadoInstitucion"
        ),

      errorReferente:
        document.getElementById(
          "errorNombreReferente"
        ),

      errorCorreo:
        document.getElementById(
          "errorCorreoInstitucion"
        ),

      errorLocalidad:
        document.getElementById(
          "errorLocalidadInstitucion"
        ),

      errorProvincia:
        document.getElementById(
          "errorProvinciaInstitucion"
        )

    };

  },


  /* =======================================================
     EVENTOS
  ======================================================= */

  vincularEventos() {

    const {
      formulario,
      botonReiniciar,
      botonGuardarBorrador
    } = this.elementos;


    formulario.addEventListener(
      "submit",
      (evento) => {

        evento.preventDefault();

        this.registrarInstitucion();

      }
    );


    if (botonGuardarBorrador) {

      botonGuardarBorrador.addEventListener(
        "click",
        () => {

          this.guardarBorrador(true);

        }
      );

    }


    if (botonReiniciar) {

      botonReiniciar.addEventListener(
        "click",
        () => {

          this.reiniciarFormulario();

        }
      );

    }


    formulario.addEventListener(
      "input",
      (evento) => {

        this.limpiarErrorDelCampo(
          evento.target
        );

      }
    );


    formulario.addEventListener(
      "change",
      (evento) => {

        this.limpiarErrorDelCampo(
          evento.target
        );

        this.guardarBorrador(false);

      }
    );


    window.addEventListener(
      "beforeunload",
      () => {

        if (!this.guardando) {

          this.guardarBorrador(false);

        }

      }
    );

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
    parametros.get("editar");

  if (!id) {

    return;

  }

  try {

    const contenido =
      localStorage.getItem(
        FALCO_COMUNIDAD_INSTITUCION_CONFIG
          .claveInstitucionesLocales
      );

    const instituciones =
      contenido
        ? JSON.parse(contenido)
        : [];

    const institucion =
      instituciones.find(
        item => item.id === id
      );

    if (!institucion) {

      return;

    }

    this.modoEdicion = true;

    this.institucionEditando =
      institucion;

    this.cargarInstitucionEnFormulario(
      institucion
    );

    this.actualizarTitulosModoEdicion();

    if (this.elementos.botonRegistrar) {

      this.elementos.botonRegistrar.textContent =
        "Guardar cambios";

    }

    document.title =
      "Editar institución | FALCO® Comunidad";

  }

  catch (error) {

    console.error(error);

  }

},


cargarInstitucionEnFormulario(
  institucion
) {

  if (!institucion) {

    return;

  }


  this.asignarValor(
    this.elementos.nombre,
    institucion.nombre
  );

  this.asignarValor(
    this.elementos.tipo,
    institucion.tipo
  );

  this.asignarValor(
    this.elementos.estado,
    institucion.estado || "activa"
  );

  this.asignarValor(
    this.elementos.descripcion,
    institucion.descripcion
  );

  this.asignarValor(
    this.elementos.referente,
    institucion.referente
  );

  this.asignarValor(
    this.elementos.cargo,
    institucion.cargo
  );

  this.asignarValor(
    this.elementos.correo,
    institucion.correo
  );

  this.asignarValor(
    this.elementos.telefono,
    institucion.telefono
  );

  this.asignarValor(
    this.elementos.direccion,
    institucion.direccion
  );

  this.asignarValor(
    this.elementos.localidad,
    institucion.localidad
  );

  this.asignarValor(
    this.elementos.provincia,
    institucion.provincia || "Buenos Aires"
  );

  this.asignarValor(
    this.elementos.observaciones,
    institucion.observaciones
  );

},





actualizarTitulosModoEdicion() {

  if (this.elementos.tituloFormulario) {

    this.elementos.tituloFormulario.textContent =
      "Editar institución";

  }

  if (this.elementos.tituloPresentacion) {

   this.elementos.tituloPresentacion.innerHTML =
  'Editar <span>institución</span>';

  }

  if (this.elementos.descripcionPresentacion) {

    this.elementos.descripcionPresentacion.textContent =
      "Actualizá la información institucional, administrativa y de contacto.";

  }

  if (this.elementos.tituloPanelFormulario) {

    this.elementos.tituloPanelFormulario.textContent =
      "Información institucional";

  }

  document.title =
    "Editar institución | FALCO® Comunidad";

},



  /* =======================================================
     DATOS
  ======================================================= */

  obtenerDatosFormulario() {

    const {
      nombre,
      tipo,
      estado,
      descripcion,
      referente,
      cargo,
      correo,
      telefono,
      direccion,
      localidad,
      provincia,
      observaciones
    } = this.elementos;


    return {

      nombre:
        this.limpiarTexto(
          nombre?.value
        ),

      tipo:
        tipo?.value || "",

      estado:
        estado?.value || "activa",

      descripcion:
        this.limpiarTexto(
          descripcion?.value
        ),

      referente:
        this.limpiarTexto(
          referente?.value
        ),

      cargo:
        this.limpiarTexto(
          cargo?.value
        ),

      correo:
        this.limpiarTexto(
          correo?.value
        ).toLowerCase(),

      telefono:
        this.limpiarTexto(
          telefono?.value
        ),

      direccion:
        this.limpiarTexto(
          direccion?.value
        ),

      localidad:
        this.limpiarTexto(
          localidad?.value
        ),

      provincia:
        this.limpiarTexto(
          provincia?.value
        ),

      observaciones:
        this.limpiarTexto(
          observaciones?.value
        )

    };

  },


  limpiarTexto(valor) {

    return String(valor || "")
      .trim()
      .replace(/\s+/g, " ");

  },


  /* =======================================================
     VALIDACIÓN
  ======================================================= */

  validarFormulario(datos) {

    this.limpiarTodosLosErrores();

    let formularioValido = true;

    let primerCampoConError = null;


    if (!datos.nombre) {

      this.mostrarError(
        this.elementos.nombre,
        this.elementos.errorNombre,
        "Ingresá el nombre de la institución."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.nombre;

    }


    if (!datos.tipo) {

      this.mostrarError(
        this.elementos.tipo,
        this.elementos.errorTipo,
        "Seleccioná el tipo de institución."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.tipo;

    }


    if (!datos.estado) {

      this.mostrarError(
        this.elementos.estado,
        this.elementos.errorEstado,
        "Seleccioná el estado de la institución."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.estado;

    }


    if (!datos.referente) {

      this.mostrarError(
        this.elementos.referente,
        this.elementos.errorReferente,
        "Ingresá el nombre del referente institucional."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.referente;

    }


    if (
      datos.correo &&
      !this.correoValido(datos.correo)
    ) {

      this.mostrarError(
        this.elementos.correo,
        this.elementos.errorCorreo,
        "Ingresá un correo electrónico válido."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.correo;

    }


    if (!datos.localidad) {

      this.mostrarError(
        this.elementos.localidad,
        this.elementos.errorLocalidad,
        "Ingresá la localidad."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.localidad;

    }


    if (!datos.provincia) {

      this.mostrarError(
        this.elementos.provincia,
        this.elementos.errorProvincia,
        "Ingresá la provincia."
      );

      formularioValido = false;

      primerCampoConError ||= this.elementos.provincia;

    }


    if (
      !formularioValido &&
      primerCampoConError
    ) {

      primerCampoConError.focus();

      primerCampoConError.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }


    return formularioValido;

  },


  correoValido(correo) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      correo
    );

  },


  mostrarError(
    campo,
    elementoError,
    mensaje
  ) {

    if (campo) {

      campo.classList.add(
        "campo-error"
      );

      campo.setAttribute(
        "aria-invalid",
        "true"
      );

    }


    if (elementoError) {

      elementoError.textContent =
        mensaje;

    }

  },


  limpiarErrorDelCampo(campo) {

    if (!campo) {

      return;

    }


    campo.classList.remove(
      "campo-error"
    );

    campo.removeAttribute(
      "aria-invalid"
    );


    const mapaErrores = {

      nombreInstitucion:
        this.elementos.errorNombre,

      tipoInstitucion:
        this.elementos.errorTipo,

      estadoInstitucion:
        this.elementos.errorEstado,

      nombreReferente:
        this.elementos.errorReferente,

      correoInstitucion:
        this.elementos.errorCorreo,

      localidadInstitucion:
        this.elementos.errorLocalidad,

      provinciaInstitucion:
        this.elementos.errorProvincia

    };


    const error =
      mapaErrores[campo.id];


    if (error) {

      error.textContent = "";

    }

  },


  limpiarTodosLosErrores() {

    const campos = [

      this.elementos.nombre,
      this.elementos.tipo,
      this.elementos.estado,
      this.elementos.referente,
      this.elementos.correo,
      this.elementos.localidad,
      this.elementos.provincia

    ];


    const errores = [

      this.elementos.errorNombre,
      this.elementos.errorTipo,
      this.elementos.errorEstado,
      this.elementos.errorReferente,
      this.elementos.errorCorreo,
      this.elementos.errorLocalidad,
      this.elementos.errorProvincia

    ];


    campos.forEach(
      (campo) => {

        campo?.classList.remove(
          "campo-error"
        );

        campo?.removeAttribute(
          "aria-invalid"
        );

      }
    );


    errores.forEach(
      (error) => {

        if (error) {

          error.textContent = "";

        }

      }
    );

  },


  /* =======================================================
     BORRADOR
  ======================================================= */

  guardarBorrador(
    mostrarConfirmacion = false
  ) {

    try {

      const datos =
        this.obtenerDatosFormulario();


      if (!this.hayDatosParaGuardar(datos)) {

        localStorage.removeItem(
          FALCO_COMUNIDAD_INSTITUCION_CONFIG
            .claveBorrador
        );

        if (mostrarConfirmacion) {

          this.mostrarMensaje(
            "No hay datos para guardar como borrador.",
            "borrador"
          );

        }

        return;

      }


      const borrador = {

        ...datos,

        ultimaActualizacion:
          new Date().toISOString()

      };


      localStorage.setItem(
        FALCO_COMUNIDAD_INSTITUCION_CONFIG
          .claveBorrador,
        JSON.stringify(borrador)
      );


      if (mostrarConfirmacion) {

        this.mostrarMensaje(
          "Borrador guardado correctamente.",
          "borrador"
        );

      }

    } catch (error) {

      console.error(
        "No fue posible guardar el borrador:",
        error
      );


      if (mostrarConfirmacion) {

        this.mostrarMensaje(
          "No fue posible guardar el borrador.",
          "error"
        );

      }

    }

  },


  restaurarBorrador() {

    try {

      const contenido =
        localStorage.getItem(
          FALCO_COMUNIDAD_INSTITUCION_CONFIG
            .claveBorrador
        );


      if (!contenido) {

        return;

      }


      const borrador =
        JSON.parse(contenido);


      this.asignarValor(
        this.elementos.nombre,
        borrador.nombre
      );

      this.asignarValor(
        this.elementos.tipo,
        borrador.tipo
      );

      this.asignarValor(
        this.elementos.estado,
        borrador.estado || "activa"
      );

      this.asignarValor(
        this.elementos.descripcion,
        borrador.descripcion
      );

      this.asignarValor(
        this.elementos.referente,
        borrador.referente
      );

      this.asignarValor(
        this.elementos.cargo,
        borrador.cargo
      );

      this.asignarValor(
        this.elementos.correo,
        borrador.correo
      );

      this.asignarValor(
        this.elementos.telefono,
        borrador.telefono
      );

      this.asignarValor(
        this.elementos.direccion,
        borrador.direccion
      );

      this.asignarValor(
        this.elementos.localidad,
        borrador.localidad
      );

      this.asignarValor(
        this.elementos.provincia,
        borrador.provincia || "Buenos Aires"
      );

      this.asignarValor(
        this.elementos.observaciones,
        borrador.observaciones
      );


      this.borradorRestaurado = true;


      this.mostrarMensaje(
        "Se restauró el borrador guardado anteriormente.",
        "borrador"
      );

    } catch (error) {

      console.error(
        "No fue posible restaurar el borrador:",
        error
      );

      localStorage.removeItem(
        FALCO_COMUNIDAD_INSTITUCION_CONFIG
          .claveBorrador
      );

    }

  },


  asignarValor(
    elemento,
    valor
  ) {

    if (
      elemento &&
      valor !== undefined &&
      valor !== null
    ) {

      elemento.value = valor;

    }

  },


  hayDatosParaGuardar(datos) {

    return Boolean(

      datos.nombre ||
      datos.tipo ||
      datos.descripcion ||
      datos.referente ||
      datos.cargo ||
      datos.correo ||
      datos.telefono ||
      datos.direccion ||
      datos.localidad ||
      datos.observaciones

    );

  },


  eliminarBorrador() {

    localStorage.removeItem(
      FALCO_COMUNIDAD_INSTITUCION_CONFIG
        .claveBorrador
    );

  },


  /* =======================================================
     REGISTRO
  ======================================================= */

  registrarInstitucion() {

    if (this.guardando) {

      return;

    }


    const datos =
      this.obtenerDatosFormulario();


    if (!this.validarFormulario(datos)) {

      this.mostrarMensaje(
        "Revisá los campos señalados antes de registrar la institución.",
        "error"
      );

      return;

    }


    this.guardando = true;

    this.cambiarEstadoBotones(true);


    try {

     const ahora =
  new Date().toISOString();


let institucion;


if (
  this.modoEdicion &&
  this.institucionEditando
) {

  institucion = {

    ...this.institucionEditando,

    ...datos,

    ultimaActualizacion:
      ahora

  };


  this.actualizarInstitucionLocal(
    institucion
  );

}

else {

  institucion = {

    id:
      this.generarIdInstitucion(),

    ...datos,

    fechaAlta:
      ahora,

    ultimaActualizacion:
      ahora,

    origen:
      "comunidad-admin",

    version:
      1

  };


  this.guardarInstitucionLocal(
    institucion
  );

}


      this.eliminarBorrador();

      this.mostrarMensaje(
  this.modoEdicion
    ? "Los cambios fueron guardados correctamente."
    : "La institución fue registrada correctamente.",
  "exito"
);


      this.elementos.formulario.reset();

      this.restablecerValoresIniciales();

      this.limpiarTodosLosErrores();


      window.setTimeout(
        () => {

          window.location.href =
  this.modoEdicion
    ? `institucion.html?id=${encodeURIComponent(
        institucion.id
      )}`
    : "instituciones.html";

        },
        900
      );

    } catch (error) {

      console.error(
        "No fue posible registrar la institución:",
        error
      );


      this.mostrarMensaje(
        "No fue posible registrar la institución. Intentá nuevamente.",
        "error"
      );

    } finally {

      this.guardando = false;

      this.cambiarEstadoBotones(false);

    }

  },


  guardarInstitucionLocal(
    institucion
  ) {

    const clave =
      FALCO_COMUNIDAD_INSTITUCION_CONFIG
        .claveInstitucionesLocales;


    let instituciones = [];


    try {

      const contenido =
        localStorage.getItem(clave);

      instituciones =
        contenido
          ? JSON.parse(contenido)
          : [];

      if (!Array.isArray(instituciones)) {

        instituciones = [];

      }

    } catch (error) {

      console.warn(
        "Se reinició el almacenamiento local de instituciones.",
        error
      );

      instituciones = [];

    }


    instituciones.unshift(
      institucion
    );


    localStorage.setItem(
      clave,
      JSON.stringify(instituciones)
    );

  },


  actualizarInstitucionLocal(
  institucionActualizada
) {

  const clave =
    FALCO_COMUNIDAD_INSTITUCION_CONFIG
      .claveInstitucionesLocales;


  const contenido =
    localStorage.getItem(
      clave
    );


  const instituciones =
    contenido
      ? JSON.parse(contenido)
      : [];


  if (!Array.isArray(instituciones)) {

    throw new Error(
      "El almacenamiento de instituciones no es válido."
    );

  }


  const indice =
    instituciones.findIndex(
      institucion =>
        String(institucion.id) ===
        String(institucionActualizada.id)
    );


  if (indice < 0) {

    throw new Error(
      "No se encontró la institución para actualizar."
    );

  }


  instituciones[indice] = {

    ...instituciones[indice],

    ...institucionActualizada

  };


  localStorage.setItem(
    clave,
    JSON.stringify(
      instituciones
    )
  );

},


  generarIdInstitucion() {

    const fecha =
      Date.now().toString(36)
        .toUpperCase();

    const aleatorio =
      Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();


    return `FALCO-COM-INST-${fecha}-${aleatorio}`;

  },


  /* =======================================================
     REINICIAR
  ======================================================= */

  reiniciarFormulario() {

    this.elementos.formulario.reset();

    this.restablecerValoresIniciales();

    this.limpiarTodosLosErrores();

    this.eliminarBorrador();

    this.ocultarMensaje();


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    window.setTimeout(
      () => {

        this.elementos.nombre?.focus();

      },
      350
    );

  },


  restablecerValoresIniciales() {

    if (this.elementos.estado) {

      this.elementos.estado.value =
        "activa";

    }


    if (this.elementos.provincia) {

      this.elementos.provincia.value =
        "Buenos Aires";

    }

  },


  /* =======================================================
     BOTONES
  ======================================================= */

  cambiarEstadoBotones(
    deshabilitados
  ) {

    const {
      botonRegistrar,
      botonGuardarBorrador,
      botonReiniciar
    } = this.elementos;


    if (botonRegistrar) {

      botonRegistrar.disabled =
        deshabilitados;

      botonRegistrar.textContent =
  deshabilitados
    ? (
        this.modoEdicion
          ? "Guardando cambios..."
          : "Registrando..."
      )
    : (
        this.modoEdicion
          ? "Guardar cambios"
          : "Registrar institución"
      );

    }


    if (botonGuardarBorrador) {

      botonGuardarBorrador.disabled =
        deshabilitados;

    }


    if (botonReiniciar) {

      botonReiniciar.disabled =
        deshabilitados;

    }

  },


  /* =======================================================
     MENSAJES
  ======================================================= */

  mostrarMensaje(
    texto,
    tipo = "borrador"
  ) {

    const mensaje =
      this.elementos.mensaje;


    if (!mensaje) {

      return;

    }


    mensaje.textContent = texto;

    mensaje.hidden = false;

    mensaje.classList.remove(
      "mensaje-exito",
      "mensaje-error",
      "mensaje-borrador"
    );


    const claseTipo = {

      exito:
        "mensaje-exito",

      error:
        "mensaje-error",

      borrador:
        "mensaje-borrador"

    };


    mensaje.classList.add(
      claseTipo[tipo] ||
      "mensaje-borrador"
    );


    if (
      tipo === "exito" ||
      tipo === "borrador"
    ) {

      window.clearTimeout(
        this.temporizadorMensaje
      );


      this.temporizadorMensaje =
        window.setTimeout(
          () => {

            this.ocultarMensaje();

          },
          FALCO_COMUNIDAD_INSTITUCION_CONFIG
            .demoraMensaje
        );

    }

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
      "mensaje-borrador"
    );

  }

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    FalcoComunidadNuevaInstitucion.init();

  }
);


/* =========================================================
   ACCESO GLOBAL PARA PRUEBAS
========================================================= */

window.FalcoComunidadNuevaInstitucion =
  FalcoComunidadNuevaInstitucion;