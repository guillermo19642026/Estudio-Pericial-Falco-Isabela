import { auth, db } from "../firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const contenedor = document.getElementById("contenedorComentarios");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "escuela-login.html";
    return;
  }

  contenedor.innerHTML = "";

  const participantesRef = collection(db, "escuela_participantes");
  const snapshot = await getDocs(participantesRef);

  snapshot.forEach((docu) => {

    const datos = docu.data();

    let comentariosHTML = "";

    for (let i = 1; i <= 8; i++) {

      const encuesta = datos[`encuestaModulo${i}`];

      if (encuesta) {
        comentariosHTML += `
          <div class="comentario-modulo">
            <strong>Encuentro ${i}</strong>

            <p>
              Valoración:
              ${"⭐".repeat(Number(encuesta.valoracion || 0))}
            </p>

            <p>
              "${encuesta.comentario || ""}"
            </p>

            <small>
              ${encuesta.fecha || ""}
            </small>
          </div>
        `;
      }
    }

    if (comentariosHTML) {

      contenedor.innerHTML += `
        <div class="consultoria-card">

          <h3>${datos.nombre || "Participante"}</h3>

          <p>
            <strong>Email:</strong> ${datos.email || "Sin email registrado"}
          </p>

          ${comentariosHTML}

        </div>
      `;
    }

  });

  if (contenedor.innerHTML.trim() === "") {
    contenedor.innerHTML = `
      <div class="consultoria-card">
        <h3>Sin comentarios todavía</h3>
        <p>
          Aún no hay devoluciones cargadas por los participantes.
        </p>
      </div>
    `;
  }

});