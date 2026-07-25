/* =========================================================
   ESCUELA PARA PADRES FALCO®
   PANEL DEL PARTICIPANTE V2.0
========================================================= */

import {
  auth,
  db
} from "./firebase-config.js";


import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


/* =========================================================
   ELEMENTOS DEL DOCUMENTO
========================================================= */

const contenedor =
  document.getElementById("contenedorModulos");

const btnCerrarSesion =
  document.getElementById("btnCerrarSesion");

const btnAdminComentarios =
  document.getElementById("btnAdminComentarios");

const nombreParticipante =
  document.getElementById("nombreParticipante");

const textoProgreso =
  document.getElementById("textoProgreso");

const barraProgreso =
  document.getElementById("barraProgreso");

const textoFinal =
  document.getElementById("textoFinal");

const btnFinal =
  document.getElementById("btnFinal");

const modalEncuentro =
  document.getElementById("modalEncuentro");

const modalTitulo =
  document.getElementById("modalTitulo");

const valoracionEncuentro =
  document.getElementById("valoracionEncuentro");

const comentarioEncuentro =
  document.getElementById("comentarioEncuentro");


/* =========================================================
   ESTADO
========================================================= */

let encuentroSeleccionado = null;


/* =========================================================
   ADMINISTRADORES
========================================================= */

const administradores = [
  "estudiopericialpsicologico@gmail.com",
  "isabelafalco@hotmail.com"
];


/* =========================================================
   INFORMACIÓN DE LOS ENCUENTROS
========================================================= */

const encuentros = {

  1: {
    titulo: "Comprender la adolescencia",

    descripcion:
      "Una introducción a los cambios físicos, emocionales, psicológicos y vinculares propios de la adolescencia.",

    video:
      "https://youtu.be/WCho7jEDE04"
  },

  2: {
    titulo: "Comunicación efectiva",

    descripcion:
      "Herramientas para escuchar, comprender y construir una comunicación familiar más clara y respetuosa.",

    video:
      "https://youtu.be/OKk_VZ9UIG8"
  },

  3: {
    titulo: "Emociones y autoestima",

    descripcion:
      "Recursos para acompañar la expresión emocional y favorecer una autoestima saludable durante la adolescencia.",

    video:
      "https://youtu.be/dyOhU4rP8Do"
  },

  4: {
    titulo: "Identidad y pertenencia",

    descripcion:
      "Un recorrido por la construcción de la identidad, los grupos de pertenencia y la necesidad de autonomía.",

    video: null
  },

  5: {
    titulo: "Redes sociales y tecnología",

    descripcion:
      "Orientaciones para acompañar el uso de pantallas, redes sociales y entornos digitales de manera responsable.",

    video: null
  },

  6: {
    titulo: "Límites saludables",

    descripcion:
      "Criterios para establecer límites claros, consistentes y respetuosos sin deteriorar el vínculo familiar.",

    video: null
  },

  7: {
    titulo: "Salud mental adolescente",

    descripcion:
      "Indicadores para reconocer cambios emocionales, situaciones de riesgo y momentos en los que conviene consultar.",

    video: null
  },

  8: {
    titulo: "Proyecto de vida y cierre",

    descripcion:
      "Integración de los aprendizajes y acompañamiento del adolescente en la construcción de su proyecto personal.",

    video: null
  }

};


/* =========================================================
   CIERRE DE SESIÓN
========================================================= */

if (btnCerrarSesion) {

  btnCerrarSesion.addEventListener(
    "click",
    cerrarSesion
  );

}


async function cerrarSesion() {

  try {

    await signOut(auth);

    window.location.href =
      "escuela-login.html";

  } catch (error) {

    console.error(
      "Error al cerrar sesión:",
      error
    );

    alert(
      "No fue posible cerrar la sesión. Intentá nuevamente."
    );

  }

}


/* =========================================================
   AUTENTICACIÓN
========================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "escuela-login.html";

      return;

    }

    mostrarNombreParticipante(user);

    configurarAccesoAdministrador(user);

    await cargarParticipante(user);

  }
);


/* =========================================================
   MOSTRAR PARTICIPANTE
========================================================= */

