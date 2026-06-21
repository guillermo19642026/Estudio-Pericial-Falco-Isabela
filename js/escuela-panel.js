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
const nombreParticipante = document.getElementById("nombreParticipante");
const textoProgreso = document.getElementById("textoProgreso");
const barraProgreso = document.getElementById("barraProgreso");



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

textoProgreso.textContent = `${encuentrosCompletados} de 8 encuentros completados`;
barraProgreso.style.width = `${porcentajeProgreso}%`;


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

<button
  class="${completado ? "btn-completado" : "btn-secundario"}"
  onclick="marcarCompletado(${i})"
  ${completado ? "disabled" : ""}>

  ${completado ? "✅ Encuentro completado" : "✅ Marcar encuentro como completado"}

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
    1: "https://youtu.be/xzTQl6WaOwk",
    2: "#",
    3: "#",
    4: "#",
    5: "#",
    6: "#",
    7: "#",
    8: "#"
  };

  return videos[numero];

}



window.marcarCompletado = async function(numero) {

  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "escuela_participantes", user.uid);

  await updateDoc(ref, {
    [`completado${numero}`]: true
  });

  alert(`Encuentro ${numero} marcado como completado.`);

  location.reload();

};