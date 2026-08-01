/* =========================================================
   FALCO® COMUNIDAD
   CONFIGURACIÓN
   configuracion.js
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

const CONFIGURACION_STORAGE_KEY =
  "falcoComunidadConfiguracion";


const CONFIGURACION_VERSION =
  "1.0";


const CONFIGURACION_CLAVES_RESPALDO = [

  "falcoComunidadConfiguracion",

  "falcoComunidadSolicitudes",

  "falcoComunidadInstituciones",

  "falcoComunidadReuniones",

  "falcoReuniones",

  "falcoComunidadProyectos",

  "falcoProyectos",

  "falcoComunidadProgramas",

  "falcoComunidadAgenda",

  "falcoComunidadDocumentos"

];


/* =========================================================
   CONFIGURACIÓN PREDETERMINADA
========================================================= */

const CONFIGURACION_PREDETERMINADA = {

  nombreInstitucional:
    "FALCO® Comunidad",

  responsable:
    "Lic. Isabela Falco",

  correo:
    "",

  telefono:
    "",

  whatsapp:
    "",

  sitioWeb:
    "",

  descripcion:
    "Programas institucionales personalizados para municipios, organizaciones y comunidades.",

  zonaHoraria:
    "America/Argentina/Buenos_Aires",

  formatoFecha:
    "DD/MM/YYYY",

  registrosPagina:
    "20",

  responsablePredeterminado:
    "Lic. Isabela Falco",

  estadoSolicitud:
    "nueva",

  estadoInstitucion:
    "activa",

  estadoPrograma:
    "preparacion",

  estadoProyecto:
    "preparacion",

  estadoEvento:
    "pendiente",

  estadoDocumento:
    "borrador",

  version:
    CONFIGURACION_VERSION,

  fechaActualizacion:
    null

};


/* =========================================================
   ESTADO INTERNO
========================================================= */

const configuracionState = {

  configuracion:
    {
      ...CONFIGURACION_PREDETERMINADA
    },

  accionConfirmacion:
    null,

  temporizadorNotificacion:
    null,

  guardando:
    false

};


/* =========================================================
   REFERENCIAS DEL DOM
========================================================= */

