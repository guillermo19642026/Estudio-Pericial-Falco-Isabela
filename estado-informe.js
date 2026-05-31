import { auth, db } from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const refUsuario = doc(db, "usuarios", user.uid);
  const snapUsuario = await getDoc(refUsuario);

  if (!snapUsuario.exists()) {
    console.warn("No existe documento del usuario.");
    return;
  }

  const dataUsuario = snapUsuario.data();
  const dniUsuario = String(dataUsuario.dni || "").trim();

  if (!dniUsuario) {
    console.warn("Este usuario no tiene DNI cargado en usuarios.");
    return;
  }

  const snapshot = await getDocs(collection(db, "resultados_tests"));

  const tests = {
    scl: false,
    bdi: false,
    bai: false,
    desesperanza: false
  };

  snapshot.forEach((doc) => {
    const r = doc.data();

    const dniResultado = String(r.dni || "").trim();

    if (dniResultado !== dniUsuario) return;

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