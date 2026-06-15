import { auth, db } from "../firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
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


  let encuentrosHabilitados = 0;

for (let i = 1; i <= 8; i++) {
  if (datos[`modulo${i}`]) {
    encuentrosHabilitados++;
  }
}

const porcentajeProgreso = (encuentrosHabilitados / 8) * 100;

textoProgreso.textContent = `${encuentrosHabilitados} de 8 encuentros habilitados`;
barraProgreso.style.width = `${porcentajeProgreso}%`;






for (let i = 1; i <= 8; i++) {

  const habilitado = datos[`modulo${i}`];

  contenedor.innerHTML += `

    <div class="consultoria-card ${habilitado ? "modulo-disponible" : "modulo-bloqueado"}">

      
<span class="modulo-numero">
  Encuentro ${i} de 8
</span>


<p class="estado-modulo ${habilitado ? "estado-disponible" : "estado-bloqueado"}">
  ${habilitado ? "🟢 Disponible" : "🔒 Próximamente"}
</p>



<h3>Módulo ${i}</h3>

<p>${obtenerTitulo(i)}</p>

      ${
        habilitado
        ?
        `
        <div class="modulo-acciones">

          <a href="escuela/modulo${i}/cuadernillo.pdf"
             class="btn-principal"
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