function mostrarNombreParticipante(user) {

  if (!nombreParticipante) return;

  nombreParticipante.textContent =
    user.displayName ||
    user.email ||
    "Participante";

}


/* =========================================================
   ACCESO ADMINISTRADOR
========================================================= */

function configurarAccesoAdministrador(user) {

  if (!btnAdminComentarios) return;

  const email =
    String(user.email || "")
      .toLowerCase()
      .trim();

  if (administradores.includes(email)) {

    btnAdminComentarios.style.display =
      "inline-flex";

  } else {

    btnAdminComentarios.style.display =
      "none";

  }

}


/* =========================================================
   CARGAR PARTICIPANTE
========================================================= */

async function cargarParticipante(user) {

  mostrarEstadoCarga();

  try {

    const referencia = doc(
      db,
      "escuela_participantes",
      user.uid
    );

    const resultado =
      await getDoc(referencia);

    if (!resultado.exists()) {

  const emailUsuario =
    String(user.email || "")
      .toLowerCase()
      .trim();

  const esAdministrador =
    administradores.includes(emailUsuario);

  if (esAdministrador) {

    const datosAdministrador = {
      modulo1: true,
      modulo2: true,
      modulo3: true,
      modulo4: true,
      modulo5: true,
      modulo6: true,
      modulo7: true,
      modulo8: true,

      completado1: false,
      completado2: false,
      completado3: false,
      completado4: false,
      completado5: false,
      completado6: false,
      completado7: false,
      completado8: false
    };

    actualizarProgreso(
      datosAdministrador
    );

    renderizarEncuentros(
      datosAdministrador
    );

    return;

  }

  mostrarSinAcceso();

  return;

}

    const datosParticipante =
      resultado.data();

    actualizarProgreso(
      datosParticipante
    );

    renderizarEncuentros(
      datosParticipante
    );

  } catch (error) {

    console.error(
      "Error al cargar el participante:",
      error
    );

    mostrarErrorCarga();

  }

}


/* =========================================================
   ESTADO DE CARGA
========================================================= */

function mostrarEstadoCarga() {

  if (!contenedor) return;

  contenedor.innerHTML = `

    <article class="campus-encuentro">

      <div class="campus-encuentro-contenido">

        <span class="campus-etiqueta">
          Campus Virtual
        </span>

        <h3>
          Cargando tu recorrido formativo…
        </h3>

        <p>
          Estamos recuperando tus encuentros,
          materiales y progreso.
        </p>

      </div>

    </article>

  `;

}


/* =========================================================
   SIN ACCESO ASIGNADO
========================================================= */

function mostrarSinAcceso() {

  if (!contenedor) return;

  contenedor.innerHTML = `

    <article class="campus-encuentro">

      <div class="campus-encuentro-contenido">

        <span class="campus-etiqueta">
          Acceso pendiente
        </span>

        <h3>
          Sin acceso asignado
        </h3>

        <p>
          Tu acceso todavía no fue habilitado.
          Si considerás que se trata de un error,
          comunicate con la coordinación de la
          Escuela para Padres FALCO®.
        </p>

      </div>

      <a
        href="${obtenerLinkConsultaGeneral()}"
        class="campus-btn campus-btn-secundario campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar a la coordinación
      </a>

    </article>

  `;

}


/* =========================================================
   ERROR DE CARGA
========================================================= */

function mostrarErrorCarga() {

  if (!contenedor) return;

  contenedor.innerHTML = `

    <article class="campus-encuentro">

      <div class="campus-encuentro-contenido">

        <span class="campus-etiqueta">
          Error de conexión
        </span>

        <h3>
          No pudimos cargar el Campus
        </h3>

        <p>
          Se produjo un inconveniente al recuperar
          tu recorrido formativo. Revisá tu conexión
          e intentá nuevamente.
        </p>

      </div>

      <button
        type="button"
        class="campus-btn campus-btn-principal campus-btn-ancho"
        onclick="location.reload()"
      >
        Intentar nuevamente
      </button>

    </article>

  `;

}


