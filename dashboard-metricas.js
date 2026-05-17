import { db } from "./firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function cargarMetricas(){

  try{

    const resultadosSnap =
      await getDocs(collection(db, "resultados_tests"));

    const postulacionesSnap =
      await getDocs(collection(db, "postulaciones"));

    const mesaSnap =
      await getDocs(collection(db, "mesa_entrada"));

    document.getElementById("totalResultados").textContent =
      resultadosSnap.size;

    document.getElementById("totalMesaEntrada").textContent =
      mesaSnap.size;

    document.getElementById("totalPostulaciones").textContent =
      postulacionesSnap.size;

    let postulacionesPendientes = 0;

    postulacionesSnap.forEach(doc => {
      const data = doc.data();
      if ((data.estado || "pendiente") === "pendiente") {
        postulacionesPendientes++;
      }
    });

    let mesaPendientes = 0;

    mesaSnap.forEach(doc => {
      const data = doc.data();
      if ((data.estado || "recibido") === "recibido") {
        mesaPendientes++;
      }
    });

    document.getElementById("badgePostulacionesPendientes").textContent =
      `${postulacionesPendientes} pendientes`;

    document.getElementById("badgeMesaPendientes").textContent =
      `${mesaPendientes} pendientes`;

  }catch(error){
    console.error("Error métricas:", error);
  }
}

cargarMetricas();