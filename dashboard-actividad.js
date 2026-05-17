import { db } from "./firebase-config.js";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function formatearFecha(timestamp) {
  if (!timestamp || !timestamp.toDate) return "";

  return timestamp.toDate().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}

function setTexto(id, texto) {
  const el = document.getElementById(id);

  if (el) {
    el.textContent = texto;
    el.classList.remove("loading-text");
  }
}



const qResultados = query(
  collection(db, "resultados_tests"),
  orderBy("creadoEn", "desc"),
  limit(1)
);

onSnapshot(qResultados, (snapshot) => {
  if (snapshot.empty) {
    setTexto("actividadResultados", "Sin evaluaciones registradas.");
    setTexto("fechaResultados", "");
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    setTexto("actividadResultados", `Último resultado: ${data.test || "Evaluación"}`);
    setTexto("fechaResultados", formatearFecha(data.creadoEn));
  });
});

const qPostulaciones = query(
  collection(db, "postulaciones"),
  orderBy("creadoEn", "desc"),
  limit(1)
);

onSnapshot(qPostulaciones, (snapshot) => {
  if (snapshot.empty) {
    setTexto("actividadPostulaciones", "Sin postulaciones registradas.");
    setTexto("fechaPostulaciones", "");
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    setTexto("actividadPostulaciones", `Última postulación: ${data.nombre || "Profesional"}`);
    setTexto("fechaPostulaciones", formatearFecha(data.creadoEn));
  });
});

const qMesa = query(
  collection(db, "mesa_entrada"),
  orderBy("creadoEn", "desc"),
  limit(1)
);

onSnapshot(qMesa, (snapshot) => {
  if (snapshot.empty) {
    setTexto("actividadMesa", "Sin presentaciones registradas.");
    setTexto("fechaMesa", "");
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    setTexto("actividadMesa", `Última presentación: ${data.nombre || "Ingreso institucional"}`);
    setTexto("fechaMesa", formatearFecha(data.creadoEn));
  });
});