const configuracionElementos = {

  formulario:
    document.getElementById(
      "formularioConfiguracion"
    ),


  /* -------------------------------------------------------
     CAMPOS INSTITUCIONALES
  ------------------------------------------------------- */

  nombreInstitucional:
    document.getElementById(
      "configuracionNombreInstitucional"
    ),

  responsable:
    document.getElementById(
      "configuracionResponsable"
    ),

  correo:
    document.getElementById(
      "configuracionCorreo"
    ),

  telefono:
    document.getElementById(
      "configuracionTelefono"
    ),

  whatsapp:
    document.getElementById(
      "configuracionWhatsapp"
    ),

  sitioWeb:
    document.getElementById(
      "configuracionSitioWeb"
    ),

  descripcion:
    document.getElementById(
      "configuracionDescripcion"
    ),


  /* -------------------------------------------------------
     PREFERENCIAS
  ------------------------------------------------------- */

  zonaHoraria:
    document.getElementById(
      "configuracionZonaHoraria"
    ),

  formatoFecha:
    document.getElementById(
      "configuracionFormatoFecha"
    ),

  registrosPagina:
    document.getElementById(
      "configuracionRegistrosPagina"
    ),

  responsablePredeterminado:
    document.getElementById(
      "configuracionResponsablePredeterminado"
    ),


  /* -------------------------------------------------------
     ESTADOS PREDETERMINADOS
  ------------------------------------------------------- */

  estadoSolicitud:
    document.getElementById(
      "configuracionEstadoSolicitud"
    ),

  estadoInstitucion:
    document.getElementById(
      "configuracionEstadoInstitucion"
    ),

  estadoPrograma:
    document.getElementById(
      "configuracionEstadoPrograma"
    ),

  estadoProyecto:
    document.getElementById(
      "configuracionEstadoProyecto"
    ),

  estadoEvento:
    document.getElementById(
      "configuracionEstadoEvento"
    ),

  estadoDocumento:
    document.getElementById(
      "configuracionEstadoDocumento"
    ),


  /* -------------------------------------------------------
     INFORMACIÓN TÉCNICA
  ------------------------------------------------------- */

  version:
    document.getElementById(
      "configuracionVersion"
    ),

  ultimoGuardado:
    document.getElementById(
      "configuracionUltimoGuardado"
    ),


  /* -------------------------------------------------------
     BOTONES
  ------------------------------------------------------- */

  botonGuardar:
    document.getElementById(
      "botonGuardarConfiguracion"
    ),

  botonRestablecer:
    document.getElementById(
      "botonRestablecerConfiguracion"
    ),

  botonExportar:
    document.getElementById(
      "botonExportarDatos"
    ),

  botonImportar:
    document.getElementById(
      "botonImportarDatos"
    ),

  archivoImportar:
    document.getElementById(
      "archivoImportarDatos"
    ),

  botonEliminar:
    document.getElementById(
      "botonEliminarConfiguracion"
    ),


  /* -------------------------------------------------------
     MODAL
  ------------------------------------------------------- */

  modal:
    document.getElementById(
      "modalConfirmacionConfiguracion"
    ),

  modalTitulo:
    document.getElementById(
      "modalConfiguracionTitulo"
    ),

  modalMensaje:
    document.getElementById(
      "modalConfiguracionMensaje"
    ),

  botonCancelarConfirmacion:
    document.getElementById(
      "botonCancelarConfirmacionConfiguracion"
    ),

  botonAceptarConfirmacion:
    document.getElementById(
      "botonAceptarConfirmacionConfiguracion"
    ),


  /* -------------------------------------------------------
     NOTIFICACIÓN
  ------------------------------------------------------- */

  notificacion:
    document.getElementById(
      "configuracionNotificacion"
    ),

  notificacionIcono:
    document.getElementById(
      "configuracionNotificacionIcono"
    ),

  notificacionTitulo:
    document.getElementById(
      "configuracionNotificacionTitulo"
    ),

  notificacionMensaje:
    document.getElementById(
      "configuracionNotificacionMensaje"
    ),

  notificacionCerrar:
    document.getElementById(
      "configuracionNotificacionCerrar"
    )

};


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciarConfiguracion
);


function iniciarConfiguracion() {

  if (
    !configuracionElementos.formulario
  ) {

    console.error(
      "No se encontró el formulario de configuración."
    );

    return;

  }


  registrarEventosConfiguracion();

  cargarConfiguracion();

  completarFormularioConfiguracion();

  actualizarInformacionTecnica();


  console.info(
    "FALCO Comunidad Configuración™ v1.0 Ready"
  );

}


/* =========================================================
   EVENTOS
========================================================= */

function registrarEventosConfiguracion() {

  configuracionElementos.formulario
    ?.addEventListener(
      "submit",
      guardarConfiguracion
    );


  configuracionElementos.formulario
    ?.addEventListener(
      "input",
      manejarCambioCampoConfiguracion
    );


  configuracionElementos.formulario
    ?.addEventListener(
      "change",
      manejarCambioCampoConfiguracion
    );


  configuracionElementos.botonRestablecer
    ?.addEventListener(
      "click",
      solicitarRestablecerConfiguracion
    );


  configuracionElementos.botonExportar
    ?.addEventListener(
      "click",
      exportarRespaldoConfiguracion
    );


  configuracionElementos.botonImportar
    ?.addEventListener(
      "click",
      abrirSelectorImportacion
    );


  configuracionElementos.archivoImportar
    ?.addEventListener(
      "change",
      importarRespaldoConfiguracion
    );


  configuracionElementos.botonEliminar
    ?.addEventListener(
      "click",
      solicitarEliminarConfiguracion
    );


  configuracionElementos.botonCancelarConfirmacion
    ?.addEventListener(
      "click",
      cerrarModalConfiguracion
    );


  configuracionElementos.botonAceptarConfirmacion
    ?.addEventListener(
      "click",
      ejecutarAccionConfirmadaConfiguracion
    );


  configuracionElementos.notificacionCerrar
    ?.addEventListener(
      "click",
      ocultarNotificacionConfiguracion
    );


  document
    .querySelectorAll(
      "[data-cerrar-modal]"
    )
    .forEach(
      (elemento) => {

        elemento.addEventListener(
          "click",
          cerrarModalConfiguracion
        );

      }
    );


  document.addEventListener(
    "keydown",
    manejarTecladoConfiguracion
  );


  window.addEventListener(
    "storage",
    manejarCambioStorageConfiguracion
  );

}


