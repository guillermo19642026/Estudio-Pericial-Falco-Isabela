/* =========================================================
   FALCO® CAMPUS
   FORMULARIO DE SOLICITUD DE REUNIÓN
========================================================= */

const formFalcoCampus =
  document.getElementById("formFalcoCampus");

const mensajeFormulario =
  document.getElementById("mensajeFormulario");

const btnEnviarSolicitud =
  document.getElementById("btnEnviarSolicitud");

const WHATSAPP_FALCO =
  "5491132049521";


/* =========================================================
   UTILIDADES
========================================================= */

function limpiarTexto(valor) {
  return String(valor || "")
    .trim();
}


function obtenerValor(id) {
  return limpiarTexto(
    document.getElementById(id)?.value
  );
}


function obtenerMaterialesSeleccionados() {
  return [
    ...document.querySelectorAll(
      'input[name="materiales"]:checked'
    )
  ].map((campo) => campo.value);
}


function formatearMaterial(valor) {
  const etiquetas = {
    videos: "Videos grabados",
    presentaciones: "Presentaciones",
    documentos: "Documentos o PDF",
    actividades: "Actividades o ejercicios",
    evaluaciones: "Evaluaciones",
    certificado: "Modelo de certificado"
  };

  return etiquetas[valor] || valor;
}


function formatearTipoPropuesta(valor) {
  const etiquetas = {
    curso: "Curso",
    programa: "Programa de formación",
    taller: "Taller",
    diplomatura: "Diplomatura",
    capacitacion: "Capacitación institucional",
    otro: "Otra propuesta"
  };

  return etiquetas[valor] || valor;
}


function formatearEstadoContenido(valor) {
  const etiquetas = {
    completo:
      "Completamente preparado",

    avanzado:
      "Avanzado, con algunos materiales pendientes",

    inicial:
      "En etapa inicial"
  };

  return etiquetas[valor] || valor;
}


function formatearCantidadAlumnos(valor) {
  const etiquetas = {
    "hasta-25": "Hasta 25 alumnos",
    "26-50": "Entre 26 y 50 alumnos",
    "51-100": "Entre 51 y 100 alumnos",
    "101-250": "Entre 101 y 250 alumnos",
    "mas-250": "Más de 250 alumnos"
  };

  return etiquetas[valor] || valor;
}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(texto, tipo = "info") {
  if (!mensajeFormulario) {
    return;
  }

  mensajeFormulario.hidden = false;
  mensajeFormulario.className =
    `fcc-message is-${tipo}`;

  mensajeFormulario.textContent =
    texto;
}


function ocultarMensaje() {
  if (!mensajeFormulario) {
    return;
  }

  mensajeFormulario.hidden = true;
  mensajeFormulario.className =
    "fcc-message";

  mensajeFormulario.textContent = "";
}


/* =========================================================
   VALIDACIÓN
========================================================= */

function limpiarErrores() {
  document
    .querySelectorAll(".fcc-field.is-invalid")
    .forEach((campo) => {
      campo.classList.remove("is-invalid");
    });

  document
    .querySelectorAll(".fcc-error-text")
    .forEach((error) => {
      error.remove();
    });
}


function marcarCampoInvalido(campo, mensaje) {
  if (!campo) {
    return;
  }

  const contenedor =
    campo.closest(".fcc-field");

  if (!contenedor) {
    return;
  }

  contenedor.classList.add("is-invalid");

  const error =
    document.createElement("small");

  error.className =
    "fcc-error-text";

  error.textContent =
    mensaje;

  contenedor.appendChild(error);
}


function validarFormulario() {
  limpiarErrores();
  ocultarMensaje();

  const camposObligatorios = [
    {
      id: "nombre",
      mensaje:
        "Ingrese su nombre y apellido."
    },
    {
      id: "profesion",
      mensaje:
        "Ingrese su profesión o actividad."
    },
    {
      id: "email",
      mensaje:
        "Ingrese un correo electrónico válido."
    },
    {
      id: "telefono",
      mensaje:
        "Ingrese un número de WhatsApp."
    },
    {
      id: "tituloCurso",
      mensaje:
        "Ingrese el nombre del curso o programa."
    },
    {
      id: "tipoPropuesta",
      mensaje:
        "Seleccione el tipo de propuesta."
    },
    {
      id: "cantidadModulos",
      mensaje:
        "Indique la cantidad aproximada de módulos."
    },
    {
      id: "descripcionCurso",
      mensaje:
        "Incluya una descripción breve del curso."
    },
    {
      id: "estadoContenido",
      mensaje:
        "Seleccione el estado general del contenido."
    },
    {
      id: "cantidadAlumnos",
      mensaje:
        "Seleccione la cantidad estimada de alumnos."
    },
    {
      id: "necesidades",
      mensaje:
        "Indique qué necesita de FALCO® Campus."
    }
  ];

  let valido = true;
  let primerCampoInvalido = null;

  camposObligatorios.forEach(
    ({ id, mensaje }) => {
      const campo =
        document.getElementById(id);

      if (!campo) {
        return;
      }

      const valor =
        limpiarTexto(campo.value);

      if (!valor || !campo.checkValidity()) {
        valido = false;

        marcarCampoInvalido(
          campo,
          mensaje
        );

        if (!primerCampoInvalido) {
          primerCampoInvalido = campo;
        }
      }
    }
  );

  if (!valido) {
    mostrarMensaje(
      "Revise los campos señalados antes de continuar.",
      "error"
    );

    primerCampoInvalido?.focus();
  }

  return valido;
}


