import { auth, db } from "../firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const nombreCertificado =
  document.getElementById("nombreCertificado");

const fechaCertificado =
  document.getElementById("fechaCertificado");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "escuela-login.html";
    return;
  }

  const parametros =
    new URLSearchParams(window.location.search);

  const participanteId =
    parametros.get("id");

  if (!participanteId) {
    window.location.href = "escuela-panel-v2.html";
    return;
  }

  const ref = doc(
    db,
    "escuela_participantes",
    participanteId
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("No se encontró la información del participante.");
    window.location.href = "escuela-panel-v2.html";
    return;
  }

  const datos = snap.data();

  let completados = 0;

  for (let i = 1; i <= 8; i++) {

    if (datos[`completado${i}`] === true) {
      completados++;
    }

  }

  if (completados < 8) {

    alert(
      "El certificado se habilita al completar los 8 encuentros."
    );

    window.location.href = "escuela-panel-v2.html";
    return;
  }

  nombreCertificado.textContent =
    datos.nombreCompleto ||
    datos.nombreApellido ||
    datos.nombreYApellido ||
    [datos.nombre, datos.apellido]
      .filter(Boolean)
      .join(" ") ||
    datos.email ||
    datos.correo ||
    "Participante";

  const fecha =
    new Date().toLocaleDateString("es-AR");

  fechaCertificado.textContent = fecha;

  document.body.classList.remove("certificado-cargando");

});