import { auth, db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const q = query(
  collection(db, "resultados_tests"),
  where("usuarioEmail", "==", user.email)
);

const snapshot = await getDocs(q);

console.log("EMAIL LOGUEADO:", user.email);
console.log("CANTIDAD DE RESULTADOS ENCONTRADOS:", snapshot.size);


  const tests = {
    scl: false,
    bdi: false,
    bai: false,
    desesperanza: false
  };

  snapshot.forEach((doc) => {

console.log("DOCUMENTO:", doc.data());

    const r = doc.data();

    const uidResultado = r.usuarioUID || "";
    const emailResultado = (r.usuarioEmail || "").toLowerCase();
    const emailUsuario = (user.email || "").toLowerCase();

    if (
      uidResultado !== user.uid &&
      emailResultado !== emailUsuario
    ) return;

    const nombreTest = (r.test || "").toLowerCase();

    if (nombreTest.includes("scl") || nombreTest.includes("bsi")) {
      tests.scl = true;
    }

    if (nombreTest.includes("bdi")) {
      tests.bdi = true;
    }

    if (nombreTest.includes("bai")) {
      tests.bai = true;
    }

    if (nombreTest.includes("desesperanza")) {
      tests.desesperanza = true;
    }
  });

  marcarEstado("estadoSCL", tests.scl);
  marcarEstado("estadoBDI", tests.bdi);
  marcarEstado("estadoBAI", tests.bai);
  marcarEstado("estadoDesesperanza", tests.desesperanza);

  const cantidad = Object.values(tests).filter(Boolean).length;

  const bloqueInforme =
    document.getElementById("bloqueInformeDisponible");

  if (bloqueInforme && cantidad >= 3) {
    bloqueInforme.style.display = "block";
  }
});

function marcarEstado(id, completado) {
  const span = document.getElementById(id);

  if (!span) return;

  span.textContent = completado ? "Completado" : "Pendiente";
  span.className = completado ? "estado-completado" : "estado-pendiente";
}