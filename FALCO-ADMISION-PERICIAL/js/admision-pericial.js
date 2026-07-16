/* =========================================================
   SISTEMA DE ADMISIÓN PERICIAL FALCO®
   Sprint 1 — Arquitectura general
========================================================= */

const CLAVE_STORAGE = "falcoAdmisionPericialV2";


/* =========================================================
   CONFIGURACIÓN DE MÓDULOS
========================================================= */

const MODULOS = [
  {
    id: "datos-personales",
    archivo: "modulos/datos-personales.html",
    titulo: "Datos personales",
    descripcion:
      "Información identificatoria, personal y de contacto del periciado."
  },

  {
    id: "datos-judiciales",
    archivo: "modulos/datos-judiciales.html",
    titulo: "Datos judiciales",
    descripcion:
      "Información del abogado y datos disponibles de la causa judicial."
  },

  {
    id: "relato-hecho",
    archivo: "modulos/relato-hecho.html",
    titulo: "Relato del hecho",
    descripcion:
      "Reconstrucción cronológica y detallada del accidente o hecho reclamado."
  },

  {
    id: "grupo-familiar",
    archivo: "modulos/grupo-familiar.html",
    titulo: "Grupo familiar",
    descripcion:
      "Composición familiar, convivencia, frecuencia de contacto y calidad de los vínculos."
  },

  {
    id: "area-afectiva",
    archivo: "modulos/area-afectiva.html",
    titulo: "Área afectiva",
    descripcion:
      "Situación afectiva, pareja, apoyo emocional y cambios posteriores al hecho."
  },

  {
    id: "area-social",
    archivo: "modulos/area-social.html",
    titulo: "Área social y recreativa",
    descripcion:
      "Amistades, red de apoyo, actividades sociales y uso del tiempo libre."
  },

  {
    id: "educacion",
    archivo: "modulos/educacion.html",
    titulo: "Educación y formación",
    descripcion:
      "Nivel educativo, estudios realizados, capacitaciones y formación académica."
  },

  {
    id: "historia-laboral",
    archivo: "modulos/historia-laboral.html",
    titulo: "Historia laboral",
    descripcion:
      "Trayectoria laboral completa y antecedentes de trabajos anteriores."
  },

  {
    id: "trabajo-actual",
    archivo: "modulos/trabajo-actual.html",
    titulo: "Trabajo actual",
    descripcion:
      "Situación laboral actual, horarios, tareas e impacto del hecho sobre el trabajo."
  },

  {
    id: "tratamientos",
    archivo: "modulos/tratamientos.html",
    titulo: "Tratamientos",
    descripcion:
      "Tratamientos médicos, psicológicos, psiquiátricos y de rehabilitación."
  },

  {
    id: "antecedentes-salud",
    archivo: "modulos/antecedentes-salud.html",
    titulo: "Antecedentes de salud",
    descripcion:
      "Antecedentes médicos, psicológicos, psiquiátricos, quirúrgicos y personales."
  },

  {
    id: "habitos-calidad-vida",
    archivo: "modulos/habitos-calidad-vida.html",
    titulo: "Hábitos y calidad de vida",
    descripcion:
      "Sueño, alimentación, actividad física, autonomía y funcionamiento cotidiano."
  },

  {
    id: "impacto-actual",
    archivo: "modulos/impacto-actual.html",
    titulo: "Impacto actual",
    descripcion:
      "Consecuencias emocionales, familiares, sociales, laborales y funcionales actuales."
  },

  {
    id: "documentacion",
    archivo: "modulos/documentacion.html",
    titulo: "Documentación",
    descripcion:
      "Documentación médica, psicológica, laboral y judicial disponible."
  },

  {
    id: "observaciones-finales",
    archivo: "modulos/observaciones-finales.html",
    titulo: "Observaciones finales",
    descripcion:
      "Información complementaria, percepción personal y documentación pendiente."
  },

  {
    id: "consentimiento",
    archivo: "modulos/consentimiento.html",
    titulo: "Consentimiento informado",
    descripcion:
      "Declaraciones finales, consentimiento, confirmación y envío de la admisión."
  }
];


/* =========================================================
   ESTADO DE LA APLICACIÓN
========================================================= */

const estadoInicial = {
  moduloActual: 0,
  completados: [],
  datos: {},
  ultimaActualizacion: null,
  finalizada: false,
  finalizadaEn: null
};

let estado = cargarEstado();


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const elementos = {
  navegacion:
    document.getElementById("navegacionModulos"),

  contenedor:
    document.getElementById("contenedorModulo"),

  numeroModulo:
    document.getElementById("numeroModulo"),

  tituloModulo:
    document.getElementById("tituloModulo"),

  descripcionModulo:
    document.getElementById("descripcionModulo"),

  estadoModulo:
    document.getElementById("estadoModulo"),

  textoProgreso:
    document.getElementById("textoProgreso"),

  porcentajeProgreso:
    document.getElementById("porcentajeProgreso"),

  barraProgreso:
    document.getElementById("barraProgreso"),

  progresoAccesible:
    document.querySelector(".progreso-barra"),

  estadoGuardado:
    document.getElementById("estadoGuardado"),

  botonAnterior:
    document.getElementById("botonAnterior"),

  botonSiguiente:
    document.getElementById("botonSiguiente"),

  botonGuardar:
    document.getElementById("botonGuardar"),

  botonCompletar:
    document.getElementById("botonCompletar"),

  botonReiniciar:
    document.getElementById("botonReiniciar"),

  botonMenuMovil:
    document.getElementById("botonMenuMovil"),

  notificacion:
    document.getElementById("notificacion"),

  modalReinicio:
    document.getElementById("modalReinicio"),

  botonCancelarReinicio:
    document.getElementById("botonCancelarReinicio"),

  botonConfirmarReinicio:
    document.getElementById("botonConfirmarReinicio")
};



