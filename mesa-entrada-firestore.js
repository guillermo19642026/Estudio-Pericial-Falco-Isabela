import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.guardarMesaEntrada = async function(event) {
  event.preventDefault();

  const estado = document.getElementById("mesa_estado");

  const datos = {
    tipo: document.getElementById("mesa_tipo").value,
    nombre: document.getElementById("mesa_nombre").value.trim(),
    email: document.getElementById("mesa_email").value.trim(),
    telefono: document.getElementById("mesa_telefono").value.trim(),
    caratula: document.getElementById("mesa_caratula").value.trim(),
    documentos: document.getElementById("mesa_documentos").value.trim(),
    mensaje: document.getElementById("mesa_mensaje").value.trim(),
    estado: "recibido",
    creadoEn: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "mesa_entrada"), datos);

    estado.textContent = "Presentación registrada correctamente.";
    estado.className = "post-estado ok";

    event.target.reset();

  } catch (error) {
    console.error(error);

    estado.textContent = "No se pudo registrar la presentación.";
    estado.className = "post-estado error";
  }
};