/* =========================================================
   CALCULAR Y MOSTRAR PROGRESO
========================================================= */

function actualizarProgreso(datos) {

  let encuentrosCompletados = 0;

  for (
    let numero = 1;
    numero <= 8;
    numero++
  ) {

    if (
      datos[`completado${numero}`] === true
    ) {

      encuentrosCompletados++;

    }

  }

  const porcentaje =
    (encuentrosCompletados / 8) * 100;

  const porcentajeRedondeado =
    Math.round(porcentaje);

  if (textoProgreso) {

    textoProgreso.textContent =
      `${encuentrosCompletados} de 8 encuentros completados (${porcentajeRedondeado}%)`;

  }

  if (barraProgreso) {

    barraProgreso.style.width =
      `${porcentaje}%`;

    barraProgreso.setAttribute(
      "aria-valuenow",
      String(porcentajeRedondeado)
    );

  }

  actualizarEtapaFinal(
    encuentrosCompletados
  );

}


/* =========================================================
   ETAPA FINAL Y CERTIFICACIÓN
========================================================= */

function actualizarEtapaFinal(
  encuentrosCompletados
) {

  if (!textoFinal || !btnFinal) return;

  if (encuentrosCompletados === 8) {

    textoFinal.textContent =
      "Felicitaciones. Completaste los ocho encuentros de la Escuela para Padres FALCO®. Ya podés realizar la encuesta final y acceder a tu certificación.";

    btnFinal.textContent =
      "Encuesta y certificación";

    btnFinal.href =
      "encuesta-certificacion.html";

    btnFinal.classList.remove(
      "campus-btn-bloqueado",
      "disabled-link"
    );

    btnFinal.classList.add(
      "campus-btn-principal"
    );

    btnFinal.removeAttribute(
      "aria-disabled"
    );

    btnFinal.removeAttribute(
      "tabindex"
    );

    return;

  }

  textoFinal.textContent =
    `Completá los ocho encuentros para habilitar la encuesta final y la certificación. Actualmente llevás ${encuentrosCompletados} de 8 encuentros.`;

  btnFinal.textContent =
    "Certificación aún no disponible";

  btnFinal.removeAttribute("href");

  btnFinal.classList.remove(
    "campus-btn-principal"
  );

  btnFinal.classList.add(
    "campus-btn-bloqueado",
    "disabled-link"
  );

  btnFinal.setAttribute(
    "aria-disabled",
    "true"
  );

  btnFinal.setAttribute(
    "tabindex",
    "-1"
  );

}


/* =========================================================
   RENDERIZAR LOS OCHO ENCUENTROS
========================================================= */

function renderizarEncuentros(datos) {

  if (!contenedor) return;

  contenedor.innerHTML = "";

  for (
    let numero = 1;
    numero <= 8;
    numero++
  ) {

    const habilitado =
      datos[`modulo${numero}`] === true;

    const completado =
      datos[`completado${numero}`] === true;

    const encuentro =
      encuentros[numero];

    contenedor.insertAdjacentHTML(
      "beforeend",
      crearTarjetaEncuentro({
        numero,
        encuentro,
        habilitado,
        completado
      })
    );

  }

}


/* =========================================================
   CREAR TARJETA DE ENCUENTRO
========================================================= */

