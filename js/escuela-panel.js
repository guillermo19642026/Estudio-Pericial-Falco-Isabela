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
        <p>Comunicate con la administración.</p>
      </div>
    `;

    return;

  }


  const datos = snap.data();


  for (let i = 1; i <= 8; i++) {

    const habilitado = datos[`modulo${i}`];


    contenedor.innerHTML += `

      <div class="consultoria-card ${habilitado ? "modulo-disponible" : "modulo-bloqueado"}">

        <h3>Encuentro ${i}</h3>

        <p>${obtenerTitulo(i)}</p>

        ${
          habilitado
          ?
          `
         <div class="modulo-acciones">

  <a href="escuela/modulo${i}/cuadernillo.pdf" class="btn-principal" target="_blank">
    Cuadernillo
  </a>

  <a href="escuela/modulo${i}/actividad.pdf" class="btn-secundario" target="_blank">
    Actividad
  </a>

  <a href="escuela/modulo${i}/presentacion.pptx" class="btn-secundario" target="_blank">
    Presentación
  </a>

</div>

          </div>
          `
          :
          `
          <p>Se habilitará próximamente.</p>
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