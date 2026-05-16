console.log("POSTULACIONES OK");


import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.guardarPostulacion = async function(event) {
  event.preventDefault();

  const estado = document.getElementById("post_estado");

const datos = {
  nombre: document.getElementById("post_nombre").value.trim(),
  profesion: document.getElementById("post_profesion").value.trim(),
  email: document.getElementById("post_email").value.trim(),
  telefono: document.getElementById("post_telefono").value.trim(),

  mensaje: document.getElementById("post_mensaje").value.trim(),

  cvUrl: document.getElementById("post_cv").value.trim(),

  estado: "pendiente",
  creadoEn: serverTimestamp()
};

  try {
    await addDoc(collection(db, "postulaciones"), datos);

    estado.textContent = "Postulación enviada correctamente.";
    estado.className = "post-estado ok";

    event.target.reset();

  } catch (error) {
    console.error(error);
    estado.textContent = "No se pudo enviar la postulación. Intentá nuevamente.";
    estado.className = "post-estado error";
  }
};