/* =========================================================
   CARGA
========================================================= */

function cargarConfiguracion() {

  try {

    const contenido =
      localStorage.getItem(
        CONFIGURACION_STORAGE_KEY
      );


    if (!contenido) {

      configuracionState.configuracion = {

        ...CONFIGURACION_PREDETERMINADA

      };


      return;

    }


    const datos =
      JSON.parse(
        contenido
      );


    if (
      !datos ||
      typeof datos !== "object" ||
      Array.isArray(datos)
    ) {

      configuracionState.configuracion = {

        ...CONFIGURACION_PREDETERMINADA

      };


      return;

    }


    configuracionState.configuracion = {

      ...CONFIGURACION_PREDETERMINADA,

      ...datos,

      version:
        CONFIGURACION_VERSION

    };

  } catch (error) {

    console.error(
      "No fue posible cargar la configuración:",
      error
    );


    configuracionState.configuracion = {

      ...CONFIGURACION_PREDETERMINADA

    };

  }

}


/* =========================================================
   COMPLETAR FORMULARIO
========================================================= */

function completarFormularioConfiguracion() {

  const configuracion =
    configuracionState.configuracion;


  completarCampoConfiguracion(
    "nombreInstitucional",
    configuracion.nombreInstitucional
  );


  completarCampoConfiguracion(
    "responsable",
    configuracion.responsable
  );


  completarCampoConfiguracion(
    "correo",
    configuracion.correo
  );


  completarCampoConfiguracion(
    "telefono",
    configuracion.telefono
  );


  completarCampoConfiguracion(
    "whatsapp",
    configuracion.whatsapp
  );


  completarCampoConfiguracion(
    "sitioWeb",
    configuracion.sitioWeb
  );


  completarCampoConfiguracion(
    "descripcion",
    configuracion.descripcion
  );


  completarCampoConfiguracion(
    "zonaHoraria",
    configuracion.zonaHoraria
  );


  completarCampoConfiguracion(
    "formatoFecha",
    configuracion.formatoFecha
  );


  completarCampoConfiguracion(
    "registrosPagina",
    configuracion.registrosPagina
  );


  completarCampoConfiguracion(
    "responsablePredeterminado",
    configuracion.responsablePredeterminado
  );


  completarCampoConfiguracion(
    "estadoSolicitud",
    configuracion.estadoSolicitud
  );


  completarCampoConfiguracion(
    "estadoInstitucion",
    configuracion.estadoInstitucion
  );


  completarCampoConfiguracion(
    "estadoPrograma",
    configuracion.estadoPrograma
  );


  completarCampoConfiguracion(
    "estadoProyecto",
    configuracion.estadoProyecto
  );


  completarCampoConfiguracion(
    "estadoEvento",
    configuracion.estadoEvento
  );


  completarCampoConfiguracion(
    "estadoDocumento",
    configuracion.estadoDocumento
  );


  limpiarErroresConfiguracion();

}


/* =========================================================
   COMPLETAR CAMPO
========================================================= */

