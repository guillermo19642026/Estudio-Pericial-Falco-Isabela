import { auth, db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.guardarResultadoTest = async function (datos) {
  const user = auth.currentUser;

 if (!user) {

  console.warn("No hay usuario logueado. Guardando como periciado.");

  await addDoc(collection(db, "resultados_tests"), {
    ...datos,
    usuarioEmail: "periciado",
    usuarioUID: "periciado",
    creadoEn: serverTimestamp()
  });

  return;
}

  try {
    await addDoc(collection(db, "resultados_tests"), {
      ...datos,
      usuarioEmail: user.email,
      usuarioUID: user.uid,
      creadoEn: serverTimestamp()
    });

    console.log("Resultado guardado correctamente.");
  } catch (error) {
    console.error("Error al guardar resultado:", error);
  }
};