function crearTarjetaEncuentro({
  numero,
  encuentro,
  habilitado,
  completado
}) {

  const claseEstado =
    habilitado
      ? "campus-encuentro-activo"
      : "campus-encuentro-bloqueado";

  const estado =
    obtenerEstadoVisual(
      habilitado,
      completado
    );

  return `

    <article
      class="campus-encuentro ${claseEstado}"
      data-encuentro="${numero}"
    >

      <div class="campus-encuentro-superior">

        <span class="campus-encuentro-numero">
          ${String(numero).padStart(2, "0")}
        </span>

        <span class="campus-estado ${estado.clase}">
          ${estado.texto}
        </span>

      </div>

      <div class="campus-encuentro-contenido">

        <span class="campus-card-kicker">
          Encuentro ${numero} de 8
        </span>

        <h3>
          ${encuentro.titulo}
        </h3>

        <p>
          ${encuentro.descripcion}
        </p>

        <div class="campus-encuentro-meta">

          <span>
            Modalidad asincrónica
          </span>

          <span>
            Material descargable
          </span>

          <span>
            Actividad práctica
          </span>

        </div>

      </div>

      ${
        habilitado
          ? crearAccionesEncuentro(
              numero,
              encuentro,
              completado
            )
          : crearEstadoBloqueado()
      }

    </article>

  `;

}


/* =========================================================
   ESTADO VISUAL
========================================================= */

function obtenerEstadoVisual(
  habilitado,
  completado
) {

  if (completado) {

    return {
      texto: "Completado",
      clase: "campus-estado-completado"
    };

  }

  if (habilitado) {

    return {
      texto: "Disponible",
      clase: "campus-estado-disponible"
    };

  }

  return {
    texto: "Próximamente",
    clase: "campus-estado-bloqueado"
  };

}


/* =========================================================
   ACCIONES DE CADA ENCUENTRO
========================================================= */

function crearAccionesEncuentro(
  numero,
  encuentro,
  completado
) {

  return `

    <div class="modulo-acciones">

      ${crearBotonVideo(encuentro)}

      <a
        href="escuela/modulo${numero}/cuadernillo.pdf"
        class="campus-btn campus-btn-secundario campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Acceder al cuadernillo
      </a>

      <a
        href="escuela/modulo${numero}/actividad.pdf"
        class="campus-btn campus-btn-secundario campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Actividad del encuentro
      </a>

      <a
        href="escuela/modulo${numero}/presentacion.pptx"
        class="campus-btn campus-btn-secundario campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Presentación del encuentro
      </a>

      <a
        href="escuela/modulo${numero}/recursos.pdf"
        class="campus-btn campus-btn-secundario campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Recursos adicionales
      </a>

      <a
        href="${obtenerLinkConsulta(numero)}"
        class="campus-btn campus-btn-discreto campus-btn-ancho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Consultar a la Lic. Isabela Falco
      </a>

      <p class="consulta-modulo">
        Las consultas serán respondidas dentro
        de las 48 horas hábiles.
      </p>

      ${
        completado
          ? `
            <button
              type="button"
              class="campus-btn campus-btn-bloqueado campus-btn-ancho"
              disabled
            >
              Encuentro completado
            </button>
          `
          : `
            <button
              type="button"
              class="campus-btn campus-btn-principal campus-btn-ancho"
              onclick="marcarCompletado(${numero})"
            >
              Finalizar encuentro y dejar comentario
            </button>
          `
      }

    </div>

  `;

}


/* =========================================================
   BOTÓN DEL VIDEO
========================================================= */

function crearBotonVideo(encuentro) {

  if (!encuentro.video) {

    return `

      <button
        type="button"
        class="campus-btn campus-btn-bloqueado campus-btn-ancho"
        disabled
        title="El video será actualizado próximamente"
      >
        Video en actualización
      </button>

    `;

  }

  return `

    <a
      href="${encuentro.video}"
      class="campus-btn campus-btn-principal campus-btn-ancho"
      target="_blank"
      rel="noopener noreferrer"
    >
      Ver video del encuentro
    </a>

  `;

}


/* =========================================================
   ENCUENTRO BLOQUEADO
========================================================= */

function crearEstadoBloqueado() {

  return `

    <div class="modulo-acciones">

      <button
        type="button"
        class="campus-btn campus-btn-bloqueado campus-btn-ancho"
        disabled
      >
        Encuentro todavía no habilitado
      </button>

    </div>

  `;

}


/* =========================================================
   CONSULTAS POR WHATSAPP
========================================================= */

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