function completarCampoConfiguracion(
  nombre,
  valor
) {

  const campo =
    configuracionElementos.formulario
      ?.elements
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
   OBTENER DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosConfiguracion() {

  const datos =
    new FormData(
      configuracionElementos.formulario
    );


  return {

    nombreInstitucional:
      obtenerTextoConfiguracion(
        datos.get(
          "nombreInstitucional"
        )
      ),

    responsable:
      obtenerTextoConfiguracion(
        datos.get(
          "responsable"
        )
      ),

    correo:
      obtenerTextoConfiguracion(
        datos.get(
          "correo"
        )
      ),

    telefono:
      obtenerTextoConfiguracion(
        datos.get(
          "telefono"
        )
      ),

    whatsapp:
      obtenerTextoConfiguracion(
        datos.get(
          "whatsapp"
        )
      ),

    sitioWeb:
      obtenerTextoConfiguracion(
        datos.get(
          "sitioWeb"
        )
      ),

    descripcion:
      obtenerTextoConfiguracion(
        datos.get(
          "descripcion"
        )
      ),

    zonaHoraria:
      obtenerTextoConfiguracion(
        datos.get(
          "zonaHoraria"
        )
      ) ||
      CONFIGURACION_PREDETERMINADA.zonaHoraria,

    formatoFecha:
      obtenerTextoConfiguracion(
        datos.get(
          "formatoFecha"
        )
      ) ||
      CONFIGURACION_PREDETERMINADA.formatoFecha,

    registrosPagina:
      obtenerTextoConfiguracion(
        datos.get(
          "registrosPagina"
        )
      ) ||
      CONFIGURACION_PREDETERMINADA.registrosPagina,

    responsablePredeterminado:
      obtenerTextoConfiguracion(
        datos.get(
          "responsablePredeterminado"
        )
      ),

    estadoSolicitud:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoSolicitud"
        )
      ) ||
      "nueva",

    estadoInstitucion:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoInstitucion"
        )
      ) ||
      "activa",

    estadoPrograma:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoPrograma"
        )
      ) ||
      "preparacion",

    estadoProyecto:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoProyecto"
        )
      ) ||
      "preparacion",

    estadoEvento:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoEvento"
        )
      ) ||
      "pendiente",

    estadoDocumento:
      obtenerTextoConfiguracion(
        datos.get(
          "estadoDocumento"
        )
      ) ||
      "borrador",

    version:
      CONFIGURACION_VERSION,

    fechaActualizacion:
      new Date().toISOString()

  };

}


/* =========================================================
   GUARDAR
========================================================= */

function guardarConfiguracion(
  evento
) {

  evento.preventDefault();


  if (
    configuracionState.guardando
  ) {

    return;

  }


  if (
    !validarConfiguracion()
  ) {

    mostrarNotificacionConfiguracion({

      tipo:
        "error",

      titulo:
        "Revisá la información",

      mensaje:
        "Corregí los campos señalados antes de guardar."

    });


    enfocarPrimerErrorConfiguracion();

    return;

  }


  const nuevaConfiguracion =
    obtenerDatosConfiguracion();


  activarGuardadoConfiguracion();


  window.setTimeout(
    () => {

      try {

        localStorage.setItem(
          CONFIGURACION_STORAGE_KEY,
          JSON.stringify(
            nuevaConfiguracion
          )
        );


        configuracionState.configuracion =
          nuevaConfiguracion;


        actualizarInformacionTecnica();


        desactivarGuardadoConfiguracion();


        mostrarNotificacionConfiguracion({

          tipo:
            "success",

          titulo:
            "Configuración guardada",

          mensaje:
            "Los cambios fueron almacenados correctamente."

        });

      } catch (error) {

        console.error(
          "No fue posible guardar la configuración:",
          error
        );


        desactivarGuardadoConfiguracion();


        mostrarNotificacionConfiguracion({

          tipo:
            "error",

          titulo:
            "No pudimos guardar",

          mensaje:
            "Se produjo un inconveniente al almacenar la configuración."

        });

      }

    },
    250
  );

}