/* =========================================================
   ESPERAR FIREBASE ADMISIÓN
========================================================= */

function esperarFirebaseAdmision(
  intentosMaximos = 40
) {
  return new Promise(resolve => {
    let intentos = 0;

    const comprobar = () => {
      const disponible =
        window.FalcoFirebaseAdmision &&
        typeof window.FalcoFirebaseAdmision.cargar ===
          "function";

      if (disponible) {
        resolve(true);
        return;
      }

      intentos++;

      if (intentos >= intentosMaximos) {
        console.warn(
          "Firebase Admisión no estuvo disponible durante el inicio."
        );

        resolve(false);
        return;
      }

      setTimeout(
        comprobar,
        100
      );
    };

    comprobar();
  });
}





/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

async function iniciarAplicacion() {
  await esperarFirebaseAdmision();

  const recuperada =
    await cargarEstadoDesdeFirebase();

  if (recuperada) {
    console.log(
      "Estado remoto aplicado antes de cargar la interfaz."
    );
  } else {
    console.log(
      "No se encontró una admisión remota. Se utilizará el estado local."
    );
  }

  crearNavegacion();
  vincularEventos();
  actualizarProgreso();
  actualizarEstadoGuardado();

  await cargarModulo(
    estado.moduloActual
  );
}


/* =========================================================
   ALMACENAMIENTO LOCAL
========================================================= */

function cargarEstado() {
  try {
    if (window.FalcoStorage) {
      const resultado =
        window.FalcoStorage.obtener(
          CLAVE_STORAGE,
          estadoInicial
        );

      const datosGuardados =
        resultado.datos ||
        structuredClone(estadoInicial);

      return {
        ...structuredClone(estadoInicial),
        ...datosGuardados,

        completados:
          Array.isArray(
            datosGuardados.completados
          )
            ? datosGuardados.completados
            : [],

        datos:
          datosGuardados.datos &&
          typeof datosGuardados.datos ===
            "object"
            ? datosGuardados.datos
            : {}
      };
    }

    const guardado =
      localStorage.getItem(
        CLAVE_STORAGE
      );

    if (!guardado) {
      return structuredClone(
        estadoInicial
      );
    }

    const datosGuardados =
      JSON.parse(guardado);

    return {
      ...structuredClone(estadoInicial),
      ...datosGuardados,

      completados:
        Array.isArray(
          datosGuardados.completados
        )
          ? datosGuardados.completados
          : [],

      datos:
        datosGuardados.datos &&
        typeof datosGuardados.datos ===
          "object"
          ? datosGuardados.datos
          : {}
    };

  } catch (error) {
    console.error(
      "No se pudo recuperar la admisión guardada:",
      error
    );

    return structuredClone(
      estadoInicial
    );
  }
}




/* =========================================================
   GUARDAR ESTADO
========================================================= */

function guardarEstado(
  mostrarMensaje = false
) {
  estado.ultimaActualizacion =
    new Date().toISOString();

  /* =========================
     GUARDADO LOCAL
  ========================= */

  if (window.FalcoStorage) {
    const resultado =
      window.FalcoStorage.guardar(
        CLAVE_STORAGE,
        estado
      );

    if (!resultado.ok) {
      console.error(
        "No se pudo guardar el estado local de la admisión.",
        resultado.error
      );

      mostrarNotificacion(
        "No se pudo guardar la información."
      );

      return;
    }
  } else {
    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify(estado)
    );
  }

  /* =========================
     GUARDADO EN FIREBASE
  ========================= */

  if (
    !estado.finalizada &&
    window.FalcoFirebaseAdmision &&
    typeof window.FalcoFirebaseAdmision.guardar ===
      "function"
  ) {
    window.FalcoFirebaseAdmision
      .guardar(estado)
      .catch(error => {
        console.error(
          "No se pudo guardar la admisión en Firebase:",
          error
        );
      });
  }

  actualizarEstadoGuardado();

  if (mostrarMensaje) {
    mostrarNotificacion(
      "Avance guardado correctamente."
    );
  }
}


/* =========================================================
   CARGAR ESTADO DESDE FIREBASE
========================================================= */

async function cargarEstadoDesdeFirebase() {
  if (
    !window.FalcoFirebaseAdmision ||
    typeof window.FalcoFirebaseAdmision.cargar !==
      "function"
  ) {
    return false;
  }

  try {
    const admisionRemota =
      await window.FalcoFirebaseAdmision.cargar();

    if (!admisionRemota) {
      return false;
    }

    let ultimaActualizacion =
      estado.ultimaActualizacion;

    if (
      admisionRemota.ultimaActualizacion &&
      typeof admisionRemota
        .ultimaActualizacion.toDate ===
        "function"
    ) {
      ultimaActualizacion =
        admisionRemota
          .ultimaActualizacion
          .toDate()
          .toISOString();
    }

    let finalizadaEn = null;

    if (
      admisionRemota.finalizadaEn &&
      typeof admisionRemota
        .finalizadaEn.toDate ===
        "function"
    ) {
      finalizadaEn =
        admisionRemota
          .finalizadaEn
          .toDate()
          .toISOString();
    }

    estado = {
      ...structuredClone(estadoInicial),

      moduloActual:
        Number.isInteger(
          admisionRemota.moduloActual
        )
          ? admisionRemota.moduloActual
          : 0,

      completados:
        Array.isArray(
          admisionRemota.completados
        )
          ? admisionRemota.completados
          : [],

      datos:
        admisionRemota.datos &&
        typeof admisionRemota.datos ===
          "object"
          ? admisionRemota.datos
          : {},

      ultimaActualizacion,

      finalizada:
        admisionRemota.estado ===
        "finalizada",

      finalizadaEn
    };

    if (window.FalcoStorage) {
      window.FalcoStorage.guardar(
        CLAVE_STORAGE,
        estado
      );
    } else {
      localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(estado)
      );
    }

    console.log(
      "Admisión recuperada desde Firebase."
    );

    return true;

  } catch (error) {
    console.error(
      "No se pudo recuperar la admisión desde Firebase:",
      error
    );

    return false;
  }
}



