import { db } from "./firebase-config.js";

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function cargarActividad(){

  try{

    // =========================
    // RESULTADOS
    // =========================

    const resultadosQuery = query(
      collection(db, "resultados_tests"),
      orderBy("creadoEn", "desc"),
      limit(1)
    );

    const resultadosSnap =
      await getDocs(resultadosQuery);

    resultadosSnap.forEach(doc => {

      const data = doc.data();

      document.getElementById(
        "actividadResultados"
      ).textContent =
        `Nuevo resultado: ${data.test || "Evaluación"}`;

      if(data.creadoEn){

        const fecha =
          data.creadoEn.toDate();

        document.getElementById(
          "fechaResultados"
        ).textContent =
          fecha.toLocaleString("es-AR");
      }

    });

    // =========================
    // POSTULACIONES
    // =========================

    const postulacionesQuery = query(
      collection(db, "postulaciones"),
      orderBy("creadoEn", "desc"),
      limit(1)
    );

    const postulacionesSnap =
      await getDocs(postulacionesQuery);

    postulacionesSnap.forEach(doc => {

      const data = doc.data();

      document.getElementById(
        "actividadPostulaciones"
      ).textContent =
        `Nueva postulación: ${data.nombre || "Profesional"}`;

      if(data.creadoEn){

        const fecha =
          data.creadoEn.toDate();

        document.getElementById(
          "fechaPostulaciones"
        ).textContent =
          fecha.toLocaleString("es-AR");
      }

    });

    // =========================
    // MESA ENTRADA
    // =========================

    const mesaQuery = query(
      collection(db, "mesa_entrada"),
      orderBy("creadoEn", "desc"),
      limit(1)
    );

    const mesaSnap =
      await getDocs(mesaQuery);

    mesaSnap.forEach(doc => {

      const data = doc.data();

      document.getElementById(
        "actividadMesa"
      ).textContent =
        `Nueva presentación: ${data.nombre || "Ingreso institucional"}`;

      if(data.creadoEn){

        const fecha =
          data.creadoEn.toDate();

        document.getElementById(
          "fechaMesa"
        ).textContent =
          fecha.toLocaleString("es-AR");
      }

    });

  }catch(error){

    console.error(
      "Error actividad:",
      error
    );

  }

}

cargarActividad();