/* =========================================================
   VALIDACIÓN
========================================================= */

function validarConfiguracion() {

  limpiarErroresConfiguracion();


  let valido =
    true;


  if (
    !obtenerTextoConfiguracion(
      configuracionElementos
        .nombreInstitucional
        ?.value
    )
  ) {

    mostrarErrorConfiguracion(
      configuracionElementos.nombreInstitucional,
      "Ingresá el nombre institucional."
    );


    valido =
      false;

  }


  if (
    configuracionElementos.correo?.value &&
    !configuracionElementos.correo.checkValidity()
  ) {

    mostrarErrorConfiguracion(
      configuracionElementos.correo,
      "Ingresá un correo electrónico válido."
    );


    valido =
      false;

  }


  if (
    configuracionElementos.sitioWeb?.value &&
    !configuracionElementos.sitioWeb.checkValidity()
  ) {

    mostrarErrorConfiguracion(
      configuracionElementos.sitioWeb,
      "Ingresá una dirección web válida."
    );


    valido =
      false;

  }


  return valido;

}


/* =========================================================
   ERRORES
========================================================= */

function mostrarErrorConfiguracion(
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


  const error =
    configuracionElementos.formulario
      ?.querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoConfiguracion(
    error,
    mensaje
  );

}


function limpiarErrorConfiguracion(
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


  const error =
    configuracionElementos.formulario
      ?.querySelector(
        `[data-error="${campo.name}"]`
      );


  establecerTextoConfiguracion(
    error,
    ""
  );

}


function limpiarErroresConfiguracion() {

  configuracionElementos.formulario
    ?.querySelectorAll(
      "input, select, textarea"
    )
    .forEach(
      limpiarErrorConfiguracion
    );

}


function manejarCambioCampoConfiguracion(
  evento
) {

  limpiarErrorConfiguracion(
    evento.target
  );

}


function enfocarPrimerErrorConfiguracion() {

  configuracionElementos.formulario
    ?.querySelector(
      '[aria-invalid="true"]'
    )
    ?.focus();

}


/* =========================================================
   ESTADO DE GUARDADO
========================================================= */

function activarGuardadoConfiguracion() {

  configuracionState.guardando =
    true;


  if (
    configuracionElementos.botonGuardar
  ) {

    configuracionElementos.botonGuardar.disabled =
      true;


    configuracionElementos.botonGuardar.textContent =
      "Guardando...";

  }

}


function desactivarGuardadoConfiguracion() {

  configuracionState.guardando =
    false;


  if (
    configuracionElementos.botonGuardar
  ) {

    configuracionElementos.botonGuardar.disabled =
      false;


    configuracionElementos.botonGuardar.textContent =
      "Guardar configuración";

  }

}


/* =========================================================
   INFORMACIÓN TÉCNICA
========================================================= */

function actualizarInformacionTecnica() {

  establecerTextoConfiguracion(
    configuracionElementos.version,
    CONFIGURACION_VERSION
  );


  const fecha =
    configuracionState.configuracion
      .fechaActualizacion;


  establecerTextoConfiguracion(
    configuracionElementos.ultimoGuardado,
    fecha
      ? formatearFechaHoraConfiguracion(
          fecha
        )
      : "Sin cambios registrados"
  );

}


/* =========================================================
   RESTABLECER
========================================================= */

function solicitarRestablecerConfiguracion() {

  configuracionState.accionConfirmacion =
    "restablecer";


  abrirModalConfiguracion({

    titulo:
      "Restablecer configuración",

    mensaje:
      "Los campos volverán a sus valores predeterminados. Los demás registros de Comunidad no serán eliminados.",

    textoConfirmar:
      "Restablecer"

  });

}


