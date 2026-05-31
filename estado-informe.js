import { auth, db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;




  const snapshot = await getDocs(collection(db, "resultados_tests"));

  const tests = {
    scl: false,
    bdi: false,
    bai: false,
    desesperanza: false
  };

  snapshot.forEach((doc) => {
    const r = doc.data();

    const uidResultado = r.usuarioUID || "";


const uidResultado = r.usuarioUID || "";
const emailResultado = (r.usuarioEmail || "").toLowerCase();
const emailUsuario = (user.email || "").toLowerCase();

console.log("UID RESULTADO:", uidResultado);
console.log("UID USUARIO:", user.uid);
console.log("EMAIL RESULTADO:", emailResultado);
console.log("EMAIL USUARIO:", emailUsuario);
console.log("TEST:", r.test);

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