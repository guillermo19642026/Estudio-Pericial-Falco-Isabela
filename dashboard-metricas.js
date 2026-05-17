import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function actualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

onSnapshot(collection(db, "resultados_tests"), (snapshot) => {
  actualizarTexto("totalResultados", snapshot.size);
});

onSnapshot(collection(db, "postulaciones"), (snapshot) => {
  actualizarTexto("totalPostulaciones", snapshot.size);

  let pendientes = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if ((data.estado || "pendiente") === "pendiente") {
      pendientes++;
    }
  });

  actualizarTexto("badgePostulacionesPendientes", `${pendientes} pendientes`);
});

onSnapshot(collection(db, "mesa_entrada"), (snapshot) => {
  actualizarTexto("totalMesaEntrada", snapshot.size);

  let pendientes = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if ((data.estado || "recibido") === "recibido") {
      pendientes++;
    }
  });

  actualizarTexto("badgeMesaPendientes", `${pendientes} pendientes`);
});