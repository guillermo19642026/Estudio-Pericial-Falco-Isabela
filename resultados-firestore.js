console.log("✅ resultados-firestore.js cargado");


import { auth, db } from "./firebase-config.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.guardarResultadoTest = async function (datos) {


console.log("✅ guardarResultadoTest ejecutado", datos);
alert("Intentando guardar test...");


  const user = auth.currentUser;

  if (!user) {
    alert("Debe iniciar sesión.");
    return false;
  }

  try {

    const nombreTest = datos.test || "test";

    const ref = doc(
      db,
      "resultados_tests",
      `${user.uid}_${nombreTest}`
    );

    const existe = await getDoc(ref);

    if (existe.exists()) {

      alert(
        "Usted ya realizó este test. No puede completarlo nuevamente."
      );

      return false;
    }

    await setDoc(ref, {
      ...datos,
      usuarioEmail: user.email,
      usuarioUID: user.uid,
      creadoEn: serverTimestamp()
    });

    console.log("Resultado guardado correctamente.");

    return true;

  } catch (error) {

    console.error(
      "Error al guardar resultado:",
      error
    );

    return false;
  }
};