function restablecerConfiguracion() {

  configuracionState.configuracion = {

    ...CONFIGURACION_PREDETERMINADA,

    fechaActualizacion:
      new Date().toISOString()

  };


  try {

    localStorage.setItem(
      CONFIGURACION_STORAGE_KEY,
      JSON.stringify(
        configuracionState.configuracion
      )
    );


    completarFormularioConfiguracion();

    actualizarInformacionTecnica();

    cerrarModalConfiguracion();


    mostrarNotificacionConfiguracion({

      tipo:
        "success",

      titulo:
        "Configuración restablecida",

      mensaje:
        "Se recuperaron los valores predeterminados."

    });

  } catch (error) {

    console.error(
      "No fue posible restablecer la configuración:",
      error
    );


    mostrarNotificacionConfiguracion({

      tipo:
        "error",

      titulo:
        "No pudimos restablecer",

      mensaje:
        "Se produjo un inconveniente al guardar los valores predeterminados."

    });

  }

}


/* =========================================================
   ELIMINAR CONFIGURACIÓN
========================================================= */

function solicitarEliminarConfiguracion() {

  configuracionState.accionConfirmacion =
    "eliminar";


  abrirModalConfiguracion({

    titulo:
      "Eliminar configuración",

    mensaje:
      "Se eliminará solamente la configuración personalizada. No se borrarán solicitudes, instituciones, programas, proyectos, eventos ni documentos.",

    textoConfirmar:
      "Eliminar configuración"

  });

}


function eliminarConfiguracion() {

  try {

    localStorage.removeItem(
      CONFIGURACION_STORAGE_KEY
    );


    configuracionState.configuracion = {

      ...CONFIGURACION_PREDETERMINADA

    };


    completarFormularioConfiguracion();

    actualizarInformacionTecnica();

    cerrarModalConfiguracion();


    mostrarNotificacionConfiguracion({

      tipo:
        "success",

      titulo:
        "Configuración eliminada",

      mensaje:
        "Los valores personalizados fueron eliminados."

    });

  } catch (error) {

    console.error(
      "No fue posible eliminar la configuración:",
      error
    );


    mostrarNotificacionConfiguracion({

      tipo:
        "error",

      titulo:
        "No pudimos eliminar",

      mensaje:
        "Se produjo un inconveniente al eliminar la configuración."

    });

  }

}


/* =========================================================
   EXPORTAR RESPALDO
========================================================= */

