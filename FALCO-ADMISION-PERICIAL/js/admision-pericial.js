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
  ultimaActualizacion: null
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
   INICIALIZACIÓN
========================================================= */

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

async function iniciarAplicacion() {
  crearNavegacion();
  vincularEventos();
  actualizarProgreso();
  actualizarEstadoGuardado();

  await cargarModulo(estado.moduloActual);
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

  if (window.FalcoStorage) {
    const resultado =
      window.FalcoStorage.guardar(
        CLAVE_STORAGE,
        estado
      );

    if (!resultado.ok) {
      console.error(
        "No se pudo guardar el estado de la admisión.",
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

  actualizarEstadoGuardado();

  if (mostrarMensaje) {
    mostrarNotificacion(
      "Avance guardado correctamente."
    );
  }
}





function actualizarEstadoGuardado() {
  if (!estado.ultimaActualizacion) {
    elementos.estadoGuardado.textContent =
      "Guardado automático habilitado";

    return;
  }

  const fecha =
    new Date(estado.ultimaActualizacion);

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
   REVISIÓN FINAL
========================================================= */

function mostrarResumenFinal() {
  const completados =
    estado.completados.length;

  if (completados === MODULOS.length) {
    mostrarNotificacion(
      "Admisión completada. Todos los módulos fueron revisados."
    );

    return;
  }

  const pendientes =
    MODULOS.length - completados;

  mostrarNotificacion(
    `La información fue guardada. Quedan ${pendientes} módulos pendientes.`
  );
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


console.log(
  "Sistema de Admisión Pericial FALCO® — Sprint 1 Ready"
);


