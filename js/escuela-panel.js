import { auth, db } from "../firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const contenedor = document.getElementById("contenedorModulos");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const btnAdminComentarios =
  document.getElementById("btnAdminComentarios");

const nombreParticipante = document.getElementById("nombreParticipante");
const textoProgreso = document.getElementById("textoProgreso");
const barraProgreso = document.getElementById("barraProgreso");

const textoFinal = document.getElementById("textoFinal");
const btnFinal = document.getElementById("btnFinal");

const modalEncuentro = document.getElementById("modalEncuentro");
const modalTitulo = document.getElementById("modalTitulo");
const valoracionEncuentro = document.getElementById("valoracionEncuentro");
const comentarioEncuentro = document.getElementById("comentarioEncuentro");

let encuentroSeleccionado = null;



btnCerrarSesion.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "escuela-login.html";
});


onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "escuela-login.html";
    return;
  }

  nombreParticipante.textContent = user.email;


const administradores = [
  "estudiopericialpsicologico@gmail.com",
  "isabelafalco@hotmail.com"
];

if (
  btnAdminComentarios &&
  administradores.includes(user.email)
) {
  btnAdminComentarios.style.display = "inline-flex";
}



  const ref = doc(db, "escuela_participantes", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    contenedor.innerHTML = `
      <div class="consultoria-card">
        <h3>Sin acceso asignado</h3>
        <p>
          Tu acceso aún no fue habilitado.
          Si considerás que se trata de un error, comunicate con la coordinación de la Escuela para Padres FALCO®.
        </p>
      </div>
    `;
    return;
  }

  const datos = snap.data();

let encuentrosCompletados = 0;

for (let i = 1; i <= 8; i++) {
  if (datos[`completado${i}`]) {
    encuentrosCompletados++;
  }
}

const porcentajeProgreso = (encuentrosCompletados / 8) * 100;

textoProgreso.textContent =
`${encuentrosCompletados} de 8 encuentros completados (${Math.round(porcentajeProgreso)}%)`;


barraProgreso.style.width = `${porcentajeProgreso}%`;

if (
  encuentrosCompletados === 8 &&
  textoFinal &&
  btnFinal
) {

  textoFinal.textContent =
    "Felicitaciones. Completaste los ocho encuentros de la Escuela para Padres FALCO®. Ya podés realizar la encuesta final y descargar tu certificación.";

  btnFinal.textContent = "⭐ Encuesta y Certificación";
 btnFinal.href = "encuesta-certificacion.html";

  btnFinal.classList.remove("disabled-link");
  btnFinal.classList.remove("btn-secundario");
  btnFinal.classList.add("btn-principal");
}



  contenedor.innerHTML = "";

  for (let i = 1; i <= 8; i++) {

    const habilitado = datos[`modulo${i}`];


    const completado = datos[`completado${i}`];

    contenedor.innerHTML += `

      <div class="consultoria-card ${habilitado ? "modulo-disponible" : "modulo-bloqueado"}">

        <span class="modulo-numero">
          Encuentro ${i} de 8
        </span>

       <p class="estado-modulo ${completado ? "estado-completado" : habilitado ? "estado-disponible" : "estado-bloqueado"}">
  ${completado ? "✅ Completado" : habilitado ? "🟢 Disponible" : "🔒 Próximamente"}
</p>

        <h3>Módulo ${i}</h3>

        <p>${obtenerTitulo(i)}</p>

        ${
          habilitado
          ?
          `
          <div class="modulo-acciones">

            <a href="${obtenerVideo(i)}"
               class="btn-principal"
               target="_blank">

              ▶️ Ver video del encuentro

            </a>

            <a href="escuela/modulo${i}/cuadernillo.pdf"
               class="btn-secundario"
               target="_blank">

              📖 Acceso al cuadernillo

            </a>

            <a href="escuela/modulo${i}/actividad.pdf"
               class="btn-secundario"
               target="_blank">

              ✏️ Actividad del encuentro

            </a>

            <a href="escuela/modulo${i}/presentacion.pptx"
   class="btn-secundario"
   target="_blank">

  🖥️ Presentación del encuentro

</a>

<a href="escuela/modulo${i}/recursos.pdf"
   class="btn-secundario"
   target="_blank">

   📎 Recursos adicionales

</a>

<a href="${obtenerLinkConsulta(i)}"
   class="btn-secundario"
   target="_blank"
   rel="noopener noreferrer">

   💬 Consultar a la Lic. Isabela Falco

</a>

<p class="consulta-modulo">
  Las consultas de este encuentro serán respondidas dentro de las 48 horas hábiles.
</p>




<button
  class="${completado ? "btn-completado" : "btn-secundario"}"
  onclick="marcarCompletado(${i})"
  ${completado ? "disabled" : ""}>

  ${completado ? "✅ Encuentro completado" : "📝 Finalizar encuentro y dejar comentario"}

</button>



          </div>
          `
          :
          `
          <p class="texto-bloqueado">
            🔒 Este encuentro se habilitará próximamente.
          </p>
          `
        }

      </div>

    `;
  }

});


function obtenerTitulo(numero) {

  const modulos = {
    1: "Comprender la adolescencia",
    2: "Comunicación efectiva",
    3: "Emociones y autoestima",
    4: "Identidad y pertenencia",
    5: "Redes sociales y tecnología",
    6: "Límites saludables",
    7: "Salud mental adolescente",
    8: "Proyecto de vida y cierre"
  };

  return modulos[numero];

}


function obtenerVideo(numero) {

  const videos = {
    1: "https://youtu.be/WCho7jEDE04",
    2: "https://youtu.be/OKk_VZ9UIG8",
    3: "https://youtu.be/dyOhU4rP8Do",
    4: "#",
    5: "#",
    6: "#",
    7: "#",
    8: "#"
  };

  return videos[numero];

}

function obtenerLinkConsulta(numero) {

  const titulo = obtenerTitulo(numero);

  return `https://wa.me/5491132049521?text=${encodeURIComponent(
`Hola, soy participante de la Escuela para Padres FALCO®.

Encuentro: ${numero} - ${titulo}

Mi consulta es:
`
  )}`;

}





window.marcarCompletado = function(numero) {

  encuentroSeleccionado = numero;

  modalTitulo.textContent = `Finalizar Encuentro ${numero}`;

  valoracionEncuentro.value = "";
  comentarioEncuentro.value = "";

  modalEncuentro.classList.add("activo");

};


window.cerrarModalEncuentro = function() {
  modalEncuentro.classList.remove("activo");
};


window.enviarEncuestaEncuentro = async function() {

  const user = auth.currentUser;

  if (!user || !encuentroSeleccionado) return;

  const valoracion = valoracionEncuentro.value;
  const comentario = comentarioEncuentro.value.trim();

  if (!valoracion) {
    alert("Por favor seleccioná una valoración.");
    return;
  }

  if (!comentario) {
    alert("Por favor escribí un comentario breve.");
    return;
  }

  const ref = doc(db, "escuela_participantes", user.uid);

  await updateDoc(ref, {
    [`completado${encuentroSeleccionado}`]: true,
    [`encuestaModulo${encuentroSeleccionado}`]: {
      valoracion: valoracion,
      comentario: comentario,
      fecha: new Date().toISOString()
    }
  });

  alert(
`¡Felicitaciones!

Has completado el Encuentro ${encuentroSeleccionado} de la Escuela para Padres FALCO®.

Tu comentario ha sido registrado correctamente.

Te invitamos a continuar con el siguiente encuentro de tu recorrido formativo.`
);

  location.reload();

};