function exportarRespaldoConfiguracion() {

  const respaldo = {

    sistema:
      "FALCO® Comunidad",

    version:
      CONFIGURACION_VERSION,

    fechaExportacion:
      new Date().toISOString(),

    datos:
      {}

  };


  CONFIGURACION_CLAVES_RESPALDO.forEach(
    (clave) => {

      const contenido =
        localStorage.getItem(
          clave
        );


      if (
        contenido === null
      ) {

        return;

      }


      try {

        respaldo.datos[clave] =
          JSON.parse(
            contenido
          );

      } catch {

        respaldo.datos[clave] =
          contenido;

      }

    }
  );


  const archivo =
    new Blob(
      [
        JSON.stringify(
          respaldo,
          null,
          2
        )
      ],
      {
        type:
          "application/json;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(
      archivo
    );


  const enlace =
    document.createElement(
      "a"
    );


  enlace.href =
    url;


  enlace.download =
    generarNombreRespaldoConfiguracion();


  document.body.appendChild(
    enlace
  );


  enlace.click();

  enlace.remove();


  URL.revokeObjectURL(
    url
  );


  mostrarNotificacionConfiguracion({

    tipo:
      "success",

    titulo:
      "Respaldo exportado",

    mensaje:
      "Los datos locales fueron descargados en un archivo JSON."

  });

}


/* =========================================================
   NOMBRE DEL RESPALDO
========================================================= */

function generarNombreRespaldoConfiguracion() {

  const fecha =
    new Date();


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


  return `FALCO-Comunidad-Respaldo-${anio}-${mes}-${dia}.json`;

}


/* =========================================================
   IMPORTAR RESPALDO
========================================================= */

function abrirSelectorImportacion() {

  if (
    !configuracionElementos.archivoImportar
  ) {

    return;

  }


  configuracionElementos.archivoImportar.value =
    "";


  configuracionElementos.archivoImportar.click();

}


function importarRespaldoConfiguracion(
  evento
) {

  const archivo =
    evento.target.files?.[0];


  if (!archivo) {

    return;

  }


  const lector =
    new FileReader();


  lector.onload =
    () => {

      try {

        const respaldo =
          JSON.parse(
            lector.result
          );


        validarRespaldoConfiguracion(
          respaldo
        );


        guardarDatosImportadosConfiguracion(
          respaldo.datos
        );


        cargarConfiguracion();

        completarFormularioConfiguracion();

        actualizarInformacionTecnica();


        mostrarNotificacionConfiguracion({

          tipo:
            "success",

          titulo:
            "Respaldo importado",

          mensaje:
            "Los datos fueron restaurados correctamente."

        });

      } catch (error) {

        console.error(
          "No fue posible importar el respaldo:",
          error
        );


        mostrarNotificacionConfiguracion({

          tipo:
            "error",

          titulo:
            "Archivo no válido",

          mensaje:
            "El archivo seleccionado no corresponde a un respaldo válido de FALCO® Comunidad."

        });

      }

    };


  lector.onerror =
    () => {

      mostrarNotificacionConfiguracion({

        tipo:
          "error",

        titulo:
          "No pudimos leer el archivo",

        mensaje:
          "Se produjo un inconveniente al abrir el respaldo."

      });

    };


  lector.readAsText(
    archivo,
    "UTF-8"
  );

}


/* =========================================================
   VALIDAR RESPALDO
========================================================= */

function validarRespaldoConfiguracion(
  respaldo
) {

  if (
    !respaldo ||
    typeof respaldo !== "object" ||
    Array.isArray(respaldo)
  ) {

    throw new Error(
      "Estructura de respaldo inválida."
    );

  }


  if (
    respaldo.sistema !==
    "FALCO® Comunidad"
  ) {

    throw new Error(
      "El archivo no pertenece a FALCO® Comunidad."
    );

  }


  if (
    !respaldo.datos ||
    typeof respaldo.datos !== "object" ||
    Array.isArray(respaldo.datos)
  ) {

    throw new Error(
      "El respaldo no contiene datos."
    );

  }

}


/* =========================================================
   GUARDAR DATOS IMPORTADOS
========================================================= */

function guardarDatosImportadosConfiguracion(
  datos
) {

  Object.entries(
    datos
  ).forEach(
    ([
      clave,
      valor
    ]) => {

      if (
        !CONFIGURACION_CLAVES_RESPALDO.includes(
          clave
        )
      ) {

        return;

      }


      localStorage.setItem(
        clave,
        typeof valor === "string"
          ? valor
          : JSON.stringify(
              valor
            )
      );

    }
  );

}


/* =========================================================
   MODAL DE CONFIRMACIÓN
========================================================= */

function abrirModalConfiguracion({
  titulo,
  mensaje,
  textoConfirmar
}) {

  establecerTextoConfiguracion(
    configuracionElementos.modalTitulo,
    titulo
  );


  establecerTextoConfiguracion(
    configuracionElementos.modalMensaje,
    mensaje
  );


  establecerTextoConfiguracion(
    configuracionElementos.botonAceptarConfirmacion,
    textoConfirmar
  );


  if (
    !configuracionElementos.modal
  ) {

    return;

  }


  configuracionElementos.modal.hidden =
    false;


  document.body.classList.add(
    "configuracion-modal-abierto"
  );


  window.setTimeout(
    () => {

      configuracionElementos
        .botonAceptarConfirmacion
        ?.focus();

    },
    60
  );

}


function cerrarModalConfiguracion() {

  if (
    configuracionElementos.modal
  ) {

    configuracionElementos.modal.hidden =
      true;

  }


  document.body.classList.remove(
    "configuracion-modal-abierto"
  );


  configuracionState.accionConfirmacion =
    null;

}


/* =========================================================
   EJECUTAR CONFIRMACIÓN
========================================================= */

function ejecutarAccionConfirmadaConfiguracion() {

  switch (
    configuracionState.accionConfirmacion
  ) {

    case "restablecer":

      restablecerConfiguracion();

      break;


    case "eliminar":

      eliminarConfiguracion();

      break;


    default:

      cerrarModalConfiguracion();

  }

}


/* =========================================================
   TECLADO
========================================================= */

function manejarTecladoConfiguracion(
  evento
) {

  if (
    evento.key !== "Escape"
  ) {

    return;

  }


  if (
    configuracionElementos.modal &&
    !configuracionElementos.modal.hidden
  ) {

    cerrarModalConfiguracion();

  }

}


/* =========================================================
   CAMBIO EN STORAGE
========================================================= */

function manejarCambioStorageConfiguracion(
  evento
) {

  if (
    evento.key !==
    CONFIGURACION_STORAGE_KEY
  ) {

    return;

  }


  cargarConfiguracion();

  completarFormularioConfiguracion();

  actualizarInformacionTecnica();

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacionConfiguracion({
  tipo = "success",
  titulo,
  mensaje
}) {

  if (
    !configuracionElementos.notificacion
  ) {

    return;

  }


  window.clearTimeout(
    configuracionState.temporizadorNotificacion
  );


  const configuraciones = {

    success: {

      icono:
        "✓",

      color:
        "#60c89b",

      borde:
        "rgba(96,200,155,.28)",

      fondo:
        "rgba(96,200,155,.10)"

    },

    error: {

      icono:
        "!",

      color:
        "#d86f6f",

      borde:
        "rgba(216,111,111,.30)",

      fondo:
        "rgba(216,111,111,.10)"

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


  establecerTextoConfiguracion(
    configuracionElementos.notificacionIcono,
    configuracion.icono
  );


  establecerTextoConfiguracion(
    configuracionElementos.notificacionTitulo,
    titulo
  );


  establecerTextoConfiguracion(
    configuracionElementos.notificacionMensaje,
    mensaje
  );


  configuracionElementos.notificacion
    .style.borderColor =
      configuracion.borde;


  configuracionElementos.notificacionIcono
    .style.color =
      configuracion.color;


  configuracionElementos.notificacionIcono
    .style.borderColor =
      configuracion.borde;


  configuracionElementos.notificacionIcono
    .style.background =
      configuracion.fondo;


  configuracionElementos.notificacion.hidden =
    false;


  configuracionState.temporizadorNotificacion =
    window.setTimeout(
      ocultarNotificacionConfiguracion,
      4500
    );

}


function ocultarNotificacionConfiguracion() {

  if (
    !configuracionElementos.notificacion
  ) {

    return;

  }


  configuracionElementos.notificacion.hidden =
    true;


  window.clearTimeout(
    configuracionState.temporizadorNotificacion
  );

}


/* =========================================================
   FECHAS
========================================================= */

function crearFechaConfiguracion(
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


function formatearFechaHoraConfiguracion(
  valor
) {

  const fecha =
    crearFechaConfiguracion(
      valor
    );


  if (!fecha) {

    return "Sin cambios registrados";

  }


  return new Intl.DateTimeFormat(
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
  ).format(
    fecha
  );

}


/* =========================================================
   UTILIDADES
========================================================= */

function obtenerTextoConfiguracion(
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


function establecerTextoConfiguracion(
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


/* =========================================================
   FIN DEL ARCHIVO
========================================================= */