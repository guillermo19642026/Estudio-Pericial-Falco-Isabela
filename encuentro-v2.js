/* =========================================================
   ENCUENTRO V2
   Escuela para Padres FALCO®
   Carga inicial sin Firebase
========================================================= */



import EscuelaProgressEngine
  from "./escuela-progress-engine.js";

  window.EscuelaProgressEngine =
  EscuelaProgressEngine;

import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";



document.addEventListener("DOMContentLoaded", async () => {

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

if (!encuentroId) {

  mostrarError(
    "El encuentro solicitado no existe o el enlace no es válido."
  );

  return;
}


  /* =======================================================
     CARGAR DATOS
  ======================================================== */

  const referenciaEncuentro = doc(
  db,
  "escuela_encuentros",
  `modulo${encuentroId}`
);

const documentoEncuentro = await getDoc(
  referenciaEncuentro
);

if (!documentoEncuentro.exists()) {

  mostrarError(
    "El encuentro solicitado no está disponible."
  );

  return;
}

const encuentro = {
  numero: encuentroId,
  ...documentoEncuentro.data()
};

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


const contenedorVideo =
  document.getElementById(
    "encuentroVideoContenedor"
  );

/* =======================================================
   CONTENIDO AUDIOVISUAL DEL ENCUENTRO
======================================================= */

/* =======================================================
   CONTENIDO AUDIOVISUAL DEL ENCUENTRO
======================================================= */

if (encuentroId === 1) {

  contenedorVideo.innerHTML = `

    <iframe
      src="./FALCO-LEARNING/index.html?curso=escuela-padres&modulo=${encuentroId}"
      title="Experiencia audiovisual - ${encuentro.titulo}"
      class="encuentro-falco-lx-frame"
      allow="
        autoplay;
        fullscreen;
        picture-in-picture
      "
      
      loading="eager">
    </iframe>

  `;

} else if (
  encuentro.video &&
  encuentro.videoUrl
) {

  const videoEmbed =
    obtenerVideoEmbed(
      encuentro.videoUrl
    );

  if (videoEmbed) {

    contenedorVideo.innerHTML = `

      <iframe
        src="${videoEmbed}"
        title="${encuentro.titulo}"
        width="100%"
        height="100%"
        style="
          width: 100%;
          min-height: 420px;
          border: 0;
          display: block;
        "
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin">
      </iframe>

    `;

  }

}


actividadTitulo.textContent =
  encuentro.actividadTitulo ||
  `Actividad práctica del Encuentro ${encuentroId}`;

actividadDescripcion.textContent =
  encuentro.actividadDescripcion ||
  "Propuesta práctica destinada a reflexionar e integrar los contenidos desarrollados durante el encuentro.";

objetivosLista.innerHTML = "";

let objetivos = [];

if (Array.isArray(encuentro.objetivos)) {

  objetivos = encuentro.objetivos;

} else if (
  typeof encuentro.objetivos === "string" &&
  encuentro.objetivos.trim()
) {

  objetivos = encuentro.objetivos
    .split(/\n|;/)
    .map((objetivo) => objetivo.trim())
    .filter(Boolean);

}

if (!objetivos.length) {

  objetivos = [
    "Comprender los contenidos principales del encuentro.",
    "Reflexionar sobre su aplicación en la dinámica familiar.",
    "Incorporar herramientas de acompañamiento y orientación."
  ];

}

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
  encuentro.cuadernilloUrl,
  encuentro.cuadernillo
);

configurarEnlace(
  enlacePresentacion,
  encuentro.presentacionUrl,
  encuentro.presentacion
);

configurarEnlace(
  enlaceRecursos,
  encuentro.recursosUrl,
  encuentro.recursos
);

configurarEnlace(
  enlaceActividad,
  encuentro.actividadUrl,
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

function obtenerVideoEmbed(url) {

  if (!url) {
    return "";
  }

  try {

    const enlace = new URL(url);

    if (enlace.hostname.includes("youtu.be")) {

      const videoId =
        enlace.pathname.replace("/", "");

      return `https://www.youtube.com/embed/${videoId}`;

    }

    if (enlace.hostname.includes("youtube.com")) {

      if (enlace.pathname.includes("/embed/")) {
        return url;
      }

      const videoId =
        enlace.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

    }

    return url;

  } catch (error) {

    console.warn(
      "URL de video no válida:",
      url
    );

    return "";

  }

}


function configurarEnlace(
  elemento,
  url,
  habilitado = true
) {

  if (
    !habilitado ||
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

  elemento.classList.remove(
    "disabled"
  );

  elemento.removeAttribute(
    "aria-disabled"
  );

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