/* =========================================================
   ACTUALIZAR ESTADO DE GUARDADO
========================================================= */

function actualizarEstadoGuardado() {
  if (!elementos.estadoGuardado) {
    return;
  }

  if (!estado.ultimaActualizacion) {
    elementos.estadoGuardado.textContent =
      "Guardado automático habilitado";

    return;
  }

  const fecha =
    new Date(
      estado.ultimaActualizacion
    );

  elementos.estadoGuardado.textContent =
    `Último guardado: ${fecha.toLocaleTimeString(
      "es-AR",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    )}`;
}

/* =========================================================
   NAVEGACIÓN LATERAL
========================================================= */

function crearNavegacion() {
  elementos.navegacion.innerHTML = "";

  MODULOS.forEach((modulo, indice) => {
    const boton =
      document.createElement("button");

    boton.type = "button";

    boton.className =
      obtenerClasesBotonModulo(modulo, indice);

    boton.dataset.indice = String(indice);

    boton.innerHTML = `
      <span class="modulo-enlace__numero">
        ${String(indice + 1).padStart(2, "0")}
      </span>

      <span class="modulo-enlace__texto">
        ${modulo.titulo}
      </span>

      <span class="modulo-enlace__estado">
        ${
          estaCompleto(modulo.id)
            ? "✓"
            : "○"
        }
      </span>
    `;

    boton.addEventListener(
      "click",
      () => cambiarModulo(indice)
    );

    elementos.navegacion.appendChild(boton);
  });
}


function obtenerClasesBotonModulo(modulo, indice) {
  const clases = ["modulo-enlace"];

  if (indice === estado.moduloActual) {
    clases.push("activo");
  }

  if (estaCompleto(modulo.id)) {
    clases.push("completo");
  }

  return clases.join(" ");
}


/* =========================================================
   CARGA DE MÓDULOS
========================================================= */


