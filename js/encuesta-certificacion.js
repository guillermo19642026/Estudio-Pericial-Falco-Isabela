import { auth, db } from "../firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("formEncuesta");
const mensajeFinal = document.getElementById("mensajeFinal");

let usuarioActual = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "escuela-login.html";
    return;
  }

  usuarioActual = user;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!usuarioActual) return;

  await setDoc(doc(db, "encuestas_finales", usuarioActual.uid), {
    email: usuarioActual.email,
    nombre: document.getElementById("nombre").value,
    experiencia: document.getElementById("experiencia").value,
    encuentroUtil: document.getElementById("encuentroUtil").value,
    aprendizaje: document.getElementById("aprendizaje").value,
    recomendaria: document.getElementById("recomendaria").value,
    comentarios: document.getElementById("comentarios").value,
    fecha: serverTimestamp()
  });

  form.style.display = "none";
  mensajeFinal.style.display = "block";
});