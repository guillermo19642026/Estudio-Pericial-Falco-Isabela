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

    if (r.usuarioEmail !== user.email) return;

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
});

function marcarEstado(id, completado) {
  const span = document.getElementById(id);

  if (!span) return;

  span.textContent = completado ? "Completado" : "Pendiente";
  span.className = completado ? "estado-completado" : "estado-pendiente";
}