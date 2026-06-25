import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("⚙️ Centro Recursos Core cargado");

async function cargarConfiguracion() {
  try {
    const ref = doc(db, "configuracion", "general");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.log("⚠️ No existe configuracion/general");
      return;
    }

    const config = snap.data();

    console.log("⚙️ Configuración del Centro de Recursos:", config);

  } catch (error) {
    console.error("❌ Error cargando configuración:", error);
  }
}

cargarConfiguracion();