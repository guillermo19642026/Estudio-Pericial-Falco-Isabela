import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_EMAIL = "estudiopericialpsicologico@gmail.com";

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  error.textContent = "";

  if (!email || !password) {
    error.textContent = "Ingresá correo y contraseña.";
    return;
  }

  try {
    const credencial = await signInWithEmailAndPassword(auth, email, password);
    const user = credencial.user;

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    const dataUsuario = snap.exists() ? snap.data() : {};

    const rol =
      user.email === ADMIN_EMAIL
        ? "admin"
        : (dataUsuario.rol || "");

    if (
      rol === "biblioteca" ||
      rol === "admin" ||
      rol === "perito"
    ) {
      window.location.href = "biblioteca-falco.html";
    } else {
      error.textContent = "No tenés autorización para ingresar a Biblioteca Falco®.";
    }

  } catch (e) {
    error.textContent = "Correo o contraseña incorrectos.";
  }
};