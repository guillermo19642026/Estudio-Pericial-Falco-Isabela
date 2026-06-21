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

  contenedor.innerHTML = `
    <div class="consultoria-card">
      <h3>Cargando comentarios...</h3>
    </div>
  `;

  try {

    const participantesRef = collection(db, "escuela_participantes");
    const snapshot = await getDocs(participantesRef);

    contenedor.innerHTML = "";

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
            No se encontraron comentarios cargados en los encuentros.
          </p>
        </div>
      `;
    }

  } catch (error) {

    console.error("Error al cargar comentarios:", error);

    contenedor.innerHTML = `
      <div class="consultoria-card">
        <h3>Error al cargar comentarios</h3>
        <p>
          ${error.message}
        </p>
      </div>
    `;

  }

});