function obtenerLinkConsultaGeneral() {

  const mensaje =
`Hola. Soy participante de la Escuela para Padres FALCO® y quisiera realizar una consulta sobre mi acceso al Campus Virtual.`;

  return `https://wa.me/5491132049521?text=${encodeURIComponent(
    mensaje
  )}`;

}


/* =========================================================
   ABRIR MODAL DE FINALIZACIÓN
========================================================= */

window.marcarCompletado =
  function(numero) {

    if (!modalEncuentro) return;

    encuentroSeleccionado =
      numero;

    if (modalTitulo) {

      modalTitulo.textContent =
        `Finalizar Encuentro ${numero}`;

    }

    if (valoracionEncuentro) {

      valoracionEncuentro.value = "";

    }

    if (comentarioEncuentro) {

      comentarioEncuentro.value = "";

    }

    modalEncuentro.classList.add(
      "activo"
    );

    modalEncuentro.setAttribute(
      "aria-hidden",
      "false"
    );

  };


/* =========================================================
   CERRAR MODAL
========================================================= */

window.cerrarModalEncuentro =
  function() {

    if (!modalEncuentro) return;

    modalEncuentro.classList.remove(
      "activo"
    );

    modalEncuentro.setAttribute(
      "aria-hidden",
      "true"
    );

    encuentroSeleccionado = null;

  };


/* =========================================================
   CERRAR MODAL AL TOCAR EL FONDO
========================================================= */

if (modalEncuentro) {

  modalEncuentro.addEventListener(
    "click",
    (event) => {

      if (
        event.target === modalEncuentro
      ) {

        window.cerrarModalEncuentro();

      }

    }
  );

}


/* =========================================================
   CERRAR MODAL CON ESCAPE
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      modalEncuentro?.classList.contains("activo")
    ) {

      window.cerrarModalEncuentro();

    }

  }
);


/* =========================================================
   ENVIAR ENCUESTA DEL ENCUENTRO
========================================================= */

window.enviarEncuestaEncuentro =
  async function() {

    const user =
      auth.currentUser;

    if (
      !user ||
      !encuentroSeleccionado
    ) {

      return;

    }

    const valoracion =
      valoracionEncuentro?.value || "";

    const comentario =
      comentarioEncuentro?.value
        ?.trim() || "";

    if (!valoracion) {

      alert(
        "Por favor seleccioná una valoración."
      );

      return;

    }

    if (!comentario) {

      alert(
        "Por favor escribí un comentario breve."
      );

      return;

    }

    const botonEnviar =
      modalEncuentro?.querySelector(
        "[onclick='enviarEncuestaEncuentro()']"
      );

    if (botonEnviar) {

      botonEnviar.disabled = true;

      botonEnviar.textContent =
        "Guardando…";

    }

    try {

      const referencia = doc(
        db,
        "escuela_participantes",
        user.uid
      );

      await updateDoc(
        referencia,
        {

          [`completado${encuentroSeleccionado}`]:
            true,

          [`encuestaModulo${encuentroSeleccionado}`]:
            {

              valoracion,
              comentario,

              fecha:
                new Date().toISOString()

            }

        }
      );

      alert(
`¡Felicitaciones!

Completaste el Encuentro ${encuentroSeleccionado} de la Escuela para Padres FALCO®.

Tu valoración y comentario fueron registrados correctamente.

Podés continuar con el siguiente encuentro de tu recorrido formativo.`
      );

      window.location.reload();

    } catch (error) {

      console.error(
        "Error al finalizar el encuentro:",
        error
      );

      alert(
        "No fue posible registrar el encuentro. Revisá tu conexión e intentá nuevamente."
      );

      if (botonEnviar) {

        botonEnviar.disabled = false;

        botonEnviar.textContent =
          "Enviar y finalizar encuentro";

      }

    }

  };


/* =========================================================
   ESCUELA PARA PADRES FALCO® V2 READY
========================================================= */

console.log(
  "Escuela para Padres FALCO® Panel v2.0 Ready"
);