/* =========================================================
   CONSTRUCCIÓN DEL MENSAJE
========================================================= */

function construirMensajeWhatsApp() {
  const nombre =
    obtenerValor("nombre");

  const profesion =
    obtenerValor("profesion");

  const email =
    obtenerValor("email");

  const telefono =
    obtenerValor("telefono");

  const institucion =
    obtenerValor("institucion");

  const tituloCurso =
    obtenerValor("tituloCurso");

  const tipoPropuesta =
    obtenerValor("tipoPropuesta");

  const cantidadModulos =
    obtenerValor("cantidadModulos");

  const descripcionCurso =
    obtenerValor("descripcionCurso");

  const materiales =
    obtenerMaterialesSeleccionados();

  const estadoContenido =
    obtenerValor("estadoContenido");

  const cantidadAlumnos =
    obtenerValor("cantidadAlumnos");

  const fechaInicio =
    obtenerValor("fechaInicio");

  const necesidades =
    obtenerValor("necesidades");


  const lineas = [
    "Hola. Quisiera solicitar una reunión por FALCO® Campus.",
    "",
    "DATOS PROFESIONALES",
    `Nombre: ${nombre}`,
    `Profesión o actividad: ${profesion}`,
    `Correo: ${email}`,
    `WhatsApp: ${telefono}`,
    `Institución o marca: ${institucion || "No informada"}`,
    "",
    "CURSO O PROGRAMA",
    `Nombre: ${tituloCurso}`,
    `Tipo: ${formatearTipoPropuesta(tipoPropuesta)}`,
    `Cantidad aproximada de módulos: ${cantidadModulos}`,
    `Descripción: ${descripcionCurso}`,
    "",
    "MATERIALES",
    materiales.length
      ? materiales
          .map(formatearMaterial)
          .join(", ")
      : "No informados",
    "",
    "ESTADO Y ALCANCE",
    `Estado del contenido: ${formatearEstadoContenido(estadoContenido)}`,
    `Cantidad estimada de alumnos: ${formatearCantidadAlumnos(cantidadAlumnos)}`,
    `Fecha estimada de inicio: ${fechaInicio || "No informada"}`,
    "",
    "NECESIDADES",
    necesidades
  ];

  return lineas.join("\n");
}


/* =========================================================
   ENVÍO
========================================================= */

async function enviarSolicitud(evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  const textoOriginal =
    btnEnviarSolicitud?.innerHTML ||
    "Enviar solicitud";

  if (btnEnviarSolicitud) {
    btnEnviarSolicitud.disabled = true;
    btnEnviarSolicitud.textContent =
      "Preparando solicitud...";
  }

  mostrarMensaje(
    "Preparando la presentación para enviarla por WhatsApp.",
    "info"
  );

  try {
    const mensaje =
      construirMensajeWhatsApp();

    const enlace =
      `https://wa.me/${WHATSAPP_FALCO}?text=${encodeURIComponent(mensaje)}`;

    window.open(
      enlace,
      "_blank",
      "noopener,noreferrer"
    );

    mostrarMensaje(
      "La solicitud fue preparada correctamente. Complete el envío desde WhatsApp.",
      "success"
    );

  } catch (error) {
    console.error(
      "FALCO® Campus: error al preparar la solicitud.",
      error
    );

    mostrarMensaje(
      "No fue posible preparar la solicitud. Intente nuevamente.",
      "error"
    );

  } finally {
    if (btnEnviarSolicitud) {
      btnEnviarSolicitud.disabled = false;
      btnEnviarSolicitud.innerHTML =
        textoOriginal;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}


/* =========================================================
   LIMPIAR ERROR AL EDITAR
========================================================= */

formFalcoCampus
  ?.querySelectorAll(
    "input, select, textarea"
  )
  .forEach((campo) => {
    campo.addEventListener(
      "input",
      () => {
        const contenedor =
          campo.closest(".fcc-field");

        contenedor?.classList.remove(
          "is-invalid"
        );

        contenedor
          ?.querySelector(
            ".fcc-error-text"
          )
          ?.remove();
      }
    );

    campo.addEventListener(
      "change",
      () => {
        const contenedor =
          campo.closest(".fcc-field");

        contenedor?.classList.remove(
          "is-invalid"
        );

        contenedor
          ?.querySelector(
            ".fcc-error-text"
          )
          ?.remove();
      }
    );
  });


/* =========================================================
   EVENTO PRINCIPAL
========================================================= */

formFalcoCampus?.addEventListener(
  "submit",
  enviarSolicitud
);


/* =========================================================
   ICONOS
========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
);