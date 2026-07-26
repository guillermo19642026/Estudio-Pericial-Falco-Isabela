/* =========================================================
   ENCUENTRO V2
   Escuela para Padres FALCO®
   Carga inicial sin Firebase
========================================================= */

import {
  encuentros
} from "./escuela-data.js";

import EscuelaProgressEngine
  from "./escuela-progress-engine.js";

  window.EscuelaProgressEngine =
  EscuelaProgressEngine;

import {
  auth
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  onAuthStateChanged(
    auth,
    async (user) => {

      if (!user) {

        console.warn(
          "Escuela Progress Engine™: usuario no autenticado"
        );

        return;
      }

      await EscuelaProgressEngine.cargar(
        user.uid
      );


      if (
  EscuelaProgressEngine.estaCompletado(
    encuentroId
  )
) {

  estado.textContent =
    "Completado";

  estado.classList.remove(
    "disponible",
    "bloqueado"
  );

  estado.classList.add(
    "completado"
  );

  actualizarProgreso(100);

  btnFinalizar.textContent =
    "Encuentro completado";

  btnFinalizar.disabled =
    true;

}

      console.log(
        "Escuela Progress Engine™: usuario cargado en el encuentro",
        EscuelaProgressEngine.getState()
      );

    }
  );


  /* =======================================================
     DATOS DE LOS ENCUENTROS
  ======================================================== */

  const encuentrosLocal = {

    1: {
      numero: 1,
      titulo: "Comprender la adolescencia",
      descripcion:
        "Una introducción a los cambios físicos, emocionales, psicológicos y vinculares propios de la adolescencia.",

      estado: "Disponible",

      videoTitulo: "Comprender la adolescencia",
      videoDescripcion:
        "Clase principal sobre los procesos de cambio propios de la adolescencia.",

      objetivos: [
        "Comprender los principales cambios físicos, emocionales y psicológicos de la adolescencia.",
        "Reconocer las transformaciones vinculares propias de esta etapa.",
        "Reflexionar sobre el acompañamiento adulto durante el crecimiento adolescente."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 1",
      actividadDescripcion:
        "Una propuesta de reflexión para reconocer cambios, necesidades y formas de acompañamiento durante la adolescencia.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    2: {
      numero: 2,
      titulo: "Comunicación y escucha",
      descripcion:
        "Herramientas para mejorar el diálogo, la comprensión y la escucha dentro de los vínculos familiares.",

      estado: "Disponible",

      videoTitulo: "Comunicación y escucha familiar",
      videoDescripcion:
        "Clase orientada al desarrollo de una comunicación más clara, empática y respetuosa.",

      objetivos: [
        "Reconocer obstáculos frecuentes en la comunicación familiar.",
        "Desarrollar recursos de escucha activa.",
        "Favorecer formas de diálogo más respetuosas y constructivas."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 2",
      actividadDescripcion:
        "Ejercicio de observación y reflexión sobre las formas de comunicación utilizadas en el entorno familiar.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    3: {
      numero: 3,
      titulo: "Límites y acompañamiento",
      descripcion:
        "El valor de los límites como forma de cuidado, orientación y construcción de seguridad emocional.",

      estado: "Disponible",

      videoTitulo: "Límites que acompañan",
      videoDescripcion:
        "Clase sobre la construcción de límites claros, sostenidos y adecuados a cada etapa.",

      objetivos: [
        "Comprender la función protectora de los límites.",
        "Diferenciar límites de castigos o sanciones arbitrarias.",
        "Construir acuerdos familiares claros y sostenibles."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 3",
      actividadDescripcion:
        "Propuesta para revisar límites, acuerdos y dificultades presentes en la dinámica familiar.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    4: {
      numero: 4,
      titulo: "Emociones y regulación",
      descripcion:
        "Comprender las emociones y acompañar su expresión de manera saludable dentro de la familia.",

      estado: "Disponible",

      videoTitulo: "Emociones y regulación emocional",
      videoDescripcion:
        "Clase centrada en la identificación, expresión y regulación de las emociones.",

      objetivos: [
        "Reconocer las emociones como parte del desarrollo.",
        "Acompañar la expresión emocional sin minimizarla.",
        "Incorporar herramientas sencillas de regulación emocional."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 4",
      actividadDescripcion:
        "Ejercicio para identificar emociones frecuentes y formas posibles de acompañarlas.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    5: {
      numero: 5,
      titulo: "Conflictos familiares",
      descripcion:
        "Herramientas para comprender los conflictos y abordarlos sin deteriorar los vínculos.",

      estado: "Disponible",

      videoTitulo: "Comprender y abordar los conflictos",
      videoDescripcion:
        "Clase sobre el origen de los conflictos familiares y formas de intervención más saludables.",

      objetivos: [
        "Identificar factores que intensifican los conflictos.",
        "Diferenciar el problema de la persona.",
        "Construir alternativas de resolución más respetuosas."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 5",
      actividadDescripcion:
        "Análisis de una situación cotidiana de conflicto y búsqueda de respuestas alternativas.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    6: {
      numero: 6,
      titulo: "Autonomía y responsabilidad",
      descripcion:
        "Cómo acompañar el crecimiento progresivo hacia una mayor autonomía y responsabilidad.",

      estado: "Disponible",

      videoTitulo: "Autonomía y responsabilidad",
      videoDescripcion:
        "Clase sobre el acompañamiento gradual del desarrollo de capacidades y decisiones propias.",

      objetivos: [
        "Comprender la autonomía como un proceso progresivo.",
        "Favorecer responsabilidades acordes a cada etapa.",
        "Acompañar sin sobreproteger ni abandonar."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 6",
      actividadDescripcion:
        "Propuesta para revisar responsabilidades, permisos y niveles de autonomía presentes en la familia.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    7: {
      numero: 7,
      titulo: "Tecnología y vida digital",
      descripcion:
        "Orientaciones para acompañar el uso de pantallas, redes sociales y espacios digitales.",

      estado: "Disponible",

      videoTitulo: "Tecnología y acompañamiento familiar",
      videoDescripcion:
        "Clase sobre hábitos digitales, prevención de riesgos y construcción de acuerdos familiares.",

      objetivos: [
        "Comprender el lugar de la tecnología en la vida cotidiana.",
        "Reconocer riesgos y oportunidades de los entornos digitales.",
        "Construir acuerdos de uso claros y realistas."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 7",
      actividadDescripcion:
        "Revisión de hábitos tecnológicos y elaboración de posibles acuerdos familiares.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    },

    8: {
      numero: 8,
      titulo: "Integración y cierre",
      descripcion:
        "Recorrido final para integrar los contenidos trabajados y fortalecer los recursos familiares.",

      estado: "Disponible",

      videoTitulo: "Integración final",
      videoDescripcion:
        "Clase de cierre destinada a recuperar aprendizajes, herramientas y reflexiones del recorrido.",

      objetivos: [
        "Integrar los contenidos desarrollados durante el programa.",
        "Reconocer recursos y fortalezas familiares.",
        "Definir compromisos posibles para continuar el proceso."
      ],

      actividadTitulo: "Actividad práctica del Encuentro 8",
      actividadDescripcion:
        "Actividad final de integración, evaluación personal y proyección de próximos pasos.",

      videoUrl: "#",
      cuadernilloUrl: "#",
      actividadUrl: "#",
      presentacionUrl: "#",
      recursosUrl: "#",
      consultaUrl: "#"
    }

  };


  /* =======================================================
     ELEMENTOS DEL HTML
  ======================================================== */

  const loader = document.getElementById("encuentroLoader");
  const error = document.getElementById("encuentroError");
  const errorMensaje = document.getElementById("encuentroErrorMensaje");

  const numero = document.getElementById("encuentroNumero");
  const estado = document.getElementById("encuentroEstado");
  const titulo = document.getElementById("encuentroTitulo");
  const descripcion = document.getElementById("encuentroDescripcion");

  const videoTitulo = document.getElementById("encuentroVideoTitulo");
  const videoDescripcion = document.getElementById(
    "encuentroVideoDescripcion"
  );

  const objetivosLista = document.getElementById(
    "encuentroObjetivosLista"
  );

  const actividadTitulo = document.getElementById(
    "encuentroActividadTitulo"
  );

  const actividadDescripcion = document.getElementById(
    "encuentroActividadDescripcion"
  );

  const enlaceCuadernillo = document.getElementById(
    "enlaceCuadernillo"
  );

  const enlacePresentacion = document.getElementById(
    "enlacePresentacion"
  );

  const enlaceRecursos = document.getElementById(
    "enlaceRecursos"
  );

  const enlaceActividad = document.getElementById(
    "enlaceActividad"
  );

  const enlaceConsulta = document.getElementById(
    "enlaceConsulta"
  );


  /* =======================================================
     OBTENER ID DESDE LA URL
  ======================================================== */

  const parametros = new URLSearchParams(window.location.search);

  const encuentroId = Number(
    parametros.get("id")
  );


  /* =======================================================
     VALIDACIÓN
  ======================================================== */

  if (
    !encuentroId ||
    !encuentros[encuentroId]
  ) {

    mostrarError(
      "El encuentro solicitado no existe o el enlace no es válido."
    );

    return;
  }


  /* =======================================================
     CARGAR DATOS
  ======================================================== */

  const encuentro = encuentros[encuentroId];

const estadoActual =
  encuentro.estado || "Disponible";

numero.textContent =
  `Encuentro ${encuentroId} de 8`;

estado.textContent =
  estadoActual;

estado.classList.remove(
  "completado",
  "disponible",
  "bloqueado"
);

estado.classList.add(
  estadoActual.toLowerCase()
);

  titulo.textContent =
    encuentro.titulo;

  descripcion.textContent =
    encuentro.descripcion;

videoTitulo.textContent =
  encuentro.videoTitulo ||
  encuentro.titulo;

videoDescripcion.textContent =
  encuentro.videoDescripcion ||
  "Clase principal correspondiente a este encuentro de la Escuela para Padres FALCO®.";

actividadTitulo.textContent =
  encuentro.actividadTitulo ||
  `Actividad práctica del Encuentro ${encuentroId}`;

actividadDescripcion.textContent =
  encuentro.actividadDescripcion ||
  "Propuesta práctica destinada a reflexionar e integrar los contenidos desarrollados durante el encuentro.";

objetivosLista.innerHTML = "";

const objetivos =
  encuentro.objetivos || [
    "Comprender los contenidos principales del encuentro.",
    "Reflexionar sobre su aplicación en la dinámica familiar.",
    "Incorporar herramientas de acompañamiento y orientación."
  ];

objetivos.forEach((objetivo) => {

  const item =
    document.createElement("li");

  item.textContent =
    objetivo;

  objetivosLista.appendChild(item);

});


  /* =======================================================
     ENLACES
  ======================================================== */

configurarEnlace(
  enlaceCuadernillo,
  encuentro.cuadernillo
);

configurarEnlace(
  enlacePresentacion,
  encuentro.presentacion
);

configurarEnlace(
  enlaceRecursos,
  encuentro.recursos
);

configurarEnlace(
  enlaceActividad,
  encuentro.actividad
);

configurarEnlace(
  enlaceConsulta,
  obtenerLinkConsulta(encuentroId)
);


  /* =======================================================
     TÍTULO DE LA PESTAÑA
  ======================================================== */

  document.title =
    `${encuentro.titulo} | Escuela para Padres FALCO®`;


  /* =======================================================
     MODAL DE FINALIZACIÓN
  ======================================================== */

  const modal = document.getElementById(
    "modalFinalizarEncuentro"
  );

  const btnFinalizar = document.getElementById(
    "btnFinalizarEncuentro"
  );

  const btnCancelar = document.getElementById(
    "btnCancelarFinalizacion"
  );

  const btnConfirmar = document.getElementById(
    "btnConfirmarFinalizacion"
  );

  btnFinalizar.addEventListener("click", () => {

    modal.classList.add("activo");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "modal-abierto"
    );

  });

  btnCancelar.addEventListener(
    "click",
    cerrarModal
  );

  document
    .querySelectorAll("[data-cerrar-modal]")
    .forEach((elemento) => {

      elemento.addEventListener(
        "click",
        cerrarModal
      );

    });

  btnConfirmar.addEventListener("click", async () => {

 await EscuelaProgressEngine.marcarCompletado(
  encuentroId
);

  estado.textContent = "Completado";

  estado.classList.remove(
    "disponible",
    "bloqueado"
  );

  estado.classList.add(
    "completado"
  );

  actualizarProgreso(100);

  btnFinalizar.textContent =
    "Encuentro completado";

  btnFinalizar.disabled = true;

  console.log(
    EscuelaProgressEngine.getState()
  );

  cerrarModal();

});


  /* =======================================================
     VIDEO VISTO
  ======================================================== */

  const btnMarcarVideo = document.getElementById(
    "btnMarcarVideo"
  );

  btnMarcarVideo.addEventListener("click", () => {

    btnMarcarVideo.textContent =
      "Video visto";

    btnMarcarVideo.disabled = true;

    actualizarProgreso(40);

  });


  /* =======================================================
     MOSTRAR PÁGINA
  ======================================================== */

  setTimeout(() => {

    loader.classList.add("oculto");

  }, 300);


  /* =======================================================
     FUNCIONES
  ======================================================== */

  function configurarEnlace(
    elemento,
    url
  ) {

    if (
      !url ||
      url === "#"
    ) {

      elemento.href = "#";

      elemento.classList.add(
        "disabled"
      );

      elemento.setAttribute(
        "aria-disabled",
        "true"
      );

      elemento.addEventListener(
        "click",
        (evento) => {

          evento.preventDefault();

        }
      );

      return;
    }

    elemento.href = url;

  }


  function actualizarProgreso(
    porcentaje
  ) {

    const texto = document.getElementById(
      "encuentroPorcentaje"
    );

    const barra = document.getElementById(
      "encuentroProgresoBarra"
    );

    texto.textContent =
      `${porcentaje}%`;

    barra.style.width =
      `${porcentaje}%`;

  }


 function cerrarModal() {

  if (
    document.activeElement &&
    modal.contains(document.activeElement)
  ) {
    document.activeElement.blur();
  }

  modal.classList.remove(
    "activo"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-abierto"
  );

  btnFinalizar.focus();

}


 function mostrarError(
  mensaje
) {

  loader.classList.add(
    "oculto"
  );

  errorMensaje.textContent =
    mensaje;

  error.hidden = false;

}


/* =======================================================
   CONSULTA DEL ENCUENTRO POR WHATSAPP
======================================================= */

function obtenerLinkConsulta(numero) {

  const encuentro =
    encuentros[numero];

  const titulo =
    encuentro?.titulo ||
    `Encuentro ${numero}`;

  const mensaje =
`Hola, soy participante de la Escuela para Padres FALCO®.

Encuentro: ${numero} - ${titulo}

Mi consulta es:
`;

  return `https://wa.me/5491132049521?text=${encodeURIComponent(
    mensaje
  )}`;

}


});