async function cargarModulo(indice) {
  const modulo = MODULOS[indice];

  if (!modulo) return;

  estado.moduloActual = indice;
  guardarEstado();

  actualizarCabeceraModulo(modulo, indice);
  actualizarBotonesNavegacion();
  crearNavegacion();

  elementos.contenedor.innerHTML = `
    <div class="modulo-cargando">
      <span class="cargador"></span>

      <p>
        Cargando módulo...
      </p>
    </div>
  `;

  try {
    const rutaModulo =
  `${window.location.origin}/FALCO-ADMISION-PERICIAL/${modulo.archivo}`;

    console.log(
      "Cargando módulo:",
      rutaModulo
    );

    const respuesta =
      await fetch(rutaModulo, {
        cache: "no-store"
      });

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo cargar ${modulo.archivo}`
      );
    }

    const html =
      await respuesta.text();

    elementos.contenedor.innerHTML =
      html.trim() ||
      generarModuloVacio(modulo);

    restaurarDatosModulo(modulo.id);
    inicializarModulo(modulo.id);
    vincularGuardadoAutomatico(modulo.id);

    window.FalcoValidation
  ?.vincularContenedor(
    elementos.contenedor
  );

  window.FalcoUpload
  ?.vincularContenedor(
    elementos.contenedor

  );


bloquearAdmisionFinalizada();



    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {
    console.error(error);

    elementos.contenedor.innerHTML = `
      <div class="modulo-introduccion">

        <h3>
          No se pudo cargar este módulo
        </h3>

        <p>
          Verificá que exista el archivo
          <strong>${modulo.archivo}</strong>
          y que el proyecto se encuentre abierto
          con Live Server.
        </p>

      </div>
    `;
  }
}


/* =========================================================
   MÓDULO VACÍO
========================================================= */

function generarModuloVacio(modulo) {
  return `
    <div class="modulo-introduccion">

      <h3>
        ${modulo.titulo}
      </h3>

      <p>
        El módulo se encuentra disponible,
        pero todavía no contiene información.
      </p>

    </div>
  `;
}


/* =========================================================
   CABECERA DEL MÓDULO
========================================================= */

function actualizarCabeceraModulo(
  modulo,
  indice
) {
  elementos.numeroModulo.textContent =
    `Módulo ${indice + 1} de ${MODULOS.length}`;

  elementos.tituloModulo.textContent =
    modulo.titulo;

  elementos.descripcionModulo.textContent =
    modulo.descripcion;

  actualizarEstadoModulo();
}


/* =========================================================
   ESTADO DEL MÓDULO
========================================================= */

function actualizarEstadoModulo() {
  const moduloActual =
    MODULOS[estado.moduloActual];

  if (!moduloActual) return;

  const completo =
    estaCompleto(moduloActual.id);

  elementos.estadoModulo.textContent =
    completo
      ? "Completado"
      : "Pendiente";

  elementos.estadoModulo.className =
    completo
      ? "estado-modulo completo"
      : "estado-modulo pendiente";

  elementos.botonCompletar.textContent =
    completo
      ? "Marcar como pendiente"
      : "Marcar como completo";
}


/* =========================================================
   GUARDADO DE CAMPOS
========================================================= */

function vincularGuardadoAutomatico(moduloId) {
  const campos =
    elementos.contenedor.querySelectorAll(
      "input, select, textarea"
    );

  campos.forEach(campo => {
    if (!campo.id && !campo.name) {
      return;
    }

    const evento =
      campo.type === "checkbox" ||
      campo.type === "radio" ||
      campo.tagName === "SELECT"
        ? "change"
        : "input";

    campo.addEventListener(
      evento,
      () => {
        guardarDatosDelModulo(
          moduloId,
          false
        );
      }
    );
  });
}


function guardarDatosDelModulo(
  moduloId,
  mostrarMensaje = false
) {

  if (estado.finalizada) {
    return;
  }

  const campos =
    elementos.contenedor.querySelectorAll(
      "input, select, textarea"
    );

  const datosModulo =
    estado.datos[moduloId] || {};

  campos.forEach(campo => {
    const clave =
      campo.id || campo.name;

    if (!clave) return;

    if (campo.type === "checkbox") {
      datosModulo[clave] =
        campo.checked;

      return;
    }

    if (campo.type === "radio") {
      if (campo.checked) {
        datosModulo[clave] =
          campo.value;
      }

      return;
    }

    if (campo.type === "file") {
      datosModulo[clave] =
        Array.from(campo.files || [])
          .map(archivo => ({
            nombre: archivo.name,
            tipo: archivo.type,
            tamaño: archivo.size
          }));

      return;
    }

    datosModulo[clave] =
      campo.value;
  });

  estado.datos[moduloId] =
    datosModulo;

  guardarEstado(mostrarMensaje);
}


function restaurarDatosModulo(moduloId) {
  const datosModulo =
    estado.datos[moduloId];

  if (!datosModulo) return;

  const campos =
    elementos.contenedor.querySelectorAll(
      "input, select, textarea"
    );

  campos.forEach(campo => {
    const clave =
      campo.id || campo.name;

    if (!clave) return;

    if (!(clave in datosModulo)) {
      return;
    }

    const valor =
      datosModulo[clave];

    if (campo.type === "checkbox") {
      campo.checked =
        Boolean(valor);

      return;
    }

    if (campo.type === "radio") {
      campo.checked =
        campo.value === valor;

      return;
    }

    if (campo.type === "file") {
      return;
    }

    campo.value =
      valor ?? "";
  });
}



/* =========================================================
   INICIALIZACIÓN ESPECÍFICA DE MÓDULOS
========================================================= */

function inicializarModulo(moduloId) {
  switch (moduloId) {

    case "datos-personales":
      inicializarDatosPersonales();
      break;

    case "grupo-familiar":
      inicializarGrupoFamiliar();
      break;

    case "area-afectiva":
      inicializarAreaAfectiva();
      break;

    case "educacion":
      inicializarEducacion();
      break;

    case "historia-laboral":
      inicializarHistoriaLaboral();
      break;

    case "trabajo-actual":
      inicializarTrabajoActual();
      break;

      case "habitos-calidad-vida":
    inicializarHabitosCalidadVida();
    break;

    default:
      break;
  }
}







/* =========================================================
   MÓDULO 01 — DATOS PERSONALES
========================================================= */

function inicializarDatosPersonales() {
  const fechaNacimiento =
    document.getElementById("fechaNacimiento");

  const edad =
    document.getElementById("edad");

  const poseeCud =
    document.getElementById("poseeCud");

  const contenedorDatosCud =
    document.getElementById("contenedorDatosCud");


  function calcularEdad() {
    if (!fechaNacimiento || !edad) return;

    if (!fechaNacimiento.value) {
      edad.value = "";
      return;
    }

    const nacimiento =
      new Date(
        `${fechaNacimiento.value}T00:00:00`
      );

    const hoy = new Date();

    let edadCalculada =
      hoy.getFullYear() -
      nacimiento.getFullYear();

    const diferenciaMes =
      hoy.getMonth() -
      nacimiento.getMonth();

    const todaviaNoCumplio =
      diferenciaMes < 0 ||
      (
        diferenciaMes === 0 &&
        hoy.getDate() <
          nacimiento.getDate()
      );

    if (todaviaNoCumplio) {
      edadCalculada--;
    }

    if (
      Number.isNaN(edadCalculada) ||
      edadCalculada < 0 ||
      edadCalculada > 120
    ) {
      edad.value = "";
      return;
    }

    edad.value =
      String(edadCalculada);

    edad.dispatchEvent(
      new Event("input", {
        bubbles: true
      })
    );
  }

  fechaNacimiento?.addEventListener(
    "change",
    calcularEdad
  );

  calcularEdad();


  function actualizarVisibilidadCud() {
    if (
      !poseeCud ||
      !contenedorDatosCud
    ) {
      return;
    }

    const mostrar =
      poseeCud.value === "Sí" ||
      poseeCud.value === "En trámite";

    contenedorDatosCud.hidden =
      !mostrar;

    contenedorDatosCud
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(campo => {
        campo.disabled = !mostrar;

        if (!mostrar) {
          if (
            campo.type === "checkbox" ||
            campo.type === "radio"
          ) {
            campo.checked = false;
          } else {
            campo.value = "";
          }
        }
      });
  }

  poseeCud?.addEventListener(
    "change",
    actualizarVisibilidadCud
  );

  actualizarVisibilidadCud();
}


/* =========================================================
   MÓDULO — ÁREA AFECTIVA
========================================================= */

function inicializarAreaAfectiva() {
  const tienePareja =
    document.getElementById("tienePareja");

  const datosPareja =
    document.getElementById("datosPareja");

  if (!tienePareja || !datosPareja) {
    return;
  }

  function actualizarPareja() {
    const mostrar =
      tienePareja.value === "Sí";

    datosPareja.hidden =
      !mostrar;

    datosPareja
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(campo => {
        campo.disabled = !mostrar;

        if (!mostrar) {
          if (
            campo.type === "checkbox" ||
            campo.type === "radio"
          ) {
            campo.checked = false;
          } else {
            campo.value = "";
          }
        }
      });
  }

  tienePareja.addEventListener(
    "change",
    actualizarPareja
  );

  actualizarPareja();
}


/* =========================================================
   MÓDULO — EDUCACIÓN
========================================================= */

function inicializarEducacion() {
  const contenedor =
    document.getElementById(
      "contenedorEstudios"
    );

  const template =
    document.getElementById(
      "templateEstudio"
    );

  const botonAgregar =
    document.getElementById(
      "agregarEstudio"
    );

  if (
    !contenedor ||
    !template ||
    !botonAgregar
  ) {
    return;
  }

  function renumerarEstudios() {
    contenedor
      .querySelectorAll(".estudio-card")
      .forEach((tarjeta, indice) => {
        const titulo =
          tarjeta.querySelector("h3");

        if (titulo) {
          titulo.textContent =
            `Estudio ${indice + 1}`;
        }
      });
  }

  function prepararCampos(
    tarjeta,
    indice
  ) {
    tarjeta
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(
        (campo, numeroCampo) => {
          const nombre =
            campo.dataset.campo ||
            `campo${numeroCampo + 1}`;

          campo.id =
            `estudio${indice}_${nombre}`;

          campo.name =
            `estudios[${indice}][${nombre}]`;
        }
      );
  }

  function vincularEliminar(tarjeta) {
    tarjeta
      .querySelector(".btn-eliminar")
      ?.addEventListener(
        "click",
        () => {
          tarjeta.remove();
          renumerarEstudios();

          guardarDatosDelModulo(
            "educacion",
            false
          );
        }
      );
  }

  function agregarEstudio() {
    const fragmento =
      template.content.cloneNode(true);

    const tarjeta =
      fragmento.querySelector(
        ".estudio-card"
      );

    const indice =
      contenedor.children.length + 1;

    prepararCampos(
      tarjeta,
      indice
    );

    vincularEliminar(tarjeta);

    contenedor.appendChild(fragmento);

    renumerarEstudios();

    vincularGuardadoAutomatico(
      "educacion"
    );
  }

  botonAgregar.addEventListener(
    "click",
    agregarEstudio
  );

  contenedor
    .querySelectorAll(".estudio-card")
    .forEach(vincularEliminar);

  renumerarEstudios();
}


/* =========================================================
   MÓDULO — HISTORIA LABORAL
========================================================= */








/* =========================================================
   MÓDULO — TRABAJO ACTUAL
========================================================= */

function inicializarTrabajoActual() {
  const situacion =
    document.getElementById(
      "trabajaActualmente"
    );

  const datosTrabajo =
    document.getElementById(
      "datosTrabajoActual"
    );

  const datosNoTrabaja =
    document.getElementById(
      "datosNoTrabaja"
    );

  if (
    !situacion ||
    !datosTrabajo ||
    !datosNoTrabaja
  ) {
    return;
  }

  function configurarBloque(
    bloque,
    activo
  ) {
    bloque.hidden =
      !activo;

    bloque
      .querySelectorAll(
        "input, select, textarea"
      )
      .forEach(campo => {
        campo.disabled =
          !activo;

        if (!activo) {
          if (
            campo.type === "checkbox" ||
            campo.type === "radio"
          ) {
            campo.checked = false;
          } else {
            campo.value = "";
          }
        }
      });
  }

  function actualizarSituacion() {
    const valor =
      situacion.value;

    const trabaja =
      valor === "Sí" ||
      valor === "Licencia médica";

    const noTrabaja =
      valor === "No" ||
      valor === "Despedido" ||
      valor === "Jubilado" ||
      valor === "Pensionado";

    configurarBloque(
      datosTrabajo,
      trabaja
    );

    configurarBloque(
      datosNoTrabaja,
      noTrabaja
    );
  }

  situacion.addEventListener(
    "change",
    actualizarSituacion
  );

  actualizarSituacion();
}





/* =========================================================
   CAMBIO DE MÓDULOS
========================================================= */

async function cambiarModulo(nuevoIndice) {
  if (
    nuevoIndice < 0 ||
    nuevoIndice >= MODULOS.length
  ) {
    return;
  }

  const moduloActual =
    MODULOS[estado.moduloActual];

  guardarDatosDelModulo(
    moduloActual.id,
    false
  );

  await cargarModulo(nuevoIndice);

  cerrarMenuMovil();
}


function actualizarBotonesNavegacion() {
  elementos.botonAnterior.disabled =
    estado.moduloActual === 0;

  const esUltimo =
    estado.moduloActual ===
    MODULOS.length - 1;

  if (
    estado.finalizada &&
    esUltimo
  ) {
    elementos.botonSiguiente.textContent =
      "Admisión finalizada";

    elementos.botonSiguiente.disabled =
      true;

    return;
  }

  elementos.botonSiguiente.disabled =
    false;

  elementos.botonSiguiente.textContent =
    esUltimo
      ? "Finalizar revisión"
      : "Siguiente →";
}


/* =========================================================
   MÓDULOS COMPLETADOS Y PROGRESO
========================================================= */

function estaCompleto(moduloId) {
  return estado.completados.includes(moduloId);
}






function validarModuloActual() {
  if (
    window.FalcoValidation
  ) {
    const resultado =
      window.FalcoValidation
        .validarContenedor(
          elementos.contenedor
        );

    return {
      valido:
        resultado.valido,

      primerCampoInvalido:
        resultado.primerError
    };
  }

  return {
    valido: true,
    primerCampoInvalido: null
  };

}





function alternarModuloCompleto() {
  const modulo =
    MODULOS[estado.moduloActual];

  guardarDatosDelModulo(
    modulo.id,
    false
  );

  const yaEstaCompleto =
    estaCompleto(modulo.id);

  if (yaEstaCompleto) {
    estado.completados =
      estado.completados.filter(
        id => id !== modulo.id
      );

    guardarEstado();
    actualizarProgreso();
    actualizarEstadoModulo();
    crearNavegacion();

    mostrarNotificacion(
      `${modulo.titulo} marcado como pendiente.`
    );

    return;
  }

  const validacion =
    validarModuloActual();

  if (!validacion.valido) {
    mostrarNotificacion(
      "Complete los campos obligatorios antes de marcar el módulo."
    );

    validacion.primerCampoInvalido?.focus();

    validacion.primerCampoInvalido
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    return;
  }

  estado.completados.push(modulo.id);

  guardarEstado();
  actualizarProgreso();
  actualizarEstadoModulo();
  crearNavegacion();

  mostrarNotificacion(
    `${modulo.titulo} marcado como completo.`
  );
}


function actualizarProgreso() {
  const cantidad =
    estado.completados.length;

  const total =
    MODULOS.length;

  const porcentaje =
    Math.round(
      (cantidad / total) * 100
    );

  elementos.textoProgreso.textContent =
    `${cantidad} de ${total} módulos completados`;

  elementos.porcentajeProgreso.textContent =
    `${porcentaje}%`;

  elementos.barraProgreso.style.width =
    `${porcentaje}%`;

  elementos.progresoAccesible.setAttribute(
    "aria-valuenow",
    String(porcentaje)
  );
}


/* =========================================================
   EVENTOS
========================================================= */

function vincularEventos() {
  elementos.botonAnterior.addEventListener(
    "click",
    () => {
      cambiarModulo(
        estado.moduloActual - 1
      );
    }
  );

  elementos.botonSiguiente.addEventListener(
    "click",
    () => {
      const esUltimo =
        estado.moduloActual ===
        MODULOS.length - 1;

      if (esUltimo) {
        guardarDatosDelModulo(
          MODULOS[estado.moduloActual].id,
          true
        );

        mostrarResumenFinal();

        return;
      }

      cambiarModulo(
        estado.moduloActual + 1
      );
    }
  );

  elementos.botonGuardar.addEventListener(
    "click",
    () => {
      guardarDatosDelModulo(
        MODULOS[estado.moduloActual].id,
        true
      );
    }
  );

  elementos.botonCompletar.addEventListener(
    "click",
    alternarModuloCompleto
  );

  elementos.botonReiniciar.addEventListener(
    "click",
    abrirModalReinicio
  );

  elementos.botonCancelarReinicio.addEventListener(
    "click",
    cerrarModalReinicio
  );

  elementos.botonConfirmarReinicio.addEventListener(
    "click",
    reiniciarAdmision
  );

  elementos.botonMenuMovil.addEventListener(
    "click",
    alternarMenuMovil
  );

  elementos.modalReinicio
    .querySelector(".modal__fondo")
    .addEventListener(
      "click",
      cerrarModalReinicio
    );

  document.addEventListener(
    "keydown",
    evento => {
      if (evento.key === "Escape") {
        cerrarModalReinicio();
      }
    }
  );
}









/* =========================================================
   FINALIZACIÓN DE LA ADMISIÓN
========================================================= */

async function mostrarResumenFinal() {
  const completados =
    estado.completados.length;

  if (completados !== MODULOS.length) {
    const pendientes =
      MODULOS.length - completados;

    mostrarNotificacion(
      `La información fue guardada. Quedan ${pendientes} módulos pendientes.`
    );

    return;
  }

  if (estado.finalizada) {
    mostrarNotificacion(
      "La admisión ya se encuentra finalizada."
    );

    bloquearAdmisionFinalizada();

    return;
  }

  if (
    !window.FalcoFirebaseAdmision ||
    typeof window.FalcoFirebaseAdmision.finalizar !==
      "function"
  ) {
    mostrarNotificacion(
      "No se pudo conectar con Firebase."
    );

    return;
  }

  const confirmar = window.confirm(
    "¿Confirma que desea finalizar la admisión?\n\n" +
    "Una vez enviada, la información quedará disponible para consulta y no podrá modificarse."
  );

  if (!confirmar) {
    return;
  }

  try {
    elementos.botonSiguiente.disabled =
      true;

    elementos.botonSiguiente.textContent =
      "Finalizando...";

    await window.FalcoFirebaseAdmision
      .finalizar(estado);

    estado.finalizada = true;

    estado.finalizadaEn =
      new Date().toISOString();

    estado.ultimaActualizacion =
      estado.finalizadaEn;

   if (window.FalcoStorage) {
  window.FalcoStorage.guardar(
    CLAVE_STORAGE,
    estado
  );
} else {
  localStorage.setItem(
    CLAVE_STORAGE,
    JSON.stringify(estado)
  );
}

    bloquearAdmisionFinalizada();

    mostrarNotificacion(
      "Admisión finalizada y enviada correctamente."
    );

  } catch (error) {
    console.error(
      "No se pudo finalizar la admisión:",
      error
    );

    elementos.botonSiguiente.disabled =
      false;

    elementos.botonSiguiente.textContent =
      "Finalizar revisión";

    mostrarNotificacion(
      "No se pudo finalizar la admisión. Intentá nuevamente."
    );
  }
}


/* =========================================================
   BLOQUEAR ADMISIÓN FINALIZADA
========================================================= */

function bloquearAdmisionFinalizada() {
  if (!estado.finalizada) {
    return;
  }

  elementos.contenedor
    .querySelectorAll(
      "input, select, textarea, button"
    )
    .forEach(elemento => {
      elemento.disabled = true;
    });

  elementos.botonGuardar.disabled =
    true;

  elementos.botonCompletar.disabled =
    true;

  elementos.botonReiniciar.disabled =
    true;

  elementos.estadoModulo.textContent =
    "Admisión finalizada";

  elementos.estadoModulo.className =
    "estado-modulo completo";

  const esUltimoModulo =
    estado.moduloActual ===
    MODULOS.length - 1;

  if (esUltimoModulo) {
    elementos.botonSiguiente.disabled =
      true;

    elementos.botonSiguiente.textContent =
      "Admisión finalizada";
  }
}





/* =========================================================
   MENÚ MÓVIL
========================================================= */

function alternarMenuMovil() {
  const abierto =
    elementos.navegacion.classList.toggle(
      "abierta"
    );

  elementos.botonMenuMovil.setAttribute(
    "aria-expanded",
    String(abierto)
  );
}


function cerrarMenuMovil() {
  elementos.navegacion.classList.remove(
    "abierta"
  );

  elementos.botonMenuMovil.setAttribute(
    "aria-expanded",
    "false"
  );
}


/* =========================================================
   MODAL DE REINICIO
========================================================= */

function abrirModalReinicio() {
  elementos.modalReinicio.classList.add(
    "abierto"
  );

  elementos.modalReinicio.setAttribute(
    "aria-hidden",
    "false"
  );
}


function cerrarModalReinicio() {
  elementos.modalReinicio.classList.remove(
    "abierto"
  );

  elementos.modalReinicio.setAttribute(
    "aria-hidden",
    "true"
  );
}


async function reiniciarAdmision() {
  if (window.FalcoStorage) {
  window.FalcoStorage.eliminar(
    CLAVE_STORAGE
  );
} else {
  localStorage.removeItem(
    CLAVE_STORAGE
  );
}

  estado =
    structuredClone(estadoInicial);

  cerrarModalReinicio();

  crearNavegacion();
  actualizarProgreso();
  actualizarEstadoGuardado();

  await cargarModulo(0);

  mostrarNotificacion(
    "La admisión fue reiniciada."
  );
}


/* =========================================================
   NOTIFICACIONES
========================================================= */

let temporizadorNotificacion = null;

function mostrarNotificacion(mensaje) {
  clearTimeout(temporizadorNotificacion);

  elementos.notificacion.textContent =
    mensaje;

  elementos.notificacion.classList.add(
    "visible"
  );

  temporizadorNotificacion =
    setTimeout(() => {
      elementos.notificacion.classList.remove(
        "visible"
      );
    }, 3200);
}


/* =========================================================
   API TEMPORAL PARA PRUEBAS
========================================================= */

window.FalcoAdmision = {
  obtenerEstado() {
    return structuredClone(estado);
  },

  obtenerDatos() {
    return structuredClone(estado.datos);
  },

  guardar() {
    guardarDatosDelModulo(
      MODULOS[estado.moduloActual].id,
      true
    );
  },

  reiniciar() {
    abrirModalReinicio();
  }
};




/* =========================================================
   HERRAMIENTAS DE DESARROLLO
   SOLO PARA PRUEBAS
========================================================= */

window.FalcoAdmisionDev = {

  async cargarDemo() {
    const ahora =
      new Date().toISOString();

    estado = {
      ...structuredClone(estadoInicial),

      moduloActual: 0,

      completados:
        MODULOS.map(
          modulo => modulo.id
        ),

      ultimaActualizacion:
        ahora,

      finalizada: false,

      finalizadaEn: null,

      datos: {
        "datos-personales": {
          nombre:
            "Juan Carlos Pérez",
          dni:
            "30123456",
          cuil:
            "20-30123456-7",
          fechaNacimiento:
            "1984-05-18",
          edad:
            "42",
          lugarNacimiento:
            "Buenos Aires",
          nacionalidad:
            "Argentina",
          estadoCivil:
            "Casado/a",
          ocupacion:
            "Empleado administrativo",
          domicilio:
            "Av. Siempre Viva 123",
          localidad:
            "Ramos Mejía",
          partido:
            "La Matanza",
          provincia:
            "Buenos Aires",
          codigoPostal:
            "1704",
          telefono:
            "1123456789",
          email:
            "juan.perez.prueba@example.com",
          poseeCud:
            "No",
          idioma:
            "Español",
          leerEscribir:
            "Sí",
          comprensionIdioma:
            "Sí"
        },

        "datos-judiciales": {
          caratula:
            "Pérez Juan Carlos c/ Empresa Demo S.A. s/ daños y perjuicios",
          expediente:
            "LM-12345-2026",
          tribunal:
            "Juzgado Civil y Comercial N.º 1",
          departamentoJudicial:
            "La Matanza",
          fuero:
            "Civil",
          actor:
            "Juan Carlos Pérez",
          demandado:
            "Empresa Demo S.A.",
          tipoReclamo:
            "Daños y perjuicios",
          fechaHechoJudicial:
            "2025-03-10",
          nombreAbogado:
            "Dra. Ana López",
          telefonoAbogado:
            "1144445555",
          emailAbogado:
            "ana.lopez@example.com"
        },

        "relato-hecho": {
          relatoCronologico:
            "El día 10 de marzo de 2025, mientras circulaba hacia su trabajo, sufrió un accidente de tránsito. Fue trasladado a una guardia médica y posteriormente realizó tratamiento.",
          consecuenciasInmediatas:
            "Dolor físico, temor y dificultades para continuar con sus actividades habituales.",
          intervencionesPosteriores:
            "Consultas médicas, estudios y tratamiento de rehabilitación."
        },

        "grupo-familiar": {
          nombrePadre:
            "Carlos Pérez",
          padreVive:
            "Sí",
          edadPadre:
            "70",
          ocupacionPadre:
            "Jubilado",
          nombreMadre:
            "Marta Gómez",
          madreVive:
            "Sí",
          edadMadre:
            "68",
          ocupacionMadre:
            "Ama de casa",
          tieneHermanos:
            "Sí",
          cantidadHermanos:
            "1",
          tieneHijos:
            "Sí",
          cantidadHijos:
            "2",
          personasConvivientes:
            "Convive con su esposa y sus dos hijos.",
          descripcionConvivencia:
            "La convivencia es buena y estable."
        },

        "area-afectiva": {
          estadoCivil:
            "Casado/a",
          tienePareja:
            "Sí",
          nombrePareja:
            "Laura Fernández",
          edadPareja:
            "40",
          ocupacionPareja:
            "Docente",
          tiempoRelacion:
            "15 años",
          conviven:
            "Sí",
          hijosComun:
            "Sí"
        },

        "area-social": {
          tieneAmigos:
            "Sí",
          frecuenciaAmigos:
            "Semanal",
          redApoyo:
            "Familia y amigos cercanos",
          personasApoyo:
            "Esposa, hermanos y amigos",
          vidaSocialAntes:
            "Activa",
          vidaSocialActual:
            "Disminuida",
          cambioVidaSocial:
            "Sí",
          descripcionCambiosSociales:
            "Redujo salidas y reuniones desde el hecho.",
          actividadesRecreativasAntes:
            "Fútbol y reuniones familiares",
          actividadesActualesRecreativas:
            "Caminatas ocasionales",
          impactoRecreacion:
            "Moderado"
        },

        "educacion": {
          nivelEducativo:
            "Secundario completo",
          institucion:
            "Escuela Secundaria N.º 10",
          titulo:
            "Bachiller",
          cursos:
            "Curso de administración básica"
        },

        "historia-laboral": {
          "trabajo_1_empresa":
            "Empresa Demo S.A.",
          "trabajo_1_puesto":
            "Administrativo",
          "trabajo_1_desde":
            "2010-01",
          "trabajo_1_hasta":
            "2020-12",
          "trabajo_1_tareas":
            "Atención administrativa y carga de datos.",
          "trabajo_1_motivoEgreso":
            "Cambio de empleo",
          trabajaActualmente:
            "Sí"
        },

        "trabajo-actual": {
          trabajaActualmente:
            "Sí",
          empresaActual:
            "Servicios del Oeste S.R.L.",
          puestoActual:
            "Administrativo",
          antiguedadActual:
            "5 años",
          tareasActuales:
            "Atención al público y tareas administrativas.",
          horarioActual:
            "Lunes a viernes de 9 a 17",
          impactoLaboral:
            "Refiere cansancio y menor concentración."
        },

        "tratamientos": {
          enTratamiento:
            "Sí",
          tipoTratamiento:
            "Psicológico",
          desdeCuando:
            "2025-04-01",
          profesional:
            "Lic. María García",
          frecuencia:
            "Semanal",
          medicacion:
            "No",
          observacionesTratamiento:
            "Continúa actualmente."
        },

        "antecedentes-salud": {
          enfermedadActual:
            "No",
          cirugias:
            "No",
          internaciones:
            "No",
          tratamientoPrevio:
            "No",
          psiquiatricoPrevio:
            "No",
          alcohol:
            "Ocasional",
          tabaco:
            "No",
          otrasSustancias:
            "No",
          otrosJuicios:
            "No",
          procesosActuales:
            "No"
        },

        "habitos-calidad-vida": {
          calidadVida:
            "6",
          explicacionCalidadVida:
            "Considera que su calidad de vida disminuyó desde el hecho.",
          sueño:
            "Regular",
          alimentacion:
            "Adecuada",
          actividadFisica:
            "Escasa",
          autonomia:
            "Conservada"
        },

        "impacto-actual": {
          impactoEmocional:
            "Ansiedad y preocupación",
          impactoFamiliar:
            "Mayor dependencia de su familia",
          impactoSocial:
            "Menor participación social",
          impactoLaboral:
            "Dificultades de concentración",
          impactoEconomico:
            "Gastos médicos y de tratamiento",
          cambiosActuales:
            "Refiere cambios en su rutina y estado de ánimo."
        },

        "documentacion": {
          observacionesDocumentacion:
            "Documentación de prueba pendiente de adjuntar."
        },

        "observaciones-finales": {
          observacionesFinales:
            "Ficha cargada automáticamente para pruebas del sistema."
        },

        "consentimiento": {
          aceptaConsentimiento:
            true,
          declaraVeracidad:
            true,
          autorizaTratamientoDatos:
            true,
          nombreConfirmacion:
            "Juan Carlos Pérez",
          fechaConsentimiento:
            ahora.slice(0, 10)
        }
      }
    };

    guardarEstado(false);

    crearNavegacion();
    actualizarProgreso();
    actualizarEstadoGuardado();

    await cargarModulo(0);

    mostrarNotificacion(
      "Datos de prueba cargados correctamente."
    );

    console.log(
      "FALCO® Admisión demo cargada.",
      structuredClone(estado)
    );

    return structuredClone(estado);
  },


  async limpiarDemo() {
    estado =
      structuredClone(estadoInicial);

    if (window.FalcoStorage) {
      window.FalcoStorage.eliminar(
        CLAVE_STORAGE
      );
    } else {
      localStorage.removeItem(
        CLAVE_STORAGE
      );
    }

    crearNavegacion();
    actualizarProgreso();
    actualizarEstadoGuardado();

    await cargarModulo(0);

    mostrarNotificacion(
      "Datos locales de prueba eliminados."
    );

    return true;
  }
};







console.log(
  "Sistema de Admisión Pericial FALCO® — Sprint 1 Ready"
);

